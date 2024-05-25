// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {HelperConfig} from "../../script/HelperConfig.s.sol";
import {DeployFairFund} from "../../script/DeployFairFund.s.sol";
import {FairFund} from "../../src/FairFund.sol";
import {Test,console} from "forge-std/Test.sol";

contract FairFundTest is Test {

    HelperConfig helperConfig;
    FairFund fairFund;

    function setUp() external {
        DeployFairFund deployFairFund = new DeployFairFund();
        (fairFund,helperConfig) = deployFairFund.run();
    }

    function testDeployFairFund() external view {
        console.log("FairFund address: ", address(fairFund));
        console.log("HelperConfig address: ", address(helperConfig));
        assertTrue(address(fairFund) != address(0), "FairFund should be deployed");
        assertTrue(address(helperConfig) != address(0), "HelperConfig should be deployed");
    }

}   
