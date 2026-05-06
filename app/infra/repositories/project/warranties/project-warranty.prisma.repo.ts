import {Prisma} from "@/app/generated/prisma/client";
import {prisma} from "@/app/lib/prisma";

import type {ProjectWarrantyRepoPort} from "@/app/core/projects/warranties/port/project-warranty.repo.port";
import type {
  ProjectWarrantySummary,
  ProjectWarrantyCaseView,
  ProjectWarrantyCaseListQuery,
  ProjectWarrantyCaseListResult,
  CreateProjectWarrantyCaseInput,
  UpdateProjectWarrantyCaseInput,
  UpdateProjectWarrantySummaryInput,
} from "@/app/core/projects/warranties/dto";

const WARRANTY_CASE_INCLUDE = {
  supplier: {
    select: {
      id: true,
      name: true,
    },
  },
  reportedByUser: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};

type WarrantyCaseWithRelations = Prisma.ProjectWarrantyCaseGetPayload<{
  include: typeof WARRANTY_CASE_INCLUDE;
}>;

function mapSummary(project: {
  warrantyStatus: ProjectWarrantySummary["status"];
  warrantyStartsAt: Date | null;
  warrantyEndsAt: Date | null;
  warrantyMonths: number | null;
  warrantyTerms: string | null;
  warrantyNotes: string | null;
  warrantyCostTotal: Prisma.Decimal;
  warrantyCasesCount: number;
  openWarrantyCasesCount: number;
}): ProjectWarrantySummary {
  return {
    status: project.warrantyStatus,
    startsAt: project.warrantyStartsAt ?? null,
    endsAt: project.warrantyEndsAt ?? null,
    months: project.warrantyMonths,
    terms: project.warrantyTerms,
    notes: project.warrantyNotes,
    costTotal: project.warrantyCostTotal.toNumber(),
    casesCount: project.warrantyCasesCount,
    openCasesCount: project.openWarrantyCasesCount,
  };
}

