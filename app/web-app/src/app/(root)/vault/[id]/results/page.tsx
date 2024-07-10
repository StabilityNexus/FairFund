import { fundingVaultABI } from '@/blockchain/constants';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BlockchainActionButton } from '@/components/blockchain-action-button';
import {
    Share2,
    Users,
    Calendar,
    Coins,
    DollarSign,
    CheckCircle,
} from 'lucide-react';
import { StatCard } from '@/components/stat-card';
import TableWrapper from '@/components/results-table/table-wrapper';

import { redirect } from 'next/navigation';
import {
    getTallyDate,
    getTotalDistributedAmount,
    getTotalVotingTokens,
    getVault,
    getVaultBalance,
} from '@/lib/vault-data';
import DistributeFundsButtonWrapper from '@/components/distribute-funds-button-wrapper';

export default async function VaultResultsPage({
    params,
}: {
    params: {
        id: string;
    };
}) {
    const id = params.id;
    const vault = await getVault(Number(id));
    if (!vault) {
        redirect('/dashboard');
    }
    const isTallyed = vault.isTallied;
    if (!isTallyed) {
        redirect(`/vault/${id}`);
    }

    const formattedVaultBalance = await getVaultBalance(vault);

    const tallyDate = getTallyDate(vault);

    const { totalVotingTokensAvailable, totalVotingTokensUsed } =
        await getTotalVotingTokens(vault);

    const tokensDistributed = await getTotalDistributedAmount(vault);
    const isFundsDistributed = vault.isDistributed;

    return (
        <div className="container mx-auto p-6 space-y-8">
            <h1 className="text-2xl font-bold mb-6">Vault Results</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                    title="Total Funding Tokens Locked"
                    icon={<Coins className="h-6 w-6 text-green-500" />}
                    value={`${formattedVaultBalance} ${vault.fundingTokenSymbol}`}
                    description="Total amount allocated for funding in this vault"
                />
                <StatCard
                    title="Total Voting Available"
                    icon={<Users className="h-6 w-6 text-blue-500" />}
                    value={totalVotingTokensAvailable}
                    description="Total number of voting power tokens minted."
                />
                <StatCard
                    title="Total Votes Used"
                    icon={<Share2 className="h-6 w-6 text-purple-500" />}
                    value={totalVotingTokensUsed}
                    description="Total number of voting power tokens used."
                />
                <StatCard
                    title="Tally Date"
                    icon={<Calendar className="h-6 w-6 text-red-500" />}
                    value={tallyDate}
                    description="Date when the votes were tallied and results finalized"
                />
                <StatCard
                    title="Tokens Distributed"
                    icon={<DollarSign className="h-6 w-6 text-yellow-500" />}
                    value={`${tokensDistributed} ${vault.fundingTokenSymbol}`}
                    description="Total amount of tokens distributed so far"
                />
                <StatCard
                    title="Funds Distributed"
                    icon={<CheckCircle className="h-6 w-6 text-teal-500" />}
                    value={isFundsDistributed ? 'Yes' : 'No'}
                    description="Whether funds have been distributed"
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
                        Post-Tally Actions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DistributeFundsButtonWrapper
                            vault={vault}
                            smartContractABI={fundingVaultABI}
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
