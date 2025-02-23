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

    function testMinRequestableAmountGreaterThanMaxRequestable() public {
        vm.expectRevert(FundingVault.FundingVault__MinRequestableAmountCannotBeGreaterThanMaxRequestableAmount.selector);
        fundingVault.submitProposal("<Proposal Link>", 6 ether, 5 ether, address(randomUser));
    }

    function testCalculateFundingWithNoVotingPowerTokens() public {
        // Submit a proposal
        fundingVault.submitProposal("<Proposal Link>", 1 ether, 5 ether, address(randomUser));

        // Fast forward time
        vm.warp(block.timestamp + 2 days);

        // Try to calculate funding when no voting power tokens have been minted
        vm.expectRevert(FundingVault.FundingVault__NoVotingPowerTokenMinted.selector);
        fundingVault.calculateFundingToBeReceived(1);
    }

    function testDistributeFundsFailedTransfer() public {
        // Setup scenario
        vm.startPrank(randomUser);
        fundingToken.mint(randomUser, 10 ether);
        fundingToken.approve(address(fundingVault), 10 ether);
        fundingVault.deposit(10 ether);

        votingToken.mint(randomUser, 10 ether);
        votingToken.approve(address(fundingVault), 10 ether);
        fundingVault.register(10 ether);

        fundingVault.submitProposal("<Proposal Link>", 1 ether, 5 ether, address(randomUser));
        votingPowerToken.approve(address(fundingVault), 10 ether);
        fundingVault.voteOnProposal(1, 10 ether);
        vm.stopPrank();

        // Fast forward time
        vm.warp(block.timestamp + 2 days);

        // Mock the transfer function to always return false
        vm.mockCall(address(fundingToken), abi.encodeWithSelector(IERC20.transfer.selector), abi.encode(false));

        // Attempt to distribute funds, should revert due to transfer failure
        vm.expectRevert(FundingVault.FundingVault__TransferFailed.selector);
        fundingVault.distributeFunds();

        // Clear the mock to not affect other tests
        vm.clearMockedCalls();
    }

    function testDistributeFundsAlreadyDistributed() public {
        // Setup
        vm.startPrank(randomUser);
        fundingToken.mint(randomUser, 10 ether);
        fundingToken.approve(address(fundingVault), 10 ether);
        fundingVault.deposit(10 ether);

        votingToken.mint(randomUser, 10 ether);
        votingToken.approve(address(fundingVault), 10 ether);
        fundingVault.register(10 ether);

        fundingVault.submitProposal("<Proposal Link>", 1 ether, 5 ether, address(randomUser));
        votingPowerToken.approve(address(fundingVault), 10 ether);
        fundingVault.voteOnProposal(1, 10 ether);
        vm.stopPrank();

        // Fast forward time
        vm.warp(block.timestamp + 2 days);

        // Distribute funds first time
        fundingVault.distributeFunds();

        // Try to distribute funds again
        vm.expectRevert(FundingVault.FundingVault__AlreadyDistributedFunds.selector);
        fundingVault.distributeFunds();
    }

    // function testWithdrawRemainingWithTinyAmount() public {
    //     // Setup with a very small total deposit
    //     uint256 depositAmount = 1000;  // Small initial amount

    //     vm.startPrank(randomUser);
    //     fundingToken.mint(randomUser, depositAmount);
    //     fundingToken.approve(address(fundingVault), depositAmount);
    //     fundingVault.deposit(depositAmount);

    //     // Submit proposal for most of the funds (leaving tiny remainder)
    //     fundingVault.submitProposal("<Proposal Link>", 995, 995, address(randomUser));

    //     // Setup voting to ensure proposal gets funded
    //     votingToken.mint(randomUser, 10 ether);
    //     votingToken.approve(address(fundingVault), 10 ether);
    //     fundingVault.register(10 ether);
    //     votingPowerToken.approve(address(fundingVault), 10 ether);
    //     fundingVault.voteOnProposal(1, 10 ether);
    //     vm.stopPrank();

    //     // Fast forward and distribute
    //     vm.warp(block.timestamp + 2 days);
    //     fundingVault.distributeFunds();

    //     // Now try to withdraw the tiny remaining amount
    //     // After platform fee (5%) and main distribution, the remaining amount will be very small
    //     vm.prank(randomUser);
    //     vm.expectRevert(FundingVault.FundingVault__WithdrawableAmountTooSmall.selector);
    //     fundingVault.withdrawRemaining();
    // }
    function testGetProposalIdsByProposer() public {
        // Submit multiple proposals
        vm.startPrank(randomUser);
        fundingVault.submitProposal("<Proposal Link 1>", 1 ether, 5 ether, address(randomUser));
        fundingVault.submitProposal("<Proposal Link 2>", 2 ether, 6 ether, address(randomUser));
        fundingVault.submitProposal("<Proposal Link 3>", 3 ether, 7 ether, address(randomUser));
        vm.stopPrank();

        // Get proposal IDs for the proposer
        uint256[] memory proposalIds = fundingVault.getProposalIdsByProposer(randomUser);

        // Verify the returned array
        assertEq(proposalIds.length, 3);
        assertEq(proposalIds[0], 1);
        assertEq(proposalIds[1], 2);
        assertEq(proposalIds[2], 3);

        // Check for a user with no proposals
        uint256[] memory emptyProposalIds = fundingVault.getProposalIdsByProposer(randomUser1);
        assertEq(emptyProposalIds.length, 0);
    }

    function testGetTotalProposals() public {
        assertEq(fundingVault.getTotalProposals(), 0);

        // Submit proposals
        vm.startPrank(randomUser);
        fundingVault.submitProposal("<Proposal Link 1>", 1 ether, 5 ether, address(randomUser));
        fundingVault.submitProposal("<Proposal Link 2>", 2 ether, 6 ether, address(randomUser));
        vm.stopPrank();

        assertEq(fundingVault.getTotalProposals(), 2);
    }

    function testGetMinAndMaxRequestableAmount() public {
        assertEq(fundingVault.getMinRequestableAmount(), 1);
        assertEq(fundingVault.getMaxRequestableAmount(), 10 ether);
    }

    function testGetTotalVotingPowerTokensUsed() public {
        // Initially should be 0
        assertEq(fundingVault.getTotalVotingPowerTokensUsed(), 0);

        // Setup voter and proposal
        vm.startPrank(randomUser);
        votingToken.mint(randomUser, 10 ether);
        votingToken.approve(address(fundingVault), 10 ether);
        fundingVault.register(10 ether);
        fundingVault.submitProposal("<Proposal Link>", 1 ether, 5 ether, address(randomUser));

        // Vote with some tokens
        votingPowerToken.approve(address(fundingVault), 5 ether);
        fundingVault.voteOnProposal(1, 5 ether);
        vm.stopPrank();

        // Check used voting power tokens
        assertEq(fundingVault.getTotalVotingPowerTokensUsed(), 5 ether);
    }

    function testGetDeployer() public {
        assertEq(fundingVault.getDeployer(), address(fairFund));
    }

    function testDepositZeroAmount() public {
        vm.startPrank(randomUser);
        fundingToken.mint(randomUser, 1 ether);
        fundingToken.approve(address(fundingVault), 1 ether);
        vm.expectRevert(FundingVault.FundingVault__AmountCannotBeZero.selector);
        fundingVault.deposit(0);
        vm.stopPrank();
    }

    function testRegisterWithInsufficientBalance() public {
        vm.startPrank(randomUser);
        votingToken.mint(randomUser, 1 ether);
        votingToken.approve(address(fundingVault), 2 ether);
        vm.expectRevert(FundingVault.FundingVault__NotEnoughBalance.selector);
        fundingVault.register(2 ether);
        vm.stopPrank();
    }

    function testVoteWithoutVotingPower() public {
        // Submit a proposal first
        fundingVault.submitProposal("<Proposal Link>", 1 ether, 5 ether, address(randomUser));

        // Try to vote without having any voting power
        vm.startPrank(randomUser);
        vm.expectRevert(FundingVault.FundingVault__AmountExceededsLimit.selector);
        fundingVault.voteOnProposal(1, 1 ether);
        vm.stopPrank();
    }

    function testProposalDoesNotExist() public {
        vm.expectRevert(FundingVault.FundingVault__ProposalDoesNotExist.selector);
        fundingVault.voteOnProposal(999, 1 ether);
    }

    function testDistributeFundsWithPlatformFeeTransferFailure() public {
        uint256 depositAmount = 10 ether;

        // Setup proposal and voting
        vm.startPrank(randomUser);
        fundingToken.mint(randomUser, depositAmount);
        fundingToken.approve(address(fundingVault), depositAmount);
        fundingVault.deposit(depositAmount);

        votingToken.mint(randomUser, 10 ether);
        votingToken.approve(address(fundingVault), 10 ether);
        fundingVault.register(10 ether);

        fundingVault.submitProposal("<Proposal Link>", 1 ether, 8 ether, address(randomUser));
        votingPowerToken.approve(address(fundingVault), 10 ether);
        fundingVault.voteOnProposal(1, 10 ether);
        vm.stopPrank();

        // Fast forward time
        vm.warp(block.timestamp + 2 days);

        // Mock the transfer function to return false only for the platform fee transfer
        vm.mockCall(
            address(fundingToken),
            abi.encodeWithSelector(IERC20.transfer.selector, address(fundingVault.getDeployer())),
            abi.encode(false)
        );

        // Attempt to distribute funds
        vm.expectRevert(FundingVault.FundingVault__TransferFailed.selector);
        fundingVault.distributeFunds();

        // Clear mocked calls
        vm.clearMockedCalls();
    }

    function testGetTotalVotingPowerTokensMinted() public {
        // Initially should be 0
        assertEq(fundingVault.getTotalVotingPowerTokensMinted(), 0);

        // Register a voter
        vm.startPrank(randomUser);
        votingToken.mint(randomUser, 10 ether);
        votingToken.approve(address(fundingVault), 10 ether);
        fundingVault.register(10 ether);
        vm.stopPrank();

        // Check minted amount
        assertEq(fundingVault.getTotalVotingPowerTokensMinted(), 10 ether);

        // Register another voter
        vm.startPrank(randomUser1);
        votingToken.mint(randomUser1, 5 ether);
        votingToken.approve(address(fundingVault), 5 ether);
        fundingVault.register(5 ether);
        vm.stopPrank();

        // Check total minted amount
        assertEq(fundingVault.getTotalVotingPowerTokensMinted(), 15 ether);
    }
}
