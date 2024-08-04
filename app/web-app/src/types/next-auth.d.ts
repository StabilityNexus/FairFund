import NextAuth from 'next-auth';

type Role = 'ADMIN' | 'USER';

declare module 'next-auth' {
    interface User {
        id: string;
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
        chainId: number;
        iat: number;
        exp: number;
    }
}
