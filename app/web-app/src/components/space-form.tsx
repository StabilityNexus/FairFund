import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface SpaceFormInterface {
    nextComp: () => void;
}

export default function SpaceForm({ nextComp }: SpaceFormInterface) {
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
                    <Card>
                        <CardHeader>
                            <CardTitle>Space Details</CardTitle>
                            <CardDescription>
                                Enter name for your space and a clear and
                                consice description.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-40">
                            <div className="space-y-2">
                                <div>Name</div>
                                <div>Desc</div>
                            </div>
                            <Button>Submit</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="select">Select a space</TabsContent>
            </Tabs>
            <Button type="button" onClick={nextComp}>
                Next
            </Button>
        </div>
    );
}
