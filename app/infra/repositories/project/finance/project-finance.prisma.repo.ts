import {Prisma} from "@/app/generated/prisma/client";
import {prisma} from "@/app/lib/prisma";
import type {ProjectFinanceRepoPort} from "@/app/core/projects/finance/port/project-finance.repo.port";
import type {
  CreateProjectFinanceEntryInput,
  ProjectFinanceAlert,
  ProjectFinanceDocumentRef,
  ProjectFinanceEntry,
  ProjectFinanceView,
  UpdateProjectFinanceEntryInput,
} from "@/app/core/projects/finance/dto";
import {toNum} from "@/app/infra/utils/toNumber";

function toIso(value: Date): string {
  return value.toISOString();
}

function toDate(value?: string | null): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  return new Date(value);
}

function roundPercent(value: number): number {
  return Number(value.toFixed(2));
}

function mapEntry(entry: {
  id: string;
  projectId: string;
  type: string;
  category: string;
  status: string;
  amount: Prisma.Decimal;
  date: Date;
  description: string;
  notes: string | null;
  documentId: string | null;
  createdById: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: {name: string} | null;
  document:
    | {
        id: string;
        title: string;
        type: string;
        status: string;
        storageUrl: string | null;
      }
    | null;
}): ProjectFinanceEntry {
  return {
    id: entry.id,
    projectId: entry.projectId,
    type: entry.type as ProjectFinanceEntry["type"],
    category: entry.category as ProjectFinanceEntry["category"],
    status: entry.status as ProjectFinanceEntry["status"],
    amount: entry.amount.toNumber(),
    date: toIso(entry.date),
    description: entry.description,
    notes: entry.notes,
    documentId: entry.documentId,
    createdById: entry.createdById,
    createdByName: entry.createdBy?.name ?? null,
    createdAt: toIso(entry.createdAt),
    updatedAt: toIso(entry.updatedAt),
    document: entry.document
      ? {
          id: entry.document.id,
          title: entry.document.title,
          type: entry.document.type as ProjectFinanceDocumentRef["type"],
          status: entry.document.status as ProjectFinanceDocumentRef["status"],
          storageUrl: entry.document.storageUrl,
        }
      : null,
  };
}

function buildAlerts(input: {
  saleValueWithoutTax: number;
  saleValueWithTax: number;
  spendingLimit65: number;
  budgetCurrent: number;
  committedPurchasesCost: number;
  currentMarginPercent: number;
  pendingToCollect: number;
  collectedAmount: number;
  paidAmount: number;
  warrantyCostTotal: number;
  openWarrantyCasesCount: number;
}): ProjectFinanceAlert[] {
  const alerts: ProjectFinanceAlert[] = [];

  if (input.budgetCurrent > input.spendingLimit65) {
    alerts.push({
      id: "budget-limit-exceeded",
      tone: "danger",
      title: "Límite 65% excedido",
      message: "El presupuesto actual ya supera el límite principal del proyecto.",
    });
  } else if (input.committedPurchasesCost > input.spendingLimit65) {
    alerts.push({
      id: "purchases-limit-exceeded",
      tone: "warning",
      title: "Compras comprometidas altas",
      message:
        "Las compras comprometidas ya sobrepasan el límite del 65% disponible.",
    });
  } else if (
    input.spendingLimit65 > 0 &&
    input.committedPurchasesCost / input.spendingLimit65 >= 0.85
  ) {
    alerts.push({
      id: "purchases-close-limit",
      tone: "warning",
      title: "Cerca del límite 65%",
      message:
        "Las compras comprometidas están consumiendo rápidamente el margen operativo.",
    });
  }

  if (input.currentMarginPercent < 10) {
    alerts.push({
      id: "margin-critical",
      tone: "danger",
      title: "Margen crítico",
      message:
        "La utilidad actual está muy erosionada y el proyecto requiere seguimiento cercano.",
    });
  } else if (input.currentMarginPercent < 20) {
    alerts.push({
      id: "margin-warning",
      tone: "warning",
      title: "Margen bajo",
      message:
        "El margen actual está por debajo del rango esperado para una operación sana.",
    });
  }

  if (
    input.saleValueWithTax > 0 &&
    input.pendingToCollect / input.saleValueWithTax >= 0.4
  ) {
    alerts.push({
      id: "collection-risk",
      tone: "warning",
      title: "Cobranza pendiente alta",
      message:
        "Todavía hay una porción importante de la venta pendiente por cobrar.",
    });
  }

  if (input.paidAmount > input.collectedAmount) {
    alerts.push({
      id: "cashflow-risk",
      tone: "danger",
      title: "Flujo de caja en presión",
      message:
        "Los pagos registrados ya superan los cobros recibidos del proyecto.",
    });
  }

  if (input.warrantyCostTotal > input.saleValueWithoutTax * 0.05) {
    alerts.push({
      id: "warranty-cost-impact",
      tone: "warning",
      title: "Garantías con impacto económico",
      message:
        "El costo acumulado de garantías ya representa una porción relevante de la venta.",
    });
  } else if (input.openWarrantyCasesCount > 0) {
    alerts.push({
      id: "open-warranties",
      tone: "info",
      title: "Garantías abiertas",
      message:
        "Existen casos de garantía abiertos que podrían seguir impactando la utilidad.",
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: "healthy",
      tone: "success",
      title: "Proyecto sano",
      message:
        "No se detectan señales económicas relevantes de riesgo con la información actual.",
    });
  }

  return alerts;
}

