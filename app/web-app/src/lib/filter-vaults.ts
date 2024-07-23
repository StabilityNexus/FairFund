import prisma from '@/lib/db';
import { type FundingVault } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';

export async function filterVaults(query: string): Promise<FundingVault[]> {
    noStore();
    return prisma.fundingVault.findMany({
        where: {
            OR: [
                { description: { contains: query, mode: 'insensitive' } },
                { creatorAddress: { contains: query, mode: 'insensitive' } },
                {
                    fundingTokenAddress: {
                        contains: query,
                        mode: 'insensitive',
                    },
                },
                {
                    fundingTokenSymbol: {
                        contains: query,
                        mode: 'insensitive',
                    },
                },
                {
                    votingTokenAddress: {
                        contains: query,
                        mode: 'insensitive',
                    },
                },
                { votingTokenSymbol: { contains: query, mode: 'insensitive' } },
                { vaultAddress: { contains: query, mode: 'insensitive' } },
            ],
        },
    });
}
