import { getServerSession } from '@/app/api/auth/options';
import VaultFormWrapper from '@/components/vault-form-wrapper';
import { filterSpaces } from '@/lib/filter-space';
import getSpace from '@/lib/space-data';
import { redirect } from 'next/navigation';

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
    const session = await getServerSession();
    if (!session) {
        redirect('/dashboard');
    }
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
        const { spaces } = await filterSpaces(
            query,
            pageNumber,
            pageSize,
            session.user.address
        );
        return <VaultFormWrapper spaces={spaces} />;
    }
}
