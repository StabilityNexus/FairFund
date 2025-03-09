// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {FundingVault} from "../../src/FundingVault.sol";
import {VotingPowerToken} from "../../src/VotingPowerToken.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {MockERC20} from "../../src/mocks/MockERC20.sol";
import {FairFund} from "../../src/FairFund.sol";
import {DeployFairFund} from "../../script/DeployFairFund.s.sol";

contract FundingVaultTest is Test {
    FundingVault fundingVault;
    FairFund fairFund;
    MockERC20 fundingToken;
    MockERC20 votingToken;
    VotingPowerToken votingPowerToken;
    address owner = makeAddr("owner");
    address randomUser = makeAddr("randomUser");
    address randomUser1 = makeAddr("randomUser1");

    function setUp() external {
        DeployFairFund deployFairFund = new DeployFairFund();
        (fairFund,) = deployFairFund.run();
        fundingToken = new MockERC20("FundingToken", "FTK");
        votingToken = new MockERC20("VotingToken", "VTK");
        uint256 decimals = ERC20(address(votingToken)).decimals();
        votingPowerToken = new VotingPowerToken("VotingPowerToken", "VOTE", decimals);
        fundingVault = new FundingVault(
            address(fundingToken),
            address(votingToken),
            address(votingPowerToken),
            1,
            10 ether,
            block.timestamp + 1 days,
            address(fairFund)
        );
        votingPowerToken.transferOwnership(address(fundingVault));
    }

    function testDeposit() public {
        vm.startPrank(randomUser);
        fundingToken.mint(randomUser, 10 ether);
        fundingToken.approve(address(fundingVault), 10 ether);
        fundingVault.deposit(10 ether);
        assertEq(fundingToken.balanceOf(address(fundingVault)), 10 ether);
        vm.stopPrank();
    }

    function testRevertIfDepositAfterTallyDate() public {
        uint256 originalTime = block.timestamp;
        vm.warp(block.timestamp + 2 days);
        vm.startPrank(randomUser);
        fundingToken.mint(randomUser, 10 ether);
        fundingToken.approve(address(fundingVault), 10 ether);
        vm.expectRevert(FundingVault.FundingVault__TallyDatePassed.selector);
        fundingVault.deposit(10 ether);
        vm.warp(originalTime);
    }

    function test_RevertWhen_Deposit() public {
        vm.expectRevert();
        fundingVault.deposit(0 ether);
    }

    function testRegister() public {
        vm.startPrank(randomUser);
        votingToken.mint(randomUser, 10 ether);
        votingToken.approve(address(fundingVault), 10 ether);
        fundingVault.register(10 ether);
        assertEq(votingToken.balanceOf(address(fundingVault)), 10 ether);
        assertEq(votingPowerToken.balanceOf(randomUser), 10 ether);
        vm.stopPrank();
    }

    function test_RevertWhen_RegisterWithAmountLessThanZero() public {
        vm.expectRevert();
        fundingVault.register(0 ether);
    }

    function test_RevertWhen_RegisterWithAmountGreaterThanBalance() public {
        vm.startPrank(randomUser);
        votingToken.mint(randomUser, 10 ether);
        votingToken.approve(address(fundingVault), 10 ether);
        vm.stopPrank();
        vm.expectRevert();
        fundingVault.register(20 ether);
    }

    function testRevertWhenRegisterAfterTalleydate() public {
        vm.startPrank(randomUser);
        votingToken.mint(randomUser, 10 ether);
        votingToken.approve(address(fundingVault), 10 ether);
        uint256 originalTime = block.timestamp;
        vm.warp(originalTime + 2 days);
        vm.expectRevert(FundingVault.FundingVault__TallyDatePassed.selector);
        fundingVault.register(10 ether);
        vm.warp(originalTime);
    }

    function testSubmitProposal() public {
        fundingVault.submitProposal("<Proposal Link>", 1 ether, 5 ether, address(randomUser));
        (string memory metadata, uint256 minAmount, uint256 maxAmount, address recipient) = fundingVault.getProposal(1);
        assertEq(metadata, "<Proposal Link>");
        assertEq(minAmount, 1 ether);
        assertEq(maxAmount, 5 ether);
        assertEq(recipient, address(randomUser));
    }

    function testSubmitProposalWithZeroMetadata() public {
        vm.expectRevert(FundingVault.FundingVault__MetadataCannotBeEmpty.selector);
        fundingVault.submitProposal("", 1 ether, 5 ether, address(randomUser));
    }

    function testSubmitProposalWithInvalidAmounts() public {
        vm.expectRevert(FundingVault.FundingVault__AmountExceededsLimit.selector);
        fundingVault.submitProposal("<Proposal Link>", 0, 5 ether, address(randomUser));

        vm.expectRevert(FundingVault.FundingVault__AmountExceededsLimit.selector);
        fundingVault.submitProposal("<Proposal Link>", 1 ether, 12 ether, address(randomUser));
    }

    function testSubmitProposalWithZeroAddress() public {
        vm.expectRevert(FundingVault.FundingVault__CannotBeAZeroAddress.selector);
        fundingVault.submitProposal("<Proposal Link>", 1 ether, 5 ether, address(0));
    }

    function testRevertWhenProposalSubmittedAfterTallyDate() public {
        uint256 originalTime = block.timestamp;
        vm.warp(originalTime + 2 days);
        vm.expectRevert(FundingVault.FundingVault__TallyDatePassed.selector);
        fundingVault.submitProposal("<Proposal Link>", 1 ether, 5 ether, address(randomUser));

        vm.warp(originalTime);
    }

    function testVoteOnProposal() public {
        // Setup
        vm.startPrank(randomUser);
        fundingVault.submitProposal("<Proposal Link>", 1 ether, 5 ether, address(randomUser));
        vm.stopPrank();

        // Vote on the proposal
        vm.startPrank(randomUser1);
        votingToken.mint(randomUser1, 10 ether);
        votingToken.approve(address(fundingVault), 10 ether);
        fundingVault.register(10 ether);
        votingPowerToken.approve(address(fundingVault), 5 ether);
        fundingVault.voteOnProposal(1, 5 ether);
        assertEq(votingPowerToken.balanceOf(address(fundingVault)), 5 ether);
        vm.stopPrank();
    }

    function testVoteOnNonExistentProposal() public {
        vm.expectRevert(FundingVault.FundingVault__ProposalDoesNotExist.selector);
        fundingVault.voteOnProposal(999, 1 ether);
    }

    function testVoteWithExcessiveAmount() public {
        // Setup
        vm.startPrank(randomUser);
        votingToken.mint(randomUser, 10 ether);
        votingToken.approve(address(fundingVault), 10 ether);
        fundingVault.register(10 ether);
        fundingVault.submitProposal("<Proposal Link>", 1 ether, 5 ether, address(randomUser));
        vm.stopPrank();

        // Attempt to vote with more tokens than owned
        vm.startPrank(randomUser);
        votingPowerToken.approve(address(fundingVault), 20 ether);
        vm.expectRevert(FundingVault.FundingVault__AmountExceededsLimit.selector);
        fundingVault.voteOnProposal(1, 20 ether);
        vm.stopPrank();
    }

    function testRevertWhenVotedAfterTallyDatePassed() public {
        uint256 originalTime = block.timestamp;
        vm.startPrank(randomUser);
        votingToken.mint(randomUser, 10 ether);
        votingToken.approve(address(fundingVault), 10 ether);
        fundingVault.register(10 ether);
        fundingVault.submitProposal("<Proposal Link>", 1 ether, 5 ether, address(randomUser));
        vm.stopPrank();
        // attempt voting after the tally date is passed
        vm.startPrank(randomUser);
        vm.warp(originalTime + 2 days);
        votingPowerToken.approve(address(fundingVault), 10 ether);
        vm.expectRevert(FundingVault.FundingVault__TallyDatePassed.selector);
        fundingVault.voteOnProposal(1, 10 ether);
        vm.stopPrank();
        vm.warp(originalTime);
    }

    function testCalculateFundingToBeReceived() public {
        // Setup
        vm.startPrank(randomUser);
        fundingToken.mint(randomUser, 10 ether);
        fundingToken.approve(address(fundingVault), 10 ether);
        fundingVault.deposit(10 ether);
        votingToken.mint(randomUser, 10 ether);
        votingToken.approve(address(fundingVault), 10 ether);
        fundingVault.register(10 ether);
        fundingVault.submitProposal("<Proposal Link>", 1 ether, 5 ether, address(randomUser));
        votingPowerToken.approve(address(fundingVault), 5 ether);
        fundingVault.voteOnProposal(1, 5 ether);
        vm.stopPrank();

        // fast forward time to pass the tally date
        vm.warp(block.timestamp + 2 days);

        // Calculate funding to be received
        vm.prank(randomUser);
        assertEq(fundingVault.calculateFundingToBeReceived(1), 5 ether);
    }

    function testCalculateFundingToBeReceivedReturnsMaxRequestedAmountWhenGreaterThanTotalVotes() public {
        // Setup
        vm.startPrank(randomUser);
        fundingToken.mint(randomUser, 10 ether);
        fundingToken.approve(address(fundingVault), 10 ether);
        fundingVault.deposit(10 ether);
        votingToken.mint(randomUser, 10 ether);
        votingToken.approve(address(fundingVault), 10 ether);
        fundingVault.register(10 ether);
        fundingVault.submitProposal("<Proposal Link>", 1 ether, 2 ether, address(randomUser));
        votingPowerToken.approve(address(fundingVault), 5 ether);
        fundingVault.voteOnProposal(1, 5 ether);
        vm.stopPrank();

        // fast forward time to pass the tally date
        vm.warp(block.timestamp + 2 days);

        // Calculate funding to be received
        vm.prank(randomUser);
        assertEq(fundingVault.calculateFundingToBeReceived(1), 2 ether);
    }

    function testCalculateFundingToBeReceivedReturnsZeroWhenProposalIsRejected() public {
        // Setup
        vm.startPrank(randomUser);
        fundingToken.mint(randomUser, 10 ether);
        fundingToken.approve(address(fundingVault), 10 ether);
        fundingVault.deposit(10 ether);
        votingToken.mint(randomUser, 10 ether);
        votingToken.approve(address(fundingVault), 10 ether);
        fundingVault.register(10 ether);
        fundingVault.submitProposal("<Proposal Link>", 3 ether, 5 ether, address(randomUser));
        votingPowerToken.approve(address(fundingVault), 5 ether);
        fundingVault.voteOnProposal(1, 1 ether);
        vm.stopPrank();

        // fast forward time to pass the tally date
        vm.warp(block.timestamp + 2 days);

        // Calculate funding to be received
        vm.prank(randomUser);
        assertEq(fundingVault.calculateFundingToBeReceived(1), 0);
    }

    function testCalculateFundingToBeReceivedWithoutTallyDatePassed() public {
        vm.expectRevert(FundingVault.FundingVault__TallyDateNotPassed.selector);
        fundingVault.calculateFundingToBeReceived(1);
    }

    function testCalculateFundingToBeReceivedWithInvalidProposal() public {
        vm.expectRevert(FundingVault.FundingVault__ProposalDoesNotExist.selector);

        // fast forward time to pass the tally date
        vm.warp(block.timestamp + 2 days);

        fundingVault.calculateFundingToBeReceived(999);
    }

    function testDistributeFunds() public {
        uint256 initialDeposit = 10 ether;
        uint256 registrationAmount = 10 ether;
        uint256 proposalMinRequestAmount = 1 ether;
        uint256 proposalMaxRequestAmount = 8 ether;
        uint256 votingAmount = 8 ether;
        uint256 tallyDelay = 2 days;
        uint256 expectedProposalFunding = 7.6 ether; // 8 ether - 5% fee

        // Setup
        vm.startPrank(randomUser);
        fundingToken.mint(randomUser, initialDeposit);
        fundingToken.approve(address(fundingVault), initialDeposit);
        fundingVault.deposit(initialDeposit);
        votingToken.mint(randomUser, registrationAmount);
        votingToken.approve(address(fundingVault), registrationAmount);
        fundingVault.register(registrationAmount);
        fundingVault.submitProposal(
            "<Proposal Link>", proposalMinRequestAmount, proposalMaxRequestAmount, address(randomUser)
        );
        votingPowerToken.approve(address(fundingVault), votingAmount);
        fundingVault.voteOnProposal(1, votingAmount);
        vm.stopPrank();

        // Fast forward time to pass the tally date
        vm.warp(block.timestamp + tallyDelay);

        // Distribute funds
        vm.prank(randomUser);
        fundingVault.distributeFunds();
        assertEq(fundingToken.balanceOf(randomUser), expectedProposalFunding);
        assertEq(fundingToken.balanceOf(address(fundingVault.getDeployer())), 0.4 ether); // Platform fee
    }

    function testReleaseVotingTokens() public {
        // Setup
        vm.startPrank(randomUser);
        votingToken.mint(randomUser, 10 ether);
        votingToken.approve(address(fundingVault), 10 ether);
        fundingVault.register(10 ether);
        vm.stopPrank();

        // Fast forward time to pass the tally date
        vm.warp(block.timestamp + 2 days);

        // Release voting tokens
        vm.prank(randomUser);
        fundingVault.releaseVotingTokens();
        assertEq(votingToken.balanceOf(randomUser), 10 ether);
        assertEq(fundingVault.getVotingPowerOf(msg.sender), 0);
    }

    function testReleaseVotingTokensWithoutTallyData() public {
        vm.expectRevert(FundingVault.FundingVault__TallyDateNotPassed.selector);
        fundingVault.releaseVotingTokens();
    }

    function testReleaseVotingTokensWhenNoVotingPower() public {
        // Setup
        vm.startPrank(randomUser);
        votingToken.mint(randomUser, 10 ether);
        votingToken.approve(address(fundingVault), 10 ether);
        fundingVault.register(10 ether);
        vm.stopPrank();

        // Fast forward time to pass the tally date
        vm.warp(block.timestamp + 2 days);

        vm.expectRevert(FundingVault.FundingVault__AmountCannotBeZero.selector);
        fundingVault.releaseVotingTokens();
    }

    function testWithdrawRemaining() public {
        uint256 initialDeposit = 10 ether;
        uint256 registrationAmount = 10 ether;
        uint256 proposalMinRequestAmount = 1 ether;
        uint256 proposalMaxRequestAmount = 8 ether;
        uint256 votingAmount = 8 ether;
        uint256 tallyDelay = 2 days;
        uint256 expectedProposalFunding = 7.6 ether; // 8 ether - 5% fee

        // Setup
        vm.startPrank(randomUser);
        fundingToken.mint(randomUser, initialDeposit);
        fundingToken.approve(address(fundingVault), initialDeposit);
        fundingVault.deposit(initialDeposit);
        votingToken.mint(randomUser, registrationAmount);
        votingToken.approve(address(fundingVault), registrationAmount);
        fundingVault.register(registrationAmount);
        fundingVault.submitProposal(
            "<Proposal Link>", proposalMinRequestAmount, proposalMaxRequestAmount, address(randomUser)
        );
        votingPowerToken.approve(address(fundingVault), votingAmount);
        fundingVault.voteOnProposal(1, votingAmount);
        vm.stopPrank();

        // Fast forward time to pass the tally date
        vm.warp(block.timestamp + tallyDelay);

        // Distribute funds
        vm.startPrank(randomUser);
        fundingVault.distributeFunds();

        // Check initial balances
        assertEq(fundingToken.balanceOf(randomUser), expectedProposalFunding);
        assertEq(fundingToken.balanceOf(address(fundingVault)), initialDeposit - (expectedProposalFunding + 0.4 ether)); // 0.4 ether is the platform fee

        // Withdraw remaining funds
        vm.startPrank(randomUser);
        fundingVault.withdrawRemaining();

        // Check final balances
        assertEq(fundingToken.balanceOf(randomUser), initialDeposit - 0.4 ether); // 0.4 ether is the platform fee
        assertEq(fundingToken.balanceOf(address(fundingVault)), 0);
    }

    function testWithdrawRemainingMultipleUsers() public {
        uint256 initialDeposit = 10 ether;
        uint256 registrationAmount = 10 ether;
        uint256 proposalMinRequestAmount = 1 ether;
        uint256 proposalMaxRequestAmount = 5 ether;
        uint256 votingAmount = 8 ether;
        uint256 tallyDelay = 2 days;

        // Setup for randomUser
        vm.startPrank(randomUser);
        fundingToken.mint(randomUser, initialDeposit);
        fundingToken.approve(address(fundingVault), initialDeposit);
        fundingVault.deposit(initialDeposit);
        votingToken.mint(randomUser, registrationAmount);
        votingToken.approve(address(fundingVault), registrationAmount);
        fundingVault.register(registrationAmount);
        fundingVault.submitProposal(
            "<Proposal Link 1>", proposalMinRequestAmount, proposalMaxRequestAmount, address(randomUser)
        );
        votingPowerToken.approve(address(fundingVault), votingAmount);
        fundingVault.voteOnProposal(1, votingAmount);
        vm.stopPrank();

        // Setup for randomUser1
        vm.startPrank(randomUser1);
        fundingToken.mint(randomUser1, initialDeposit);
        fundingToken.approve(address(fundingVault), initialDeposit);
        fundingVault.deposit(initialDeposit);
        votingToken.mint(randomUser1, registrationAmount);
        votingToken.approve(address(fundingVault), registrationAmount);
        fundingVault.register(registrationAmount);
        fundingVault.submitProposal(
            "<Proposal Link 2>", proposalMinRequestAmount, proposalMaxRequestAmount, address(randomUser1)
        );
        votingPowerToken.approve(address(fundingVault), votingAmount);
        fundingVault.voteOnProposal(2, votingAmount);
        vm.stopPrank();

        // Fast forward time to pass the tally date
        vm.warp(block.timestamp + tallyDelay);

        // Distribute funds
        fundingVault.distributeFunds();

        // Withdraw remaining funds for both users
        vm.startPrank(randomUser);
        fundingVault.withdrawRemaining();
        vm.startPrank(randomUser1);
        fundingVault.withdrawRemaining();

        // Check final balances
        assertEq(fundingToken.balanceOf(randomUser), initialDeposit - 0.25 ether); // 0.4 ether is the platform fee
        assertEq(fundingToken.balanceOf(randomUser1), initialDeposit - 0.25 ether); // 0.4 ether is the platform fee
        assertEq(fundingToken.balanceOf(address(fundingVault)), 0);
    }

    function testWithdrawRemainingCorrectRatio() public {
        uint256 user1Deposit = 8 ether;
        uint256 user2Deposit = 2 ether;
        uint256 proposalAmount = 5 ether;

        // Setup for user1
        vm.startPrank(randomUser);
        fundingToken.mint(randomUser, user1Deposit);
        fundingToken.approve(address(fundingVault), user1Deposit);
        fundingVault.deposit(user1Deposit);

        votingToken.mint(randomUser, 10 ether);
        votingToken.approve(address(fundingVault), 10 ether);
        fundingVault.register(10 ether);

        fundingVault.submitProposal("<Proposal Link>", proposalAmount, proposalAmount, makeAddr("abc"));
        fundingVault.voteOnProposal(1, 10 ether);
        vm.stopPrank();

        // Setup for user2
        vm.startPrank(randomUser1);
        fundingToken.mint(randomUser1, user2Deposit);
        fundingToken.approve(address(fundingVault), user2Deposit);
        fundingVault.deposit(user2Deposit);
        vm.stopPrank();

        // Fast forward time to pass the tally date
        vm.warp(block.timestamp + 2 days);

        // Distribute funds
        fundingVault.distributeFunds();

        // Withdraw remaining funds for both users
        vm.prank(randomUser);
        fundingVault.withdrawRemaining();

        vm.prank(randomUser1);
        fundingVault.withdrawRemaining();

        // Calculate expected withdrawals
        uint256 totalRemaining = user1Deposit + user2Deposit - proposalAmount;
        uint256 expectedUser1Withdrawal =
            (((totalRemaining * user1Deposit) * 1e18) / (user1Deposit + user2Deposit)) / 1e18;
        uint256 expectedUser2Withdrawal =
            (((totalRemaining * user2Deposit) * 1e18) / (user1Deposit + user2Deposit)) / 1e18;

        // Check if the correct amounts were withdrawn
        assertEq(fundingToken.balanceOf(randomUser), expectedUser1Withdrawal);
        assertEq(fundingToken.balanceOf(randomUser1), expectedUser2Withdrawal);
    }

    function testWithdrawRemainingBeforeDistribution() public {
        uint256 initialDeposit = 10 ether;
        uint256 tallyDelay = 2 days;

        // Setup
        vm.startPrank(randomUser);
        fundingToken.mint(randomUser, initialDeposit);
        fundingToken.approve(address(fundingVault), initialDeposit);
        fundingVault.deposit(initialDeposit);
        vm.stopPrank();

        vm.startPrank(randomUser);
        vm.expectRevert(FundingVault.FundingVault__TallyDateNotPassed.selector);
        fundingVault.withdrawRemaining();

        vm.warp(block.timestamp + tallyDelay);

        // Attempt to withdraw before distribution
        vm.startPrank(randomUser);
        vm.expectRevert(FundingVault.FundingVault__FundsNotDistributedYet.selector);
        fundingVault.withdrawRemaining();
    }

    function testWithdrawRemainingWithNoDeposit() public {
        uint256 initialDeposit = 10 ether;

        // Setup with a different user
        vm.startPrank(randomUser);
        fundingToken.mint(randomUser, initialDeposit);
        fundingToken.approve(address(fundingVault), initialDeposit);
        fundingVault.deposit(initialDeposit);

        // Fast forward time and distribute funds
        vm.warp(block.timestamp + 2 days);
        fundingVault.distributeFunds();

        // Attempt to withdraw with a user who didn't deposit
        vm.startPrank(randomUser1);
        vm.expectRevert(FundingVault.FundingVault__NoFundsToWithdraw.selector);
        fundingVault.withdrawRemaining();
    }

    function testWithdrawRemainingTwice() public {
        uint256 initialDeposit = 10 ether;

        // Setup
        vm.startPrank(randomUser);
        fundingToken.mint(randomUser, initialDeposit);
        fundingToken.approve(address(fundingVault), initialDeposit);
        fundingVault.deposit(initialDeposit);
        vm.stopPrank();

        // Fast forward time and distribute funds
        vm.warp(block.timestamp + 2 days);
        fundingVault.distributeFunds();

        // Withdraw remaining funds
        vm.startPrank(randomUser);
        fundingVault.withdrawRemaining();

        // Attempt to withdraw again
        vm.startPrank(randomUser);
        vm.expectRevert(FundingVault.FundingVault__NoFundsToWithdraw.selector);
        fundingVault.withdrawRemaining();
    }

    function testWithdrawRemainingWithNoRemainingFunds() public {
        uint256 initialDeposit = 10 ether;
        uint256 registrationAmount = 10 ether;
        uint256 proposalMinRequestAmount = 1 ether;
        uint256 proposalMaxRequestAmount = 10 ether;
        uint256 votingAmount = 10 ether;
        uint256 tallyDelay = 2 days;

        // Setup
        vm.startPrank(randomUser);
        fundingToken.mint(randomUser, initialDeposit);
        fundingToken.approve(address(fundingVault), initialDeposit);
        fundingVault.deposit(initialDeposit);
        votingToken.mint(randomUser, registrationAmount);
        votingToken.approve(address(fundingVault), registrationAmount);
        fundingVault.register(registrationAmount);
        fundingVault.submitProposal(
            "<Proposal Link>", proposalMinRequestAmount, proposalMaxRequestAmount, address(randomUser)
        );
        votingPowerToken.approve(address(fundingVault), votingAmount);
        fundingVault.voteOnProposal(1, votingAmount);
        vm.stopPrank();

        // Fast forward time and distribute funds
        vm.warp(block.timestamp + tallyDelay);
        fundingVault.distributeFunds();

        // Attempt to withdraw when there are no remaining funds
        vm.startPrank(randomUser);
        vm.expectRevert(FundingVault.FundingVault__NoRemainingFundsToWithdraw.selector);
        fundingVault.withdrawRemaining();
    }

    function testGetTallyDate() public view {
        assertEq(fundingVault.getTallyDate(), block.timestamp + 1 days);
    }

    function testGetFundingToken() public view {
        assertEq(fundingVault.getFundingToken(), address(fundingToken));
    }

    function testGetVotingToken() public view {
        assertEq(fundingVault.getVotingToken(), address(votingToken));
    }

    function testGetVotingPowerToken() public view {
        assertEq(fundingVault.getVotingPowerToken(), address(votingPowerToken));
    }

    function testGetVotingPowerOf() public {
        // Initially, voting power should be 0
        assertEq(fundingVault.getVotingPowerOf(randomUser), 0);

        // Register voter and check voting power
        vm.startPrank(randomUser);
        votingToken.mint(randomUser, 10 ether);
        votingToken.approve(address(fundingVault), 10 ether);
        fundingVault.register(10 ether);
        assertEq(fundingVault.getVotingPowerOf(randomUser), 10 ether);
        vm.stopPrank();
    }

    function testGetTotalAvailableFunds() public {
        uint256 amount = 10 ether;
        vm.startPrank(randomUser);
        fundingToken.mint(randomUser, amount);
        fundingToken.approve(address(fundingVault), amount);
        fundingVault.deposit(amount);
        assertEq(fundingVault.getTotalBalanceAvailbleForDistribution(), amount);
        vm.stopPrank();
    }

    function testGetTotalBalanceAvailableForDistribution() public {
        // Initially, the balance should be 0
        assertEq(fundingVault.getTotalBalanceAvailbleForDistribution(), 0);

        // Deposit some funds
        uint256 amount = 5 ether;
        vm.startPrank(randomUser);
        fundingToken.mint(randomUser, amount);
        fundingToken.approve(address(fundingVault), amount);
        fundingVault.deposit(amount);
        vm.stopPrank();

        // Check if the balance is updated correctly
        assertEq(fundingVault.getTotalBalanceAvailbleForDistribution(), amount);

        // Deposit more funds
        uint256 additionalAmount = 3 ether;
        vm.startPrank(randomUser);
        fundingToken.mint(randomUser, additionalAmount);
        fundingToken.approve(address(fundingVault), additionalAmount);
        fundingVault.deposit(additionalAmount);
        vm.stopPrank();

        // Check if the balance is updated correctly after multiple deposits
        assertEq(fundingVault.getTotalBalanceAvailbleForDistribution(), amount + additionalAmount);
    }

    function testGetTotalFundsDistributed() public {
        // Initially, the total funds distributed should be 0
        assertEq(fundingVault.getTotalFundsDistributed(), 0);

        // Set up the vault with some funds and a proposal
        uint256 depositAmount = 10 ether;
        uint256 minAmount = 5 ether;
        uint256 maxAmount = 7 ether;
        vm.startPrank(randomUser);
        fundingToken.mint(randomUser, depositAmount);
        fundingToken.approve(address(fundingVault), depositAmount);
        fundingVault.deposit(depositAmount);
        fundingVault.submitProposal("Test Proposal", minAmount, maxAmount, randomUser);

        // Register a voter and vote
        votingToken.mint(randomUser, 10 ether);
        votingToken.approve(address(fundingVault), 10 ether);
        fundingVault.register(10 ether);
        fundingVault.voteOnProposal(1, 10 ether);

        // Fast forward to after the tally date
        vm.warp(fundingVault.getTallyDate() + 1);

        // Tally the votes and distribute funds
        fundingVault.distributeFunds();
        vm.stopPrank();

        // Check if the total funds distributed is updated correctly
        assertEq(fundingVault.getTotalFundsDistributed(), 7 ether);
    }
}
