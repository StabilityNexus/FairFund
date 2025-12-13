# 🛠️ Troubleshooting Guide

Welcome to the FairFund Troubleshooting Guide! This comprehensive resource will help you resolve common issues and get your development environment running smoothly.

> 💡 **Pro Tip**: Use `Ctrl+F` (or `Cmd+F` on macOS) to search for specific error messages in this guide.

## 📋 Table of Contents

1. [🚀 Quick Setup Checklist](#-quick-setup-checklist)
2. [🎯 Troubleshooting Decision Tree](#-troubleshooting-decision-tree)
3. [❓ Frequently Asked Questions (FAQ)](#-frequently-asked-questions-faq)
4. [⚙️ Prerequisites Issues](#️-prerequisites-issues)
5. [🔗 Smart Contract Setup Issues](#-smart-contract-setup-issues)
6. [🌐 Frontend/Web App Issues](#-frontenddeweb-app-issues)
7. [💾 Database Issues](#-database-issues)
8. [🔐 Environment Configuration Issues](#-environment-configuration-issues)
9. [💻 Platform-Specific Issues](#-platform-specific-issues)
10. [🎥 Video Tutorials](#-video-tutorials)
11. [📚 Additional Resources](#-additional-resources)
12. [💬 Still Need Help?](#-still-need-help)

---

## 🚀 Quick Setup Checklist

Before diving into troubleshooting, verify all prerequisites are met:

### Essential Tools
- ✅ **Foundry** installed and accessible in PATH (`forge --version`)
- ✅ **Node.js** v18 or higher installed (`node --version`)
- ✅ **npm** v9 or higher installed (`npm --version`)
- ✅ **Docker Desktop** installed and running (`docker --version`)
- ✅ **Git** installed (`git --version`)

### Configuration Files
- ✅ `app/blockchain/.env` (optional for local dev, required for testnet)
- ✅⚙️ Prerequisites Issues

### 🔨 Foundry Not Found

**Error Messages:**
```
forge: command not found
anvil: command not found
cast: command not found
'forge' is not recognized as an internal or external command
``
- ✅ **PostgreSQL** database running via Docker (Terminal 2)
- ✅ **Next.js dev server** running (Terminal 3)

### Verification Commands
```bash
# Check all tools at once
forge --version && node --version && docker --version && git --version

# Check if services are running
# Anvil should be on port 8545
curl http://localhost:8545

# PostgreSQL should be on port 5432
docker ps | grep postgres

# Next.js should be on port 3000
curl http://localhost:3000
```

---

## 🎯 Troubleshooting Decision Tree

Follow this flowchart to quickly identify where your issue lies:

```
📦 Are you having issues with...

├─ 🔧 Installation/Prerequisites?
│  ├─ Foundry not found → See "Prerequisites Issues" → Foundry section
│  ├─ Node.js version error → See "Prerequisites Issues" → Node.js section
│  └─ Docker not running → See "Prerequisites Issues" → Docker section
│
├─ ⛓️ Smart Contracts?
│  ├─ forge install fails → See "Smart Contract Issues" → Forge Install
│  ├─ forge test fails → See "Smart Contract Issues" → Test Failures
│  ├─ Anvil connection error → See "Smart Contract Issues" → Anvil Chain
│  └─ Deployment fails → See "Smart Contract Issues" → Mock Deployment
│
├─ 🌐 Frontend/Web App?
│  ├─ npm install fails → See "Frontend Issues" → npm install
│  ├─ Port already in use → See "Frontend Issues" → Port Issues
│  ├─ Prisma errors → See "Frontend Issues" → Prisma Issues
│  ├─ Wallet connection fails → See "Frontend Issues" → Wallet Connect
│  └─ Module not found → See "Frontend Issues" → Module Errors
│
├─ 💾 Database?
│  ├─ PostgreSQL won't start → See "Database Issues" → Docker Compose
│  ├─ Connection errors → See "Database Issues" → Connection String
│  └─ Migration fails → See "Database Issues" → Migration Conflicts
│
└─ 🔐 Environment Variables?
   ├─ Missing variables → See "Environment Issues" → Missing Variables
   ├─ ABIs not updated → See "Environment Issues" → Contract ABIs
   └─ Variables not loading → See "Environment Issues" → Not Loading
```

---

## ❓ Frequently Asked Questions (FAQ)

### General Questions

<details>
<summary><strong>Q: Do I need to install PostgreSQL separately, or does Docker handle it?</strong></summary>

**A:** Docker handles it! If you use the provided `docker-compose.yaml`, you don't need to install PostgreSQL separately. Just run `docker compose up` in the `app/web-app` directory.

However, if you prefer using a local PostgreSQL installation or a cloud database (Supabase, Neon, etc.), you can skip Docker and update the connection strings in your `.env` file.
</details>

<details>
<summary><strong>Q: Why do I need three separate terminals running?</strong></summary>

**A:** Each terminal runs a critical service:
- **Terminal 1**: Anvil (local blockchain) - keeps the blockchain node running
- **Terminal 2**: PostgreSQL via Docker (optional if auto-starting)
- **Terminal 3**: Next.js dev server - runs the frontend application

They run independently and need to stay active during development.
</details>

<details>
<summary><strong>Q: Can I skip the blockchain setup and just work on the frontend?</strong></summary>

**A:** No, the frontend depends on smart contracts. However, you can:
1. Run Anvil and deploy mock contracts once
2. Keep Anvil running in the background
3. Work on frontend code without redeploying contracts

Contracts only need redeployment when you modify Solidity code.
</details>

<details>
<summary><strong>Q: How do I know if my setup is working correctly?</strong></summary>

**A:** Run these verification steps:
```bash
# 1. Check Anvil is running
curl http://localhost:8545 -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
# Should return: {"jsonrpc":"2.0","id":1,"result":"0x..."}

# 2. Check contracts are deployed
cat app/web-app/src/blockchain/deployments/foundry.json
# Should show contract addresses

# 3. Check frontend is running
curl http://localhost:3000
# Should return HTML

# 4. Check database connection
cd app/web-app && npx prisma db pull
# Should succeed without errors
```
</details>

<details>
<summary><strong>Q: Do I need a real Ethereum wallet with funds for local development?</strong></summary>

**A:** No! Anvil provides test accounts with pre-funded ETH. When you connect your wallet to `localhost:8545`, you're using test funds, not real money.

For testnet deployment (Sepolia, etc.), you'll need testnet ETH from faucets.
</details>

<details>
<summary><strong>Q: What's the difference between `make mock-all` and regular deployment?</strong></summary>

**A:** 
- `make mock-all`: Deploys mock contracts to local Anvil for testing
- Regular deployment: Deploys production contracts to real networks (testnets/mainnets)

Mock contracts automatically update frontend configuration files, making local dev easier.
</details>

<details>
<summary><strong>Q: Why does `npm run dev` reset my database every time?</strong></summary>

**A:** The dev script includes `npx prisma db push --force-reset`. To preserve data:
```bash
# Option 1: Modify package.json dev script
"dev": "npx prisma db push && next dev"  # Remove --force-reset

# Option 2: Run commands separately
npx prisma db push  # Run once
npm run start      # Use this instead of npm run dev
```
</details>

<details>
<summary><strong>Q: Can I use Yarn or pnpm instead of npm?</strong></summary>

**A:** Yes, but npm is tested and recommended. If using Yarn/pnpm:
```bash
# Delete package-lock.json first
rm package-lock.json

# Then use your preferred package manager
yarn install  # or pnpm install
```
</details>

---

## Prerequisites Issues

### Foundry Not Found

**Issue**: `forge: command not found` or `anvil: command not found`

**Solution**:
```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash

# Follow the on-screen instructions, then run:
foundryup

# Verify installation
forge --version
anvil --version
```

**Windows Users**: If using Git Bash or WSL, ensure Foundry's binary directory is in your PATH:
```bash
# Add to ~/.bashrc or ~/.zshrc
expo📦 Node.js Version Issues

**Error Messages:**
```
The engine "node" is incompatible with this module
error:0308010C:digital envelope routines::unsupported
Node Sass does not yet support your current environment
``
source ~/.bashrc
```

### Node.js Version Issues

**Issue**: `The engine "node" is incompatible with this module`

**Solution**:
```bash
# Ch🐳 Docker Not Running

**Error Messages:**
```
Cannot connect to the Docker daemon
docker: command not found
docker compose: command not found
error during connect: This error may indicate that the docker daemon is not running
``
# You need Node.js v18 or higher. Install via nvm (recommended):
# Install nvm first (https://github.com/nvm-sh/nvm)
nvm install 18
nvm use 18

# Or download from https://nodejs.org/
```

### Docker Not Running

**Issue**: `Cannot connect to the Docker daemon` or `docker compose: command not found`

**S🔗 Smart Contract Setup Issues

### 📥 Forge Install Fails

**Error Messages:**
```
fatal: not a git repository
error: could not lock config file .git/config: No such file or directory
Submodule 'lib/forge-std' could not be updated
```
   docker ps
   ```
3. If using Docker Compose V2 (default in newer versions):
   ```bash
   # Use 'docker compose' instead of 'docker-compose'
   docker compose up
   ```

**Windows Users**: Make sure Docker Desktop is set to use WSL 2 backend (Settings → General → Use WSL 2 based engine)
⛓️ Anvil Chain Connection Issues

**Error Messages:**
```
Error: could not connect to network
ECONNREFUSED 127.0.0.1:8545
Failed to get chain ID
Network request failed
```
## Smart Contract Setup Issues

### Forge Install Fails

**Issue**: `forge install` fails with submodule errors

**Solution**:
```bash
cd app/blockchain

# Clean up any corrupted git submodules
rm -rf lib/
git submodule deinit -f .
git submodule update --init --recursive

# Then retry
forge install
```

### Anvil Chain Connection Issues

**Issue**: Cannot connect to local Anvil chain

**Solution**:
1. Ensure Anvil is running in a separate terminal:
   ```bash
   cd app/blockchain
   anvil
   ```
2. Verify it's running on the default port (8545)
3. Check if another process is using port 8545:
   ```bash
   # Windows
   netstat -ano | findstr :8545
   
   # macOS/Linux
   lsof -i :8545
   ```

### Mock Deployment Fails

**Issue**: `make mock-all` fails with gas estimation errors or transaction reverts

**Solution**:
```bash
# 1. Ensure Anvil is running in a separate terminal
# 2. Clear the Anvil chain and restart it
# Press Ctrl+C to stop Anvil, then restart:
anvil

# 3. In another terminal, retry deployment
cd app/blockchain
make mock-all
```

**Common Cause**: If the chain state is corrupted or previous transactions failed, restarting Anvil creates a fresh blockchain state.

### Missing .env File in Blockchain

**Issue**: Deployment scripts fail with missing environment variables

**Solution**:
```bash
cd app/blockchain

# Copy the example file
cp .env.example .env

# E🌐 Frontend/Web App Issues

### 📦 npm install Fails

**Error Messages:**
```
npm ERR! code ERESOLVE
npm ERR! ENOENT: no such file or directory
npm ERR! peer dependency issues
unable to resolve dependency tree
EACCES: permission denied
```

### Forge Test Failures

**Issue**: Tests fail with unexpected errors

**Solution**:
```bash
cd app/blockchain

# Run with verbose output to see detailed errors
forge test -vvv

# Run specific test file
forge test --match-path test/unit/FairFund.t.sol -vvv

# If compilation fails, try cleaning and rebuilding
forge clean
forge build
forge test
```

---

## Frontend/Web App Issues

### npm install Fails

**Issue**: `npm install` fails with dependency resolution errors

**Solution**:
```bash
cd app/web-app

# Clear npm cache
npm cache clean --force

# Delete existing node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Retry installation
npm install

# If still failing, try with legacy peer deps
npm install --legacy-peer-deps
```

**Windows Users**: Run your terminal as Administrator if you encounter permission errors.

### Port 3000 Already in Use

**Issue**: `Port 3000 is already in use`

**Solution**:
```bash
# Windows - Find and kill the process
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Prisma Generate/Migration Issues

**Issue**: `Prisma schema not found` or migration errors

**Solution**:
```bash
cd app/web-app

# Generate Prisma client
npx prisma generate

# If migrations fail, ensure database is running
docker compose up -d

# Push schema to database (development)
npx prisma db push

# Or run migrations (production)
npx prisma migrate deploy

# Reset database if needed (WARNING: deletes all data)
npx prisma migrate reset
```

### NextAuth Configuration Issues

**Issue**: `NEXTAUTH_SECRET` is missing or NextAuth fails

**Solution**:
```bash
cd app/web-app

# Generate a secure secret (Git Bash, macOS, or Linux)
openssl rand -base64 32

# Windows PowerShell alternative
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Add the output to your .env file:
# N💾 Database Issues

### 🐘 Docker Compose PostgreSQL Not Starting

**Error Messages:**
```
Error response from daemon: driver failed programming external connectivity
Bind for 0.0.0.0:5432 failed: port is already allocated
container exited with code 1
database system was shut down
```
**Issue**: Wallet connection fails or shows "Invalid Project ID"

**Solution**:
1. Go to [Reown Cloud](https://cloud.reown.com/) (formerly WalletConnect)
2. Create a free account
3. Create a new project
4. Copy the Project ID
5. Add to `app/web-app/.env`:
   ```
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here
   ```

### Module Not Found Errors

**Issue**: `Module not found: Can't resolve '@/components/...'`

**Solution**:
```bash
cd app/web-app

# Ensure TypeScript paths are configured correctly
# Check tsconfig.json has:
# "paths": { "@/*": ["./src/*"] }

# Restart the development server
npm run dev
```

---

## Database Issues

### Docker Compose PostgreSQL Not Starting

**Issue**: `docker compose up` fails or PostgreSQL container exits immediately

**Solution**:
```bash
cd app/web-app

# Check container logs
docker compose logs postgres

# Common fixes:
# 1. Port 5432 already in use
# Windows
netstat -ano | findstr :5432
# Stop the conflicting service or change port in docker-compose.yaml

# 2. Remove old volumes and restart
docker compose down -v
docker compose up -d

# 3. Verify Docker has enough resources
# Docker Desktop → Settings → Resources (min 2GB RAM, 2 CPUs)
```

###🔐 Environment Configuration Issues

### 🚫 Missing Environment Variables

**Error Messages:**
```
Environment variable "NEXTAUTH_SECRET" is not defined
Missing environment variable: NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
POSTGRES_PRISMA_URL is required
Cannot find module or its corresponding type declarations
```

For **Docker setup** (default), use:
```env
POSTGRES_PRISMA_URL="postgres://postgres:development@localhost:5432/dev-db"
POSTGRES_URL_NON_POOLING="postgres://postgres:development@localhost:5432/dev-db"
```

For **local PostgreSQL**:
```env
# Format: postgres://username:password@host:port/database
POSTGRES_PRISMA_URL="postgres://your_username:your_password@localhost:5432/fairfund_dev"
POSTGRES_URL_NON_POOLING="postgres://your_username:your_password@localhost:5432/fairfund_dev"
```

**Windows Users**: If using localhost doesn't work, try `127.0.0.1` instead.

### Database Migration Conflicts

**Issue**: Prisma migration fails with "schema drift detected"

**Solution**:
```bash
cd app/web-app

# Development: Force push schema
npx prisma db push --force-reset

# Production: Resolve conflicts manually
npx prisma migrate resolve --applied <migration_name>

# Or create a new migration
npx prisma migrate dev --name fix_schema_conflict
```

---

## Environment Configuration Issues

### Missing Environment Variables

**Issue**: App crashes with "Environment variable X is not defined"

**Solution**:
```bash
# Web App - Check required variables
cd app/web-app
cat .env.example  # Review all required variables

# Ensure your .env file has ALL of these:
# - NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
# - NEXTAUTH_SECRET
# - NEXTAUTH_URL
# - POSTGRES_PRISMA_URL
# - POSTGRES_URL_NON_POOLING

# Blockchain - Check required variables (for testnet deployment only)
cd app/blockchain
cat💻 Platform-Specific Issues

### 🪟 Windows: Command Not Found in Git Bash

**Error Messages:**
```
bash: make: command not found
'make' is not recognized as an internal or external command
bash: openssl: command not found
```
```

### Smart Contract ABIs Not Updated

**Issue**: Frontend shows "Contract method not found" or outdated ABI errors

**Solution**:
```bash
# The `make mock-all` command automatically updates ABIs
cd app/blockchain
make mock-all

# This copies:
# - Contract addresses to app/web-app/src/blockchain/deployments/foundry.json
# - ABIs to app/web-app/src/blockchain/deployments/abis/

# Verify files were updated:
ls -la ../web-app/src/blockchain/deployments/
```

### Environment Variables Not Loading

**Issue**: Variables in `.env` are not being read by the app

**Solution**:
```bash
# 1. Restart the development server (required!)
# Stop the server (Ctrl+C) and run again:
npm run dev

# 2. Verify .env is in the correct location
# web-app/.env (NOT in the root directory)

# 3. Check variable naming:
# - Browser-accessible: NEXT_PUBLIC_*
# - Server-only: No NEXT_PUBLIC_ prefix

# 4. Never commit .env files (check .gitignore)
```

---

## Platform-Specific Issues

### Windows: Command Not Found in Git Bash

**Issue**: Commands like `make`, `openssl`, or Foundry commands not found

**Solution**:
```bash
# Option 1: Use WSL (Windows Subsystem for Linux) - Recommended
# Install WSL and Ubuntu from Microsoft Store
# Run all commands inside WSL terminal

# Option 2: Install make for Windows
# Download from: http://gnuwin32.sourceforge.net/packages/make.htm
# Add to PATH: C:\Program Files (x86)\GnuWin32\bin

# Option 3: Use PowerShell equivalents
# Instead of: make mock-all
# Run individual commands from the Makefile manually
```

### Windows: Line Ending Issues (CRLF vs LF)

**Issue**: Git shows all files as modified or scripts fail

**Solution**:
```bash
# Configure git to handle line endings
git config --global core.autocrlf true

# For existing repo, normalize line endings
git add --renormalize .
git commit -m "Normalize line endings"
```

### macOS: Permission Denied

**Issue**: `EACCES: permission denied` when running npm or commands

**Solution**:
```bash
# Don't use sudo with npm!
# Fix npm permissions properly:

# 1. Create a directory for global packages
mkdir ~/.npm-global

# 2. Configure npm to use this directory
npm config set prefix '~/.npm-global'

# 3. Add to PATH (add to ~/.zshrc or ~/.bash_profile)
export PATH=~/.npm-global/bin:$PATH

# 4. Reload shell
source ~/.zshrc  # or source ~/.bash_profile

# 5. Retry npm install
npm install
```

### macOS: Homebrew Issues with Foundry

**Issue**: Foundry installed via Homebrew has issues

**Solution**:
```bash
# Uninstall Homebrew version
brew uninstall foundry

# Install using foundryup (recommended)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Verify
which forge  # Should show ~/.foundry/bin/forge
```

### Linux: Docker Permission Denied

**Issue**: `permission denied while trying to connect to Docker daemon`

**Solution**:
```bash
# Add your user to docker group
sudo usermod -aG docker $USER

# Log out and log back in, then verify
docker ps

# Alternative: Use docker with sudo (not recommended)
sudo docker compose up
```

---

## Video Tutorials

### Setup Video Walkthrough

> **Coming Soon!** We're working on a comprehensive video tutorial that will guide you through:
> - Installing prerequisites (Foundry, Node.js, Docker)
> - Setting up the blockchain development environment
> - Deploying mock smart contracts locally
> - Configuring the frontend application
> - Running the complete application stack
> - Common troubleshooting scenarios

**In the meantime**, you can:
- Follow our [written documentation](README.md#run-locally)
- Join our [Discord community](https://discord.gg/7jS9qJNjJv) for live help in the `#fairfund` channel
- Watch individual component demos in the [Usage Guide](README.md#usage-guide)

### Quick Start Video (5 minutes)

*Placeholder for quick setup video covering the most common setup path*

### Deep Dive Videos

*Placeholder for detailed videos on:*
- Smart contract architecture and testing
- Frontend structure and key components
- Database schema and migrations
- Deployment to testnets and production

**Want to contribute?** If you'd like to create video tutorials for the community, please reach out on [Discord](https://discord.gg/7jS9qJNjJv)!

---

## � Common Assumptions Clarified

### About the Codebase

<details>
<summary><strong>Monorepo Structure</strong></summary>

FairFund is organized as a monorepo with two main components:
- **`app/blockchain/`**: Smart contracts (Solidity, Foundry)
  - `src/`: Contract source code
  - `test/`: Unit and fuzz tests
  - `script/`: Deployment scripts
- **`app/web-app/`**: Frontend application (Next.js, React)
  - `src/app/`: Pages and API routes
  - `src/components/`: React components
  - `src/blockchain/`: Contract ABIs and addresses
</details>

<details>
<summary><strong>Development vs Production</strong></summary>

- **Local Development**: 
  - Uses Anvil (Foundry's local Ethereum node)
  - Mock contracts deployed with `make mock-all`
  - Fast, free transactions with unlimited test ETH
  - Database resets on each `npm run dev` by default

- **Production/Testnet**:
  - Connects to real networks (Sepolia, Polygon Amoy, etc.)
  - Requires real testnet ETH from faucets
  - Transactions cost gas (testnet ETH)
  - Database persists between deployments
</details>

<details>
<summary><strong>Data Storage</strong></summary>

- **On-Chain (Blockchain)**:
  - Vaults, proposals, votes
  - Token balances
  - Immutable and transparent

- **Off-Chain (PostgreSQL)**:
  - Spaces (organizational groups)
  - User profiles and sessions
  - UI preferences
  - Faster queries, cheaper storage
</details>

<details>
<summary><strong>Authentication Flow</strong></summary>

FairFund uses **SIWE (Sign-In with Ethereum)**:
1. User connects wallet (MetaMask, etc.)
2. Signs a message to prove ownership
3. NextAuth creates a session
4. No passwords needed!
</details>

### About Dependencies

<details>
<summary><strong>Why Foundry?</strong></summary>

**Foundry** is a fast, modern toolkit for Ethereum development:
- **`forge`**: Compiles Solidity and runs tests (Rust-based, very fast)
- **`anvil`**: Local Ethereum node (like Ganache but faster)
- **`cast`**: CLI for interacting with contracts
- **Why not Hardhat?** Foundry is faster and tests are written in Solidity
</details>

<details>
<summary><strong>Why Docker?</strong></summary>

Docker provides:
- ✅ Consistent PostgreSQL setup across all platforms
- ✅ No need to install PostgreSQL locally
- ✅ Easy cleanup with `docker compose down -v`
- ✅ Isolated environment

**Don't want Docker?** Install PostgreSQL locally and update connection strings in `.env`.
</details>

<details>
<summary><strong>Wallet Connect (Reown)</strong></summary>

Required for connecting Web3 wallets:
- Free project ID from [cloud.reown.com](https://cloud.reown.com/)
- Enables MetaMask, Rainbow, Coinbase Wallet, etc.
- Required even for local development
</details>

### About the Development Workflow

<details>
<summary><strong>Correct Startup Order</strong></summary>

Always start services in this order:

```bash
# Terminal 1: Start blockchain
cd app/blockchain
anvil

# Terminal 2: Deploy contracts (after Anvil is running)
cd app/blockchain
make mock-all

# Terminal 3: Start frontend (after contracts deployed)
cd app/web-app
docker compose up -d  # Start database
npm run dev          # Start Next.js
```

**Why this order?** Frontend needs contract addresses → contracts need blockchain → blockchain needs to start first!
</details>

<details>
<summary><strong>Auto-Generated Files (Don't Edit!)</strong></summary>

These files are automatically generated by `make mock-all`:
- ❌ `app/web-app/src/blockchain/deployments/foundry.json`
- ❌ `app/web-app/src/blockchain/deployments/abis/*.json`

**Why?** They're overwritten on every deployment. Edit the source contracts in `app/blockchain/src/` instead.
</details>

<details>
<summary><strong>Database Auto-Reset</strong></summary>

By default, `npm run dev` runs:
```json
"dev": "npx prisma db push --force-reset && next dev"
```

This **deletes all database data** on every start!

**To preserve data**:
```bash
# Option 1: Use start instead
npm run build
npm run start

# Option 2: Modify package.json
"dev": "npx prisma db push && next dev"  # Remove --force-reset
```
</details>

<details>
<summary><strong>When to Redeploy Contracts</strong></summary>

Redeploy contracts when you:
- ✅ Modify any `.sol` file in `app/blockchain/src/`
- ✅ Change constructor parameters
- ✅ Add new contracts

Don't need to redeploy when:
- ❌ Changing frontend code
- ❌ Updating CSS/styles
- ❌ Modifying API routes
- ❌ Database schema changes
</details>

---

## �📚 Additional Resources

### 📖 Documentation Links
- [Main Project README](README.md)
- [Smart Contract Documentation](app/blockchain/README.md)
- [Foundry Book](https://book.getfoundry.sh/) - Comprehensive Foundry guide
- [Next.js Documentation](https://nextjs.org/docs) - Next.js framework docs
- [Prisma Documentation](https://www.prisma.io/docs) - Database ORM guide
- [Wagmi Documentation](https://wagmi.sh/) - React hooks for Ethereum

### 🔧 Useful Tools
- [Remix IDE](https://remix.ethereum.org/) - Online Solidity IDE for testing
- [Etherscan](https://etherscan.io/) - Blockchain explorer
- [Tenderly](https://tenderly.co/) - Smart contract debugging
- [Alchemy](https://www.alchemy.com/) - Web3 development platform
- [Infura](https://infura.io/) - Ethereum API provider

### 🎓 Learning Resources
- [Solidity by Example](https://solidity-by-example.org/) - Learn Solidity
- [Ethereum.org Developer Docs](https://ethereum.org/en/developers/) - Ethereum fundamentals
- [Web3 University](https://www.web3.university/) - Free blockchain courses
- [CryptoZombies](https://cryptozombies.io/) - Interactive Solidity tutorial

### 🛠️ Development Tools
- **VS Code Extensions**:
  - Solidity by Nomic Foundation
  - Hardhat Solidity by Nomic Foundation
  - Prisma by Prisma
  - ESLint by Microsoft
  - Prettier by Prettier

### 🐛 Debugging Tips

1. **Enable Verbose Logging**:
   ```bash
   # Foundry tests
   forge test -vvvv  # Maximum verbosity
   
   # Next.js
   DEBUG=* npm run dev
   ```

2. **Check Logs**:
   ```bash
   # Docker logs
   docker compose logs -f postgres
   
   # Anvil logs (if backgrounded)
   # Check the terminal where anvil is running
   
   # Next.js browser console
   # Press F12 in browser → Console tab
   ```

3. **Common Debug Commands**:
   ```bash
   # Check what's using a port
   netstat -ano | findstr :<PORT>  # Windows
   lsof -i :<PORT>                 # macOS/Linux
   
   # Check environment variables are loaded
   printenv | grep NEXT_PUBLIC     # macOS/Linux
   Get-ChildItem Env: | Select-String "NEXT_PUBLIC"  # Windows PowerShell
   
   # Verify Node.js can access .env
   node -e "require('dotenv').config(); console.log(process.env.NEXTAUTH_SECRET)"
   ```

---

## 💬 Still Need Help?

### Before Asking for Help

Please ensure you've:
1. ✅ Checked this troubleshooting guide
2. ✅ Searched [existing GitHub issues](https://github.com/StabilityNexus/FairFund/issues)
3. ✅ Read the relevant [documentation section](README.md)
4. ✅ Verified all prerequisites are correctly installed

### How to Get Support

1. **Discord (Fastest Response)**
   - Join [Stability Nexus Discord](https://discord.gg/7jS9qJNjJv)
   - Ask in the `#fairfund` channel
   - Share error messages, logs, and what you've already tried

2. **GitHub Issues**
   - [Create a new issue](https://github.com/StabilityNexus/FairFund/issues/new)
   - Use the bug report template
   - Include:
     - Your operating system
     - Node.js version (`node --version`)
     - npm version (`npm --version`)
     - Foundry version (`forge --version`)
     - Complete error logs
     - Steps to reproduce

3. **Check Existing Resources**
   - [Main README](README.md)
   - [Smart Contract Documentation](app/blockchain/README.md)
   - [Contributing Guide](README.md#contributing)
   - [Open Issues](https://github.com/StabilityNexus/FairFund/issues)

### 📝 Providing Good Error Reports

When asking for help, provide a complete picture:

**✅ Good Error Report:**
```markdown
**Environment:**
- OS: Windows 11 Pro (Version 22H2)
- Node.js: v18.17.0
- npm: v9.6.7
- Foundry: forge 0.2.0 (abc123)
- Docker: 24.0.5

**What I'm trying to do:**
Running `make mock-all` to deploy mock contracts to local Anvil

**Error message:**
```
Error: Failed to send transaction: Transaction reverted without a reason
Contract: FairFund
Function: constructor
```
```

**What I've tried:**
1. Restarted Anvil - still failing
2. Ran `forge clean && forge build` - builds successfully  
3. Checked Anvil is running on port 8545 - confirmed
4. Previous deployment worked yesterday, started failing today

**Anvil output:**
```
eth_sendRawTransaction
    Gas used: 1500000
    Reverted with: 0x...
```

**Additional context:**
Made changes to FairFund.sol constructor yesterday. Reverted changes, still failing.
```

**❌ Poor Error Report:**
```
help! it doesn't work
```

---

## 🎉 Success Indicators

You'll know everything is working when:

- ✅ `forge test` passes all tests
- ✅ Anvil shows mining blocks when you interact with contracts
- ✅ `http://localhost:3000` loads the FairFund homepage
- ✅ You can connect your wallet and sign in
- ✅ `npx prisma studio` shows your database schema
- ✅ No errors in browser console (F12)
- ✅ No errors in terminal running Next.js

### 🚀 Next Steps After Setup

Once everything is running:

1. **Explore the Application**:
   - Create a test space
   - Deploy a test vault
   - Submit a test proposal
   - Register to vote

2. **Review the Code**:
   - Smart contracts in `app/blockchain/src/`
   - Frontend components in `app/web-app/src/components/`
   - API routes in `app/web-app/src/app/api/`

3. **Run Tests**:
   ```bash
   # Smart contract tests
   cd app/blockchain
   forge test
   
   # Check test coverage
   forge coverage
   ```

4. **Make Your First Contribution**:
   - Pick an issue from [GitHub Issues](https://github.com/StabilityNexus/FairFund/issues)
   - Read the [Contributing Guide](README.md#contributing)
   - Join [Discord](https://discord.gg/7jS9qJNjJv) to discuss your ideas

---

## 🔄 Quick Reset (Nuclear Option)

If nothing works, start fresh:

```bash
# 1. Clean blockchain setup
cd app/blockchain
forge clean
rm -rf lib/
git submodule update --init --recursive
forge install

# 2. Clean frontend setup
cd ../web-app
rm -rf node_modules package-lock.json .next
npm install

# 3. Reset database
docker compose down -v
docker compose up -d
npx prisma db push --force-reset

# 4. Restart everything
# Terminal 1
cd app/blockchain && anvil

# Terminal 2  
cd app/blockchain && make mock-all

# Terminal 3
cd app/web-app && npm run dev
```

---

*Last updated: December 2025*

**Found an issue not covered here?** [Create an issue](https://github.com/StabilityNexus/FairFund/issues/new) or contribute to this guide!

For the latest updates, visit the [FairFund repository](https://github.com/StabilityNexus/FairFund).

### About the Codebase

1. **Monorepo Structure**: FairFund is organized as a monorepo with two main components:
   - `app/blockchain/`: Smart contracts (Solidity, Foundry)
   - `app/web-app/`: Frontend application (Next.js, React)

2. **Development vs Production**: 
   - Local development uses Anvil (Foundry's local Ethereum node)
   - Mock contracts are deployed to Anvil for testing
   - Production uses real testnets (Sepolia, Polygon Amoy, etc.)

3. **Database**: 
   - PostgreSQL stores off-chain data (spaces, user preferences)
   - Blockchain stores on-chain data (vaults, proposals, votes)

4. **Authentication**: Uses SIWE (Sign-In with Ethereum) via NextAuth

### About Dependencies

1. **Foundry**: Required for smart contract development, testing, and deployment
   - `forge`: Solidity compiler and test runner
   - `anvil`: Local Ethereum node
   - `cast`: CLI for Ethereum RPC calls

2. **Docker**: Only required for running PostgreSQL locally
   - Not needed if you have PostgreSQL installed separately
   - Can skip if you use a cloud database (Supabase, Neon, etc.)

3. **Wallet Connect**: Required for connecting Web3 wallets (MetaMask, etc.)
   - Free project ID from [Reown Cloud](https://cloud.reown.com/)

### About the Development Workflow

1. **Smart Contracts First**: Always deploy smart contracts before running the frontend
   ```bash
   # Terminal 1: Start Anvil
   cd app/blockchain && anvil
   
   # Terminal 2: Deploy contracts
   cd app/blockchain && make mock-all
   
   # Terminal 3: Start frontend
   cd app/web-app && npm run dev
   ```

2. **Auto-generated Files**: These files are generated automatically:
   - `app/web-app/src/blockchain/deployments/foundry.json`
   - `app/web-app/src/blockchain/deployments/abis/*.json`
   - Never edit these manually!

3. **Database Reset**: Running `npm run dev` resets the database
   - Check `package.json`: `"dev": "npx prisma db push --force-reset && next dev"`
   - Use `npm run start` to preserve data
   - Or modify the dev script if you need persistent data

---

## Quick Command Reference

### Smart Contract Development
```bash
cd app/blockchain
forge install          # Install dependencies
forge build           # Compile contracts
forge test            # Run all tests
forge test -vvv       # Verbose test output
anvil                 # Start local blockchain
make mock-all         # Deploy mock contracts
```

### Frontend Development
```bash
cd app/web-app
npm install                    # Install dependencies
npm run dev                    # Start dev server (resets DB)
npm run build                  # Build for production
npx prisma generate           # Generate Prisma client
npx prisma db push            # Push schema to DB
npx prisma studio             # Open Prisma GUI
```

### Docker Commands
```bash
cd app/web-app
docker compose up              # Start PostgreSQL
docker compose up -d           # Start in background
docker compose down            # Stop containers
docker compose logs postgres   # View logs
docker compose down -v         # Remove volumes (reset DB)
```

---

*Last updated: December 2025*

For the latest updates, visit the [FairFund repository](https://github.com/StabilityNexus/FairFund).
