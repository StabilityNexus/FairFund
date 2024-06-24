import prisma from '@/lib/db';
import { type Proposal } from '@prisma/client';
import { columns } from '@/components/proposal-table/columns';
import { DataTable } from '@/components/data-table';

interface ProposalDetailsTableWrapperProps {
    fundingVaultId: number;
}

export default async function ProposalDetailsTableWrapper({
    fundingVaultId,
}: ProposalDetailsTableWrapperProps) {
    const proposals: Proposal[] = await prisma.proposal.findMany({
        where: {
            fundingVaultId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return <DataTable columns={columns} data={proposals} />;
}
