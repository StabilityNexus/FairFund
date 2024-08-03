'use client';
import { Input } from '@/components/ui/input';
import type { Space } from '@prisma/client';
import Search from 'lucide-react/dist/esm/icons/search';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { ScrollArea } from './ui/scroll-area';
import SpaceCard from './space-card';
import { Button } from './ui/button';
import { SpaceWithVaultCount } from '@/lib/space-data';
import SearchSpaces from './search-spaces';

interface SelectSpaceProps {
    spaces?: SpaceWithVaultCount[];
    selectedSpace: Space | null;
    setSelectedSpace: (space: Space | null) => void;
    nextComp: () => void;
}

export default function SelectSpace({
    spaces,
    selectedSpace,
    setSelectedSpace,
    nextComp,
}: SelectSpaceProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <>
            <SearchSpaces placeholder="Search spaces...." />
            {spaces && spaces.length > 0 ? (
                <ScrollArea className="h-[calc(100vh-400px)] p-4 border-2 border-secondary rounded-xl ">
                    <div className="space-y-4">
                        {spaces.map((space) => (
                            <SpaceCard
                                key={space.id}
                                space={space}
                                selectedSpaceId={
                                    selectedSpace ? selectedSpace.id : null
                                }
                                setSelectedSpace={setSelectedSpace}
                            />
                        ))}
                    </div>
                </ScrollArea>
            ) : (
                <div className="flex w-full justify-center items-center">
                    No Space Found.
                </div>
            )}
            {selectedSpace && (
                <div className="mt-6">
                    <Button
                        onClick={nextComp}
                        disabled={!selectedSpace}
                        className="w-full"
                    >
                        Continue
                    </Button>
                </div>
            )}
        </>
    );
}
