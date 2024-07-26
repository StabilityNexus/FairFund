-- CreateTable
CREATE TABLE "FundingVault" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "creatorAddress" TEXT NOT NULL,
    "fundingTokenAddress" TEXT NOT NULL,
    "fundingTokenSymbol" TEXT NOT NULL,
    "votingTokenAddress" TEXT NOT NULL,
    "votingTokenSymbol" TEXT NOT NULL,
    "vaultAddress" TEXT NOT NULL,
    "isTallied" BOOLEAN NOT NULL DEFAULT false,
    "tallyDate" TIMESTAMP(3) NOT NULL,
    "isDistributed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FundingVault_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "proposerAddress" TEXT NOT NULL,
    "minRequestAmount" INTEGER NOT NULL,
    "maxRequestAmount" INTEGER NOT NULL,
    "recipient" TEXT NOT NULL,
    "proposalId" INTEGER NOT NULL,
    "fundingVaultId" INTEGER NOT NULL,
    "fundAllocated" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "proposalMetadata" TEXT NOT NULL,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FundingVault_creatorAddress_idx" ON "FundingVault"("creatorAddress");

-- CreateIndex
CREATE INDEX "Proposal_proposerAddress_idx" ON "Proposal"("proposerAddress");

-- CreateIndex
CREATE INDEX "Proposal_fundingVaultId_idx" ON "Proposal"("fundingVaultId");

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_fundingVaultId_fkey" FOREIGN KEY ("fundingVaultId") REFERENCES "FundingVault"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

