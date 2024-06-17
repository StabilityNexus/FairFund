import CardWrapper from "@/components/proposal-details-card-wrapper";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";



export default async function ProposalDetailsPage({
    params
}:{
    params:{
        id:string
    }
}){
    const id = params.id;
    const proposal = await prisma.proposal.findUnique({
        where:{
            id:Number(id)
        }
    })
    if(!proposal){
        redirect('/dashboard')
    }
    return (
        <div className="p-8 w-full h-full flex justify-center items-center flex-col gap-4">
            <div className="space-y-2 w-full">
                <h3 className="text-lg">
                    Proposal Details
                </h3>
                <p className="text-sm text-muted-foreground">
                    View the details of the proposal.
                </p>
            </div>
            <Separator className="bg-primary/10" />
            <CardWrapper
                proposal={proposal}
            />
        </div>
    )
}   