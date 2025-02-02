'use client';
import { createSIWEConfig, formatMessage } from '@reown/appkit-siwe';
import { foundry, polygonAmoy, sepolia, goerli,AppKitNetwork } from '@reown/appkit/networks';
import { getCsrfToken, getSession, signIn, signOut } from 'next-auth/react';

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

export const siweConfig = createSIWEConfig({
    getMessageParams: async () => ({
        uri: window.location.origin,
        domain: window.location.host,
        chains:
            process.env.NEXT_PUBLIC_NETWORK === 'foundry'
                ? [foundry.id]
                : [polygonAmoy.id, sepolia.id, goerli.id, milkomedaTestnet.id],
        statement: 'Sign In With Ethereum to prove you control this wallet.',
    }),
    createMessage: ({ address, ...args }) => formatMessage(args, address),
    getNonce: async () => {
        const nonce = await getCsrfToken();
        if (!nonce) {
            throw new Error('Failed to get nonce!');
        }

        return nonce;
    },
    getSession: async () => {
        const session = await getSession();
        if (!session) {
            return null;
        }
        return {
            address: session.user.id,
            chainId: session.user.chainId,
        };
    },
    verifyMessage: async ({ message, signature }) => {
        const path = window.location.pathname;
        try {
            await signIn('siwe', {
                message,
                redirect: false,
                signature,
            });
            return true;
        } catch {
            return false;
        }
    },
    signOut: async () => {
        try {
            await signOut({
                redirect: false,
            });
            return true;
        } catch (error) {
            console.log('[SIWE] Failed to sign out', error);
            return false;
        }
    },
});
