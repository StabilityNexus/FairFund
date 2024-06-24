"use client";
import {type Proposal} from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { MoveUpRight } from "lucide-react";
import Link from "next/link";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


export const columns:ColumnDef<Proposal>[] = [
    {
        accessorKey: "description",
        header: "Description",
        cell:({row})=>{
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger className="max-w-60 truncate">
                            {row.original.description as React.ReactNode}
                        </TooltipTrigger>
                        <TooltipContent>
                            <div className="max-w-96 max-h-96 overflow-scroll">
                                <p className="text-sm">{row.original.description}</p>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        }
    },
    {
        accessorKey: "minRequestAmount",
        header: "Min Request Amount"
    },
    {
        accessorKey: "maxRequestAmount",
        header: "Max Request Amount"
    },
    {
        accessorKey: "recipient",
        header: "Recipient",
        cell:({row})=>{
            return (
                <Badge variant="outline">{row.original.recipient}</Badge>
            )
        }
    },
    {
        id:"more",
        cell:({row})=>{
            return (
                <Badge variant="secondary">
                    <Link className="cursor-pointer p-1 flex gap-1" href={`/proposal/${row.original.id}`}>
                        More
                        <MoveUpRight className="h-4 w-4"/>
                    </Link>
                </Badge>
            )
        }
    }
]