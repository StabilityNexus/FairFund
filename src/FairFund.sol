// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {FundingVault} from "./FundingVault.sol";
import {VotingPowerToken} from "./VotingPowerToken.sol";

contract FairFund is Ownable {
    // Errors //
    error FairFund__CannotBeAZeroAddress();
    error FairFund__TallyDateCannotBeInThePast();
    error FairFund__MaxRequestableAmountCannotBeLessThanMinRequestableAmount();
    error FairFund__MinRequestableAmountCannotBeGreaterThanMaxRequestableAmount();

    // State Variables //
    uint256 private s_fundingVaultIdCounter;

    // Events //
    event FundingVaultDeployed(address fundingVault);

    constructor() Ownable(msg.sender) {}

    function deployFundingVault(
        address _fundingToken,
        address _votingToken,
        uint256 _minRequestableAmount,
        uint256 _maxRequestableAmount,
        uint256 _tallyDate,
        address _owner
    ) external {
        if (_fundingToken == address(0) || _votingToken == address(0) || _owner == address(0)) {
            revert FairFund__CannotBeAZeroAddress();
        }
        if (_tallyDate < block.timestamp) {
            revert FairFund__TallyDateCannotBeInThePast();
        }
        if (_minRequestableAmount > _maxRequestableAmount) {
            revert FairFund__MinRequestableAmountCannotBeGreaterThanMaxRequestableAmount();
        }
        s_fundingVaultIdCounter++;
        uint256 fundingVaultId = s_fundingVaultIdCounter;
        string memory fundingVaultIdString = Strings.toString(fundingVaultId);
        string memory votingPowerTokenName = string.concat("Voting Power Token ", fundingVaultIdString);
        string memory votingPowerTokenSymbol = string.concat("VOTE_", fundingVaultIdString);
        VotingPowerToken votingPowerToken = new VotingPowerToken(votingPowerTokenName, votingPowerTokenSymbol);
        FundingVault fundingVault = new FundingVault(
            _fundingToken,
            _votingToken,
            address(votingPowerToken),
            _minRequestableAmount,
            _maxRequestableAmount,
            _tallyDate,
            _owner
        );
        votingPowerToken.transferOwnership(address(fundingVault));
        emit FundingVaultDeployed(address(fundingVault));
    }
}
