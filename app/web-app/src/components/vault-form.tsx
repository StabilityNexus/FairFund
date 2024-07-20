'use client';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, getUnixTime } from 'date-fns';
import { useAccount } from 'wagmi';
import { useForm } from 'react-hook-form';
import {
    writeContract,
    simulateContract,
    readContract,
    waitForTransactionReceipt,
} from '@wagmi/core';
import { parseUnits } from 'viem';
import { useState } from 'react';
import axios from 'axios';

import { cn } from '@/lib/utils';
import { config as wagmiConfig } from '@/wagmi/config';
import { erc20ABI, fairFund } from '@/blockchain/constants';

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Card,
    CardTitle,
    CardContent,
    CardHeader,
    CardFooter,
} from '@/components/ui/card';

import { useWeb3FormSubmit } from '@/hooks/use-web3-form-submit';
import { Web3SubmitButton } from '@/components/web3-submit-button';

import CalenderIcon from 'lucide-react/dist/esm/icons/calendar';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import { ScrollArea } from './ui/scroll-area';

const createVaultFormSchema = z.object({
    description: z.string().min(1, 'Description is required.'),
    fundingTokenAddress: z
        .string()
        .min(1, 'Funding Token Address is required.'),
    votingTokenAddress: z.string().min(1, 'Voting Token Address is required.'),
    minRequestableAmount: z
        .string()
        .min(1, 'Minimum Requestable Amount is required.')
        .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
            message: 'Must be a positive number',
        }),
    maxRequestableAmount: z
        .string()
        .min(1, 'Maximum Requestable Amount is required.')
        .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
            message: 'Must be a positive number',
        }),
    tallyDate: z.date({
        required_error: 'Tally Date is required.',
    }),
});

const steps = [
    {
        title: 'Basic Information',
        description: 'Provide a description for your funding vault.',
        fields: ['description'],
    },
    {
        title: 'Token Configuration',
        description: 'Set up the funding and voting tokens for your vault.',
        fields: ['fundingTokenAddress', 'votingTokenAddress'],
    },
    {
        title: 'Funding Parameters',
        description: 'Define the funding limits and distribution date.',
        fields: ['minRequestableAmount', 'maxRequestableAmount', 'tallyDate'],
    },
    {
        title: 'Review and Submit',
        description: 'Review all the parameters before submitting',
        fields: [],
    },
];

