'use client';
import Search from 'lucide-react/dist/esm/icons/search';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from './ui/scroll-area';
import { useDebouncedCallback } from 'use-debounce';
import { type FundingVault } from '@prisma/client';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface SelectVaultProps {
    nextStep: () => void;
    fundingVaults?: FundingVault[];
    title: string;
    description: string;
    selectedVault: FundingVault;
    setSelectedVault: (vault: FundingVault | null) => void;
}

export default function SelectVault({
    nextStep,
    fundingVaults,
    title,
    description,
    selectedVault,
    setSelectedVault,
}: SelectVaultProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    function handleClickVault(vault: any) {
        if (selectedVault && vault.id === selectedVault.id) {
            setSelectedVault(null);
        } else {
            setSelectedVault(vault);
        }
    }

    const handleSearch = useDebouncedCallback((term: string) => {
        console.log(term);
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="w-full space-y-4">
            <div className="my-6">
                <h3 className="text-2xl font-semibold mb-2 ">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="relative">
                <Input
                    type="text"
                    placeholder="Search vaults..."
                    className="pl-10 w-full"
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

            {fundingVaults && fundingVaults.length > 0 ? (
                <ScrollArea className="h-[calc(100vh-350px)] pr-4">
                    <div className="space-y-4">
                        {fundingVaults.map((vault) => (
                            <div
                                key={vault.id}
                                className={cn(
                                    'p-6 border rounded-lg cursor-pointer transition-all',
                                    selectedVault?.id === vault.id
                                        ? 'border-primary bg-primary/10'
                                        : 'border-border hover:border-primary hover:bg-primary/5'
                                )}
                                onClick={() => handleClickVault(vault)}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-semibold text-lg">
                                        {vault.description}
                                    </h3>
                                    <Badge
                                        variant={
                                            vault.tallyDate.getTime() >
                                            Date.now()
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {vault.tallyDate.getTime() > Date.now()
                                            ? 'active'
                                            : 'closed'}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Creator: {vault.creatorAddress}
                                </p>
                                <p className="text-sm font-medium">
                                    Locked: TODO
                                </p>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            ) : (
                <div className="flex w-full justify-center items-center">
                    No Vault Found.
                </div>
            )}
            {selectedVault && (
                <div className="mt-6">
                    <Button
                        onClick={nextStep}
                        disabled={!selectedVault}
                        className="w-full"
                    >
                        Continue
                    </Button>
                </div>
            )}
        </div>
    );
}
