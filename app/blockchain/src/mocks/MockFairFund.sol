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
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {MockFundingVault} from "./MockFundingVault.sol";
import {MockVotingPowerToken} from "./MockVotingPowerToken.sol";

/**
 * @title FairFund
 * @author Aditya Bhattad
 * @notice This is the main FairFund contract that will be used for deployment and keeping track of all the funding vaults.
 */
contract MockFairFund {
    // Errors //
    error FairFund__CannotBeAZeroAddress();
    error FairFund__TallyDateCannotBeInThePast();
    error FairFund__MinRequestableAmountCannotBeGreaterThanMaxRequestableAmount();
    error FairFund__MaxRequestableAmountCannotBeZero();

    // State Variables //
    uint256 private s_fundingVaultIdCounter;
    mapping(uint256 fundingVaultId => address fundingVault) private s_fundingVaults;

    // Events //
    event FundingVaultDeployed(address indexed fundingVault);

    // Functions //

    /**
     * @param _fundingToken The token that will be used to fund the proposals
     * @param _votingToken The token that will be used to vote on the proposals
     * @param _minRequestableAmount The minimum amount that can be requested by a single proposal from the funding vault
     * @param _maxRequestableAmount The maximum amount that can be requested by a single proposal from the funding vault
     * @param _tallyDate The date when the voting will end and the proposals will be tallied
     * @param _owner The address of the owner of the funding vault, this address will be able to modify minimum and maximum requestable amounts
     */
    function deployFundingVault(
        address _fundingToken,
        address _votingToken,
        uint256 _minRequestableAmount,
        uint256 _maxRequestableAmount,
        uint256 _tallyDate,
        address _owner
    ) external returns (address) {
        if (_fundingToken == address(0) || _votingToken == address(0) || _owner == address(0)) {
            revert FairFund__CannotBeAZeroAddress();
        }
        if (_tallyDate < block.timestamp) {
            revert FairFund__TallyDateCannotBeInThePast();
        }
        if (_minRequestableAmount > _maxRequestableAmount) {
            revert FairFund__MinRequestableAmountCannotBeGreaterThanMaxRequestableAmount();
        }
        if (_maxRequestableAmount == 0) {
            revert FairFund__MaxRequestableAmountCannotBeZero();
        }

        s_fundingVaultIdCounter++;
        uint256 fundingVaultId = s_fundingVaultIdCounter;
        string memory fundingVaultIdString = Strings.toString(fundingVaultId);
        string memory votingPowerTokenName = string.concat("Voting Power Token ", fundingVaultIdString);
        string memory votingPowerTokenSymbol = string.concat("VOTE_", fundingVaultIdString);
        MockVotingPowerToken votingPowerToken = new MockVotingPowerToken(votingPowerTokenName, votingPowerTokenSymbol);
        MockFundingVault fundingVault = new MockFundingVault(
            _fundingToken,
            _votingToken,
            address(votingPowerToken),
            _minRequestableAmount,
            _maxRequestableAmount,
            _tallyDate,
            _owner
        );
        votingPowerToken.transferOwnership(address(fundingVault));
        s_fundingVaults[fundingVaultId] = address(fundingVault);
        emit FundingVaultDeployed(address(fundingVault));
        return address(fundingVault);
    }

    // Getters //
    function getFundingVault(uint256 _fundingVaultId) external view returns (address) {
        return s_fundingVaults[_fundingVaultId];
    }

    function getTotalNumberOfFundingVaults() external view returns (uint256) {
        return s_fundingVaultIdCounter;
    }
}
