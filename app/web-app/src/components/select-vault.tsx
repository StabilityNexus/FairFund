'use client';
import Search from 'lucide-react/dist/esm/icons/search';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDebouncedCallback } from 'use-debounce';
import { type FundingVault } from '@prisma/client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import VaultCard from '@/components/vault-card';
import { useToast } from './ui/use-toast';

interface SelectVaultProps {
    nextStep: () => void;
    fundingVaults?: FundingVault[];
    title: string;
    description: string;
    selectedVault: FundingVault | null;
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
    const { toast } = useToast();

    function handleClickVault(vault: FundingVault) {
        if (selectedVault && vault.id === selectedVault.id) {
            setSelectedVault(null);
        } else {
            if (vault.tallyDate.getTime() > Date.now()) {
                setSelectedVault(vault);
            } else {
                toast({
                    title: 'Cannot select',
                    description:
                        'Cannot select a vault for which tally date is already passed.',
                });
            }
        }
    }

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
        <div className="w-full space-y-4 p-4 mx-auto">
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
                <ScrollArea className="h-[calc(100vh-350px)] p-4 border-2 border-secondary rounded-xl">
                    <div className="space-y-4">
                        {fundingVaults.map((vault) => (
                            <VaultCard
                                key={vault.id}
                                vault={vault}
                                selectedVaultId={selectedVault?.id || null}
                                handleClickVault={handleClickVault}
                            />
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
