'use client';
import { Input } from '@/components/ui/input';
import Search from 'lucide-react/dist/esm/icons/search';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

interface SearchSpaceProps {
    placeholder: string;
}

export default function SearchSpaces({ placeholder }: SearchSpaceProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="relative">
            <Input
                placeholder={placeholder}
                className="pl-10 pr-4 w-full"
                onChange={(e) => {
                    handleSearch(e.target.value);
                }}
                defaultValue={searchParams.get('query')?.toString()}
            />
            <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
            />
        </div>
    );
}
