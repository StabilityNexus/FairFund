"use client";
import { type FundingVault } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { cn, tokenMap } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Dot, MoveUpRight } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<FundingVault>[] = [
    {
        id:"description",
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
            if (row.original.tallyDate?.getTime() > Date.now()) {
                status = "Active";
            } else {
                status = "Closed";
            }
            return (
                <Badge variant="outline" className={cn("bg-green-400 cursor-pointer dark:text-black", status === 'Closed' && 'bg-red-200 ')}>
                    <Dot className="ml-[-9px] mr-[-4px]" />
                    {status}
                </Badge>
            )
        },
        filterFn:(row,id,value)=>{
            if(value.includes("active") && value.includes("closed")){
                return true;
            }
            else if(value.length===1 && value.includes("active")){
                return row.original.tallyDate?.getTime() > Date.now();
            }else if(value.length===1 && value.includes("closed")){
                return row.original.tallyDate?.getTime() < Date.now();
            }else{
                return false;
            }
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