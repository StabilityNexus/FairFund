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

## Deployed Instances

#### Smart Contract: [Sepolia Testnet](https://sepolia.etherscan.io/address/0x345a143558a286c861ce5b7367bafaa5f62b14d6)
#### Frontend: https://fair-fund.vercel.app/

## Running the Project Locally

### Prerequisites

1. **Foundry Setup**: Ensure you have Foundry installed and setup. You can follow the instructions given here: [Foundry Docs](https://getfoundry.sh/).

### Smart Contracts

1. **Navigate to the Blockchain Directory**:
    ```bash
    cd app/blockchain
    ```

2. **Install Dependencies**:
    ```bash
    forge install
    ```

3. **Run Tests**:
    ```bash
    forge test
    ```

4. **Deploy to the Testnet**:
    - Ensure you have a `.env` file set up. You can use `.env.example` as a template.
    - Load the environment variables:
        ```bash
        source .env
        ```
    - Deploy the contract:
        ```bash
        forge script script/DeployFairFund.s.sol:DeployFairFund --rpc-url $SEPOLIA_RPC_URL --verify -vvvv --broadcast --legacy
        ```

### Frontend

1. **Navigate to the Web App Directory**:
    ```bash
    cd app/web-app
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Update the environment variables**:
    - Create a `.env` file in the `web-app` directory and update all the values. You can use `.env.example` as a template.

3. **To use local instance of postgreSQL database**: (Optional)
    - Start docker desktop
    - Run `docker compose up`

4. **Run the Development Server**:
    ```bash
    npm run dev
    ```

5. **Run the anvil blockchain locally in another shell**:
    ```bash
    anvil
    ```

6. **Deploy the mock smart contracts**:
    ```bash
    cd FairFund/app/blockchain make mock-all
    ```

7. **Access the Web App**:
    - Open your browser and navigate to `http://localhost:3000`.




