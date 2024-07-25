import prisma from '@/lib/db';
import { type Space } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';

export interface SpaceWithVaultCount extends Space {
    _count: {
        vaults: number;
    };
}

export async function filterSpaces(
    query: string
): Promise<SpaceWithVaultCount[]> {
    noStore();
    return prisma.space.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
            ],
        },
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
}
