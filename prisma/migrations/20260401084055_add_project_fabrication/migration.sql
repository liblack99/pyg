-- CreateEnum
CREATE TYPE "ProjectFabricationStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'PAUSED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FabricationItemStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'PAUSED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "ProjectFabrication" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,
    "status" "ProjectFabricationStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "title" TEXT,
    "description" TEXT,
    "plannedStartAt" TIMESTAMP(3),
    "plannedEndAt" TIMESTAMP(3),
    "actualStartAt" TIMESTAMP(3),
    "actualEndAt" TIMESTAMP(3),
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "ProjectFabrication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectFabricationItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fabricationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "unit" TEXT,
    "quantity" DECIMAL(18,2),
    "status" "FabricationItemStatus" NOT NULL DEFAULT 'PENDING',
    "plannedStartAt" TIMESTAMP(3),
    "plannedEndAt" TIMESTAMP(3),
    "actualStartAt" TIMESTAMP(3),
    "actualEndAt" TIMESTAMP(3),
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,

    CONSTRAINT "ProjectFabricationItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectFabrication_projectId_key" ON "ProjectFabrication"("projectId");

-- CreateIndex
CREATE INDEX "ProjectFabrication_status_idx" ON "ProjectFabrication"("status");

-- CreateIndex
CREATE INDEX "ProjectFabricationItem_fabricationId_idx" ON "ProjectFabricationItem"("fabricationId");

-- CreateIndex
CREATE INDEX "ProjectFabricationItem_status_idx" ON "ProjectFabricationItem"("status");

-- CreateIndex
CREATE INDEX "ProjectFabricationItem_fabricationId_orderIndex_idx" ON "ProjectFabricationItem"("fabricationId", "orderIndex");

-- AddForeignKey
ALTER TABLE "ProjectFabrication" ADD CONSTRAINT "ProjectFabrication_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectFabrication" ADD CONSTRAINT "ProjectFabrication_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectFabrication" ADD CONSTRAINT "ProjectFabrication_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectFabricationItem" ADD CONSTRAINT "ProjectFabricationItem_fabricationId_fkey" FOREIGN KEY ("fabricationId") REFERENCES "ProjectFabrication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
