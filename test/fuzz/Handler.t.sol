// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {FundingVault} from "../../src/FundingVault.sol";
import {MockERC20} from "../mocks/MockERC20.sol";
import {VotingPowerToken} from "../../src/VotingPowerToken.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {console} from "forge-std/console.sol";

contract Handler is Test {
    address[] public actors;
    address[] public validVoters;
    MockERC20 public fundingToken;
    MockERC20 public votingToken;
    VotingPowerToken public votingPowerToken;
    FundingVault public fundingVault;

    constructor(address _fundingToken, address _votingToken, address _votingPowerToken, address _fundingVault) {
        fundingToken = MockERC20(_fundingToken);
        votingToken = MockERC20(_votingToken);
        votingPowerToken = VotingPowerToken(_votingPowerToken);
        fundingVault = FundingVault(_fundingVault);
        // set random addresses
        for (uint256 i = 0; i < 100; i++) {
            actors.push(makeAddr(Strings.toString(i)));
        }
    }

    function getRamdomActor(uint256 seed) internal view returns (address) {
        return actors[seed % actors.length];
    }

    function getValidVoter(uint256 seed) internal view returns (address) {
        return validVoters[seed % validVoters.length];
    }

    function submitProposal(uint256 seed, uint96 minAmt, uint96 maxAmt) public {
        address randomUser = getRamdomActor(seed);
        vm.startPrank(randomUser);
        fundingVault.submitProposal("<Proposal Link>", minAmt, maxAmt, address(randomUser));
    }

    function registerVoter(uint256 seed, uint96 amount) public {
        address user = getRamdomActor(seed);
        validVoters.push(user);
        votingToken.mint(address(user), amount);
        vm.startPrank(user);
        votingToken.approve(address(fundingVault), amount);
        fundingVault.register(amount);
        vm.stopPrank();
    }

    function voteOnProposal(uint256 seed, uint96 proposalId, uint96 amount) public {
        address user = getValidVoter(seed);
        bound(amount, 0, votingToken.balanceOf(address(user)));
        bound(proposalId,1, fundingVault.getTotalProposals());
        vm.startPrank(user);
        fundingVault.voteOnProposal(proposalId, amount);
        vm.stopPrank();
    }

    function distributeFunds() public {
        vm.warp(block.timestamp + 2 days);
        fundingVault.distributeFunds();
    }

    function releaseVotingTokens(uint256 seed) public {
        address user = getValidVoter(seed);
        vm.warp(block.timestamp + 2 days);
        vm.startPrank(user);
        fundingVault.releaseVotingTokens();
        vm.stopPrank();
    }
}
