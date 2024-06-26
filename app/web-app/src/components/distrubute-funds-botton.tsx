'use client';
import { type FundingVault } from '@prisma/client';
import { writeContract } from '@wagmi/core';
import { config as wagmiConfig } from '@/wagmi/config';
import { fundingVaultABI } from '@/blockchain/constants';
import { BarChart3 } from "lucide-react";
import { useWeb3FormSubmit } from '@/hooks/use-web3-form-submit';
import { Web3SubmitButton } from '@/components/web3-submit-button';

interface DistributeFundsButtonProps {
    className?: string;
    fundingVault: FundingVault;
}

export default function DistributeFundsButton({
    className,
    fundingVault,
}: DistributeFundsButtonProps) {
    const { handleSubmit, isLoading } = useWeb3FormSubmit();
    const onSubmit = handleSubmit(async () => {
        const hash = await writeContract(wagmiConfig, {
            address: fundingVault.vaultAddress as `0x${string}`,
            abi: fundingVaultABI,
            functionName: 'distributeFunds',
            args: [],
        });

        return {
            hash,
            message: 'Funds distributed successfully.'
        };
    });
    const isDisabled = fundingVault.tallyDate?.getTime() > Date.now();

    return (
        <Web3SubmitButton
            isLoading={isLoading}
            onClick={onSubmit}
            className={className}
            disabled={isDisabled}
        >
            <BarChart3 className="mr-2 h-4 w-4" />
            Distribute Funds
        </Web3SubmitButton>
    );
}
