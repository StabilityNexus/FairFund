import prisma from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try{
        const { description,proposerAddress,minRequestAmount,maxRequestAmount,recipient,fundingVaultId } = await req.json();
        const proposal = await prisma.proposal.create({
            data: {
                description,
                proposerAddress,
                minRequestAmount,
                maxRequestAmount,
                recipient,
                fundingVaultId
            },
        });
        return NextResponse.json(proposal);
    }catch(err){
        console.log('[CREATE_PROPOSAL_ERROR]: ',err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}