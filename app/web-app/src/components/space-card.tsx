'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Space } from '@prisma/client';
import { truncateText } from '@/lib/truncate-text';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { SpaceWithCount } from '@/lib/space-data';

interface SpaceCardInterface {
    space: SpaceWithCount;
    selectedSpaceId: number | null;
    setSelectedSpace: (space: Space | null) => void;
}

export default function SpaceCard({
    space,
    selectedSpaceId,
    setSelectedSpace,
}: SpaceCardInterface) {
    function handleClickSpace(space: Space) {
        if (selectedSpaceId === space.id) {
            setSelectedSpace(null);
        } else {
            setSelectedSpace(space);
        }
    }
    return (
        <Card
            key={space.id}
            className={cn(
                'mx-2 border rounded-lg cursor-pointer transition-all',
                selectedSpaceId && selectedSpaceId === space.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary hover:bg-primary/5'
            )}
            onClick={() => handleClickSpace(space)}
        >
            <CardHeader>
                <CardTitle>{space.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-600 mb-2">
                    {truncateText(space.description, 100)}
                    {space.description.length > 100 && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    variant="link"
                                    className="p-0 h-auto font-normal"
                                >
                                    Read more
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{space.name}</DialogTitle>
                                </DialogHeader>
                                <p>{space.description}</p>
                            </DialogContent>
                        </Dialog>
                    )}
                </p>
                <p className="text-sm font-semibold">
                    Vaults: {space._count.vaults}
                </p>
            </CardContent>
        </Card>
    );
}
