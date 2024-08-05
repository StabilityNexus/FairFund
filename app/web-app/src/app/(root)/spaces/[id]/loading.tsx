import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingVaultCard = () => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6">
            <Skeleton className="h-6 w-1/3 m-2" />
            <Skeleton className="h-4 w-full m-6" />
            <div className="flex justify-between m-4">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
            </div>
            <Skeleton className="h-9 w-full" />
        </CardContent>
    </Card>
);

export default function SpaceDetailsLoadingPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <Skeleton className="h-9 w-64 mb-2" />
                <Skeleton className="h-5 w-full max-w-2xl" />
            </header>
            <div className="flex justify-between space-x-6 text-sm text-gray-500 mb-8">
                <div className="flex gap-4">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="flex items-center">
                            <Skeleton className="w-5 h-5 mr-2" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    ))}
                </div>
                <Skeleton className="h-9 w-32" />
            </div>
            <div className="mt-4">
                <Skeleton className="h-7 w-48 mb-6" />
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {[...Array(2)].map((_, index) => (
                    <LoadingVaultCard key={index} />
                ))}
            </div>
            <div className="flex w-full justify-center items-center">
                <Skeleton className="h-10 w-64" />
            </div>
        </div>
    );
}
