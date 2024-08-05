import getSpace from '@/lib/space-data';
import { redirect } from 'next/navigation';
import Users from 'lucide-react/dist/esm/icons/users';
import Vault from 'lucide-react/dist/esm/icons/vault';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import { Button } from '@/components/ui/button';
import prisma from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { truncateText } from '@/lib/truncate-text';
import Pagination from '@/components/pagination';
import { getVaultsForSpaceId } from '@/lib/vault-data';
import JoinSpaceButton from '@/components/join-space-button';
import { getServerSession } from '@/app/api/auth/options';

const VAULTS_PER_PAGE = 6;

export default async function SpaceDetailsPage({
    params,
    searchParams,
}: {
    params: {
        id: string;
    };
    searchParams: {
        page?: string;
    };
}) {
    const spaceId = Number(params.id);
    const space = await getSpace(spaceId);
    if (!space) {
        redirect('/spaces');
    }

    const currentVaultPage = Number(searchParams?.page) || 1;
    const { vaults, totalCount } = await getVaultsForSpaceId(
        spaceId,
        currentVaultPage,
        VAULTS_PER_PAGE
    );
    const totalVaultPages = Math.floor(totalCount / VAULTS_PER_PAGE);
    const session = await getServerSession();
    let user = null;
    if (session) {
        user = await prisma.user.findUnique({
            where: {
                address: session.user.address,
            },
            include: {
                joinedSpaces: {
                    select: {
                        id: true,
                    },
                },
            },
        });
    }
    const isJoined = user
        ? user.joinedSpaces.some((s) => s.id === spaceId)
        : false;

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {space.name}
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {space.description}
                </p>
            </header>
            <div className="flex justify-between space-x-6 text-sm text-gray-500">
                <div className="flex gap-4">
                    <div className="flex items-center">
                        <Users className="mr-2 text-blue-500" size={20} />
                        <span>{space._count.members} Members</span>
                    </div>
                    <div className="flex items-center">
                        <Vault className="mr-2 text-green-500" size={20} />
                        <span>{space._count.vaults} Vaults</span>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="mr-2 text-purple-500" size={20} />
                        <span>
                            Created{' '}
                            {new Date(space.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
                {user && (
                    <JoinSpaceButton isJoined={isJoined} spaceId={spaceId} />
                )}
            </div>
            <div className="mt-4">
                <h2 className="text-xl font-semibold mb-6">
                    All funding vaults
                </h2>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {vaults.length !== 0 ? (
                    vaults.map((vault) => (
                        <Card
                            key={vault.id}
                            className="hover:shadow-lg transition-shadow duration-300"
                        >
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-2">
                                    Vault {vault.id}
                                </h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    {truncateText(vault.description, 100)}
                                </p>
                                <div className="flex justify-between">
                                    <p className="text-sm font-medium">
                                        Max Requestable:{' '}
                                        {vault.maximumRequestableAmount}{' '}
                                        {vault.fundingTokenSymbol}
                                    </p>
                                    <p className="text-sm font-medium">
                                        Created:{' '}
                                        {vault.createdAt.toLocaleDateString()}
                                    </p>
                                </div>
                                <Link href={`/vault/${vault.id}`}>
                                    <Button size="sm" className="mt-4 w-full">
                                        View Details
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div>No vaults created yet.</div>
                )}
            </div>
            {totalVaultPages > 1 && (
                <div className="flex w-full justify-between items-center">
                    <Pagination totalPages={totalVaultPages} />
                </div>
            )}
        </div>
    );
}
