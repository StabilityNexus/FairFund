'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signOut() {
    try {
        cookies().delete('next-auth.session-token');
        redirect('/');
    } catch (err) {
        console.error('[SIGN_OUT_ERROR]', err);
        return null;
    }
}
