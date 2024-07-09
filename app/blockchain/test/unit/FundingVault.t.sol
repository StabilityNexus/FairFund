// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {FundingVault} from "../../src/FundingVault.sol";
import {VotingPowerToken} from "../../src/VotingPowerToken.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {MockERC20} from "../../src/mocks/MockERC20.sol";

contract FundingVaultTest is Test {
    FundingVault fundingVault;
    MockERC20 fundingToken;
    MockERC20 votingToken;
    VotingPowerToken votingPowerToken;
    address owner = makeAddr("owner");
    address randomUser = makeAddr("randomUser");
    address randomUser1 = makeAddr("randomUser1");

    function setUp() external {
        fundingToken = new MockERC20("FundingToken", "FTK");
        votingToken = new MockERC20("VotingToken", "VTK");
        votingPowerToken = new VotingPowerToken("VotingPowerToken", "VOTE");
        fundingVault = new FundingVault(
            address(fundingToken),
            address(votingToken),
            address(votingPowerToken),
            1,
            10 ether,
            block.timestamp + 1 days,
            owner
        );
        votingPowerToken.transferOwnership(address(fundingVault));
    }

    function testSetMinRequestableAmount() public {
        vm.prank(owner);
        fundingVault.setMinRequestableAmount(2 ether);
        assertEq(fundingVault.getMinRequestableAmount(), 2 ether);
    }

    function testFailSetMinRequestableAmount() public {
        fundingVault.setMinRequestableAmount(11 ether);
    }

    function testSetMaxRequestableAmount() public {
        vm.prank(owner);
        fundingVault.setMaxRequestableAmount(20 ether);
        assertEq(fundingVault.getMaxRequestableAmount(), 20 ether);
    }

    function testFailSetMaxRequestableAmount() public {
        fundingVault.setMaxRequestableAmount(0);
    }

    function testDeposit() public {
        vm.startPrank(randomUser);
        fundingToken.mint(randomUser, 10 ether);
        fundingToken.approve(address(fundingVault), 10 ether);
        fundingVault.deposit(10 ether);
        assertEq(fundingToken.balanceOf(address(fundingVault)), 10 ether);
        vm.stopPrank();
    }

    function testFailDeposit() public {
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

    function testFailRegisterWithAmountLessThanZero() public {
        fundingVault.register(0 ether);
    }

    function testFailRegisterWithAmountGreaterThanBalance() public {
        vm.startPrank(randomUser);
        votingToken.mint(randomUser, 10 ether);
        votingToken.approve(address(fundingVault), 10 ether);
        vm.stopPrank();
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
        uint256 expectedProposalFunding = 8 ether;

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

    function testGetMinRequestableAmount() public {
        assertEq(fundingVault.getMinRequestableAmount(), 1);

        vm.prank(owner);
        fundingVault.setMinRequestableAmount(2 ether);
        assertEq(fundingVault.getMinRequestableAmount(), 2 ether);
    }

    function testGetMaxRequestableAmount() public {
        assertEq(fundingVault.getMaxRequestableAmount(), 10 ether);

        vm.prank(owner);
        fundingVault.setMaxRequestableAmount(20 ether);
        assertEq(fundingVault.getMaxRequestableAmount(), 20 ether);
    }

    function testGetTallyDate() public {
        assertEq(fundingVault.getTallyDate(), block.timestamp + 1 days);
    }

    function testGetFundingToken() public {
        assertEq(fundingVault.getFundingToken(), address(fundingToken));
    }

    function testGetVotingToken() public {
        assertEq(fundingVault.getVotingToken(), address(votingToken));
    }

    function testGetVotingPowerToken() public {
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
}
