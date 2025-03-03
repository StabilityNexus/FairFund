import React from 'react';
import prisma from '@/lib/db';
import { type FundingVault } from '@prisma/client';
import { getVaultBalance } from '@/lib/vault-data';
import VaultDetailsCard from './vault-details-card';

interface VaultDetailsCardWrapperProps {
  fundingVault: FundingVault;
}

export default async function VaultDetailsCardWrapper({
  fundingVault: vault,
}: VaultDetailsCardWrapperProps) {
  const vaultBalancePromise = getVaultBalance(vault);
  const proposalsPromise = prisma.proposal.count({
    where: { fundingVaultId: vault.id },
  });
  const [vaultBalance, proposals] = await Promise.all([
    vaultBalancePromise,
    proposalsPromise,
  ]);

  const chain = new Map<number, string>([
    [63, "Etherium Mordor"],
    [80002, "Polygon Amoye"],
    [137, "Polygon"],
    [31337, "Anvil"],
  ]);
  const chainName = chain.get(parseInt(vault.chainId)) || "Unknown Chain";

  return (
    <VaultDetailsCard
      vault={vault}
      vaultBalance={Number(vaultBalance)}
      proposals={proposals}
      chainName={chainName}
    />
  );
}
