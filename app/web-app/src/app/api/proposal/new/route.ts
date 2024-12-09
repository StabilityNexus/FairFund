import prisma from '@/lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from '@/app/api/auth/options';

export async function POST(req: Request) {
    try {
        const session = await getServerSession();
        if (!session) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const {
            title,
            description,
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
                title,
                description,
                proposerAddress: session.user.address,
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
