-- CreateEnum
CREATE TYPE "ProjectModule" AS ENUM (
  'SUMMARY',
  'BUDGET',
  'PURCHASES',
  'FABRICATION',
  'INSTALLATION',
  'FINANCE',
  'DOCUMENTS',
  'NOTES',
  'WARRANTY'
);

-- CreateEnum
CREATE TYPE "ProjectEventType" AS ENUM (
  'PROJECT_CREATED',
  'BUDGET_UPDATED',
  'PURCHASE_CREATED',
  'PURCHASE_STATUS_CHANGED',
  'FABRICATION_UPDATED',
  'FABRICATION_ITEM_COMPLETED',
  'INSTALLATION_UPDATED',
  'INSTALLATION_ITEM_COMPLETED',
  'DOCUMENT_UPLOADED',
  'WARRANTY_OPENED',
  'FINANCE_ENTRY_CREATED',
  'NOTE_CREATED'
);

-- CreateEnum
CREATE TYPE "ProjectAlertType" AS ENUM (
  'BUDGET_LIMIT_WARNING',
  'DEADLINE_NEAR',
  'DEADLINE_OVERDUE',
  'PURCHASE_PENDING',
  'FABRICATION_BLOCKED',
  'INSTALLATION_BLOCKED',
  'WARRANTY_OPEN',
  'DOCUMENT_EXPIRED',
  'FINANCE_MARGIN_RISK'
);

-- CreateEnum
CREATE TYPE "ProjectAlertSeverity" AS ENUM (
  'INFO',
  'WARNING',
  'CRITICAL'
);

-- CreateEnum
CREATE TYPE "ProjectAlertStatus" AS ENUM (
  'ACTIVE',
  'RESOLVED',
  'DISMISSED'
);

-- CreateTable
CREATE TABLE "ProjectEvent" (
  "id" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "type" "ProjectEventType" NOT NULL,
  "module" "ProjectModule" NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "entityId" TEXT,
  "metadata" JSONB,
  "createdById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ProjectEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectAlert" (
  "id" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "type" "ProjectAlertType" NOT NULL,
  "module" "ProjectModule" NOT NULL,
  "severity" "ProjectAlertSeverity" NOT NULL,
  "status" "ProjectAlertStatus" NOT NULL DEFAULT 'ACTIVE',
  "title" TEXT NOT NULL,
  "description" TEXT,
  "entityId" TEXT,
  "metadata" JSONB,
  "createdById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "resolvedAt" TIMESTAMP(3),
  "dismissedAt" TIMESTAMP(3),

  CONSTRAINT "ProjectAlert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectEvent_projectId_createdAt_idx" ON "ProjectEvent"("projectId", "createdAt");
CREATE INDEX "ProjectEvent_projectId_module_createdAt_idx" ON "ProjectEvent"("projectId", "module", "createdAt");
CREATE INDEX "ProjectEvent_projectId_type_createdAt_idx" ON "ProjectEvent"("projectId", "type", "createdAt");

-- CreateIndex
CREATE INDEX "ProjectAlert_projectId_createdAt_idx" ON "ProjectAlert"("projectId", "createdAt");
CREATE INDEX "ProjectAlert_projectId_status_createdAt_idx" ON "ProjectAlert"("projectId", "status", "createdAt");
CREATE INDEX "ProjectAlert_projectId_type_status_idx" ON "ProjectAlert"("projectId", "type", "status");
CREATE INDEX "ProjectAlert_projectId_module_status_idx" ON "ProjectAlert"("projectId", "module", "status");

-- AddForeignKey
ALTER TABLE "ProjectEvent"
ADD CONSTRAINT "ProjectEvent_projectId_fkey"
FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProjectEvent"
ADD CONSTRAINT "ProjectEvent_createdById_fkey"
FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ProjectAlert"
ADD CONSTRAINT "ProjectAlert_projectId_fkey"
FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProjectAlert"
ADD CONSTRAINT "ProjectAlert_createdById_fkey"
FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
