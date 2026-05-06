ALTER TYPE "ProjectDocumentType" ADD VALUE 'INSTALLATION_PHOTO';
ALTER TYPE "ProjectDocumentType" ADD VALUE 'INSTALLATION_RECORD';
ALTER TYPE "ProjectDocumentType" ADD VALUE 'INSTALLATION_SUPPORT';

CREATE TYPE "ProjectInstallationStatus" AS ENUM (
    'NOT_STARTED',
    'IN_PROGRESS',
    'PAUSED',
    'COMPLETED',
    'CANCELLED'
);

CREATE TYPE "InstallationItemStatus" AS ENUM (
    'PENDING',
    'IN_PROGRESS',
    'BLOCKED',
    'COMPLETED',
    'CANCELLED'
);

CREATE TABLE "ProjectInstallation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,
    "status" "ProjectInstallationStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "responsible" TEXT,
    "summary" TEXT,
    "notes" TEXT,
    "plannedStartAt" TIMESTAMP(3),
    "plannedEndAt" TIMESTAMP(3),
    "actualStartAt" TIMESTAMP(3),
    "actualEndAt" TIMESTAMP(3),
    "progressPercent" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProjectInstallation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProjectInstallationItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "installationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "responsible" TEXT,
    "status" "InstallationItemStatus" NOT NULL DEFAULT 'PENDING',
    "plannedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,

    CONSTRAINT "ProjectInstallationItem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProjectInstallation_projectId_key" ON "ProjectInstallation"("projectId");
CREATE INDEX "ProjectInstallation_status_idx" ON "ProjectInstallation"("status");
CREATE INDEX "ProjectInstallationItem_installationId_idx" ON "ProjectInstallationItem"("installationId");
CREATE INDEX "ProjectInstallationItem_status_idx" ON "ProjectInstallationItem"("status");
CREATE INDEX "ProjectInstallationItem_installationId_orderIndex_idx" ON "ProjectInstallationItem"("installationId", "orderIndex");

ALTER TABLE "ProjectInstallation"
ADD CONSTRAINT "ProjectInstallation_projectId_fkey"
FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProjectInstallationItem"
ADD CONSTRAINT "ProjectInstallationItem_installationId_fkey"
FOREIGN KEY ("installationId") REFERENCES "ProjectInstallation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
