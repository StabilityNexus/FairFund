// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test, Vm} from "forge-std/Test.sol";
import {IERC20Errors} from "@openzeppelin/contracts/interfaces/draft-IERC6093.sol";
import {VotingPowerToken} from "../../src/VotingPowerToken.sol";

contract VotingPowerTokenTest is Test {
    VotingPowerToken vpt;
    address holder = makeAddr("holder");
    address spender = makeAddr("spender");
    address receiver = makeAddr("receiver");

    function setUp() public {
        vpt = new VotingPowerToken("V", "V", 18); // this test contract is the owner
        vpt.mint(holder, 100e18);
    }

    function test_Spender_MovesExactlyTheAllowanceOnce() public {
        vm.prank(holder);
        vpt.approve(spender, 10e18);

        vm.recordLogs();
        vm.prank(spender);
        assertTrue(vpt.transferFrom(holder, receiver, 10e18));

        Vm.Log[] memory logs = vm.getRecordedLogs();
        assertEq(logs.length, 1); // one Transfer, no second move
        assertEq(logs[0].topics[0], keccak256("Transfer(address,address,uint256)"));
        assertEq(vpt.balanceOf(receiver), 10e18);
        assertEq(vpt.balanceOf(holder), 90e18);
        assertEq(vpt.allowance(holder, spender), 0);
    }

    function test_Spender_CannotMoveMoreThanAllowance() public {
        vm.prank(holder);
        vpt.approve(spender, 10e18);

        vm.prank(spender);
        vm.expectRevert(abi.encodeWithSelector(IERC20Errors.ERC20InsufficientAllowance.selector, spender, 10e18, 11e18));
        // forge-lint: disable-next-line(erc20-unchecked-transfer)
        vpt.transferFrom(holder, receiver, 11e18);
    }

    /// The owner is the funding vault. It pulls votes without an allowance, and only once.
    function test_Owner_MovesWithoutAllowanceOnce() public {
        assertTrue(vpt.transferFrom(holder, receiver, 10e18));
        assertEq(vpt.balanceOf(receiver), 10e18);
        assertEq(vpt.balanceOf(holder), 90e18);
    }
}
