'use client';
import { Button } from '@/components/ui/button';
import { writeContract, readContract, waitForTransactionReceipt } from '@wagmi/core';
import { config as wagmiConfig } from '@/wagmi/config';
import { erc20ABI, fundingVaultABI } from '@/blockchain/constants';
import { type Proposal } from '@prisma/client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseUnits } from 'viem';
import { Card, CardContent } from '@/components/ui/card';
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
import { useWeb3FormSubmit } from '@/hooks/use-web3-form-submit';
import { Web3SubmitButton } from './web3-submit-button';

interface VoteProposalButtonProps {
    className?: string;
    proposal: Proposal;
    votingTokenAddress: string;
    vaultAddress: string;
}

const voteProposalForm = z.object({
    amountOfTokens: z.string().min(1, 'Amount of tokens is required.'),
});

export default function VoteProposal({
    proposal,
    votingTokenAddress,
    vaultAddress,
}: VoteProposalButtonProps) {
    const { handleSubmit, isLoading } = useWeb3FormSubmit<z.infer<typeof voteProposalForm>>();

    const form = useForm<z.infer<typeof voteProposalForm>>({
        resolver: zodResolver(voteProposalForm),
        defaultValues: {
            amountOfTokens: '',
        },
    });

    const onSubmit = handleSubmit((async (data:z.infer<typeof voteProposalForm>)=>{
        const decimals = await readContract(wagmiConfig, {
            address: votingTokenAddress as `0x${string}`,
            abi: erc20ABI,
            functionName: 'decimals',
        });
        const amountOfTokens = parseUnits(
            data.amountOfTokens,
            decimals as number
        );
        const hash = await writeContract(wagmiConfig, {
            address: vaultAddress as `0x${string}`,
            abi: fundingVaultABI,
            functionName: 'voteOnProposal',
            args: [proposal.proposalId, amountOfTokens],
        });
        await waitForTransactionReceipt(wagmiConfig, {
            hash: hash as `0x${string}`
        })
        return {hash,message:"Successfully voted on the proposal."}
    }))

    return (
        <Card className="m-6 pt-4 w-full">
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <FormField
                            name="amountOfTokens"
                            control={form.control}
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Amount of Tokens</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="in ETH units."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            The amount of votes you want to
                                            allocate to this proposal.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                        <div className="w-full flex justify-center">
                            <Web3SubmitButton
                                isLoading={isLoading}
                            >
                                Submit
                            </Web3SubmitButton>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
