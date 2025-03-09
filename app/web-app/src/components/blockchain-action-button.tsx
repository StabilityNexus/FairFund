'use client';
import { writeContract, waitForTransactionReceipt } from '@wagmi/core';
import { config as wagmiConfig } from '@/wagmi/config';
import { useWeb3FormSubmit } from '@/hooks/use-web3-form-submit';
import { Web3SubmitButton } from '@/components/web3-submit-button';

import BarChart3 from 'lucide-react/dist/esm/icons/bar-chart-3';
import CreditCard from 'lucide-react/dist/esm/icons/credit-card';
import DollarSign from 'lucide-react/dist/esm/icons/dollar-sign';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';

const iconMap = {
    distrubuteFunds: BarChart3,
    creditCard: CreditCard,
    trendingUp: TrendingUp,
    dollarIcon: DollarSign,
};

interface BlockchainActionButtonProps {
    className?: string;
    smartContractAddress: `0x${string}`;
    functionName: string;
    smartContractABI: any[];
    args?: any[];
    buttonText: string;
    iconName: keyof typeof iconMap;
    isDisabled?: boolean;
    successMessage: string;
    chainId?: number;
    callback?: () => Promise<void>;
}

export function BlockchainActionButton({
    className,
    smartContractAddress,
    functionName,
    args = [],
    buttonText,
    iconName,
    isDisabled = false,
    successMessage,
    smartContractABI,
    chainId,
    callback,
}: BlockchainActionButtonProps) {
    const Icon = iconMap[iconName];
    const { handleSubmit, isLoading } = useWeb3FormSubmit();
    const onSubmit = handleSubmit(async () => {
        const hash = await writeContract(wagmiConfig, {
            address: smartContractAddress,
            abi: smartContractABI,
            functionName: functionName,
            args: args,
        });
        await waitForTransactionReceipt(wagmiConfig, {
            hash: hash,
        });
        if (callback) {
            await callback();
        }
        return {
            hash,
            message: successMessage,
        };
    },
        undefined,
        chainId
    );

    return (
        <Web3SubmitButton
            isLoading={isLoading}
            onClick={onSubmit}
            className={className}
            disabled={isDisabled}
        >
            <Icon className="mr-2 h-4 w-4" />
            {buttonText}
        </Web3SubmitButton>
    );
}
