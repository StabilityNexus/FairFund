import prisma from '@/lib/db';
import { readContract } from '@wagmi/core';
import { config as wagmiConfig } from '@/wagmi/config';
import { fundingVaultABI, erc20ABI } from '@/blockchain/constants';
import { formatUnits } from 'viem';
import { type FundingVault } from '@prisma/client';

export async function getVault(id: number) {
    return await prisma.fundingVault.findUnique({ where: { id } });
}

export async function getVaultBalance(vault: FundingVault) {
    const vaultBalance = await readContract(wagmiConfig, {
        address: vault.vaultAddress as `0x${string}`,
        abi: fundingVaultABI,
        functionName: 'getTotalBalanceAvailbleForDistribution',
        args: [],
    });
    const decimals = await readContract(wagmiConfig, {
        address: vault.fundingTokenAddress as `0x${string}`,
        abi: erc20ABI,
        functionName: 'decimals',
        args: [],
    });
    return formatUnits(vaultBalance as bigint, decimals as number);
}

export async function getTotalDistributedAmount(vault: FundingVault) {
    const distributedAmount = await readContract(wagmiConfig, {
        address: vault.vaultAddress as `0x${string}`,
        abi: fundingVaultABI,
        functionName: 'getTotalFundsDistributed',
        args: [],
    });
    const decimals = await readContract(wagmiConfig, {
        address: vault.fundingTokenAddress as `0x${string}`,
        abi: erc20ABI,
        functionName: 'decimals',
    });
    return formatUnits(distributedAmount as bigint, decimals as number);
}

export async function getTotalVotingTokens(vault: FundingVault) {
    const totalVotingTokensAvailable = await readContract(wagmiConfig, {
        address: vault.vaultAddress as `0x${string}`,
        abi: fundingVaultABI,
        functionName: 'getTotalVotingPowerTokensMinted',
        args: [],
    });
    const totalVotingTokensUsed = await readContract(wagmiConfig, {
        address: vault.vaultAddress as `0x${string}`,
        abi: fundingVaultABI,
        functionName: 'getTotalVotingPowerTokensUsed',
        args: [],
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
