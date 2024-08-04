'use server';

import { getServerSession } from '@/app/api/auth/options';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function joinSpace(spaceId: number) {
    const session = await getServerSession();
    if (!session) {
        return null;
    }
    try {
        await prisma.space.update({
            where: {
                id: spaceId,
            },
            data: {
                members: {
                    connect: {
                        address: session.user.address,
                    },
                },
            },
        });
        revalidatePath(`/spaces/${spaceId}`);
    } catch (err) {
        console.error('[JOIN_SPACE_ERROR]', err);
        return null;
    }
}
