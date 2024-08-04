'use client';
import { joinSpace } from '@/actions/join-space';
import { Button } from '@/components/ui/button';

interface JoinSpaceButtonProps {
    spaceId: number;
    isJoined: boolean;
}

export default function JoinSpaceButton({
    spaceId,
    isJoined,
}: JoinSpaceButtonProps) {
    return (
        <Button
            variant={'secondary'}
            disabled={isJoined}
            onClick={async () => {
                await joinSpace(spaceId);
            }}
        >
            {isJoined ? 'Joined' : 'Join Space'}
        </Button>
    );
}
