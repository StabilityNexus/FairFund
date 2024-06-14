import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { allowedRoutes } from '../routes';
import { headers } from "next/headers";

function isPathAllowed(path: string): boolean {
    return allowedRoutes.some((route) => {
        return path.startsWith(route);
    });
}

function isWalletConnected(){
    try{
        const cookieHeader = headers().get('cookie');
        const wagmiStoreCookie = cookieHeader?.split('; ').find(row => row.startsWith('wagmi.store='))?.split('=')[1]  || '';
        const wagmiStore = JSON.parse(decodeURIComponent(wagmiStoreCookie));
        return wagmiStore.state.connections.value.length > 0;
    }catch(err){
        console.log('[MIDDLEWARE]: Error reading cookie: ',err);
        return false;
    }
}

export default function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    if(path==='/' || path.startsWith('/api')){
        return NextResponse.next();
    }
    if (isPathAllowed(path)) {    
        if (path.startsWith('/dashboard/') && path.length > '/dashboard/'.length) {
            return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
        }
        if (path.startsWith('/profile/') && path.length > '/profile/'.length) {
            return NextResponse.redirect(new URL('/profile', request.nextUrl));
        }
        if(path.startsWith('/proposal/new') || path.startsWith('/vault/new')){
            if(isWalletConnected()){
                return NextResponse.next();
            }
            return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
        }
    }else{
        return NextResponse.redirect(new URL('/', request.nextUrl));
    }
}


export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};