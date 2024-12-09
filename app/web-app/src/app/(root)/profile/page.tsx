import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Layers from 'lucide-react/dist/esm/icons/layers';
import Users from 'lucide-react/dist/esm/icons/users';
import Vault from 'lucide-react/dist/esm/icons/vault';
import FileText from 'lucide-react/dist/esm/icons/file-text';
import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right';
import { getServerSession } from '@/app/api/auth/options';
import { redirect } from 'next/navigation';
import { truncateText } from '@/lib/truncate-text';
import { getProfileData } from '@/lib/get-profile-data';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const ActivityItem = ({
    icon,
    title,
    description,
    type,
    id,
}: {
    title: string;
    description: string;
    icon: any;
    id?: number;
    type: 'space' | 'vault' | 'proposal' | 'overview';
}) => {
    const href =
        type === 'space' && id
            ? `/spaces/${id}`
            : type === 'vault'
              ? `/vault/${id}`
              : type === 'proposal'
                ? `/proposal/${id}`
                : '';
    return (
        <div
            className={cn(
                'flex  space-x-4 mb-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition duration-150 ease-in-out',
                type === 'overview'
                    ? 'justify-start'
                    : 'items-center justify-between'
            )}
        >
            <div className={'flex gap-4 justify-center'}>
                <div className="bg-primary/10 p-4 rounded-full ">{icon}</div>
                <div>
                    <h4 className="font-semibold">{title}</h4>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
            </div>
            {type !== 'overview' && (
                <Link className="flex cursor-pointer" href={href}>
                    <span className="text-sm text-gray-500">View</span>
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                </Link>
            )}
        </div>
    );
};

export default async function ProfilePage() {
    const session = await getServerSession();
    if (!session) {
        redirect('/dashboard');
    }
    const [joinedSpaces, createdSpaces, createdVaults, createdProposals] =
        await getProfileData(session.user.address);

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Your Activity
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Here you can track your engagement across spaces, funding
                    vaults, and proposals.
                </p>
            </header>
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="spaces">Spaces</TabsTrigger>
                    <TabsTrigger value="vaults">Vaults</TabsTrigger>
                    <TabsTrigger value="proposals">Proposals</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                    <Card>
                        <CardHeader>
                            <CardTitle>Activity Overview</CardTitle>
                            <CardDescription>
                                A summary of your recent activities
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-auto pr-4">
                                <ActivityItem
                                    icon={
                                        <Users className="h-5 w-5 text-blue-500" />
                                    }
                                    title={`Joined ${joinedSpaces.length} spaces`}
                                    description="Spaces that you are a member of"
                                    type="overview"
                                />
                                <ActivityItem
                                    icon={
                                        <Layers className="h-5 w-5 text-green-500" />
                                    }
                                    title={`Created ${createdSpaces.length} spaces`}
                                    description="Spaces that you started"
                                    type="overview"
                                />
                                <ActivityItem
                                    icon={
                                        <Vault className="h-5 w-5 text-purple-500" />
                                    }
                                    title={`Created ${createdVaults.length} funding vaults`}
                                    description="Your created funding vaults"
                                    type="overview"
                                />
                                <ActivityItem
                                    icon={
                                        <FileText className="h-5 w-5 text-orange-500" />
                                    }
                                    title={`Submitted ${createdProposals.length} proposals`}
                                    description="Your submitted proposals"
                                    type="overview"
                                />
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="spaces">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Spaces</CardTitle>
                            <CardDescription>
                                Spaces you&apos;ve joined and created
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {joinedSpaces.length > 0 ||
                            createdSpaces.length > 0 ? (
                                <ScrollArea className="h-[350px] pr-4">
                                    {joinedSpaces.length > 0 ? (
                                        <>
                                            <h3>
                                                Joined Spaces (
                                                {joinedSpaces.length})
                                            </h3>
                                            {joinedSpaces.map((space) => (
                                                <ActivityItem
                                                    key={space.id}
                                                    icon={
                                                        <Users className="h-5 w-5 text-blue-500" />
                                                    }
                                                    title={space.name}
                                                    description={truncateText(
                                                        space.description,
                                                        50
                                                    )}
                                                    type="space"
                                                    id={space.id}
                                                />
                                            ))}
                                        </>
                                    ) : (
                                        <div>No joined spaces found.</div>
                                    )}
                                    {createdSpaces.length > 0 ? (
                                        <>
                                            <h3>
                                                Created Spaces (
                                                {createdSpaces.length})
                                            </h3>
                                            {createdSpaces.map((space) => (
                                                <ActivityItem
                                                    key={space.id}
                                                    icon={
                                                        <Layers className="h-5 w-5 text-green-500" />
                                                    }
                                                    title={space.name}
                                                    description={truncateText(
                                                        space.description,
                                                        50
                                                    )}
                                                    type="space"
                                                    id={space.id}
                                                />
                                            ))}
                                        </>
                                    ) : (
                                        <div>No created spaces found.</div>
                                    )}
                                </ScrollArea>
                            ) : (
                                <div>No spaces found.</div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="vaults">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Funding Vaults</CardTitle>
                            <CardDescription>
                                Vaults you&apos;ve created
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {createdVaults.length > 0 ? (
                                <ScrollArea className="h-[350px] pr-4">
                                    {createdVaults.map((vault) => (
                                        <ActivityItem
                                            key={vault.id}
                                            icon={
                                                <Vault className="h-5 w-5 text-purple-500" />
                                            }
                                            title={truncateText(
                                                vault.description,
                                                50
                                            )}
                                            description={`Created on ${new Date(vault.createdAt).toLocaleDateString()}`}
                                            type="vault"
                                            id={vault.id}
                                        />
                                    ))}
                                </ScrollArea>
                            ) : (
                                <div>No vaults found.</div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="proposals">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Proposals</CardTitle>
                            <CardDescription>
                                Proposals you&apos;ve submitted
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {createdProposals.length > 0 ? (
                                <ScrollArea className="h-[350px] pr-4">
                                    {createdProposals.map((proposal) => (
                                        <ActivityItem
                                            key={proposal.id}
                                            icon={
                                                <FileText className="h-5 w-5 text-orange-500" />
                                            }
                                            title={truncateText(
                                                proposal.description,
                                                50
                                            )}
                                            description={`Submitted on ${new Date(proposal.createdAt).toLocaleDateString()}`}
                                            type="proposal"
                                            id={proposal.id}
                                        />
                                    ))}
                                </ScrollArea>
                            ) : (
                                <div>No proposals found.</div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
