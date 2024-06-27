import { Coins, Dock, DollarSignIcon, Wallet2 } from 'lucide-react';
import prisma from '@/lib/db';
import CardBody from '@/components/card-body';

const iconMap = {
    vaults: Wallet2,
    locked: Coins,
    proposals: Dock,
    avg: DollarSignIcon,
};

export default async function CardWrapper() {
    const totalVaults = await prisma.fundingVault.count();
    const totalProposals = await prisma.proposal.count();
    const totalLocked = await prisma.fundingVault.aggregate({
        _sum: {
            amountFundingTokens: true,
        },
    });
    const avg = await prisma.proposal.aggregate({
        _avg: {
            maxRequestAmount: true,
        },
    });

    return (
        <>
            <CardBody
                title="Vaults"
                icon={iconMap['vaults']}
                body={totalVaults}
            />
            <CardBody
                title="Locked"
                icon={iconMap['locked']}
                body={`${
                    totalLocked._sum.amountFundingTokens
                        ? totalLocked._sum.amountFundingTokens
                        : 0
                } FT`}
            />
            <CardBody
                title="Proposals"
                icon={iconMap['proposals']}
                body={totalProposals}
            />
            <CardBody
                title="Average Proposal Request Amount"
                icon={iconMap['vaults']}
                body={avg._avg.maxRequestAmount ? avg._avg.maxRequestAmount : 0}
            />
        </>
    );
}
