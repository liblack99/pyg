import {prisma} from "@/app/lib/prisma";
import type {ProjectInstallationRepoPort} from "@/app/core/projects/installation/port/projectInstallation.repo.port";
import type {
  InstallationItemStatus,
  ProjectInstallationDetail,
  ProjectInstallationItem,
  ProjectInstallationStatus,
  ProjectInstallationWithItems,
} from "@/app/core/projects/installation/dto";

function toIsoOrNull(value: Date | null | undefined): string | null {
  return value ? value.toISOString() : null;
}

function toDateOrNull(value?: string | null): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  return new Date(value);
}

function mapItem(item: {
  id: string;
  installationId: string;
  name: string;
  description: string | null;
  status: string;
  responsible: string | null;
  plannedAt: Date | null;
  completedAt: Date | null;
  orderIndex: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}): ProjectInstallationItem {
  return {
    id: item.id,
    installationId: item.installationId,
    name: item.name,
    description: item.description,
    status: item.status as InstallationItemStatus,
    responsible: item.responsible,
    plannedAt: toIsoOrNull(item.plannedAt),
    completedAt: toIsoOrNull(item.completedAt),
    orderIndex: item.orderIndex,
    notes: item.notes,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

function mapInstallationBase(installation: {
  id: string;
  projectId: string;
  status: string;
  responsible: string | null;
  summary: string | null;
  notes: string | null;
  plannedStartAt: Date | null;
  plannedEndAt: Date | null;
  actualStartAt: Date | null;
  actualEndAt: Date | null;
  progressPercent: number;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: installation.id,
    projectId: installation.projectId,
    status: installation.status as ProjectInstallationStatus,
    responsible: installation.responsible,
    summary: installation.summary,
    notes: installation.notes,
    plannedStartAt: toIsoOrNull(installation.plannedStartAt),
    plannedEndAt: toIsoOrNull(installation.plannedEndAt),
    actualStartAt: toIsoOrNull(installation.actualStartAt),
    actualEndAt: toIsoOrNull(installation.actualEndAt),
    progressPercent: installation.progressPercent,
    createdAt: installation.createdAt.toISOString(),
    updatedAt: installation.updatedAt.toISOString(),
  };
}

function calculateProgress(items: Array<{status: string}>): number {
  if (items.length === 0) return 0;
  const completed = items.filter((item) => item.status === "COMPLETED").length;
  return Math.round((completed / items.length) * 100);
}

function deriveStatus(
  items: Array<{status: string}>,
): ProjectInstallationStatus {
  if (items.length === 0) return "NOT_STARTED";

  const allCompleted = items.every((item) => item.status === "COMPLETED");
  if (allCompleted) return "COMPLETED";

  const hasInProgress = items.some((item) => item.status === "IN_PROGRESS");
  if (hasInProgress) return "IN_PROGRESS";

  const hasBlocked = items.some((item) => item.status === "BLOCKED");
  const hasStarted = items.some((item) =>
    ["IN_PROGRESS", "BLOCKED", "COMPLETED"].includes(item.status),
  );

  if (hasBlocked && !hasInProgress) return "PAUSED";
  if (hasStarted) return "IN_PROGRESS";

  return "NOT_STARTED";
}

export const projectInstallationPrismaRepo: ProjectInstallationRepoPort = {
  async getByProjectId(projectId) {
    const installation = await prisma.projectInstallation.findUnique({
      where: {projectId},
      include: {
        items: {
          orderBy: [{orderIndex: "asc"}, {createdAt: "asc"}],
        },
        project: {
          select: {
            id: true,
            code: true,
            status: true,
            responsible: true,
          },
        },
      },
    });

    if (!installation) return null;

    const result: ProjectInstallationDetail = {
      ...mapInstallationBase(installation),
      items: installation.items.map(mapItem),
      project: {
        id: installation.project.id,
        code: installation.project.code,
        status: installation.project.status,
        responsible: installation.project.responsible,
      },
    };

    return result;
  },

  async getById(installationId) {
    const installation = await prisma.projectInstallation.findUnique({
      where: {id: installationId},
      include: {
        items: {
          orderBy: [{orderIndex: "asc"}, {createdAt: "asc"}],
        },
      },
    });

    if (!installation) return null;

    const result: ProjectInstallationWithItems = {
      ...mapInstallationBase(installation),
      items: installation.items.map(mapItem),
    };

    return result;
  },

  async existsByProjectId(projectId) {
    const count = await prisma.projectInstallation.count({
      where: {projectId},
    });

    return count > 0;
  },

  async update(installationId, input) {
    const actualStartAt =
      input.status === "IN_PROGRESS" && !input.actualStartAt
        ? new Date()
        : toDateOrNull(input.actualStartAt);
    const actualEndAt =
      input.status === "COMPLETED" && !input.actualEndAt
        ? new Date()
        : toDateOrNull(input.actualEndAt);

    const installation = await prisma.projectInstallation.update({
      where: {id: installationId},
      data: {
        status: input.status,
        responsible: input.responsible,
        summary: input.summary,
        notes: input.notes,
        plannedStartAt: toDateOrNull(input.plannedStartAt),
        plannedEndAt: toDateOrNull(input.plannedEndAt),
        actualStartAt,
        actualEndAt,
      },
      include: {
        items: {
          orderBy: [{orderIndex: "asc"}, {createdAt: "asc"}],
        },
      },
    });

    return {
      ...mapInstallationBase(installation),
      items: installation.items.map(mapItem),
    };
  },

  async listItems(installationId) {
    const items = await prisma.projectInstallationItem.findMany({
      where: {installationId},
      orderBy: [{orderIndex: "asc"}, {createdAt: "asc"}],
    });

    return items.map(mapItem);
  },

  async getItemById(itemId) {
    const item = await prisma.projectInstallationItem.findUnique({
      where: {id: itemId},
    });

    if (!item) return null;
    return mapItem(item);
  },

  async createItem(input) {
    const item = await prisma.projectInstallationItem.create({
      data: {
        installationId: input.installationId,
        name: input.name,
        description: input.description ?? null,
        status: input.status ?? "PENDING",
        responsible: input.responsible ?? null,
        plannedAt: toDateOrNull(input.plannedAt),
        completedAt: toDateOrNull(input.completedAt),
        orderIndex: input.orderIndex ?? 0,
        notes: input.notes ?? null,
      },
    });

    return mapItem(item);
  },

  async updateItem(itemId, input) {
    const completedAt =
      input.status === "COMPLETED" && !input.completedAt
        ? new Date()
        : toDateOrNull(input.completedAt);

    const item = await prisma.projectInstallationItem.update({
      where: {id: itemId},
      data: {
        name: input.name,
        description: input.description,
        status: input.status,
        responsible: input.responsible,
        plannedAt: toDateOrNull(input.plannedAt),
        completedAt,
        orderIndex: input.orderIndex,
        notes: input.notes,
      },
    });

    return mapItem(item);
  },

  async deleteItem(itemId) {
    await prisma.projectInstallationItem.delete({
      where: {id: itemId},
    });
  },

  async updateDerivedState(installationId) {
    return prisma.$transaction(async (tx) => {
      const installation = await tx.projectInstallation.findUnique({
        where: {id: installationId},
        include: {
          items: {
            select: {
              id: true,
              status: true,
            },
            orderBy: [{orderIndex: "asc"}, {createdAt: "asc"}],
          },
        },
      });

      if (!installation) {
        throw new Error("Project installation not found");
      }

      const progressPercent = calculateProgress(installation.items);
      const status = deriveStatus(installation.items);
      const hasStarted = installation.items.some((item) =>
        ["IN_PROGRESS", "BLOCKED", "COMPLETED"].includes(item.status),
      );
      const allCompleted =
        installation.items.length > 0 &&
        installation.items.every((item) => item.status === "COMPLETED");

      const updated = await tx.projectInstallation.update({
        where: {id: installationId},
        data: {
          progressPercent,
          status,
          actualStartAt: hasStarted
            ? (installation.actualStartAt ?? new Date())
            : null,
          actualEndAt: allCompleted
            ? (installation.actualEndAt ?? new Date())
            : null,
        },
        include: {
          items: {
            orderBy: [{orderIndex: "asc"}, {createdAt: "asc"}],
          },
        },
      });

      return {
        ...mapInstallationBase(updated),
        items: updated.items.map(mapItem),
      };
    });
  },
};
