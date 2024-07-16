import { fundingVaultABI } from '@/blockchain/constants';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BlockchainActionButton } from '@/components/blockchain-action-button';

import Share2 from 'lucide-react/dist/esm/icons/share-2';
import Users from 'lucide-react/dist/esm/icons/users';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import Coins from 'lucide-react/dist/esm/icons/coins';
import DollarSign from 'lucide-react/dist/esm/icons/dollar-sign';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';

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

    const formattedVaultBalancePromise = getVaultBalance(vault);

    const tallyDate = getTallyDate(vault);

    const votingTokenDataPromise = getTotalVotingTokens(vault);

    const tokensDistributedPromise = getTotalDistributedAmount(vault);
    const [formattedVaultBalance, votingTokenData, tokensDistributed] =
        await Promise.all([
            formattedVaultBalancePromise,
            votingTokenDataPromise,
            tokensDistributedPromise,
        ]);
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
                    value={votingTokenData?.totalVotingTokensAvailable}
                    description="Total number of voting power tokens minted."
                />
                <StatCard
                    title="Total Votes Used"
                    icon={<Share2 className="h-6 w-6 text-purple-500" />}
                    value={votingTokenData?.totalVotingTokensUsed}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="flex flex-col h-full">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold flex items-center justify-start">
                            Post-Tally Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow flex items-center justify-center">
                        <DistributeFundsButtonWrapper
                            className="w-full flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
                            vault={vault}
                            smartContractABI={fundingVaultABI}
                            isDisabled={isFundsDistributed}
                        />
                    </CardContent>
                </Card>
                <Card className="flex flex-col h-full">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold flex items-center justify-start">
                            Post-Distribution Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex0grow flex flex-col justify-center space-y-4">
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
                        <BlockchainActionButton
                            smartContractAddress={
                                vault.vaultAddress as `0x${string}`
                            }
                            functionName="withdrawRemaining"
                            smartContractABI={fundingVaultABI}
                            buttonText="Withdraw Remaining Funding Tokens"
                            iconName="dollarIcon"
                            successMessage="Remaining funding tokens withdrawn successfully."
                            className="w-full py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
                            isDisabled={!isFundsDistributed}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
