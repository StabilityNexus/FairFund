// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {HelperConfig} from "../../script/HelperConfig.s.sol";
import {DeployFairFund} from "../../script/DeployFairFund.s.sol";
import {FairFund} from "../../src/FairFund.sol";
import {FundingVault} from "../../src/FundingVault.sol";
import {VotingPowerToken} from "../../src/VotingPowerToken.sol";
import {Test} from "forge-std/Test.sol";

contract FairFundTest is Test {
    HelperConfig helperConfig;
    FairFund fairFund;

    event FundingVaultDeployed(address indexed fundingVault);

    function setUp() external {
        DeployFairFund deployFairFund = new DeployFairFund();
        (fairFund, helperConfig) = deployFairFund.run();
    }

    function testDeployFairFund() public view {
        assertTrue(address(fairFund) != address(0), "FairFund should be deployed");
        assertTrue(address(helperConfig) != address(0), "HelperConfig should be deployed");
    }

    function testDeployFundingVaultZeroAddress() public {
        vm.expectRevert(FairFund.FairFund__CannotBeAZeroAddress.selector);
        fairFund.deployFundingVault(address(0), address(1), 1, 10, block.timestamp + 1 days);
    }

    function testDeployFundingVaultTallyDateInPast() public {
        vm.warp(100 days);
        vm.expectRevert(FairFund.FairFund__TallyDateCannotBeInThePast.selector);
        fairFund.deployFundingVault(address(1), address(1), 1, 10, block.timestamp - 1 days);
    }

    function testDeployFundingVaultMinGreaterThanMax() public {
        vm.expectRevert(FairFund.FairFund__MinRequestableAmountCannotBeGreaterThanMaxRequestableAmount.selector);
        fairFund.deployFundingVault(address(1), address(1), 10, 1, block.timestamp + 1 days);
    }

    function testDeployFundingVaultSuccess() public {
        fairFund.deployFundingVault(address(1), address(1), 1, 10, block.timestamp + 1 days);
        assertEq(fairFund.getTotalNumberOfFundingVaults(), 1);
    }

    function testVotingTokenNameAndSymbol() public {
        fairFund.deployFundingVault(address(1), address(1), 1, 10, block.timestamp + 1 days);
        FundingVault fundingVault = FundingVault(fairFund.getFundingVault(1));
        VotingPowerToken votingToken = VotingPowerToken(fundingVault.getVotingPowerToken());
        assertEq(votingToken.name(), "Voting Power Token 1");
        assertEq(votingToken.symbol(), "VOTE_1");
    }

    function testVotingPowerTokenOwnership() public {
        fairFund.deployFundingVault(address(1), address(1), 1, 10, block.timestamp + 1 days);
        FundingVault fundingVault = FundingVault(fairFund.getFundingVault(1));
        VotingPowerToken votingToken = VotingPowerToken(fundingVault.getVotingPowerToken());
        assertEq(votingToken.owner(), address(fundingVault));
    }

    function testFundingVaultOwnership() public {
        fairFund.deployFundingVault(address(1), address(1), 1, 10, block.timestamp + 1 days);
        FundingVault fundingVault = FundingVault(fairFund.getFundingVault(1));
        assertEq(fundingVault.getDeployer(), address(fairFund));
    }

    function testSuccessfullDeploymentEmitEvent() public {
        vm.expectEmit(false, false, false, false);
        emit FundingVaultDeployed(address(0));
        fairFund.deployFundingVault(address(1), address(1), 1, 10, block.timestamp + 1 days);
    }

    function testGetFundingVault() public {
        fairFund.deployFundingVault(address(1), address(1), 1, 10, block.timestamp + 1 days);
        assertEq(fairFund.getFundingVault(1), fairFund.getFundingVault(1));
    }

    function testGetTotalNumberOfFundingVaults() public {
        fairFund.deployFundingVault(address(1), address(1), 1, 10, block.timestamp + 1 days);
        assertEq(fairFund.getTotalNumberOfFundingVaults(), 1);
    }
}
