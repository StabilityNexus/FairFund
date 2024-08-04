-- DropForeignKey
ALTER TABLE "Space" DROP CONSTRAINT "Space_creatorAddress_fkey";

-- CreateIndex
CREATE INDEX "Space_creatorAddress_idx" ON "Space"("creatorAddress");

-- AddForeignKey
ALTER TABLE "Space" ADD CONSTRAINT "Space_creatorAddress_fkey" FOREIGN KEY ("creatorAddress") REFERENCES "User"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
