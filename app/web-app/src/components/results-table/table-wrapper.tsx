import prisma from '@/lib/db';
import { FundingVault, type Proposal } from '@prisma/client';
import { getColumn } from '@/components/results-table/columns';
import { DataTable } from '@/components/data-table';
import { redirect } from 'next/navigation';

interface ResultTableWrapperProps {
    fundingVaultId: number;
    vaultBalance: number;
}

export default async function ResultTableWrapper({
    fundingVaultId,
    vaultBalance,
}: ResultTableWrapperProps) {
    const proposals: Proposal[] = await prisma.proposal.findMany({
        where: {
            fundingVaultId,
        },
    });
    const columns = getColumn(vaultBalance);
    return <DataTable columns={columns} data={proposals} />;
}
