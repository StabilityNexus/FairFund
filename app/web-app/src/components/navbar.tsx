'use client';

import Link from "next/link";
import VoteIcon from "@/components/vote-icon";
import { Button } from "./ui/button";
import ConnectWalletButton from "./connect-wallet-button";


export default function Navbar(){
    return (
        <div className="fixed w-full z-50 flex justify-between items-center py-4 px-4 border-b border-primary/10 bg-secondary">
                <Link href={"/"} className="flex items-center">
                    <VoteIcon
                        className="h-6  w-6 md:h-9 md:w-9"
                    />
                    <h1 className="ml-1 text-xl md:text-3xl font-bold text-primary">
                        fairfund
                    </h1>
                </Link>
                <div className="flex items-center gap-x-3">
                    <ConnectWalletButton/>
                </div>
        </div>
    )
}