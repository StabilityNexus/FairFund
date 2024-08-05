import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingActivityItem = () => (
    <div className="flex space-x-4 mb-4 p-3 items-center justify-between">
        <div className="flex gap-4 justify-center">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-32" />
            </div>
        </div>
        <Skeleton className="w-16 h-6" />
    </div>
);

export default function ProfileLoadingPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-full max-w-md" />
            </header>
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="spaces">Spaces</TabsTrigger>
                    <TabsTrigger value="vaults">Vaults</TabsTrigger>
                    <TabsTrigger value="proposals">Proposals</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <Skeleton className="h-6 w-48" />
                            </CardTitle>
                            <Skeleton className="h-4 w-64" />
                        </CardHeader>
                        <CardContent>
                            {[...Array(4)].map((_, index) => (
                                <LoadingActivityItem key={index} />
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
                {['spaces', 'vaults', 'proposals'].map((tab) => (
                    <TabsContent key={tab} value={tab}>
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <Skeleton className="h-6 w-48" />
                                </CardTitle>
                                <Skeleton className="h-4 w-64" />
                            </CardHeader>
                            <CardContent>
                                {[...Array(5)].map((_, index) => (
                                    <LoadingActivityItem key={index} />
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
