import {
    type NextAuthOptions,
    getServerSession as getServerSessionInternal,
} from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { SiweMessage } from 'siwe';
import { createPublicClient, http } from 'viem';
import { foundry } from 'viem/chains';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
        maxAge: 30 * 60,
    },
    providers: [
        Credentials({
            id: 'siwe',
            name: 'SIWE',
            credentials: {
                message: {
                    label: 'Message',
                    type: 'text',
                    placeholder: '0x0',
                },
                signature: {
                    label: 'Signature',
                    type: 'text',
                    placeholder: '0x0',
                },
                csrfToken: {
                    label: 'CSRF Token',
                    type: 'text',
                    placeholder: '0x0',
                },
            },
            async authorize(credentials, req) {
                try {
                    if (!credentials) throw new Error('No credentials');
                    if (!req.headers) throw new Error('No headers');

                    const siwe = new SiweMessage(credentials.message);
                    const provider = createPublicClient({
                        chain: foundry,
                        transport: http('http://localhost:8545'),
                    });
                    const result = await siwe.verify(
                        {
                            signature: credentials.signature,
                            domain: req.headers.host,
                            nonce: credentials.csrfToken,
                        },
                        {
                            provider,
                        }
                    );
                    if (result.success) {
                        return {
                            id: siwe.address,
                            chainId: siwe.chainId,
                        };
                    } else {
                        return null;
                    }
                } catch (e) {
                    console.error(e);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                // Persist the data to the token right after authentication
                token.id = user.id;
                token.chainId = user.chainId;
            } else {
                //   TODO
            }

            return token;
        },
        session({ session, token }) {
            session.user.id = token.id;
            session.user.chainId = token.chainId;
            session.iat = token.iat;
            session.exp = token.exp;
            return session;
        },
    },
    pages: {
        signIn: '/siwe',
    },
};

export async function getServerSession() {
    const session = await getServerSessionInternal(authOptions);
    return session;
}
