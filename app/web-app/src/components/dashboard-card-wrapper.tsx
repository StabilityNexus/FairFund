import { Coins, Dock, DollarSignIcon, Wallet2 } from 'lucide-react';
import { StatCard } from '@/components/stat-card';
import prisma from '@/lib/db';

const iconMap = {
    vaults: Wallet2,
    locked: Coins,
    proposals: Dock,
    avg: DollarSignIcon,
};

export default async function CardWrapper() {
    const totalVaults = await prisma.fundingVault.count();
    const totalProposals = await prisma.proposal.count();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <StatCard
                title="Vaults"
                icon={<Wallet2 className="h-6 w-6 text-green-500" />}
                value={totalVaults.toString()}
                description="Total number of vaults"
                className=" h-32 flex items-center"
            />
            <StatCard
                title="Proposals"
                icon={<Dock className="h-6 w-6 text-purple-500" />}
                value={totalProposals.toString()}
                description="Total number of proposals"
                className=" h-32 flex items-center"
            />
        </div>
    );
}
