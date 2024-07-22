import ProposalFormWrapper from '@/components/proposal-form-wrapper';
import { filterVaults } from '@/lib/filter-vaults';
import { getVault } from '@/lib/vault-data';

export default async function NewProposalPage({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        vaultId?: string;
    };
}) {
    const query = searchParams?.query || '';
    const vaultId = searchParams?.vaultId || '';

    if (vaultId) {
        const vault = await getVault(Number(vaultId));
        if (vault) {
            return (
                <ProposalFormWrapper
                    fromVaultPage={vault ? true : false}
                    vault={vault}
                />
            );
        }
    } else {
        const vaults = await filterVaults(query);
        return <ProposalFormWrapper fundingVaults={vaults} />;
    }
}
