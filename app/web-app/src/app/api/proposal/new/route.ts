import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const {
            description,
            proposerAddress,
            minRequestAmount,
            maxRequestAmount,
            recipient,
            fundingVaultId,
            proposalId,
            metadata,
        } = await req.json();
        const min = parseInt(minRequestAmount);
        const max = parseInt(maxRequestAmount);
        const proposal = await prisma.proposal.create({
            data: {
                description,
                proposerAddress,
                minRequestAmount: min,
                maxRequestAmount: max,
                recipient,
                fundingVaultId,
                proposalId,
                proposalMetadata: metadata || '',
            },
        });
        return NextResponse.json(proposal);
    } catch (err) {
        console.log('[CREATE_PROPOSAL_ERROR]: ', err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
