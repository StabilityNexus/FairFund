import React from 'react';
import prisma from '@/lib/db';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import File from 'lucide-react/dist/esm/icons/file';
import FileText from 'lucide-react/dist/esm/icons/file-text';
import LockKeyhole from 'lucide-react/dist/esm/icons/lock-keyhole';
import User2 from 'lucide-react/dist/esm/icons/user-2';
import Wallet from 'lucide-react/dist/esm/icons/wallet';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatCard } from '@/components/stat-card';

import { type FundingVault } from '@prisma/client';
import { getVaultBalance } from '@/lib/vault-data';
import { truncateText } from '@/lib/truncate-text';
import { Button } from '@/components/ui/button';

interface VaultDetailsCardWrapperProps {
    fundingVault: FundingVault;
}

export default async function VaultDetailsCardWrapper({
    fundingVault: vault,
}: VaultDetailsCardWrapperProps) {
    const vaultBalancePromise = getVaultBalance(vault);
    const proposalsPromise = prisma.proposal.count({
        where: {
            fundingVaultId: vault.id,
        },
    });
    const [vaultBalance, proposals] = await Promise.all([
        vaultBalancePromise,
        proposalsPromise,
    ]);

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
                                <User2 className="h-6 w-6 dark:text-black" />
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
                                <File className="h-6 w-6 dark:text-black" />
                            </div>
                            Description
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 mb-2">
                            {truncateText(vault.description, 100)}
                            {vault.description.length > 100 && (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="link"
                                            className="p-0 h-auto font-normal"
                                        >
                                            Read more
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>
                                                Vault Description
                                            </DialogTitle>
                                        </DialogHeader>
                                        <p>{vault.description}</p>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
