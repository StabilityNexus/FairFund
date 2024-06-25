import React from 'react';
import prisma from '@/lib/db';
import { Coins, Dock, File, Fingerprint, TimerIcon, User2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { type FundingVault } from '@prisma/client';

interface VaultDetailsCardWrapperProps {
    fundingVault: FundingVault;
}

const iconMap = {
    id: Fingerprint,
    locked: Coins,
    proposals: Dock,
    tallyDate: TimerIcon,
    creator: User2,
    description: File,
};

const InfoCard = ({ title, icon:Icon, body, tooltip }:{
    title: string;
    icon: React.ElementType;
    body: string | number;
    tooltip: string;
}) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Card className="hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{title}</CardTitle>
                        <Icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{body}</div>
                    </CardContent>
                </Card>
            </TooltipTrigger>
            <TooltipContent>
                <p>{tooltip}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

export default async function VaultDetailsCardWrapper({
    fundingVault: vault,
}: VaultDetailsCardWrapperProps) {
    const proposals = await prisma.proposal.count({
        where: {
            fundingVaultId: vault.id,
        },
    });

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <InfoCard
                    title="Vault ID"
                    icon={iconMap['id']}
                    body={`#${vault.id}`}
                    tooltip="Unique identifier for this funding vault"
                />
                <InfoCard
                    title="Locked Tokens"
                    icon={iconMap['locked']}
                    body={`${vault.amountFundingTokens} ${vault.fundingTokenSymbol}`}
                    tooltip="Amount of funding tokens locked in this vault"
                />
                <InfoCard
                    title="Proposals"
                    icon={iconMap['proposals']}
                    body={proposals}
                    tooltip="Number of proposals submitted to this vault"
                />
                <InfoCard
                    title="Tally Date"
                    icon={iconMap['tallyDate']}
                    body={vault.tallyDate.toLocaleDateString()}
                    tooltip="Date when the voting results will be tallied"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center">
                            <User2 className="mr-2 h-5 w-5" />
                            Creator
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">Wallet Address:</p>
                        <Badge variant="secondary" className="px-3 py-1 text-xs font-mono w-full truncate">
                            {vault.creatorAddress}
                        </Badge>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center">
                            <File className="mr-2 h-5 w-5" />
                            Description
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Dialog>
                            <DialogTrigger asChild>
                                <p className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors line-clamp-3">
                                    {vault.description}
                                </p>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[80vh]">
                                <DialogHeader>
                                    <DialogTitle>Vault Description</DialogTitle>
                                </DialogHeader>
                                <DialogDescription className="mt-4 max-h-[60vh] overflow-y-auto">
                                    {vault.description}
                                </DialogDescription>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}