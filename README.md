Fair fund docs backup

# FairFund - Blockchain-based Community Funding Platform

## Table of Contents

1. [Introduction](#introduction)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Run Locally](#run-locally)
5. [Usage Guide](#usage-guide)
6. [Smart Contract Documentation](#smart-contract-documentation)
7. [Deployment](#deployment)
8. [Future Improvements](#future-improvements)
9. [Contributing](#contributing)
10. [Troublesooting](#troubleshooting)
11. [Community](#community)

## Introduction

FairFund is a blockchain based platform for community-driven funding. Users can deploy funding vaults, deposit funds, and submit proposals for funding. The platform uses a voting mechanism to decide which proposals receive how much funding.

## Technology Stack

- Frontend: Next.js, TailwindCSS, ShadCN UI
- Backend: Next.js API Routes, Prisma ORM, NextAuth, SIWE, Web3Modal
- Blockchain: Foundry, Solidity
- Database: PostgreSQL
- Other tools and libraries: Wagmi, Viem, React Hook Form

## Architecture

![fairfund 1](https://github.com/user-attachments/assets/ce0e7792-2e29-4a8a-8102-880d3974fab0)

## Run Locally

### Prerequisites

1. **Foundry Setup**: Ensure you have Foundry installed and setup. You can follow the instructions given here: [Foundry Docs](https://getfoundry.sh/).

2. **Node.js**: Ensure you have Node.js Installed. You can follow the instructions here: [Nodejs Docs](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs)

3. **Docker**: Docker allows you to build, test, and deploy applications quickly by packaging software into standardized units called containers. These containers include everything the software needs to run, such as libraries, system tools, code, and runtime. To get started with Docker, follow the [official guide](https://docs.docker.com/get-started/introduction/).

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

4. **Run Local Anvil Chain**:

   ```bash
   anvil
   ```

5. **Deploy Mock Smart Contracts**:

   ```bash
   make mock-all
   ```

   Note: This will automatically update relevant contract addresses and ABIs for smart contract in web-app folder.

6. **Deploy to the Testnet**: (Optional)
   - Ensure you have a `.env` file set up. You can use `.env.example` as a template.
   - Load the environment variables:
   ```bash
   source .env
   ```
   - Deploy the contract:
   ```bash
   make deploy-sepolia
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
   Create a `.env` file in the `web-app` directory and add all the values. You can use `.env.example` as a template.

   PostgreSQL:

   - If using Docker (with the provided docker-compose.yml), the defaults provided for `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING` provided in .env.example will work.
   - If using a local instance of PostgreSQL, update the `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING` with the correct connection url for the local postgreSQL.

   NextAuth:

   - Generate a secure `NEXTAUTH_SECRET` by running the following command in the terminal

   ```bash
   openssl rand -base64 32
   ```

   - For local development `NEXTAUTH_URL` will be `http://localhost:3000`

4. **To start local instance of postgreSQL database (with docker)**:

   1. Start docker desktop
   2. Run `docker compose up`

5. **Run the Development Server**:

   ```bash
   npm run dev
   ```

6. **Access the Web App**:

   - Open your browser and navigate to `http://localhost:3000`.

## Usage Guide

Our platform supports three types of users: Vault Creators, Proposal Creators, and Voters/Community Members. Here's how each user type can navigate and use the application:

### Vault Creators

https://github.com/user-attachments/assets/16922ace-8cf9-4558-9efe-3829d166e34a

1. **Getting Started**

   - On the landing page, click "Get Started" to access the dashboard
   - Connect your wallet and sign in with Ethereum

2. **Creating a Vault**

   - Click the "Create" button and select "Vault" from the dropdown
   - Choose a space for your vault (multiple vaults can exist in one space)
   - Enter the vault description, token configurations, and funding parameters
   - Review and submit the proposal (requires a wallet transaction)

3. **Optional: Add Funds**

   - After creation, you can immediately add funds to your vault

4. **Vault Management**
   - You'll be redirected to the vault page to view all details

### Proposal Creators

https://github.com/user-attachments/assets/d0ce617f-1ef3-493f-bd53-d1d238027ae6

1. **Getting Started**

   - On the landing page, click "Get Started" to access the dashboard
   - Connect your wallet and sign in with Ethereum

2. **Creating a Proposal**

   - Click the "Create" button and select "Proposal" from the dropdown
   - Search and select the vault you want to create a proposal for
   - Enter the proposal description, minimum and maximum request amounts, and recipient address
   - Review the information and submit

3. **Tracking Proposals**
   - View your created proposals in the "My Activity" page or on the vault details page

### Voters/Community Members

https://github.com/user-attachments/assets/39f4fc81-ac3a-4ec2-9aa3-21594a1eb1e5

1. **Accessing Vaults**

   - On the landing page, click "Get Started" to access the dashboard
   - Click "Spaces" in the navbar to view available spaces
   - Select a space and then choose a vault within that space

2. **Participating in a Vault**

   - On the vault page, register to vote
   - Deposit tokens for distribution
   - Create new proposals (if desired)
   - After the tally date, withdraw remaining funds (if applicable)

3. **Viewing Results**
   - After the tally date, results page will be accessible to view the distribution statistics and other vault-related information

## Smart Contract Documentation

Smart contract documentation can be found [here](/app/blockchain/README.md).

## Deployment

### Test Deployed Instances

- **Smart Contract**: 
   - Mainnets
      - [Polygon Mainnet](https://polygonscan.com/address/0xb6dc3af544303f41478821c0dfb9af57c278cb34)
   - Testnets
      - [ETC Mordor](https://etc-mordor.blockscout.com/address/0x0533670C3CEdbC6c36E0e567265575e15d499ebC)
      - [Polygon Amoy](https://www.oklink.com/amoy/address/0xf4aaaad23abe965ae584d98a95f5802dc142f32d)
- **Frontend**: [FairFund](https://fairfund.stability.nexus)

## Future Improvements

- Add support for multiple blockchains
- Audit smart contracts
- Refactor smart contracts for better readability and extensibility. [detailed issue](https://github.com/StabilityNexus/FairFund/issues/35)
- Implement functionality to sponser gas for voting and proposal creation
- Optimize smart contracts further
- Add comments functionality on proposals page
- Enable editing of space, proposal, and vault descriptions
- Implement moderation functionality for spaces (control who can create vaults and proposals)
- Add ability to delegate moderation functionality to users other than creator of the space
- Implement various fund distribution mechanisms

We welcome additional suggestions! Join our Discord: [Discord Link](https://discord.gg/7jS9qJNjJv)

## Contributing

1. Create an issue on GitHub
2. Discuss your ideas on our project's Discord channel `(#fairfund)` in [Stability Nexus Server](https://discord.gg/7jS9qJNjJv) (if required).
3. Wait for the issue to be assigned to you
4. Fork the repository
5. Set up the project locally using this [Run Locally Guide](#run-locally)
6. Create a new branch following this format: `type/brief-description`
   - Types: `fix`, `feat`, `chore`, `perf`, or `refactor`
   - Example: `feat/add-space-moderation-functionality`
7. Switch to the new branch
8. Make your changes
9. Commit your changes
10. Decide on the scope of the change:

- **Small changes** (minor fixes, documentation updates, small UI tweaks) → **Make a pull request directly to `main`**
- **Big changes** (new features, major refactors) → **Make a pull request to `develop`** branch

11. Provide a detailed description of your changes in the PR, including videos and images for visible UI changes.

### Important Guidelines

#### Code Quality and Testing

- Take your time to create high-quality PRs - do not commit code hastily
- Ensure all changes are thoroughly tested before submission
- Avoid introducing code smells
- Do not submit untested code as it complicates the review process
- Only include code in the commit that is intentional. Avoid using `git add .` to prevent unintended changes from being committed.

#### Pull Request Rules

- Small frontend changes (< 20 lines) or documentation updates can be submitted without prior assignment
- Unassigned PRs will be closed without review
- Check existing issues and PRs to avoid duplicating efforts
- Tag the maintainer if your PR is unattended for:
  - 1 week for small contributions
  - 2 weeks for larger contributions

#### Timeline and Progress

- Issues should be completed within:
  - 5 days for small tasks
  - 15 days for complex tasks
- Provide regular progress updates in issue/PR comments if work extends beyond expected timeline
- Issues may be reassigned if not completed within the specified timeframe

### Need Help?

If you have questions or need clarification, please ask on [Discord](https://discord.gg/7jS9qJNjJv).

## Troubleshooting

This guide will serve as a solution to the common problems which may arise while setting up the project so follow along-

### Common Setup Issues

NOTE: Always make sure your .env file created in the root folder and has correct credentials for smooth running of the project as followed by the .env.example file

#### 1. Docker Compose Fails to Start PostgreSQL

Case 1: Connection errors in web-app logs

Solutions: Verify Docker Desktop is running

- **Check if port 5432 is occupied:**

  \_ **macOS/Linux:** Open your terminal and run the command: `lsof -i :5432`. This command lists any processes using port 5432.

  - **Windows:** Open Command Prompt or PowerShell as an administrator and run: `netstat -ano | findstr :5432`. This will show the processes using the port along with their PIDs. You can then use Task Manager to identify and close the process.

  - **Verify Docker Compose Installation:** The error "command not found: docker-compose" indicates that Docker Compose isn't installed or accessible.

  - **If using Docker Desktop:** Docker Compose is usually included. Ensure it's enabled in Docker Desktop's settings. \* **If using a separate installation:** Follow the official Docker Compose installation guide for your operating system: [https://docs.docker.com/compose/install/]

```
lsof -i :5432
```

Remove existing containers:

```
docker-compose down -v
```

##### Note:

If facing hard times using docker then it would be wise to get postgres connection string and prisma connection url from neon.tech for free. By sigining up and creating a project name of your choice and getting your connection strings.

#### Prisma Database issues

If you are encountering issues like drift detected, then follow along

Errors like "Drift detected: Your database schema is not in sync with your migration history" can get encountered during the execution of npx prisma migrate dev. This typically occurs when manual changes are made to the database or when prisma db push is used to directly alter the database schema without updating migration files.

Solution:

1. Run this command cautiously to sync schema changes without migrations.

```
prisma db push
```

2. Review and update the 'dev script' in 'package.json' to ensure it aligns with the workflow. Avoid pushing changes directly to production scripts.

3. For persistent errors, reset migrations using:

   ```
   npx prisma migrate reset
   ```

   This will clear existing migrations and reapply them based on the current schema.

### Environment Credential Errors

If issues were noted in retrieving or configuring environment variables, particularly for PostgreSQL and NextAuth, then follow along.

Solutions:

Ensure all required environment variables are correctly set in the .env file:

1. PostgreSQL connection strings (POSTGRES_PRISMA_URL, POSTGRES_URL_NON_POOLING) must match your setup, whether local or cloud-based (e.g., Neon.tech).

2. Generate a secure NEXTAUTH_SECRET using:

```
openssl rand -base64 32
```

3. For local development, set NEXTAUTH_URL to http://localhost:3000.

##### 1.1 Dependency Installation Failures

- Problem: forge install errors
  - Solution: Ensure Foundry is updated to latest version

```
foundryup
```

- Verify network connectivity for GitHub dependencies

#### 2. Smart Contract Tests Fail

Case 2: forge test errors
Solutions: Update dependencies

```
forge update

# Restart Anvil chain

pkill anvil && anvil
```

#### 3. Frontend Environment Issues

Case 3: NextAuth/NEXTAUTH_SECRET errors
Solutions: Regenerate secret:

```
openssl rand -base64 32
```

Note: Ensure .env matches .env.example structure

#### 4. Wallet Connection Problems

Case 4: SIWE authentication failures
Solutions:
Clear browser cache
Verify wallet network matches application chain (Amoy Testnet)

### Codebase Assumptions

#### 1. Dependency Versions

The project assumes:
-> Node.js ≥18.x (LTS version recommended)
-> Foundry ≥0.2.0
-> Docker ≥24.0+

#### 2. Blockchain Knowledge

Developers should understand:
-> Foundry Framework
-> Basic Solidity patterns
-> ERC-20 token standards
-> Wallet authentication flows (SIWE)

- Contracts are deployed on Polygon Amoy testnet by default
- Test transactions require MATIC on Amoy network

#### 3. Local Environment

-> PostgreSQL is managed via Docker
-> All blockchain interactions use test ETH sepolia
-> Frontend auto-reloads contract ABIs after make mock-all

#### 4. Testing

-> Smart contracts use Foundry's cheatcodes
-> Frontend tests assume Metamask test accounts
-> End-to-end tests require local Anvil chain

#### 5. Common Configuration Pitfalls

- Anvil local chain must run on default port 8545
- Frontend expects contract ABIs in /web-app/abi/ directory
- All environment variables are case-sensitive

#### 6. Codebase Assumptions

- Foundry v0.2.0+ required for Solidity ^0.8.20 support
- PostgreSQL 15+ required for Prisma ORM compatibility

For additional support reach out to us via discord channel

## Community

- [Stability Nexus](https://docs.stability.nexus/)
- [AOSSIE](https://aossie.org/about)
