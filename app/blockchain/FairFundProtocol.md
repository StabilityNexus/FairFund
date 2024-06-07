# FairFund Protocol

FairFund is a platform that allows users to deploy funding vaults.

Once a funding vault is deployed, anyone can deposit funds into it, and anyone can submit proposals to receive funding from the vault.

After the tally date, funds are distributed to the proposals.


## Specification

A funding vault is a contract with the following parameters:
* `fundingToken`: the ERC20 token that can be deposited and later distributed to the accepted proposals.
* `votingToken`: the ERC20 token that gives users the right to vote.
* `votingPowerToken`: the ERC20 token that measures the voting power of users.
* `minRequestableAmount`: the minimum amount of funds that a proposal may request.
* `maxRequestableAmount`: the maximum amount of funds that a proposal may request.
* `tallyDate`: date after which votes are counted.

A proposal is a struct with the following fields:
* `metadata: String`: URL where information about the proposal can be found.
* `minimumAmount: uint256`: minimum amount requested.
* `maximumAmount: uint256`: maximum amount requested.
* `receiverAddress: address`: address that should receive funds in case the proposal is accepted.

The funding vault contract should have the following functions:
* `deposit`: allows the message sender to deposit `fundingToken` into the vault.
* `register`: allows the message sender to lock votingTokens and receive a proportional amount of votingPowerTokens.
* `submitProposal` allows the message sender to submit a proposal. (Submitted proposals are stored in a mapping and their key in the mapping is their id.)
* `voteOnProposal` allows the message sender to vote on a submitted proposal by assigning some of his/her votingPowerTokens to the proposal.
* `calculateFundingToBeReceived`: can only be called after the tallyDate. Takes a proposal id as an argument and returns whether the proposal is accepted or not.
* TODO

Let:

* `V(p)` be the number of votingPowerTokens assigned to proposal `p`
* `S` be the total supply of votingPowerTokens
* `R` be the vault's balance of fundingTokens

A proposal `p` is accepted iff `R * V(p)/S >= p.minimumAmount`.

The funding to be received by an accepted proposal `p` is `min(p.maximumAmount, R * V(p)/S)`.
The funding to be received by a rejected proposal `p` is `0`.
