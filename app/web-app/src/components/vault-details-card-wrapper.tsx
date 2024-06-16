import prisma from "@/lib/db";
import CardBody from "./card-body";
import { Coins, Dock, DollarSignIcon, Fingerprint } from "lucide-react";
import { Badge } from "./ui/badge";

interface VaultDetailsCardWrapperProps {
    id: number;
}

const iconMap = {
    id: Fingerprint,
    locked: Coins,
    proposals: Dock,
    avg: DollarSignIcon

}

export default async function VaultDetailsCardWrapper({
    id
}: VaultDetailsCardWrapperProps) {
    const vault = await prisma.fundingVault.findUnique({
        where: {
            id
        }
    })
    const proposals = await prisma.proposal.count({
        where: {
            fundingVaultId: id
        }
    })
    return (
        <>
            <div className="m-2 w-full grid gap-6 md:grid-cols-3">
                <CardBody title="ID" icon={iconMap["id"]} body={vault!.id} />
                <CardBody title="Funding token Locked" icon={iconMap["locked"]} body={vault!.amountFundingTokens} />
                <CardBody title="Proposals" icon={iconMap["proposals"]} body={proposals} />
            </div>
            <div className="m-2 w-full grid gap-6 md:grid-cols-2">
                <CardBody bodyClassName="text-md text-muted-foreground font-normal w-full" title="Creator" icon={iconMap["id"]} body={
                    <div className="flex flex-row items-center justify-start">
                        <p className="mr-2 text-secondary-foreground text-xs">
                            Wallet Address:
                        </p>
                        <Badge variant="outline" className="px-4 py-2 md:w-auto :w-[90%]">
                            <p className="truncate">
                                {vault!.creatorAddress}
                            </p>
                        </Badge>
                    </div>
                } />
                <CardBody title="Description" icon={iconMap["id"]} bodyClassName="text-sm font-light" body={vault!.description} />
            </div>
        </>
    )
}