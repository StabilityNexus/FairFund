import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';
type SectionType = 'statCards' | 'recentActivities';

export default function PlaceholderContent({ section }:{section:SectionType}) {
    const getContent = () => {
        switch (section) {
            case 'statCards':
                return {
                    title: "Start Using Vaults and Proposals",
                    description: "Create your first vault or submit a proposal to get started.",
                    action: "Create Vault"
                };
            case 'recentActivities':
                return {
                    title: "No Recent Activities",
                    description: "Your recent activities will appear here once you start using the platform.",
                    action: "Explore Features"
                };
            default:
                return {
                    title: "No Content",
                    description: "Start using the platform to see content here.",
                    action: "Get Started"
                };
        }
    };

    const content = getContent();

    return (
        <Card className="my-4 text-center p-6">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">{content.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-500">{content.description}</p>
                <Button>{content.action}</Button>
            </CardContent>
        </Card>
    );
}
