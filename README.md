# FairFund

FairFund is a blockchain based platform for community-driven funding. Users can deploy funding vaults, deposit funds, and submit proposals for funding. The platform uses a voting mechanism to decide which proposals receive funding.

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


Let:
- **V(p)** be the number of `votingPowerTokens` assigned to proposal `p`.
- **S** be the total supply of `votingPowerTokens`.
- **R** be the vault's balance of `fundingTokens`.

A proposal `p` is accepted if:
$$R\times \frac{V(p)}{S}\geq p.\text{minimumAmount}$$

The funding to be received by an accepted proposal `p` is:
$$\min(p.\text{maximumAmount}, R \times \frac{V(p)}{S})$$

The funding to be received by a rejected proposal `p` is:
$$0$$

Smart Contract: [sepolia chain](https://sepolia.etherscan.io/address/0x66b04c2d28042dc8efa9e512de8145374b930f37)
Frontend: https://fair-fund.vercel.app/

### Roadmap

#### Smart Contract Development
- [x] Create a README.
- [x] Update the smart contracts.
- [x] Conduct unit tests.
- [x] Conduct stateless and stateful fuzz testing.
- [x] Perform basic security review.

#### Off-Chain Development
- [x] Set up a Next.js project.
- [x] Design a database schema (Sponsor, Proposer, Proposal, Funding Vault, etc.).
- [x] Create UI for funding vault creation.
- [x] Develop UI for project submission.
- [x] Design project details page.
- [x] Build a general dashboard to display all the stats.
- [x] Build a dashboard for funding vault details and voting on the project.
- [ ] Implement funding vault status notifications functionality.

#### System Testing
- [ ] Test frontend functionalities.
- Perform integration testing for critical paths
  - [ ] Submitting proposals.
  - [ ] Voting.
  - [ ] Fund distribution.

#### Deployment 
- [ ] Finalize the deployment scripts.
- [ ] Deploy the smart contract on testnet for user validation testing.
- [ ] Fix Bugs.
- [ ] Implement a basic CI/CD pipeline.
- [ ] Deploy to the mainnet.

#### Additional Consideration
- [ ] Fund distribution automation using Chainlink Automation.
