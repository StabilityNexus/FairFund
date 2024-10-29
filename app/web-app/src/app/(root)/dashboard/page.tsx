import StatCardsWrapper from '@/components/dashboard-card-wrapper';
import TableWrapper from '@/components/dashboard-table/table-wrapper';
import FeatureHighlights from '@/components/feature-highlights';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
export default async function DashboardPage() {
    const isLowActivity = !(await checkActivityThreshold());

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Dashboard
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {isLowActivity
                        ? "Explore the potential of FairFund. Start by creating a vault or submitting a proposal."
                        : "Overview of key metrics and recent activities"}
                </p>
            </header>

            {isLowActivity ? (
                <FeatureHighlights />
            ) : (
                <>
                    <StatCardsWrapper />
                    <div className="mt-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activities</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <TableWrapper />
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}

async function checkActivityThreshold(): Promise<boolean> {  
    if (!prisma) return false;
    const [totalVaults, totalProposals] = await Promise.all([
        prisma.fundingVault.count(),
        prisma.proposal.count(),
    ]);
    const vaultThreshold = 1;
    const proposalThreshold = 1;
    return totalVaults >= vaultThreshold || totalProposals >= proposalThreshold;
}
