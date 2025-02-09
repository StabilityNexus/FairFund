// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {FairFundTreasury} from "../src/FairFundTreasury.sol";
import {HelperConfig} from "./HelperConfig.s.sol";

contract DeployFairFundTreasury is Script {
    function run() external returns (FairFundTreasury fairFundTreasury, HelperConfig helperConfig) {
        helperConfig = new HelperConfig();
        (uint256 deployerKey) = helperConfig.activeNetworkConfig();

        vm.startBroadcast(deployerKey);
        address[] memory payees = new address[](4);
        // change this
        payees[0] = address(0);
        payees[1] = address(0);
        payees[2] = address(0);
        payees[3] = address(0);

        uint256[] memory shares = new uint256[](4);
        shares[0] = 10; // Development (10%)
        shares[1] = 40; // Management (40%)
        shares[2] = 25; // Stability Nexus (25%)
        shares[3] = 25; // AOSSIE (25%)
        fairFundTreasury = new FairFundTreasury(payees, shares);
        vm.stopBroadcast();
    }
}
