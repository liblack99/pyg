import {Prisma} from "@/app/generated/prisma/client";
import {prisma} from "@/app/lib/prisma";

import type {DashboardRepoPort} from "@/app/core/dashboard/port/dashboard.repo.port";
import type {
  DashboardActivityItem,
  DashboardAlert,
  DashboardAttentionProject,
  DashboardChartPoint,
  DashboardKpi,
  DashboardOverview,
} from "@/app/core/dashboard/dto";

type ActiveProjectRecord = {
  id: string;
  code: string;
  status: string;
  kind: string;
  responsible: string | null;
  clientSnapshot: Prisma.JsonValue | null;
  totalQuotationSinIVA: Prisma.Decimal;
  spendingLimit65: Prisma.Decimal;
  budgetTotal: Prisma.Decimal;
  remaining: Prisma.Decimal;
  procurementDueAt: Date | null;
  procurementDoneAt: Date | null;
  fabricationDueAt: Date | null;
  fabricationDoneAt: Date | null;
  installationDueAt: Date | null;
  installationDoneAt: Date | null;
  deliveryDueAt: Date | null;
  deliveryDoneAt: Date | null;
  warrantyCostTotal: Prisma.Decimal;
  openWarrantyCasesCount: number;
  quotation: {
    id: string;
    numberQuotation: string;
    projectReference: string | null;
  };
  installation: {
    status: string;
    progressPercent: number;
  } | null;
  budgetItems: {
    procurementStatus: string;
    totalCost: Prisma.Decimal;
    supplierId: string | null;
  }[];
  financeEntries: {
    status: string;
    type: string;
    amount: Prisma.Decimal;
  }[];
};

function hasPermission(permissions: string[], permission: string) {
  return permissions.includes(permission);
}

function toNumber(value: Prisma.Decimal | number | null | undefined) {
  if (value == null) return 0;
  return typeof value === "number" ? value : Number(value);
}

function getClientName(snapshot: Prisma.JsonValue | null) {
  if (!snapshot || typeof snapshot !== "object") {
    return "Sin cliente";
  }

  if ("name" in snapshot) {
    return String(snapshot.name ?? "Sin cliente");
  }

  return "Sin cliente";
}

function joinProjectCodes(items: {code: string}[]) {
  if (items.length === 0) return "Sin proyectos relacionados";
  const visible = items
    .slice(0, 2)
    .map((item) => item.code)
    .join(", ");
  const extra = items.length - 2;
  return extra > 0 ? `${visible} y ${extra} mas` : visible;
}

function isTomorrow(date: Date | null) {
  if (!date) return false;

  const now = new Date();
  const tomorrowStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0,
    0,
  );
  const tomorrowEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 2,
    0,
    0,
    0,
    0,
  );

  return date >= tomorrowStart && date < tomorrowEnd;
}

function isWithinDays(date: Date | null, days: number) {
  if (!date) return false;

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + days);

  return date >= start && date <= end;
}

function isOverdue(date: Date | null) {
  if (!date) return false;
  const now = new Date();
  return date < now;
}

function getStageLabel(project: ActiveProjectRecord) {
  if (project.deliveryDoneAt) return "Cierre";
  if (!project.deliveryDoneAt && project.deliveryDueAt) return "Entrega";
  if (!project.fabricationDoneAt && project.fabricationDueAt)
    return "Produccion";
  if (!project.procurementDoneAt && project.procurementDueAt) return "Compras";
  return "Planificacion";
}

function getPendingPurchasesCount(project: ActiveProjectRecord) {
  return project.budgetItems.filter((item) => {
    const hasSupplier = Boolean(item.supplierId);
    const hasCost = Number(item.totalCost ?? 0) > 0;

    const isPendingPurchase = ["PENDING", "ORDERED"].includes(
      item.procurementStatus,
    );

    return hasSupplier && hasCost && isPendingPurchase;
  }).length;
}

