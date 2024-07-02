'use client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    writeContract,
    readContract,
    waitForTransactionReceipt,
} from '@wagmi/core';
import { config as wagmiConfig } from '@/wagmi/config';
import { erc20ABI, fundingVaultABI } from '@/blockchain/constants';
import { parseUnits } from 'viem';
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

interface RegisterTokenFormProps {
    votingTokenAddress: string;
    vaultId: number;
    vaultAddress: string;
}

const registerTokensForm = z.object({
    amountOfTokens: z.string().min(1, {
        message: 'Please enter the amount of tokens',
    }),
});

export function RegisterTokenForm({
    votingTokenAddress,
    vaultId,
    vaultAddress,
}: RegisterTokenFormProps) {
    const { handleSubmit, isLoading } =
        useWeb3FormSubmit<z.infer<typeof registerTokensForm>>();

    const form = useForm<z.infer<typeof registerTokensForm>>({
        resolver: zodResolver(registerTokensForm),
        defaultValues: {
            amountOfTokens: '',
        },
    });

    const onSubmit = handleSubmit(
        async (data: z.infer<typeof registerTokensForm>) => {
            const decimals = await readContract(wagmiConfig, {
                address: votingTokenAddress as `0x${string}`,
                abi: erc20ABI,
                functionName: 'decimals',
            });
            const amountOfTokens = parseUnits(
                data.amountOfTokens,
                decimals as number
            );
            const approveHash = await writeContract(wagmiConfig, {
                address: votingTokenAddress as `0x${string}`,
                abi: erc20ABI,
                functionName: 'approve',
                args: [vaultAddress, amountOfTokens],
            });
            await waitForTransactionReceipt(wagmiConfig, {
                hash: approveHash,
            });
            const hash = await writeContract(wagmiConfig, {
                address: vaultAddress as `0x${string}`,
                abi: fundingVaultABI,
                functionName: 'register',
                args: [amountOfTokens],
            });
            await waitForTransactionReceipt(wagmiConfig, {
                hash: hash,
            });
            return { hash, message: 'Successfully registered.' };
        },
        `/vault/${vaultId}`
    );

    return (
        <Card className="m-6">
            <CardHeader>
                <CardTitle>Register To Vote</CardTitle>
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
                                            The amount of voting tokens you want
                                            to lock in order to receive voting
                                            power token.
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