export const projectFinancePrismaRepo: ProjectFinanceRepoPort = {
  async getProjectFinance(projectId) {
    const [project, purchaseAgg, entries] = await Promise.all([
      prisma.project.findUnique({
        where: {id: projectId},
        select: {
          id: true,
          code: true,
          totalQuotationSinIVA: true,
          spendingLimit65: true,
          budgetTotal: true,
          remaining: true,
          warrantyCostTotal: true,
          openWarrantyCasesCount: true,
          quotation: {
            select: {
              numberQuotation: true,
              totalWithIva: true,
            },
          },
        },
      }),
      prisma.projectBudgetItem.aggregate({
        where: {
          projectId,
          supplierId: {not: null},
          totalCost: {gt: 0},
        },
        _sum: {
          totalCost: true,
        },
      }),
      prisma.projectFinanceEntry.findMany({
        where: {projectId},
        orderBy: [{date: "desc"}, {createdAt: "desc"}],
        include: {
          createdBy: {
            select: {
              name: true,
            },
          },
          document: {
            select: {
              id: true,
              title: true,
              type: true,
              status: true,
              storageUrl: true,
            },
          },
        },
      }),
    ]);

    if (!project) {
      throw new Error("Project finance not found");
    }

    const purchaseRows = await prisma.projectBudgetItem.findMany({
      where: {
        projectId,
        supplierId: {not: null},
        totalCost: {gt: 0},
      },
      select: {
        totalCost: true,
        procurementStatus: true,
      },
    });

    const committedPurchasesCost = purchaseRows.reduce((acc, item) => {
      if (
        item.procurementStatus === "ORDERED" ||
        item.procurementStatus === "RECEIVED"
      ) {
        return acc + toNum(item.totalCost);
      }
      return acc;
    }, 0);

    const executedPurchasesCost = purchaseRows.reduce((acc, item) => {
      if (item.procurementStatus === "RECEIVED") {
        return acc + toNum(item.totalCost);
      }
      return acc;
    }, 0);

    const activeEntries = entries.filter((entry) => entry.status === "ACTIVE");

    const collectedAmount = activeEntries.reduce((acc, entry) => {
      if (entry.type === "COLLECTION") return acc + entry.amount.toNumber();
      return acc;
    }, 0);

    const paidAmount = activeEntries.reduce((acc, entry) => {
      if (entry.type === "PAYMENT") return acc + entry.amount.toNumber();
      return acc;
    }, 0);

    const extraIncomeTotal = activeEntries.reduce((acc, entry) => {
      if (
        entry.type === "EXTRA_INCOME" ||
        entry.type === "ADJUSTMENT_POSITIVE"
      ) {
        return acc + entry.amount.toNumber();
      }
      return acc;
    }, 0);

    const extraCostsTotal = activeEntries.reduce((acc, entry) => {
      if (
        entry.type === "EXTRA_EXPENSE" ||
        entry.type === "ADJUSTMENT_NEGATIVE"
      ) {
        return acc + entry.amount.toNumber();
      }
      return acc;
    }, 0);

    const saleValueWithoutTax = toNum(project.totalQuotationSinIVA);
    const saleValueWithTax = toNum(project.quotation?.totalWithIva);
    const spendingLimit65 = toNum(project.spendingLimit65);
    const budgetCurrent = toNum(project.budgetTotal);
    const budgetRemaining = toNum(project.remaining);
    const warrantyCostTotal = toNum(project.warrantyCostTotal);
    const estimatedCostTotal = budgetCurrent + warrantyCostTotal + extraCostsTotal;
    const actualCostTotal =
      executedPurchasesCost + warrantyCostTotal + extraCostsTotal;
    const expectedProfit = saleValueWithoutTax - estimatedCostTotal;
    const currentProfit =
      saleValueWithoutTax + extraIncomeTotal - actualCostTotal;
    const expectedMarginPercent =
      saleValueWithoutTax > 0
        ? roundPercent((expectedProfit / saleValueWithoutTax) * 100)
        : 0;
    const currentMarginPercent =
      saleValueWithoutTax > 0
        ? roundPercent((currentProfit / saleValueWithoutTax) * 100)
        : 0;
    const pendingToCollect = Math.max(saleValueWithTax - collectedAmount, 0);
    const pendingToPay = Math.max(committedPurchasesCost - paidAmount, 0);
    const cashFlowBalance =
      collectedAmount + extraIncomeTotal - paidAmount - extraCostsTotal;

    const summary = {
      projectId: project.id,
      projectCode: project.code,
      quotationNumber: project.quotation?.numberQuotation ?? null,
      saleValueWithoutTax,
      saleValueWithTax,
      spendingLimit65,
      budgetCurrent,
      budgetRemaining,
      committedPurchasesCost,
      executedPurchasesCost,
      warrantyCostTotal,
      extraCostsTotal,
      extraIncomeTotal,
      collectedAmount,
      pendingToCollect,
      paidAmount,
      pendingToPay,
      estimatedCostTotal,
      actualCostTotal,
      expectedProfit,
      currentProfit,
      expectedMarginPercent,
      currentMarginPercent,
      cashFlowBalance,
      openWarrantyCasesCount: project.openWarrantyCasesCount,
      alerts: buildAlerts({
        saleValueWithoutTax,
        saleValueWithTax,
        spendingLimit65,
        budgetCurrent,
        committedPurchasesCost,
        currentMarginPercent,
        pendingToCollect,
        collectedAmount,
        paidAmount,
        warrantyCostTotal,
        openWarrantyCasesCount: project.openWarrantyCasesCount,
      }),
    };

    const mappedEntries = entries.map(mapEntry);

    const result: ProjectFinanceView = {
      summary,
      entries: mappedEntries,
    };

    return result;
  },

  async getEntryById(entryId) {
    const entry = await prisma.projectFinanceEntry.findUnique({
      where: {id: entryId},
      include: {
        createdBy: {
          select: {
            name: true,
          },
        },
        document: {
          select: {
            id: true,
            title: true,
            type: true,
            status: true,
            storageUrl: true,
          },
        },
      },
    });

    return entry ? mapEntry(entry) : null;
  },

  async createEntry(projectId, input) {
    if (input.documentId) {
      const document = await prisma.projectDocument.findFirst({
        where: {
          id: input.documentId,
          projectId,
        },
        select: {id: true},
      });

      if (!document) {
        throw new Error("Finance document not found for this project");
      }
    }

    const entry = await prisma.projectFinanceEntry.create({
      data: {
        projectId,
        type: input.type,
        category: input.category,
        amount: new Prisma.Decimal(input.amount),
        date: new Date(input.date),
        description: input.description,
        notes: input.notes ?? null,
        documentId: input.documentId ?? null,
        createdById: input.createdById ?? null,
      },
      include: {
        createdBy: {
          select: {
            name: true,
          },
        },
        document: {
          select: {
            id: true,
            title: true,
            type: true,
            status: true,
            storageUrl: true,
          },
        },
      },
    });

    return mapEntry(entry);
  },

  async updateEntry(entryId, input) {
    const existing = await prisma.projectFinanceEntry.findUnique({
      where: {id: entryId},
      select: {
        projectId: true,
      },
    });

    if (!existing) {
      throw new Error("Project finance entry not found");
    }

    if (input.documentId) {
      const document = await prisma.projectDocument.findFirst({
        where: {
          id: input.documentId,
          projectId: existing.projectId,
        },
        select: {id: true},
      });

      if (!document) {
        throw new Error("Finance document not found for this project");
      }
    }

    const entry = await prisma.projectFinanceEntry.update({
      where: {id: entryId},
      data: {
        type: input.type,
        category: input.category,
        amount:
          input.amount !== undefined
            ? new Prisma.Decimal(input.amount)
            : undefined,
        date: input.date ? new Date(input.date) : undefined,
        description: input.description,
        notes: input.notes,
        documentId: input.documentId,
        status: input.status,
      },
      include: {
        createdBy: {
          select: {
            name: true,
          },
        },
        document: {
          select: {
            id: true,
            title: true,
            type: true,
            status: true,
            storageUrl: true,
          },
        },
      },
    });

    return mapEntry(entry);
  },

  async voidEntry(entryId) {
    const entry = await prisma.projectFinanceEntry.update({
      where: {id: entryId},
      data: {
        status: "VOID",
      },
      include: {
        createdBy: {
          select: {
            name: true,
          },
        },
        document: {
          select: {
            id: true,
            title: true,
            type: true,
            status: true,
            storageUrl: true,
          },
        },
      },
    });

    return mapEntry(entry);
  },
};
