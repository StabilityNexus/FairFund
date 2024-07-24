'use client';
import { Input } from '@/components/ui/input';
import type { Space } from '@prisma/client';
import Search from 'lucide-react/dist/esm/icons/search';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { ScrollArea } from './ui/scroll-area';
import SpaceCard from './space-card';
import { Button } from './ui/button';

interface SelectSpaceProps {
    spaces?: Space[];
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
            <div className="relative">
                <Input
                    type="text"
                    placeholder="Search spaces..."
                    className="pl-10 w-full"
                    onChange={(e) => {
                        handleSearch(e.target.value);
                    }}
                />
                <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                />
            </div>
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
