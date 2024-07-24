import prisma from '@/lib/db';
import { type Space } from '@prisma/client';

export default async function getSpace(id: number): Promise<Space | null> {
    try {
        const space = await prisma.space.findUnique({ where: { id } });
        return space;
    } catch (err) {
        console.log('[GET_SPACE_ERROR]: ', err);
        throw new Error('[GET_SPACE: Space not found.]');
    }
}
