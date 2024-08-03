import SearchSpaces from '@/components/search-spaces';
import { filterSpaces } from '@/lib/filter-space';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/pagination';
import Link from 'next/link';
import { truncateText } from '@/lib/truncate-text';

const PAGE_SIZE = 6;

export default async function SpacesPage({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        page?: string;
    };
}) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    const { spaces, totalCount: count } = await filterSpaces(
        query,
        currentPage,
        PAGE_SIZE
    );
    const totalPages = Math.floor(count / PAGE_SIZE);

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    All Spaces
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Each Space represents a unique community or category where
                    you can find and contribute to various funding projects.
                </p>
            </header>
            <SearchSpaces placeholder="Search spaces..." />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {spaces.length !== 0 ? (
                    spaces.map((space) => (
                        <Card
                            key={space.id}
                            className="hover:shadow-lg transition-shadow duration-300"
                        >
                            <CardHeader>
                                <CardTitle>{space.name}</CardTitle>
                                <CardDescription>
                                    {space._count.vaults} funding vault
                                    {space._count.vaults !== 1 ? 's' : ''}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">
                                    {truncateText(space.description, 100)}
                                </p>
                                <Link href={`/spaces/${space.id}`}>
                                    <Button className="mt-4 w-full">
                                        View Space
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div>No spaces found.</div>
                )}
            </div>
            {totalPages > 1 && (
                <div className="flex w-full justify-between items-center">
                    <Pagination totalPages={totalPages} />
                </div>
            )}
        </div>
    );
}
