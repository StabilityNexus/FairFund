import { type Proposal } from "@prisma/client";
import { Coins, File, Fingerprint, User2 } from "lucide-react";
import CardBody from "@/components/card-body";
import { Badge } from "@/components/ui/badge";

const iconMap = {
    id: Fingerprint,
    money: Coins,
    creator: User2,
    recipient: User2,
    description: File
}

interface ProposalDetailsCardWrapperProps {
    proposal: Proposal;
}


export default function ProposalDetailsCardWrapper({
    proposal
}: ProposalDetailsCardWrapperProps) {
    return (
        <>
            <div className="m-2 w-full flex justify-center items-center">
                <CardBody
                    className="w-full"
                    title="Description"
                    icon={iconMap["description"]}
                    body={proposal.description}
                    bodyClassName="text-sm font-light"
                />
            </div>
            <div className="m-2 w-full grid gap-6 md:grid-cols-2">
                <CardBody
                    className="max-h-[100px] overflow-hidden"
                    bodyClassName="text-md text-muted-foreground font-normal w-full"
                    title="Creator" 
                    icon={iconMap["creator"]}
                    body={
                        <div className="flex flex-row items-center justify-start">
                            <p className="mr-2 text-secondary-foreground text-xs">
                                Wallet Address:
                            </p>
                            <Badge variant="outline" className="px-4 py-2 w-full truncate">
                                {proposal!.proposerAddress}
                            </Badge>
                        </div>
                    }
                />
                <CardBody
                    className="max-h-[100px] overflow-hidden"
                    bodyClassName="text-md text-muted-foreground font-normal w-full"
                    title="Recipient" 
                    icon={iconMap["recipient"]}
                    body={
                        <div className="flex flex-row items-center justify-start">
                            <p className="mr-2 text-secondary-foreground text-xs">
                                Wallet Address:
                            </p>
                            <Badge variant="outline" className="px-4 py-2 w-full truncate">
                                {proposal!.recipient}
                            </Badge>
                        </div>
                    }
                />
                <CardBody
                    className="max-h-[100px] overflow-hidden"
                    bodyClassName="text-md text-muted-foreground font-normal w-full"
                    title="Min Request Amount" 
                    icon={iconMap["money"]}
                    body={proposal!.minRequestAmount}
                />
                <CardBody
                    className="max-h-[100px] overflow-hidden"
                    bodyClassName="text-md text-muted-foreground font-normal w-full"
                    title="Max Request Amount" 
                    icon={iconMap["money"]}
                    body={proposal!.maxRequestAmount}
                />
            </div>
        </>
    )
}