function getReceivedPurchasesCost(project: ActiveProjectRecord) {
  return project.budgetItems
    .filter((item) => item.procurementStatus === "RECEIVED")
    .reduce((sum, item) => sum + toNumber(item.totalCost), 0);
}

function getBudgetRiskUsagePercent(project: ActiveProjectRecord) {
  const limit = toNumber(project.spendingLimit65);
  const budget = toNumber(project.budgetTotal);
  const warrantyCost = toNumber(project.warrantyCostTotal);
  const extraCosts = project.financeEntries
    .filter(
      (entry) =>
        entry.status === "ACTIVE" &&
        ["EXTRA_EXPENSE", "ADJUSTMENT_NEGATIVE"].includes(entry.type),
    )
    .reduce((sum, entry) => sum + toNumber(entry.amount), 0);

  return limit > 0 ? ((budget + warrantyCost + extraCosts) / limit) * 100 : 0;
}

function getEstimatedMarginPercent(project: ActiveProjectRecord) {
  const sale = toNumber(project.totalQuotationSinIVA);
  const actualCost =
    getReceivedPurchasesCost(project) + toNumber(project.warrantyCostTotal);

  if (sale <= 0) return 0;
  return ((sale - actualCost) / sale) * 100;
}

function getNextDateInfo(project: ActiveProjectRecord) {
  const candidates = [
    {label: "Compra", value: project.procurementDueAt},
    {label: "Fabricacion", value: project.fabricationDueAt},
    {label: "Instalacion", value: project.installationDueAt},
    {label: "Entrega", value: project.deliveryDueAt},
  ].filter((item) => item.value);

  if (candidates.length === 0) {
    return {label: null, value: null};
  }

  candidates.sort((a, b) => a.value!.getTime() - b.value!.getTime());

  return {
    label: candidates[0].label,
    value: candidates[0].value,
  };
}

