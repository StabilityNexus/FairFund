'use client';
import { getCsrfToken, getSession, signIn, signOut } from 'next-auth/react';
import { createSIWEConfig, formatMessage } from '@reown/appkit-siwe';
import type {
    SIWEVerifyMessageArgs,
    SIWECreateMessageArgs,
    SIWESession,
} from '@reown/appkit-siwe';
import { type Session } from 'next-auth';
import { getAddress } from 'viem';
import { foundry, polygonAmoy, AppKitNetwork } from '@reown/appkit/networks';

const normalizeAddress = (address: string): string => {
    try {
        const splitAddress = address.split(':');
        const extractedAddress = splitAddress[splitAddress.length - 1];
        const checksumAddress = getAddress(extractedAddress);
        splitAddress[splitAddress.length - 1] = checksumAddress;
        const normalizedAddress = splitAddress.join(':');

        return normalizedAddress;
    } catch (error) {
        return address;
    }
};

const chains =
    process.env.NEXT_PUBLIC_NETWORK === 'foundry' ? [foundry] : [polygonAmoy];

export const siweConfig = createSIWEConfig({
    getMessageParams: async () => ({
        domain: typeof window !== 'undefined' ? window.location.host : '',
        uri: typeof window !== 'undefined' ? window.location.origin : '',
        chains: chains.map((chain: AppKitNetwork) =>
            parseInt(chain.id.toString())
        ),
        statement: process.env.NEXT_PUBLIC_SIGN_IN_STATEMENT,
    }),
    createMessage: ({ address, ...args }: SIWECreateMessageArgs) =>
        formatMessage(args, normalizeAddress(address)),
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
        const session: Session | null = await getSession();
        console.log(session, 'From Signout');
        // return true;
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
});
