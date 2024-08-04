'use client';

import { createSIWEConfig, type SIWEConfig } from '@web3modal/siwe';
import { getCsrfToken, getSession, signIn, signOut } from 'next-auth/react';
import { SiweMessage } from 'siwe';

export const siweConfig = createSIWEConfig({
    createMessage: ({ nonce, address, chainId }) => {
        return new SiweMessage({
            nonce,
            chainId,
            address,
            version: '1',
            uri: window.location.origin,
            domain: window.location.host,
            statement: process.env.NEXT_PUBLIC_SIGN_IN_STATEMENT,
        }).prepareMessage();
    },
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
            throw new Error('Failed to get session!');
        }
        return {
            address: session.user.id,
            chainId: session.user.chainId,
        };
    },
    verifyMessage: async ({ message, signature }) => {
        const path = window.location.pathname;
        const searchParams = new URLSearchParams(window.location.search);
        const callbackUrl =
            searchParams.get('callbackUrl') || `${path}?${searchParams}`;
        try {
            await signIn('siwe', {
                message,
                signature,
                callbackUrl,
            });
            return true;
        } catch (error) {
            return false;
        }
    },
    signOut: async () => {
        try {
            await signOut();
            return true;
        } catch (error) {
            return false;
        }
    },
});
