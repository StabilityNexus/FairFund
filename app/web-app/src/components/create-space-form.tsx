'use client';
import { Button } from '@/components/ui/button';
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
import { useSession } from 'next-auth/react';

const createSpaceFormSchema = z.object({
    name: z.string().min(1, 'Name is required.'),
    description: z.string().min(1, 'Description is required.'),
});

interface CreateSpaceFormProps {
    setSelectedSpace: (space: Space) => void;
    nextComp: () => void;
}

export default function CreateSpaceForm({
    setSelectedSpace,
    nextComp,
}: CreateSpaceFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { data: session } = useSession();
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
        if (session) {
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
                    description: 'An error occurred while creating the space.',
                });
            } finally {
                setIsLoading(false);
            }
        } else {
            toast({
                variant: 'destructive',
                title: 'Sign in to create a space',
                description: 'You need to sign in to create a space.',
            });
            setIsLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Space Details</CardTitle>
                <CardDescription>
                    Enter name for your space and a clear and concise
                    description.
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
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={formIsLoading}
                                                    placeholder="Name of the space..."
                                                    autoComplete="name" // Added autoComplete attribute
                                                    {...field}
                                                />
                                            </FormControl>
                                            {/* <FormDescription>
                                                Name of the space
                                            </FormDescription> */}
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                            <br />
                            <FormField
                                name="description"
                                control={form.control}
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    className="bg-background resize-none"
                                                    rows={6}
                                                    disabled={formIsLoading}
                                                    placeholder="Description of the space..."
                                                    autoComplete="off" // Added autocomplete attribute
                                                    {...field}
                                                />
                                            </FormControl>
                                            {/* <FormDescription>
                                                Description of the space
                                            </FormDescription> */}
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
    );
}
