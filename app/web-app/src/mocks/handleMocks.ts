const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const { FundingVault, Proposal } = require('@prisma/client');

interface MockData {
    fundingVaults: (typeof FundingVault)[];
    proposals: (typeof Proposal)[];
}

const db = new PrismaClient();

async function main() {
    const command = process.argv[2];
    if (command === 'add') {
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
    if (command === 'remove') {
        const tableNames = await db.$queryRaw<Array<{ tablename: string }>>`
            SELECT tablename FROM pg_tables WHERE schemaname='public'
        `;

        for (const { tablename } of tableNames) {
            if (tablename !== '_prisma_migrations') {
                await db.$executeRawUnsafe(
                    `TRUNCATE TABLE "${tablename}" CASCADE;`
                );
            }
        }
        return { message: 'DB cleared successfully.' };
    }
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
