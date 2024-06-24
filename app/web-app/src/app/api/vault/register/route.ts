import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { vaultId, amountOfTokens } = await req.json();
        await prisma.fundingVault.update({
            where: {
                id: vaultId,
            },
            data: {
                amountVotingTokens: {
                    increment: Number(amountOfTokens),
                },
            },
        });
        return new NextResponse('Success', { status: 200 });
    } catch (err) {
        console.log('[REGISTER_TO_VOTE_ERROR]: ', err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
