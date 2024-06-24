'use client';
import Link from "next/link";
import VoteIcon from "@/components/vote-icon";
import ConnectWalletButton from "@/components/connect-wallet-button";
import MobileNavbar from "@/components/mobile-navbar";
import { ModeToggle } from "@/components/mode-toggle";
import { routes } from "@/lib/constants";



export default function Navbar() {
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
            <div className="hidden md:flex items-center gap-2">
                <div className="flex flex-row gap-x-6 mr-4">
                    {routes.map((route) => {
                        return (
                            <Link href={route.href} key={route.href} className="flex flex-row  gap-x-1 items-center">
                                <route.icon className="h-5 w-5" />
                                <h1 className="font-bold text-lg cursor-pointer">
                                    {route.label}
                                </h1>
                            </Link>
                        )
                    })}
                </div>
                <ConnectWalletButton />
                <ModeToggle/>
            </div>
            <MobileNavbar />
        </div>
    )
}