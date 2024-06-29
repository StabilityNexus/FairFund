import prisma from '@/lib/db';
import { type Proposal } from '@prisma/client';
import { columns } from '@/components/results-table/columns';
import { DataTable } from '@/components/data-table';

interface ResultTableWrapperProps {
    fundingVaultId: number;
}

export default async function ResultTableWrapper({
    fundingVaultId,
}: ResultTableWrapperProps) {
    const proposals: Proposal[] = await prisma.proposal.findMany({
        where: {
            fundingVaultId,
        },
    });
    return <DataTable columns={columns} data={proposals} />;
}
