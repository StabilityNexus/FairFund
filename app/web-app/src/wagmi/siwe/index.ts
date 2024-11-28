'use client';
import { getCsrfToken, getSession, signIn, signOut } from 'next-auth/react';
import { createSIWEConfig, formatMessage } from '@web3modal/siwe';
import type {
    SIWEVerifyMessageArgs,
    SIWECreateMessageArgs,
} from '@web3modal/siwe';
import { foundry, polygon, polygonAmoy } from 'viem/chains';
import { type Session } from 'next-auth';

export const siweConfig = createSIWEConfig({
    getMessageParams: async () => ({
        domain: typeof window !== 'undefined' ? window.location.host : '',
        uri: typeof window !== 'undefined' ? window.location.origin : '',
        chains:
            process.env.NEXT_PUBLIC_NETWORK === 'foundry'
                ? [foundry.id]
                : [polygon.id, polygonAmoy.id],
        statement: process.env.NEXT_PUBLIC_SIGN_IN_STATEMENT,
    }),
    createMessage: ({ address, ...args }: SIWECreateMessageArgs) =>
        formatMessage(args, address),
    getNonce: async () => {
        const nonce = await getCsrfToken();
        if (!nonce) {
            throw new Error('Failed to get nonce!');
        }
        return nonce;
    },
    getSession: async () => {
        const session: Session | null = await getSession();
        if (!session) {
            throw new Error('Failed to get session!');
        }
        return {
            address: session.user.id,
            chainId: session.user.chainId,
        };
    },
    verifyMessage: async ({ message, signature }: SIWEVerifyMessageArgs) => {
        try {
            await signIn('siwe', {
                message,
                signature,
                callbackUrl: '/profile',
                redirect: true,
            });
            return true;
        } catch (error) {
            return false;
        }
    },
    signOut: async () => {
        try {
            await signOut({
                callbackUrl: '/dashboard',
                redirect: true,
            });
            return true;
        } catch (error) {
            return false;
        }
    },
    signOutOnNetworkChange: false,
});
