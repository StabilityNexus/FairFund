# 🤝 Contributing to FairFund

Thank you for your interest in contributing to FairFund! We're excited to have you join our community of developers building transparent, decentralized funding solutions.

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Contribution Guidelines](#contribution-guidelines)
5. [Pull Request Process](#pull-request-process)
6. [Coding Standards](#coding-standards)
7. [Testing Requirements](#testing-requirements)
8. [Issue Guidelines](#issue-guidelines)
9. [Community](#community)

---

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it to understand what behavior will and will not be tolerated.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Foundry** (for smart contracts)
- **Node.js** v18+ (for frontend)
- **Docker** (for database)
- **Git**

See our [Troubleshooting Guide](TROUBLESHOOTING.md) for detailed installation instructions.

### Setting Up Your Development Environment

1. **Fork the Repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/FairFund.git
   cd FairFund
   ```

2. **Set Up Upstream Remote**
   ```bash
   git remote add upstream https://github.com/StabilityNexus/FairFund.git
   git fetch upstream
   ```

3. **Install Dependencies**
   ```bash
   # Smart contracts
   cd app/blockchain
   forge install
   
   # Frontend
   cd ../web-app
   npm install --legacy-peer-deps
   ```

4. **Configure Environment**
   ```bash
   # Copy environment files
   cp app/blockchain/.env.example app/blockchain/.env
   cp app/web-app/.env.example app/web-app/.env
   
   # Edit .env files with your configuration
   ```

5. **Run the Project**
   ```bash
   # Terminal 1: Start Anvil
   cd app/blockchain && anvil
   
   # Terminal 2: Deploy contracts
   cd app/blockchain && make mock-all
   
   # Terminal 3: Start frontend
   cd app/web-app && docker compose up -d && npm run dev
   ```

6. **Verify Setup**
   - Open http://localhost:3000
   - Connect your wallet to localhost:8545
   - Ensure no errors in console

---

## 🔄 Development Workflow

### Branch Naming Convention

Use descriptive branch names following this format:

```
<type>/<brief-description>
```

**Types:**
- `feat/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks
- `perf/` - Performance improvements

**Examples:**
```bash
git checkout -b feat/add-proposal-comments
git checkout -b fix/wallet-connection-issue
git checkout -b docs/update-deployment-guide
git checkout -b refactor/simplify-vault-logic
```

### Keeping Your Fork Updated

```bash
# Fetch latest changes from upstream
git fetch upstream

# Update your main branch
git checkout main
git merge upstream/main

# Update your feature branch
git checkout your-feature-branch
git rebase main
```

---

## 📝 Contribution Guidelines

### Before You Start

1. **Check Existing Issues**
   - Search [open issues](https://github.com/StabilityNexus/FairFund/issues) to avoid duplicates
   - Comment on an issue to express interest before starting work

2. **Create an Issue** (if needed)
   - For new features: Discuss on [Discord](https://discord.gg/7jS9qJNjJv) first
   - For bugs: Provide reproduction steps and environment details

3. **Wait for Assignment**
   - Unassigned PRs will be closed without review
   - Exception: Small frontend changes (<20 lines) or documentation

### What to Contribute

**Good First Issues:**
- Documentation improvements
- UI/UX enhancements
- Bug fixes
- Test coverage improvements
- Code comments and clarifications

**Advanced Contributions:**
- New features (discuss first!)
- Smart contract modifications
- Performance optimizations
- Architectural changes

### What NOT to Contribute

- ❌ Unrelated features
- ❌ Breaking changes without discussion
- ❌ Code that doesn't follow our standards
- ❌ Incomplete or untested code
- ❌ Changes to dependencies without justification

---

## 🔀 Pull Request Process

### Creating a Pull Request

1. **Complete Your Work**
   - Ensure all tests pass
   - Add new tests for new features
   - Update documentation
   - Format code properly

2. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add proposal comment functionality"
   ```

   **Commit Message Format:**
   ```
   <type>: <short description>
   
   <optional detailed description>
   
   <optional footer>
   ```

3. **Push to Your Fork**
   ```bash
   git push origin your-feature-branch
   ```

4. **Create PR on GitHub**
   - Go to your fork on GitHub
   - Click "Compare & pull request"
   - Choose the target branch:
     - **Small changes** → `main`
     - **Big changes** → `develop`

### PR Description Template

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Related Issue
Fixes #(issue number)

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
Describe the tests you ran and how to reproduce them:
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots or videos showing the changes

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published
```

### Review Process

1. **Automated Checks**
   - CI/CD tests must pass
   - No merge conflicts
   - Code formatting validated

2. **Code Review**
   - Maintainer will review within 1-2 weeks
   - Address feedback promptly
   - Be open to suggestions

3. **Approval & Merge**
   - At least one maintainer approval required
   - Squash and merge for clean history

### After Your PR is Merged

- 🎉 Congratulations!
- Your contribution will be in the next release
- You'll be added to contributors list
- Consider joining our [Discord](https://discord.gg/7jS9qJNjJv)

---

## 💻 Coding Standards

### Solidity (Smart Contracts)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ContractName
 * @notice Brief description
 * @dev Detailed technical description
 */
contract ContractName {
    // State variables
    uint256 public constant MAX_VALUE = 1000;
    mapping(address => uint256) private balances;
    
    // Events
    event ValueUpdated(address indexed user, uint256 newValue);
    
    // Errors
    error InvalidAmount();
    error Unauthorized();
    
    /**
     * @notice Brief function description
     * @param _amount The amount to process
     * @return success Whether the operation succeeded
     */
    function updateValue(uint256 _amount) external returns (bool success) {
        if (_amount == 0) revert InvalidAmount();
        
        balances[msg.sender] = _amount;
        emit ValueUpdated(msg.sender, _amount);
        
        return true;
    }
}
```

**Solidity Standards:**
- Use NatSpec comments (`@notice`, `@dev`, `@param`, `@return`)
- Custom errors over `require` strings
- Events for all state changes
- Follow Solidity style guide
- Comprehensive test coverage

### TypeScript/React (Frontend)

```typescript
// components/MyComponent.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface MyComponentProps {
  title: string;
  onSubmit: (value: string) => void;
}

/**
 * MyComponent - Brief description
 * @param title - The component title
 * @param onSubmit - Callback when submitted
 */
export function MyComponent({ title, onSubmit }: MyComponentProps) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (!value) return;
    onSubmit(value);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="input"
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
}
```

**TypeScript Standards:**
- Use TypeScript for type safety
- Functional components with hooks
- Proper interface definitions
- Meaningful variable names
- Component documentation

### Code Formatting

We use automated formatters:

```bash
# Smart contracts
cd app/blockchain
forge fmt

# Frontend
cd app/web-app
npm run format
```

---

## ✅ Testing Requirements

### Smart Contract Tests

All smart contract changes **must** include tests:

```solidity
// test/unit/MyContract.t.sol
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/MyContract.sol";

contract MyContractTest is Test {
    MyContract public myContract;
    
    function setUp() public {
        myContract = new MyContract();
    }
    
    function testUpdateValue() public {
        uint256 newValue = 100;
        myContract.updateValue(newValue);
        assertEq(myContract.getValue(), newValue);
    }
    
    function testRevertInvalidAmount() public {
        vm.expectRevert(MyContract.InvalidAmount.selector);
        myContract.updateValue(0);
    }
}
```

**Run tests:**
```bash
cd app/blockchain
forge test -vv
forge coverage
```

**Coverage Requirements:**
- New contracts: >80% coverage
- Modified contracts: Maintain existing coverage

### Frontend Tests

While not strictly required, frontend tests are encouraged:

```typescript
// __tests__/MyComponent.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders title', () => {
    render(<MyComponent title="Test" onSubmit={() => {}} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
  
  it('calls onSubmit with value', () => {
    const onSubmit = jest.fn();
    render(<MyComponent title="Test" onSubmit={onSubmit} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });
    fireEvent.click(screen.getByText('Submit'));
    
    expect(onSubmit).toHaveBeenCalledWith('test value');
  });
});
```

### Manual Testing

Before submitting PR:
- [ ] Test on localhost:3000
- [ ] Test wallet connection
- [ ] Test with different accounts
- [ ] Check browser console for errors
- [ ] Test edge cases
- [ ] Verify mobile responsiveness

---

## 🐛 Issue Guidelines

### Bug Reports

Use the bug report template:

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Windows 11, macOS 13]
- Browser: [e.g., Chrome 120]
- Node.js: [e.g., v18.17.0]
- Foundry: [e.g., forge 0.2.0]

**Additional context**
Any other relevant information.
```

### Feature Requests

Use the feature request template:

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Mockups, diagrams, or examples.
```

---

## 👥 Community

### Get Help

- 💬 [Discord](https://discord.gg/7jS9qJNjJv) - Join `#fairfund` channel
- 📖 [Documentation](README.md)
- 🛠️ [Troubleshooting Guide](TROUBLESHOOTING.md)
- 🐛 [GitHub Issues](https://github.com/StabilityNexus/FairFund/issues)

### Response Times

**Issues:**
- Bug reports: 1-3 days
- Feature requests: 1-2 weeks
- Questions: 1-3 days

**Pull Requests:**
- Small changes: 3-7 days
- Large changes: 1-2 weeks
- Critical fixes: 1-3 days

### Timeline Expectations

**Issue Completion:**
- Small tasks: 5 days
- Complex tasks: 15 days
- Provide updates if extending beyond timeline
- Issues may be reassigned if inactive

**Pull Request Updates:**
- Address feedback within 1 week
- PRs inactive for 2+ weeks may be closed

---

## 🏆 Recognition

Contributors will be:
- Listed in our contributors section
- Mentioned in release notes
- Featured in community spotlights (with permission)

Top contributors may be invited to become maintainers!

---

## 📚 Additional Resources

- [Foundry Book](https://book.getfoundry.sh/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- [Ethereum Development](https://ethereum.org/en/developers/)

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Questions?** Reach out on [Discord](https://discord.gg/7jS9qJNjJv) or open a discussion on GitHub!

Thank you for contributing to FairFund! 🚀
