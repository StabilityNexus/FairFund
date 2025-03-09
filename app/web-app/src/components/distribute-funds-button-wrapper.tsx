'use client';
import { type FundingVault } from '@prisma/client';
import { BlockchainActionButton } from './blockchain-action-button';
import axios from 'axios';

interface DistributeFundsButtonWrapperProps {
    vault: FundingVault;
    smartContractABI: any;
    isDisabled?: boolean;
    className?: string;
}

export default function DistributeFundsButtonWrapper({
    vault,
    smartContractABI,
    isDisabled = false,
    className,
}: DistributeFundsButtonWrapperProps) {
    async function updateVaultIsDistributed() {
        try {
            const response = await axios.patch('/api/vault/update', {
                id: vault.id,
                isDistributed: true,
            });
            console.log('Updated vault distribution status:', response.data);
        } catch (err) {
            console.log('[VAULT_DETAILS_UDPATE_ERROR]', err);
        }
    }

    return (
        <BlockchainActionButton
            smartContractAddress={vault.vaultAddress as `0x${string}`}
            chainId={parseInt(vault.chainId)}
            functionName="distributeFunds"
            smartContractABI={smartContractABI}
            buttonText="Distribute Funds"
            iconName="trendingUp"
            successMessage="Funds distributed successfully."
            className={className}
            callback={updateVaultIsDistributed}
            isDisabled={isDisabled}
        />
    );
}
