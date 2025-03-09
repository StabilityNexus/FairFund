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
import axios from 'axios';

import { cn } from '@/lib/utils';
import { config as wagmiConfig } from '@/wagmi/config';
import { erc20ABI,getFairFundForChain } from '@/blockchain/constants';

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
import { Card, CardContent, CardFooter } from '@/components/ui/card';

import { useWeb3FormSubmit } from '@/hooks/use-web3-form-submit';
import { Web3SubmitButton } from '@/components/web3-submit-button';

import CalenderIcon from 'lucide-react/dist/esm/icons/calendar';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Space, type FundingVault } from '@prisma/client';
import { useEffect } from 'react';
import MoreInfo from '@/components/more-info';

const createVaultFormSchema = z.object({
    name: z.string(),
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

interface VaultFormInterface {
    steps: {
        title: string;
        description: string;
        fields: string[];
    }[];
    currentVaultFormStep: number;
    setCurrentVaultFormStep: (step: number) => void;
    nextComp: () => void;
    prevComp: () => void;
    setFundingVault: (vault: FundingVault) => void;
    selectedSpace: Space | null;
}

export default function VaultForm({
    steps,
    currentVaultFormStep,
    setCurrentVaultFormStep,
    nextComp,
    prevComp,
    setFundingVault,
    selectedSpace,
}: VaultFormInterface) {
    const { address, chainId } = useAccount();
    const { handleSubmit, isLoading } =
        useWeb3FormSubmit<z.infer<typeof createVaultFormSchema>>();
    const form = useForm<z.infer<typeof createVaultFormSchema>>({
        resolver: zodResolver(createVaultFormSchema),
        defaultValues: {
            name: '',
            description: '',
            fundingTokenAddress: '',
            votingTokenAddress: '',
            minRequestableAmount: '',
            maxRequestableAmount: '',
        },
    });
    const formIsLoading = form.formState.isLoading;

    useEffect(() => {
        if (!selectedSpace) {
            prevComp();
        }
    }, [selectedSpace, prevComp]);

    const onSubmit = handleSubmit(
        async (data: z.infer<typeof createVaultFormSchema>) => {
            if (selectedSpace) {
                const unixTime = getUnixTime(data.tallyDate);
                const decimals = await readContract(wagmiConfig, {
                    address: data.fundingTokenAddress as `0x${string}`,
                    abi: erc20ABI,
                    functionName: 'decimals',
                    chainId:chainId
                });
                const minRequestableAmount = parseUnits(
                    data.minRequestableAmount,
                    decimals as number
                );
                const maxRequestableAmount = parseUnits(
                    data.maxRequestableAmount,
                    decimals as number
                );
                if(!chainId){
                    throw new Error('Chain ID not found');
                }
                const fairFund = getFairFundForChain(chainId);
                if (!fairFund) {
                    throw new Error('FairFund Contract not found for this chain');
                }
                const { result, request } = await simulateContract(
                    wagmiConfig,
                    {
                        address: fairFund.address as `0x${string}`,
                        abi: fairFund.abi,
                        functionName: 'deployFundingVault',
                        args: [
                            data.fundingTokenAddress,
                            data.votingTokenAddress,
                            minRequestableAmount,
                            maxRequestableAmount,
                            unixTime,
                        ],
                    }
                );
                const hash = await writeContract(wagmiConfig, request);
                await waitForTransactionReceipt(wagmiConfig, {
                    hash: hash,
                });
                const response = await axios.post('/api/vault/new', {
                    name: data.name,
                    description: data.description,
                    creatorAddress: address,
                    vaultAddress: result,
                    fundingTokenAddress: data.fundingTokenAddress,
                    votingTokenAddress: data.votingTokenAddress,
                    tallyDate: data.tallyDate,
                    minimumRequestableAmount: data.minRequestableAmount,
                    maximumRequestableAmount: data.maxRequestableAmount,
                    spaceId: selectedSpace.id,
                    chainId:chainId,
                    
                });
                setFundingVault(response.data);
                nextComp();
                return { hash, message: 'Vault created successfully.' };
            } else {
                throw new Error('Space not selected');
            }
        }
    );

    async function nextStep() {
        const currentStepSchema = steps[currentVaultFormStep];
        const isValid = await form.trigger(currentStepSchema.fields as any);
        if (isValid) {
            if (currentVaultFormStep < steps.length - 1) {
                setCurrentVaultFormStep(currentVaultFormStep + 1);
            }
        }
    }

    function prevStep() {
        if (currentVaultFormStep > 0) {
            setCurrentVaultFormStep(currentVaultFormStep - 1);
        } else {
            prevComp();
        }
    }

    function renderReviewStep() {
        const data = form.getValues();
        const fieldOrder = [
            'name',
            'description',
            'fundingTokenAddress',
            'votingTokenAddress',
            'minRequestableAmount',
            'maxRequestableAmount',
            'tallyDate',
        ] as const;
        return (
            <Card className="w-full mx-auto flex flex-col h-[500px]">
                <ScrollArea className="flex-grow">
                    <CardContent className="p-6 space-y-4">
                        {fieldOrder.map((field) => (
                            <div
                                key={field}
                                className="flex flex-col sm:flex-row sm:justify-between py-2 last:border-b-0"
                            >
                                <span className="font-medium capitalize mb-1 sm:mb-0">
                                    {field.replace(/([A-Z])/g, ' $1').trim()}:
                                </span>
                                <span className="text-sm text-right sm:text-left sm:w-1/2 break-words">
                                    {data[field].toString()}
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
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-8 pb-10"
            >
                <div className="my-6">
                    <h3 className="text-2xl font-semibold mb-2 ">
                        {steps[currentVaultFormStep].title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {steps[currentVaultFormStep].description}
                    </p>
                </div>
                {currentVaultFormStep === 0 && (
                    <div className="space-y-4 ">
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Vault Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={formIsLoading}
                                                placeholder="Name here..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Name of the Vault
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
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                className="bg-background resize-none"
                                                rows={6}
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            A short description of the funding
                                            vault (this won&apos;t be stored on
                                            chain).
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                    </div>
                )}
                {currentVaultFormStep === 1 && (
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
                                            The address of the token that will
                                            be used to fund the accepted
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
                                            The voting token holders will have
                                            to lock their voting tokens in order
                                            to vote the proposals.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                    </>
                )}
                {currentVaultFormStep === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                            name="minRequestableAmount"
                            control={form.control}
                            render={({ field }) => {
                                return (
                                    <FormItem className="col-span-2 md:col-span-1">
                                        <FormLabel className="flex items-center gap-2">
                                            Minimum Requestable Amount
                                            <MoreInfo
                                                message="Enter the absolute value. For example, 1 token with 10^8 decimals = 10^8"
                                                iconSize={15}
                                            />
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="Minimum amount (absolute value, considering token decimals)"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            The minimum amount that can be
                                            requested by a proposal.
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
                                        <FormLabel className="flex items-center gap-2">
                                            Maximum Requestable Amount
                                            <MoreInfo
                                                message="Enter the absolute value. For example, 1 token with 10^8 decimals = 10^8"
                                                iconSize={15}
                                            />
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="Maximum amount (absolute value, considering token decimals)"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            The maximum amount that can be
                                            requested by a proposal.
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
                                        <FormLabel>Tally Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={'outline'}
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
                                                                Pick a date
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
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={
                                                        process.env.NODE_ENV ===
                                                        'development'
                                                            ? false
                                                            : (date) =>
                                                                  date <
                                                                  new Date()
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription>
                                            Date after which the funds will be
                                            distributed to the addresses that
                                            represent the selected proposals.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                    </div>
                )}
                {currentVaultFormStep === 3 && renderReviewStep()}

                {currentVaultFormStep < 3 && (
                    <div className="flex justify-between">
                        <Button
                            type="button"
                            onClick={prevStep}
                            variant="outline"
                        >
                            Previous
                        </Button>
                        <Button
                            type="button"
                            onClick={nextStep}
                            className="ml-auto"
                        >
                            Next <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                )}
            </form>
        </Form>
    );
}
