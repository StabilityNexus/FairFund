import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import { type FundingVault, Proposal } from '@prisma/client';

interface MockData {
    fundingVaults: FundingVault[];
    proposals: Proposal[];
}

const db = new PrismaClient();

async function main() {
    const data: MockData = JSON.parse(
        fs.readFileSync('src/mocks/mockData.json', 'utf-8')
    );
    for (const vault of data.fundingVaults) {
        await db?.fundingVault.create({
            data: vault,
        });
    }
    for (const proposal of data.proposals) {
        await db?.proposal.create({
            data: proposal,
        });
    }
    return { message: 'Mock data added successfully' };
}

main()
    .then((res) => {
        console.log(res?.message);
    })
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await db.$disconnect();
    });
