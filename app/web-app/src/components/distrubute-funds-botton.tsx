"use client";
import { Button } from "@/components/ui/button";
import { type FundingVault } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useToast } from "@/components/ui/use-toast";
import { writeContract } from "@wagmi/core";
import { config as wagmiConfig } from "@/wagmi/config";
import { fundingVaultABI } from "@/blockchain/constants";

interface DistributeFundsButtonProps {
    className?: string;
    fundingVault: FundingVault;
}

export default function DistributeFundsButton({
    className,
    fundingVault
}: DistributeFundsButtonProps) {

    const { address, isConnected } = useAccount();
    const router = useRouter();
    const { toast } = useToast();

    async function handleClick() {
        if (!isConnected || !address) {
            return;
        }
        if (fundingVault.tallyDate?.getTime() > Date.now()) {
            toast({
                variant: "destructive",
                title: "Tally date has not passed yet.",
                description: "You cannot distribute funds before the tally date.",
            });
            return;
        }
        try {
            const hash = await writeContract(wagmiConfig, {
                // @ts-ignore
                address: fundingVault.vaultAddress,
                abi: fundingVaultABI,
                functionName: 'distributeFunds',
                args: []
            });
            if (hash) {
                toast({
                    title: "Successfully distributed all the funds.",
                    description: (
                        <div className="w-[80%] md:w-[340px]">
                            <p className="truncate">Transaction hash: <a href={`https://sepolia.etherscan.io/tx/${hash}`} target="_blank" rel="noopener noreferrer">{hash}</a></p>
                        </div>
                    ),
                })
            }
        } catch (err) {
            toast({
                variant: 'destructive',
                title: 'Error while trying to distribute funds.',
                description: 'Something went wrong. Please try again.'
            })
            console.log('[DISTRIBUTE_FUNDS]: Error while trying to distribute funds.', err);
        }
    }

    return (
        <Button className={className} disabled={fundingVault.tallyDate?.getTime() > Date.now()} onClick={handleClick}>
            Distribute Funds
        </Button>
    )
}