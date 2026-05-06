-- CreateEnum
CREATE TYPE "ProjectFinanceEntryType" AS ENUM (
  'COLLECTION',
  'PAYMENT',
  'EXTRA_INCOME',
  'EXTRA_EXPENSE',
  'ADJUSTMENT_POSITIVE',
  'ADJUSTMENT_NEGATIVE'
);

-- CreateEnum
CREATE TYPE "ProjectFinanceEntryCategory" AS ENUM (
  'ADVANCE',
  'CLIENT_PAYMENT',
  'SUPPLIER_PAYMENT',
  'MATERIAL',
  'TRANSPORT',
  'LABOR',
  'WARRANTY',
  'INSTALLATION',
  'FABRICATION',
  'ADMINISTRATIVE',
  'REFUND',
  'OTHER'
);

-- CreateEnum
CREATE TYPE "ProjectFinanceEntryStatus" AS ENUM (
  'ACTIVE',
  'VOID'
);

-- AlterEnum
ALTER TYPE "ProjectDocumentType" ADD VALUE IF NOT EXISTS 'FINANCE_SUPPORT';

-- CreateTable
CREATE TABLE "ProjectFinanceEntry" (
  "id" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "projectId" TEXT NOT NULL,
  "type" "ProjectFinanceEntryType" NOT NULL,
  "category" "ProjectFinanceEntryCategory" NOT NULL,
  "status" "ProjectFinanceEntryStatus" NOT NULL DEFAULT 'ACTIVE',
  "amount" DECIMAL(18,2) NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "description" TEXT NOT NULL,
  "notes" TEXT,
  "documentId" TEXT,
  "createdById" TEXT,

  CONSTRAINT "ProjectFinanceEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectFinanceEntry_projectId_date_idx" ON "ProjectFinanceEntry"("projectId", "date");

-- CreateIndex
CREATE INDEX "ProjectFinanceEntry_projectId_type_idx" ON "ProjectFinanceEntry"("projectId", "type");

-- CreateIndex
CREATE INDEX "ProjectFinanceEntry_projectId_category_idx" ON "ProjectFinanceEntry"("projectId", "category");

-- CreateIndex
CREATE INDEX "ProjectFinanceEntry_projectId_status_idx" ON "ProjectFinanceEntry"("projectId", "status");

-- CreateIndex
CREATE INDEX "ProjectFinanceEntry_documentId_idx" ON "ProjectFinanceEntry"("documentId");

-- AddForeignKey
ALTER TABLE "ProjectFinanceEntry"
ADD CONSTRAINT "ProjectFinanceEntry_projectId_fkey"
FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectFinanceEntry"
ADD CONSTRAINT "ProjectFinanceEntry_documentId_fkey"
FOREIGN KEY ("documentId") REFERENCES "ProjectDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectFinanceEntry"
ADD CONSTRAINT "ProjectFinanceEntry_createdById_fkey"
FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
