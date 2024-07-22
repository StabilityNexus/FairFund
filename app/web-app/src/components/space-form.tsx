import { Button } from '@/components/ui/button';

interface SpaceFormInterface {
    nextComp: () => void;
}

export default function SpaceForm({ nextComp }: SpaceFormInterface) {
    return (
        <div>
            <div className="flex justify-between">
                <h1>Create or Select Existing Space</h1>
                <Button type="button" onClick={nextComp} className="ml-auto">
                    Next
                </Button>
            </div>
        </div>
    );
}
