'use client';
import { createSIWEConfig, formatMessage } from '@reown/appkit-siwe';
import { getCsrfToken, getSession, signIn, signOut } from 'next-auth/react';
import { foundry, polygonAmoy } from 'viem/chains';

export const siweConfig = createSIWEConfig({
    getMessageParams: async () => ({
        uri: window.location.origin,
        domain: window.location.host,
        chains:
            process.env.NEXT_PUBLIC_NETWORK === 'foundry'
                ? [foundry.id]
                : [polygonAmoy.id],
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
