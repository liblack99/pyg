// app/infra/repos/quotation.prisma.repo.ts
import {prisma} from "@/app/lib/prisma";
import type {QuotationRepoPort} from "@/app/core/quotations/port/quotation.repo.port";
import {Prisma} from "@/app/generated/prisma/client";
import {calculateItemTotals as calculateQuotationItemTotals} from "@/app/lib/quotation-calculations";
import {moneyCOP} from "@/app/utils/moneyFormatted";
import {toNum} from "../../utils/toNumber";

import type {
  CreateQuotationInput,
  CreateQuotationResult,
  Quotation,
  InputDuplicateQuotation,
  OutputDuplicateQuotation,
  UpdateQuotationInput,
  UpdateQuotationResult,
  QuotationListQuery,
  PagedResult,
  QuotationListItem,
  QuotationDashboardGoal,
} from "@/app/core/quotations/dto";

import type {ExportExcelRow} from "@/app/core/quotations/excel/dto";

import {Client} from "@/app/core/clients/dto";

function buildQuotationSearchOR(s: string): Prisma.QuotationWhereInput["OR"] {
  const snapName: Prisma.JsonFilter = {
    path: ["name"],
    string_contains: s,
  };
  const snapDoc: Prisma.JsonFilter = {
    path: ["documentNumber"],
    string_contains: s,
  };

  return [
    {numberQuotation: {contains: s, mode: "insensitive"}},

    {client: {name: {contains: s, mode: "insensitive"}}},
    {client: {documentNumber: {contains: s, mode: "insensitive"}}},

    // Snapshot (JSON path)
    {clientSnapshot: snapName},
    {clientSnapshot: snapDoc},

    {projectReference: {contains: s, mode: "insensitive"}},
    {projectPresentation: {contains: s, mode: "insensitive"}},
    {reviewTitle: {contains: s, mode: "insensitive"}},
    {reviewDetails: {contains: s, mode: "insensitive"}},
  ];
}

function buildQuotationWhere(
  query: QuotationListQuery,
): Prisma.QuotationWhereInput {
  const where: Prisma.QuotationWhereInput = {};

  if (query.clientId) where.clientId = query.clientId;
  if (query.createdById) where.createdById = query.createdById;
  if (query.status) where.status = query.status;

  if (typeof query.hasClient === "boolean") {
    where.clientId = query.hasClient ? {not: null} : null;
  }

  const dateField = query.dateField ?? "createdAt";
  if (query.dateFrom || query.dateTo) {
    const range: Prisma.DateTimeFilter = {
      ...(query.dateFrom ? {gte: query.dateFrom} : {}),
      ...(query.dateTo ? {lte: query.dateTo} : {}),
    };

    where[dateField] = range;
  }

  if (query.totalMin != null || query.totalMax != null) {
    where.totalGeneral = {
      ...(query.totalMin != null
        ? {gte: new Prisma.Decimal(query.totalMin)}
        : {}),
      ...(query.totalMax != null
        ? {lte: new Prisma.Decimal(query.totalMax)}
        : {}),
    };
  }

  const s = query.search?.trim();
  if (s) {
    where.OR = buildQuotationSearchOR(s);
  } else if (query.numberQuotation?.trim()) {
    where.numberQuotation = {
      contains: query.numberQuotation.trim(),
      mode: "insensitive",
    };
  }

  if (query.reference?.trim()) {
    where.projectReferenceDetail = {
      contains: query.reference.trim(),
      mode: "insensitive", // para evitar problemas de mayúsculas
    };
  }

  return where;
}

