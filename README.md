# FairFund - Blockchain-based Community Funding Platform

## Table of Contents

1. [Introduction](#introduction)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Quick Start](#quick-start)
5. [Run Locally](#run-locally)
6. [Troubleshooting](#troubleshooting)
7. [Usage Guide](#usage-guide)
8. [Smart Contract Documentation](#smart-contract-documentation)
9. [Deployment](#deployment)
10. [Future Improvements](#future-improvements)
11. [Contributing](#contributing)
12. [Community](#community)

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

## Quick Start

**New to FairFund?** Get up and running in minutes with our [Quick Start Guide](QUICKSTART.md)!

```bash
# Clone, install, and run
git clone https://github.com/StabilityNexus/FairFund.git
cd FairFund

# See QUICKSTART.md for detailed setup instructions
```

**Key Resources:**
- 🚀 [Quick Start Guide](QUICKSTART.md) - Fastest setup path
- 📖 [Full Setup Guide](#run-locally) - Detailed instructions below
- 🛠️ [Troubleshooting](TROUBLESHOOTING.md) - Common issues and solutions
- 🤝 [Contributing](CONTRIBUTING.md) - How to contribute

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

5. **To start local instance of postgreSQL database (with docker)**:


   1. Start docker desktop
   2. Run `docker compose up`


6. **Run the Development Server**:


   ```bash
   npm run dev
   ```


7. **Access the Web App**:

   - Open your browser and navigate to `http://localhost:3000`.

## Troubleshooting

Encountering issues during setup? Check our comprehensive [Troubleshooting Guide](TROUBLESHOOTING.md) which covers:

- **Common Setup Issues**: Solutions for Foundry, Node.js, Docker, and more
- **Platform-Specific Problems**: Windows, macOS, and Linux troubleshooting
- **Environment Configuration**: Help with `.env` files and environment variables
- **Database Issues**: PostgreSQL and Prisma-related problems
- **Smart Contract Deployment**: Fixing Anvil and deployment errors
- **Video Tutorials**: Step-by-step video guides (coming soon!)

**Quick Links:**
- [Prerequisites Issues](TROUBLESHOOTING.md#prerequisites-issues)
- [Smart Contract Setup](TROUBLESHOOTING.md#smart-contract-setup-issues)
- [Frontend/Web App Issues](TROUBLESHOOTING.md#frontenddeweb-app-issues)
- [Still Need Help?](TROUBLESHOOTING.md#still-need-help)

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

We welcome contributions from developers of all experience levels! Whether you're fixing a bug, adding a feature, or improving documentation, your help is appreciated.

### Quick Start

1. **Read the Guidelines**: Check our [Contributing Guide](CONTRIBUTING.md) for detailed instructions
2. **Pick an Issue**: Browse [open issues](https://github.com/StabilityNexus/FairFund/issues) or create a new one
3. **Get Assigned**: Comment on the issue to get it assigned to you
4. **Fork & Code**: Fork the repo, make your changes, and submit a PR
5. **Get Reviewed**: Address feedback and get your PR merged!

### Important Documents

- 📖 [Contributing Guide](CONTRIBUTING.md) - Complete contribution workflow
- 📜 [Code of Conduct](CODE_OF_CONDUCT.md) - Community standards
- 🔒 [Security Policy](SECURITY.md) - Reporting vulnerabilities
- 📋 [Changelog](CHANGELOG.md) - Project history

### Guidelines Summary

**Code Quality:**
- Write clean, tested code
- Follow existing code style
- Add tests for new features
- Update documentation

**Pull Requests:**
- Small changes (<20 lines): Can submit without assignment
- Larger changes: Get issue assigned first
- Unassigned PRs will be closed
- Target `main` for small fixes, `develop` for features

**Timeline:**
- Small tasks: Complete within 5 days
- Complex tasks: Complete within 15 days
- Provide updates if extending beyond timeline
- PRs reviewed within 1-2 weeks

**Need Help?**
- 💬 Join [Discord](https://discord.gg/7jS9qJNjJv) `#fairfund` channel
- 📖 Read [Troubleshooting Guide](TROUBLESHOOTING.md)
- 🐛 Check [existing issues](https://github.com/StabilityNexus/FairFund/issues)

## Community

- [Stability Nexus](https://docs.stability.nexus/)
- [AOSSIE](https://aossie.org/about)
