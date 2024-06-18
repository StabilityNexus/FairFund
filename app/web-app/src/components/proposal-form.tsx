"use client";

import axios from "axios";
import { type FundingVault } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { writeContract, readContract,simulateContract } from '@wagmi/core';
import { config as wagmiConfig } from "@/wagmi/config";
import { erc20ABI, fundingVaultABI } from "@/constants";
import { parseUnits } from "viem";

interface ProposalFormProps {
    fundingVault: FundingVault;
}

const proposalFormSchema = z.object({
    description: z.string().min(1, {
        message: "Please enter a description."
    }),
    minRequestAmount: z.string().min(1, {
        message: "Please enter a minimum request amount."
    }),
    maxRequestAmount: z.string().min(1, {
        message: "Please enter a maximum request amount."
    }),
    recipient: z.string().min(1, {
        message: "Please enter a valid recipient address."
    }),
})

export default function ProposalForm({
    fundingVault
}: ProposalFormProps) {

    const { address, isConnected } = useAccount();
    const router = useRouter();
    const { toast } = useToast();
    const form = useForm<z.infer<typeof proposalFormSchema>>({
        resolver: zodResolver(proposalFormSchema),
        defaultValues: {
            description: "",
            minRequestAmount: "",
            maxRequestAmount: "",
            recipient: "",
        }
    })
    const isLoading = form.formState.isLoading;

    async function handleSubmit(data: z.infer<typeof proposalFormSchema>) {
        try {
            if (!isConnected || !address) {
                return;
            }
            const decimals = await readContract(wagmiConfig, {
                // @ts-ignore
                address: fundingVault.fundingTokenAddress,
                abi: erc20ABI,
                functionName: 'decimals',
            })
            const minRequestAmount = parseUnits(data.minRequestAmount, decimals as number);
            const maxRequestAmount = parseUnits(data.maxRequestAmount, decimals as number);
            const {result,request} = await simulateContract(wagmiConfig, {
                // @ts-ignore
                address: fundingVault.vaultAddress,
                abi: fundingVaultABI,
                functionName: 'submitProposal',
                args: [
                    "TODO",
                    minRequestAmount,
                    maxRequestAmount,
                    data.recipient
                ]
            })
            const hash = await writeContract(wagmiConfig, request);
            await axios.post('/api/proposal/new', {
                description: data.description,
                proposerAddress: address,
                minRequestAmount: data.minRequestAmount,
                maxRequestAmount: data.maxRequestAmount,
                recipient: data.recipient,
                fundingVaultId: fundingVault.id,
                proposalId: parseInt(result)
            })
            if (hash) {
                toast({
                    title: "Proposal Submitted",
                    description: (
                        <div className="w-[80%] md:w-[340px]">
                            <p>Your proposal has been successfully submitted.</p>
                            <p className="truncate">Transaction hash: <a href={`https://sepolia.etherscan.io/tx/${hash}`} target="_blank" rel="noopener noreferrer">{hash}</a></p>
                        </div>
                    ),
                })
            }
            router.push(`/vault/${fundingVault.id}`)
            router.refresh();
        } catch (err) {
            toast({
                variant: 'destructive',
                title: 'Error submitting proposal.',
                description: 'Something went wrong. Please try again.'
            })
            console.log('[PROPOSAL_FORM]: Error submitting proposal.', err);
        }
    }

    return (
        <div className="h-full p-4 space-y-3 max-w-4xl mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 pb-10">
                    <div className="space-y-2 w-full">
                        <h3 className="text-lg font-medium">
                            Submit a proposal for FundingVault#{fundingVault.id}.
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Submit a proposal to request funds from this FundingVault.
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
                                            A short description about the proposal (this won&apos;t be stored on chain).
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />
                    </div>
                    <div className="grid grid-col-1 md:grid-cols-2 gap-4">
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
                                            The minimum amount that would be suffice for recepient.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )
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
                                            The maximum amount needed for the recepient.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />
                        <FormField
                            name="recipient"
                            control={form.control}
                            render={({ field }) => {
                                return (
                                    <FormItem className="col-span-2 md:col-span-1">
                                        <FormLabel>
                                            Recepient Wallet Address
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="Wallet address here..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            The address of the wallet that will receive the funds, if the proposal is approved.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />
                    </div>
                    <div className="w-full flex justify-center">
                        <Button size={"lg"} disabled={isLoading}>
                            Submit
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}