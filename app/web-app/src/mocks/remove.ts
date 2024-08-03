import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
    const tableNames = await db.$queryRaw<Array<{ tablename: string }>>`
            SELECT tablename FROM pg_tables WHERE schemaname='public'
        `;

    for (const { tablename } of tableNames) {
        if (tablename !== '_prisma_migrations') {
            await db.$executeRawUnsafe(
                `TRUNCATE TABLE "${tablename}" CASCADE;`
            );
        }
        // await db.$executeRaw`ALTER SEQUENCE "Space_id_seq" RESTART WITH 1`;
    }

    return { message: 'DB cleared successfully.' };
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
