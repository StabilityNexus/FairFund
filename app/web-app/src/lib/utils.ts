import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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