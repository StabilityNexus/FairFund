import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { useRouter } from 'next/navigation';

type SubmitFunction<T> = (
    data: T
) => Promise<{ hash?: `0x${string}`; message: string }>;

export function useWeb3FormSubmit<T>() {
    const [isLoading, setIsLoading] = useState(false);
    const { isConnected, address } = useAccount();
    const { showConnectWalletMessage, showErrorMessage, showHashMessage } =
        useCustomToast();
    const router = useRouter();

    const handleSubmit =
        (submitFn: SubmitFunction<T>, redirectPath?: string) =>
        async (data: T) => {
            if (!isConnected || !address) {
                showConnectWalletMessage();
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
