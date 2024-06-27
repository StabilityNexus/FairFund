import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { config as wagmiConfig } from '@/wagmi/config';
import { erc20ABI } from '@/blockchain/constants';
import { readContract } from '@wagmi/core';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export async function getTokenName(address: string): Promise<string> {
    try {
        const result = await readContract(wagmiConfig, {
            address: address as `0x${string}`,
            abi: erc20ABI,
            functionName: 'symbol',
        });
        return result as string;
    } catch (err) {
        console.log('[GET_TOKEN_NAME_ERROR]', err, address);
        return 'Unknown';
    }
}
