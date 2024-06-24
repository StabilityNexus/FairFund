'use client';
import { type FundingVault } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Dot, MoveUpRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

export const columns: ColumnDef<FundingVault>[] = [
    {
        id: 'description',
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
        accessorKey: 'creatorAddress',
        header: 'Creator',
    },
    {
        accessorKey: 'fundingTokenSymbol',
        header: 'Funding Token',
        cell: ({ row }) => {
            const fundingTokenSymbol = row.getValue('fundingTokenSymbol');
            const fundingTokenAddress = row.original.fundingTokenAddress;
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Badge variant="outline">
                                {fundingTokenSymbol as React.ReactNode}
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm">
                                    Token Address:{' '}
                                    {fundingTokenAddress as React.ReactNode}
                                </p>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
    },
    {
        accessorKey: 'votingTokenSymbol',
        header: 'Voting Token',
        cell: ({ row }) => {
            const votingTokenSymbol = row.getValue('votingTokenSymbol');
            const votingTokenAddress = row.original.votingTokenAddress;
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Badge variant="outline">
                                {votingTokenSymbol as React.ReactNode}
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm">
                                    Token Address:{' '}
                                    {votingTokenAddress as React.ReactNode}
                                </p>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            let status;
            if (row.original.tallyDate?.getTime() > Date.now()) {
                status = 'Active';
            } else {
                status = 'Closed';
            }
            return (
                <Badge
                    variant="outline"
                    className={cn(
                        'bg-green-400 cursor-pointer dark:text-black',
                        status === 'Closed' && 'bg-red-200 '
                    )}
                >
                    <Dot className="ml-[-9px] mr-[-4px]" />
                    {status}
                </Badge>
            );
        },
        filterFn: (row, id, value) => {
            if (value.includes('active') && value.includes('closed')) {
                return true;
            } else if (value.length === 1 && value.includes('active')) {
                return row.original.tallyDate?.getTime() > Date.now();
            } else if (value.length === 1 && value.includes('closed')) {
                return row.original.tallyDate?.getTime() < Date.now();
            } else {
                return false;
            }
        },
    },
    {
        id: 'more',
        cell: ({ row }) => {
            return (
                <Badge variant="secondary">
                    <Link
                        className="cursor-pointer p-1 flex gap-1"
                        href={`/vault/${row.original.id}`}
                    >
                        More
                        <MoveUpRight className="h-4 w-4" />
                    </Link>
                </Badge>
            );
        },
    },
];
