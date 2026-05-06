import {prisma} from "@/app/lib/prisma";
import {ClientRepoPort} from "@/app/core/clients/port/client.repo.port";

import type {
  CreateClientInput,
  CreateClientResult,
  UpdateClientResult,
  ClientListItem,
  UpdateClientInput,
  ClientDashboardStats,
  GrowthResult,
} from "@/app/core/clients/dto";

const clientSelect = {
  id: true,
  name: true,
  documentType: true,
  documentNumber: true,
  email: true,
  phone: true,
  city: true,
  address: true,
  department: true,
  createdById: true,
  contactName1: true,
  contactRole1: true,
  contactPhone1: true,
  contactName2: true,
  contactRole2: true,
  contactPhone2: true,
  createdAt: true,
  updatedAt: true,
} as const;

function makeWhere(search?: string) {
  const term = search?.trim();
  if (!term) return undefined;

  return {
    OR: [
      {name: {contains: term, mode: "insensitive" as const}},
      {documentNumber: {contains: term}},
    ],
  };
}

export const clientRepo: ClientRepoPort = {
  async listPaged({search, limit = 20, cursor}) {
    const take = Math.min(Math.max(limit, 1), 50);

    const rows = await prisma.client.findMany({
      where: makeWhere(search),

      select: clientSelect,
      orderBy: [{createdAt: "desc"}, {id: "desc"}],
      take: take + 1,
      ...(cursor
        ? {
            cursor: {id: cursor},
            skip: 1,
          }
        : {}),
    });

    const hasMore = rows.length > take;
    const items = rows.slice(0, take);

    return {
      items,
      nextCursor: hasMore ? items[items.length - 1].id : null,
    };
  },

  async findById(id: string): Promise<ClientListItem | null> {
    const q = prisma.client.findUnique({
      where: {id},
      select: {
        id: true,
        name: true,
        documentType: true,
        documentNumber: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        department: true,
        contactName1: true,
        contactRole1: true,
        contactPhone1: true,
        contactName2: true,
        contactRole2: true,
        contactPhone2: true,
        createdById: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return q;
  },

  async create(input: CreateClientInput): Promise<CreateClientResult> {
    const q = prisma.client.create({
      data: {
        name: input.name,
        documentType: input.documentType,
        documentNumber: input.documentNumber,
        email: input.email,
        phone: input.phone,
        address: input.address,
        city: input.city,
        department: input.department,
        contactName1: input.contactName1,
        contactRole1: input.contactRole1,
        contactPhone1: input.contactPhone1,
        contactName2: input.contactName2,
        contactRole2: input.contactRole2,
        contactPhone2: input.contactPhone2,
        createdById: input.createdById,
      },
      select: {
        id: true,
        name: true,
        documentType: true,
        documentNumber: true,
      },
    });
    return q;
  },

  async update(
    id: string,
    input: UpdateClientInput,
  ): Promise<UpdateClientResult> {
    const q = prisma.client.update({
      where: {id},
      data: {
        // PATCH: si viene undefined, Prisma no lo toca
        name: input.name,
        documentType: input.documentType,
        documentNumber: input.documentNumber,

        email: input.email,
        phone: input.phone,
        address: input.address,
        city: input.city,
        department: input.department,

        contactName1: input.contactName1,
        contactRole1: input.contactRole1,
        contactPhone1: input.contactPhone1,

        contactName2: input.contactName2,
        contactRole2: input.contactRole2,
        contactPhone2: input.contactPhone2,
      },
      select: {
        name: true,
      },
    });
    return q;
  },

  async delete(id) {
    await prisma.client.delete({where: {id}});
  },
  async getClientMetrics(): Promise<ClientDashboardStats> {
    const [totalGrowth, activeGrowth, revenueGrowth, projectGrowth] =
      await Promise.all([
        // 1. Total Clientes: Comparativa de registros en tabla Client
        prisma.$queryRaw<GrowthResult[]>`
      WITH monthly AS (
        SELECT DATE_TRUNC('month', "createdAt") as month, COUNT(id)::FLOAT as total
        FROM "Client" GROUP BY 1
      )
      SELECT total as current, LAG(total) OVER (ORDER BY month) as previous 
      FROM monthly ORDER BY month DESC LIMIT 1`,

        // 2. Clientes Activos: Clientes con al menos un proyecto en estado 'ACTIVE'
        prisma.$queryRaw<GrowthResult[]>`
      WITH monthly AS (
        SELECT DATE_TRUNC('month', p."createdAt") as month, COUNT(DISTINCT q."clientId")::FLOAT as total
        FROM "Project" p
        JOIN "Quotation" q ON p."quotationId" = q.id
        WHERE p.status = 'ACTIVE'
        GROUP BY 1
      )
      SELECT total as current, LAG(total) OVER (ORDER BY month) as previous 
      FROM monthly ORDER BY month DESC LIMIT 1`,

        // 3. Ingresos Totales: Suma de totalQuotationSinIVA de todos los Proyectos
        prisma.$queryRaw<GrowthResult[]>`
      WITH monthly AS (
        SELECT DATE_TRUNC('month', "createdAt") as month, SUM("totalQuotationSinIVA")::FLOAT as total
        FROM "Project"
        GROUP BY 1
      )
      SELECT total as current, LAG(total) OVER (ORDER BY month) as previous 
      FROM monthly ORDER BY month DESC LIMIT 1`,

        // 4. Proyectos Activos: Conteo de proyectos con status 'ACTIVE'
        prisma.$queryRaw<GrowthResult[]>`
      WITH monthly AS (
        SELECT DATE_TRUNC('month', "createdAt") as month, COUNT(id)::FLOAT as total
        FROM "Project"
        WHERE status = 'ACTIVE'
        GROUP BY 1
      )
      SELECT total as current, LAG(total) OVER (ORDER BY month) as previous 
      FROM monthly ORDER BY month DESC LIMIT 1`,
      ]);

    const formatGrowth = (data: GrowthResult[]) => {
      const current = Number(data[0]?.current ?? 0);
      const previous = Number(data[0]?.previous ?? 0);
      if (previous === 0)
        return {current, diff: 0, text: "+0% vs mes anterior", pos: true};
      const diff = Math.round(((current - previous) / previous) * 100);
      return {
        current,
        diff,
        text: `${diff >= 0 ? "+" : ""}${diff}% vs mes anterior`,
        pos: diff >= 0,
      };
    };

    const tg = formatGrowth(totalGrowth);
    const ag = formatGrowth(activeGrowth);
    const rg = formatGrowth(revenueGrowth);
    const pg = formatGrowth(projectGrowth);

    return {
      totalClients: {count: tg.current, subtext: tg.text, isPositive: tg.pos},
      activeClients: {count: ag.current, subtext: ag.text, isPositive: ag.pos},
      totalRevenue: {
        amount: rg.current,
        formatted:
          rg.current >= 1000000
            ? `$${(rg.current / 1000000).toFixed(2)}M`
            : `$${rg.current.toLocaleString()}`,
        subtext: rg.text,
        isPositive: rg.pos,
      },
      activeProjects: {count: pg.current, subtext: pg.text, isPositive: pg.pos},
    };
  },
};
