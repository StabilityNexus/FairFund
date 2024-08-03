import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const db = new PrismaClient();

async function main() {
    const spacesToCreate = 100;

    for (let i = 0; i < spacesToCreate; i++) {
        const space = await db.space.create({
            data: {
                name: faker.company.name(),
                description: faker.company.catchPhraseDescriptor(),
            },
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
