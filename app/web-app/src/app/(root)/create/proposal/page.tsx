import ProposalFormWrapper from '@/components/proposal-form-wrapper';
import { filterVaults } from '@/lib/filter-vaults';

export default async function NewProposalPage({
    searchParams,
}: {
    searchParams?: {
        query?: string;
    };
}) {
    const query = searchParams?.query || '';

    const vaults = await filterVaults(query);
    return <ProposalFormWrapper fundingVaults={vaults} />;
}
