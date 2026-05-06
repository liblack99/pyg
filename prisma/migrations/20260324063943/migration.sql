-- CreateEnum
CREATE TYPE "ProjectWarrantyStatus" AS ENUM ('NOT_APPLICABLE', 'PENDING', 'ACTIVE', 'EXPIRED', 'VOID');

-- CreateEnum
CREATE TYPE "WarrantyCaseType" AS ENUM ('MATERIAL', 'INSTALLATION', 'FINISH', 'ADJUSTMENT', 'VISIT', 'OTHER');

-- CreateEnum
CREATE TYPE "WarrantyCaseStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "WarrantyResponsibility" AS ENUM ('COMPANY', 'SUPPLIER', 'CLIENT', 'MIXED', 'UNDEFINED');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "openWarrantyCasesCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "warrantyCasesCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "warrantyCostTotal" DECIMAL(18,2) NOT NULL DEFAULT 0,
ADD COLUMN     "warrantyEndsAt" TIMESTAMP(3),
ADD COLUMN     "warrantyMonths" INTEGER,
ADD COLUMN     "warrantyNotes" TEXT,
ADD COLUMN     "warrantyStartsAt" TIMESTAMP(3),
ADD COLUMN     "warrantyStatus" "ProjectWarrantyStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "warrantyTerms" TEXT;

-- CreateTable
CREATE TABLE "ProjectWarrantyCase" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "WarrantyCaseType" NOT NULL,
    "status" "WarrantyCaseStatus" NOT NULL DEFAULT 'OPEN',
    "responsibility" "WarrantyResponsibility" NOT NULL DEFAULT 'UNDEFINED',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "reportedAt" TIMESTAMP(3) NOT NULL,
    "detectedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "estimatedCost" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "realCost" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "supplierId" TEXT,
    "reportedByUserId" TEXT,
    "resolutionNotes" TEXT,
    "internalNotes" TEXT,

    CONSTRAINT "ProjectWarrantyCase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectWarrantyCase_projectId_createdAt_idx" ON "ProjectWarrantyCase"("projectId", "createdAt");

-- CreateIndex
CREATE INDEX "ProjectWarrantyCase_projectId_status_idx" ON "ProjectWarrantyCase"("projectId", "status");

-- CreateIndex
CREATE INDEX "ProjectWarrantyCase_reportedAt_idx" ON "ProjectWarrantyCase"("reportedAt");

-- CreateIndex
CREATE INDEX "ProjectWarrantyCase_resolvedAt_idx" ON "ProjectWarrantyCase"("resolvedAt");

-- CreateIndex
CREATE INDEX "Project_warrantyStatus_idx" ON "Project"("warrantyStatus");

-- CreateIndex
CREATE INDEX "Project_warrantyEndsAt_idx" ON "Project"("warrantyEndsAt");

-- AddForeignKey
ALTER TABLE "ProjectWarrantyCase" ADD CONSTRAINT "ProjectWarrantyCase_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectWarrantyCase" ADD CONSTRAINT "ProjectWarrantyCase_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectWarrantyCase" ADD CONSTRAINT "ProjectWarrantyCase_reportedByUserId_fkey" FOREIGN KEY ("reportedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
