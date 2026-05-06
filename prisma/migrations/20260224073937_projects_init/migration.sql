-- CreateEnum
CREATE TYPE "ProjectKind" AS ENUM ('SUPPLY_ONLY', 'EXECUTION', 'MIXED');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'PAUSED', 'CLOSED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "code" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "clientSnapshot" JSONB,
    "totalQuotationSinIVA" DECIMAL(18,2) NOT NULL,
    "spendingLimit65" DECIMAL(18,2) NOT NULL,
    "budgetTotal" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "remaining" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "requiresProductionOrder" BOOLEAN NOT NULL DEFAULT false,
    "kind" "ProjectKind" NOT NULL DEFAULT 'SUPPLY_ONLY',
    "status" "ProjectStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdById" TEXT,
    "dueAt" TIMESTAMP(3),
    "procurementDueAt" TIMESTAMP(3),
    "fabricationAt" TIMESTAMP(3),
    "deliveryExpectedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectSequence" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "nextValue" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectSequence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT,
    "contactName" TEXT,
    "phone" TEXT,
    "invoiceRequired" BOOLEAN NOT NULL DEFAULT false,
    "requiresProductionOrder" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectBudgetItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER DEFAULT 1,
    "supplierId" TEXT,
    "supplierNameSnapshot" TEXT,
    "unitCost" DECIMAL(18,2),
    "totalCost" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "notes" TEXT,

    CONSTRAINT "ProjectBudgetItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_code_key" ON "Project"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Project_quotationId_key" ON "Project"("quotationId");

-- CreateIndex
CREATE INDEX "Project_createdAt_idx" ON "Project"("createdAt");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateIndex
CREATE INDEX "Project_kind_idx" ON "Project"("kind");

-- CreateIndex
CREATE INDEX "Project_dueAt_idx" ON "Project"("dueAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectSequence_year_key" ON "ProjectSequence"("year");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_name_key" ON "Supplier"("name");

-- CreateIndex
CREATE INDEX "Supplier_name_idx" ON "Supplier"("name");

-- CreateIndex
CREATE INDEX "Supplier_city_idx" ON "Supplier"("city");

-- CreateIndex
CREATE INDEX "ProjectBudgetItem_projectId_createdAt_idx" ON "ProjectBudgetItem"("projectId", "createdAt");

-- CreateIndex
CREATE INDEX "ProjectBudgetItem_supplierId_idx" ON "ProjectBudgetItem"("supplierId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectBudgetItem" ADD CONSTRAINT "ProjectBudgetItem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectBudgetItem" ADD CONSTRAINT "ProjectBudgetItem_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
