'use client';
import axios from 'axios';
import { type FundingVault } from '@prisma/client';
import { useAccount } from 'wagmi';
import { z } from 'zod';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
    FormLabel,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
    writeContract,
    readContract,
    simulateContract,
    waitForTransactionReceipt,
} from '@wagmi/core';
import { config as wagmiConfig } from '@/wagmi/config';
import { erc20ABI, fundingVaultABI } from '@/blockchain/constants';
import { parseUnits } from 'viem';
import { useWeb3FormSubmit } from '@/hooks/use-web3-form-submit';
import { Web3SubmitButton } from '@/components/web3-submit-button';
import { isValidURL } from '@/lib/is-valid-url';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import { Button } from '@/components/ui/button';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';

interface ProposalFormProps {
    steps: {
        title: string;
        description: string;
        fields: string[];
    }[];
    currentProposalStep: number;
    setCurrentProposalStep: (step: number) => void;
    prevComp: () => void; // prevComp === previous component.
    fundingVault: FundingVault;
    fromVaultPage: boolean;
}

const proposalFormSchema = z.object({
    description: z.string().min(1, {
        message: 'Please enter a description.',
    }),
    minRequestAmount: z.string().min(1, {
        message: 'Please enter a minimum request amount.',
    }),
    maxRequestAmount: z.string().min(1, {
        message: 'Please enter a maximum request amount.',
    }),
    recipient: z.string().min(1, {
        message: 'Please enter a valid recipient address.',
    }),
    metadata: z
        .string()
        .optional()
        .refine((val) => isValidURL(val), {
            message: 'Please enter a valid URL.',
        }),
});

export default function ProposalForm({
    fundingVault,
    prevComp,
    currentProposalStep,
    setCurrentProposalStep,
    steps,
    fromVaultPage,
}: ProposalFormProps) {
    const { address } = useAccount();
    const { handleSubmit, isLoading } =
        useWeb3FormSubmit<z.infer<typeof proposalFormSchema>>();

    const form = useForm<z.infer<typeof proposalFormSchema>>({
        resolver: zodResolver(proposalFormSchema),
        defaultValues: {
            description: '',
            minRequestAmount: '',
            maxRequestAmount: '',
            recipient: '',
            metadata: '',
        },
    });
    const formIsLoading = form.formState.isLoading;

    const onSubmit = handleSubmit(
        async (data: z.infer<typeof proposalFormSchema>) => {
            const decimals = await readContract(wagmiConfig, {
                address: fundingVault.fundingTokenAddress as `0x${string}`,
                abi: erc20ABI,
                functionName: 'decimals',
            });
            const minRequestAmount = parseUnits(
                data.minRequestAmount,
                decimals as number
            );
            const maxRequestAmount = parseUnits(
                data.maxRequestAmount,
                decimals as number
            );
            let metadata = 'NOT_SET';
            if (data.metadata) {
                metadata = data.metadata;
            }
            const { result, request } = await simulateContract(wagmiConfig, {
                address: fundingVault.vaultAddress as `0x${string}`,
                abi: fundingVaultABI,
                functionName: 'submitProposal',
                args: [
                    metadata,
                    minRequestAmount,
                    maxRequestAmount,
                    data.recipient,
                ],
            });
            const hash = await writeContract(wagmiConfig, request);
            await waitForTransactionReceipt(wagmiConfig, {
                hash: hash,
            });
            await axios.post('/api/proposal/new', {
                description: data.description,
                proposerAddress: address,
                minRequestAmount: data.minRequestAmount,
                maxRequestAmount: data.maxRequestAmount,
                recipient: data.recipient,
                fundingVaultId: fundingVault.id,
                // @ts-ignore
                proposalId: parseInt(result),
                metadata: data.metadata,
            });
            return { hash, message: 'Proposal created successfully.' };
        },
        `/vault/${fundingVault.id}`
    );

    async function nextStep() {
        const currentStepSchema = steps[currentProposalStep];
        const isValid = await form.trigger(currentStepSchema.fields as any);
        if (isValid) {
            if (currentProposalStep < steps.length - 1) {
                setCurrentProposalStep(currentProposalStep + 1);
            }
        }
    }

    function prevStep() {
        if (currentProposalStep > 0) {
            setCurrentProposalStep(currentProposalStep - 1);
        } else if (!fromVaultPage) {
            prevComp();
        }
    }

    function renderReviewStep() {
        const data = form.getValues();
        return (
            <Card className="w-full mx-auto flex flex-col h-[500px]">
                <ScrollArea className="flex-grow">
                    <CardContent className="p-6 space-y-4">
                        {Object.entries(data).map(([key, value]) => (
                            <div
                                key={key}
                                className="flex flex-col sm:flex-row sm:justify-between py-2 last:border-b-0"
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
    }

    return (
        // <div className="h-full p-4 space-y-3 max-w-4xl mx-auto flex items-center">
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-8 pb-10"
            >
                <div className="my-6">
                    <h3 className="text-2xl font-semibold mb-2 ">
                        {steps[currentProposalStep].title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {steps[currentProposalStep].description}
                    </p>
                </div>
                {currentProposalStep === 0 && (
                    <div className="space-y-2 flex flex-col">
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
                                            A short description about the
                                            proposal (this won&apos;t be stored
                                            on chain).
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                        <FormField
                            name="metadata"
                            control={form.control}
                            render={({ field }) => {
                                return (
                                    <FormItem className="col-span-2 md:col-span-1">
                                        <FormLabel>
                                            Additional Metadata
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="URL here..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Any additional URL with more
                                            information about your proposal.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                    </div>
                )}
                {currentProposalStep === 1 && (
                    <>
                        <FormField
                            name="minRequestAmount"
                            control={form.control}
                            render={({ field }) => {
                                return (
                                    <FormItem className="col-span-2 md:col-span-1">
                                        <FormLabel>
                                            Minimum Request Amount
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="Minimum amount (in ETH)"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            The minimum amount that would be
                                            suffice for recipient.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                        <FormField
                            name="maxRequestAmount"
                            control={form.control}
                            render={({ field }) => {
                                return (
                                    <FormItem className="col-span-2 md:col-span-1">
                                        <FormLabel>
                                            Maximum Request Amount
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="Maximum amount (in ETH)"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            The maximum amount needed for the
                                            recipient.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                    </>
                )}
                {currentProposalStep === 2 && (
                    <FormField
                        name="recipient"
                        control={form.control}
                        render={({ field }) => {
                            return (
                                <FormItem className="col-span-2 md:col-span-1">
                                    <FormLabel>
                                        Recipient Wallet Address
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            placeholder="Wallet address here..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The address of the wallet that will
                                        receive the funds, if the proposal is
                                        approved.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                )}
                {currentProposalStep === 3 && renderReviewStep()}
                {currentProposalStep < 3 && (
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
        // </div>
    );
}
