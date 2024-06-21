"use client";
import {type Proposal} from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Dot, MoveUpRight } from "lucide-react";
import Link from "next/link";


export const columns:ColumnDef<Proposal>[] = [
    {
        accessorKey: "description",
        header: "Description"
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