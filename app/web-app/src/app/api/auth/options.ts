import {
    type NextAuthOptions,
    getServerSession as getServerSessionInternal,
} from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { SiweMessage } from 'siwe';
import { createPublicClient, http } from 'viem';
import { foundry, sepolia } from 'viem/chains';
import prisma from '@/lib/db';

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
                        chain:
                            process.env.NEXT_PUBLIC_NETWORK === 'foundry'
                                ? foundry
                                : sepolia,
                        transport:
                            process.env.NEXT_PUBLIC_NETWORK === 'foundry'
                                ? http('http://localhost:8545')
                                : http(
                                      `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
                                  ),
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
                        let user = await prisma.user.findFirst({
                            where: {
                                address: result.data.address,
                                chainId: result.data.chainId,
                            },
                        });
                        if (!user) {
                            user = await prisma.user.create({
                                data: {
                                    address: result.data.address,
                                    chainId: result.data.chainId,
                                },
                            });
                        }
                        return {
                            id: user.id,
                            address: user.address,
                            chainId: user.chainId,
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
                token.id = user.id;
                token.address = user.address;
                token.chainId = user.chainId;
            } else {
                const user = await prisma.user.findFirst({
                    where: {
                        address: token.address,
                    },
                });
                if (user) {
                    token.id = user.id;
                    token.address = user.address;
                    token.chainId = user.chainId;
                }
            }
            return token;
        },
        session({ session, token }) {
            delete session.user.image;
            delete session.user.name;
            delete session.user.email;
            session.user.id = token.id;
            session.user.address = token.address;
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
