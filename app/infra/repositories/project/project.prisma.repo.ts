import {prisma} from "@/app/lib/prisma";
import {Prisma} from "@/app/generated/prisma/client";
import type {ProjectRepoPort} from "@/app/core/projects/port/project.repo.port";
import type {
  ProjectListQuery,
  UpdateProjectInput,
  ProjectDashboardStats,
  ProjectAttentionFilter,
} from "@/app/core/projects/dto";
import type {
  ProductionOrder,
  ProductionOrderInput,
  ProductionOrderListItem,
  ProductionOrderRecord,
} from "@/app/core/projects/orderPdf/dto";
import {Client} from "@/app/core/clients/dto";
import {Quotation} from "@/app/core/quotations/dto";
import {toNum} from "../../utils/toNumber";

function formatProjectCode(year: number, n: number) {
  return `PR-${year}-${String(n).padStart(3, "0")}`;
}

function getProjectBudgetRiskUsagePercent(project: {
  budgetTotal: Prisma.Decimal | number;
  spendingLimit65: Prisma.Decimal | number;
  warrantyCostTotal: Prisma.Decimal | number;
  financeEntries?: {
    status: string;
    type: string;
    amount: Prisma.Decimal | number;
  }[];
}) {
  const limit = toNum(project.spendingLimit65);
  const budget = toNum(project.budgetTotal);
  const warrantyCost = toNum(project.warrantyCostTotal);
  const extraCosts =
    project.financeEntries
      ?.filter(
        (entry) =>
          entry.status === "ACTIVE" &&
          ["EXTRA_EXPENSE", "ADJUSTMENT_NEGATIVE"].includes(entry.type),
      )
      .reduce((sum, entry) => sum + toNum(entry.amount), 0) ?? 0;

  return limit > 0 ? ((budget + warrantyCost + extraCosts) / limit) * 100 : 0;
}

function getProjectReceivedPurchasesTotal(project: {
  budgetItems: {
    procurementStatus: string;
    totalCost: Prisma.Decimal | number | null;
  }[];
}) {
  return project.budgetItems
    .filter((item) => item.procurementStatus === "RECEIVED")
    .reduce((sum, item) => sum + toNum(item.totalCost), 0);
}

function getProjectEstimatedMarginPercent(project: {
  totalQuotationSinIVA: Prisma.Decimal | number;
  warrantyCostTotal: Prisma.Decimal | number;
  budgetItems: {
    procurementStatus: string;
    totalCost: Prisma.Decimal | number | null;
  }[];
}) {
  const sale = toNum(project.totalQuotationSinIVA);
  const actualCost =
    getProjectReceivedPurchasesTotal(project) + toNum(project.warrantyCostTotal);

  if (sale <= 0) return 0;
  return ((sale - actualCost) / sale) * 100;
}

function matchesAttentionFilter(
  attention: ProjectAttentionFilter,
  project: {
    budgetTotal: Prisma.Decimal | number;
    spendingLimit65: Prisma.Decimal | number;
    openWarrantyCasesCount: number;
    installationDueAt: Date | null;
    installationDoneAt: Date | null;
    deliveryDueAt: Date | null;
    deliveryDoneAt: Date | null;
    warrantyCostTotal: Prisma.Decimal | number;
    totalQuotationSinIVA: Prisma.Decimal | number;
    financeEntries?: {
      status: string;
      type: string;
      amount: Prisma.Decimal | number;
    }[];
    budgetItems: {
      procurementStatus: string;
      totalCost: Prisma.Decimal | number | null;
    }[];
  },
) {
  const now = new Date();
  const tomorrowStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  );
  const tomorrowEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 2,
  );
  const weekLimit = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 7,
  );
  const budgetRiskPct = getProjectBudgetRiskUsagePercent(project);
  const marginPct = getProjectEstimatedMarginPercent(project);
  const hasPendingPurchases = project.budgetItems.some((item) =>
    ["PENDING", "ORDERED"].includes(item.procurementStatus),
  );

  switch (attention) {
    case "budget-risk":
      return budgetRiskPct >= 80;
    case "delivery-soon":
      return Boolean(
        project.deliveryDueAt &&
          !project.deliveryDoneAt &&
          project.deliveryDueAt >= now &&
          project.deliveryDueAt <= weekLimit,
      );
    case "pending-purchases":
      return hasPendingPurchases;
    case "warranty-open":
      return project.openWarrantyCasesCount > 0;
    case "installation-tomorrow":
      return Boolean(
        project.installationDueAt &&
          !project.installationDoneAt &&
          project.installationDueAt >= tomorrowStart &&
          project.installationDueAt < tomorrowEnd,
      );
    case "margin-risk":
      return marginPct < 15;
    default:
      return false;
  }
}

