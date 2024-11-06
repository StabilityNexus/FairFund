import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import StatCardsWrapper from '@/components/dashboard-card-wrapper';
import TableWrapper from '@/components/dashboard-table/table-wrapper';

export default function ActiveDashboard() {
    return (
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
    );
}
