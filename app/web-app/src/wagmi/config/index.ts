import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { cookieStorage, createStorage, http } from '@wagmi/core';
import { foundry, polygonAmoy, polygon } from '@reown/appkit/networks';

export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (!projectId) throw new Error('Project ID is not defined');

export const networks =
    process.env.NEXT_PUBLIC_NETWORK === 'foundry'
        ? [foundry]
        : [polygonAmoy, polygon];

export const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
        storage: cookieStorage,
    }),
    ssr: true,
    projectId,
    networks,
    transports: {
        [polygonAmoy.id]: http('https://rpc-amoy.polygon.technology/'),
        [polygon.id]: http('https://polygon.llamarpc.com'),
        [foundry.id]: http('http://localhost:8545'),
    },
});

export const config = wagmiAdapter.wagmiConfig;
