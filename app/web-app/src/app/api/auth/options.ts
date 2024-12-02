import {
    type NextAuthOptions,
    getServerSession as getServerSessionInternal,
} from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import prisma from '@/lib/db';
import {
    type SIWESession,
    verifySignature,
    getChainIdFromMessage,
    getAddressFromMessage,
} from '@reown/appkit-siwe';

const nextAuthSecret = process.env.NEXTAUTH_SECRET;
if (!nextAuthSecret) {
    throw new Error('NEXTAUTH_SECRET is not set');
}

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
if (!projectId) {
    throw new Error('NEXT_PUBLIC_PROJECT_ID is not set');
}

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
        maxAge: 30 * 60,
    },
    secret: nextAuthSecret,
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
                    if (!credentials?.message) {
                        throw new Error('SiweMessage is undefined');
                    }
                    const { message, signature } = credentials;
                    const address = getAddressFromMessage(message);
                    const chainId =
                        getChainIdFromMessage(message).split(':')[1];
                    const isValid = await verifySignature({
                        address,
                        message,
                        signature,
                        chainId,
                        projectId,
                    });
                    if (isValid) {
                        let user = await prisma.user.upsert({
                            where: {
                                address: address,
                            },
                            update: {
                                chainId: Number(chainId),
                            },
                            create: {
                                address: address,
                                chainId: Number(chainId),
                            },
                        });
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
