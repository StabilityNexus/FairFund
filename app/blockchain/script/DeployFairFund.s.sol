// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {FairFund} from "../src/FairFund.sol";
import {HelperConfig} from "./HelperConfig.s.sol";

contract DeployFairFund is Script {
    function run() external returns (FairFund fairFund, HelperConfig helperConfig) {
        helperConfig = new HelperConfig();
        (uint256 deployerKey) = helperConfig.activeNetworkConfig();

        vm.startBroadcast(deployerKey);
        uint256 platformFee = 5;
        fairFund = new FairFund(platformFee);
        vm.stopBroadcast();
        string memory deploymentInfo = string.concat('{"fairFund":"', vm.toString(address(fairFund)), '"}');
        vm.writeFile("../web-app/src/blockchain/deployments/sepolia/fairFund_deployment.json", deploymentInfo);
    }
}
