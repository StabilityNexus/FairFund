import prisma from '@/lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from '@/app/api/auth/options';

export async function POST(req: Request) {
    try {
        const session = await getServerSession();
        if (!session) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { name, description } = await req.json();
        const result = await prisma.space.create({
            data: {
                name,
                creatorAddress: session.user.address,
                description,
            },
        });
        return NextResponse.json(result);
    } catch (err) {
        console.log('[CREATE_SPACE_ERROR]: ', err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
