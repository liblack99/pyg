import {NextResponse} from "next/server";
import {requireAuth} from "@/app/api/_shared/auth";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {makeQuotationQueryUseCases} from "@/app/core/quotations/usecases/queries";
import {quotationRepo} from "@/app/infra/repositories/quotation/quotation.prisma.repo";
import {QuerySchema} from "@/app/core/quotations/schemas/query.schema";

export async function GET(req: Request) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    assertHasPermission(me.role.permissions, "quotation:read");

    const url = new URL(req.url);

    const query = QuerySchema.parse({
      search: url.searchParams.get("search") ?? undefined,
      numberQuotation: url.searchParams.get("numberQuotation") ?? undefined,

      clientId: url.searchParams.get("clientId") ?? undefined,
      createdById: url.searchParams.get("createdById") ?? undefined,

      status: url.searchParams.get("status") ?? undefined,

      dateField: url.searchParams.get("dateField") ?? undefined,
      dateFrom: url.searchParams.get("dateFrom") ?? undefined,
      dateTo: url.searchParams.get("dateTo") ?? undefined,

      totalMin: url.searchParams.get("totalMin") ?? undefined,
      totalMax: url.searchParams.get("totalMax") ?? undefined,
      reference: url.searchParams.get("reference") ?? undefined,

      hasClient: url.searchParams.get("hasClient") ?? undefined,

      limit: url.searchParams.get("limit") ?? undefined,
      cursor: url.searchParams.get("cursor") ?? undefined,
    });

    const uc = makeQuotationQueryUseCases(quotationRepo);
    const result = await uc.list.execute(query);

    return NextResponse.json(result, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
