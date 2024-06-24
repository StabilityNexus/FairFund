import ProposalForm from "@/components/proposal-form";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";


export default async function NewProposalPage({
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
    if(vault.tallyDate.getTime()<Date.now()){
        redirect(`/vault/${vaultId}`)
    }
    return (
        <>
            <ProposalForm
                fundingVault={vault}
            />
        </>
    );
}