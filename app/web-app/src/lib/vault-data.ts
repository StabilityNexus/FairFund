import prisma from '@/lib/db';
import { readContract } from '@wagmi/core';
import { config as wagmiConfig } from '@/wagmi/config';
import { fundingVaultABI, erc20ABI } from '@/blockchain/constants';
import { formatUnits } from 'viem';

export async function getVault(id: number) {
    return await prisma.fundingVault.findUnique({ where: { id } });
}

export async function getVaultBalance(vault: any) {
    const vaultBalance = await readContract(wagmiConfig, {
        address: vault.vaultAddress as `0x${string}`,
        abi: fundingVaultABI,
        functionName: 'getTotalBalanceAvailbleForDistribution',
    });
    const decimals = await readContract(wagmiConfig, {
        address: vault.fundingTokenAddress as `0x${string}`,
        abi: erc20ABI,
        functionName: 'decimals',
    });
    return formatUnits(vaultBalance as bigint, decimals as number);
}

export async function getTotalVotingTokens(vault: any) {
    const totalVotingTokensAvailable = await readContract(wagmiConfig, {
        address: vault.vaultAddress as `0x${string}`,
        abi: fundingVaultABI,
        functionName: 'getTotalVotingPowerTokensMinted',
    });
    const totalVotingTokensUsed = await readContract(wagmiConfig, {
        address: vault.vaultAddress as `0x${string}`,
        abi: fundingVaultABI,
        functionName: 'getTotalVotingPowerTokensUsed',
    });
    return {
        totalVotingTokensAvailable: formatUnits(
            totalVotingTokensAvailable as bigint,
            18
        ),
        totalVotingTokensUsed: formatUnits(totalVotingTokensUsed as bigint, 18),
    };
}

export function getTallyDate(vault: any) {
    return new Date(vault.tallyDate).toLocaleDateString();
}
