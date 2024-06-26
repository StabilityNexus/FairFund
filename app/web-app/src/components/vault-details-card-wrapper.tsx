import React from 'react';
import prisma from '@/lib/db';
import {
    Calendar,
    File,
    FileText,
    LockKeyhole,
    User2,
    Wallet,
} from 'lucide-react';
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
import { StatCard } from '@/components/stat-card';

import { type FundingVault } from '@prisma/client';
import { getVaultBalance } from '@/lib/vault-data';

interface VaultDetailsCardWrapperProps {
    fundingVault: FundingVault;
}

export default async function VaultDetailsCardWrapper({
    fundingVault: vault,
}: VaultDetailsCardWrapperProps) {
    const vaultBalance = await getVaultBalance(vault);
    const proposals = await prisma.proposal.count({
        where: {
            fundingVaultId: vault.id,
        },
    });

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Vault ID"
                    icon={<Wallet className="text-blue-500" />}
                    value={`#${vault.id}`}
                    description="Unique identifier for this funding vault"
                />
                <StatCard
                    title="Available Funds"
                    icon={<LockKeyhole className="text-green-500" />}
                    value={`${vaultBalance} ${vault.fundingTokenSymbol}`}
                    description="Amount of funding tokens locked in this vault"
                />
                <StatCard
                    title="Proposals"
                    icon={<FileText className="text-purple-500" />}
                    value={proposals.toString()}
                    description="Number of proposals submitted to this vault"
                />
                <StatCard
                    title="Tally Date"
                    icon={<Calendar className="text-red-500" />}
                    value={vault.tallyDate.toLocaleDateString()}
                    description="Date when the voting results will be tallied"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center">
                            <div className="mr-4 bg-gray-100 p-3 rounded-full">
                                <User2 className="h-6 w-6" />
                            </div>
                            Creator
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">
                            Wallet Address:
                        </p>
                        <Badge
                            variant="secondary"
                            className="px-3 py-1 text-xs font-mono w-full break-all"
                        >
                            {vault.creatorAddress}
                        </Badge>
                    </CardContent>
                </Card>

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
