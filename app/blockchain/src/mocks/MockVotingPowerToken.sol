// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

/**
 * Layout of the contract
 * version
 * imports
 * errors
 * interfaces, libraries, and contracts
 * type declarations
 * state variables
 * events
 * modifiers
 * functions
 *
 * layout of functions
 * constructor
 * receive function
 * fallback function
 * external functions
 * public functions
 * internal functions
 * private functions
 * view functions
 * pure functions
 * getters
 */
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MockVotingPowerToken is ERC20, Ownable {
    uint256 private _decimals;

    constructor(string memory _name, string memory _symbol, uint256 decimals_)
        ERC20(_name, _symbol)
        Ownable(msg.sender)
    {
        _decimals = decimals_;
    }

    function mint(address _to, uint256 _amount) external onlyOwner {
        _mint(_to, _amount);
    }

    function burn(address _of, uint256 _amount) external onlyOwner {
        _burn(_of, _amount);
    }

    function transferFrom(address from, address to, uint256 value) public override returns (bool) {
        if (msg.sender != owner()) {
            super.transferFrom(from, to, value);
        }
        _transfer(from, to, value);
        return true;
    }
}
