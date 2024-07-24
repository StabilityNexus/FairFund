'use client';
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
    FormField,
    FormDescription,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import type { Space } from '@prisma/client';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';

const createSpaceFormSchema = z.object({
    name: z.string().min(1, 'Name is requeired.'),
    description: z.string().min(1, 'Description is required.'),
});

interface SpaceFormInterface {
    setSelectedSpace: (space: Space) => void;
    nextComp: () => void;
}

export default function SpaceForm({
    nextComp,
    setSelectedSpace,
}: SpaceFormInterface) {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof createSpaceFormSchema>>({
        resolver: zodResolver(createSpaceFormSchema),
        defaultValues: {
            name: '',
            description: '',
        },
    });
    const formIsLoading = form.formState.isLoading;
    const { toast } = useToast();

    async function onSubmit(data: z.infer<typeof createSpaceFormSchema>) {
        setIsLoading(true);
        try {
            const { name, description } = data;
            const response = await axios.post('/api/space/new', {
                name,
                description,
            });
            toast({
                title: 'Space Created',
                description: 'Space has been created successfully.',
            });
            setSelectedSpace(response.data);
            nextComp();
        } catch (err) {
            console.log('[SPACE_FORM_ERROR]', err);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'An error occured while creating the space.',
            });
        } finally {
            setIsLoading(false);
        }
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
                                                        <FormDescription>
                                                            Name of the space
                                                        </FormDescription>
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
                                                        <FormDescription>
                                                            Description of the
                                                            space
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                );
                                            }}
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={formIsLoading || isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>{'Create a Space'}</>
                                        )}
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
