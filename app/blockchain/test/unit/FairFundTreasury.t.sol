// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {FairFundTreasury} from "../../src/FairFundTreasury.sol";
import {MockERC20} from "../../src/mocks/MockERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {DeployMockERC20} from "../../script/mocks/DeployMockERC20.s.sol";

contract FairFundTreasuryTest is Test {
    FairFundTreasury treasury;
    MockERC20 mockToken;

    address[] payees;
    uint256[] shares = [1, 1];
    address alice = address(0x1);
    address bob = address(0x2);

    event PayeeAdded(address account, uint256 shares);
    event PaymentReleased(address to, uint256 amount);
    event ERC20PaymentReleased(IERC20 indexed token, address to, uint256 amount);

    function setUp() public {
        DeployMockERC20 deployMockERC20 = new DeployMockERC20();
        payees.push(alice);
        payees.push(bob);
        (mockToken,) = deployMockERC20.run();
        treasury = new FairFundTreasury(payees, shares);
        vm.deal(address(treasury), 10 ether);
        mockToken.mint(address(treasury), 1000e18);
    }

    // Constructor Tests
    function testRevertsIfPayeesSharesLengthMismatch() public {
        address[] memory invalidPayees = new address[](1);
        uint256[] memory invalidShares = new uint256[](2);
        vm.expectRevert(FairFundTreasury.FairFundTreasury__PayeesAndSharesLengthMismatch.selector);
        new FairFundTreasury(invalidPayees, invalidShares);
    }

    function testRevertsIfNoPayees() public {
        address[] memory emptyPayees;
        uint256[] memory emptyShares;
        vm.expectRevert(FairFundTreasury.FairFundTreasury__NoPayees.selector);
        new FairFundTreasury(emptyPayees, emptyShares);
    }

    // Payee Management Tests
    function testInitialSharesDistribution() public view {
        assertEq(treasury.totalShares(), 2);
        assertEq(treasury.shares(alice), 1);
        assertEq(treasury.shares(bob), 1);
    }

    // ETH Payment Tests
    function testEthRelease() public {
        uint256 initialBalance = alice.balance;
        vm.prank(alice);
        treasury.release(payable(alice));

        assertEq(alice.balance - initialBalance, 5 ether);
        assertEq(treasury.released(alice), 5 ether);
        assertEq(treasury.totalReleased(), 5 ether);
    }

    function testRevertsIfNoSharesOrPaymentDue() public {
        vm.expectRevert(FairFundTreasury.FairFundTreasury__AccountHasNoShares.selector);
        treasury.release(payable(address(0x3)));

        vm.prank(alice);
        treasury.release(payable(alice)); // First release
        vm.expectRevert(FairFundTreasury.FairFundTreasury__AccountIsNotDuePayment.selector);
        vm.prank(alice);
        treasury.release(payable(alice)); // Second attempt
    }

    // ERC20 Payment Tests
    function testERC20Release() public {
        uint256 initialBalance = mockToken.balanceOf(alice);
        vm.prank(alice);
        treasury.release(mockToken, alice);

        assertEq(mockToken.balanceOf(alice) - initialBalance, 500e18);
        assertEq(treasury.released(mockToken, alice), 500e18);
        assertEq(treasury.totalReleased(mockToken), 500e18);
    }

    function testPaymentReleasedEvent() public {
        vm.expectEmit(true, false, false, false);
        emit PaymentReleased(alice, 5 ether);
        vm.prank(alice);
        treasury.release(payable(alice));
    }

    // Edge Cases
    function testMultipleFundingDeposits() public {
        vm.deal(address(treasury), address(treasury).balance + 10 ether); // Additional 10 ETH
        vm.prank(alice);
        treasury.release(payable(alice));
        assertEq(alice.balance, 10 ether); // 5 + 5 from two deposits
    }

    function testPartialWithdrawals() public {
        vm.prank(alice);
        treasury.release(payable(alice)); // Withdraw 5 ETH
        vm.deal(address(treasury), address(treasury).balance + 5 ether); // New deposit
        vm.prank(alice);
        treasury.release(payable(alice)); // Withdraw 2.5 ETH
        assertEq(alice.balance, 7.5 ether);
    }
}
