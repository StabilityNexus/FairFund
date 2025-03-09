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

interface FairFundConfig {
    address: string;
    abi: any;
    name?: string;
}

export const chainToFairFund: Record<number, FairFundConfig> = {
    63: {
        address: fairFundDeploymentProd.ethereumMordor,
        abi: fairFundABI.abi,
        name: "Ethereum Mordor"
    },
    80002: {
        address: fairFundDeploymentProd.polygonTestnet,
        abi: fairFundABI.abi,
        name: "Polygon Mumbai"
    },
    137: {
        address: fairFundDeploymentProd.polygonMainnet,
        abi: fairFundABI.abi,
        name: "Polygon Mainnet"
    },
    31337: {
        address: fairFundDeploymentDev?.mockFairFund || "",
        abi: mockFairFundABI?.abi || fairFundABI.abi,
        name: "Anvil Local"
    }
};

export function getFairFundForChain(chainId: number): FairFundConfig | null {
    if (chainId in chainToFairFund) {
        return chainToFairFund[chainId];
    }
    return null;
}

export const erc20ABI = erc20.abi;

export const fundingVaultABI =
    process.env.NODE_ENV === 'development'
        ? mockFundingVault.abi
        : fundingVault.abi;
