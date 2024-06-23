'use client';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { Button } from "./ui/button";
import { useAccount } from 'wagmi';


export default function ConnectWalletButton() {
    const { open } = useWeb3Modal();
    const {isConnected}=useAccount();

    return (
        <>
            <Button className="rounded-full" onClick={()=>open()}>
                {isConnected ?"Connected" :"Connect Wallet"}
            </Button>
        </>
    )
}