import DepositTokensForm from "@/components/desposit-tokens-form";
import prisma from "@/lib/db";

export default async function DepositPage({
    searchParams,
}:{
    searchParams: { [key: string]: string | string[] | undefined }
}){
    const vaultId = searchParams.vaultId;
    const vault = await prisma.fundingVault.findUnique({
        where: {
            id: parseInt(vaultId as string),
        }
    })
    
    return (
        <>
            <DepositTokensForm
                vaultAddress={vault!.vaultAddress}
            />
        </>
    )
}