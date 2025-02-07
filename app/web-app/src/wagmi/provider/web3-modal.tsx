'use client';
import React, { type ReactNode } from 'react';
import { wagmiAdapter, projectId } from '@/wagmi/config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi';
import { siweConfig } from '@/wagmi/siwe';
import { foundry, polygonAmoy, polygon } from '@reown/appkit/networks';

const queryClient = new QueryClient();

if (!projectId) throw new Error('Project ID is not defined');

const metadata = {
    name: 'FairFund',
    description: process.env.NEXT_PUBLIC_WEBSITE_DESCRIPTION!,
    url: process.env.NEXT_PUBLIC_WEBSITE_URL!, // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const modal = createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks:
        process.env.NEXT_PUBLIC_NETWORK === 'foundry'
            ? [foundry]
            : [polygonAmoy, polygon],
    defaultNetwork:
        process.env.NEXT_PUBLIC_NETWORK === 'foundry' ? foundry : polygon,
    metadata,
    features: {
        analytics: false,
        socials: false,
        onramp: false,
    },
    siweConfig: siweConfig,
});

export default function Web3ModalProvider({
    children,
    cookies,
}: {
    children: ReactNode;
    cookies: string | null;
}) {
    const initialState = cookieToInitialState(
        wagmiAdapter.wagmiConfig as Config,
        cookies
    );

    return (
        <WagmiProvider
            config={wagmiAdapter.wagmiConfig as Config}
            initialState={initialState}
        >
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}
