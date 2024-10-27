import StatCardsWrapper from '@/components/dashboard-card-wrapper';
import TableWrapper from '@/components/dashboard-table/table-wrapper';
import PlaceholderContent from '@/components/placeholder-component';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function DashboardPage() {
    const hasVaults = await checkActivityThreshold('vaults');
    const hasProposals = await checkActivityThreshold('proposals');
    const hasRecentActivities = await checkActivityThreshold('recentActivities'); // Placeholder for recent activities check

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Dashboard
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Overview of key metrics and recent activities
                </p>
            </header>

            {hasVaults || hasProposals ? (
                <StatCardsWrapper />
            ) : (
                <PlaceholderContent section="statCards" />
            )}

            <div className="mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activities</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {hasRecentActivities ? (
                            <TableWrapper />
                        ) : (
                            <PlaceholderContent section="recentActivities" />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Helper function to check activity thresholds (mock implementation)
async function checkActivityThreshold(type: 'vaults' | 'proposals' | 'recentActivities'): Promise<boolean> {
    if (!prisma) return false;

    switch (type) {
        case 'vaults':
            const totalVaults = await prisma.fundingVault.count();
            return totalVaults > 0;
        case 'proposals':
            const totalProposals = await prisma.proposal.count();
            return totalProposals > 0;
        case 'recentActivities':
            const recentVaults = await prisma.fundingVault.count();
            const recentProposals = await prisma.proposal.count();
            return recentVaults > 0 || recentProposals > 0;
        default:
            return false;
    }
}
    