export const quotationRepo: QuotationRepoPort = {
  async create(input: CreateQuotationInput): Promise<CreateQuotationResult> {
    return prisma.$transaction(async (tx) => {
      let clientId = input.clientId ?? null;

      if (!clientId) {
        const snap = input.clientSnapshot as unknown as Client;

        if (!snap?.name || !snap?.documentNumber) {
          throw new Error(
            "clientSnapshot incompleto: name y documentNumber son obligatorios si no hay clientId",
          );
        }

        const existing = await tx.client.findFirst({
          where: {documentNumber: snap.documentNumber},
          select: {id: true},
        });

        if (existing) {
          clientId = existing.id;
        } else {
          const created = await tx.client.create({
            data: {
              name: snap.name,
              documentType: snap.documentType ?? "",
              documentNumber: snap.documentNumber,
              email: snap.email ?? null,
              phone: snap.phone ?? null,
              address: snap.address ?? null,
              createdById: input.createdById,
            },
            select: {id: true},
          });
          clientId = created.id;
        }
      }

      // --- INICIO DE CÁLCULOS DE ITEMS ---
      let globalSubtotal = new Prisma.Decimal(0);
      let globalIva = new Prisma.Decimal(0);
      let globalTotal = new Prisma.Decimal(0);

      const itemsData = (input.items || []).map((item) => {
        const calcs = calculateQuotationItemTotals(
          item,
          input.projectReference || "",
        );

        // Sumamos a los totales globales de la cotización
        globalSubtotal = globalSubtotal.add(calcs.subTotalWithoutIva);
        globalIva = globalIva.add(calcs.ivaAmount);
        globalTotal = globalTotal.add(calcs.totalWithIva);

        return {
          productId: item.productId ?? null,
          productName: item.productName ?? null,
          code: item.code,
          description: item.description,
          unit: item.unit,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          adminPercent: item.adminPercent,
          utilPercent: item.utilPercent,
          imprPercent: item.imprPercent,
          ivaPercent: item.ivaPercent,
          // Nuevos campos calculados para el item
          unitPriceWithoutIva: calcs.unitPriceWithoutIva,
          subTotalWithoutIva: calcs.subTotalWithoutIva,
          ivaAmount: calcs.ivaAmount,
          totalWithIva: calcs.totalWithIva,
        };
      });
      // --- FIN DE CÁLCULOS DE ITEMS ---

      const q = await tx.quotation.create({
        data: {
          numberQuotation: input.numberQuotation,
          status: "DRAFT",
          createdById: input.createdById,
          date: input.date,
          validDays: input.validDays,
          clientId: clientId,
          clientSnapshot: input.clientSnapshot ?? Prisma.JsonNull,
          projectReference: input.projectReference,
          projectReferenceDetail: input.projectReferenceDetail,
          projectPresentation: input.projectPresentation,
          specialConditions: input.specialConditions,
          timeDelivery: input.timeDelivery,
          workLocation: input.workLocation,
          guarantees: input.guarantees,
          commercialCondition: input.commercialCondition,
          paymentMethod: input.paymentMethod,
          reviewTemplateId: input.reviewTemplateId,
          reviewTitle: input.reviewTitle,
          reviewDetails: input.reviewDetails,

          // ASIGNACIÓN DE TOTALES GLOBALES (Nuevos campos)
          subTotalWithoutIva: globalSubtotal,
          ivaTotal: globalIva,
          totalWithIva: globalTotal,
          totalGeneral: globalTotal,

          items: {
            create: itemsData,
          },

          terms: {
            create: input.terms?.map((term) => ({
              key: term.key ?? null,
              text: term.text,
              required: term.required ?? false,
              accepted: term.accepted ?? false,
              order: term.order ?? 0,
            })),
          },
        },
        select: {id: true, numberQuotation: true, status: true},
      });

      return {id: q.id, numberQuotation: q.numberQuotation, status: q.status};
    });
  },

  async listPaged(
    query: QuotationListQuery,
  ): Promise<PagedResult<QuotationListItem>> {
    const where = buildQuotationWhere(query);

    const take = Math.min(Math.max(query.limit ?? 20, 1), 50);

    const rows = await prisma.quotation.findMany({
      where,
      take: take + 1,
      ...(query.cursor ? {cursor: {id: query.cursor}, skip: 1} : {}),
      orderBy: [{createdAt: "desc"}, {id: "desc"}],
      select: {
        id: true,
        numberQuotation: true,
        status: true,
        date: true,
        validDays: true,
        createdAt: true,
        createdById: true,
        clientId: true,
        clientSnapshot: true,
        totalGeneral: true,
        note: true,
        projectReferenceDetail: true,
        projectReference: true,
        project: {
          select: {id: true, status: true},
        },
      },
    });

    const hasNext = rows.length > take;
    const pageRows = rows.slice(0, take);

    return {
      items: pageRows.map((r) => ({
        id: r.id,
        numberQuotation: r.numberQuotation,
        status: r.status,
        date: r.date,
        validDays: r.validDays,
        createdAt: r.createdAt,
        createdById: r.createdById,
        clientId: r.clientId,
        clientSnapshot: r.clientSnapshot,
        totalGeneral: toNum(r.totalGeneral),
        note: r.note ?? "",
        projectReference: r.projectReference,
        projectReferenceDetail: r.projectReferenceDetail ?? "",
        isProject: !!r.project,
        projectStatus: r.project?.status ?? null,
      })),
      nextCursor: hasNext ? rows[take].id : undefined,
    };
  },

  async findById(id: string): Promise<Quotation | null> {
    const q = await prisma.quotation.findUnique({
      where: {id},
      include: {
        items: true,
        terms: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!q) return null;

    return {
      id: q.id,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,

      numberQuotation: q.numberQuotation,
      status: q.status,

      sentAt: q.sentAt,
      approvedAt: q.approvedAt,
      rejectedAt: q.rejectedAt,
      expiredAt: q.expiredAt,
      cancelledAt: q.cancelledAt,

      date: q.date,
      validDays: q.validDays,
      createdBy: q.createdBy.name,

      createdById: q.createdById,

      clientId: q.clientId,
      clientSnapshot: (q.clientSnapshot ??
        Prisma.JsonNull) as Prisma.InputJsonValue,

      projectReference: q.projectReference,
      projectReferenceDetail: q.projectReferenceDetail ?? "",
      projectPresentation: q.projectPresentation,

      specialConditions: q.specialConditions,
      timeDelivery: q.timeDelivery,
      workLocation: q.workLocation,

      guarantees: q.guarantees,
      commercialCondition: q.commercialCondition,
      paymentMethod: q.paymentMethod,
      installationSystem: q.installationSystem,

      reviewTemplateId: q.reviewTemplateId,
      reviewTitle: q.reviewTitle,
      reviewDetails: q.reviewDetails,

      totalGeneral: toNum(q.totalGeneral),
      note: q.note,

      items: q.items.map((i) => ({
        id: i.id,
        quotationId: i.quotationId,
        productName: i.productName,
        productId: i.productId,

        code: i.code,
        description: i.description,
        unit: i.unit,

        quantity: toNum(i.quantity),
        unitPrice: toNum(i.unitPrice),

        adminPercent: toNum(i.adminPercent),
        utilPercent: toNum(i.utilPercent),
        imprPercent: toNum(i.imprPercent),
        ivaPercent: toNum(i.ivaPercent),

        createdAt: i.createdAt,
      })),

      terms: q.terms.map((t) => ({
        id: t.id,
        quotationId: t.quotationId,

        key: t.key,
        text: t.text,
        required: t.required,
        accepted: t.accepted,
        order: t.order,
      })),

      projectId: q.projectId,
      contractId: q.contractId,
    };
  },

  async listForReport(query: QuotationListQuery): Promise<ExportExcelRow[]> {
    const where = buildQuotationWhere(query);

    const take = Math.min(Math.max(query.limit ?? 5000, 1), 20000);

    const rows = await prisma.quotation.findMany({
      where,
      take,
      orderBy: [{createdAt: "desc"}, {id: "desc"}],
      select: {
        id: true,
        numberQuotation: true,
        status: true,
        date: true,
        validDays: true,
        createdAt: true,
        clientSnapshot: true,
        totalGeneral: true,
        projectReference: true,
        projectReferenceDetail: true,

        createdBy: {
          select: {
            name: true,
          },
        },
      },
    });

    return rows.map((q): ExportExcelRow => {
      const snap = q.clientSnapshot as unknown as Client;

      return {
        numberQuotation: q.numberQuotation,
        date: q.date,
        clientName: String(snap?.name ?? ""),
        clientDocumentType: snap.documentType,
        clientDocumentNumber: String(snap?.documentNumber ?? ""),
        clientContact: snap.contactName1 ?? "",
        clientContactNumber: snap.contactPhone1 ?? "",
        clientEmail: snap.email ?? "",
        projectReference: `${q.projectReference} ${q.projectReferenceDetail}`,
        location: snap.city ?? "",
        totalGeneral: q.totalGeneral.toNumber(),
        createdBy: q.createdBy.name,
        validDays: q.validDays,
        status: q.status,
      };
    });
  },

  async update(input: UpdateQuotationInput): Promise<UpdateQuotationResult> {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.quotation.findUnique({
        where: {id: input.id},
        select: {id: true, numberQuotation: true, status: true},
      });

      if (!existing) throw new Error("Quotation not found");
      if (existing.status !== "DRAFT") {
        throw new Error("Only DRAFT quotations can be edited");
      }

      if (input) {
        await tx.quotation.update({
          where: {id: input.id},
          data: {
            clientId:
              input?.clientId === undefined
                ? undefined
                : (input.clientId ?? null),

            clientSnapshot:
              input.clientSnapshot === undefined
                ? undefined
                : (input.clientSnapshot ?? Prisma.JsonNull),

            reviewTitle:
              input.reviewTitle === undefined
                ? undefined
                : (input.reviewTitle ?? null),

            reviewDetails:
              input.reviewDetails === undefined
                ? undefined
                : (input.reviewDetails ?? null),

            projectReference:
              input.projectReference === undefined
                ? undefined
                : input.projectReference,

            projectPresentation:
              input.projectPresentation === undefined
                ? undefined
                : input.projectPresentation,

            specialConditions:
              input.specialConditions === undefined
                ? undefined
                : (input.specialConditions ?? null),

            timeDelivery:
              input.timeDelivery === undefined
                ? undefined
                : (input.timeDelivery ?? null),

            workLocation:
              input.workLocation === undefined
                ? undefined
                : (input.workLocation ?? null),

            guarantees:
              input.guarantees === undefined
                ? undefined
                : (input.guarantees ?? null),

            commercialCondition:
              input.commercialCondition === undefined
                ? undefined
                : (input.commercialCondition ?? null),

            paymentMethod:
              input.paymentMethod === undefined
                ? undefined
                : (input.paymentMethod ?? null),

            validDays:
              input.validDays === undefined ? undefined : input.validDays,

            date: input.date === undefined ? undefined : input.date,
            totalGeneral:
              input.totalGeneral === undefined ? undefined : input.totalGeneral,
          },
        });
      }

      if (input.items) {
        await tx.quotationItem.deleteMany({where: {quotationId: input.id}});

        if (input.items.length) {
          await tx.quotationItem.createMany({
            data: input.items.map((i) => ({
              quotationId: input.id,
              productName: i.productName,
              productId: i.productId ?? null,
              code: i.code ?? undefined,
              description: i.description,
              unit: i.unit,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
              adminPercent: i.adminPercent,
              utilPercent: i.utilPercent,
              imprPercent: i.imprPercent,
              ivaPercent: i.ivaPercent,
            })),
          });
        }
      }
      if (input.terms) {
        await tx.quotationTerm.deleteMany({where: {quotationId: input.id}});

        if (input.terms.length) {
          await tx.quotationTerm.createMany({
            data: input.terms.map((t) => ({
              quotationId: input.id,
              key: t.key ?? null,
              text: t.text ?? "",
              required: t.required ?? false,
              accepted: t.accepted ?? false,
              order: t.order ?? 0,
            })),
          });
        }
      }

      const updated = await tx.quotation.findUnique({
        where: {id: input.id},
        select: {
          id: true,
          numberQuotation: true,
          status: true,
          updatedAt: true,
        },
      });

      if (!updated) throw new Error("Quotation not found after update");

      return {
        id: updated.id,
        numberQuotation: updated.numberQuotation,
        status: updated.status,
        updatedAt: updated.updatedAt,
      };
    });
  },

  async send(id: string, sentById: string) {
    // sentById reservado para auditoría futura
    return prisma.quotation.update({
      where: {id},
      data: {status: "SENT", sentAt: new Date()},
      select: {id: true, status: true},
    });
  },

  async approve(id: string) {
    return prisma.quotation.update({
      where: {id},
      data: {status: "APPROVED", approvedAt: new Date()},
      select: {id: true, status: true},
    });
  },

  async reject(id: string) {
    return prisma.quotation.update({
      where: {id},
      data: {status: "REJECTED", rejectedAt: new Date()},
      select: {id: true, status: true},
    });
  },

  async deleteDraft(id: string) {
    return prisma.$transaction(async (tx) => {
      const q = await tx.quotation.findUnique({
        where: {id},
        select: {status: true},
      });

      if (!q) throw new Error("Quotation not found");
      if (q.status !== "DRAFT") {
        throw new Error("Only DRAFT quotations can be deleted");
      }

      await tx.quotationItem.deleteMany({where: {quotationId: id}});
      await tx.quotationTerm.deleteMany({where: {quotationId: id}});
      await tx.quotation.delete({where: {id}});

      return {id};
    });
  },

  async cancel(id: string) {
    return prisma.quotation.update({
      where: {id},
      data: {status: "CANCELLED", cancelledAt: new Date()},
      select: {id: true, status: true},
    });
  },

  async duplicate(
    input: InputDuplicateQuotation,
  ): Promise<OutputDuplicateQuotation> {
    const resetAccepted = input.resetTermAccepted ?? true;

    return prisma.$transaction(async (tx) => {
      const src = await tx.quotation.findUnique({
        where: {id: input.sourceId},
        include: {items: true, terms: true},
      });

      if (!src) throw new Error("Quotation not found");

      let globalSubtotal = new Prisma.Decimal(0);
      let globalIva = new Prisma.Decimal(0);
      let globalTotal = new Prisma.Decimal(0);

      const duplicatedItems = src.items.map((it) => {
        const calcs = calculateQuotationItemTotals(
          {
            quantity: toNum(it.quantity),
            unitPrice: toNum(it.unitPrice),
            adminPercent: toNum(it.adminPercent),
            imprPercent: toNum(it.imprPercent),
            utilPercent: toNum(it.utilPercent),
            ivaPercent: toNum(it.ivaPercent),
          },
          src.projectReference || "",
        );

        globalSubtotal = globalSubtotal.add(calcs.subTotalWithoutIva);
        globalIva = globalIva.add(calcs.ivaAmount);
        globalTotal = globalTotal.add(calcs.totalWithIva);

        return {
          productId: it.productId ?? null,
          productName: it.productName ?? null,
          code: it.code,
          description: it.description,
          unit: it.unit,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          adminPercent: it.adminPercent,
          utilPercent: it.utilPercent,
          imprPercent: it.imprPercent,
          ivaPercent: it.ivaPercent,
          unitPriceWithoutIva: calcs.unitPriceWithoutIva,
          subTotalWithoutIva: calcs.subTotalWithoutIva,
          ivaAmount: calcs.ivaAmount,
          totalWithIva: calcs.totalWithIva,
        };
      });

      const created = await tx.quotation.create({
        data: {
          // 🔒 sistema
          numberQuotation: input.newNumberQuotation,
          status: "DRAFT",
          createdById: input.createdById,

          // reset de flujo
          sentAt: null,
          approvedAt: null,
          rejectedAt: null,
          expiredAt: null,
          cancelledAt: null,

          // editable copiado
          date: new Date(),
          validDays: src.validDays,

          clientId: src.clientId ?? null,
          clientSnapshot: src.clientSnapshot ?? Prisma.JsonNull,

          projectReference: src.projectReference,
          projectReferenceDetail: src.projectReferenceDetail,
          projectPresentation: src.projectPresentation,

          specialConditions: src.specialConditions,
          timeDelivery: src.timeDelivery,
          workLocation: src.workLocation,

          guarantees: src.guarantees,
          commercialCondition: src.commercialCondition,
          paymentMethod: src.paymentMethod,

          reviewTemplateId: src.reviewTemplateId ?? null,
          reviewTitle: src.reviewTitle,
          reviewDetails: src.reviewDetails,

          // total: copiar tal cual (tu decisión actual)
          subTotalWithoutIva: globalSubtotal,
          ivaTotal: globalIva,
          totalWithIva: globalTotal,
          totalGeneral: globalTotal,

          items: {
            create: duplicatedItems,
          },

          terms: {
            create: src.terms.map((t) => ({
              key: t.key ?? null,
              text: t.text,
              required: t.required,
              accepted: resetAccepted ? false : t.accepted,
              order: t.order,
            })),
          },
        },
        select: {id: true, numberQuotation: true, status: true},
      });

      return {
        id: created.id,
        numberQuotation: created.numberQuotation,
        status: created.status,
      };
    });
  },
  async addNote(id: string, note: string): Promise<string> {
    const q = await prisma.quotation.update({
      where: {id},
      data: {note},
      select: {
        numberQuotation: true,
      },
    });

    const response = `Nota agregada a la cotización ${q.numberQuotation} correctamente`;

    return response;
  },

  async getQuotationDashboard() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      dashboardGoal,
      counts,
      processValue,
      rateData,
      monthlyGrowth,
      avgResponseData,
      yearlyResult,
      monthlyResult,
      advisorsResult,
    ] = await Promise.all([
      prisma.quotationDashboardGoal.upsert({
        where: {id: 1},
        create: {
          id: 1,
          monthlySalesGoal: 50000000,
        },
        update: {},
        select: {
          monthlySalesGoal: true,
        },
      }),

      prisma.quotation.groupBy({
        by: ["status"],
        _count: {_all: true},
      }),

      prisma.quotation.aggregate({
        where: {status: "SENT"},
        _sum: {totalGeneral: true},
      }),

      prisma.$queryRaw<ApprovalRateQueryResult[]>`
      WITH stats AS (
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          COUNT(*) FILTER (WHERE status = 'APPROVED')::FLOAT as approved,
          COUNT(*) FILTER (WHERE status IN ('APPROVED', 'REJECTED', 'EXPIRED'))::FLOAT as closed
        FROM "Quotation"
        GROUP BY 1
      ),
      metrics AS (
        SELECT 
          month,
          (approved / NULLIF(closed, 0)) * 100 as rate,
          LAG((approved / NULLIF(closed, 0)) * 100) OVER (ORDER BY month) as prev_rate
        FROM stats
      )
      SELECT rate, prev_rate FROM metrics ORDER BY month DESC LIMIT 1
    `,

      prisma.quotation.count({
        where: {
          createdAt: {gte: currentMonthStart},
        },
      }),

      prisma.$queryRaw<AvgResponseQueryResult[]>`
      SELECT 
        AVG(EXTRACT(EPOCH FROM (COALESCE("approvedAt", "rejectedAt") - "sentAt")) / 86400) as avg_days
      FROM "Quotation"
      WHERE "sentAt" IS NOT NULL 
      AND ("approvedAt" IS NOT NULL OR "rejectedAt" IS NOT NULL)
    `,
      // 5. Venta del año actual (Cotizaciones aprobadas en el año)
      prisma.$queryRaw<{total: number}[]>`
          SELECT SUM("totalGeneral")::FLOAT as total 
          FROM "Quotation" 
          WHERE status = 'APPROVED' 
          AND EXTRACT(YEAR FROM "date") = ${currentYear}`,

      // 6. Venta del mes actual
      prisma.$queryRaw<{total: number}[]>`
          SELECT SUM("totalGeneral")::FLOAT as total 
          FROM "Quotation" 
          WHERE status = 'APPROVED' 
          AND EXTRACT(MONTH FROM "date") = ${currentMonth}
          AND EXTRACT(YEAR FROM "date") = ${currentYear}`,

      // 7. Ranking por numero de cotizaciones
      prisma.$queryRaw<{id: string; name: string; count: number}[]>`
          SELECT u.id, u.name, COUNT(q.id)::INT as count
          FROM "Quotation" q
          JOIN "User" u ON q."createdById" = u.id
          WHERE q.status IN ('APPROVED', 'SENT', 'DRAFT')
          GROUP BY u.id, u.name
          ORDER BY count DESC
          LIMIT 5`,
    ]);

    const getStatusCount = (s: string) =>
      counts.find((c) => c.status === s)?._count._all || 0;

    const currentRate = rateData[0]?.rate || 0;
    const previousRate = rateData[0]?.prev_rate || 0;
    const rateDiff = Math.round(currentRate - previousRate);
    const monthlyGoal = Number(dashboardGoal.monthlySalesGoal ?? 0);

    const rawTotalValue = Number(processValue._sum.totalGeneral || 0);

    const yTotal = yearlyResult[0]?.total ?? 0;
    const mTotal = monthlyResult[0]?.total ?? 0;
    const compliancePct =
      monthlyGoal > 0 ? Math.round((mTotal / monthlyGoal) * 100) : 0;

    return {
      activeQuotations: {
        total: getStatusCount("DRAFT") + getStatusCount("SENT"),
        subtext: `+${monthlyGrowth} este mes`,
      },
      approvalRate: {
        percentage: `${Math.round(currentRate)}%`,
        subtext: `${rateDiff >= 0 ? "+" : ""}${rateDiff}% vs anterior`,
        isPositive: rateDiff >= 0,
      },
      valueInProcess: {
        total: rawTotalValue,
        formatted:
          rawTotalValue >= 1_000_000_000
            ? `$${(rawTotalValue / 1_000_000_000).toFixed(1)}B`
            : `$${(rawTotalValue / 1_000_000).toFixed(1)}M`,
      },
      averageResponse: {
        value: avgResponseData[0]?.avg_days
          ? parseFloat(
              avgResponseData[0].avg_days as unknown as string,
            ).toFixed(1)
          : "0",
        label: "días",
      },
      statusDetails: {
        DRAFT: getStatusCount("DRAFT"),
        SENT: getStatusCount("SENT"),
        APPROVED: getStatusCount("APPROVED"),
        REJECTED: getStatusCount("REJECTED"),
        CANCELLED: getStatusCount("CANCELLED"),
        EXPIRED: getStatusCount("EXPIRED"),
      },
      yearlySales: {
        amount: yTotal,
        formatted: moneyCOP(yTotal), // Asegúrate de tener moneyCOP accesible
      },
      monthlySales: {
        amount: mTotal,
        formatted: moneyCOP(mTotal),
      },
      goalCompliance: {
        percentage: compliancePct,
        current: mTotal,
        target: monthlyGoal,
      },
      advisorsRank: advisorsResult.map((adv) => ({
        id: adv.id,
        name: adv.name,
        count: Number(adv.count ?? 0),
      })),
    };
  },

  async getQuotationDashboardGoal(): Promise<QuotationDashboardGoal> {
    const goal = await prisma.quotationDashboardGoal.upsert({
      where: {id: 1},
      create: {
        id: 1,
        monthlySalesGoal: 50000000,
      },
      update: {},
      select: {
        monthlySalesGoal: true,
      },
    });

    return {
      monthlySalesGoal: Number(goal.monthlySalesGoal ?? 0),
    };
  },

  async updateQuotationDashboardGoal(
    input: QuotationDashboardGoal,
  ): Promise<QuotationDashboardGoal> {
    const goal = await prisma.quotationDashboardGoal.upsert({
      where: {id: 1},
      create: {
        id: 1,
        monthlySalesGoal: input.monthlySalesGoal,
      },
      update: {
        monthlySalesGoal: input.monthlySalesGoal,
      },
      select: {
        monthlySalesGoal: true,
      },
    });

    return {
      monthlySalesGoal: Number(goal.monthlySalesGoal ?? 0),
    };
  },
};

interface ApprovalRateQueryResult {
  rate: number | null;
  prev_rate: number | null;
}

interface AvgResponseQueryResult {
  avg_days: number | null;
}
