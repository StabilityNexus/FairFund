import prisma from "@/lib/db";
import CardBody from "./card-body";
import { Coins, Dock, DollarSignIcon, File, Fingerprint, PersonStandingIcon, TimerIcon, User2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { Description } from "@radix-ui/react-toast";

interface VaultDetailsCardWrapperProps {
    id: number;
}

const iconMap = {
    id: Fingerprint,
    locked: Coins,
    proposals: Dock,
    tallyDate: TimerIcon,
    creator:User2,
    description:File
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
            <div className="m-2 w-full grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <CardBody title="ID" icon={iconMap["id"]} body={vault!.id} />
                <CardBody title="Funding token Locked" icon={iconMap["locked"]} body={vault!.amountFundingTokens} />
                <CardBody title="Proposals" icon={iconMap["proposals"]} body={proposals} />
                <CardBody title="Tally Date" icon={iconMap["tallyDate"]} body={"nac"} />
            </div>
            <div className="m-2 w-full grid gap-6 md:grid-cols-2">
                <CardBody className="max-h-[100px]" bodyClassName="text-md text-muted-foreground font-normal w-full" title="Creator" icon={iconMap["creator"]} body={
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
                <CardBody className="max-h-[100px]" title="Description" icon={iconMap["description"]} bodyClassName="text-sm font-light" body={vault!.description} />
            </div>
        </>
    )
}