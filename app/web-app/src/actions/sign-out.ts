'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signOut() {
    try {
        const cookieName =
            process.env.NEXT_PUBLIC_WEBSITE_URL === 'http://localhost:3000'
                ? 'next-auth.session-token'
                : '__Secure-next-auth.session-token';
        cookies().delete(cookieName);
        redirect('/dashboard');
    } catch (err) {
        console.error('[SIGN_OUT_ERROR]', err);
        return null;
    }
}
