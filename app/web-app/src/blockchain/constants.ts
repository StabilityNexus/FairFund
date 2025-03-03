import fairFundDeploymentDev from '@/blockchain/deployments/anvil/fairFund_deployment.json';
import fairFundDeploymentProd from '@/blockchain/deployments/production/fairFund_deployment.json';
// import mockFairFundABI from '@/blockchain/out/MockFairFund.sol/MockFairFund.json';
import fairFundABI from '@/blockchain/out/FairFund.sol/FairFund.json';

// import erc20DeploymentDev from '@/blockchain/deployments/anvil/erc20_deployment.json';
import erc20 from '@/blockchain/out/ERC20.sol/ERC20.json';

// import mockFundingVault from '@/blockchain/out/MockFundingVault.sol/MockFundingVault.json';
import fundingVault from '@/blockchain/out/FundingVault.sol/FundingVault.json';

let mockFairFundABI, mockFundingVault, erc20DeploymentDev;
if (process.env.NODE_ENV === 'development') {
    mockFairFundABI = require('@/blockchain/out/MockFairFund.sol/MockFairFund.json');
    mockFundingVault = require('@/blockchain/out/MockFundingVault.sol/MockFundingVault.json');
    erc20DeploymentDev = require('@/blockchain/deployments/anvil/erc20_deployment.json');
}

export const chainToFairFund: Record<string, string> = {
    "63": fairFundDeploymentProd.ethereumMordor,
    "80002": fairFundDeploymentProd.polygonTestnet,
    "137":fairFundDeploymentProd.polygonMainnet,
    "31337": fairFundDeploymentDev.mockFairFund, // Local development network
};

export const fairFund: SmartContract = {
    address: "80002",
  
    abi:
        process.env.NODE_ENV === 'development'
            ? mockFairFundABI.abi
            : fairFundABI.abi,
};

export const erc20ABI = erc20.abi;

export const fundingVaultABI =
    process.env.NODE_ENV === 'development'
        ? mockFundingVault.abi
        : fundingVault.abi;
