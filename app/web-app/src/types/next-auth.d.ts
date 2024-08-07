import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface User {
        id: string;
        address: string;
        chainId: number;
    }

    interface Session {
        user: User;
        iat: number;
        exp: number;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        address: string;
        chainId: number;
        iat: number;
        exp: number;
    }
}
