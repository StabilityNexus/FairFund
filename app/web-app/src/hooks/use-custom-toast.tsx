import { useToast } from "@/components/ui/use-toast";


export function useCustomToast(){
    const {toast} = useToast();

    function showConnectWalletMessage(){
        toast({
            variant:"destructive",
            description:"Please connect to your wallet first.",
        })
    }

    function showHashMessage(title:string, hash:string){
        toast({
            title: title,
            description: (
                <div className="w-[80%] md:w-[340px]">
                    <p className="truncate">Transaction hash: <a href={`https://sepolia.etherscan.io/tx/${hash}`} target="_blank" rel="noopener noreferrer">{hash}</a></p>
                </div>
            ),
        })
    }

    return {showConnectWalletMessage, showHashMessage};
}