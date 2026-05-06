import {Prisma} from "@/app/generated/prisma/client";
import type {ProjectEventDelegate} from "@/app/generated/prisma/models/ProjectEvent";
import type {ProjectAlertDelegate} from "@/app/generated/prisma/models/ProjectAlert";
import {prisma} from "@/app/lib/prisma";
import type {ProjectActivityRepoPort} from "@/app/core/projects/activity/port/project-activity.repo.port";
import type {
  CreateProjectAlertInput,
  ListProjectAlertsQuery,
  ListProjectEventsQuery,
  ProjectActivityMetadata,
  ProjectAlertType,
  ProjectAlertView,
  ProjectEventView,
} from "@/app/core/projects/activity/dto";
import {getProjectModuleHref} from "@/app/core/projects/activity/dto";
import {toNum} from "@/app/infra/utils/toNumber";

const activityPrisma = prisma as typeof prisma & {
  projectEvent: ProjectEventDelegate;
  projectAlert: ProjectAlertDelegate;
};

function toIso(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

function toMetadata(value: Prisma.JsonValue | null): ProjectActivityMetadata {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function toJsonInput(
  value?: Record<string, unknown> | null,
): Prisma.InputJsonValue | typeof Prisma.JsonNull {
  if (!value) {
    return Prisma.JsonNull;
  }

  return value as Prisma.InputJsonValue;
}

function severityRank(value: ProjectAlertView["severity"]) {
  return value === "CRITICAL" ? 0 : value === "WARNING" ? 1 : 2;
}

function mapEvent(event: {
  id: string;
  projectId: string;
  type: string;
  module: string;
  title: string;
  description: string | null;
  entityId: string | null;
  metadata: Prisma.JsonValue | null;
  createdById: string | null;
  createdAt: Date;
  createdBy?: {name: string | null} | null;
}): ProjectEventView {
  return {
    id: event.id,
    projectId: event.projectId,
    type: event.type as ProjectEventView["type"],
    module: event.module as ProjectEventView["module"],
    title: event.title,
    description: event.description,
    entityId: event.entityId,
    metadata: toMetadata(event.metadata),
    createdById: event.createdById,
    createdByName: event.createdBy?.name ?? null,
    createdAt: event.createdAt.toISOString(),
    href: getProjectModuleHref(
      event.projectId,
      event.module as ProjectEventView["module"],
    ),
  };
}

function mapAlert(alert: {
  id: string;
  projectId: string;
  type: string;
  module: string;
  severity: string;
  status: string;
  title: string;
  description: string | null;
  entityId: string | null;
  metadata: Prisma.JsonValue | null;
  createdById: string | null;
  createdAt: Date;
  resolvedAt: Date | null;
  dismissedAt: Date | null;
  createdBy?: {name: string | null} | null;
}): ProjectAlertView {
  return {
    id: alert.id,
    projectId: alert.projectId,
    type: alert.type as ProjectAlertView["type"],
    module: alert.module as ProjectAlertView["module"],
    severity: alert.severity as ProjectAlertView["severity"],
    status: alert.status as ProjectAlertView["status"],
    title: alert.title,
    description: alert.description,
    entityId: alert.entityId,
    metadata: toMetadata(alert.metadata),
    createdById: alert.createdById,
    createdByName: alert.createdBy?.name ?? null,
    createdAt: alert.createdAt.toISOString(),
    resolvedAt: toIso(alert.resolvedAt),
    dismissedAt: toIso(alert.dismissedAt),
    href: getProjectModuleHref(
      alert.projectId,
      alert.module as ProjectAlertView["module"],
    ),
  };
}

type DesiredAlert = CreateProjectAlertInput;

async function buildDesiredAlerts(projectId: string): Promise<DesiredAlert[]> {
  const [project, purchaseRows, blockedInstallationCount, financeEntries] =
    await Promise.all([
      prisma.project.findUnique({
        where: {id: projectId},
        select: {
          id: true,
          totalQuotationSinIVA: true,
          spendingLimit65: true,
          budgetTotal: true,
          deliveryDueAt: true,
          deliveryDoneAt: true,
          warrantyCostTotal: true,
          openWarrantyCasesCount: true,
        },
      }),
      prisma.projectBudgetItem.findMany({
        where: {
          projectId,
          supplierId: {not: null},
          totalCost: {gt: 0},
        },
        select: {
          procurementStatus: true,
          totalCost: true,
        },
      }),
      prisma.projectInstallationItem.count({
        where: {
          installation: {
            projectId,
          },
          status: "BLOCKED",
        },
      }),
      prisma.projectFinanceEntry.findMany({
        where: {
          projectId,
          status: "ACTIVE",
        },
        select: {
          type: true,
          amount: true,
        },
      }),
    ]);

  if (!project) {
    throw new Error("Project activity not found");
  }

  const desired: DesiredAlert[] = [];
  const limit = toNum(project.spendingLimit65);
  const budgetTotal = toNum(project.budgetTotal);
  const budgetPct = limit > 0 ? budgetTotal / limit : 0;

  if (budgetPct >= 1) {
    desired.push({
      type: "BUDGET_LIMIT_WARNING",
      module: "BUDGET",
      severity: "CRITICAL",
      title: "Presupuesto excedido",
      description:
        "El presupuesto actual ya supero el limite principal del 65% del proyecto.",
      metadata: {
        budgetTotal,
        spendingLimit65: limit,
        usagePercent: Number((budgetPct * 100).toFixed(2)),
      },
    });
  } else if (budgetPct >= 0.8) {
    desired.push({
      type: "BUDGET_LIMIT_WARNING",
      module: "BUDGET",
      severity: "WARNING",
      title: "Presupuesto cerca del limite",
      description:
        "El presupuesto esta consumiendo rapidamente el margen permitido del proyecto.",
      metadata: {
        budgetTotal,
        spendingLimit65: limit,
        usagePercent: Number((budgetPct * 100).toFixed(2)),
      },
    });
  }

  if (project.deliveryDueAt && !project.deliveryDoneAt) {
    const diffDays = Math.ceil(
      (project.deliveryDueAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays < 0) {
      desired.push({
        type: "DEADLINE_OVERDUE",
        module: "SUMMARY",
        severity: "CRITICAL",
        title: "Proyecto atrasado",
        description:
          "La fecha de entrega ya vencio y el proyecto todavia no figura como completado.",
        metadata: {
          deliveryDueAt: project.deliveryDueAt.toISOString(),
          diffDays,
        },
      });
    } else if (diffDays <= 5) {
      desired.push({
        type: "DEADLINE_NEAR",
        module: "SUMMARY",
        severity: "WARNING",
        title: "Entrega proxima",
        description:
          "El proyecto esta cerca de su fecha de entrega y requiere seguimiento cercano.",
        metadata: {
          deliveryDueAt: project.deliveryDueAt.toISOString(),
          diffDays,
        },
      });
    }
  }

  const pendingPurchasesCount = purchaseRows.filter(
    (item) =>
      item.procurementStatus === "PENDING" ||
      item.procurementStatus === "ORDERED",
  ).length;

  if (pendingPurchasesCount > 0) {
    desired.push({
      type: "PURCHASE_PENDING",
      module: "PURCHASES",
      severity: pendingPurchasesCount >= 3 ? "WARNING" : "INFO",
      title: "Compras pendientes",
      description:
        "Todavia hay items de compra pendientes o en proceso que requieren seguimiento.",
      metadata: {pendingPurchasesCount},
    });
  }

  if (blockedInstallationCount > 0) {
    desired.push({
      type: "INSTALLATION_BLOCKED",
      module: "INSTALLATION",
      severity: "WARNING",
      title: "Instalacion bloqueada",
      description:
        "Existen actividades de instalacion bloqueadas que pueden afectar el cronograma.",
      metadata: {blockedInstallationCount},
    });
  }

  if (project.openWarrantyCasesCount > 0) {
    desired.push({
      type: "WARRANTY_OPEN",
      module: "WARRANTY",
      severity: project.openWarrantyCasesCount >= 2 ? "WARNING" : "INFO",
      title: "Garantias abiertas",
      description:
        "El proyecto tiene casos de garantia abiertos que siguen requiriendo atencion.",
      metadata: {openWarrantyCasesCount: project.openWarrantyCasesCount},
    });
  }

  const extraIncome = financeEntries.reduce((acc, entry) => {
    if (entry.type === "EXTRA_INCOME" || entry.type === "ADJUSTMENT_POSITIVE") {
      return acc + entry.amount.toNumber();
    }
    return acc;
  }, 0);

  const extraCosts = financeEntries.reduce((acc, entry) => {
    if (
      entry.type === "EXTRA_EXPENSE" ||
      entry.type === "ADJUSTMENT_NEGATIVE"
    ) {
      return acc + entry.amount.toNumber();
    }
    return acc;
  }, 0);

  const executedPurchasesCost = purchaseRows.reduce((acc, row) => {
    if (row.procurementStatus === "RECEIVED") {
      return acc + toNum(row.totalCost);
    }
    return acc;
  }, 0);

  const saleValueWithoutTax = toNum(project.totalQuotationSinIVA);
  const currentProfit =
    saleValueWithoutTax +
    extraIncome -
    executedPurchasesCost -
    toNum(project.warrantyCostTotal) -
    extraCosts;
  const currentMarginPercent =
    saleValueWithoutTax > 0 ? (currentProfit / saleValueWithoutTax) * 100 : 0;

  if (saleValueWithoutTax > 0 && currentMarginPercent < 20) {
    desired.push({
      type: "FINANCE_MARGIN_RISK",
      module: "FINANCE",
      severity: currentMarginPercent < 10 ? "CRITICAL" : "WARNING",
      title: currentMarginPercent < 10 ? "Margen critico" : "Margen en riesgo",
      description:
        "La utilidad estimada actual del proyecto esta siendo afectada por costos ejecutados y extras.",
      metadata: {
        currentMarginPercent: Number(currentMarginPercent.toFixed(2)),
        currentProfit: Number(currentProfit.toFixed(2)),
      },
    });
  }

  return desired;
}

export const projectActivityPrismaRepo: ProjectActivityRepoPort = {
  async listEvents(projectId, query?: ListProjectEventsQuery) {
    const events = await activityPrisma.projectEvent.findMany({
      where: {projectId},
      orderBy: {createdAt: "desc"},
      take: query?.limit ?? 8,
      include: {
        createdBy: {
          select: {
            name: true,
          },
        },
      },
    });

    return events.map(mapEvent);
  },

  async listAlerts(projectId, query?: ListProjectAlertsQuery) {
    const alerts = await activityPrisma.projectAlert.findMany({
      where: {
        projectId,
        status: query?.status ?? "ACTIVE",
      },
      orderBy: [{createdAt: "desc"}],
      take: query?.limit ?? 8,
      include: {
        createdBy: {
          select: {
            name: true,
          },
        },
      },
    });

    return alerts
      .map(mapAlert)
      .sort((a: ProjectAlertView, b: ProjectAlertView) => {
        const severityDiff =
          severityRank(a.severity) - severityRank(b.severity);
        if (severityDiff !== 0) return severityDiff;
        return b.createdAt.localeCompare(a.createdAt);
      });
  },

  async createEvent(projectId, input) {
    const event = await activityPrisma.projectEvent.create({
      data: {
        projectId,
        type: input.type,
        module: input.module,
        title: input.title,
        description: input.description ?? null,
        entityId: input.entityId ?? null,
        metadata: toJsonInput(input.metadata),
        createdById: input.createdById ?? null,
      },
      include: {
        createdBy: {
          select: {
            name: true,
          },
        },
      },
    });

    return mapEvent(event);
  },

  async createAlert(projectId, input) {
    const active = await activityPrisma.projectAlert.findFirst({
      where: {
        projectId,
        type: input.type,
        entityId: input.entityId ?? null,
        status: "ACTIVE",
      },
      include: {
        createdBy: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {createdAt: "desc"},
    });

    if (active) {
      const updated = await activityPrisma.projectAlert.update({
        where: {id: active.id},
        data: {
          module: input.module,
          severity: input.severity,
          title: input.title,
          description: input.description ?? null,
          metadata: toJsonInput(input.metadata),
        },
        include: {
          createdBy: {
            select: {
              name: true,
            },
          },
        },
      });

      return mapAlert(updated);
    }

    const alert = await activityPrisma.projectAlert.create({
      data: {
        projectId,
        type: input.type,
        module: input.module,
        severity: input.severity,
        title: input.title,
        description: input.description ?? null,
        entityId: input.entityId ?? null,
        metadata: toJsonInput(input.metadata),
        createdById: input.createdById ?? null,
      },
      include: {
        createdBy: {
          select: {
            name: true,
          },
        },
      },
    });

    return mapAlert(alert);
  },

  async resolveAlert(alertId) {
    const alert = await activityPrisma.projectAlert.update({
      where: {id: alertId},
      data: {
        status: "RESOLVED",
        resolvedAt: new Date(),
      },
      include: {
        createdBy: {
          select: {
            name: true,
          },
        },
      },
    });

    return mapAlert(alert);
  },

  async dismissAlert(alertId) {
    const alert = await activityPrisma.projectAlert.update({
      where: {id: alertId},
      data: {
        status: "DISMISSED",
        dismissedAt: new Date(),
      },
      include: {
        createdBy: {
          select: {
            name: true,
          },
        },
      },
    });

    return mapAlert(alert);
  },

  async syncAlerts(projectId) {
    const [desiredAlerts, existingAlerts] = await Promise.all([
      buildDesiredAlerts(projectId),
      activityPrisma.projectAlert.findMany({
        where: {projectId},
        orderBy: {createdAt: "desc"},
      }),
    ]);

    const desiredByType = new Map<ProjectAlertType, DesiredAlert>();
    for (const alert of desiredAlerts) {
      desiredByType.set(alert.type, alert);
    }

    const activeByType = new Map<
      ProjectAlertType,
      (typeof existingAlerts)[number]
    >();
    const latestByType = new Map<
      ProjectAlertType,
      (typeof existingAlerts)[number]
    >();

    for (const alert of existingAlerts) {
      const type = alert.type as ProjectAlertType;
      if (!latestByType.has(type)) {
        latestByType.set(type, alert);
      }
      if (alert.status === "ACTIVE" && !activeByType.has(type)) {
        activeByType.set(type, alert);
      }
    }

    for (const [type, desired] of desiredByType.entries()) {
      const active = activeByType.get(type);
      if (active) {
        await activityPrisma.projectAlert.update({
          where: {id: active.id},
          data: {
            module: desired.module,
            severity: desired.severity,
            title: desired.title,
            description: desired.description ?? null,
            metadata: toJsonInput(desired.metadata),
          },
        });
        continue;
      }

      const latest = latestByType.get(type);
      if (latest?.status === "DISMISSED") {
        continue;
      }

      await activityPrisma.projectAlert.create({
        data: {
          projectId,
          type: desired.type,
          module: desired.module,
          severity: desired.severity,
          title: desired.title,
          description: desired.description ?? null,
          entityId: desired.entityId ?? null,
          metadata: toJsonInput(desired.metadata),
          createdById: desired.createdById ?? null,
        },
      });
    }

    for (const [type, active] of activeByType.entries()) {
      if (!desiredByType.has(type)) {
        await activityPrisma.projectAlert.update({
          where: {id: active.id},
          data: {
            status: "RESOLVED",
            resolvedAt: new Date(),
          },
        });
      }
    }

    const alerts = await activityPrisma.projectAlert.findMany({
      where: {
        projectId,
        status: "ACTIVE",
      },
      orderBy: [{createdAt: "desc"}],
      take: 8,
      include: {
        createdBy: {
          select: {
            name: true,
          },
        },
      },
    });

    return alerts
      .map(mapAlert)
      .sort((a: ProjectAlertView, b: ProjectAlertView) => {
        const severityDiff =
          severityRank(a.severity) - severityRank(b.severity);
        if (severityDiff !== 0) return severityDiff;
        return b.createdAt.localeCompare(a.createdAt);
      });
  },
};
