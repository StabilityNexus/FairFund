import { config as wagmiConfig } from '@/wagmi/config';
import { erc20ABI } from '@/blockchain/constants';
import { readContract } from '@wagmi/core';

export async function getTokenName(chainId:number,address: string): Promise<string> {
    try {
        const result = await readContract(wagmiConfig, {
            address: address as `0x${string}`,
            abi: erc20ABI,
            functionName: 'symbol',
            chainId: chainId,
            args: [],
        });
        return result as string;
    } catch (err) {
        console.log('[GET_TOKEN_NAME_ERROR]', err, address);
        return 'TOKEN';
    }
}