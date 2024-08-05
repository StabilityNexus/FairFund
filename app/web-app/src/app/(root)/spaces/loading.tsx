import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingSpaceCard = () => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <Skeleton className="h-10 w-full" />
        </CardContent>
    </Card>
);

export default function SpacesLoadingPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <Skeleton className="h-9 w-48 mb-2" />
                <Skeleton className="h-5 w-full max-w-2xl" />
            </header>
            <Skeleton className="h-10 w-full mb-6" />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {[...Array(2)].map((_, index) => (
                    <LoadingSpaceCard key={index} />
                ))}
            </div>
            <div className="flex w-full justify-center items-center">
                <Skeleton className="h-10 w-64" />
            </div>
        </div>
    );
}
