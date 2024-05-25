// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";

contract HelperConfig is Script {

    NetworkConfig public activeNetworkConfig;
    uint256 public DEFAULT_ANVIL_PRIVATE_KEY = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80; 

    struct NetworkConfig {
        uint256 deployerKey;
    }

    constructor() {
        if (block.chainid == 11_155_111) {
            activeNetworkConfig = getSepoliaEthConfig();
        } else {
            activeNetworkConfig = getOrCreateAnvilEthConfig();
        }
    }

    function getSepoliaEthConfig() public view returns (NetworkConfig memory sepoliaNetworkConfig) {
        sepoliaNetworkConfig = NetworkConfig({
            deployerKey: vm.envUint("PRIVATE_KEY")
        });
    }

    function getOrCreateAnvilEthConfig() public view returns (NetworkConfig memory anvilNetworkConfig) {
        anvilNetworkConfig = NetworkConfig({
            deployerKey: DEFAULT_ANVIL_PRIVATE_KEY
        });
    }
}