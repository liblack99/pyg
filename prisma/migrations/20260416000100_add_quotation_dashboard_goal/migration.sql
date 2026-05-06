CREATE TABLE "QuotationDashboardGoal" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "monthlySalesGoal" DECIMAL(18,2) NOT NULL DEFAULT 50000000,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuotationDashboardGoal_pkey" PRIMARY KEY ("id")
);
