import prisma from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try{
        const {vaultAddress, description,creatorAddress,amountVotingTokens,amountFundingTokens,fundingTokenAddress,votingTokenAddress } = await req.json();
        const vault = await prisma.fundingVault.create({
            data: {
                description,
                creatorAddress,
                vaultAddress,
                amountFundingTokens,
                amountVotingTokens,
                fundingTokenAddress,
                votingTokenAddress,
            },
        });
        return NextResponse.json(vault);
    }catch(err){
        console.log('[CREATE_VAULT_ERROR]: ',err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}