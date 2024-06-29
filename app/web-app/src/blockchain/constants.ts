import mockFairFund from '@/blockchain/deployments/anvil/fairFund_deployment.json';
import mockFairFundABI from '@/blockchain/out/MockFairFund.sol/MockFairFund.json';
import mockERC20 from '@/blockchain/deployments/anvil/erc20_deployment.json';
import mockFundingVault from '@/blockchain/out/MockFundingVault.sol/MockFundingVault.json';
import ERC20 from '@/blockchain/out/ERC20.sol/ERC20.json';
import fundingVault from '@/blockchain/out/FundingVault.sol/FundingVault.json';

export const fairFund: SmartContract = {
    address:
        process.env.NODE_ENV === 'development'
            ? mockFairFund.mockFairFund
            : '0x5fc8d32690cc91d4c39d9d3abcbd16989f875707',
    abi: mockFairFundABI.abi,
};

export const erc20ABI = ERC20.abi;

export const mockERC20Address = mockERC20.mockERC20;

export const fundingVaultABI =
    process.env.NODE_ENV === 'development'
        ? mockFundingVault.abi
        : fundingVault.abi;
