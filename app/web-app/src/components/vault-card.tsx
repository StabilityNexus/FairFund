'use client';
import { type FundingVault } from '@prisma/client';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

interface VaultCardProps {
    vault: FundingVault;
    selectedVaultId: number | null;
    handleClickVault: (vault: FundingVault) => void;
}

export default function VaultCard({
    vault,
    selectedVaultId,
    handleClickVault,
}: VaultCardProps) {
    return (
        <div
            className={cn(
                'mx-2 p-6 border rounded-lg cursor-pointer transition-all',
                selectedVaultId && selectedVaultId === vault.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary hover:bg-primary/5'
            )}
            onClick={() => handleClickVault(vault)}
        >
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg">{vault.description}</h3>
                <Badge
                    variant={
                        vault.tallyDate.getTime() > Date.now()
                            ? 'default'
                            : 'secondary'
                    }
                >
                    {vault.tallyDate.getTime() > Date.now()
                        ? 'active'
                        : 'closed'}
                </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
                Creator: {vault.creatorAddress}
            </p>
            <p className="text-sm font-medium">
                Funding Token: {vault.fundingTokenSymbol}
            </p>
        </div>
    );
}
