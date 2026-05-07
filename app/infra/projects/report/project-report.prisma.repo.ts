import {prisma} from "@/app/lib/prisma";
import type {ProjectReportRepoPort} from "@/app/core/projects/report/port/project-report.repo.port";

export const projectReportPrismaRepo: ProjectReportRepoPort = {
  async findProjectReportRecord(projectId) {
    return prisma.project.findUnique({
      where: {id: projectId},
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
        warrantyStatus: true,
        warrantyStartsAt: true,
        warrantyEndsAt: true,
        warrantyMonths: true,
        warrantyTerms: true,
        warrantyCostTotal: true,
        warrantyCasesCount: true,
        openWarrantyCasesCount: true,
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
        budgetItems: {
          orderBy: [{createdAt: "asc"}, {id: "asc"}],
          select: {
            id: true,
            description: true,
            quantity: true,
            supplierNameSnapshot: true,
            unitCost: true,
            totalCost: true,
            procurementStatus: true,
            orderedAt: true,
            receivedAt: true,
          },
        },
        fabrication: {
          select: {
            status: true,
            plannedStartAt: true,
            plannedEndAt: true,
            actualStartAt: true,
            actualEndAt: true,
            progressPercent: true,
            notes: true,
            items: {
              orderBy: [{orderIndex: "asc"}, {createdAt: "asc"}],
              select: {
                id: true,
                name: true,
                unit: true,
                quantity: true,
                status: true,
                plannedStartAt: true,
                plannedEndAt: true,
              },
            },
          },
        },
        documents: {
          orderBy: [{type: "asc"}, {createdAt: "desc"}],
          select: {
            id: true,
            type: true,
            source: true,
            status: true,
            title: true,
            storageUrl: true,
          },
        },
        warrantyCases: {
          take: 20,
          orderBy: [{createdAt: "desc"}, {id: "desc"}],
          select: {
            id: true,
            type: true,
            status: true,
            responsibility: true,
            title: true,
            estimatedCost: true,
            realCost: true,
          },
        },
        alerts: {
          take: 10,
          orderBy: [{createdAt: "desc"}, {id: "desc"}],
          select: {
            id: true,
            type: true,
            module: true,
            severity: true,
            status: true,
            title: true,
            description: true,
            createdAt: true,
          },
        },
        events: {
          take: 10,
          orderBy: [{createdAt: "desc"}, {id: "desc"}],
          select: {
            id: true,
            type: true,
            module: true,
            title: true,
            description: true,
            createdAt: true,
          },
        },
      },
    });
  },
};
