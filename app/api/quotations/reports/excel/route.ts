import {NextResponse} from "next/server";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import z from "zod";
import {requireAuth} from "@/app/api/_shared/auth";
import {quotationRepo} from "@/app/infra/repositories/quotation/quotation.prisma.repo";
import {quotationReportsExcelExporter} from "@/app/infra/repositories/quotation/exportExcel/quotation.exceljs.prisma.repo";
import {makeQuotationsExcelUseCases} from "@/app/core/quotations/excel/usecase";
import {QuerySchema} from "@/app/core/quotations/excel/schema/query.schema";

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

      hasClient: url.searchParams.get("hasClient") ?? undefined,
    });

    const usecases = makeQuotationsExcelUseCases(
      quotationRepo,
      quotationReportsExcelExporter,
    );

    const buffer = await usecases.exportExcel.execute(query);
    if (!buffer) {
      return NextResponse.json(
        {error: "No se pudo generar el Excel"},
        {status: 500},
      );
    }

    const fileName = `reporte-cotizaciones-${new Date().toISOString().slice(0, 10)}.xlsx`;

    return new NextResponse(Uint8Array.from(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return handleHttpError(err);
  }
}
