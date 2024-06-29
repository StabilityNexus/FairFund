'use client';
import { type Proposal } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { MoveUpRight } from 'lucide-react';
import Link from 'next/link';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';

export const columns: ColumnDef<Proposal>[] = [
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => {
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger className="max-w-60 truncate">
                            {row.original.description as React.ReactNode}
                        </TooltipTrigger>
                        <TooltipContent>
                            <div className="max-w-96 max-h-96 overflow-scroll">
                                <p className="text-sm">
                                    {row.original.description}
                                </p>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
    },
    {
        accessorKey: 'fundsAllocated',
        header: 'Funds Allocated',
        cell: ({ row }) => {
            return <div>{row.original.fundAllocated}</div>;
        },
    },
    {
        accessorKey: 'distribution',
        header: 'Distribution',
        cell: ({ row }) => {
            // TODO: Implement Progress bar
            return <Progress value={50} className="w-full" />;
        },
    },
    {
        id: 'more',
        cell: ({ row }) => {
            return (
                <div className="w-full flex justify-end">
                    <Badge variant="secondary">
                        <Link
                            className="cursor-pointer p-1 flex gap-1 justify-end"
                            href={`/proposal/${row.original.id}`}
                        >
                            More
                            <MoveUpRight className="h-4 w-4" />
                        </Link>
                    </Badge>
                </div>
            );
        },
    },
];
