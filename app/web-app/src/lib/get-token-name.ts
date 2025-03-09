import { erc20ABI } from '@/blockchain/constants';
import { ethers } from 'ethers';
import { foundry, polygonAmoy, polygon } from '@reown/appkit/networks';
import { mordor } from '@/wagmi/networks';

const chains: Record<number, any> = {
    63: mordor,
    80002: polygonAmoy,
    137: polygon,
    31337: foundry,
};

export async function getTokenName(chainId: number, address: string): Promise<string> {
    try {
        const chain = chains[chainId];
        if (!chain) {
            throw new Error(`Unsupported chain ID: ${chainId}`);
        }
        const rpcUrl = chain?.rpcUrls?.default?.http?.[0];
        if (!rpcUrl) {
            throw new Error(`No RPC URL found for chain ID: ${chainId}`);
        }
        console.log('[RPC_URL]', rpcUrl);
        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const contract = new ethers.Contract(address, erc20ABI, provider);
        const symbol = await contract.symbol();
        return symbol as string;
    } catch (err) {
        console.error('[GET_TOKEN_NAME_ERROR]', err);
        return 'Unknown';
    }
}
