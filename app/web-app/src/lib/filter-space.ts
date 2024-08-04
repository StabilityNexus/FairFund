import prisma from '@/lib/db';
import { type Space } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';
import { SpaceWithVaultCount } from '@/lib/space-data';

export async function filterSpaces(
    query: string,
    page: number,
    pageSize: number,
    creator?: string
): Promise<{ spaces: SpaceWithVaultCount[]; totalCount: number }> {
    noStore();

    const skip = (page - 1) * pageSize;
    const [spaces, totalCount] = await Promise.all([
        prisma.space.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                ],
                creatorAddress: creator,
            },
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                creatorAddress: true,
                _count: {
                    select: {
                        vaults: true,
                    },
                },
            },
            skip,
            take: pageSize,
        }),
        prisma.space.count({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                ],
            },
        }),
    ]);

    return { spaces, totalCount };
}
