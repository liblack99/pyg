import {prisma} from "@/app/lib/prisma";

import {
  CreateProductInput,
  UpdateProductInput,
  TopProductQueryResult,
  ProductMetricsQueryResult,
} from "@/app/core/products/dto";
import {ProductRepoPort} from "@/app/core/products/port/product.repo.port";

export function makeWhere(search?: string) {
  if (!search) return undefined;
  const s = search.trim();
  if (!s) return undefined;

  return {
    OR: [
      {name: {contains: s, mode: "insensitive" as const}},
      {code: {contains: s, mode: "insensitive" as const}},
    ],
  };
}

export const productRepo: ProductRepoPort = {
  async listPaged({search, limit = 20, cursor}) {
    const take = Math.min(Math.max(limit, 1), 50);

    const rows = await prisma.product.findMany({
      where: makeWhere(search),
      select: {
        id: true,
        name: true,
        code: true,
        unitPrice: true,
        imageUrl: true,
        description: true,
      },
      orderBy: [{createdAt: "desc"}, {id: "desc"}],
      take: take + 1,
      ...(cursor ? {cursor: {id: cursor}, skip: 1} : {}),
    });

    const hasMore = rows.length > take;
    const pageRows = rows.slice(0, take);

    const items = pageRows.map((r) => {
      return {...r, unitPrice: r.unitPrice.toNumber()};
    });

    return {
      items,
      nextCursor: hasMore ? pageRows[pageRows.length - 1].id : null,
    };
  },
  async findById(id: string) {
    const row = await prisma.product.findUnique({
      where: {id},
      select: {
        id: true,
        name: true,
        code: true,
        unitPrice: true,
        imageUrl: true,
        description: true,
      },
    });

    if (!row) return null;

    return {
      ...row,
      unitPrice: row.unitPrice.toNumber(),
    };
  },
  async create(data: CreateProductInput) {
    const row = await prisma.product.create({
      data: {
        name: data.name,
        code: data.code,
        unitPrice: data.unitPrice,
        imageUrl: data.imageUrl ?? null,
        description: data.description ?? null,
        createdById: data.createdById,
      },
      // Si CreateProductResult pide más campos, agrégalos aquí
      select: {
        id: true,
        name: true,
      },
    });

    return row;
  },
  async update(id: string, data: UpdateProductInput) {
    const row = await prisma.product.update({
      where: {id},
      data: {
        ...(data.name !== undefined ? {name: data.name} : {}),
        ...(data.code !== undefined ? {code: data.code} : {}),
        ...(data.unitPrice !== undefined ? {unitPrice: data.unitPrice} : {}),
        ...(data.imageUrl !== undefined ? {imageUrl: data.imageUrl} : {}),
        ...(data.description !== undefined
          ? {description: data.description}
          : {}),
      },
      select: {name: true},
    });

    return row;
  },

  async delete(id: string) {
    await prisma.product.delete({where: {id}});
  },
  async getProductDashboardStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [generalStats, topProduct] = await Promise.all([
      // 1. Estadísticas generales del catálogo
      prisma.$queryRaw<ProductMetricsQueryResult[]>`
      SELECT 
        COUNT(id)::FLOAT as total_products,
        AVG("unitPrice")::FLOAT as avg_price,
        COUNT(id) FILTER (WHERE "createdAt" >= ${startOfMonth})::FLOAT as new_this_month
      FROM "Product"
    `,

      // 2. El producto más solicitado en proyectos cerrados (APPROVED)
      prisma.$queryRaw<TopProductQueryResult[]>`
      SELECT 
        p.name, 
        p.code, 
        COUNT(qi.id)::FLOAT as occurrences
      FROM "QuotationItem" qi
      JOIN "Product" p ON qi."productId" = p.id
      JOIN "Quotation" q ON qi."quotationId" = q.id
      WHERE q.status = 'APPROVED'
      GROUP BY p.name, p.code
      ORDER BY occurrences DESC
      LIMIT 1
    `,
    ]);

    const stats = generalStats[0];
    const top = topProduct[0];

    return {
      catalogSize: {
        count: Number(stats?.total_products ?? 0),
        subtext: `+${Number(stats?.new_this_month ?? 0)} este mes`,
        isPositive: true,
      },
      averagePrice: {
        amount: Number(stats?.avg_price ?? 0),
        formatted: `$${Number(stats?.avg_price ?? 0).toLocaleString()}`,
        subtext: "Precio promedio catálogo",
        isPositive: true,
      },
      topProduct: {
        name: top?.name ?? "N/A",
        code: top?.code ?? "---",
        usage: `${Number(top?.occurrences ?? 0)} veces usado`,
        subtext: "Producto más vendido",
        isPositive: true,
      },
    };
  },
};
