# Changelog

All notable changes to FairFund will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive troubleshooting guide with platform-specific solutions
- Contributing guidelines with detailed workflow instructions
- Code of Conduct for community standards
- Security policy with vulnerability reporting process
- Issue templates for bugs, features, and documentation
- Pull request template with comprehensive checklist
- FAQ section in troubleshooting guide
- Video tutorial placeholders for future content

### Changed
- Enhanced README with better troubleshooting integration
- Improved documentation structure and navigation

### Fixed
- npm dependency resolution issues with legacy peer deps flag

## [1.0.0] - 2024-XX-XX

### Added
- Initial release of FairFund platform
- Smart contracts for funding vaults and proposals
- Voting mechanism with ERC20 token support
- Next.js frontend with Web3 integration
- PostgreSQL database for off-chain data
- SIWE (Sign-In with Ethereum) authentication
- Space management for organizing vaults
- Proposal creation and submission
- Voter registration and voting functionality
- Results page after tally date
- Docker support for local development
- Foundry-based smart contract testing
- Mock contract deployment scripts

### Smart Contracts
- `FairFund.sol` - Main factory contract
- `FundingVault.sol` - Individual vault contract
- `VotingPowerToken.sol` - Voting power token implementation
- `FairFundTreasury.sol` - Treasury management

### Frontend Features
- Wallet connection via WalletConnect
- Space creation and management
- Vault deployment interface
- Proposal submission form
- Voting interface
- Dashboard for user activity
- Results visualization

### Security
- Access control on smart contracts
- Input validation throughout
- Reentrancy guards on critical functions
- Comprehensive event logging

### Testing
- Unit tests for all smart contracts
- Fuzz testing for critical functions
- Invariant testing for core logic
- Test coverage reporting

### Deployment
- Deployed to Polygon Mainnet
- Deployed to ETC Mordor testnet
- Deployed to Polygon Amoy testnet
- Frontend deployed at stability.nexus

---

## Release Types

### Types of Changes
- `Added` for new features
- `Changed` for changes in existing functionality
- `Deprecated` for soon-to-be removed features
- `Removed` for now removed features
- `Fixed` for any bug fixes
- `Security` for vulnerability fixes

### Version Format

We use [Semantic Versioning](https://semver.org/):
- MAJOR version for incompatible API changes
- MINOR version for backwards-compatible functionality additions
- PATCH version for backwards-compatible bug fixes

---

## Future Roadmap

See [Future Improvements](README.md#future-improvements) in README for planned features.

## Contributing

Want to contribute to the next release? Check out our [Contributing Guide](CONTRIBUTING.md)!

---

[Unreleased]: https://github.com/StabilityNexus/FairFund/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/StabilityNexus/FairFund/releases/tag/v1.0.0
