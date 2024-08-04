import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Layers, Users, FileText, Vault } from 'lucide-react';

const dummyUserData = {
    id: 'user123',
    address: '0x1234...5678',
    chainId: 1,
    joinedSpaces: [
        {
            id: 1,
            name: 'Ethereum Developers',
            createdAt: '2023-05-15T10:30:00Z',
        },
        { id: 2, name: 'DeFi Enthusiasts', createdAt: '2023-06-20T14:45:00Z' },
        { id: 3, name: 'NFT Collectors', createdAt: '2023-07-10T09:15:00Z' },
    ],
    createdSpaces: [
        { id: 4, name: 'Web3 Innovators', createdAt: '2023-08-05T11:00:00Z' },
        { id: 5, name: 'Blockchain Gamers', createdAt: '2023-09-12T16:30:00Z' },
    ],
    createdVaults: [
        {
            id: 1,
            description: 'ETH2.0 Development Fund',
            createdAt: '2023-10-01T13:20:00Z',
        },
        {
            id: 2,
            description: 'DApp Security Audit Vault',
            createdAt: '2023-11-15T10:45:00Z',
        },
        {
            id: 3,
            description: 'Cross-chain Bridge Project',
            createdAt: '2023-12-20T09:30:00Z',
        },
    ],
    createdProposals: [
        {
            id: 1,
            description: 'Implement Layer 2 Scaling Solution',
            createdAt: '2024-01-05T14:00:00Z',
        },
        {
            id: 2,
            description: 'Community Education Program',
            createdAt: '2024-02-10T11:30:00Z',
        },
        {
            id: 3,
            description: 'Decentralized Identity Framework',
            createdAt: '2024-03-15T16:15:00Z',
        },
        {
            id: 4,
            description: 'Eco-friendly Mining Initiative',
            createdAt: '2024-04-20T10:00:00Z',
        },
    ],
};

const ActivityItem = ({
    icon,
    title,
    description,
}: {
    title: string;
    description: string;
    icon: any;
}) => (
    <div className="flex items-start space-x-4 mb-4 p-3 hover:bg-gray-100 rounded-lg transition duration-150 ease-in-out">
        <div className="bg-primary/10 p-2 rounded-full">{icon}</div>
        <div>
            <h4 className="font-semibold">{title}</h4>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    </div>
);

export default function ProfilePage() {
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
                                    title={`Joined 1 spaces`}
                                    description="Spaces that you are a member of"
                                />
                                <ActivityItem
                                    icon={
                                        <Layers className="h-5 w-5 text-green-500" />
                                    }
                                    title={`Created 2 spaces`}
                                    description="Spaces that you started"
                                />
                                <ActivityItem
                                    icon={
                                        <Vault className="h-5 w-5 text-purple-500" />
                                    }
                                    title={`Created 3 funding vaults`}
                                    description="Your created funding vaults"
                                />
                                <ActivityItem
                                    icon={
                                        <FileText className="h-5 w-5 text-orange-500" />
                                    }
                                    title={`Submitted 4 proposals`}
                                    description="Your submitted proposals"
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
                            <ScrollArea className="h-[350px] pr-4">
                                {dummyUserData.joinedSpaces.map((space) => (
                                    <ActivityItem
                                        key={space.id}
                                        icon={
                                            <Users className="h-5 w-5 text-blue-500" />
                                        }
                                        title={space.name}
                                        description={`Joined on ${new Date(space.createdAt).toLocaleDateString()}`}
                                    />
                                ))}
                                {dummyUserData.createdSpaces.map((space) => (
                                    <ActivityItem
                                        key={space.id}
                                        icon={
                                            <Layers className="h-5 w-5 text-green-500" />
                                        }
                                        title={space.name}
                                        description={`Created on ${new Date(space.createdAt).toLocaleDateString()}`}
                                    />
                                ))}
                            </ScrollArea>
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
                            <ScrollArea className="h-[350px] pr-4">
                                {dummyUserData.createdVaults.map((vault) => (
                                    <ActivityItem
                                        key={vault.id}
                                        icon={
                                            <Vault className="h-5 w-5 text-purple-500" />
                                        }
                                        title={vault.description}
                                        description={`Created on ${new Date(vault.createdAt).toLocaleDateString()}`}
                                    />
                                ))}
                            </ScrollArea>
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
                            <ScrollArea className="h-[350px] pr-4">
                                {dummyUserData.createdProposals.map(
                                    (proposal) => (
                                        <ActivityItem
                                            key={proposal.id}
                                            icon={
                                                <FileText className="h-5 w-5 text-orange-500" />
                                            }
                                            title={proposal.description}
                                            description={`Submitted on ${new Date(proposal.createdAt).toLocaleDateString()}`}
                                        />
                                    )
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
