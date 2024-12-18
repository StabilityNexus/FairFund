import prisma from '@/lib/db';
import { readContract } from '@wagmi/core';
import { config as wagmiConfig } from '@/wagmi/config';
import { fundingVaultABI, erc20ABI } from '@/blockchain/constants';
import { formatUnits } from 'viem';
import { type FundingVault } from '@prisma/client';

export async function getVault(id: number): Promise<FundingVault | null> {
    try {
        const vault = await prisma.fundingVault.findUnique({ where: { id } });
        return vault;
    } catch (error) {
        console.error('Error fetching vault:', error);
        throw new Error('[GET_VAULT: Funding vault not found.]');
    }
}
export async function getVaultsForSpaceId(
    id: number,
    page: number,
    pageSize: number
): Promise<{ vaults: FundingVault[]; totalCount: number }> {
    try {
        const vaultsProimse = prisma.fundingVault.findMany({
            where: {
                spaceId: id,
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        const totalVaultsPromise = prisma.fundingVault.count();
        const [vaults, totalCount] = await Promise.all([
            vaultsProimse,
            totalVaultsPromise,
        ]);
        return { vaults, totalCount };
    } catch (error) {
        console.error('Error fetching vault:', error);
        throw new Error('[GET_VAULT: Funding vault not found.]');
    }
}

export async function getVaultBalance(vault: FundingVault) {
    try {
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
    } catch (error) {
        console.error('Error getting vault balance:', error);
        return '0';
    }
}

export async function getTotalDistributedAmount(vault: FundingVault) {
    try {
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
    } catch (error) {
        console.error('Error getting total distributed amount:', error);
        return '0';
    }
}

export async function getTotalVotingTokens(vault: FundingVault) {
    try {
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
        const decimals = await readContract(wagmiConfig, {
            address: vault.votingTokenAddress as `0x${string}`,
            abi: erc20ABI,
            functionName: 'decimals',
        });
        return {
            totalVotingTokensAvailable: formatUnits(
                totalVotingTokensAvailable as bigint,
                decimals as number
            ),
            totalVotingTokensUsed: formatUnits(
                totalVotingTokensUsed as bigint,
                decimals as number
            ),
        };
    } catch (error) {
        console.error('Error getting total voting tokens:', error);
        return {
            totalVotingTokensAvailable: '0',
            totalVotingTokensUsed: '0',
        };
    }
}

export function getTallyDate(vault: any) {
    return new Date(vault.tallyDate).toLocaleDateString();
}
