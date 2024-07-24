import prisma from '@/lib/db';
import { getTokenName } from '@/lib/get-token-name';
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
            minimumRequestableAmount,
            maximumRequestableAmount,
            spaceId,
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
                minimumRequestableAmount: parseFloat(minimumRequestableAmount),
                maximumRequestableAmount: parseFloat(maximumRequestableAmount),
                spaceId,
            },
        });
        return NextResponse.json(vault);
    } catch (err) {
        console.log('[CREATE_VAULT_ERROR]: ', err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
