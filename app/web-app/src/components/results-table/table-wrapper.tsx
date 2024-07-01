import prisma from '@/lib/db';
import { type Proposal } from '@prisma/client';
import { columns } from '@/components/results-table/columns';
import { DataTable } from '@/components/data-table';

interface ResultTableWrapperProps {
    fundingVaultId: number;
    vaultBalance: number;
    fundingTokenSymbol: string;
}

export default async function ResultTableWrapper({
    fundingVaultId,
    vaultBalance,
    fundingTokenSymbol,
}: ResultTableWrapperProps) {
    const proposals: Proposal[] = await prisma.proposal.findMany({
        where: {
            fundingVaultId,
        },
    });
    const updatedProposals = proposals.map((proposal) => {
        const percentage =
            vaultBalance > 0
                ? (proposal.fundAllocated / vaultBalance) * 100
                : 0;
        return {
            ...proposal,
            percentage,
            fundingTokenSymbol,
        };
    });

    return <DataTable columns={columns} data={updatedProposals} />;
}
