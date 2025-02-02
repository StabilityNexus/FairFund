import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { cookieStorage, createStorage, http } from '@wagmi/core';
import { foundry, polygonAmoy, sepolia, AppKitNetwork } from '@reown/appkit/networks';
import { milkomedaTestnet } from '../networks';



export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (!projectId) throw new Error('Project ID is not defined');

export const networks =
    process.env.NEXT_PUBLIC_NETWORK === 'foundry' 
        ? [foundry] 
        : [polygonAmoy, sepolia, milkomedaTestnet];

export const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
        storage: cookieStorage,
    }),
    ssr: true,
    projectId,
    networks: networks as AppKitNetwork[],
    transports: {
        [polygonAmoy.id]: http(process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC_URL || 'https://rpc-amoy.polygon.technology/'),
        [foundry.id]: http('http://localhost:8545'),
        [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 'https://rpc.sepolia.org'),
        [milkomedaTestnet.id]: http(process.env.NEXT_PUBLIC_MILKOMEDA_TESTNET_RPC_URL || 'https://rpc-devnet-cardano-evm.c1.milkomeda.com'),
    },
});

export const config = wagmiAdapter.wagmiConfig;
