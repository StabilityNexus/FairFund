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
                amountFundingTokens: {
                    increment: Number(amountOfTokens),
                },
            },
        });
        return new NextResponse('Success', { status: 200 });
    } catch (err) {
        console.log('[DEPOSIT_TOKENS_ERROR]: ', err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
