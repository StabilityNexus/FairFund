// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {HelperConfig} from "../../script/HelperConfig.s.sol";
import {DeployFairFund} from "../../script/DeployFairFund.s.sol";
import {DeployMockERC20} from "../../script/mocks/DeployMockERC20.s.sol";
import {FairFund} from "../../src/FairFund.sol";
import {FundingVault} from "../../src/FundingVault.sol";
import {MockERC20} from "../../src/mocks/MockERC20.sol";
import {VotingPowerToken} from "../../src/VotingPowerToken.sol";
import {Test} from "forge-std/Test.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract FairFundTest is Test {
    HelperConfig helperConfig;
    FairFund fairFund;
    MockERC20 mockERC20;

    event FundingVaultDeployed(address indexed fundingVault);

    function setUp() external {
        DeployFairFund deployFairFund = new DeployFairFund();
        DeployMockERC20 deployMockERC20 = new DeployMockERC20();
        (fairFund, helperConfig) = deployFairFund.run();
        (mockERC20,) = deployMockERC20.run();
    }

    function testDeployFairFund() public view {
        assertTrue(address(fairFund) != address(0), "FairFund should be deployed");
        assertTrue(address(helperConfig) != address(0), "HelperConfig should be deployed");
    }

    function testConstructorSetsTreasuryCorrectly() public {
        uint256 platformFee = 100;
        FairFund newFairFund = new FairFund(platformFee);
        address owner = newFairFund.owner();
        assertEq(newFairFund.getTreasury(), owner, "treasury not set correctly");
    }

    function testConstructorSetsPlatformFeesCorrectly() public {
        uint256 platformFee = 100;
        FairFund newFairFund = new FairFund(platformFee);
        assertEq(newFairFund.getPlatformFee(), platformFee, "platform fees not set correctly");
    }

    function testDeployFundingVaultZeroAddress() public {
        vm.expectRevert(FairFund.FairFund__CannotBeAZeroAddress.selector);
        fairFund.deployFundingVault(address(0), address(mockERC20), 1, 10, block.timestamp + 1 days);
    }

    function testDeployFundingVaultTallyDateInPast() public {
        vm.warp(100 days);
        vm.expectRevert(FairFund.FairFund__TallyDateCannotBeInThePast.selector);
        fairFund.deployFundingVault(address(1), address(mockERC20), 1, 10, block.timestamp - 1 days);
    }

    function testDeployFundingVaultMinGreaterThanMax() public {
        vm.expectRevert(FairFund.FairFund__MinRequestableAmountCannotBeGreaterThanMaxRequestableAmount.selector);
        fairFund.deployFundingVault(address(1), address(mockERC20), 10, 1, block.timestamp + 1 days);
    }

    function testUpdatePlatformFee() public {
        uint256 newFee = 200;
        address owner = fairFund.owner();
        vm.startPrank(owner);
        fairFund.updatePlatformFee(newFee);
        vm.stopPrank();
        assertEq(fairFund.getPlatformFee(), newFee, "platform fee not updated correctly ");
    }

    function testDeployPlatformFeesOnlyOwner() public {
        address wrongOwner = address(0x123456789ABCDEF);
        vm.startPrank(wrongOwner);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, wrongOwner));
        fairFund.updatePlatformFee(100);
        vm.stopPrank();
    }

    function testWithdrawPlatformFeeZeroAddress() public {
        address token = address(0);
        vm.expectRevert(FairFund.FairFund__CannotBeAZeroAddress.selector);
        fairFund.withdrawPlatformFee(token);
    }

    function testWithdrawPlatformFeeSuccessful() public {
        uint256 balance = 100000000000000000000; //100 eth
        mockERC20.mint(address(fairFund), balance);
        address treasury = fairFund.getTreasury();
        uint256 initialTreasuryBalance = mockERC20.balanceOf(treasury);
        vm.expectEmit(true, true, true, true);
        emit FairFund.TransferTokens(address(mockERC20), treasury, balance);
        fairFund.withdrawPlatformFee(address(mockERC20));
        assertEq(
            mockERC20.balanceOf(treasury),
            initialTreasuryBalance + balance,
            "treasury  balance should be increased by the balance amount "
        );
    }

    function testWithdrawPlatformFeeEmitsEvent() public {
        uint256 balance = 100000000000000000000;
        mockERC20.mint(address(fairFund), balance);
        address treasury = fairFund.getTreasury();
        vm.expectEmit(true, true, true, true);
        emit FairFund.TransferTokens(address(mockERC20), treasury, balance);
        fairFund.withdrawPlatformFee(address(mockERC20));
    }

    function testSetTreasurySuccess() public {
        address owner = fairFund.owner();
        vm.startPrank(owner);
        address newTreasury = address(0xAAAA);
        fairFund.setTreasury(newTreasury);

        assertEq(fairFund.getTreasury(), newTreasury, "treasury address not set successfully");
        vm.stopPrank();
    }

    function testSetTreasuryOnlyOwner() public {
        address wrongOwner = address(0xAAAA);
        vm.startPrank(wrongOwner);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, wrongOwner));
        fairFund.setTreasury(address(0xABAB));
        vm.stopPrank();
    }

    function testDeployFundingVaultSuccess() public {
        fairFund.deployFundingVault(address(1), address(mockERC20), 1, 10, block.timestamp + 1 days);
        assertEq(fairFund.getTotalNumberOfFundingVaults(), 1);
    }

    function testVotingTokenNameAndSymbol() public {
        fairFund.deployFundingVault(address(1), address(mockERC20), 1, 10, block.timestamp + 1 days);
        FundingVault fundingVault = FundingVault(fairFund.getFundingVault(1));
        VotingPowerToken votingToken = VotingPowerToken(fundingVault.getVotingPowerToken());
        assertEq(votingToken.name(), "Voting Power Token 1");
        assertEq(votingToken.symbol(), "VOTE_1");
    }

    function testVotingPowerTokenOwnership() public {
        fairFund.deployFundingVault(address(1), address(mockERC20), 1, 10, block.timestamp + 1 days);
        FundingVault fundingVault = FundingVault(fairFund.getFundingVault(1));
        VotingPowerToken votingToken = VotingPowerToken(fundingVault.getVotingPowerToken());
        assertEq(votingToken.owner(), address(fundingVault));
    }

    function testFundingVaultOwnership() public {
        fairFund.deployFundingVault(address(1), address(mockERC20), 1, 10, block.timestamp + 1 days);
        FundingVault fundingVault = FundingVault(fairFund.getFundingVault(1));
        assertEq(fundingVault.getDeployer(), address(fairFund));
    }

    function testSuccessfullDeploymentEmitEvent() public {
        vm.expectEmit(false, false, false, false);
        emit FundingVaultDeployed(address(0));
        fairFund.deployFundingVault(address(1), address(mockERC20), 1, 10, block.timestamp + 1 days);
    }

    function testGetFundingVault() public {
        fairFund.deployFundingVault(address(1), address(mockERC20), 1, 10, block.timestamp + 1 days);
        assertEq(fairFund.getFundingVault(1), fairFund.getFundingVault(1));
    }

    function testGetTotalNumberOfFundingVaults() public {
        fairFund.deployFundingVault(address(1), address(mockERC20), 1, 10, block.timestamp + 1 days);
        assertEq(fairFund.getTotalNumberOfFundingVaults(), 1);
    }
}
