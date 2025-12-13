# 📁 Project Structure

This document explains the FairFund repository structure and helps you navigate the codebase.

## 📊 Overview

FairFund is organized as a **monorepo** with two main components:

```
FairFund/
├── app/
│   ├── blockchain/          # Smart contracts (Solidity + Foundry)
│   └── web-app/            # Frontend application (Next.js + React)
├── .github/                # GitHub configuration
└── [Documentation files]   # README, CONTRIBUTING, etc.
```

---

## 🔗 Smart Contracts (`app/blockchain/`)

### Directory Structure

```
blockchain/
├── src/                    # Contract source code
│   ├── FairFund.sol       # Main factory contract
│   ├── FundingVault.sol   # Individual vault implementation
│   ├── VotingPowerToken.sol # Voting token implementation
│   ├── FairFundTreasury.sol # Treasury management
│   └── mocks/             # Mock contracts for testing
│
├── test/                   # Test files
│   ├── unit/              # Unit tests
│   ├── fuzz/              # Fuzz tests
│   └── mocks/             # Test utilities
│
├── script/                 # Deployment scripts
│   ├── DeployFairFund.s.sol
│   ├── HelperConfig.s.sol
│   └── mocks/             # Mock deployment scripts
│
├── lib/                    # Dependencies (git submodules)
│   ├── forge-std/         # Foundry standard library
│   └── openzeppelin-contracts/
│
├── docs/                   # Generated documentation
├── foundry.toml           # Foundry configuration
├── Makefile               # Build automation
└── .env.example           # Environment template
```

### Key Files

#### `src/FairFund.sol`
- Factory contract for creating funding vaults
- Manages vault registry
- **Entry point** for the protocol

#### `src/FundingVault.sol`
- Core vault logic
- Handles deposits, proposals, voting, and distribution
- **Most complex contract**

#### `src/VotingPowerToken.sol`
- ERC20 token representing voting power
- Minted when users register to vote
- Burns when users vote

#### `src/FairFundTreasury.sol`
- Collects protocol fees (if applicable)
- Treasury management

### Test Structure

```
test/
├── unit/                   # Test individual functions
│   ├── FairFund.t.sol     # Factory tests
│   ├── FundingVault.t.sol # Vault tests
│   └── FairFundTreasury.t.sol
│
└── fuzz/                   # Test with random inputs
    ├── FairFund.t.sol     # Fuzz factory
    ├── FundingVault.t.sol # Fuzz vault
    ├── Handler.t.sol      # Invariant helper
    └── Invarients.t.sol   # Invariant tests
```

### Deployment Scripts

```
script/
├── DeployFairFund.s.sol          # Main deployment
├── DeployFairFundTreasury.s.sol  # Treasury deployment
├── HelperConfig.s.sol            # Network configurations
└── mocks/
    ├── DeployMockERC20.s.sol     # Mock tokens
    └── DeployMockFairFund.s.sol  # Mock contracts
```

---

## 🌐 Frontend (`app/web-app/`)

### Directory Structure

```
web-app/
├── src/                    # Source code
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── blockchain/        # Contract ABIs & addresses
│   ├── actions/           # Server actions
│   ├── types/             # TypeScript types
│   ├── wagmi/             # Web3 configuration
│   └── middleware.ts      # Next.js middleware
│
├── prisma/                 # Database
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Migration history
│
├── public/                 # Static assets
├── package.json           # Dependencies
├── next.config.mjs        # Next.js config
├── tailwind.config.ts     # Tailwind CSS config
├── tsconfig.json          # TypeScript config
├── docker-compose.yaml    # PostgreSQL setup
└── .env.example           # Environment template
```

### Source Code (`src/`)

#### `app/` - Next.js App Router

```
app/
├── layout.tsx             # Root layout
├── page.tsx               # Landing page
├── globals.css            # Global styles
│
├── (root)/                # Main application routes
│   ├── dashboard/         # Dashboard page
│   ├── spaces/            # Spaces listing & details
│   ├── vaults/            # Vault details & management
│   ├── proposals/         # Proposal details
│   └── my-activity/       # User activity page
│
└── api/                   # API routes
    ├── auth/              # NextAuth endpoints
    └── [...custom]/       # Custom API endpoints
```

**Route Structure:**
- `/` - Landing page
- `/dashboard` - User dashboard
- `/spaces` - Browse spaces
- `/spaces/[id]` - Space details
- `/spaces/[spaceId]/vaults/[vaultId]` - Vault details
- `/spaces/[spaceId]/vaults/[vaultId]/proposals/[proposalId]` - Proposal details
- `/my-activity` - User's activity

