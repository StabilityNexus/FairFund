// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {FundingVault} from "../../src/FundingVault.sol";
import {VotingPowerToken} from "../../src/VotingPowerToken.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract FundingVaultTest is Test {
    FundingVault fundingVault;
    MockERC20 fundingToken;
    MockERC20 votingToken;
    VotingPowerToken votingPowerToken;
    address owner = makeAddr("owner");
    address randomUser = makeAddr("randomUser");
    address randomUser1 = makeAddr("randomUser1");

    function setUp() external {
        fundingToken = new MockERC20("FundingToken", "FTK");
        votingToken = new MockERC20("VotingToken", "VTK");
        votingPowerToken = new VotingPowerToken("VotingPowerToken", "VOTE");
        fundingVault = new FundingVault(
            address(fundingToken),
            address(votingToken),
            address(votingPowerToken),
            0,
            10 ether,
            block.timestamp + 1 days,
            owner
        );
        votingPowerToken.transferOwnership(address(fundingVault));
    }

    function testFuzzDeposit(uint96 _amount) public {
        vm.assume(_amount > 0);
        fundingToken.mint(address(this), _amount);
        fundingToken.approve(address(fundingVault), _amount);
        fundingVault.deposit(_amount);
        assertEq(fundingToken.balanceOf(address(fundingVault)), _amount);
    }

    function testFuzzRegister(uint96 _amount) public {
        vm.assume(_amount > 0);
        votingToken.mint(address(this), _amount);
        votingToken.approve(address(fundingVault), _amount);
        fundingVault.register(_amount);

        assertEq(votingToken.balanceOf(address(fundingVault)), _amount);
        assertEq(votingPowerToken.balanceOf(address(this)), _amount);
        assertEq(fundingVault.getVotingPowerOf(address(this)), _amount);
    }
}
