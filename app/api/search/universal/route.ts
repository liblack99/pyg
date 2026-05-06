import {NextResponse} from "next/server";
import {z} from "zod";
import {requireAuth} from "@/app/api/_shared/auth";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {clientRepo} from "@/app/infra/repositories/client/client.prisma.repo";
import {quotationRepo} from "@/app/infra/repositories/quotation/quotation.prisma.repo";
import {projectRepo} from "@/app/infra/repositories/project/project.prisma.repo";
import type {ClientListItem} from "@/app/core/clients/dto";
import type {QuotationListItem} from "@/app/core/quotations/dto";
import type {ProjectListItem} from "@/app/core/projects/dto";
import type {UniversalSearchItem} from "@/app/core/search/dto";
import {moneyCOP} from "@/app/utils/moneyFormatted";

const querySchema = z.object({
  search: z.string().trim().min(2),
  limit: z.coerce.number().int().min(1).max(5).optional().default(3),
});

function hasPermission(perms: string[], permission: string) {
  return perms.includes(permission);
}

function mapClientItem(item: ClientListItem): UniversalSearchItem {
  const subtitle = `${item.documentType} ${item.documentNumber}`.trim();
  const description = [item.city, item.department].filter(Boolean).join(", ");
  const meta = item.phone ?? item.email ?? null;

  return {
    id: item.id,
    type: "CLIENT",
    title: item.name,
    subtitle,
    description: description || null,
    meta,
    href: `/dashboard/clients/${item.id}`,
  };
}

function mapQuotationItem(item: QuotationListItem): UniversalSearchItem {
  const clientName =
    typeof item.clientSnapshot === "object" &&
    item.clientSnapshot !== null &&
    "name" in item.clientSnapshot
      ? String(item.clientSnapshot.name ?? "Sin cliente")
      : "Sin cliente";

  return {
    id: item.id,
    type: "QUOTATION",
    title: item.numberQuotation,
    subtitle: clientName,
    description: `${item.projectReference} ${item.projectReferenceDetail ?? ""}`.trim(),
    meta: `${item.status} · ${moneyCOP(item.totalGeneral)}`,
    href: `/dashboard/quotations/${item.id}`,
  };
}

function mapProjectItem(item: ProjectListItem): UniversalSearchItem {
  return {
    id: item.id,
    type: "PROJECT",
    title: item.code,
    subtitle: item.quotation.numberQuotation,
    description: item.quotation.projectReference ?? null,
    meta: item.status,
    href: `/dashboard/projects/${item.id}`,
  };
}

export async function GET(req: Request) {
  try {
    const me = await requireAuth();
    const url = new URL(req.url);
    const query = querySchema.parse({
      search: url.searchParams.get("search") ?? "",
      limit: url.searchParams.get("limit") ?? undefined,
    });

    const tasks: Promise<UniversalSearchItem[]>[] = [];

    if (hasPermission(me.role.permissions, "clients:manage")) {
      tasks.push(
        clientRepo
          .listPaged({
            search: query.search,
            limit: query.limit,
          })
          .then((result) => result.items.map(mapClientItem)),
      );
    }

    if (hasPermission(me.role.permissions, "quotation:read")) {
      tasks.push(
        quotationRepo
          .listPaged({
            search: query.search,
            limit: query.limit,
          })
          .then((result) => result.items.map(mapQuotationItem)),
      );
    }

    if (hasPermission(me.role.permissions, "project:read")) {
      tasks.push(
        projectRepo
          .listPaged({
            search: query.search,
            limit: query.limit,
          })
          .then((result) => result.items.map(mapProjectItem)),
      );
    }

    const resultGroups = await Promise.all(tasks);

    return NextResponse.json(
      {
        items: resultGroups.flat(),
        nextCursor: null,
      },
      {status: 200},
    );
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
