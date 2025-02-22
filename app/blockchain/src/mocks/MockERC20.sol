// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    bool transferFalseNeeded = false;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function transfer(address to, uint256 value) public override returns (bool) {
        if (transferFalseNeeded) {
            return false;
        } else {
            return super.transfer(to, value);
        }
    }

    function updateTransferFalseNeeded(bool status) public {
        transferFalseNeeded = status;
    }
}
