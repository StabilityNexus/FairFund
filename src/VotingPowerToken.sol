// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract VotingPowerToken is ERC20 {
    // Errors //
    error VotingPowerToken__CannotBeAZeroAddress();
    error VotingPowerToken__NotAuthorized();

    // State Variables //
    address private immutable i_fundingVault;

    constructor(string memory _name, string memory _symbol, address _fundingVault) ERC20(_name, _symbol) {
        if (_fundingVault == address(0)) {
            revert VotingPowerToken__CannotBeAZeroAddress();
        }
        i_fundingVault = _fundingVault;
    }

    function mint(address _to, uint256 _amount) external {
        if (msg.sender != i_fundingVault) {
            revert VotingPowerToken__NotAuthorized();
        }
        _mint(_to, _amount);
    }
}
