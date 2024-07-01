import prisma from '@/lib/db';
import type { FundingVault, Proposal } from '@prisma/client';
import { readContract } from '@wagmi/core';
import { config as wagmiConfig } from '@/wagmi/config';
import { erc20ABI, fundingVaultABI } from '@/blockchain/constants';
import { formatUnits } from 'viem';
import { NextResponse } from 'next/server';

async function tally(vault: FundingVault): Promise<void> {
    const proposals: Proposal[] = await prisma.proposal.findMany({
        where: {
            fundingVaultId: vault.id,
        },
    });

    proposals.forEach(async (proposal: Proposal) => {
        const fundsAllocated = await readContract(wagmiConfig, {
            address: vault.vaultAddress as `0x${string}`,
            abi: fundingVaultABI,
            functionName: 'calculateFundingToBeReceived',
            args: [proposal.proposalId],
        });
        const decimals = await readContract(wagmiConfig, {
            address: vault.fundingTokenAddress as `0x${string}`,
            abi: erc20ABI,
            functionName: 'decimals',
        });
        const formattedFundsAllocated = formatUnits(
            fundsAllocated as bigint,
            decimals as number
        );
        console.log(
            `Proposal ${proposal.id} has been allocated ${formattedFundsAllocated} tokens`
        );
        await prisma.proposal.update({
            where: {
                id: proposal.id,
            },
            data: {
                fundAllocated: Number(formattedFundsAllocated),
            },
        });
    });

    await prisma.fundingVault.update({
        where: {
            id: vault.id,
        },
        data: {
            isTallied: true,
        },
    });
}

export async function POST(req: Request) {
    try {
        // retrive all the vaults whos is tallied is false,
        const vaults = await prisma.fundingVault.findMany({
            where: {
                isTallied: false,
            },
        });

        // if their tally date has passed, tally them
        vaults.forEach(async (vault) => {
            if (vault.tallyDate < new Date()) {
                await tally(vault);
            }
        });

        return NextResponse.json({ message: 'Tallying Complete', status: 200 });
    } catch (err) {
        console.log('[TALLY_ERROR]: ', err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