function buildProjectAttention(project: ActiveProjectRecord): {
  score: number;
  row: DashboardAttentionProject;
} | null {
  const budgetRiskPct = getBudgetRiskUsagePercent(project);
  const marginPct = getEstimatedMarginPercent(project);
  const pendingPurchases = getPendingPurchasesCount(project);
  const nextDate = getNextDateInfo(project);
  const baseHref = `/dashboard/projects/${project.id}`;
  const clientName = getClientName(project.clientSnapshot);

  if (budgetRiskPct >= 100) {
    return {
      score: 100,
      row: {
        id: project.id,
        code: project.code,
        clientName,
        stageLabel: getStageLabel(project),
        status: project.status,
        responsible: project.responsible,
        nextDateLabel: nextDate.label,
        nextDate: nextDate.value?.toISOString() ?? null,
        riskLabel: "Presupuesto excedido",
        riskTone: "danger",
        href: `${baseHref}/budget`,
        actionLabel: "Ver presupuesto",
      },
    };
  }

  if (isOverdue(project.deliveryDueAt) && !project.deliveryDoneAt) {
    return {
      score: 95,
      row: {
        id: project.id,
        code: project.code,
        clientName,
        stageLabel: getStageLabel(project),
        status: project.status,
        responsible: project.responsible,
        nextDateLabel: "Entrega",
        nextDate: project.deliveryDueAt?.toISOString() ?? null,
        riskLabel: "Entrega vencida",
        riskTone: "danger",
        href: baseHref,
        actionLabel: "Ver proyecto",
      },
    };
  }

  if (marginPct < 15) {
    return {
      score: 88,
      row: {
        id: project.id,
        code: project.code,
        clientName,
        stageLabel: getStageLabel(project),
        status: project.status,
        responsible: project.responsible,
        nextDateLabel: nextDate.label,
        nextDate: nextDate.value?.toISOString() ?? null,
        riskLabel: "Margen estimado en riesgo",
        riskTone: "warning",
        href: `${baseHref}/finance`,
        actionLabel: "Ver finanzas",
      },
    };
  }

  if (project.openWarrantyCasesCount > 0) {
    return {
      score: 82,
      row: {
        id: project.id,
        code: project.code,
        clientName,
        stageLabel: getStageLabel(project),
        status: project.status,
        responsible: project.responsible,
        nextDateLabel: nextDate.label,
        nextDate: nextDate.value?.toISOString() ?? null,
        riskLabel: `${project.openWarrantyCasesCount} garantias abiertas`,
        riskTone: "warning",
        href: `${baseHref}/warranty`,
        actionLabel: "Ver garantias",
      },
    };
  }

  if (budgetRiskPct >= 80) {
    return {
      score: 78,
      row: {
        id: project.id,
        code: project.code,
        clientName,
        stageLabel: getStageLabel(project),
        status: project.status,
        responsible: project.responsible,
        nextDateLabel: nextDate.label,
        nextDate: nextDate.value?.toISOString() ?? null,
        riskLabel: "Cerca del limite 65%",
        riskTone: "warning",
        href: `${baseHref}/budget`,
        actionLabel: "Ver presupuesto",
      },
    };
  }

  if (isTomorrow(project.installationDueAt) && !project.installationDoneAt) {
    return {
      score: 72,
      row: {
        id: project.id,
        code: project.code,
        clientName,
        stageLabel: getStageLabel(project),
        status: project.status,
        responsible: project.responsible,
        nextDateLabel: "Instalacion",
        nextDate: project.installationDueAt?.toISOString() ?? null,
        riskLabel: "Instalacion programada manana",
        riskTone: "info",
        href: `${baseHref}/installation`,
        actionLabel: "Ver instalacion",
      },
    };
  }

  if (pendingPurchases > 0) {
    return {
      score: 65,
      row: {
        id: project.id,
        code: project.code,
        clientName,
        stageLabel: getStageLabel(project),
        status: project.status,
        responsible: project.responsible,
        nextDateLabel: nextDate.label,
        nextDate: nextDate.value?.toISOString() ?? null,
        riskLabel: `${pendingPurchases} compras pendientes`,
        riskTone: "info",
        href: `${baseHref}/purchases`,
        actionLabel: "Ver compras",
      },
    };
  }

  return null;
}

function buildTrendFromDates(
  dates: Date[],
  days: number,
): DashboardChartPoint[] {
  const counts = new Map<string, number>();
  const now = new Date();

  for (let index = days - 1; index >= 0; index -= 1) {
    const pointDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - index,
    );
    const label = pointDate.toLocaleDateString("es-CO", {
      month: "short",
      day: "2-digit",
    });
    counts.set(label, 0);
  }

  dates.forEach((date) => {
    const label = new Date(date).toLocaleDateString("es-CO", {
      month: "short",
      day: "2-digit",
    });
    if (counts.has(label)) {
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
  });

  return Array.from(counts.entries()).map(([label, value]) => ({
    label,
    value,
  }));
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    DRAFT: "Borrador",
    SENT: "Enviada",
    APPROVED: "Aprobada",
    REJECTED: "Rechazada",
    CANCELLED: "Cancelada",
    EXPIRED: "Vencida",
  };

  return labels[status] ?? status;
}