export default function VaultForm() {
    const { address } = useAccount();
    const { handleSubmit, isLoading } =
        useWeb3FormSubmit<z.infer<typeof createVaultFormSchema>>();
    const form = useForm<z.infer<typeof createVaultFormSchema>>({
        resolver: zodResolver(createVaultFormSchema),
        defaultValues: {
            description: '',
            fundingTokenAddress: '',
            votingTokenAddress: '',
            minRequestableAmount: '',
            maxRequestableAmount: '',
        },
    });
    const formIsLoading = form.formState.isLoading;
    const [currentStep, setCurrentStep] = useState(0);

    const onSubmit = handleSubmit(
        async (data: z.infer<typeof createVaultFormSchema>) => {
            const unixTime = getUnixTime(data.tallyDate);
            const decimals = await readContract(wagmiConfig, {
                address: data.fundingTokenAddress as `0x${string}`,
                abi: erc20ABI,
                functionName: 'decimals',
            });
            const minRequestableAmount = parseUnits(
                data.minRequestableAmount,
                decimals as number
            );
            const maxRequestableAmount = parseUnits(
                data.maxRequestableAmount,
                decimals as number
            );

            const { result, request } = await simulateContract(wagmiConfig, {
                address: fairFund.address as `0x${string}`,
                abi: fairFund.abi,
                functionName: 'deployFundingVault',
                args: [
                    data.fundingTokenAddress,
                    data.votingTokenAddress,
                    minRequestableAmount,
                    maxRequestableAmount,
                    unixTime,
                    address!,
                ],
            });
            const hash = await writeContract(wagmiConfig, request);
            await waitForTransactionReceipt(wagmiConfig, {
                hash: hash,
            });
            await axios.post('/api/vault/new', {
                description: data.description,
                creatorAddress: address,
                vaultAddress: result,
                fundingTokenAddress: data.fundingTokenAddress,
                votingTokenAddress: data.votingTokenAddress,
                tallyDate: data.tallyDate,
            });
            return { hash, message: 'Vault created successfully.' };
        },
        '/dashboard'
    );

    const renderReviewStep = () => {
        const data = form.getValues();
        return (
            <Card className="w-full mx-auto flex flex-col h-[500px]">
                <ScrollArea className="flex-grow">
                    <CardContent className="p-6 space-y-4">
                        {Object.entries(data).map(([key, value]) => (
                            <div
                                key={key}
                                className="flex flex-col sm:flex-row sm:justify-between py-2 border-b last:border-b-0"
                            >
                                <span className="font-medium capitalize mb-1 sm:mb-0">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                                </span>
                                <span className="text-sm text-right sm:text-left sm:w-1/2 break-words">
                                    {value.toString()}
                                </span>
                            </div>
                        ))}
                    </CardContent>
                </ScrollArea>
                <CardFooter className="flex flex-col sm:flex-row justify-between p-6 space-y-4 sm:space-y-0 border-t">
                    <Button
                        type="button"
                        onClick={prevStep}
                        variant="outline"
                        className="w-full sm:w-auto"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                    </Button>
                    <Web3SubmitButton
                        disabled={isLoading || formIsLoading}
                        isLoading={isLoading}
                        className="w-full sm:w-auto"
                    >
                        Submit
                    </Web3SubmitButton>
                </CardFooter>
            </Card>
        );
    };

    const nextStep = async () => {
        const currentStepSchema = steps[currentStep];
        const isValid = await form.trigger(currentStepSchema.fields as any);
        if (isValid) {
            if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
            }
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="h-full container mx-auto p-4">
            <div className="h-full flex flex-col md:flex-row gap-8">
                <div className="w-full lg:w-1/4 order-2 lg:order-1 lg:relative">
                    <div className="sticky md:top-0 h-full flex items-center">
                        <div className="w-full space-y-4">
                            <div className="space-y-2 mb-6">
                                <h3 className="text-lg font-medium">
                                    Create a new funding vault
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    This will deploy a new funding vault smart
                                    contract.
                                </p>
                            </div>
                            <div className="space-y-8">
                                {steps.map((step, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start"
                                    >
                                        <div
                                            className={`flex flex-col items-center mr-4 ${index <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}
                                        >
                                            <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">
                                                {index < currentStep ? (
                                                    <CheckCircle className="w-6 h-6" />
                                                ) : (
                                                    <span>{index + 1}</span>
                                                )}
                                            </div>
                                            {index < steps.length - 1 && (
                                                <div className="w-0.5 h-full bg-border mt-2" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-medium">
                                                {step.title}
                                            </h4>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-3/4 order-1 md:order-2 flex items-center">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="w-full space-y-8 pb-10"
                        >
                            <div className="mb-6">
                                <h3 className="text-2xl font-semibold mb-2 ">
                                    {steps[currentStep].title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {steps[currentStep].description}
                                </p>
                            </div>
                            {currentStep === 0 && (
                                <div className="space-y-2 ">
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
                                                            disabled={isLoading}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        A short description of
                                                        the funding vault (this
                                                        won&apos;t be stored on
                                                        chain).
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                </div>
                            )}
                            {currentStep === 1 && (
                                <>
                                    <FormField
                                        name="fundingTokenAddress"
                                        control={form.control}
                                        render={({ field }) => {
                                            return (
                                                <FormItem className="col-span-2 md:col-span-1">
                                                    <FormLabel>
                                                        Funding Token Address
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            disabled={isLoading}
                                                            placeholder="Token address here..."
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        The address of the token
                                                        that will be used to
                                                        fund the accepted
                                                        proposals.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                    <FormField
                                        name="votingTokenAddress"
                                        control={form.control}
                                        render={({ field }) => {
                                            return (
                                                <FormItem className="col-span-2 md:col-span-1">
                                                    <FormLabel>
                                                        Voting Token Address
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            disabled={isLoading}
                                                            placeholder="Token address here..."
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        The voting token holders
                                                        will have to lock their
                                                        voting tokens in order
                                                        to vote the proposals.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                </>
                            )}
                            {currentStep === 2 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <FormField
                                        name="minRequestableAmount"
                                        control={form.control}
                                        render={({ field }) => {
                                            return (
                                                <FormItem className="col-span-2 md:col-span-1">
                                                    <FormLabel>
                                                        Minimum Requestable
                                                        Amount
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            disabled={isLoading}
                                                            placeholder="Minimum amount (in ETH)"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        The minimum amount that
                                                        can be requested by a
                                                        proposal.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                    <FormField
                                        name="maxRequestableAmount"
                                        control={form.control}
                                        render={({ field }) => {
                                            return (
                                                <FormItem className="col-span-2 md:col-span-1">
                                                    <FormLabel>
                                                        Maximum Requestable
                                                        Amount
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            disabled={isLoading}
                                                            placeholder="Maximum amount (in ETH)"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        The maximum amount that
                                                        can be requested by a
                                                        proposal.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                    <FormField
                                        name="tallyDate"
                                        control={form.control}
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>
                                                        Tally Date
                                                    </FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant={
                                                                        'outline'
                                                                    }
                                                                    className={cn(
                                                                        'font-normal w-full flex justify-between items-center',
                                                                        !field.value &&
                                                                            'text-muted-foreground'
                                                                    )}
                                                                >
                                                                    {field.value ? (
                                                                        format(
                                                                            field.value,
                                                                            'PPP'
                                                                        )
                                                                    ) : (
                                                                        <span>
                                                                            Pick
                                                                            a
                                                                            date
                                                                        </span>
                                                                    )}
                                                                    <CalenderIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent
                                                            className="w-auto p-0"
                                                            align="start"
                                                        >
                                                            <Calendar
                                                                mode="single"
                                                                selected={
                                                                    field.value
                                                                }
                                                                onSelect={
                                                                    field.onChange
                                                                }
                                                                disabled={
                                                                    process.env
                                                                        .NODE_ENV ===
                                                                    'development'
                                                                        ? false
                                                                        : (
                                                                              date
                                                                          ) =>
                                                                              date <
                                                                              new Date()
                                                                }
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormDescription>
                                                        Date after which the
                                                        funds will be
                                                        distributed to the
                                                        addresses that represent
                                                        the selected proposals.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                </div>
                            )}
                            {currentStep === 3 && renderReviewStep()}

                            {currentStep < 3 && (
                                <div className="flex justify-between">
                                    {currentStep > 0 && (
                                        <Button
                                            type="button"
                                            onClick={prevStep}
                                            variant="outline"
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    <Button
                                        type="button"
                                        onClick={nextStep}
                                        className="ml-auto"
                                    >
                                        Next{' '}
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            )}
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
