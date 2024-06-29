import prisma from '@/lib/db';
import { getTokenName } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const {
            vaultAddress,
            description,
            creatorAddress,
            fundingTokenAddress,
            votingTokenAddress,
            tallyDate,
        } = await req.json();
        const fundingTokenSymbol = await getTokenName(fundingTokenAddress);
        const votingTokenSymbol = await getTokenName(votingTokenAddress);
        const vault = await prisma.fundingVault.create({
            data: {
                description,
                creatorAddress,
                vaultAddress,
                fundingTokenSymbol,
                votingTokenSymbol,
                fundingTokenAddress,
                votingTokenAddress,
                tallyDate,
                isTallied: false,
            },
        });
        return NextResponse.json(vault);
    } catch (err) {
        console.log('[CREATE_VAULT_ERROR]: ', err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
