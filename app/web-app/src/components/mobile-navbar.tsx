import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { AlignJustify } from "lucide-react";
import { routes } from "@/lib/constants";



export default function MobileNavbar() {
    return (
        <div className="md:hidden">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <AlignJustify />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="space-y-2" >
                    {routes.map((route) => {
                        return (
                            <DropdownMenuItem className="py-4" key={route.href}>
                                <Link href={route.href} className="flex flex-row">
                                    <route.icon className="h-5 w-5 mr-3" />
                                    {route.label}
                                </Link>
                            </DropdownMenuItem>
                        )
                    })}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <w3m-button />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}