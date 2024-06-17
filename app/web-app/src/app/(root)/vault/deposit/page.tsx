import DepositTokensForm from "@/components/desposit-tokens-form";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

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
    if(!vault){
        redirect('/dashboard')
    }
    
    return (
        <>
            <DepositTokensForm
                vaultId={vault!.id}
                vaultAddress={vault!.vaultAddress}
                fundingTokenAddress={vault!.fundingTokenAddress}
            />
        </>
    )
}