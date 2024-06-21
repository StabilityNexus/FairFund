"use client";
import { type FundingVault } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { cn, tokenMap } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Dot, MoveUpRight } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<FundingVault>[] = [
    {
        accessorKey: "description",
        header: "Description"
    },
    {
        accessorKey: "creatorAddress",
        header: "Creator"
    },
    {
        accessorKey: "fundingTokenAddress",
        header: "Funding Token",
        cell: ({ row }) => {
            return (
                <Badge variant="outline">{tokenMap(row.getValue("fundingTokenAddress"))}</Badge>
            )
        }
    },
    {
        accessorKey: "votingTokenAddress",
        header: "Voting Token",
        cell: ({ row }) => {
            return (
                <Badge variant="outline">{tokenMap(row.getValue("votingTokenAddress"))}</Badge>
            )
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            let status;
            if (row.original.tallyDate?.getTime() < Date.now()) {
                status = "Active";
            } else {
                status = "Closed";
            }
            return (
                <Badge variant="outline" className={cn("bg-green-400 cursor-pointer", status === 'Closed' && 'bg-red-400')}>
                    <Dot className="ml-[-9px] mr-[-4px]" />
                    {status}
                </Badge>
            )
        }
    },
    {
        id: "more",
        cell: ({ row }) => {
            return (
                <Badge variant="secondary">
                    <Link className="cursor-pointer p-1 flex gap-1" href={`/vault/${row.original.id}`}>
                        More
                        <MoveUpRight className="h-4 w-4" />
                    </Link>
                </Badge>
            )
        }
    }
]