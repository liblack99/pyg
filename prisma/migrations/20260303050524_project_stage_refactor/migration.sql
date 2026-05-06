/*
  Warnings:

  - You are about to drop the column `deliveredAt` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryExpectedAt` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `dueAt` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `fabricationAt` on the `Project` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Project_dueAt_idx";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "deliveredAt",
DROP COLUMN "deliveryExpectedAt",
DROP COLUMN "dueAt",
DROP COLUMN "fabricationAt",
ADD COLUMN     "deliveryDoneAt" TIMESTAMP(3),
ADD COLUMN     "deliveryDueAt" TIMESTAMP(3),
ADD COLUMN     "fabricationDoneAt" TIMESTAMP(3),
ADD COLUMN     "fabricationDueAt" TIMESTAMP(3),
ADD COLUMN     "installationDoneAt" TIMESTAMP(3),
ADD COLUMN     "installationDueAt" TIMESTAMP(3),
ADD COLUMN     "procurementDoneAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Project_procurementDueAt_idx" ON "Project"("procurementDueAt");

-- CreateIndex
CREATE INDEX "Project_fabricationDueAt_idx" ON "Project"("fabricationDueAt");

-- CreateIndex
CREATE INDEX "Project_installationDueAt_idx" ON "Project"("installationDueAt");

-- CreateIndex
CREATE INDEX "Project_deliveryDueAt_idx" ON "Project"("deliveryDueAt");
