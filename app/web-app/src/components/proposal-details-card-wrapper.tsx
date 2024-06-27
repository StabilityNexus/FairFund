import type { FundingVault, Proposal } from '@prisma/client';
import { Coins, File, Fingerprint, User2, Vault } from 'lucide-react';
import CardBody from '@/components/card-body';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

const iconMap = {
    id: Fingerprint,
    money: Coins,
    creator: User2,
    recipient: User2,
    description: File,
};

interface ProposalDetailsCardWrapperProps {
    proposal: Proposal;
    vault: {
        fundingTokenSymbol: string;
        votingTokenAddress: string;
        vaultAddress: string;
    };
}

export default function ProposalDetailsCardWrapper({
    proposal,
    vault,
}: ProposalDetailsCardWrapperProps) {
    return (
        <div className="space-y-6">
            <CardBody
                title="Description"
                icon={iconMap['description']}
                body={
                    <Dialog>
                        <DialogTrigger asChild>
                            <p className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors line-clamp-3">
                                {proposal.description}
                            </p>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh]">
                            <DialogHeader>
                                <DialogTitle>Proposal Description</DialogTitle>
                            </DialogHeader>
                            <DialogDescription className="mt-4 max-h-[60vh] overflow-y-auto">
                                {proposal.description}
                            </DialogDescription>
                        </DialogContent>
                    </Dialog>
                }
                bodyClassName="text-base font-normal"
                className="h-auto"
            />
            <div className="grid gap-6 md:grid-cols-2">
                <CardBody
                    title="Creator"
                    icon={iconMap['creator']}
                    body={
                        <div className="flex flex-col items-start">
                            <p className="text-xs text-muted-foreground mb-1">
                                Wallet Address:
                            </p>
                            <Badge
                                variant="secondary"
                                className="text-xs font-mono break-all w-full"
                            >
                                {proposal.proposerAddress}
                            </Badge>
                        </div>
                    }
                    bodyClassName="text-sm"
                />
                <CardBody
                    title="Recipient"
                    icon={iconMap['recipient']}
                    body={
                        <div className="flex flex-col items-start">
                            <p className="text-xs text-muted-foreground mb-1">
                                Wallet Address:
                            </p>
                            <Badge
                                variant="secondary"
                                className="text-xs font-mono break-all w-full"
                            >
                                {proposal.recipient}
                            </Badge>
                        </div>
                    }
                    bodyClassName="text-sm"
                />
                <CardBody
                    title="Min Request Amount"
                    icon={iconMap['money']}
                    body={`${proposal.minRequestAmount} ${vault.fundingTokenSymbol}`}
                    bodyClassName="text-xl font-semibold"
                />
                <CardBody
                    title="Max Request Amount"
                    icon={iconMap['money']}
                    body={`${proposal.maxRequestAmount} ${vault.fundingTokenSymbol}`}
                    bodyClassName="text-xl font-semibold"
                />
            </div>
        </div>
    );
}
