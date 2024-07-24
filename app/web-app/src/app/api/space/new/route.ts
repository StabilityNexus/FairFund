import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export default async function POST(req: Request) {
    try {
        const { name, description } = await req.json();
        const result = await prisma.space.create({
            data: {
                name,
                description,
            },
        });
        return NextResponse.json(result);
    } catch (err) {
        console.log('[CREATE_SPACE_ERROR]: ', err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
