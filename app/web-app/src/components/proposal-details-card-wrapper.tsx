import type { Proposal } from '@prisma/client';

import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right';
import Coins from 'lucide-react/dist/esm/icons/coins';
import File from 'lucide-react/dist/esm/icons/file';
import LinkIcon from 'lucide-react/dist/esm/icons/link';
import User2 from 'lucide-react/dist/esm/icons/user-2';

import { StatCard } from '@/components/stat-card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ProposalDetailsCardWrapperProps {
    proposal: Proposal;
    vault: {
        fundingTokenSymbol: string;
        votingTokenAddress: string;
        vaultAddress: string;
    };
}

export default function ProposalDetailsCardWrapper({
    proposal,
    vault,
}: ProposalDetailsCardWrapperProps) {
    return (
        <div className="space-y-6">
            {proposal.proposalMetadata.length > 0 ? (
                <div
                    className={cn(
                        proposal.proposalMetadata.length > 0 &&
                            'grid gap-6 md:grid-cols-2'
                    )}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold flex items-center">
                                <div className="mr-4 bg-gray-100 p-3 rounded-full">
                                    <File className="h-6 w-6 dark:text-gray-800" />
                                </div>
                                Description
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <p className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors line-clamp-3">
                                        {proposal.description}
                                    </p>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl max-h-[80vh]">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Proposal Description
                                        </DialogTitle>
                                    </DialogHeader>
                                    <DialogDescription className="mt-4 max-h-[60vh] overflow-y-auto">
                                        {proposal.description}
                                    </DialogDescription>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold flex items-center">
                                <div className="mr-4 bg-gray-100 p-3 rounded-full">
                                    <LinkIcon className="h-6 w-6 dark:text-gray-800" />
                                </div>
                                Proposal Metadata
                            </CardTitle>
                            <CardDescription>
                                The links provided by the proposers are not
                                verified by fairfund, please proceed with
                                caution.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link
                                href={proposal.proposalMetadata}
                                className="cursor-pointer flex items-center text-sm text-blue-600 hover:underline"
                                target="_blank"
                            >
                                {proposal.proposalMetadata}
                                <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center">
                            <div className="mr-4 bg-gray-100 p-3 rounded-full">
                                <File className="h-6 w-6 dark:text-gray-800" />
                            </div>
                            Description
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Dialog>
                            <DialogTrigger asChild>
                                <p className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors line-clamp-3">
                                    {proposal.description}
                                </p>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[80vh]">
                                <DialogHeader>
                                    <DialogTitle>
                                        Proposal Description
                                    </DialogTitle>
                                </DialogHeader>
                                <DialogDescription className="mt-4 max-h-[60vh] overflow-y-auto">
                                    {proposal.description}
                                </DialogDescription>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            )}
            <div className="grid gap-6 md:grid-cols-2">
                <StatCard
                    title="Creator"
                    icon={<User2 className="h-6 w-6 dark:text-gray-800" />}
                    value={
                        <div className="flex flex-col items-start">
                            <p className="text-xs text-muted-foreground mb-1">
                                Wallet Address:
                            </p>
                            <Badge
                                variant="secondary"
                                className="text-xs font-mono break-all w-full"
                            >
                                {proposal.proposerAddress}
                            </Badge>
                        </div>
                    }
                    description="Creator's wallet address"
                />
                <StatCard
                    title="Recipient"
                    icon={<User2 className="h-6 w-6 dark:text-gray-800" />}
                    value={
                        <div className="flex flex-col items-start">
                            <p className="text-xs text-muted-foreground mb-1">
                                Wallet Address:
                            </p>
                            <Badge
                                variant="secondary"
                                className="text-xs font-mono break-all w-full"
                            >
                                {proposal.recipient}
                            </Badge>
                        </div>
                    }
                    description="Recipient's wallet address"
                />
                <StatCard
                    title="Min Request Amount"
                    icon={<Coins className="h-6 w-6 dark:text-gray-800" />}
                    value={`${proposal.minRequestAmount} ${vault.fundingTokenSymbol}`}
                    description="Minimum amount that can be requested"
                />
                <StatCard
                    title="Max Request Amount"
                    icon={<Coins className="h-6 w-6 dark:text-gray-800" />}
                    value={`${proposal.maxRequestAmount} ${vault.fundingTokenSymbol}`}
                    description="Maximum amount that can be requested"
                />
            </div>
        </div>
    );
}
