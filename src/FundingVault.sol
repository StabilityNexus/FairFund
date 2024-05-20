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
 * receive function (if exists)
 * fallback function (if exists)
 * external functions
 * public functions
 * internal functions
 * private functions
 * view functions
 * pure functions
 * getters
 */

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract FundingVault is Ownable {

    // Errors //
    error FundingVault__AmountCannotBeZero();
    error FundingVault__MaxRequestableAmountCannotBeLessThanMinRequestableAmount();
    error FundingVault__MinRequestableAmountCannotBeGreaterThanMaxRequestableAmount();
    error FundingVault__CannotBeAZeroAddress();
    error FundingVault__TallyDateCannotBeInThePast();

    // Type Declarations //
    struct Proposal {
        string metadata;
        uint256 minimumAmount;
        uint256 maximumAmount;
        address recipient;
    }

    // State Variables //
    IERC20 private immutable i_fundingToken;
    IERC20 private immutable i_votingToken;
    IERC20 private immutable i_votingPowerToken;

    uint256 private s_minRequestableAmount;
    uint256 private s_maxRequestableAmount;

    /**
     * @dev The date in which the tally will be taken as seconds since unix epoch
     */
    uint256 private immutable i_tallyDate;

    mapping(address proposer => uint256[] proposalIds) private s_proposerToProposalIds;
    mapping(uint256 proposalId => Proposal proposal) private s_proposals;


    // Functions //
    constructor(
        address _fundingToken,
        address _votingToken,
        // address _votingPowerToken,
        uint256 _minRequestableAmount,
        uint256 _maxRequestableAmount,
        uint256 _tallyDate,
        address _owner
    ) Ownable(_owner) {
        if(_tallyDate < block.timestamp){
            revert FundingVault__TallyDateCannotBeInThePast();
        }
        if(_minRequestableAmount > _maxRequestableAmount){
            revert FundingVault__MinRequestableAmountCannotBeGreaterThanMaxRequestableAmount();
        }
        if(_maxRequestableAmount <= 0){
            revert FundingVault__AmountCannotBeZero();
        }
        if(_maxRequestableAmount <= _minRequestableAmount) {
            revert FundingVault__MaxRequestableAmountCannotBeLessThanMinRequestableAmount();
        }
        if(_fundingToken == address(0) || _votingToken == address(0) /*|| _votingPowerToken == address(0)*/){
            revert FundingVault__CannotBeAZeroAddress();
        }
        i_tallyDate = _tallyDate;
        i_fundingToken = IERC20(_fundingToken);
        i_votingToken = IERC20(_votingToken);
        // i_votingPowerToken = IERC20(_votingPowerToken);
        s_minRequestableAmount = _minRequestableAmount;
        s_maxRequestableAmount = _maxRequestableAmount;
    }


    function setMinRequestableAmount(uint256 _minRequestableAmount) public onlyOwner {
        if(_minRequestableAmount > s_maxRequestableAmount){
            revert FundingVault__MinRequestableAmountCannotBeGreaterThanMaxRequestableAmount();
        }
        s_minRequestableAmount = _minRequestableAmount;
    }

    function setMaxRequestableAmount(uint256 _maxRequestableAmount) public onlyOwner {
        if(_maxRequestableAmount <= 0){
            revert FundingVault__AmountCannotBeZero();
        }
        if(_maxRequestableAmount <= s_minRequestableAmount) {
            revert FundingVault__MaxRequestableAmountCannotBeLessThanMinRequestableAmount();
        }
        s_maxRequestableAmount = _maxRequestableAmount;
    }

    function deposit(uint256 _amount) public {
        if(_amount <= 0){
            revert FundingVault__AmountCannotBeZero();
        }
        i_fundingToken.transferFrom(msg.sender, address(this), _amount);
    }

    /**
     * @dev locks votingToken from the user and mints votingPowerToken
     * @param _amount The amount of votingTokens to lock in order to receive votingPowerTokens
     */
    function register(uint256 _amount) public {
        if(_amount <= 0){
            revert FundingVault__AmountCannotBeZero();
        }
        // TODO
    }

    function submitProposal(string memory _metadata, uint256 _minimumAmount, uint256 _maximumAmount, address _recipient) public {
        // TODO
    }

    function voteOnProposal(uint256 _proposalId, uint256 _amount) public {
        // TODO
    }

    function calculateFundingToBeReceived(uint256 _proposalId) public view returns (uint256) {
        // TODO
    }

    function distributeFunds(uint256 _proposalId) external {
        // TODO
    }

}