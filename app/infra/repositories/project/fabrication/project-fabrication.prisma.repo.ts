import {prisma} from "@/app/lib/prisma";
import {Prisma} from "@/app/generated/prisma/client";
import type {ProjectFabricationRepoPort} from "@/app/core/projects/fabrication/port/projectFabrication.repo.port";
import type {
  FabricationItemStatus,
  ProjectFabricationDetail,
  ProjectFabricationItem,
  ProjectFabricationStatus,
  ProjectFabricationWithItems,
} from "@/app/core/projects/fabrication/dto";

function toIsoOrNull(value: Date | null | undefined): string | null {
  return value ? value.toISOString() : null;
}

function decimalToString(
  value: Prisma.Decimal | number | string | null | undefined,
): string | null {
  if (value === null || value === undefined) return null;
  return value.toString();
}

function toDateOrNull(value?: string | null): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  return new Date(value);
}

function toDecimalOrNull(
  value?: string | null,
): Prisma.Decimal | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  return new Prisma.Decimal(value);
}

function mapItem(item: {
  id: string;
  fabricationId: string;
  name: string;
  description: string | null;
  unit: string | null;
  quantity: Prisma.Decimal | null;
  status: string;
  plannedStartAt: Date | null;
  plannedEndAt: Date | null;
  actualStartAt: Date | null;
  actualEndAt: Date | null;
  orderIndex: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}): ProjectFabricationItem {
  return {
    id: item.id,
    fabricationId: item.fabricationId,
    name: item.name,
    description: item.description,
    unit: item.unit,
    quantity: decimalToString(item.quantity),
    status: item.status as FabricationItemStatus,
    plannedStartAt: toIsoOrNull(item.plannedStartAt),
    plannedEndAt: toIsoOrNull(item.plannedEndAt),
    actualStartAt: toIsoOrNull(item.actualStartAt),
    actualEndAt: toIsoOrNull(item.actualEndAt),
    orderIndex: item.orderIndex,
    notes: item.notes,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

function mapFabricationBase(fabrication: {
  id: string;
  projectId: string;
  status: string;
  title: string | null;
  description: string | null;
  notes: string | null;
  plannedStartAt: Date | null;
  plannedEndAt: Date | null;
  actualStartAt: Date | null;
  actualEndAt: Date | null;
  progressPercent: number;
  createdById: string | null;
  updatedById: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: fabrication.id,
    projectId: fabrication.projectId,
    status: fabrication.status as ProjectFabricationStatus,
    title: fabrication.title,
    description: fabrication.description,
    notes: fabrication.notes,
    plannedStartAt: toIsoOrNull(fabrication.plannedStartAt),
    plannedEndAt: toIsoOrNull(fabrication.plannedEndAt),
    actualStartAt: toIsoOrNull(fabrication.actualStartAt),
    actualEndAt: toIsoOrNull(fabrication.actualEndAt),
    progressPercent: fabrication.progressPercent,
    createdById: fabrication.createdById,
    updatedById: fabrication.updatedById,
    createdAt: fabrication.createdAt.toISOString(),
    updatedAt: fabrication.updatedAt.toISOString(),
  };
}

function calculateProgress(items: Array<{status: string}>): number {
  if (items.length === 0) return 0;
  const completed = items.filter((item) => item.status === "COMPLETED").length;
  return Math.round((completed / items.length) * 100);
}

function deriveStatus(
  items: Array<{status: string}>,
): ProjectFabricationStatus {
  if (items.length === 0) return "NOT_STARTED";

  const allCompleted = items.every((item) => item.status === "COMPLETED");
  if (allCompleted) return "COMPLETED";

  const hasInProgress = items.some((item) => item.status === "IN_PROGRESS");
  if (hasInProgress) return "IN_PROGRESS";

  const hasPaused = items.some((item) => item.status === "PAUSED");
  const hasStarted = items.some((item) =>
    ["IN_PROGRESS", "PAUSED", "COMPLETED"].includes(item.status),
  );

  if (hasPaused && !hasInProgress) return "PAUSED";
  if (hasStarted) return "IN_PROGRESS";

  return "NOT_STARTED";
}

export const projectFabricationPrismaRepo: ProjectFabricationRepoPort = {
  async getByProjectId(projectId) {
    const fabrication = await prisma.projectFabrication.findUnique({
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
          },
        },
      },
    });

    if (!fabrication) return null;

    const result: ProjectFabricationDetail = {
      ...mapFabricationBase(fabrication),
      items: fabrication.items.map(mapItem),
      project: {
        id: fabrication.project.id,
        code: fabrication.project.code,
        status: fabrication.project.status,
      },
    };

    return result;
  },

  async getById(fabricationId) {
    const fabrication = await prisma.projectFabrication.findUnique({
      where: {id: fabricationId},
      include: {
        items: {
          orderBy: [{orderIndex: "asc"}, {createdAt: "asc"}],
        },
      },
    });

    if (!fabrication) return null;

    const result: ProjectFabricationWithItems = {
      ...mapFabricationBase(fabrication),
      items: fabrication.items.map(mapItem),
    };

    return result;
  },

  async existsByProjectId(projectId) {
    const count = await prisma.projectFabrication.count({
      where: {projectId},
    });

    return count > 0;
  },

  async update(fabricationId, input) {
    const fabrication = await prisma.projectFabrication.update({
      where: {id: fabricationId},
      data: {
        title: input.title,
        description: input.description,
        notes: input.notes,
        plannedStartAt: toDateOrNull(input.plannedStartAt),
        plannedEndAt: toDateOrNull(input.plannedEndAt),
        actualStartAt: toDateOrNull(input.actualStartAt),
        actualEndAt: toDateOrNull(input.actualEndAt),
        updatedById: input.updatedById,
      },
      include: {
        items: {
          orderBy: [{orderIndex: "asc"}, {createdAt: "asc"}],
        },
      },
    });

    const result: ProjectFabricationWithItems = {
      ...mapFabricationBase(fabrication),
      items: fabrication.items.map(mapItem),
    };

    return result;
  },

  async listItems(fabricationId) {
    const items = await prisma.projectFabricationItem.findMany({
      where: {fabricationId},
      orderBy: [{orderIndex: "asc"}, {createdAt: "asc"}],
    });

    return items.map(mapItem);
  },

  async getItemById(itemId) {
    const item = await prisma.projectFabricationItem.findUnique({
      where: {id: itemId},
    });

    if (!item) return null;
    return mapItem(item);
  },

  async createItem(input) {
    const item = await prisma.projectFabricationItem.create({
      data: {
        fabricationId: input.fabricationId,
        name: input.name,
        description: input.description ?? null,
        unit: input.unit ?? null,
        quantity: toDecimalOrNull(input.quantity),
        status: input.status ?? "PENDING",
        plannedStartAt: toDateOrNull(input.plannedStartAt),
        plannedEndAt: toDateOrNull(input.plannedEndAt),
        actualStartAt: toDateOrNull(input.actualStartAt),
        actualEndAt: toDateOrNull(input.actualEndAt),
        orderIndex: input.orderIndex ?? 0,
        notes: input.notes ?? null,
      },
    });

    return mapItem(item);
  },

  async updateItem(itemId, input) {
    const item = await prisma.projectFabricationItem.update({
      where: {id: itemId},
      data: {
        name: input.name,
        description: input.description,
        unit: input.unit,
        quantity: toDecimalOrNull(input.quantity),
        status: input.status,
        plannedStartAt: toDateOrNull(input.plannedStartAt),
        plannedEndAt: toDateOrNull(input.plannedEndAt),
        actualStartAt: toDateOrNull(input.actualStartAt),
        actualEndAt: toDateOrNull(input.actualEndAt),
        orderIndex: input.orderIndex,
        notes: input.notes,
      },
    });

    return mapItem(item);
  },

  async deleteItem(itemId) {
    await prisma.projectFabricationItem.delete({
      where: {id: itemId},
    });
  },

  async updateDerivedState(fabricationId: string) {
    return prisma.$transaction(async (tx) => {
      const fabrication = await tx.projectFabrication.findUnique({
        where: {id: fabricationId},
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

      if (!fabrication) {
        throw new Error("Project fabrication not found");
      }

      const progressPercent = calculateProgress(fabrication.items);
      const status = deriveStatus(fabrication.items);

      const hasStarted = fabrication.items.some((item) =>
        ["IN_PROGRESS", "PAUSED", "COMPLETED"].includes(item.status),
      );

      const allCompleted =
        fabrication.items.length > 0 &&
        fabrication.items.every((item) => item.status === "COMPLETED");

      const actualStartAt = hasStarted
        ? (fabrication.actualStartAt ?? new Date())
        : null;

      const actualEndAt = allCompleted
        ? (fabrication.actualEndAt ?? new Date())
        : null;

      const updated = await tx.projectFabrication.update({
        where: {id: fabricationId},
        data: {
          progressPercent,
          status,
          actualStartAt,
          actualEndAt,
        },
        include: {
          items: {
            orderBy: [{orderIndex: "asc"}, {createdAt: "asc"}],
          },
        },
      });

      const result: ProjectFabricationWithItems = {
        ...mapFabricationBase(updated),
        items: updated.items.map(mapItem),
      };

      return result;
    });
  },
};
