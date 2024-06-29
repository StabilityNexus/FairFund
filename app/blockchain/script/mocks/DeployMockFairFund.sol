// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {MockFairFund} from "../../src/mocks/MockFairFund.sol";
import {HelperConfig} from "../HelperConfig.s.sol";

contract DeployMockERC20 is Script {
    function run() external returns (MockFairFund mockFairFund, HelperConfig helperConfig) {
        helperConfig = new HelperConfig();
        (uint256 deployerKey) = helperConfig.activeNetworkConfig();

        vm.startBroadcast(deployerKey);
        mockFairFund = new MockFairFund();
        vm.stopBroadcast();
        string memory deploymentInfo = string.concat('{"mockERC20":"', vm.toString(address(mockFairFund)), '"}');
        vm.writeFile("constants/anvil/fairFund_deployment.json", deploymentInfo);
    }
}
