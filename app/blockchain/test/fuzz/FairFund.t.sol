// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {FairFund} from "../../src/FairFund.sol";
import {FundingVault} from "../../src/FundingVault.sol";
import {VotingPowerToken} from "../../src/VotingPowerToken.sol";
import {DeployFairFund} from "../../script/DeployFairFund.s.sol";
import {DeployMockERC20} from "../../script/mocks/DeployMockERC20.s.sol";
import {HelperConfig} from "../../script/HelperConfig.s.sol";
import {MockERC20} from "../../src/mocks/MockERC20.sol";

contract FairFundTest is Test {
    HelperConfig helperConfig;
    FairFund fairFund;
    MockERC20 mockERC20;

    function setUp() external {
        DeployFairFund deployFairFund = new DeployFairFund();
        DeployMockERC20 deployMockERC20 = new DeployMockERC20();
        (fairFund, helperConfig) = deployFairFund.run();
        (mockERC20,) = deployMockERC20.run();
    }

    function testFuzzDeployFundingVault(
        address _fundingToken,
        // address _votingToken,
        uint256 _minRequestableAmount,
        uint256 _maxRequestableAmount,
        uint256 _tallyDate,
        address _owner
    ) public {
        vm.assume(_fundingToken != address(0));
        // vm.assume(_votingToken != address(0));
        vm.assume(_owner != address(0));
        vm.assume(_tallyDate > block.timestamp);
        vm.assume(_maxRequestableAmount > 0);
        vm.assume(_minRequestableAmount <= _maxRequestableAmount);

        fairFund.deployFundingVault(
            _fundingToken, address(mockERC20), _minRequestableAmount, _maxRequestableAmount, _tallyDate
        );

        uint256 totalVaults = fairFund.getTotalNumberOfFundingVaults();
        address fundingVaultAddress = fairFund.getFundingVault(totalVaults);
        assertEq(totalVaults, 1);
        assertTrue(fundingVaultAddress != address(0));
    }
}