#### `components/` - React Components

```
components/
├── ui/                    # Base UI components (shadcn/ui)
│   ├── button.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   └── ...
│
├── active-dashboard.tsx   # Dashboard component
├── create-proposal-form.tsx
├── create-space-form.tsx
├── create-vault-form.tsx
├── navbar.tsx
├── proposal-card.tsx
├── space-card.tsx
├── vault-card.tsx
└── ...                    # Other feature components
```

**Component Organization:**
- `ui/` - Reusable UI primitives
- Root level - Feature-specific components

#### `blockchain/` - Smart Contract Integration

```
blockchain/
├── constants.ts           # Contract addresses & chains
└── deployments/           # Auto-generated (DO NOT EDIT)
    ├── foundry.json       # Local deployment addresses
    ├── testnet.json       # Testnet addresses
    └── abis/              # Contract ABIs
        ├── FairFund.json
        ├── FundingVault.json
        └── ...
```

**Important:** Files in `deployments/` are auto-generated by `make mock-all`. Never edit manually!

#### `hooks/` - Custom Hooks

```
hooks/
├── use-contract.ts        # Contract interaction hooks
├── use-wallet.ts          # Wallet connection hooks
└── ...                    # Other custom hooks
```

#### `lib/` - Utilities

```
lib/
├── utils.ts               # General utilities
├── validation.ts          # Form validation
└── ...                    # Other utilities
```

#### `wagmi/` - Web3 Configuration

```
wagmi/
├── config.ts              # Wagmi configuration
└── ...                    # Web3 utilities
```

### Database (`prisma/`)

```
prisma/
├── schema.prisma          # Database models
│
└── migrations/            # Migration history
    ├── migration_lock.toml
    └── [timestamp]_[name]/ # Individual migrations
```

**Key Models:**
- `Space` - Organizational spaces
- `User` - User profiles (off-chain data)
- `FundingVault` - Vault metadata (on-chain + off-chain)

---

## 📄 Documentation Files (Root)

```
FairFund/
├── README.md              # Main documentation
├── QUICKSTART.md          # Quick setup guide
├── TROUBLESHOOTING.md     # Common issues & solutions
├── CONTRIBUTING.md        # Contribution guidelines
├── CODE_OF_CONDUCT.md     # Community standards
├── SECURITY.md            # Security policy
├── CHANGELOG.md           # Version history
├── PROJECT_STRUCTURE.md   # This file
├── .gitignore             # Git ignore rules
└── package.json           # Root package config
```

---

## ⚙️ Configuration Files

### Root Level

```
├── .gitignore             # Files to ignore in git
├── .husky/                # Git hooks
└── package.json           # Workspace configuration
```

### Blockchain

```
blockchain/
├── foundry.toml           # Foundry settings
├── Makefile               # Build commands
├── .env.example           # Environment template
└── remappings.txt         # Import remappings
```

### Frontend

```
web-app/
├── next.config.mjs        # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS settings
├── tsconfig.json          # TypeScript settings
├── postcss.config.mjs     # PostCSS settings
├── components.json        # shadcn/ui configuration
├── docker-compose.yaml    # Docker services
├── .env.example           # Environment template
├── .eslintrc.json         # ESLint rules
├── .prettierrc            # Prettier settings
└── .lintstagedrc.json     # Lint-staged config
```

---

## 🔄 GitHub Configuration

```
.github/
├── workflows/             # GitHub Actions
│   ├── test.yml          # Smart contract tests (legacy)
│   ├── contracts.yml     # Contract CI/CD
│   └── frontend.yml      # Frontend CI/CD
│
├── ISSUE_TEMPLATE/        # Issue templates
│   ├── bug_report.md
│   ├── feature_request.md
│   ├── documentation.md
│   └── config.yml
│
└── PULL_REQUEST_TEMPLATE.md
```

---

## 🗂️ File Naming Conventions

### Smart Contracts (Solidity)

- **Contracts**: `PascalCase.sol` (e.g., `FairFund.sol`)
- **Tests**: `PascalCase.t.sol` (e.g., `FairFund.t.sol`)
- **Scripts**: `PascalCase.s.sol` (e.g., `DeployFairFund.s.sol`)
- **Interfaces**: `IPascalCase.sol` (e.g., `IFairFund.sol`)
- **Mocks**: `MockPascalCase.sol` (e.g., `MockERC20.sol`)

