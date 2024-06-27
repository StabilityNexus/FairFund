'use client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseUnits } from 'viem';
import {
    writeContract,
    readContract,
    waitForTransactionReceipt,
} from '@wagmi/core';
import { config as wagmiConfig } from '@/wagmi/config';
import { erc20ABI } from '@/blockchain/constants';
import axios from 'axios';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Web3SubmitButton } from '@/components/web3-submit-button';

interface DepositTokensFormProps {
    fundingTokenAddress: string;
    vaultAddress: string;
    vaultId: number;
}

const depositTokensForm = z.object({
    amountOfTokens: z.string().min(1, 'Amount of tokens is required'),
});

export default function DepositTokensForm({
    fundingTokenAddress,
    vaultAddress,
    vaultId,
}: DepositTokensFormProps) {
    const { handleSubmit, isLoading } =
        useWeb3FormSubmit<z.infer<typeof depositTokensForm>>();

    const form = useForm<z.infer<typeof depositTokensForm>>({
        resolver: zodResolver(depositTokensForm),
        defaultValues: {
            amountOfTokens: '',
        },
    });

    const onSubmit = handleSubmit(
        async (data: z.infer<typeof depositTokensForm>) => {
            const decimals = (await readContract(wagmiConfig, {
                address: fundingTokenAddress as `0x${string}`,
                abi: erc20ABI,
                functionName: 'decimals',
            })) as number;
            const amountOfTokens = parseUnits(data.amountOfTokens, decimals);
            const hash = await writeContract(wagmiConfig, {
                address: fundingTokenAddress as `0x${string}`,
                abi: erc20ABI,
                functionName: 'transfer',
                args: [vaultAddress, amountOfTokens],
            });
            await waitForTransactionReceipt(wagmiConfig, {
                hash: hash,
            });
            await axios.post('/api/vault/deposit', {
                vaultId: vaultId,
                amountOfTokens: data.amountOfTokens,
            });
            return { hash, message: 'Tokens deposited successfully.' };
        },
        `/vault/${vaultId}`
    );

    return (
        <Card className="m-6">
            <CardHeader>
                <CardTitle>Deposit Tokens</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
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
                                            This will trigger a blockchain
                                            transaction.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                        <div className="w-full flex justify-center">
                            <Web3SubmitButton isLoading={isLoading}>
                                Submit
                            </Web3SubmitButton>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
