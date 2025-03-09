import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { useRouter } from 'next/navigation';
import { switchChain } from '@/wagmi/provider/web3-modal';
import { chain } from '@/lib/chains';

type SubmitFunction<T> = (
    data: T
) => Promise<{ hash?: `0x${string}`; message: string }>;

export function useWeb3FormSubmit<T>() {
    const [isLoading, setIsLoading] = useState(false);
    const { isConnected, address, chainId } = useAccount();
    const { showConnectWalletMessage, showErrorMessage, showHashMessage, showChainSwitchMessage, showSuccessMessage } =
        useCustomToast();
    const router = useRouter();

    const handleSubmit =
        (submitFn: SubmitFunction<T>, redirectPath?: string, requiredChainId?:number) =>
        async (data: T) => {
            if (!isConnected || !address) {
                showConnectWalletMessage();
                return;
            }
            if (requiredChainId && chainId !== requiredChainId) {
                const shouldSwitch = await showChainSwitchMessage(requiredChainId);
                if (shouldSwitch) {
                    try {
                        switchChain(requiredChainId);
                        showSuccessMessage('Network switched successfully', `You are now on ${chain.get(requiredChainId)}, now click the button again to proceed!`);
                    } catch (switchError) {
                        showErrorMessage(switchError);
                    }
                } 
                return;
            }
            setIsLoading(true);
            try {
                const { hash, message } = await submitFn(data);
                if (hash) {
                    showHashMessage(message, hash);
                }
                if (redirectPath) {
                    router.push(redirectPath);
                    router.refresh();
                } else {
                    router.refresh();
                }
            } catch (error) {
                showErrorMessage(error);
                console.error('[WEB3_FORM_SUBMIT]: ', error);
            } finally {
                setIsLoading(false);
            }
        };

    return { handleSubmit, isLoading };
}
