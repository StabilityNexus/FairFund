'use client';
import { useAppKit } from '@reown/appkit/react';
import { Button } from './ui/button';
import { useAccount } from 'wagmi';

export default function ConnectWalletButton() {
    const { open } = useAppKit();
    const { isConnected } = useAccount();

    return (
        <>
            <Button className="rounded-full" onClick={() => open()}>
                {isConnected ? 'Connected' : 'Connect Wallet'}
            </Button>
        </>
    );
}
