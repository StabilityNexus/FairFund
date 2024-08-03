import prisma from '@/lib/db';
import { type Space } from '@prisma/client';

export interface SpaceWithVaultCount extends Space {
    _count: {
        vaults: number;
    };
}

export default async function getSpace(
    id: number
): Promise<SpaceWithVaultCount | null> {
    try {
        const space = await prisma.space.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                _count: {
                    select: {
                        vaults: true,
                    },
                },
            },
        });
        return space;
    } catch (err) {
        console.log('[GET_SPACE_ERROR]: ', err);
        throw new Error('[GET_SPACE: Space not found.]');
    }
}
