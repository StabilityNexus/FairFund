'use client';
import type { PropsWithChildren } from 'react';
import React from 'react';

import type { Session } from 'next-auth';
import { SessionProvider as SessionProviderInternal } from 'next-auth/react';

type SessionProviderProps = PropsWithChildren<{
    session?: Session | null;
}>;

export const SessionProvider: React.FC<SessionProviderProps> = ({
    session,
    children,
}) => (
    <SessionProviderInternal session={session}>
        {children}
    </SessionProviderInternal>
);
