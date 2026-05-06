-- CreateEnum
CREATE TYPE "ProjectDocumentType" AS ENUM ('QUOTATION', 'CLIENT_RUT', 'CLIENT_ID', 'CHAMBER_OF_COMMERCE', 'LEGAL_REP_ID', 'CLIENT_REGISTRATION', 'WORK_CONTRACT', 'PURCHASE_ORDER', 'START_ACT', 'PAYMENT_PROOF', 'POLICY', 'DELIVERY_NOTE', 'DELIVERY_ACT', 'WARRANTY_CERTIFICATE');

-- CreateEnum
CREATE TYPE "ProjectDocumentSource" AS ENUM ('GENERATED', 'UPLOADED');

-- CreateEnum
CREATE TYPE "ProjectDocumentStatus" AS ENUM ('PENDING', 'AVAILABLE', 'REPLACED', 'VOID');

-- CreateEnum
CREATE TYPE "StorageProvider" AS ENUM ('ZOHO_WORKDRIVE');

-- CreateTable
CREATE TABLE "ProjectDocument" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "ProjectDocumentType" NOT NULL,
    "source" "ProjectDocumentSource" NOT NULL,
    "status" "ProjectDocumentStatus" NOT NULL DEFAULT 'PENDING',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "storageProvider" "StorageProvider",
    "storageFileId" TEXT,
    "storageFolderId" TEXT,
    "storageUrl" TEXT,
    "fileName" TEXT,
    "originalFileName" TEXT,
    "mimeType" TEXT,
    "fileSize" INTEGER,
    "generatedFrom" TEXT,
    "uploadedByUserId" TEXT,
    "issuedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectDocument_projectId_idx" ON "ProjectDocument"("projectId");

-- CreateIndex
CREATE INDEX "ProjectDocument_projectId_type_idx" ON "ProjectDocument"("projectId", "type");

-- CreateIndex
CREATE INDEX "ProjectDocument_projectId_status_idx" ON "ProjectDocument"("projectId", "status");

-- AddForeignKey
ALTER TABLE "ProjectDocument" ADD CONSTRAINT "ProjectDocument_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