### Frontend (TypeScript/React)

- **Components**: `kebab-case.tsx` (e.g., `create-vault-form.tsx`)
- **Utilities**: `kebab-case.ts` (e.g., `use-contract.ts`)
- **Pages**: `page.tsx` or `[param]/page.tsx`
- **Types**: `kebab-case.ts` or `types.ts`

### Documentation

- **Markdown**: `UPPERCASE.md` (e.g., `README.md`)
- **Guides**: `UPPERCASE.md` (e.g., `QUICKSTART.md`)

---

## 📦 Dependencies

### Smart Contracts

```toml
[dependencies]
forge-std = "github.com/foundry-rs/forge-std"
openzeppelin-contracts = "github.com/OpenZeppelin/openzeppelin-contracts"
```

### Frontend

**Main Dependencies:**
- `next` - React framework
- `react` & `react-dom` - UI library
- `wagmi` & `viem` - Ethereum library
- `@reown/appkit` - Wallet connection
- `@prisma/client` - Database ORM
- `next-auth` - Authentication
- `tailwindcss` - CSS framework
- `zod` - Validation

**See** `app/web-app/package.json` for complete list

---

## 🔍 Finding Things

### "Where do I find...?"

**Smart Contracts:**
- Contract logic → `app/blockchain/src/`
- Tests → `app/blockchain/test/`
- Deployment → `app/blockchain/script/`

**Frontend:**
- Pages/Routes → `app/web-app/src/app/`
- Components → `app/web-app/src/components/`
- Database models → `app/web-app/prisma/schema.prisma`
- Contract ABIs → `app/web-app/src/blockchain/deployments/abis/`
- API endpoints → `app/web-app/src/app/api/`

**Documentation:**
- Setup guides → Root directory (`README.md`, `QUICKSTART.md`)
- Troubleshooting → `TROUBLESHOOTING.md`
- Contributing → `CONTRIBUTING.md`
- Contract docs → `app/blockchain/docs/`

### "What file do I edit for...?"

**Add a new smart contract feature:**
1. Edit contract in `app/blockchain/src/`
2. Add tests in `app/blockchain/test/unit/`
3. Redeploy with `make mock-all`
4. ABIs auto-update in frontend

**Add a new page:**
1. Create `app/web-app/src/app/your-page/page.tsx`
2. Add link in navbar: `app/web-app/src/components/navbar.tsx`

**Add a database model:**
1. Edit `app/web-app/prisma/schema.prisma`
2. Run `npx prisma migrate dev --name your_change`
3. Prisma client auto-updates

**Add a new component:**
1. Create file in `app/web-app/src/components/`
2. Import and use in pages

---

## 🚀 Build Outputs

### Smart Contracts

```
blockchain/
├── out/                   # Compiled contracts (gitignored)
├── cache/                 # Build cache (gitignored)
└── broadcast/             # Deployment logs (gitignored)
```

### Frontend

```
web-app/
├── .next/                 # Next.js build (gitignored)
├── node_modules/          # Dependencies (gitignored)
└── dist/                  # Production build (gitignored)
```

---

## 📊 Auto-Generated Files

**DO NOT EDIT** these files manually:

- `app/web-app/src/blockchain/deployments/**` - Generated by `make mock-all`
- `app/web-app/.next/**` - Generated by Next.js
- `app/blockchain/out/**` - Generated by Forge
- `app/blockchain/docs/**` - Generated by `forge doc`
- `node_modules/**` - Generated by npm

---

## 🔐 Sensitive Files (gitignored)

These files contain secrets and are never committed:

- `.env` - Environment variables
- `.env.local` - Local overrides
- `*.key` - Private keys
- `*.secret` - Secret tokens

Always use `.env.example` as a template!

---

## 🧪 Test Files Location

```
# Smart Contract Tests
app/blockchain/test/unit/*.t.sol      # Unit tests
app/blockchain/test/fuzz/*.t.sol      # Fuzz tests

# Frontend Tests (if added)
app/web-app/__tests__/**/*.test.tsx   # Component tests
app/web-app/__tests__/**/*.spec.tsx   # Integration tests
```

---

## 📚 Additional Resources

- [Quick Start](QUICKSTART.md) - Get started quickly
- [Contributing](CONTRIBUTING.md) - Contribution workflow
- [Troubleshooting](TROUBLESHOOTING.md) - Common issues

---

**Questions about the structure?** Ask on [Discord](https://discord.gg/7jS9qJNjJv)!

*Last updated: December 2025*
