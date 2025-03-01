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
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {VotingPowerToken} from "./VotingPowerToken.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {FairFund} from "./FairFund.sol";

/**
 * @title FundingVault
 * @author Aditya Bhattad
 * @notice  A contract that allows users to deposit funds and vote on proposals, after voting ends anyone can call distributeFunds to distribute the funds to the proposals
 * Whether a proposal is selected for receiving funds is decided using this formula:
 * Let:
 * `V(p)` be the number of votingPowerTokens assigned to proposal `p`
 * `S` be the total supply of votingPowerTokens
 * `R` be the vault's balance of fundingTokens
 *
 * A proposal `p` is accepted iff `R * V(p)/S >= p.minimumAmount`.
 *
 * The funding to be received by an accepted proposal `p` is `min(p.maximumAmount, R * V(p)/S)`.
 * The funding to be received by a rejected proposal `p` is `0`.
 */
contract FundingVault is ReentrancyGuard {
    // Errors //
    error FundingVault__AmountCannotBeZero();
    error FundingVault__MaxRequestableAmountCannotBeLessThanMinRequestableAmount();
    error FundingVault__MinRequestableAmountCannotBeGreaterThanMaxRequestableAmount();
    error FundingVault__CannotBeAZeroAddress();
    error FundingVault__MetadataCannotBeEmpty();
    error FundingVault__AmountExceededsLimit();
    error FundingVault__ProposalDoesNotExist();
    error FundingVault__AlreadyVoted();
    error FundingVault__TallyDateNotPassed();
    error FundingVault__NotEnoughBalance();
    error FundingVault__NoVotingPowerTokenMinted();
    error FundingVault__TransferFailed();
    error FundingVault__AlreadyDistributedFunds();
    error FundingVault__FundsNotDistributedYet();
    error FundingVault__NoFundsToWithdraw();
    error FundingVault__NoRemainingFundsToWithdraw();
    error FundingVault__WithdrawableAmountTooSmall();
    error FundingVault__TallyDatePassed();
    // Type Declarations //
    struct Proposal {
        string metadata;
        uint256 minimumAmount;
        uint256 maximumAmount;
        address recipient;
    }

    // State Variables //
    uint256 private s_proposalIdCounter;
    IERC20 private immutable i_fundingToken;
    IERC20 private immutable i_votingToken;
    VotingPowerToken private immutable i_votingPowerToken;
    FairFund private immutable i_deployer;

    uint256 private s_minRequestableAmount;
    uint256 private s_maxRequestableAmount;
    uint256 private s_totalBalanceAvailableForDistribution;
    uint256 private s_totalFundsDistributed;
    bool private s_fundsDistributed;

    /**
     * @dev The date in which the tally will be taken as seconds since unix epoch
     */
    uint256 private immutable i_tallyDate;

    mapping(address proposer => uint256[] proposalIds) private s_proposerToProposalIds;
    mapping(uint256 proposalId => Proposal proposal) private s_proposals;
    mapping(uint256 proposalId => uint256 votes) private s_votes;
    mapping(address voter => uint256 amountOfVotingTokens) private s_voterToVotingTokens;
    mapping(address user => uint256 amountDeposited) private s_userToDistributionAmountDeposited;

    // Events //
    event FundingTokenDeposited(address indexed from, uint256 indexed amount);
    event RegisteredVoter(address indexed voter, uint256 indexed amount);
    event ProposalSubmitted(address indexed proposer, uint256 indexed proposalId);
    event VotedOnProposal(address indexed voter, uint256 indexed proposalId, uint256 indexed amount);
    event ReleasedTokens(address indexed voter, uint256 indexed amount);
    event FundsDistributed(uint256 indexed proposalId, address indexed recipient, uint256 indexed amount);
    event RemainingFundsWithdrawn(address indexed user, uint256 amount);
    event PlatformFeeSubmitted(address indexed platform, uint256 amount);

    modifier tallyDatePassed() {
        if (block.timestamp < i_tallyDate) {
            revert FundingVault__TallyDateNotPassed();
        }
        _;
    }
    modifier beforeTallyDate(){
        if ( block.timestamp>i_tallyDate){
            revert FundingVault__TallyDatePassed();
        }
        _;
    }


    // Functions //

    /**
     * @param _fundingToken The token that will be used to fund the proposals
     * @param _votingToken The token that will be locked against voting power tokens, which allows the user to vote on proposals
     * @param _votingPowerToken The token that will be minted when a user locks their voting tokens
     * @param _minRequestableAmount The minimum amount of token that can be requested in proposal
     * @param _maxRequestableAmount The maximum amount of token that can be requested in proposal
     * @param _tallyDate The date in which the tally will be taken as seconds since unix epoch
     * @param _deployer The address of the main fairfund smart contract
     */
    constructor(
        address _fundingToken,
        address _votingToken,
        address _votingPowerToken,
        uint256 _minRequestableAmount,
        uint256 _maxRequestableAmount,
        uint256 _tallyDate,
        address _deployer
    ) {
        i_tallyDate = _tallyDate;
        i_fundingToken = IERC20(_fundingToken);
        i_votingToken = IERC20(_votingToken);
        i_votingPowerToken = VotingPowerToken(_votingPowerToken);
        s_minRequestableAmount = _minRequestableAmount;
        s_maxRequestableAmount = _maxRequestableAmount;
        s_totalBalanceAvailableForDistribution = 0;
        s_totalFundsDistributed = 0;
        s_fundsDistributed = false;
        i_deployer = FairFund(_deployer);
    }

    /**
     * @dev Allows users to deposit fundingToken into the vault
     * @param _amount The amount of fundingToken to deposit
     */
    function deposit(uint256 _amount) public  nonReentrant beforeTallyDate {
        if (_amount <= 0) {
            revert FundingVault__AmountCannotBeZero();
        }
        s_totalBalanceAvailableForDistribution += _amount;
        i_fundingToken.transferFrom(msg.sender, address(this), _amount);
        s_userToDistributionAmountDeposited[msg.sender] = _amount;
        emit FundingTokenDeposited(msg.sender, _amount);
    }

    /**
     * @dev locks votingToken from the user and mints votingPowerToken
     * @param _amount The amount of votingTokens to lock in order to receive votingPowerTokens
     */
    function register(uint256 _amount) public nonReentrant beforeTallyDate {
        if (_amount <= 0) {
            revert FundingVault__AmountCannotBeZero();
        }
        if (i_votingToken.balanceOf(msg.sender) < _amount) {
            revert FundingVault__NotEnoughBalance();
        }
        i_votingToken.transferFrom(msg.sender, address(this), _amount);
        i_votingPowerToken.mint(msg.sender, _amount);
        s_voterToVotingTokens[msg.sender] += _amount;

        emit RegisteredVoter(msg.sender, _amount);
    }

    /**
     * @dev Allows users to submit a proposal
     * @param _metadata The metadata of the proposal
     * @param _minimumAmount The minimum amount of fundingToken requested
     * @param _maximumAmount The maximum amount of fundingToken requested
     * @param _recipient The address that will receive the fundingToken if the proposal is accepted
     */
    function submitProposal(string memory _metadata, uint256 _minimumAmount, uint256 _maximumAmount, address _recipient)
        public
        nonReentrant
        beforeTallyDate
        returns (uint256)
    {
        if (bytes(_metadata).length == 0) {
            revert FundingVault__MetadataCannotBeEmpty();
        }
        if (_minimumAmount < s_minRequestableAmount || _maximumAmount > s_maxRequestableAmount) {
            revert FundingVault__AmountExceededsLimit();
        }
        if (_minimumAmount > _maximumAmount) {
            revert FundingVault__MinRequestableAmountCannotBeGreaterThanMaxRequestableAmount();
        }
        if (_recipient == address(0)) {
            revert FundingVault__CannotBeAZeroAddress();
        }
        s_proposalIdCounter++;
        s_proposals[s_proposalIdCounter] = Proposal(_metadata, _minimumAmount, _maximumAmount, _recipient);
        s_proposerToProposalIds[msg.sender].push(s_proposalIdCounter);
        emit ProposalSubmitted(msg.sender, s_proposalIdCounter);
        return s_proposalIdCounter;
    }

    /**
     * @dev Allows users to vote on a proposal
     * @param _proposalId The id of the proposal to vote on
     * @param _amount The amount of votingToken to vote with
     */
    function voteOnProposal(uint256 _proposalId, uint256 _amount) public nonReentrant beforeTallyDate {
        if (_proposalId <= 0 || _proposalId > s_proposalIdCounter) {
            revert FundingVault__ProposalDoesNotExist();
        }
        uint256 votingPower = i_votingPowerToken.balanceOf(msg.sender);
        if (_amount > votingPower) {
            revert FundingVault__AmountExceededsLimit();
        }
        i_votingPowerToken.transferFrom(msg.sender, address(this), _amount);
        s_votes[_proposalId] += _amount;
        emit VotedOnProposal(msg.sender, _proposalId, _amount);
    }

    /**
     * @dev Calculates the amount of fundingToken to be received by a proposal
     * @param _proposalId The id of the proposal to calculate the funding for
     * @return The amount of fundingToken to be received by the proposal
     */
    function calculateFundingToBeReceived(uint256 _proposalId) public view tallyDatePassed returns (uint256) {
        if (_proposalId <= 0 || _proposalId > s_proposalIdCounter) {
            revert FundingVault__ProposalDoesNotExist();
        }

        uint256 totalVotingPowerTokens = i_votingPowerToken.totalSupply();
        if (totalVotingPowerTokens == 0) {
            revert FundingVault__NoVotingPowerTokenMinted();
        }
        // Floating point adjustment:
        // 1.totalVotes is multiplied by 1e18 to avoid rounding errors
        // 2.transferable is divided by 1e18 to get the actual amount
        uint256 totalVotes = s_votes[_proposalId] * 1e18;
        Proposal memory proposal = s_proposals[_proposalId];
        /**
         * Let:
         * `V(p)` be the number of votingPowerTokens assigned to proposal `p`
         * `S` be the total supply of votingPowerTokens
         * `R` be the vault's balance of fundingTokens
         * A proposal `p` is accepted iff `R * V(p)/S >= p.minimumAmount (bug: What if proposer sets the minimum amount to zero, their proposal will always get accepted)`.
         * The funding to be received by an accepted proposal `p` is `min(p.maximumAmount, R * V(p)/S)`.
         * The funding to be received by a rejected proposal `p` is `0`.
         */
        uint256 transferable = (s_totalBalanceAvailableForDistribution * (totalVotes / totalVotingPowerTokens)) / 1e18;

        bool isProposalAccepted = transferable >= proposal.minimumAmount;

        if (isProposalAccepted) {
            if (transferable > proposal.maximumAmount) {
                return proposal.maximumAmount;
            } else {
                return transferable;
            }
        } else {
            return 0;
        }
    }

    /**
     * @dev Distributes the funds to the proposals
     * @notice Can only be called after the tally date has passed
     */
    function distributeFunds() external nonReentrant tallyDatePassed {
        if (s_fundsDistributed) {
            revert FundingVault__AlreadyDistributedFunds();
        }
        s_fundsDistributed = true;
        uint256 platformFeePercentage = i_deployer.getPlatformFee();
        uint256 feeAmount = 0;

        for (uint256 i = 1; i <= s_proposalIdCounter; i++) {
            uint256 amount = calculateFundingToBeReceived(i);
            if (amount > 0) {
                Proposal memory proposal = s_proposals[i];
                uint256 fee = (amount * platformFeePercentage) / 100;
                amount -= fee;
                feeAmount += fee;
                bool success = i_fundingToken.transfer(proposal.recipient, amount);
                if (!success) {
                    revert FundingVault__TransferFailed();
                }
                s_totalFundsDistributed += amount + fee;
                emit FundsDistributed(i, proposal.recipient, amount);
            }
        }
        if (feeAmount > 0) {
            bool success = i_fundingToken.transfer(address(i_deployer), feeAmount);
            if (!success) {
                revert FundingVault__TransferFailed();
            }
            emit PlatformFeeSubmitted(address(i_deployer), feeAmount);
        }
    }

    /**
     * @dev Allows users to release their votingToken after the tally date has passed
     * @notice Can only be called after the tally date has passed
     */
    function releaseVotingTokens() public nonReentrant tallyDatePassed {
        uint256 votingPower = s_voterToVotingTokens[msg.sender];
        if (votingPower <= 0) {
            revert FundingVault__AmountCannotBeZero();
        }
        s_voterToVotingTokens[msg.sender] = 0;
        i_votingToken.transfer(msg.sender, votingPower);
        emit ReleasedTokens(msg.sender, votingPower);
    }

    /**
     * @notice Allows users to withdraw their proportional share of remaining funds after distribution
     * @dev This function can only be called after the tally date has passed and funds have been distributed
     * @dev The function calculates the user's share based on their initial deposit and the remaining funds
     * @dev State changes are made before the transfer to prevent reentrancy
     * @dev Emits a RemainingFundsWithdrawn event upon successful withdrawal
     * @dev This function does not take any parameters as it uses msg.sender to identify the user
     * @custom:throws FundingVault__FundsNotDistributedYet if funds haven't been distributed yet
     * @custom:throws FundingVault__NoFundsToWithdraw if the user has no funds to withdraw
     * @custom:throws FundingVault__NoRemainingFundsToWithdraw if there are no remaining funds to withdraw
     * @custom:throws FundingVault__WithdrawableAmountTooSmall if the calculated withdrawable amount is zero
     * @custom:throws FundingVault__TransferFailed if the token transfer fails
     */
    function withdrawRemaining() public nonReentrant tallyDatePassed {
        if (!s_fundsDistributed) {
            revert FundingVault__FundsNotDistributedYet();
        }

        uint256 userDepositedAmount = s_userToDistributionAmountDeposited[msg.sender];
        if (userDepositedAmount == 0) {
            revert FundingVault__NoFundsToWithdraw();
        }

        uint256 totalDistributableFunds = s_totalBalanceAvailableForDistribution;
        uint256 totalDistributedFunds = s_totalFundsDistributed;

        if (totalDistributableFunds <= totalDistributedFunds) {
            revert FundingVault__NoRemainingFundsToWithdraw();
        }

        uint256 remainingFunds = totalDistributableFunds - totalDistributedFunds;
        uint256 userShareRatio = (userDepositedAmount * 1e18) / totalDistributableFunds;
        uint256 userWithdrawableAmount = (userShareRatio * remainingFunds) / 1e18;

        if (userWithdrawableAmount == 0) {
            revert FundingVault__WithdrawableAmountTooSmall();
        }

        s_userToDistributionAmountDeposited[msg.sender] = 0;

        bool success = i_fundingToken.transfer(msg.sender, userWithdrawableAmount);
        if (!success) {
            revert FundingVault__TransferFailed();
        }

        emit RemainingFundsWithdrawn(msg.sender, userWithdrawableAmount);
    }

    // Getters //
    function getProposal(uint256 _proposalId) public view returns (string memory, uint256, uint256, address) {
        Proposal memory proposal = s_proposals[_proposalId];
        return (proposal.metadata, proposal.minimumAmount, proposal.maximumAmount, proposal.recipient);
    }

    function getProposalIdsByProposer(address _proposer) public view returns (uint256[] memory) {
        return s_proposerToProposalIds[_proposer];
    }

    function getTotalProposals() public view returns (uint256) {
        return s_proposalIdCounter;
    }

    function getMinRequestableAmount() public view returns (uint256) {
        return s_minRequestableAmount;
    }

    function getMaxRequestableAmount() public view returns (uint256) {
        return s_maxRequestableAmount;
    }

    function getTallyDate() public view returns (uint256) {
        return i_tallyDate;
    }

    function getFundingToken() public view returns (address) {
        return address(i_fundingToken);
    }

    function getVotingToken() public view returns (address) {
        return address(i_votingToken);
    }

    function getVotingPowerToken() public view returns (address) {
        return address(i_votingPowerToken);
    }

    function getTotalVotingPowerTokensMinted() public view returns (uint256) {
        return i_votingPowerToken.totalSupply();
    }

    function getTotalVotingPowerTokensUsed() public view returns (uint256) {
        return i_votingPowerToken.balanceOf(address(this));
    }

    function getTotalBalanceAvailbleForDistribution() public view returns (uint256) {
        return s_totalBalanceAvailableForDistribution;
    }

    function getTotalFundsDistributed() public view returns (uint256) {
        return s_totalFundsDistributed;
    }

    function getVotingPowerOf(address _voter) public view returns (uint256) {
        return s_voterToVotingTokens[_voter];
    }

    function getDeployer() public view returns (address) {
        return address(i_deployer);
    }
}