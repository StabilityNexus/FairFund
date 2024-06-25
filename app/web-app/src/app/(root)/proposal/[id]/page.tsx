import CardWrapper from '@/components/proposal-details-card-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import VoteProposal from '@/components/vote-proposal';
import prisma from '@/lib/db';
import { FileText, Vote } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function ProposalDetailsPage({
    params,
}: {
    params: {
        id: string;
    };
}) {
    const id = params.id;
    const proposal = await prisma.proposal.findUnique({
        where: {
            id: Number(id),
        },
    });
    const vault = await prisma.fundingVault.findUnique({
        where: {
            id: proposal?.fundingVaultId,
        },
        select: {
            votingTokenAddress: true,
            vaultAddress: true,
        },
    });
    if (!proposal || !vault) {
        redirect('/dashboard');
    }
    return (
        <div className="container mx-auto py-8 space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center">
                    <FileText className="mr-2" />
                    Proposal Details
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">
                    View the details of the proposal.
                </p>
                <CardWrapper proposal={proposal} />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center">
                    <Vote className="mr-2" />
                    Vote on Proposal
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">
                    Enter the amount of tokens you want to allocate to this proposal.
                </p>
                <div className="mt-4">
                    <VoteProposal
                        proposal={proposal}
                        votingTokenAddress={vault.votingTokenAddress}
                        vaultAddress={vault.vaultAddress}
                    />
                </div>
            </CardContent>
        </Card>
    </div>
    );
}
