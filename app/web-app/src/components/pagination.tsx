'use client';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';

interface PaginationProps {
    totalPages: number;
}

export default function Pagination({ totalPages }: PaginationProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;
    const { replace } = useRouter();

    function handleNextPage() {
        createPageURL(currentPage + 1);
    }

    function handlePrevPage() {
        createPageURL(currentPage - 1);
    }

    function createPageURL(pageNumber: number | string) {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <>
            <Button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                variant="outline"
            >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <span>
                Page {currentPage} of {totalPages}
            </span>
            <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                variant="outline"
            >
                Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
        </>
    );
}
