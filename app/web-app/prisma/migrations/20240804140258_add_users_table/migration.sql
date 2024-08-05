/*
  Warnings:

  - Added the required column `creatorAddress` to the `Space` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Space" ADD COLUMN     "creatorAddress" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserJoinedSpaces" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "User"("address");

-- CreateIndex
CREATE UNIQUE INDEX "_UserJoinedSpaces_AB_unique" ON "_UserJoinedSpaces"("A", "B");

-- CreateIndex
CREATE INDEX "_UserJoinedSpaces_B_index" ON "_UserJoinedSpaces"("B");

-- AddForeignKey
ALTER TABLE "Space" ADD CONSTRAINT "Space_creatorAddress_fkey" FOREIGN KEY ("creatorAddress") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundingVault" ADD CONSTRAINT "FundingVault_creatorAddress_fkey" FOREIGN KEY ("creatorAddress") REFERENCES "User"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_proposerAddress_fkey" FOREIGN KEY ("proposerAddress") REFERENCES "User"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserJoinedSpaces" ADD CONSTRAINT "_UserJoinedSpaces_A_fkey" FOREIGN KEY ("A") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserJoinedSpaces" ADD CONSTRAINT "_UserJoinedSpaces_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
