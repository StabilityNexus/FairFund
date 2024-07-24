import prisma from '@/lib/db';
import { type Space } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';

export async function filterSpaces(query: string): Promise<Space[]> {
    noStore();
    return prisma.space.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
            ],
        },
    });
}
