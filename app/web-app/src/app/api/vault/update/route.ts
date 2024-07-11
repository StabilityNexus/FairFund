import prisma from '@/lib/db';
import { type FundingVault } from '@prisma/client';
import { NextResponse } from 'next/server';

type UpdateableVaultFields = Partial<
    Omit<FundingVault, 'id' | 'createdAt' | 'proposal'>
>;

export async function PATCH(req: Request) {
    try {
        const data = await req.json();
        const { id, ...updateData } = data as {
            id: number;
        } & UpdateableVaultFields;

        if (!id) {
            return new NextResponse('Missing Vault ID', { status: 400 });
        }

        const allowedFields: (keyof UpdateableVaultFields)[] = [
            'description',
            'creatorAddress',
            'fundingTokenAddress',
            'fundingTokenSymbol',
            'votingTokenAddress',
            'votingTokenSymbol',
            'vaultAddress',
            'isTallied',
            'tallyDate',
            'isDistributed',
        ];

        const invalidFields = Object.keys(updateData).filter(
            (field) =>
                !allowedFields.includes(field as keyof UpdateableVaultFields)
        );
        if (invalidFields.length > 0) {
            return new NextResponse(
                `Invalid update fields: ${invalidFields.join(', ')}`,
                { status: 400 }
            );
        }
        const vault = await prisma.fundingVault.update({
            where: {
                id: id,
            },
            data: updateData as UpdateableVaultFields,
        });
        return NextResponse.json(vault);
    } catch (err) {
        console.error('[UPDATE_VAULT_ERROR]: ', err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
