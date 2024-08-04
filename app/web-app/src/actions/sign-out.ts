'use server';
import { cookies } from 'next/headers';

export async function signOut() {
    try {
        cookies().delete('next-auth.session-token');
    } catch (err) {
        console.error('[SIGN_OUT_ERROR]', err);
        return null;
    }
}
