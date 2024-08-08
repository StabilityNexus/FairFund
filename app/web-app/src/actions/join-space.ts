'use server';

import { getServerSession } from '@/app/api/auth/options';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function joinSpace(spaceId: number) {
    const session = await getServerSession();
    if (!session) {
        throw new Error('Unauthorized Access');
    }
    const existingMember = await prisma.space.findUnique({
        where: {
            id: spaceId,
        },
        select: {
            members: {
                where: {
                    address: session.user.address,
                },
            },
        },
    });

    if (existingMember && existingMember.members.length > 0) {
        return;
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
        return;
    }
}
