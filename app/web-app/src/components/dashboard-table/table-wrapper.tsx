import prisma from "@/lib/db";
import { type FundingVault } from "@prisma/client";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/dashboard-table/columns";


export default async function TableWrapper() {

    const vaults: FundingVault[] = await prisma.fundingVault.findMany();

    return (
        <DataTable
            columns={columns}
            data={vaults}
            useFilter={true}
        />
    )
}