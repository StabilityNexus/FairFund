import { Button } from '@/components/ui/button';

interface SpaceFormInterface {
    nextComp: () => void;
}

export default function SpaceForm({ nextComp }: SpaceFormInterface) {
    return (
        <div className="flex flex-col w-full justify-center items-center">
            <h1>Create or Select Existing Space (WIP🏗️)</h1>
            <Button type="button" onClick={nextComp}>
                Next
            </Button>
        </div>
    );
}
