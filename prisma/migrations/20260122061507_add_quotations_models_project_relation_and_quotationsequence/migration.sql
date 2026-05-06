/*
  Warnings:

  - The `status` column on the `Quotation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[projectId]` on the table `Quotation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contractId]` on the table `Quotation` will be added. If there are existing duplicate values, this will fail.
  - Made the column `numberQuotation` on table `Quotation` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "QuotationStatus" AS ENUM ('DRAFT', 'SENT', 'APPROVED', 'REJECTED', 'EXPIRED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Quotation" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "contractId" TEXT,
ADD COLUMN     "expiredAt" TIMESTAMP(3),
ADD COLUMN     "projectId" TEXT,
ADD COLUMN     "rejectedAt" TIMESTAMP(3),
ADD COLUMN     "sentAt" TIMESTAMP(3),
ALTER COLUMN "numberQuotation" SET NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "QuotationStatus" NOT NULL DEFAULT 'DRAFT';

-- CreateTable
CREATE TABLE "QuotationSequence" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "lastNumber" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuotationSequence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Quotation_projectId_key" ON "Quotation"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Quotation_contractId_key" ON "Quotation"("contractId");

-- CreateIndex
CREATE INDEX "Quotation_status_createdAt_idx" ON "Quotation"("status", "createdAt");
