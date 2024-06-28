// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {StdInvariant} from "forge-std/StdInvariant.sol";
import {FundingVault} from "../../src/FundingVault.sol";
import {VotingPowerToken} from "../../src/VotingPowerToken.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {MockERC20} from "../mocks/MockERC20.sol";
import {Handler} from "./Handler.t.sol";

contract InvarientsTest is StdInvariant, Test {
    FundingVault fundingVault;
    MockERC20 fundingToken;
    MockERC20 votingToken;
    VotingPowerToken votingPowerToken;
    address owner = makeAddr("owner");
    Handler handler;

    function setUp() external {
        fundingToken = new MockERC20("FundingToken", "FTK");
        votingToken = new MockERC20("VotingToken", "VTK");
        votingPowerToken = new VotingPowerToken("VotingPowerToken", "VOTE");
        fundingVault = new FundingVault(
            address(fundingToken),
            address(votingToken),
            address(votingPowerToken),
            0,
            10 ether,
            block.timestamp + 1 days,
            owner
        );
        votingPowerToken.transferOwnership(address(fundingVault));
        handler =
            new Handler(address(fundingToken), address(votingToken), address(votingPowerToken), address(fundingVault));
        targetContract(address(handler));
    }

    function invariant_totalVotingPowerTokensUsedMustBeLessThanTotalSupplyOfVotingTokens() public view {
        assertTrue(votingPowerToken.balanceOf(address(fundingVault)) <= votingPowerToken.totalSupply());
    }
}
