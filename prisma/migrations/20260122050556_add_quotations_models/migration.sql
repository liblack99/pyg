-- CreateTable
CREATE TABLE "Quotation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "numberQuotation" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validDays" INTEGER NOT NULL DEFAULT 30,
    "createdById" TEXT NOT NULL,
    "clientId" TEXT,
    "clientSnapshot" JSONB NOT NULL,
    "projectReference" TEXT NOT NULL,
    "projectPresentation" TEXT NOT NULL,
    "specialConditions" TEXT,
    "timeDelivery" TEXT,
    "workLocation" TEXT,
    "guarantees" TEXT,
    "commercialCondition" TEXT,
    "paymentMethod" TEXT,
    "reviewTemplateId" TEXT,
    "reviewTitle" TEXT,
    "reviewDetails" TEXT,
    "totalGeneral" DECIMAL(18,2) NOT NULL,

    CONSTRAINT "Quotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotationItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quotationId" TEXT NOT NULL,
    "productId" TEXT,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "quantity" DECIMAL(18,2) NOT NULL,
    "unitPrice" DECIMAL(18,2) NOT NULL,
    "adminPercent" DECIMAL(5,2) NOT NULL,
    "utilPercent" DECIMAL(5,2) NOT NULL,
    "imprPercent" DECIMAL(5,2) NOT NULL,
    "ivaPercent" DECIMAL(5,2) NOT NULL,

    CONSTRAINT "QuotationItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotationTerm" (
    "id" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "key" VARCHAR(64),
    "text" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "QuotationTerm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Quotation_numberQuotation_key" ON "Quotation"("numberQuotation");

-- CreateIndex
CREATE INDEX "Quotation_createdById_createdAt_idx" ON "Quotation"("createdById", "createdAt");

-- CreateIndex
CREATE INDEX "Quotation_clientId_createdAt_idx" ON "Quotation"("clientId", "createdAt");

-- CreateIndex
CREATE INDEX "Quotation_reviewTemplateId_idx" ON "Quotation"("reviewTemplateId");

-- CreateIndex
CREATE INDEX "Quotation_numberQuotation_idx" ON "Quotation"("numberQuotation");

-- CreateIndex
CREATE INDEX "QuotationItem_quotationId_idx" ON "QuotationItem"("quotationId");

-- CreateIndex
CREATE INDEX "QuotationItem_productId_idx" ON "QuotationItem"("productId");

-- CreateIndex
CREATE INDEX "QuotationTerm_quotationId_idx" ON "QuotationTerm"("quotationId");

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_reviewTemplateId_fkey" FOREIGN KEY ("reviewTemplateId") REFERENCES "ReviewTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationItem" ADD CONSTRAINT "QuotationItem_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationItem" ADD CONSTRAINT "QuotationItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationTerm" ADD CONSTRAINT "QuotationTerm_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
