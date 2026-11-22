// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {FundingVault} from "../../src/FundingVault.sol";
import {FairFund} from "../../src/FairFund.sol";
import {VotingPowerToken} from "../../src/VotingPowerToken.sol";
import {MockERC20} from "../../src/mocks/MockERC20.sol";

/// If nobody registers voting tokens before the tally date, no proposal can win.
/// distributeFunds must still finish so depositors get their full deposits back.
contract FundingVaultNoVotersTest is Test {
    FairFund fairFund;
    FundingVault vault;
    MockERC20 fundingToken;
    MockERC20 votingToken;
    VotingPowerToken votingPowerToken;

    address alice = makeAddr("alice"); // depositor
    address bob = makeAddr("bob"); // depositor
    address attacker = makeAddr("attacker"); // holds no tokens at all
    address voter = makeAddr("voter");

    uint256 constant ALICE_DEPOSIT = 60 ether;
    uint256 constant BOB_DEPOSIT = 40 ether;

    function setUp() external {
        fairFund = new FairFund(5);
        fundingToken = new MockERC20("FundingToken", "FTK");
        votingToken = new MockERC20("VotingToken", "VTK");
        votingPowerToken = new VotingPowerToken("VotingPowerToken", "VOTE", votingToken.decimals());
        vault = new FundingVault(
            address(fundingToken),
            address(votingToken),
            address(votingPowerToken),
            1,
            50 ether,
            block.timestamp + 1 days,
            address(fairFund)
        );
        votingPowerToken.transferOwnership(address(vault));

        _deposit(alice, ALICE_DEPOSIT);
        _deposit(bob, BOB_DEPOSIT);
    }

    function _deposit(address user, uint256 amount) internal {
        fundingToken.mint(user, amount);
        vm.startPrank(user);
        fundingToken.approve(address(vault), amount);
        vault.deposit(amount);
        vm.stopPrank();
    }

    function _withdrawBothAndCheckFullRefund() internal {
        vm.prank(alice);
        vault.withdrawRemaining();
        vm.prank(bob);
        vault.withdrawRemaining();
        assertEq(fundingToken.balanceOf(alice), ALICE_DEPOSIT);
        assertEq(fundingToken.balanceOf(bob), BOB_DEPOSIT);
        assertEq(fundingToken.balanceOf(address(vault)), 0);
        assertEq(fundingToken.balanceOf(address(fairFund)), 0); // no fee without a winner
    }

    function test_NoProposalsNoVoters_DepositorsWithdrawAll() public {
        vm.warp(block.timestamp + 2 days);
        vault.distributeFunds();
        _withdrawBothAndCheckFullRefund();
    }

    // Before the fix one proposal plus zero registrations locked every deposit forever.
    function test_OneProposalNoVoters_DepositorsWithdrawAll() public {
        vm.prank(attacker);
        vault.submitProposal("any proposal", 1, 1 ether, attacker);
        vm.warp(block.timestamp + 2 days);

        assertEq(vault.calculateFundingToBeReceived(1), 0);
        vault.distributeFunds();
        assertEq(fundingToken.balanceOf(attacker), 0);
        _withdrawBothAndCheckFullRefund();
    }

    function test_ManyProposalsNoVoters_StillWorksYearsLater() public {
        for (uint256 i; i < 5; i++) {
            vm.prank(attacker);
            vault.submitProposal("any proposal", 1, 1 ether, attacker);
        }
        vm.warp(block.timestamp + 3650 days);

        vault.distributeFunds();
        _withdrawBothAndCheckFullRefund();
    }

    // A registration with no vote already worked before the fix. It must keep working.
    function test_OneRegistrationNoVote_DepositorsWithdrawAll() public {
        vm.prank(attacker);
        vault.submitProposal("any proposal", 1, 1 ether, attacker);
        votingToken.mint(voter, 1);
        vm.startPrank(voter);
        votingToken.approve(address(vault), 1);
        vault.register(1);
        vm.stopPrank();
        vm.warp(block.timestamp + 2 days);

        vault.distributeFunds();
        _withdrawBothAndCheckFullRefund();
    }
}
