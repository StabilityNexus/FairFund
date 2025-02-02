import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { cookieStorage, createStorage, http } from '@wagmi/core';
import { foundry, polygonAmoy, sepolia, goerli, AppKitNetwork } from '@reown/appkit/networks';


const milkomedaTestnet: AppKitNetwork = {
    id: 200101,
    name: 'Milkomeda C1 Testnet',
    rpcUrls: {
        default: {
            http: [process.env.NEXT_PUBLIC_MILKOMEDA_TESTNET_RPC_URL || 'https://rpc-devnet-cardano-evm.c1.milkomeda.com'], // ✅ Changed to HTTP
        },
    },
    nativeCurrency: {
        name: 'Wrapped Test ADA',
        symbol: 'mTADA',
        decimals: 18,
    },
    blockExplorers: {
        default: {
            name: 'Milkomeda Explorer',
            url: 'https://explorer-devnet-cardano-evm.c1.milkomeda.com',
        },
    },
};

export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (!projectId) throw new Error('Project ID is not defined');

export const networks =
    process.env.NEXT_PUBLIC_NETWORK === 'foundry' 
        ? [foundry] 
        : [polygonAmoy, sepolia, goerli, milkomedaTestnet];

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
        [goerli.id]: http(process.env.NEXT_PUBLIC_GOERLI_RPC_URL || 'https://rpc.goerli.io'),
        [milkomedaTestnet.id]: http(process.env.NEXT_PUBLIC_MILKOMEDA_TESTNET_RPC_URL || 'https://rpc-devnet-cardano-evm.c1.milkomeda.com'),
    },
});

export const config = wagmiAdapter.wagmiConfig;
