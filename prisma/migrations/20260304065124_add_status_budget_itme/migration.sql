-- CreateEnum
CREATE TYPE "ProcurementStatus" AS ENUM ('PENDING', 'ORDERED', 'RECEIVED', 'CANCELLED');

-- AlterTable
ALTER TABLE "ProjectBudgetItem" ADD COLUMN     "orderedAt" TIMESTAMP(3),
ADD COLUMN     "procurementStatus" "ProcurementStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "purchaseNotes" TEXT,
ADD COLUMN     "receivedAt" TIMESTAMP(3);
