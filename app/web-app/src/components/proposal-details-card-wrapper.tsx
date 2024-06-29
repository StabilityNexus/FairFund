import type { Proposal } from '@prisma/client';
import { Coins, File, User2 } from 'lucide-react';
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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center">
                        <div className="mr-4 bg-gray-100 p-3 rounded-full">
                            <File className="h-6 w-6" />
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
                                <DialogTitle>Proposal Description</DialogTitle>
                            </DialogHeader>
                            <DialogDescription className="mt-4 max-h-[60vh] overflow-y-auto">
                                {proposal.description}
                            </DialogDescription>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
            <div className="grid gap-6 md:grid-cols-2">
                <StatCard
                    title="Creator"
                    icon={<User2 className="h-6 w-6 " />}
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
                    icon={<User2 className="h-6 w-6 " />}
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
                    icon={<Coins className="h-6 w-6" />}
                    value={`${proposal.minRequestAmount} ${vault.fundingTokenSymbol}`}
                    description="Minimum amount that can be requested"
                />
                <StatCard
                    title="Max Request Amount"
                    icon={<Coins className="h-6 w-6 " />}
                    value={`${proposal.maxRequestAmount} ${vault.fundingTokenSymbol}`}
                    description="Maximum amount that can be requested"
                />
            </div>
        </div>
    );
}
