import { useToast } from "@/components/ui/use-toast";


export function useWalletConnectMessageToast(){
    const {toast} = useToast();

    function showConnectWalletMessage(){
        toast({
            variant:"destructive",
            description:"Please connect to your wallet first.",
        })
    }

    return {showConnectWalletMessage};
}