# FundingVault
[Git Source](https://github.com/StabilityNexus/FairFund/blob/64b2ecb7c60a5a1802be455db0565e9d73fc2a00/app/blockchain/src/FundingVault.sol)

**Inherits:**
ReentrancyGuard

**Author:**
Aditya Bhattad

A contract that allows users to deposit funds and vote on proposals, after voting ends anyone can call distributeFunds to distribute the funds to the proposals
Whether a proposal is selected for receiving funds is decided using this formula:


Let:
`V(p)` be the number of votingPowerTokens assigned to proposal `p`

`S` be the total supply of votingPowerTokens

`R` be the vault's balance of fundingTokens

A proposal `p` is accepted iff `R * V(p)/S >= p.minimumAmount`.

The funding to be received by an accepted proposal `p` is `min(p.maximumAmount, R * V(p)/S)`.

The funding to be received by a rejected proposal `p` is `0`.


## State Variables
### s_proposalIdCounter

```solidity
uint256 private s_proposalIdCounter;
```


### i_fundingToken

```solidity
IERC20 private immutable i_fundingToken;
```


### i_votingToken

```solidity
IERC20 private immutable i_votingToken;
```


### i_votingPowerToken

```solidity
VotingPowerToken private immutable i_votingPowerToken;
```


### i_deployer

```solidity
FairFund private immutable i_deployer;
```


### s_minRequestableAmount

```solidity
uint256 private s_minRequestableAmount;
```


### s_maxRequestableAmount

```solidity
uint256 private s_maxRequestableAmount;
```


### s_totalBalanceAvailableForDistribution

```solidity
uint256 private s_totalBalanceAvailableForDistribution;
```


### s_totalFundsDistributed

```solidity
uint256 private s_totalFundsDistributed;
```


### s_fundsDistributed

```solidity
bool private s_fundsDistributed;
```


### i_tallyDate
*The date in which the tally will be taken as seconds since unix epoch*


```solidity
uint256 private immutable i_tallyDate;
```


### s_proposerToProposalIds

```solidity
mapping(address proposer => uint256[] proposalIds) private s_proposerToProposalIds;
```


### s_proposals

```solidity
mapping(uint256 proposalId => Proposal proposal) private s_proposals;
```


### s_votes

```solidity
mapping(uint256 proposalId => uint256 votes) private s_votes;
```


### s_voterToVotingTokens

```solidity
mapping(address voter => uint256 amountOfVotingTokens) private s_voterToVotingTokens;
```


### s_userToDistributionAmountDeposited

```solidity
mapping(address user => uint256 amountDeposited) private s_userToDistributionAmountDeposited;
```


## Functions
### tallyDatePassed


```solidity
modifier tallyDatePassed();
```

### constructor


```solidity
constructor(
    address _fundingToken,
    address _votingToken,
    address _votingPowerToken,
    uint256 _minRequestableAmount,
    uint256 _maxRequestableAmount,
    uint256 _tallyDate,
    address _deployer
);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_fundingToken`|`address`|The token that will be used to fund the proposals|
|`_votingToken`|`address`|The token that will be locked against voting power tokens, which allows the user to vote on proposals|
|`_votingPowerToken`|`address`|The token that will be minted when a user locks their voting tokens|
|`_minRequestableAmount`|`uint256`|The minimum amount of token that can be requested in proposal|
|`_maxRequestableAmount`|`uint256`|The maximum amount of token that can be requested in proposal|
|`_tallyDate`|`uint256`|The date in which the tally will be taken as seconds since unix epoch|
|`_deployer`|`address`|The address of the main fairfund smart contract|


### deposit

*Allows users to deposit fundingToken into the vault*


```solidity
function deposit(uint256 _amount) public nonReentrant;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_amount`|`uint256`|The amount of fundingToken to deposit|


### register

*locks votingToken from the user and mints votingPowerToken*


```solidity
function register(uint256 _amount) public nonReentrant;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_amount`|`uint256`|The amount of votingTokens to lock in order to receive votingPowerTokens|


### submitProposal

*Allows users to submit a proposal*


```solidity
function submitProposal(string memory _metadata, uint256 _minimumAmount, uint256 _maximumAmount, address _recipient)
    public
    nonReentrant
    returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_metadata`|`string`|The metadata of the proposal|
|`_minimumAmount`|`uint256`|The minimum amount of fundingToken requested|
|`_maximumAmount`|`uint256`|The maximum amount of fundingToken requested|
|`_recipient`|`address`|The address that will receive the fundingToken if the proposal is accepted|


### voteOnProposal

*Allows users to vote on a proposal*


```solidity
function voteOnProposal(uint256 _proposalId, uint256 _amount) public nonReentrant;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_proposalId`|`uint256`|The id of the proposal to vote on|
|`_amount`|`uint256`|The amount of votingToken to vote with|


### calculateFundingToBeReceived

*Calculates the amount of fundingToken to be received by a proposal*


```solidity
function calculateFundingToBeReceived(uint256 _proposalId) public view tallyDatePassed returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_proposalId`|`uint256`|The id of the proposal to calculate the funding for|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The amount of fundingToken to be received by the proposal|


### distributeFunds

Let:
`V(p)` be the number of votingPowerTokens assigned to proposal `p`
`S` be the total supply of votingPowerTokens
`R` be the vault's balance of fundingTokens
A proposal `p` is accepted iff `R * V(p)/S >= p.minimumAmount (bug: What if proposer sets the minimum amount to zero, their proposal will always get accepted)`.
The funding to be received by an accepted proposal `p` is `min(p.maximumAmount, R * V(p)/S)`.
The funding to be received by a rejected proposal `p` is `0`.

Can only be called after the tally date has passed

*Distributes the funds to the proposals*


```solidity
function distributeFunds() external nonReentrant tallyDatePassed;
```

### releaseVotingTokens

Can only be called after the tally date has passed

*Allows users to release their votingToken after the tally date has passed*


```solidity
function releaseVotingTokens() public nonReentrant tallyDatePassed;
```

### withdrawRemaining

Allows users to withdraw their proportional share of remaining funds after distribution

*This function can only be called after the tally date has passed and funds have been distributed*

*The function calculates the user's share based on their initial deposit and the remaining funds*

*State changes are made before the transfer to prevent reentrancy*

*Emits a RemainingFundsWithdrawn event upon successful withdrawal*

*This function does not take any parameters as it uses msg.sender to identify the user*


```solidity
function withdrawRemaining() public nonReentrant tallyDatePassed;
```

### getProposal


```solidity
function getProposal(uint256 _proposalId) public view returns (string memory, uint256, uint256, address);
```

### getProposalIdsByProposer


```solidity
function getProposalIdsByProposer(address _proposer) public view returns (uint256[] memory);
```

### getTotalProposals


```solidity
function getTotalProposals() public view returns (uint256);
```

### getMinRequestableAmount


```solidity
function getMinRequestableAmount() public view returns (uint256);
```

### getMaxRequestableAmount


```solidity
function getMaxRequestableAmount() public view returns (uint256);
```

### getTallyDate


```solidity
function getTallyDate() public view returns (uint256);
```

### getFundingToken


```solidity
function getFundingToken() public view returns (address);
```

### getVotingToken


```solidity
function getVotingToken() public view returns (address);
```

### getVotingPowerToken


```solidity
function getVotingPowerToken() public view returns (address);
```

### getTotalVotingPowerTokensMinted


```solidity
function getTotalVotingPowerTokensMinted() public view returns (uint256);
```

### getTotalVotingPowerTokensUsed


```solidity
function getTotalVotingPowerTokensUsed() public view returns (uint256);
```

### getTotalBalanceAvailbleForDistribution


```solidity
function getTotalBalanceAvailbleForDistribution() public view returns (uint256);
```

### getTotalFundsDistributed


```solidity
function getTotalFundsDistributed() public view returns (uint256);
```

### getVotingPowerOf


```solidity
function getVotingPowerOf(address _voter) public view returns (uint256);
```

### getDeployer


```solidity
function getDeployer() public view returns (address);
```

## Events
### FundingTokenDeposited

```solidity
event FundingTokenDeposited(address indexed from, uint256 indexed amount);
```

### RegisteredVoter

```solidity
event RegisteredVoter(address indexed voter, uint256 indexed amount);
```

### ProposalSubmitted

```solidity
event ProposalSubmitted(address indexed proposer, uint256 indexed proposalId);
```

### VotedOnProposal

```solidity
event VotedOnProposal(address indexed voter, uint256 indexed proposalId, uint256 indexed amount);
```

### ReleasedTokens

```solidity
event ReleasedTokens(address indexed voter, uint256 indexed amount);
```

### FundsDistributed

```solidity
event FundsDistributed(uint256 indexed proposalId, address indexed recipient, uint256 indexed amount);
```

### RemainingFundsWithdrawn

```solidity
event RemainingFundsWithdrawn(address indexed user, uint256 amount);
```

### PlatformFeeSubmitted

```solidity
event PlatformFeeSubmitted(address indexed platform, uint256 amount);
```

## Errors
### FundingVault__AmountCannotBeZero

```solidity
error FundingVault__AmountCannotBeZero();
```

### FundingVault__MaxRequestableAmountCannotBeLessThanMinRequestableAmount

```solidity
error FundingVault__MaxRequestableAmountCannotBeLessThanMinRequestableAmount();
```

### FundingVault__MinRequestableAmountCannotBeGreaterThanMaxRequestableAmount

```solidity
error FundingVault__MinRequestableAmountCannotBeGreaterThanMaxRequestableAmount();
```

### FundingVault__CannotBeAZeroAddress

```solidity
error FundingVault__CannotBeAZeroAddress();
```

### FundingVault__MetadataCannotBeEmpty

```solidity
error FundingVault__MetadataCannotBeEmpty();
```

### FundingVault__AmountExceededsLimit

```solidity
error FundingVault__AmountExceededsLimit();
```

### FundingVault__ProposalDoesNotExist

```solidity
error FundingVault__ProposalDoesNotExist();
```

### FundingVault__AlreadyVoted

```solidity
error FundingVault__AlreadyVoted();
```

### FundingVault__TallyDateNotPassed

```solidity
error FundingVault__TallyDateNotPassed();
```

### FundingVault__NotEnoughBalance

```solidity
error FundingVault__NotEnoughBalance();
```

### FundingVault__NoVotingPowerTokenMinted

```solidity
error FundingVault__NoVotingPowerTokenMinted();
```

### FundingVault__TransferFailed

```solidity
error FundingVault__TransferFailed();
```

### FundingVault__AlreadyDistributedFunds

```solidity
error FundingVault__AlreadyDistributedFunds();
```

### FundingVault__FundsNotDistributedYet

```solidity
error FundingVault__FundsNotDistributedYet();
```

### FundingVault__NoFundsToWithdraw

```solidity
error FundingVault__NoFundsToWithdraw();
```

### FundingVault__NoRemainingFundsToWithdraw

```solidity
error FundingVault__NoRemainingFundsToWithdraw();
```

### FundingVault__WithdrawableAmountTooSmall

```solidity
error FundingVault__WithdrawableAmountTooSmall();
```

## Structs
### Proposal

```solidity
struct Proposal {
    string metadata;
    uint256 minimumAmount;
    uint256 maximumAmount;
    address recipient;
}
```

