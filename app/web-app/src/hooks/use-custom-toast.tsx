import { useToast } from '@/components/ui/use-toast';
import { chain } from '@/lib/chains';
import X from 'lucide-react/dist/esm/icons/x';

export function useCustomToast() {
    const { toast } = useToast();

    function showSuccessMessage(title: string, description: string) {
        toast({
            title: title,
            description: description,
        });
    }

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

    function showChainSwitchMessage(requiredChainId: number): Promise<boolean> {
        return new Promise((resolve) => {
            const { dismiss } = toast({
                title: "Wrong Network",
                description: (
                    <div className="flex flex-col gap-2">
                        <p>This action requires a different network. Would you like to switch to {chain.get(requiredChainId)}?</p>
                        <div className="flex gap-2 justify-end mt-2">
                            <button 
                                onClick={() => {
                                    resolve(false);
                                    dismiss();
                                }}
                                className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => {
                                    resolve(true);
                                    dismiss();
                                }}
                                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Switch Network
                            </button>
                        </div>
                    </div>
                ),
                onOpenChange: (open) => {
                    if (!open) {
                        resolve(false);
                    }
                }
            });
        });
    }

    function showErrorMessage(error: any) {
        if (error instanceof Error) {
            switch (true) {
                case error.message.includes('FundingVault__AmountCannotBeZero'):
                    toast({
                        variant: 'destructive',
                        title: 'Invalid Amount',
                        description:
                            'The amount of tokens must be greater than zero. Please enter a valid amount.',
                    });
                    break;
                case error.message.includes('FundingVault__NotEnoughBalance'):
                    toast({
                        variant: 'destructive',
                        title: 'Insufficient Balance',
                        description:
                            'You do not have enough tokens to perform this action. Please check your balance and try again.',
                    });
                    break;

                case error.message.includes(
                    'FundingVault__AmountExceededsLimit'
                ):
                    toast({
                        variant: 'destructive',
                        title: 'Amount Limit Exceeded',
                        description:
                            'The requested amount exceeds the allowed limit. Please enter an amount within the specified range.',
                    });
                    break;
                case error.message.includes(
                    'FundingVault__CannotBeAZeroAddress'
                ):
                    toast({
                        variant: 'destructive',
                        title: 'Invalid Address',
                        description: 'Cannot enter a zero address.',
                    });
                    break;
                case error.message.includes('FundingVault__TallyDateNotPassed'):
                    toast({
                        variant: 'destructive',
                        title: 'Voting Period Active',
                        description:
                            'The tally date has not passed yet. Please wait until the voting period ends to perform this action.',
                    });
                    break;
                case error.message.includes(
                    'FundingVault__AlreadyDistributedFunds'
                ):
                    toast({
                        variant: 'destructive',
                        title: 'Funds Already Distributed',
                        description:
                            'The funds for this funding round have already been distributed. No further distribution is possible.',
                    });
                    break;
                default:
                    toast({
                        variant: 'destructive',
                        title: 'Unexpected Error',
                        description:
                            'An unexpected error occurred. Please try again or contact support if the issue persists.',
                    });
            }
        } else {
            toast({
                variant: 'destructive',
                title: 'Unknown Error',
                description:
                    'An unknown error occurred. Please try again or contact support if the issue persists.',
            });
        }
    }

    return { showConnectWalletMessage, showHashMessage, showErrorMessage, showChainSwitchMessage, showSuccessMessage };
}