function mapCase(item: WarrantyCaseWithRelations): ProjectWarrantyCaseView {
  return {
    id: item.id,
    projectId: item.projectId,
    type: item.type,
    status: item.status,
    responsibility: item.responsibility,
    title: item.title,
    description: item.description,
    reportedAt: item.reportedAt,
    detectedAt: item.detectedAt ? item.detectedAt : null,
    startedAt: item.startedAt ? item.startedAt : null,
    resolvedAt: item.resolvedAt ? item.resolvedAt : null,
    estimatedCost: item.estimatedCost.toNumber(),
    realCost: item.realCost.toNumber(),
    supplierId: item.supplierId,
    supplierName: item.supplier?.name ?? null,
    reportedByUserId: item.reportedByUserId,
    reportedByUserName:
      item.reportedByUser?.name ?? item.reportedByUser?.email ?? null,
    resolutionNotes: item.resolutionNotes,
    internalNotes: item.internalNotes,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export const projectWarrantyPrismaRepo: ProjectWarrantyRepoPort = {
  async getSummary(projectId) {
    const project = await prisma.project.findUnique({
      where: {id: projectId},
      select: {
        warrantyStatus: true,
        warrantyStartsAt: true,
        warrantyEndsAt: true,
        warrantyMonths: true,
        warrantyTerms: true,
        warrantyNotes: true,
        warrantyCostTotal: true,
        warrantyCasesCount: true,
        openWarrantyCasesCount: true,
      },
    });

    if (!project) {
      throw new Error("Proyecto no encontrado.");
    }

    return mapSummary(project);
  },

  async updateSummary(projectId, input: UpdateProjectWarrantySummaryInput) {
    const project = await prisma.project.update({
      where: {id: projectId},
      data: {
        warrantyStatus: input.status,
        warrantyStartsAt:
          input.startsAt === undefined
            ? undefined
            : input.startsAt
              ? new Date(input.startsAt)
              : null,
        warrantyEndsAt:
          input.endsAt === undefined
            ? undefined
            : input.endsAt
              ? new Date(input.endsAt)
              : null,
        warrantyMonths: input.months,
        warrantyTerms: input.terms,
        warrantyNotes: input.notes,
      },
      select: {
        warrantyStatus: true,
        warrantyStartsAt: true,
        warrantyEndsAt: true,
        warrantyMonths: true,
        warrantyTerms: true,
        warrantyNotes: true,
        warrantyCostTotal: true,
        warrantyCasesCount: true,
        openWarrantyCasesCount: true,
      },
    });

    return mapSummary(project);
  },

  async listCases(
    query: ProjectWarrantyCaseListQuery,
  ): Promise<ProjectWarrantyCaseListResult> {
    const limit = Math.min(Math.max(query.limit ?? 10, 1), 100);

    let cursorWhere: Prisma.ProjectWarrantyCaseWhereInput | undefined;

    if (query.cursor) {
      const cursorCase = await prisma.projectWarrantyCase.findUnique({
        where: {id: query.cursor},
        select: {
          id: true,
          createdAt: true,
        },
      });

      if (cursorCase) {
        cursorWhere = {
          OR: [
            {createdAt: {lt: cursorCase.createdAt}},
            {
              AND: [
                {createdAt: cursorCase.createdAt},
                {id: {lt: cursorCase.id}},
              ],
            },
          ],
        };
      }
    }

    const where: Prisma.ProjectWarrantyCaseWhereInput = {
      projectId: query.projectId,
      ...(query.search
        ? {
            OR: [
              {title: {contains: query.search, mode: "insensitive"}},
              {description: {contains: query.search, mode: "insensitive"}},
              {resolutionNotes: {contains: query.search, mode: "insensitive"}},
              {internalNotes: {contains: query.search, mode: "insensitive"}},
            ],
          }
        : {}),
      ...(query.type ? {type: query.type} : {}),
      ...(query.status ? {status: query.status} : {}),
      ...(query.responsibility ? {responsibility: query.responsibility} : {}),
      ...(query.reportedFrom || query.reportedTo
        ? {
            reportedAt: {
              ...(query.reportedFrom
                ? {gte: new Date(query.reportedFrom)}
                : {}),
              ...(query.reportedTo ? {lte: new Date(query.reportedTo)} : {}),
            },
          }
        : {}),
      ...(query.resolvedFrom || query.resolvedTo
        ? {
            resolvedAt: {
              ...(query.resolvedFrom
                ? {gte: new Date(query.resolvedFrom)}
                : {}),
              ...(query.resolvedTo ? {lte: new Date(query.resolvedTo)} : {}),
            },
          }
        : {}),
      ...(cursorWhere ?? {}),
    };

    const rows = await prisma.projectWarrantyCase.findMany({
      where,
      include: WARRANTY_CASE_INCLUDE,
      orderBy: [{createdAt: "desc"}, {id: "desc"}],
      take: limit + 1,
    });

    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor = hasMore ? (items[items.length - 1]?.id ?? null) : null;

    return {
      items: items.map(mapCase),
      nextCursor,
    };
  },

  async getCaseById(caseId) {
    const item = await prisma.projectWarrantyCase.findUnique({
      where: {id: caseId},
      include: WARRANTY_CASE_INCLUDE,
    });

    return item ? mapCase(item) : null;
  },

  async createCase(projectId, input: CreateProjectWarrantyCaseInput) {
    const item = await prisma.projectWarrantyCase.create({
      data: {
        projectId,
        type: input.type,
        status: input.status ?? "OPEN",
        responsibility: input.responsibility ?? "UNDEFINED",
        title: input.title,
        description: input.description ?? null,
        reportedAt: new Date(input.reportedAt),
        detectedAt: input.detectedAt
          ? new Date(input.detectedAt)
          : input.detectedAt === null
            ? null
            : undefined,
        startedAt: input.startedAt
          ? new Date(input.startedAt)
          : input.startedAt === null
            ? null
            : undefined,
        resolvedAt: input.resolvedAt
          ? new Date(input.resolvedAt)
          : input.resolvedAt === null
            ? null
            : undefined,
        estimatedCost:
          input.estimatedCost !== undefined
            ? new Prisma.Decimal(input.estimatedCost)
            : new Prisma.Decimal(0),
        realCost:
          input.realCost !== undefined
            ? new Prisma.Decimal(input.realCost)
            : new Prisma.Decimal(0),
        supplierId: input.supplierId ?? null,
        reportedByUserId: input.reportedByUserId ?? null,
        resolutionNotes: input.resolutionNotes ?? null,
        internalNotes: input.internalNotes ?? null,
      },
      include: WARRANTY_CASE_INCLUDE,
    });

    return mapCase(item);
  },

  async updateCase(caseId, input: UpdateProjectWarrantyCaseInput) {
    const item = await prisma.projectWarrantyCase.update({
      where: {id: caseId},
      data: {
        ...(input.type !== undefined ? {type: input.type} : {}),
        ...(input.status !== undefined ? {status: input.status} : {}),
        ...(input.responsibility !== undefined
          ? {responsibility: input.responsibility}
          : {}),
        ...(input.title !== undefined ? {title: input.title} : {}),
        ...(input.description !== undefined
          ? {description: input.description}
          : {}),
        ...(input.reportedAt !== undefined
          ? {reportedAt: new Date(input.reportedAt)}
          : {}),
        ...(input.detectedAt !== undefined
          ? {
              detectedAt: input.detectedAt ? new Date(input.detectedAt) : null,
            }
          : {}),
        ...(input.startedAt !== undefined
          ? {
              startedAt: input.startedAt ? new Date(input.startedAt) : null,
            }
          : {}),
        ...(input.resolvedAt !== undefined
          ? {
              resolvedAt: input.resolvedAt ? new Date(input.resolvedAt) : null,
            }
          : {}),
        ...(input.estimatedCost !== undefined
          ? {estimatedCost: new Prisma.Decimal(input.estimatedCost)}
          : {}),
        ...(input.realCost !== undefined
          ? {realCost: new Prisma.Decimal(input.realCost)}
          : {}),
        ...(input.supplierId !== undefined
          ? {supplierId: input.supplierId}
          : {}),
        ...(input.reportedByUserId !== undefined
          ? {reportedByUserId: input.reportedByUserId}
          : {}),
        ...(input.resolutionNotes !== undefined
          ? {resolutionNotes: input.resolutionNotes}
          : {}),
        ...(input.internalNotes !== undefined
          ? {internalNotes: input.internalNotes}
          : {}),
      },
      include: WARRANTY_CASE_INCLUDE,
    });

    return mapCase(item);
  },

  async recalculateProjectWarrantyMetrics(projectId) {
    const [aggregate, openCount] = await prisma.$transaction([
      prisma.projectWarrantyCase.aggregate({
        where: {projectId},
        _sum: {
          realCost: true,
        },
        _count: {
          _all: true,
        },
      }),
      prisma.projectWarrantyCase.count({
        where: {
          projectId,
          status: {
            in: ["OPEN", "IN_PROGRESS"],
          },
        },
      }),
    ]);

    await prisma.project.update({
      where: {id: projectId},
      data: {
        warrantyCostTotal: aggregate._sum.realCost ?? new Prisma.Decimal(0),
        warrantyCasesCount: aggregate._count._all,
        openWarrantyCasesCount: openCount,
      },
    });
  },
};
