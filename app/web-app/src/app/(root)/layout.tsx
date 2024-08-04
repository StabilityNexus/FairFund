import { config } from '@/wagmi/config';
import Web3ModalProvider from '@/wagmi/provider/web3-modal';
import { SessionProvider } from '@/components/session-provider';
import { cookieToInitialState } from 'wagmi';
import { headers } from 'next/headers';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/navbar';
import { getServerSession } from '@/app/api/auth/options';

export default async function ApplicationLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const initialState = cookieToInitialState(config, headers().get('cookie'));
    const session = await getServerSession();

    return (
        <div className="h-screen">
            <SessionProvider session={session}>
                <Web3ModalProvider initialState={initialState}>
                    <Navbar />
                    <main className="h-full pt-[70px]">{children}</main>
                </Web3ModalProvider>
            </SessionProvider>
            <Toaster />
        </div>
    );
}
