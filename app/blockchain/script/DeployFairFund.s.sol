// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {FairFund} from "../src/FairFund.sol";
import {HelperConfig} from "./HelperConfig.s.sol";

contract DeployFairFund is Script {
    function run() external returns (FairFund fairFund, HelperConfig helperConfig) {
        string memory chainName = vm.envOr("CHAIN_NAME", string("unknown"));

        helperConfig = new HelperConfig();
        (uint256 deployerKey) = helperConfig.activeNetworkConfig();

        vm.startBroadcast(deployerKey);
        uint256 platformFee = 5;
        fairFund = new FairFund(platformFee);
        vm.stopBroadcast();

        string memory path = string.concat("../web-app/src/blockchain/deployments/production/fairFund_deployment.json");

        string memory existingContent = vm.readFile(path);
        
        // If file is empty, initialize with an empty object
        if (bytes(existingContent).length == 0) {
            existingContent = "{}";
        }

        string memory newEntry = string.concat('"', chainName, '": "', vm.toString(address(fairFund)), '"');

        string memory updatedContent;

        if (bytes(existingContent).length > 2) { // If it's not just "{}"
            // Check if the chainName already exists in the existing content
            if (containsKey(existingContent, chainName)) {
                updatedContent = replaceKey(existingContent, chainName, vm.toString(address(fairFund)));
            } else {
                bytes memory existingBytes = bytes(existingContent);
                bytes memory slicedBytes = new bytes(existingBytes.length - 2);
                for (uint256 i = 0; i < slicedBytes.length; i++) {
                    slicedBytes[i] = existingBytes[i + 1]; // Skip the first byte and stop before the last byte
                }
                updatedContent = string.concat("{", string(slicedBytes), ",", newEntry, "}");
            }
        } else {
            updatedContent = string.concat("{", newEntry, "}");
        }

        vm.writeFile(path, updatedContent);
    }

    // Helper function to check if a key exists in the JSON string
    function containsKey(string memory json, string memory key) internal pure returns (bool) {
        bytes memory jsonBytes = bytes(json);
        bytes memory keyBytes = abi.encodePacked('"', key, '"'); // Ensure key is wrapped in quotes

        for (uint256 i = 0; i <= jsonBytes.length - keyBytes.length; i++) {
            bool found = true;
            for (uint256 j = 0; j < keyBytes.length; j++) {
                if (jsonBytes[i + j] != keyBytes[j]) {
                    found = false;
                    break;
                }
            }
            if (found) {
                return true;
            }
        }
        return false;
    }

    // Helper function to replace a key's value in the JSON string
    function replaceKey(string memory json, string memory key, string memory newValue) internal pure returns (string memory) {
        bytes memory jsonBytes = bytes(json);
        bytes memory keyBytes = abi.encodePacked('"', key, '"'); // Wrap key in quotes
        bytes memory valueBytes = abi.encodePacked(newValue); // Wrap new value in quotes

        uint256 keyIndex = 0;
        uint256 keyLength = keyBytes.length;

        // Find the key in the JSON
        for (uint256 i = 0; i <= jsonBytes.length - keyLength; i++) {
            bool found = true;
            for (uint256 j = 0; j < keyLength; j++) {
                if (jsonBytes[i + j] != keyBytes[j]) {
                    found = false;
                    break;
                }
            }
            if (found) {
                keyIndex = i;
                break;
            }
        }

        if (keyIndex == 0) {
            return json; // Key not found, return original JSON
        }

        // Find the start of the old value
        uint256 valueStart = keyIndex + keyLength + 1; // +1 for the colon
        while (jsonBytes[valueStart] != '"') {
            valueStart++;
        }
        valueStart++; // Move past the first quote

        // Find the end of the old value
        uint256 valueEnd = valueStart;
        while (jsonBytes[valueEnd] != '"') {
            valueEnd++;
        }

        // Construct the updated JSON
        bytes memory newJson = new bytes(jsonBytes.length - (valueEnd - valueStart) + valueBytes.length);
        uint256 index = 0;

        // Copy before the old value
        for (uint256 i = 0; i < valueStart; i++) {
            newJson[index++] = jsonBytes[i];
        }

        // Insert new value
        for (uint256 i = 0; i < valueBytes.length; i++) {
            newJson[index++] = valueBytes[i];
        }

        // Copy after the old value
        for (uint256 i = valueEnd; i < jsonBytes.length; i++) {
            newJson[index++] = jsonBytes[i];
        }

        return string(newJson);
    }
}
