'use client';
import { useOptimistic } from 'react';
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
    const [optimisticJoin, setOptimisticJoin] = useOptimistic(
        isJoined,
        (_, newIsJoined: boolean) => newIsJoined
    );

    async function handleJoin() {
        setOptimisticJoin(true);
        try {
            await joinSpace(spaceId);
        } catch (err) {
            setOptimisticJoin(false);
            console.log('[JOIN_SPACE_BUTTON_ERROR]: ', err);
        }
    }

    return (
        <Button variant={'secondary'} disabled={isJoined} onClick={handleJoin}>
            {optimisticJoin ? 'Joined' : 'Join Space'}
        </Button>
    );
}
