import CardWrapper from '@/components/proposal-details-card-wrapper';
import { Separator } from '@/components/ui/separator';
import VoteProposal from '@/components/vote-proposal';
import prisma from '@/lib/db';
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
        <div className="p-8 w-full h-full flex justify-center items-center flex-col gap-4">
            <div className="space-y-2 w-full">
                <h3 className="text-lg">Proposal Details</h3>
                <p className="text-sm text-muted-foreground">
                    View the details of the proposal.
                </p>
            </div>
            <Separator className="bg-primary/10" />
            <CardWrapper proposal={proposal} />
            <div className="space-y-2 w-full">
                <h3 className="text-lg font-medium">Vote on Proposal</h3>
                <p className="text-sm text-muted-foreground">
                    Enter the amount of tokens you want to allocate to this
                    prospal.
                </p>
            </div>
            <Separator className="bg-primary/10" />
            <div className="w-full flex items-center justify-center">
                <VoteProposal
                    proposal={proposal}
                    votingTokenAddress={vault.votingTokenAddress}
                    vaultAddress={vault.vaultAddress}
                />
            </div>
        </div>
    );
}
