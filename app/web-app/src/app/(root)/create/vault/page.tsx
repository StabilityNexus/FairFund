import VaultFormWrapper from '@/components/vault-form-wrapper';
import { filterSpaces } from '@/lib/filter-space';
import getSpace from '@/lib/space-data';

export default async function NewVaultPage({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        spaceId?: string;
    };
}) {
    const query = searchParams?.query || '';
    const spaceId = searchParams?.spaceId || '';
    const pageSize = 6;
    const pageNumber = 1;

    if (spaceId) {
        const space = await getSpace(Number(spaceId));
        if (space) {
            return (
                <VaultFormWrapper
                    fromSpacePage={space ? true : false}
                    space={space}
                />
            );
        }
    } else {
        const { spaces } = await filterSpaces(query, pageNumber, pageSize);
        return <VaultFormWrapper spaces={spaces} />;
    }
}
