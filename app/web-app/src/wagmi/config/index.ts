import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { cookieStorage, createStorage, http } from 'wagmi';
import { foundry, polygon, polygonAmoy } from 'wagmi/chains';

export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (!projectId) throw new Error('Project ID is not defined');

const metadata = {
    name: 'FairFund',
    description: process.env.NEXT_PUBLIC_WEBSITE_DESCRIPTION!,
    url: process.env.NEXT_PUBLIC_WEBSITE_URL!, // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

export const config = defaultWagmiConfig({
    chains:
        process.env.NEXT_PUBLIC_NETWORK === 'foundry'
            ? [foundry]
            : [polygon, polygonAmoy],
    projectId,
    metadata,
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
    transports: {
        [polygon.id]: http('https://polygon-mainnet.infura.io/'),
        [polygonAmoy.id]: http('https://rpc-amoy.polygon.technology/'),
        [foundry.id]: http('http://localhost:8545'),
    },
});