export const dashboardRepo: DashboardRepoPort = {
  async getOverview(permissions: string[]): Promise<DashboardOverview> {
    const canReadQuotations = hasPermission(permissions, "quotation:read");
    const canReadProjects = hasPermission(permissions, "project:read");

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [
      monthQuotationsCount,
      monthApprovedQuotationsCount,
      quotationTrendRows,
      quotationStatusRows,
      activeProjects,
      recentQuotations,
      recentProjects,
      recentDocuments,
      recentWarrantyCases,
      recentInstallations,
    ] = await Promise.all([
      canReadQuotations
        ? prisma.quotation.count({
            where: {
              createdAt: {gte: monthStart},
            },
          })
        : Promise.resolve(0),
      canReadQuotations
        ? prisma.quotation.count({
            where: {
              createdAt: {gte: monthStart},
              status: "APPROVED",
            },
          })
        : Promise.resolve(0),
      canReadQuotations
        ? prisma.quotation.findMany({
            where: {
              createdAt: {
                gte: new Date(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  new Date().getDate() - 13,
                ),
              },
            },
            select: {createdAt: true},
          })
        : Promise.resolve([]),
      canReadQuotations
        ? prisma.quotation.groupBy({
            by: ["status"],
            _count: {_all: true},
          })
        : Promise.resolve([]),
      canReadProjects
        ? prisma.project.findMany({
            where: {
              status: "ACTIVE",
            },
            orderBy: [{deliveryDueAt: "asc"}, {updatedAt: "desc"}],
            select: {
              id: true,
              code: true,
              status: true,
              kind: true,
              responsible: true,
              clientSnapshot: true,
              totalQuotationSinIVA: true,
              spendingLimit65: true,
              budgetTotal: true,
              remaining: true,
              procurementDueAt: true,
              procurementDoneAt: true,
              fabricationDueAt: true,
              fabricationDoneAt: true,
              installationDueAt: true,
              installationDoneAt: true,
              deliveryDueAt: true,
              deliveryDoneAt: true,
              warrantyCostTotal: true,
              openWarrantyCasesCount: true,
              quotation: {
                select: {
                  id: true,
                  numberQuotation: true,
                  projectReference: true,
                },
              },
              installation: {
                select: {
                  status: true,
                  progressPercent: true,
                },
              },
              budgetItems: {
                select: {
                  procurementStatus: true,
                  totalCost: true,
                  supplierId: true,
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
          })
        : Promise.resolve([]),
      canReadQuotations
        ? prisma.quotation.findMany({
            take: 4,
            orderBy: {createdAt: "desc"},
            select: {
              id: true,
              numberQuotation: true,
              projectReference: true,
              createdAt: true,
              clientSnapshot: true,
            },
          })
        : Promise.resolve([]),
      canReadProjects
        ? prisma.project.findMany({
            take: 4,
            orderBy: {updatedAt: "desc"},
            select: {
              id: true,
              code: true,
              createdAt: true,
              updatedAt: true,
              clientSnapshot: true,
            },
          })
        : Promise.resolve([]),
      canReadProjects
        ? prisma.projectDocument.findMany({
            take: 4,
            orderBy: {createdAt: "desc"},
            select: {
              id: true,
              title: true,
              type: true,
              createdAt: true,
              project: {
                select: {
                  id: true,
                  code: true,
                },
              },
            },
          })
        : Promise.resolve([]),
      canReadProjects
        ? prisma.projectWarrantyCase.findMany({
            take: 4,
            orderBy: {createdAt: "desc"},
            select: {
              id: true,
              title: true,
              createdAt: true,
              project: {
                select: {
                  id: true,
                  code: true,
                },
              },
            },
          })
        : Promise.resolve([]),
      canReadProjects
        ? prisma.projectInstallation.findMany({
            take: 4,
            orderBy: {updatedAt: "desc"},
            where: {
              updatedAt: {
                gt: new Date(0),
              },
            },
            select: {
              id: true,
              status: true,
              updatedAt: true,
              project: {
                select: {
                  id: true,
                  code: true,
                },
              },
            },
          })
        : Promise.resolve([]),
    ]);

    const activeProjectRows = activeProjects as ActiveProjectRecord[];

    const installationInProgressProjects = activeProjectRows.filter(
      (project) => project.installation?.status === "IN_PROGRESS",
    );
    const projectsWithOpenWarranty = activeProjectRows.filter(
      (project) => project.openWarrantyCasesCount > 0,
    );
    const projectsWithPendingPurchases = activeProjectRows.filter(
      (project) => getPendingPurchasesCount(project) > 0,
    );
    const riskyProjects = activeProjectRows.filter((project) => {
      const budgetPct = getBudgetRiskUsagePercent(project);
      const marginPct = getEstimatedMarginPercent(project);
      return (
        budgetPct >= 80 ||
        marginPct < 15 ||
        project.openWarrantyCasesCount > 0 ||
        (isOverdue(project.deliveryDueAt) && !project.deliveryDoneAt)
      );
    });

    const kpis: DashboardKpi[] = [
      {
        id: "quotations-month",
        title: "Cotizaciones del mes",
        value: monthQuotationsCount,
        hint: `${monthApprovedQuotationsCount} aprobadas este mes`,
        variant: "blue",
        href: "/dashboard/quotations",
      },
      {
        id: "projects-active",
        title: "Proyectos activos",
        value: activeProjectRows.length,
        hint: "Frentes operativos abiertos",
        variant: "emerald",
        href: "/dashboard/projects?status=ACTIVE",
      },
      {
        id: "projects-risk",
        title: "Proyectos en riesgo",
        value: riskyProjects.length,
        hint: joinProjectCodes(riskyProjects),
        variant: "rose",
        href: "/dashboard/projects?attention=budget-risk",
      },
      {
        id: "installations-progress",
        title: "Instalaciones en curso",
        value: installationInProgressProjects.length,
        hint: joinProjectCodes(installationInProgressProjects),
        variant: "indigo",
        href: "/dashboard/projects?attention=installation-tomorrow",
      },
      {
        id: "warranties-open",
        title: "Garantias abiertas",
        value: projectsWithOpenWarranty.reduce(
          (sum, project) => sum + project.openWarrantyCasesCount,
          0,
        ),
        hint: joinProjectCodes(projectsWithOpenWarranty),
        variant: "amber",
        href: "/dashboard/projects?attention=warranty-open",
      },
      {
        id: "pending-purchases",
        title: "Compras pendientes",
        value: projectsWithPendingPurchases.length,
        hint: joinProjectCodes(projectsWithPendingPurchases),
        variant: "slate",
        href: "/dashboard/projects?attention=pending-purchases",
      },
    ];

    const alertItems: DashboardAlert[] = [
      {
        id: "installation-tomorrow",
        title: "Instalaciones para manana",
        count: activeProjectRows.filter(
          (project) =>
            isTomorrow(project.installationDueAt) &&
            !project.installationDoneAt,
        ).length,
        description: "Proyectos que requieren alistar cuadrilla y materiales.",
        tone: "warning" as const,
        href: "/dashboard/projects?attention=installation-tomorrow",
      },
      {
        id: "budget-risk",
        title: "Cerca del limite del presupuesto",
        count: activeProjectRows.filter(
          (project) => getBudgetRiskUsagePercent(project) >= 80,
        ).length,
        description: "Presupuesto consumido al 80% o mas del limite 65%.",
        tone: "danger" as const,
        href: "/dashboard/projects?attention=budget-risk",
      },
      {
        id: "warranty-open",
        title: "Garantias abiertas",
        count: projectsWithOpenWarranty.length,
        description: "Proyectos con casos abiertos que impactan seguimiento.",
        tone: "warning" as const,
        href: "/dashboard/projects?attention=warranty-open",
      },
      {
        id: "margin-risk",
        title: "Margen estimado en riesgo",
        count: activeProjectRows.filter(
          (project) => getEstimatedMarginPercent(project) < 15,
        ).length,
        description:
          "Aproximacion basada en compras recibidas y costo de garantias.",
        tone: "danger" as const,
        href: "/dashboard/projects?attention=margin-risk",
      },
      {
        id: "delivery-soon",
        title: "Entregas proximas",
        count: activeProjectRows.filter(
          (project) =>
            isWithinDays(project.deliveryDueAt, 7) && !project.deliveryDoneAt,
        ).length,
        description: "Proyectos con entrega en la proxima semana.",
        tone: "info" as const,
        href: "/dashboard/projects?attention=delivery-soon",
      },
      {
        id: "pending-purchases",
        title: "Proyectos con compras pendientes",
        count: projectsWithPendingPurchases.length,
        description: "Hay items sin ordenar o por recibir dentro del proyecto.",
        tone: "info" as const,
        href: "/dashboard/projects?attention=pending-purchases",
      },
    ].filter((item) => item.count > 0);

    const attentionProjects = activeProjectRows
      .map(buildProjectAttention)
      .filter((item): item is {score: number; row: DashboardAttentionProject} =>
        Boolean(item),
      )
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;

        const aDate = a.row.nextDate
          ? new Date(a.row.nextDate).getTime()
          : Infinity;
        const bDate = b.row.nextDate
          ? new Date(b.row.nextDate).getTime()
          : Infinity;

        return aDate - bDate;
      })
      .slice(0, 8)
      .map((item) => item.row);

    const quotationTrend = buildTrendFromDates(
      quotationTrendRows.map((row) => row.createdAt),
      14,
    );

    const quotationStatus = quotationStatusRows.map((row) => ({
      label: statusLabel(row.status),
      value: row._count._all,
    }));

    const stageCounts = new Map<string, number>();
    activeProjectRows.forEach((project) => {
      const label = getStageLabel(project);
      stageCounts.set(label, (stageCounts.get(label) ?? 0) + 1);
    });

    const projectStages: DashboardChartPoint[] = Array.from(
      stageCounts.entries(),
    )
      .map(([label, value]) => ({label, value}))
      .sort((a, b) => b.value - a.value);

    const activity: DashboardActivityItem[] = [
      ...recentQuotations.map((item) => ({
        id: `quotation-${item.id}`,
        type: "QUOTATION" as const,
        title: `Cotizacion ${item.numberQuotation}`,
        description: `${getClientName(item.clientSnapshot)} · ${item.projectReference}`,
        occurredAt: item.createdAt.toISOString(),
        href: `/dashboard/quotations/${item.id}`,
      })),
      ...recentProjects.map((item) => ({
        id: `project-${item.id}`,
        type: "PROJECT" as const,
        title:
          item.updatedAt.getTime() > item.createdAt.getTime()
            ? `Proyecto ${item.code} actualizado`
            : `Proyecto ${item.code} creado`,
        description: getClientName(item.clientSnapshot),
        occurredAt: item.updatedAt.toISOString(),
        href: `/dashboard/projects/${item.id}`,
      })),
      ...recentDocuments.map((item) => ({
        id: `document-${item.id}`,
        type: "DOCUMENT" as const,
        title: item.title,
        description: `${item.project.code} · ${item.type}`,
        occurredAt: item.createdAt.toISOString(),
        href: `/dashboard/projects/${item.project.id}/documents`,
      })),
      ...recentWarrantyCases.map((item) => ({
        id: `warranty-${item.id}`,
        type: "WARRANTY" as const,
        title: item.title,
        description: `${item.project.code} · garantia reportada`,
        occurredAt: item.createdAt.toISOString(),
        href: `/dashboard/projects/${item.project.id}/warranty`,
      })),
      ...recentInstallations.map((item) => ({
        id: `installation-${item.id}`,
        type: "INSTALLATION" as const,
        title: `Instalacion ${item.status.toLowerCase()}`,
        description: `${item.project.code} · actualizacion operativa`,
        occurredAt: item.updatedAt.toISOString(),
        href: `/dashboard/projects/${item.project.id}/installation`,
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
      )
      .slice(0, 8);

    return {
      kpis,
      alerts: alertItems,
      attentionProjects,
      charts: {
        quotationTrend,
        quotationStatus,
        projectStages,
      },
      activity,
      generatedAt: new Date().toISOString(),
    };
  },
};
