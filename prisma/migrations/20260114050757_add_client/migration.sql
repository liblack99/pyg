-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "email" TEXT,
    "mobilePhone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "department" TEXT,
    "contactName1" TEXT,
    "contactRole1" TEXT,
    "contactPhone1" TEXT,
    "contactName2" TEXT,
    "contactRole2" TEXT,
    "contactPhone2" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Client_name_idx" ON "Client"("name");

-- CreateIndex
CREATE INDEX "Client_documentNumber_idx" ON "Client"("documentNumber");
