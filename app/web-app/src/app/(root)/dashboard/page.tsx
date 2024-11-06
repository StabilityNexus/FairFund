import LowActivityDashboard from '@/components/low-activity-dashboard';
import ActiveDashboard from '@/components/active-dashboard';
import prisma from '@/lib/db';

export default async function DashboardPage() {
    const isLowActivity = !(await checkActivityThreshold());

    return (
        <div className="container mx-auto px-4 py-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {isLowActivity ? 'Welcome to FairFund' : 'Dashboard'}
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {isLowActivity
                        ? "Let's get you started with community funding"
                        : 'Overview of your community activities and impact'}
                </p>
            </header>

            {isLowActivity ? <LowActivityDashboard /> : <ActiveDashboard />}
        </div>
    );
}

async function checkActivityThreshold(): Promise<boolean> {
    if (!prisma) return false;
    const [totalVaults, totalProposals] = await Promise.all([
        prisma.fundingVault.count(),
        prisma.proposal.count(),
    ]);
    const vaultThreshold = 10;
    const proposalThreshold = 10;
    return totalVaults >= vaultThreshold || totalProposals >= proposalThreshold;
}
