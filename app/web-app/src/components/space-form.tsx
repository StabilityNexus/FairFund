import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const createSpaceFormSchema = z.object({
    name: z.string().min(1, 'Name is requeired.'),
    description: z.string().min(1, 'Description is required.'),
});

interface SpaceFormInterface {
    nextComp: () => void;
}

export default function SpaceForm({ nextComp }: SpaceFormInterface) {
    const form = useForm<z.infer<typeof createSpaceFormSchema>>({
        resolver: zodResolver(createSpaceFormSchema),
    });
    const formIsLoading = form.formState.isLoading;

    function onSubmit(data: z.infer<typeof createSpaceFormSchema>) {
        alert(JSON.stringify(data));
    }

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
                        <CardContent className="">
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className=" flex flex-col gap-4"
                                >
                                    <div className="flex flex-col">
                                        <FormField
                                            name="name"
                                            control={form.control}
                                            render={({ field }) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Name
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                disabled={
                                                                    formIsLoading
                                                                }
                                                                placeholder="Name here..."
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                );
                                            }}
                                        />
                                        <FormField
                                            name="description"
                                            control={form.control}
                                            render={({ field }) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Description
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                className="bg-background resize-none"
                                                                rows={6}
                                                                disabled={
                                                                    formIsLoading
                                                                }
                                                                placeholder="Description here..."
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                );
                                            }}
                                        />
                                    </div>
                                    <Button type="submit">
                                        Create a Vault
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="select">Select a space</TabsContent>
            </Tabs>
        </div>
    );
}
