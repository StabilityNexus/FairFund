import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { config as wagmiConfig } from "@/wagmi/config";
import { erc20ABI } from "@/blockchain/constants";
import { readContract } from "@wagmi/core";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function tokenMap(addr: string): string {
  switch (addr) {
    case "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238":
      return "USDC"
    default:
      return "Unknown"
  }
}

export async function getTokenName(address: string): Promise<string> {
  try{
    const result = await readContract(wagmiConfig, {
      // @ts-ignore
      address: address,
      abi: erc20ABI,
      functionName: 'symbol',
    })
    return result as string
  }catch(err){
    console.log('[GET_TOKEN_NAME_ERROR]', err, address);
    return "Unknown"
  }
}