function mapProductionOrderPayload(payload: Prisma.JsonValue): ProductionOrder {
  return payload as unknown as ProductionOrder;
}

function mapProductionOrderListItem(item: {
  id: string;
  projectId: string;
  version: number;
  orderNumber: string;
  createdAt: Date;
  updatedAt: Date;
  payload: Prisma.JsonValue;
}): ProductionOrderListItem {
  const payload = mapProductionOrderPayload(item.payload);

  return {
    id: item.id,
    projectId: item.projectId,
    version: item.version,
    orderNumber: item.orderNumber,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    reviewedBy: payload.reviewedBy ?? null,
    authorizedBy: payload.authorizedBy ?? null,
  };
}

function mapProductionOrderRecord(item: {
  id: string;
  projectId: string;
  version: number;
  orderNumber: string;
  createdAt: Date;
  updatedAt: Date;
  payload: Prisma.JsonValue;
}): ProductionOrderRecord {
  return {
    id: item.id,
    projectId: item.projectId,
    version: item.version,
    orderNumber: item.orderNumber,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    payload: mapProductionOrderPayload(item.payload),
  };
}

export const projectRepo: ProjectRepoPort = {
  async create(
    quotationId: string,
    input: UpdateProjectInput,
    createdById: string,
  ) {
    return prisma.$transaction(async (tx) => {
      const quotation = await tx.quotation.findUnique({
        where: {id: quotationId},
        select: {
          id: true,
          status: true,
          subTotalWithoutIva: true,
          items: {
            select: {
              description: true,
              quantity: true,
            },
            orderBy: {createdAt: "asc"},
          },
          clientSnapshot: true,
        },
      });

      if (!quotation) throw new Error("Quotation not found");
      if (quotation.status !== "APPROVED") {
        throw new Error("Quotation not approved");
      }

      const totalGeneral = quotation.subTotalWithoutIva ?? 0;
      if (totalGeneral.lte(0)) {
        throw new Error("Quotation totalGeneral invalid");
      }

      const validateStage = (
        due: Date | null | undefined,
        done: Date | null | undefined,
        stage: string,
      ) => {
        if (due && done && done < due) {
          throw new Error(`Invalid ${stage}: doneAt cannot be before dueAt`);
        }
      };

      validateStage(
        input.procurementDueAt,
        input.procurementDoneAt,
        "procurement",
      );
      validateStage(
        input.fabricationDueAt,
        input.fabricationDoneAt,
        "fabrication",
      );
      validateStage(
        input.installationDueAt,
        input.installationDoneAt,
        "installation",
      );
      validateStage(input.deliveryDueAt, input.deliveryDoneAt, "delivery");

      const spendingLimit65 = toNum(totalGeneral) * 0.65;
      const year = new Date().getFullYear();

      const seq = await tx.projectSequence.upsert({
        where: {year},
        create: {year, nextValue: 1},
        update: {},
        select: {id: true, nextValue: true},
      });

      const current = seq.nextValue;
      const code = formatProjectCode(year, current);

      await tx.projectSequence.update({
        where: {id: seq.id},
        data: {nextValue: {increment: 1}},
      });

      const project = await tx.project.create({
        data: {
          code,
          quotationId,

          clientSnapshot: quotation.clientSnapshot ?? undefined,

          totalQuotationSinIVA: quotation.subTotalWithoutIva ?? 0,
          spendingLimit65,

          budgetTotal: 0,
          remaining: spendingLimit65,

          requiresProductionOrder: false,

          createdById,

          responsible: "Supervisor de obra",

          status: input.status,
          kind: input.kind,

          procurementDueAt: input.procurementDueAt,
          procurementDoneAt: input.procurementDoneAt,

          fabricationDueAt: input.fabricationDueAt,
          fabricationDoneAt: input.fabricationDoneAt,

          installationDueAt: input.installationDueAt,
          installationDoneAt: input.installationDoneAt,

          deliveryDueAt: input.deliveryDueAt,
          deliveryDoneAt: input.deliveryDoneAt,
          fabrication: {
            create: {
              status: "NOT_STARTED",
              progressPercent: 0,
              createdById,
              updatedById: createdById,
            },
          },
          installation: {
            create: {
              status: "NOT_STARTED",
              progressPercent: 0,
            },
          },
        },
        select: {id: true, code: true},
      });

      const items = quotation.items ?? [];
      if (items.length) {
        await tx.projectBudgetItem.createMany({
          data: items.map((it) => ({
            projectId: project.id,
            description: it.description ?? "",
            quantity:
              typeof it.quantity?.toNumber === "function"
                ? it.quantity.toNumber()
                : Number(it.quantity ?? 1),
            supplierId: null,
            supplierNameSnapshot: null,
            unitCost: null,
            totalCost: 0,
            notes: null,
          })),
        });
      }

      return project;
    });
  },

  async update(id: string, input: UpdateProjectInput) {
    const existing = await prisma.project.findUnique({
      where: {id},
    });

    if (!existing) {
      throw new Error("Project not found");
    }

    // 🔎 Validación opcional profesional:
    const validateStage = (
      due: Date | null | undefined,
      done: Date | null | undefined,
      stage: string,
    ) => {
      if (due && done && done < due) {
        throw new Error(`Invalid ${stage}: doneAt cannot be before dueAt`);
      }
    };

    validateStage(
      input.procurementDueAt ?? existing.procurementDueAt,
      input.procurementDoneAt ?? existing.procurementDoneAt,
      "procurement",
    );

    validateStage(
      input.fabricationDueAt ?? existing.fabricationDueAt,
      input.fabricationDoneAt ?? existing.fabricationDoneAt,
      "fabrication",
    );

    validateStage(
      input.installationDueAt ?? existing.installationDueAt,
      input.installationDoneAt ?? existing.installationDoneAt,
      "installation",
    );

    validateStage(
      input.deliveryDueAt ?? existing.deliveryDueAt,
      input.deliveryDoneAt ?? existing.deliveryDoneAt,
      "delivery",
    );

    const updated = await prisma.project.update({
      where: {id},
      data: {
        ...input,
      },
      select: {id: true, code: true},
    });

    return updated;
  },

  async findById(id: string) {
    const p = await prisma.project.findUnique({
      where: {id},
      select: {
        id: true,
        code: true,
        status: true,
        kind: true,
        responsible: true,

        // STAGES: PLAN (DueAt) vs REAL (DoneAt)
        procurementDueAt: true,
        procurementDoneAt: true,

        fabricationDueAt: true,
        fabricationDoneAt: true,

        installationDueAt: true,
        installationDoneAt: true,

        deliveryDueAt: true,
        deliveryDoneAt: true,

        totalQuotationSinIVA: true,
        spendingLimit65: true,
        budgetTotal: true,
        remaining: true,

        requiresProductionOrder: true,
        latestProductionOrderId: true,
        clientSnapshot: true,

        quotation: {
          select: {
            id: true,
            numberQuotation: true,
            projectReference: true,
          },
        },

        createdBy: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!p) return null;

    return {
      ...p,
      totalQuotationSinIVA: toNum(p.totalQuotationSinIVA),
      spendingLimit65: toNum(p.spendingLimit65),
      budgetTotal: toNum(p.budgetTotal),
      remaining: toNum(p.remaining),
      createdBy: p.createdBy?.name ?? null,
      clientSnapshot: p.clientSnapshot as unknown as Client,
    };
  },

  async listPaged(query: ProjectListQuery) {
    const limit = Math.min(Math.max(query.limit ?? 20, 1), 50);
    const {cursor, search, status, kind, attention} = query;
    const trimmedSearch = search?.trim();
    const clientNameFilter: Prisma.JsonFilter | undefined = trimmedSearch
      ? {
          path: ["name"],
          string_contains: trimmedSearch,
        }
      : undefined;
    const clientDocumentFilter: Prisma.JsonFilter | undefined = trimmedSearch
      ? {
          path: ["documentNumber"],
          string_contains: trimmedSearch,
        }
      : undefined;

    const searchFilters: Prisma.ProjectWhereInput[] = trimmedSearch
      ? [
          {code: {contains: trimmedSearch, mode: "insensitive"}},
          {clientSnapshot: clientNameFilter},
          {clientSnapshot: clientDocumentFilter},
          {
            quotation: {
              is: {
                numberQuotation: {
                  contains: trimmedSearch,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            quotation: {
              is: {
                projectReference: {
                  contains: trimmedSearch,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            quotation: {
              is: {
                client: {
                  is: {
                    documentNumber: {
                      contains: trimmedSearch,
                      mode: "insensitive",
                    },
                  },
                },
              },
            },
          },
          {
            quotation: {
              is: {
                clientSnapshot: clientDocumentFilter,
              },
            },
          },
        ]
      : [];

    if (attention) {
      const rows = await prisma.project.findMany({
        where: {
          status: status ?? "ACTIVE",
          kind: kind ?? undefined,
          ...(trimmedSearch ? {OR: searchFilters} : {}),
        },
        orderBy: [{createdAt: "desc"}, {id: "desc"}],
        select: {
          id: true,
          code: true,
          status: true,
          kind: true,
          deliveryDueAt: true,
          deliveryDoneAt: true,
          totalQuotationSinIVA: true,
          spendingLimit65: true,
          budgetTotal: true,
          remaining: true,
          requiresProductionOrder: true,
          createdAt: true,
          openWarrantyCasesCount: true,
          installationDueAt: true,
          installationDoneAt: true,
          warrantyCostTotal: true,
          quotation: {
            select: {
              id: true,
              numberQuotation: true,
              projectReference: true,
            },
          },
          budgetItems: {
            select: {
              procurementStatus: true,
              totalCost: true,
            },
          },
          financeEntries: {
            where: {
              status: "ACTIVE",
              type: {
                in: ["EXTRA_EXPENSE", "ADJUSTMENT_NEGATIVE"],
              },
            },
            select: {
              status: true,
              type: true,
              amount: true,
            },
          },
        },
      });

      const filteredRows = rows
        .filter((item) => matchesAttentionFilter(attention, item))
        .slice(0, limit);

      return {
        items: filteredRows.map((p) => {
          const project = {...p};
          delete (project as {financeEntries?: unknown}).financeEntries;

          return {
            ...project,
            totalQuotationSinIVA: toNum(project.totalQuotationSinIVA),
            spendingLimit65: toNum(project.spendingLimit65),
            budgetTotal: toNum(project.budgetTotal),
            remaining: toNum(project.remaining),
          };
        }),
        nextCursor: null,
      };
    }

    const where: Prisma.ProjectWhereInput = {
      status: status ?? undefined,
      kind: kind ?? undefined,
      ...(trimmedSearch && {
        OR: searchFilters,
      }),
    };

    const items = await prisma.project.findMany({
      where,
      take: limit + 1,
      ...(cursor ? {cursor: {id: cursor}, skip: 1} : {}),
      orderBy: [{createdAt: "desc"}, {id: "desc"}],
      select: {
        id: true,
        code: true,
        status: true,
        kind: true,

        // STAGES (para la tabla suele bastar con DELIVERY)
        deliveryDueAt: true,
        deliveryDoneAt: true,

        totalQuotationSinIVA: true,
        spendingLimit65: true,
        budgetTotal: true,
        remaining: true,
        requiresProductionOrder: true,
        createdAt: true,

        quotation: {
          select: {
            id: true,
            numberQuotation: true,
            projectReference: true,
          },
        },
      },
    });

    const hasNext = items.length > limit;
    const pageItems = hasNext ? items.slice(0, limit) : items;
    const nextCursor = hasNext ? pageItems[pageItems.length - 1].id : null;

    const formattedItems = pageItems.map((p) => ({
      ...p,
      totalQuotationSinIVA: toNum(p.totalQuotationSinIVA),
      spendingLimit65: toNum(p.spendingLimit65),
      budgetTotal: toNum(p.budgetTotal),
      remaining: toNum(p.remaining),
    }));

    return {
      items: formattedItems,
      nextCursor,
      meta: {
        count: pageItems.length,
        hasNext,
      },
    };
  },

  async productionOrderNeeds(projectId: string, data: ProductionOrderInput) {
    return prisma.$transaction(async (tx) => {
      // 1) Versión y 2) Datos del Proyecto (se mantienen igual)
      const last = await tx.productionOrder.findFirst({
        where: {projectId},
        orderBy: {version: "desc"},
        select: {version: true},
      });
      const nextVersion = (last?.version ?? 0) + 1;

      const project = await tx.project.findUnique({
        where: {id: projectId},
        select: {
          requiresProductionOrder: true,
          clientSnapshot: true,
          quotation: true,
        },
      });

      if (!project) throw new Error("Project not found");

      // 3) Fuente de verdad (Items que requieren OP)
      const rawNeedsOP = await tx.projectBudgetItem.findMany({
        where: {
          projectId,
          supplierId: {not: null},
          supplier: {requiresProductionOrder: true},
        },
        select: {
          id: true,
          description: true,
          quantity: true,
          unitCost: true,
          totalCost: true,
        },
      });

      if (rawNeedsOP.length === 0) {
        throw new Error(
          "This project has no budget items that require a production order",
        );
      }

      const sanitizedItems = rawNeedsOP.map((item) => ({
        id: item.id,
        description: item.description,
        quantity: toNum(item.quantity),
        unitCost: toNum(item.unitCost),
        totalCost: toNum(item.totalCost),
      }));

      const totalFabrication = sanitizedItems.reduce(
        (acc, item) => acc + item.totalCost,
        0,
      );

      const adminPercent = 0.025;
      const imprPercent = 0.025;
      const utilPercent = 0.1;
      const ivaPercent = 0.19;
      const taxWithholdingPercent = 0.04;
      const reteicaPercent = 0.00966;

      const admin = totalFabrication * adminPercent;
      const imp = totalFabrication * imprPercent;
      const util = totalFabrication * utilPercent;

      const subtotal = totalFabrication + admin + imp + util;

      const iva = subtotal * ivaPercent;
      const retentions = subtotal * taxWithholdingPercent;
      const reteica = subtotal * reteicaPercent;

      const granTotal = subtotal + iva - retentions - reteica;

      // --- FIN DE CÁLCULOS ---

      const clientSnapshot = project.clientSnapshot as unknown as Client;
      const quotation = project.quotation as unknown as Quotation;
      const {short} = getTodayDates();

      const orderProduction = {
        orderNumber: generateProductionOrderNumber("ORDER"),
        date: short,
        projectName: clientSnapshot.name,
        providerName: "MUNDIAL DE MALLAS Y ESTRUCTURAS",
        reference:
          `${quotation.projectReference} ${quotation.projectReferenceDetail}`.trim(),
        deliveryDateText: data.deliveryDateText,
        installationMethod: quotation.installationSystem ?? "",
        color: data.color,
        observations: data.observations,
        elaboratedBy: "Supervisor de obra",
        items: sanitizedItems,
        fabricationCost: totalFabrication,
        administrativeCost: admin,
        impCost: imp,
        utilCost: util,
        subtotal: subtotal,
        iva: iva,
        retentions: retentions,
        reteica: reteica,
        totalCost: granTotal,
      };

      // 6 y 7) Persistencia (Se mantiene igual, enviando el JSON)
      const created = await tx.productionOrder.create({
        data: {
          projectId,
          version: nextVersion,
          orderNumber: orderProduction.orderNumber,
          payload: orderProduction,
        },
        select: {
          id: true,
          projectId: true,
          version: true,
          orderNumber: true,
          createdAt: true,
          updatedAt: true,
          payload: true,
        },
      });

      await tx.project.update({
        where: {id: projectId},
        data: {
          latestProductionOrderId: created.id,
          productionOrderCount: {increment: 1},
        },
        select: {id: true},
      });

      return mapProductionOrderRecord(created);
    });
  },

  async listProductionOrders(projectId: string) {
    const items = await prisma.productionOrder.findMany({
      where: {projectId},
      orderBy: [{version: "desc"}, {createdAt: "desc"}],
      select: {
        id: true,
        projectId: true,
        version: true,
        orderNumber: true,
        createdAt: true,
        updatedAt: true,
        payload: true,
      },
    });

    return items.map(mapProductionOrderListItem);
  },

  async findProductionOrderById(projectId: string, productionOrderId: string) {
    const item = await prisma.productionOrder.findFirst({
      where: {
        id: productionOrderId,
        projectId,
      },
      select: {
        id: true,
        projectId: true,
        version: true,
        orderNumber: true,
        createdAt: true,
        updatedAt: true,
        payload: true,
      },
    });

    return item ? mapProductionOrderRecord(item) : null;
  },

  async approveProductionOrder(projectId, productionOrderId, approvedBy) {
    const existing = await prisma.productionOrder.findFirst({
      where: {
        id: productionOrderId,
        projectId,
      },
      select: {
        id: true,
        projectId: true,
        version: true,
        orderNumber: true,
        createdAt: true,
        updatedAt: true,
        payload: true,
      },
    });

    if (!existing) {
      throw new Error("Production order not found");
    }

    const currentPayload = mapProductionOrderPayload(existing.payload);

    const updated = await prisma.productionOrder.update({
      where: {id: productionOrderId},
      data: {
        payload: {
          ...currentPayload,
          reviewedBy: currentPayload.reviewedBy ?? approvedBy,
          authorizedBy: currentPayload.authorizedBy ?? "Freddy Torres",
        } as unknown as Prisma.InputJsonValue,
      },
      select: {
        id: true,
        projectId: true,
        version: true,
        orderNumber: true,
        createdAt: true,
        updatedAt: true,
        payload: true,
      },
    });

    return mapProductionOrderRecord(updated);
  },

  async getDashboardStats(): Promise<ProjectDashboardStats> {
    // 1. Obtener la fecha actual (inicio del día)
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // 2. Calcular 15 días a partir de hoy (nativamente)
    const fifteenDaysFromNow = new Date(now);
    fifteenDaysFromNow.setDate(now.getDate() + 15);

    // 3. Consultas en paralelo
    const [activeCount, upcoming, overdue, totalValue] = await Promise.all([
      // Proyectos en Ejecución
      prisma.project.count({
        where: {status: "ACTIVE"},
      }),

      // Próximas Entregas (Próximos 15 días)
      prisma.project.count({
        where: {
          status: "ACTIVE",
          deliveryDueAt: {
            gte: now,
            lte: fifteenDaysFromNow,
          },
        },
      }),

      // Proyectos con Retraso (Fecha vencida y sin entrega real)
      prisma.project.count({
        where: {
          status: "ACTIVE",
          deliveryDueAt: {lt: now},
          deliveryDoneAt: null,
        },
      }),

      // Valor Total en Obra
      prisma.project.aggregate({
        where: {status: "ACTIVE"},
        _sum: {
          budgetTotal: true,
        },
      }),
    ]);

    return {
      activeProjectsCount: activeCount,
      upcomingDeliveriesCount: upcoming,
      totalActiveValue: Number(totalValue._sum.budgetTotal) || 0,
      overdueProjectsCount: overdue,
    };
  },
};

export function generateProductionOrderNumber(prefix = "ORDER") {
  const n = Math.floor(1 + Math.random() * 999); // 1..999
  return `${prefix}-${pad3(n)}`;
}
function pad3(n: number) {
  return String(n).padStart(3, "0");
}

export function getTodayDates() {
  const now = new Date();

  const iso = now.toISOString();

  const short = now.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

  return {now, iso, short};
}
