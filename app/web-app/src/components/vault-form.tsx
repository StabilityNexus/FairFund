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
import { erc20ABI, fairFund } from '@/blockchain/constants';

import { Separator } from '@/components/ui/separator';
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

import { useWeb3FormSubmit } from '@/hooks/use-web3-form-submit';
import { Web3SubmitButton } from '@/components/web3-submit-button';

import { CalendarIcon } from 'lucide-react';

const createVaultFormSchema = z.object({
    description: z.string().min(1, 'Description is required.'),
    fundingTokenAddress: z
        .string()
        .min(1, 'Funding Token Address is required.'),
    votingTokenAddress: z.string().min(1, 'Voting Token Address is required.'),
    minRequestableAmount: z
        .string()
        .min(1, 'Minimum Requestable Amount is required.'),
    maxRequestableAmount: z
        .string()
        .min(1, 'Maximum Requestable Amount is required.'),
    tallyDate: z.date({
        required_error: 'Tally Date is required.',
    }),
});

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

    return (
        <div className="h-full p-4 space-y-3 max-w-4xl mx-auto">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 pb-10"
                >
                    <div className="space-y-2 w-full">
                        <h3 className="text-lg font-medium">
                            Create a new funding vault
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            This will deploy a new funding vault smart contract.
                        </p>
                    </div>
                    <Separator className="bg-primary/10" />
                    <div className="space-y-2 w-full">
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
                    <div className="grid grid-col-1 md:grid-cols-2 gap-4">
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
                        <FormField
                            name="minRequestableAmount"
                            control={form.control}
                            render={({ field }) => {
                                return (
                                    <FormItem className="col-span-2 md:col-span-1">
                                        <FormLabel>
                                            Minimum Requestable Amount
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="Minimum amount (in ETH)"
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
                                        <FormLabel>
                                            Maximum Requestable Amount
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="Maximum amount (in ETH)"
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
                                    <FormItem className="col-span-2 md:col-span-1">
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
                                                        <CalendarIcon className="opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent>
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
                    <div className="w-full flex justify-center">
                        <Web3SubmitButton
                            isLoading={isLoading || formIsLoading}
                        >
                            Submit
                        </Web3SubmitButton>
                    </div>
                </form>
            </Form>
        </div>
    );
}
