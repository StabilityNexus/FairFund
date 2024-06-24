import { useToast } from '@/components/ui/use-toast';

export function useCustomToast() {
    const { toast } = useToast();

    function showConnectWalletMessage() {
        toast({
            variant: 'destructive',
            description: 'Please connect to your wallet first.',
        });
    }

    function showHashMessage(title: string, hash: string) {
        toast({
            title: title,
            description: (
                <div className="w-[80%] md:w-[340px]">
                    <p className="truncate">
                        Transaction hash:{' '}
                        <a
                            href={`https://sepolia.etherscan.io/tx/${hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {hash}
                        </a>
                    </p>
                </div>
            ),
        });
    }

    function showErrorMessage(error: any) {
        if (error instanceof Error) {
            switch (true) {
                case error.message.includes('FundingVault__AmountCannotBeZero'):
                    toast({
                        variant: 'destructive',
                        description:
                            'Amount of tokens cannot be zero or less than zero.',
                    });
                    break;
                case error.message.includes('FundingVault__NotEnoughBalance'):
                    toast({
                        variant: 'destructive',
                        description: 'You do not have enough tokens.',
                    });
                    break;

                case error.message.includes(
                    'FundingVault__AmountExceededsLimit'
                ):
                    toast({
                        variant: 'destructive',
                        description: 'Amount of tokens exceeds the limit.',
                    });
                    break;
                case error.message.includes(
                    'FundingVault__CannotBeAZeroAddress'
                ):
                    toast({
                        variant: 'destructive',
                        description: 'Cannot enter a zero address.',
                    });
                    break;
                case error.message.includes('FundingVault__TallyDateNotPassed'):
                    toast({
                        variant: 'destructive',
                        description: 'Tally date has not passed yet.',
                    });
                    break;
                default:
                    toast({
                        variant: 'destructive',
                        description: 'Something went wrong. Please try again.',
                    });
            }
        } else {
            toast({
                variant: 'destructive',
                description: 'Something went wrong. Please try again.',
            });
        }
    }

    return { showConnectWalletMessage, showHashMessage, showErrorMessage };
}
