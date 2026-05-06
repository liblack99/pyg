/*
  Warnings:

  - A unique constraint covering the columns `[latestProductionOrderId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "latestProductionOrderId" TEXT,
ADD COLUMN     "productionOrderCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ProductionOrder" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "payload" JSONB NOT NULL,

    CONSTRAINT "ProductionOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductionOrder_orderNumber_key" ON "ProductionOrder"("orderNumber");

-- CreateIndex
CREATE INDEX "ProductionOrder_projectId_createdAt_idx" ON "ProductionOrder"("projectId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProductionOrder_projectId_version_key" ON "ProductionOrder"("projectId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "Project_latestProductionOrderId_key" ON "Project"("latestProductionOrderId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_latestProductionOrderId_fkey" FOREIGN KEY ("latestProductionOrderId") REFERENCES "ProductionOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionOrder" ADD CONSTRAINT "ProductionOrder_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
