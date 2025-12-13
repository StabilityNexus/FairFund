# 🚀 Quick Start Guide

Get FairFund running in minutes! This guide provides the fastest path to a working development environment.

## ⚡ TL;DR

```bash
# Clone the repo
git clone https://github.com/StabilityNexus/FairFund.git
cd FairFund

# Install dependencies
cd app/blockchain && forge install
cd ../web-app && npm install --legacy-peer-deps

# Configure environment
cp app/web-app/.env.example app/web-app/.env
# Edit .env with required values

# Terminal 1: Start blockchain
cd app/blockchain && anvil

# Terminal 2: Deploy contracts
cd app/blockchain && make mock-all

# Terminal 3: Start app
cd app/web-app && docker compose up -d && npm run dev

# Open http://localhost:3000
```

---

## 📋 Prerequisites Check

Before starting, verify you have:

```bash
# Check all prerequisites at once
forge --version && node --version && docker --version && git --version
```

**Required versions:**
- Foundry (any recent version)
- Node.js v18+
- Docker (any recent version)
- Git (any version)

**Missing something?** See [Installation Guide](#installation-guide) below.

---

## 🎯 Step-by-Step Setup

### 1. Clone Repository

```bash
git clone https://github.com/StabilityNexus/FairFund.git
cd FairFund
```

### 2. Smart Contracts Setup

```bash
# Navigate to blockchain directory
cd app/blockchain

# Install Foundry dependencies
forge install

# Verify installation
forge build
```

**Expected output:** Contracts compile successfully ✅

### 3. Frontend Setup

```bash
# Navigate to web app directory
cd ../web-app

# Install npm dependencies
npm install --legacy-peer-deps

# This may take 2-3 minutes
```

**Expected output:** `added 1019 packages` ✅

### 4. Environment Configuration

```bash
# Copy environment template
cp .env.example .env
```

**Edit `.env` file with these required values:**

```bash
# Get from https://cloud.reown.com (free)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here

# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your_generated_secret_here

# Leave these as-is for local development
NEXTAUTH_URL=http://localhost:3000
POSTGRES_PRISMA_URL="postgres://postgres:development@localhost:5432/dev-db"
POSTGRES_URL_NON_POOLING="postgres://postgres:development@localhost:5432/dev-db"
```

**Need help?** See [Environment Variables Guide](TROUBLESHOOTING.md#environment-configuration-issues)

### 5. Start Services

Open **three separate terminals**:

#### Terminal 1: Blockchain

```bash
cd app/blockchain
anvil
```

**You should see:** 
```
Available Accounts
(0) 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
...
Listening on 127.0.0.1:8545
```

Keep this terminal running! ✅

#### Terminal 2: Deploy Contracts

```bash
cd app/blockchain
make mock-all
```

**You should see:**
```
✅ MockERC20 deployed
✅ FairFund deployed
✅ ABIs updated
```

This terminal can be closed after deployment ✅

#### Terminal 3: Frontend

```bash
cd app/web-app

# Start PostgreSQL
docker compose up -d

# Start Next.js dev server
npm run dev
```

**You should see:**
```
✓ Ready in 2.5s
○ Compiling / ...
✓ Compiled in 3s
```

Keep this terminal running! ✅

### 6. Verify Setup

Open your browser to **http://localhost:3000**

You should see the FairFund landing page! 🎉

**Test the setup:**
1. Click "Get Started"
2. Click "Connect Wallet"
3. Select MetaMask (or your wallet)
4. Connect to `localhost:8545` network
5. Sign in with your wallet

**Success!** You're ready to develop! 🚀

---

## 🔧 Installation Guide

### Install Foundry

**Windows:**
```powershell
# Run PowerShell as Administrator
irm https://foundry.paradigm.xyz/ | iex
foundryup
```

**macOS/Linux:**
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

**Verify:**
```bash
forge --version
```

### Install Node.js

**Recommended: Using nvm**

```bash
# Install nvm first: https://github.com/nvm-sh/nvm
nvm install 18
nvm use 18
```

**Or download directly:**
- Windows/macOS: https://nodejs.org/
- Linux: Use your package manager

**Verify:**
```bash
node --version  # Should be v18+
npm --version
```

### Install Docker Desktop

1. Download from https://www.docker.com/products/docker-desktop/
2. Install and restart your computer
3. Launch Docker Desktop
4. Verify Docker is running

**Verify:**
```bash
docker --version
docker ps  # Should show running containers list
```

---

## 🎬 Video Walkthrough

> **Coming Soon!** We're creating video tutorials for each setup step.

In the meantime:
- **Text Guide**: [Full Documentation](README.md)
- **Troubleshooting**: [Common Issues](TROUBLESHOOTING.md)
- **Live Help**: [Discord #fairfund](https://discord.gg/7jS9qJNjJv)

---

## 🆘 Common Issues

### "forge: command not found"

**Solution:** Foundry not in PATH
```bash
# Add to ~/.bashrc or ~/.zshrc
export PATH="$HOME/.foundry/bin:$PATH"
source ~/.bashrc
```

### "npm install" fails

**Solution:** Use legacy peer deps
```bash
npm install --legacy-peer-deps
```

### "Port 3000 already in use"

**Solution:** Kill the process
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Docker not starting

**Solution:** Ensure Docker Desktop is running
```bash
# Open Docker Desktop application
# Wait for the whale icon to stop animating
docker ps  # Should work now
```

**More issues?** Check the [Troubleshooting Guide](TROUBLESHOOTING.md)

---

## 📚 Next Steps

Now that you're set up:

1. **Explore the App**
   - Create a test space
   - Deploy a vault
   - Submit a proposal
   - Vote on proposals

2. **Read the Code**
   - Smart contracts in `app/blockchain/src/`
   - Frontend in `app/web-app/src/`
   - Tests in `app/blockchain/test/`

3. **Make Changes**
   - Pick an [issue](https://github.com/StabilityNexus/FairFund/issues)
   - Read [Contributing Guide](CONTRIBUTING.md)
   - Submit your first PR!

4. **Join Community**
   - [Discord](https://discord.gg/7jS9qJNjJv) - Ask questions
   - [GitHub Discussions](https://github.com/StabilityNexus/FairFund/discussions) - Share ideas
   - [Twitter](https://twitter.com/stabilityNexus) - Follow updates

---

## 🏃 Quick Commands Reference

```bash
# Smart Contracts
cd app/blockchain
forge build              # Compile contracts
forge test               # Run tests
forge test -vvv          # Verbose test output
forge coverage           # Test coverage
anvil                    # Start local blockchain
make mock-all            # Deploy mock contracts

# Frontend
cd app/web-app
npm install --legacy-peer-deps  # Install dependencies
npm run dev              # Start dev server
npm run build            # Build for production
npm run lint             # Run linter
npm run format           # Format code
docker compose up -d     # Start PostgreSQL
npx prisma studio        # Database GUI
npx prisma db push       # Push schema changes
```

---

## 💡 Pro Tips

1. **Use VS Code Extensions:**
   - Solidity (Nomic Foundation)
   - Prettier
   - ESLint
   - Prisma

2. **Keyboard Shortcuts:**
   - `Ctrl+C` to stop servers
   - `Ctrl+Shift+` ` for new terminal (VS Code)
   - `↑` to repeat last command

3. **Save Time:**
   - Keep Anvil running in background
   - Only redeploy contracts when you change Solidity code
   - Use `npm run start` instead of `dev` to preserve database

4. **Stay Updated:**
   - Pull latest changes: `git pull upstream main`
   - Update dependencies periodically
   - Check Discord for announcements

---

## 🎯 Success Checklist

- [ ] All prerequisites installed
- [ ] Repository cloned
- [ ] Dependencies installed (blockchain & frontend)
- [ ] .env file configured
- [ ] Anvil running on port 8545
- [ ] Mock contracts deployed
- [ ] PostgreSQL running via Docker
- [ ] Frontend running on http://localhost:3000
- [ ] Can connect wallet and sign in
- [ ] No errors in browser console

**All checked?** Congratulations! You're ready to contribute! 🎉

---

**Having trouble?** Don't worry, it happens! Check our [Troubleshooting Guide](TROUBLESHOOTING.md) or ask on [Discord](https://discord.gg/7jS9qJNjJv).

Happy coding! 💻✨
