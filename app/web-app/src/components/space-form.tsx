'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { z } from 'zod';
import type { Space } from '@prisma/client';
import CreateSpaceForm from '@/components/create-space-form';
import SelectSpace from '@/components/select-space';
import { SpaceWithCount } from '@/lib/space-data';

const createSpaceFormSchema = z.object({
    name: z.string().min(1, 'Name is requeired.'),
    description: z.string().min(1, 'Description is required.'),
});

interface SpaceFormInterface {
    setSelectedSpace: (space: Space | null) => void;
    selectedSpace: Space | null;
    spaces?: SpaceWithCount[];
    nextComp: () => void;
}

export default function SpaceForm({
    nextComp,
    spaces,
    selectedSpace,
    setSelectedSpace,
}: SpaceFormInterface) {
    return (
        <div className="w-full mx-auto">
            <div className="my-6">
                <h3 className="text-2xl font-semibold mb-2 ">
                    Create or Select a space
                </h3>
                <p className="text-sm text-muted-foreground">
                    Start by either creating a new space or selecting an
                    existing one. This space will serve as a container for
                    multiple vaults.
                </p>
            </div>
            <Tabs defaultValue="create" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="create">Create New Space</TabsTrigger>
                    <TabsTrigger value="select">
                        Select Existing Space
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="create">
                    <CreateSpaceForm
                        setSelectedSpace={setSelectedSpace}
                        nextComp={nextComp}
                    />
                </TabsContent>
                <TabsContent
                    value="select"
                    className="w-full space-y-4 p-4 mx-auto"
                >
                    <SelectSpace
                        spaces={spaces}
                        selectedSpace={selectedSpace}
                        setSelectedSpace={setSelectedSpace}
                        nextComp={nextComp}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
