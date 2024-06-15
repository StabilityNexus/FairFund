import { Coins, Dock, DollarSignIcon, Wallet2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/db";

const iconMap = {
    vaults: Wallet2,
    locked: Coins,
    proposals: Dock,
    avg:DollarSignIcon
}

export default async function CardWrapper() {
    const totalVaults = await prisma.fundingVault.count();
    const totalProposals = await prisma.proposal.count();
    const totalLocked = await prisma.fundingVault.aggregate({
        _sum:{
            amountFundingTokens:true
        }
    });
    const avg = await prisma.proposal.aggregate({
        _avg:{
            maxRequestAmount:true,
        }
    })

    return (
        <>
            <CardBody title="Vaults" type="vaults" body={totalVaults} />
            <CardBody title="Locked" type="locked" body={totalLocked._sum.amountFundingTokens ? totalLocked._sum.amountFundingTokens : 0} />
            <CardBody title="Proposals" type="proposals" body={totalProposals}/>
            <CardBody title="Average Proposal" type="avg" body={avg._avg.maxRequestAmount ? avg._avg.maxRequestAmount : 0} />
        </>
    )
}


interface CardBodyProps {
    title: string;
    type:'vaults'| 'locked' |'proposals'|'avg';
    body: number;
}


export function CardBody({
    title,
    type,
    body
}: CardBodyProps) {
    const Icon = iconMap[type];
    return (
        <Card className="h-[150px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                <Icon  className="h-4 w-4 text-muted-foreground"  />
            </CardHeader>
            <CardContent>
                <div className="truncate text-2xl font-bold">
                    {body}
                </div>
            </CardContent>
        </Card>
    )
}