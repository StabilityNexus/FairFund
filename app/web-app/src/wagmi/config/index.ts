import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { cookieStorage, createStorage, http } from '@wagmi/core';
import { foundry, polygonAmoy, sepolia, goerli, polygonMumbai, bscTestnet } from '@reown/appkit/networks';

export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (!projectId) throw new Error('Project ID is not defined');

export const networks =
    process.env.NEXT_PUBLIC_NETWORK === 'foundry' 
        ? [foundry] 
        : [polygonAmoy, sepolia, goerli, polygonMumbai, bscTestnet];

export const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
        storage: cookieStorage,
    }),
    ssr: true,
    projectId,
    networks,
    transports: {
        [polygonAmoy.id]: http('https://rpc-amoy.polygon.technology/'),
        [foundry.id]: http('http://localhost:8545'),
        [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 'https://rpc.sepolia.org'),
        [goerli.id]: http(process.env.NEXT_PUBLIC_GOERLI_RPC_URL || 'https://rpc.goerli.io'),
        [polygonMumbai.id]: http(process.env.NEXT_PUBLIC_MUMBAI_RPC_URL || 'https://rpc-mumbai.maticvigil.com'),
        [bscTestnet.id]: http(process.env.NEXT_PUBLIC_BSC_TESTNET_RPC_URL || 'https://data-seed-prebsc-1-s1.binance.org:8545'),
    },
});

export const config = wagmiAdapter.wagmiConfig;
