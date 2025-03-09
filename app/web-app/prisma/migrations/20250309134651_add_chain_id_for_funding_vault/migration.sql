/*
  Warnings:

  - Added the required column `chainId` to the `FundingVault` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FundingVault" ADD COLUMN     "chainId" TEXT NOT NULL;
