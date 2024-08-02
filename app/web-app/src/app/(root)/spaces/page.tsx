import SearchSpaces from '@/components/search-spaces';

export default function SpacesPage({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        page?: string;
    };
}) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

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
        </div>
    );
}
