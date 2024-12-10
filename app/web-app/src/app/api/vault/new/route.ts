import prisma from '@/lib/db';
import { getTokenName } from '@/lib/get-token-name';
import { NextResponse } from 'next/server';
import { getServerSession } from '@/app/api/auth/options';

export async function POST(req: Request) {
    try {
        const session = await getServerSession();
        if (!session) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const {
            vaultAddress,
            name,
            description,
            fundingTokenAddress,
            votingTokenAddress,
            tallyDate,
            minimumRequestableAmount,
            maximumRequestableAmount,
            spaceId,
        } = await req.json();

        // If current user is not the creator of the space, return unauthorized
        const space = await prisma.space.findUnique({
            where: {
                id: spaceId,
            },
        });
        if (!space) {
            return new NextResponse('Space not found', { status: 404 });
        }
        if (space.creatorAddress !== session.user.address) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const fundingTokenSymbol = await getTokenName(fundingTokenAddress);
        const votingTokenSymbol = await getTokenName(votingTokenAddress);
        const vault = await prisma.fundingVault.create({
            data: {
                name,
                description,
                creatorAddress: session.user.address,
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
