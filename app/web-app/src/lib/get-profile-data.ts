import prisma from '@/lib/db';

export async function getProfileData(userAddress: string) {
    const joinedSpacesPromise = prisma.space.findMany({
        where: {
            members: {
                some: {
                    address: userAddress,
                },
            },
        },
    });
    const createdSpacesPromise = prisma.space.findMany({
        where: {
            creatorAddress: userAddress,
        },
    });
    const createdVaultsPromise = prisma.fundingVault.findMany({
        where: {
            creatorAddress: userAddress,
        },
    });
    const createdProposalsPromise = prisma.proposal.findMany({
        where: {
            proposerAddress: userAddress,
        },
    });

    const data = await Promise.all([
        joinedSpacesPromise,
        createdSpacesPromise,
        createdVaultsPromise,
        createdProposalsPromise,
    ]);
    return data;
}
