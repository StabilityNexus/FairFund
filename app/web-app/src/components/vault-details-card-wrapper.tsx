import prisma from "@/lib/db";
import CardBody from "./card-body";
import { Coins, Dock, File, Fingerprint, TimerIcon, User2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge";
import { type FundingVault } from "@prisma/client";

interface VaultDetailsCardWrapperProps {
    fundingVault: FundingVault;
}

const iconMap = {
    id: Fingerprint,
    locked: Coins,
    proposals: Dock,
    tallyDate: TimerIcon,
    creator: User2,
    description: File
}

export default async function VaultDetailsCardWrapper({
    fundingVault: vault
}: VaultDetailsCardWrapperProps) {

    const proposals = await prisma.proposal.count({
        where: {
            fundingVaultId: vault.id
        }
    })
    return (
        <>
            <div className="m-2 w-full grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <CardBody title="ID" icon={iconMap["id"]} body={`FundingVault#${vault!.id}`} />
                <CardBody title="Funding token locked" icon={iconMap["locked"]} body={vault!.amountFundingTokens} />
                <CardBody title="Proposals" icon={iconMap["proposals"]} body={proposals} />
                <CardBody title="Tally Date" icon={iconMap["tallyDate"]} body={vault!.tallyDate.toLocaleDateString()} />
            </div>
            <div className="m-2 w-full grid gap-6 md:grid-cols-2">
                <CardBody className="max-h-[100px] overflow-hidden" bodyClassName="text-md text-muted-foreground font-normal w-full" title="Creator" icon={iconMap["creator"]} body={
                    <div className="flex flex-row items-center justify-start">
                        <p className="mr-2 text-secondary-foreground text-xs">
                            Wallet Address:
                        </p>
                        <Badge variant="outline" className="px-4 py-2 w-full truncate">
                            {vault!.creatorAddress}
                        </Badge>
                    </div>
                } />
                <CardBody className="max-h-[100px] overflow-hidden" title="Description" icon={iconMap["description"]} bodyClassName="text-sm font-light" body={
                    <Dialog>
                        <DialogTrigger className="text-ellipsis">
                            {vault!.description}
                        </DialogTrigger>
                        <DialogContent className="flex h-[70%] gap-4">
                            <DialogHeader>
                                <DialogTitle className="px-4">
                                    Description
                                </DialogTitle>
                                <DialogDescription className="p-4 grow overflow-y-scroll">
                                    {vault!.description}
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                } />
            </div>
        </>
    )
}