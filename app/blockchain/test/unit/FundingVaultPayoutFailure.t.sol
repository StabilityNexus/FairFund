// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {FundingVault} from "../../src/FundingVault.sol";
import {FairFund} from "../../src/FairFund.sol";
import {VotingPowerToken} from "../../src/VotingPowerToken.sol";
import {MockERC20} from "../../src/mocks/MockERC20.sol";

/// @dev Funding token with a blocklist and a global pause, like USDC.
contract BlocklistPausableERC20 is ERC20 {
    mapping(address => bool) public isBlocked;
    bool public paused;

    constructor() ERC20("Blocklist USD", "BUSD") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function setBlocked(address account, bool blocked) external {
        isBlocked[account] = blocked;
    }

    function setPaused(bool p) external {
        paused = p;
    }

    function _update(address from, address to, uint256 value) internal override {
        require(!paused, "Pausable: paused");
        require(!isBlocked[from] && !isBlocked[to], "Blocklistable: account is blacklisted");
        super._update(from, to, value);
    }
}

contract FundingVaultPayoutFailureTest is Test {
    FairFund fairFund;
    FundingVault vault;
    BlocklistPausableERC20 token;
    MockERC20 votingToken;
    VotingPowerToken votingPowerToken;

    address alice = makeAddr("alice");
    address bob = makeAddr("bob");
    address voter1 = makeAddr("voter1");
    address voter2 = makeAddr("voter2");
    address recipient1 = makeAddr("recipient1");
    address recipient2 = makeAddr("recipient2");
    address attacker = makeAddr("attacker");
    address blockedAddr = makeAddr("blockedAddr");

    function setUp() external {
        fairFund = new FairFund(5);
        token = new BlocklistPausableERC20();
        vault = _newVault(address(token));
    }

    function _newVault(address fundingToken) internal returns (FundingVault v) {
        votingToken = new MockERC20("VotingToken", "VTK");
        votingPowerToken = new VotingPowerToken("VotingPowerToken", "VOTE", votingToken.decimals());
        v = new FundingVault(
            fundingToken,
            address(votingToken),
            address(votingPowerToken),
            1,
            50 ether,
            block.timestamp + 1 days,
            address(fairFund)
        );
        votingPowerToken.transferOwnership(address(v));
    }

    function _deposit(address user, uint256 amount) internal {
        token.mint(user, amount);
        vm.startPrank(user);
        token.approve(address(vault), amount);
        vault.deposit(amount);
        vm.stopPrank();
    }

    function _registerAndVote(address voter, uint256 amount, uint256 proposalId) internal {
        votingToken.mint(voter, amount);
        vm.startPrank(voter);
        votingToken.approve(address(vault), amount);
        vault.register(amount);
        votingPowerToken.approve(address(vault), amount);
        vault.voteOnProposal(proposalId, amount);
        vm.stopPrank();
    }

    /// 100 deposited. p1 wins 30 (28.5 after fee). p2 wins 20 (19 after fee). Fee 2.5. 50 left for depositors.
    function _honestRound() internal {
        _deposit(alice, 60 ether);
        _deposit(bob, 40 ether);
        vault.submitProposal("p1", 1 ether, 30 ether, recipient1);
        vault.submitProposal("p2", 1 ether, 20 ether, recipient2);
        _registerAndVote(voter1, 10 ether, 1);
        _registerAndVote(voter2, 10 ether, 2);
    }

    function _withdrawBoth() internal {
        vm.prank(alice);
        vault.withdrawRemaining();
        vm.prank(bob);
        vault.withdrawRemaining();
    }

    function test_BlockedWinner_OthersPaid_DepositorsWithdraw_ShareReserved() public {
        _honestRound();
        token.setBlocked(recipient2, true);
        vm.warp(block.timestamp + 2 days);

        vm.expectEmit(address(vault));
        emit FundingVault.PayoutFailed(2, recipient2, 19 ether);
        vault.distributeFunds();

        assertEq(token.balanceOf(recipient1), 28.5 ether);
        assertEq(token.balanceOf(recipient2), 0);
        assertEq(token.balanceOf(address(fairFund)), 2.5 ether);
        assertEq(vault.getPendingPayout(1), 0);
        assertEq(vault.getPendingPayout(2), 19 ether);

        // Depositors get exactly what they get in a normal round.
        _withdrawBoth();
        assertEq(token.balanceOf(alice), 30 ether);
        assertEq(token.balanceOf(bob), 20 ether);
        assertEq(token.balanceOf(address(vault)), 19 ether); // only the reserved payout is left
    }

    function test_RetryPayout_FailsWhileBlocked_SucceedsAfterUnblock() public {
        _honestRound();
        token.setBlocked(recipient2, true);
        vm.warp(block.timestamp + 2 days);
        vault.distributeFunds();

        vm.expectRevert(FundingVault.FundingVault__TransferFailed.selector);
        vault.retryPayout(2);
        assertEq(vault.getPendingPayout(2), 19 ether); // still reserved

        token.setBlocked(recipient2, false);
        vm.prank(attacker); // anyone can trigger it, funds still go to the recipient
        vault.retryPayout(2);
        assertEq(token.balanceOf(recipient2), 19 ether);
        assertEq(vault.getPendingPayout(2), 0);

        vm.expectRevert(FundingVault.FundingVault__NoPendingPayout.selector);
        vault.retryPayout(2);

        _withdrawBoth();
        assertEq(token.balanceOf(address(vault)), 0);
    }

    function test_AttackerBlockedRecipient_NoLongerLocksVault() public {
        token.setBlocked(blockedAddr, true);
        _honestRound();
        vm.prank(attacker);
        uint256 badId = vault.submitProposal("looks normal", 1, 1 ether, blockedAddr);
        _registerAndVote(attacker, 0.001 ether, badId);
        vm.warp(block.timestamp + 2 days);

        vault.distributeFunds();

        assertGt(token.balanceOf(recipient1), 0);
        assertGt(token.balanceOf(recipient2), 0);
        assertGt(vault.getPendingPayout(badId), 0); // only the attacker's own small share is held back
        _withdrawBoth();
        assertGt(token.balanceOf(alice), 0);
        assertGt(token.balanceOf(bob), 0);
    }

    function test_BlockedFeeReceiver_DoesNotLockVault() public {
        _honestRound();
        token.setBlocked(address(fairFund), true);
        vm.warp(block.timestamp + 2 days);

        vault.distributeFunds();
        assertEq(token.balanceOf(recipient1), 28.5 ether);
        assertEq(token.balanceOf(recipient2), 19 ether);
        assertEq(vault.getPendingPlatformFee(), 2.5 ether);
        _withdrawBoth();
        assertEq(token.balanceOf(alice), 30 ether);
        assertEq(token.balanceOf(bob), 20 ether);

        token.setBlocked(address(fairFund), false);
        vault.retryPlatformFee();
        assertEq(token.balanceOf(address(fairFund)), 2.5 ether);
        assertEq(token.balanceOf(address(vault)), 0);
    }

    /// If the token is paused during distribution, every payout fails.
    /// Winners must not lose their share to depositors because of that.
    function test_PausedToken_AllPayoutsReservedAndRecoverable() public {
        _honestRound();
        vm.warp(block.timestamp + 2 days);
        token.setPaused(true);

        vault.distributeFunds();
        assertEq(vault.getPendingPayout(1), 28.5 ether);
        assertEq(vault.getPendingPayout(2), 19 ether);
        assertEq(vault.getPendingPlatformFee(), 2.5 ether);

        token.setPaused(false);
        vault.retryPayout(1);
        vault.retryPayout(2);
        vault.retryPlatformFee();
        _withdrawBoth();

        assertEq(token.balanceOf(recipient1), 28.5 ether);
        assertEq(token.balanceOf(recipient2), 19 ether);
        assertEq(token.balanceOf(address(fairFund)), 2.5 ether);
        assertEq(token.balanceOf(alice), 30 ether);
        assertEq(token.balanceOf(bob), 20 ether);
        assertEq(token.balanceOf(address(vault)), 0);
    }

    /// Tokens that return false instead of reverting are handled the same way.
    function test_TokenReturnsFalse_PayoutReserved() public {
        MockERC20 falseToken = new MockERC20("False", "FLS");
        vault = _newVault(address(falseToken));
        falseToken.mint(alice, 100 ether);
        vm.startPrank(alice);
        falseToken.approve(address(vault), 100 ether);
        vault.deposit(100 ether);
        vm.stopPrank();
        vault.submitProposal("p1", 1 ether, 30 ether, recipient1);
        _registerAndVote(voter1, 10 ether, 1);
        vm.warp(block.timestamp + 2 days);

        falseToken.updateTransferFalseNeeded(true);
        vault.distributeFunds();
        assertEq(vault.getPendingPayout(1), 28.5 ether);
        assertEq(vault.getPendingPlatformFee(), 1.5 ether);

        falseToken.updateTransferFalseNeeded(false);
        vault.retryPayout(1);
        assertEq(falseToken.balanceOf(recipient1), 28.5 ether);
    }

    function test_RetryPayout_NothingPending_Reverts() public {
        vm.expectRevert(FundingVault.FundingVault__NoPendingPayout.selector);
        vault.retryPayout(1);
        vm.expectRevert(FundingVault.FundingVault__NoPendingPayout.selector);
        vault.retryPlatformFee();
    }
}
