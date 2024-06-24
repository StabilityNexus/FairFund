import { NextResponse, NextRequest } from 'next/server';
import { allowedRoutes } from '../routes';
import { headers } from 'next/headers';

function isPathAllowed(path: string): boolean {
    return allowedRoutes.some((route) => {
        return path.startsWith(route);
    });
}

function isWalletConnected() {
    try {
        const cookieHeader = headers().get('cookie');
        const wagmiStoreCookie =
            cookieHeader
                ?.split('; ')
                .find((row) => row.startsWith('wagmi.store='))
                ?.split('=')[1] || '';
        const wagmiStore = JSON.parse(decodeURIComponent(wagmiStoreCookie));
        return wagmiStore.state.connections.value.length > 0;
    } catch (err) {
        console.log('[MIDDLEWARE]: Error reading cookie: ', err);
        return false;
    }
}

export default function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    if (pathname === '/' || pathname.startsWith('/api')) {
        return NextResponse.next();
    }
    if (isPathAllowed(pathname)) {
        if (pathname.match(/^\/dashboard\/.+$/)) {
            return NextResponse.redirect(
                new URL('/dashboard', request.nextUrl)
            );
        }
        if (pathname.match(/^\/profile\/.+$/)) {
            return NextResponse.redirect(new URL('/profile', request.nextUrl));
        }
    } else {
        return NextResponse.redirect(new URL('/', request.nextUrl));
    }
}

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
