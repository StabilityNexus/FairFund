// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {FundingVault} from "../../src/FundingVault.sol";
import {FairFund} from "../../src/FairFund.sol";
import {MockERC20} from "../../src/mocks/MockERC20.sol";

/// At block.timestamp == tallyDate the vault must already be closed for deposits, proposals,
/// registration and votes, while release and distribution are open. If both were open in the
/// same second, the same voting tokens could register, vote and be released again and again.
contract FundingVaultTallyBoundaryTest is Test {
    FairFund fairFund;
    FundingVault vault;
    MockERC20 fundingToken;
    MockERC20 votingToken;
    uint256 tally;

    address depositor = makeAddr("depositor");
    address voter = makeAddr("voter");
    address recipient = makeAddr("recipient");
    address attacker = makeAddr("attacker");

    function setUp() public {
        fairFund = new FairFund(5);
        fundingToken = new MockERC20("F", "F");
        votingToken = new MockERC20("V", "V");
        tally = block.timestamp + 7 days;
        vault = FundingVault(fairFund.deployFundingVault(address(fundingToken), address(votingToken), 1, 100e6, tally));

        fundingToken.mint(depositor, 200e6);
        vm.startPrank(depositor);
        fundingToken.approve(address(vault), type(uint256).max);
        vault.deposit(100e6);
        vm.stopPrank();

        vault.submitProposal("p1", 1, 100e6, recipient);

        votingToken.mint(voter, 1000e6);
        vm.startPrank(voter);
        votingToken.approve(address(vault), type(uint256).max);
        vault.register(1000e6);
        vault.voteOnProposal(1, 1000e6);
        vm.stopPrank();

        votingToken.mint(attacker, 100e6);
        vm.prank(attacker);
        votingToken.approve(address(vault), type(uint256).max);
    }

    function test_AtTallyDate_PreTallyActionsRevert() public {
        // The attacker registers one second early, so it holds real voting power at the tally second.
        vm.warp(tally - 1);
        vm.prank(attacker);
        vault.register(100e6);

        vm.warp(tally);

        vm.prank(depositor);
        vm.expectRevert(FundingVault.FundingVault__TallyDatePassed.selector);
        vault.deposit(1e6);

        vm.expectRevert(FundingVault.FundingVault__TallyDatePassed.selector);
        vault.submitProposal("late", 1, 100e6, attacker);

        votingToken.mint(voter, 100e6);
        vm.prank(voter);
        vm.expectRevert(FundingVault.FundingVault__TallyDatePassed.selector);
        vault.register(100e6);

        vm.prank(attacker);
        vm.expectRevert(FundingVault.FundingVault__TallyDatePassed.selector);
        vault.voteOnProposal(1, 100e6);
    }

    function test_AtTallyDate_ReleaseAndDistributeWork() public {
        vm.warp(tally);

        vm.prank(voter);
        vault.releaseVotingTokens();
        assertEq(votingToken.balanceOf(voter), 1000e6);

        vault.distributeFunds();
        assertEq(fundingToken.balanceOf(recipient), 95e6); // 100 minus 5% fee
    }

    function test_OneSecondBeforeTallyDate_PreTallyActionsWork() public {
        vm.warp(tally - 1);

        vm.prank(depositor);
        vault.deposit(1e6);

        vm.startPrank(attacker);
        vault.register(100e6);
        vault.voteOnProposal(1, 100e6);
        vm.expectRevert(FundingVault.FundingVault__TallyDateNotPassed.selector);
        vault.releaseVotingTokens();
        vm.stopPrank();
    }

    /// The register -> vote -> release loop can no longer start at the tally timestamp.
    function test_AtTallyDate_VotesCannotBeRecycled() public {
        vm.warp(tally);
        vm.startPrank(attacker);
        vm.expectRevert(FundingVault.FundingVault__TallyDatePassed.selector);
        vault.register(100e6);
        vm.stopPrank();
        assertEq(vault.getTotalVotingPowerTokensMinted(), 1000e6);
    }

    /// A vault with tallyDate == now would be closed from the start, so it cannot be created.
    function test_DeployWithTallyDateNow_Reverts() public {
        vm.expectRevert(FairFund.FairFund__TallyDateCannotBeInThePast.selector);
        fairFund.deployFundingVault(address(fundingToken), address(votingToken), 1, 100e6, block.timestamp);

        fairFund.deployFundingVault(address(fundingToken), address(votingToken), 1, 100e6, block.timestamp + 1);
    }
}
