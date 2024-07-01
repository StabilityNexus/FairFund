import prisma from '@/lib/db';
import { fundingVaultABI } from '@/blockchain/constants';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BlockchainActionButton } from '@/components/blockchain-action-button';
import { Share2, Users, Calendar, Coins } from 'lucide-react';
import { StatCard } from '@/components/stat-card';
import TableWrapper from '@/components/results-table/table-wrapper';

import { readContract } from '@wagmi/core';
import { config as wagmiConfig } from '@/wagmi/config';
import { erc20ABI } from '@/blockchain/constants';
import { formatUnits } from 'viem';
import { redirect } from 'next/navigation';

export default async function VaultResultsPage({
    params,
}: {
    params: {
        id: string;
    };
}) {
    const id = params.id;
    const vault = await prisma.fundingVault.findUnique({
        where: {
            id: Number(id),
        },
    });
    if (!vault) {
        redirect('/dashboard');
    }
    const isTallyed = vault.isTallied;
    if (!isTallyed) {
        redirect(`/vault/${id}`);
    }

    // Vault Balance.
    const vaultBalance = await readContract(wagmiConfig, {
        address: vault.vaultAddress as `0x${string}`,
        abi: fundingVaultABI,
        functionName: 'getTotalBalanceAvailbleForDistribution',
    });
    const decimals = await readContract(wagmiConfig, {
        address: vault.fundingTokenAddress as `0x${string}`,
        abi: erc20ABI,
        functionName: 'decimals',
    });
    const formattedVaultBalance = formatUnits(
        vaultBalance as bigint,
        decimals as number
    );

    // tally date
    const tallyDate = new Date(vault.tallyDate).toLocaleDateString();

    // Total Voting Tokens Available
    const totalVotingTokensAvailable = await readContract(wagmiConfig, {
        address: vault.vaultAddress as `0x${string}`,
        abi: fundingVaultABI,
        functionName: 'getTotalVotingPowerTokensMinted',
    });
    const formattedTotalVotingTokensAvailable = formatUnits(
        totalVotingTokensAvailable as bigint,
        18
    );

    // Total voting tokens used
    const totalVotingTokensUsed = await readContract(wagmiConfig, {
        address: vault.vaultAddress as `0x${string}`,
        abi: fundingVaultABI,
        functionName: 'getTotalVotingPowerTokensMinted',
    });
    const formattedTotalVotingTokensUsed = formatUnits(
        totalVotingTokensUsed as bigint,
        18
    );

    return (
        <div className="container mx-auto p-6 space-y-8">
            <h1 className="text-2xl font-bold mb-6">Vault Results</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Funding Tokens Locked"
                    icon={<Coins className="h-6 w-6 text-green-500" />}
                    value={`${formattedVaultBalance} ${vault.fundingTokenSymbol}`}
                    description="Total amount allocated for funding in this vault"
                />
                <StatCard
                    title="Total Voting Available"
                    icon={<Users className="h-6 w-6 text-blue-500" />}
                    value={formattedTotalVotingTokensAvailable}
                    description="Total number of voting power tokens minted."
                />
                <StatCard
                    title="Total Votes Used"
                    icon={<Share2 className="h-6 w-6 text-purple-500" />}
                    value={formattedTotalVotingTokensUsed}
                    description="Total number of voting power tokens used."
                />
                <StatCard
                    title="Tally Date"
                    icon={<Calendar className="h-6 w-6 text-red-500" />}
                    value={tallyDate}
                    description="Date when the votes were tallied and results finalized"
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        Detailed Results
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <TableWrapper
                        fundingVaultId={Number(id)}
                        vaultBalance={Number(formattedVaultBalance)}
                        fundingTokenSymbol={vault.fundingTokenSymbol}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        Post-Voting Actions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <BlockchainActionButton
                            smartContractAddress={
                                vault.vaultAddress as `0x${string}`
                            }
                            functionName="distributeFunds"
                            smartContractABI={fundingVaultABI}
                            buttonText="Distribute Funds"
                            iconName="trendingUp"
                            successMessage="Funds distributed successfully."
                            className="w-full h-full flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
                        />
                        <BlockchainActionButton
                            smartContractAddress={
                                vault.vaultAddress as `0x${string}`
                            }
                            functionName="releaseVotingTokens"
                            smartContractABI={fundingVaultABI}
                            buttonText="Withdraw Voting Tokens"
                            iconName="creditCard"
                            successMessage="Voting tokens withdrawn successfully."
                            className="w-full h-full flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
