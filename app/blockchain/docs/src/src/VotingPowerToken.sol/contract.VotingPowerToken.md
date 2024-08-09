# VotingPowerToken
[Git Source](https://github.com/StabilityNexus/FairFund/blob/64b2ecb7c60a5a1802be455db0565e9d73fc2a00/app/blockchain/src/VotingPowerToken.sol)

**Inherits:**
ERC20, Ownable

## Overview: Simple ERC20 token to be used as voting power token for each funding vault.

## Functions
### constructor


```solidity
constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) Ownable(msg.sender);
```

### mint


```solidity
function mint(address _to, uint256 _amount) external onlyOwner;
```

### burn


```solidity
function burn(address _of, uint256 _amount) external onlyOwner;
```

### transferFrom


```solidity
function transferFrom(address from, address to, uint256 value) public override returns (bool);
```

