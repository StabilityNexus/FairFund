/*
  Warnings:

  - Added the required column `maximumRequestableAmount` to the `FundingVault` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minimumRequestableAmount` to the `FundingVault` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spaceId` to the `FundingVault` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FundingVault" ADD COLUMN     "maximumRequestableAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "minimumRequestableAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "spaceId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Space" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Space_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FundingVault" ADD CONSTRAINT "FundingVault_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
