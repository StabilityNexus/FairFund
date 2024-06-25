'use client';
import { Button } from '@/components/ui/button';
import { type FundingVault } from '@prisma/client';
import { useAccount } from 'wagmi';
import { writeContract } from '@wagmi/core';
import { config as wagmiConfig } from '@/wagmi/config';
import { fundingVaultABI } from '@/blockchain/constants';
import { useCustomToast } from '@/hooks/use-custom-toast';
import {BarChart3} from "lucide-react";

interface DistributeFundsButtonProps {
    className?: string;
    fundingVault: FundingVault;
}

export default function DistributeFundsButton({
    className,
    fundingVault,
}: DistributeFundsButtonProps) {
    const { address, isConnected } = useAccount();
    const { showConnectWalletMessage, showHashMessage, showErrorMessage } =
        useCustomToast();

    async function handleClick() {
        if (!isConnected || !address) {
            showConnectWalletMessage();
            return;
        }
        try {
            const hash = await writeContract(wagmiConfig, {
                // @ts-ignore
                address: fundingVault.vaultAddress,
                abi: fundingVaultABI,
                functionName: 'distributeFunds',
                args: [],
            });
            if (hash) {
                showHashMessage('Funds distributed successfully.', hash);
            }
        } catch (err) {
            showErrorMessage(err);
            console.log(
                '[DISTRIBUTE_FUNDS]: Error while trying to distribute funds.',
                err
            );
        }
    }

    return (
        <Button
            className={className}
            disabled={fundingVault.tallyDate?.getTime() > Date.now()}
            onClick={handleClick}
        >
            <BarChart3 className="mr-2 h-4 w-4" />
            Distribute Funds
        </Button>
    );
}
