import Navbar from '@/components/navbar';
import { config } from '@/wagmi/config';
import Web3ModalProvider from '@/wagmi/context';
import { cookieToInitialState } from 'wagmi';
import { headers } from 'next/headers';
import { Toaster } from '@/components/ui/toaster';

export default function ApplicationLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const initialState = cookieToInitialState(config, headers().get('cookie'));

    return (
        <div className="h-full">
            <Web3ModalProvider initialState={initialState}>
                <Navbar />
                <main className="pt-[70px] h-full">{children}</main>
            </Web3ModalProvider>
            <Toaster />
        </div>
    );
}
