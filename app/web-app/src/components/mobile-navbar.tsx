'use client';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
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
                            <>
                                {route.options.length > 0 ? (
                                    <>
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger className="py-4">
                                                <route.icon className="h-5 w-5 mr-3" />
                                                {route.label}
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent>
                                                    {route.options.map(
                                                        (option) => {
                                                            return (
                                                                <DropdownMenuItem
                                                                    className="py-4"
                                                                    key={
                                                                        option.href
                                                                    }
                                                                >
                                                                    <Link
                                                                        href={
                                                                            option.href
                                                                        }
                                                                        className="flex flex-row"
                                                                    >
                                                                        <option.icon className="h-5 w-5 mr-3" />
                                                                        {
                                                                            option.label
                                                                        }
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                            );
                                                        }
                                                    )}
                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>
                                        </DropdownMenuSub>
                                    </>
                                ) : (
                                    <DropdownMenuItem
                                        className="py-4"
                                        key={route.href}
                                    >
                                        <Link
                                            href={route.href}
                                            className="flex flex-row"
                                        >
                                            <route.icon className="h-5 w-5 mr-3" />
                                            {route.label}
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                            </>
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
