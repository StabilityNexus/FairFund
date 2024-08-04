import { getServerSession } from '@/app/api/auth/options';
import ProposalFormWrapper from '@/components/proposal-form-wrapper';
import { filterVaults } from '@/lib/filter-vaults';
import { getVault } from '@/lib/vault-data';
import { redirect } from 'next/navigation';

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
    const session = await getServerSession();
    if (!session) {
        redirect('/dashboard');
    }

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
