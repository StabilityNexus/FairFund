'use client';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';

import AlignJustify from 'lucide-react/dist/esm/icons/align-justify';
import MoonStarIcon from 'lucide-react/dist/esm/icons/moon-star';
import SunIcon from 'lucide-react/dist/esm/icons/sun';

import { routes } from '@/lib/constants';
import ConnectWalletButton from '@/components/connect-wallet-button';
import { useTheme } from 'next-themes';

export default function MobileNavbar() {
    const { theme, setTheme } = useTheme();
    return (
        <div className="md:hidden">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <AlignJustify />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="md:hidden space-y-2">
                    {routes.map((route) => {
                        return (
                            <DropdownMenuItem className="py-4" key={route.href}>
                                <Link
                                    href={route.href}
                                    className="flex flex-row"
                                >
                                    <route.icon className="h-5 w-5 mr-3" />
                                    {route.label}
                                </Link>
                            </DropdownMenuItem>
                        );
                    })}
                    <DropdownMenuItem
                        className="py-4"
                        onClick={() =>
                            setTheme(theme === 'light' ? 'dark' : 'light')
                        }
                    >
                        <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all mr-2 dark:-rotate-90 dark:scale-0" />
                        <MoonStarIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        {theme === 'light' ? 'Light' : 'Dark'} Mode
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <ConnectWalletButton />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
