import {NextRequest} from "next/server";
import {requireAuth} from "@/app/api/_shared/auth";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError, logRouteInfo} from "@/app/api/_shared/http-error";
import {makeQuotationsPdfUseCases} from "@/app/core/quotations/pdf/usecases";
import {quotationPdfExporter} from "@/app/infra/repositories/quotation/pdf/quotation.pdf.prisma.repo";
import {quotationRepo} from "@/app/infra/repositories/quotation/quotation.prisma.repo";
export const runtime = "nodejs";
import {NextResponse} from "next/server";

export async function GET(
  req: NextRequest,
  ctx: {params: Promise<{id: string}>},
) {
  const startedAt = Date.now();
  const route = "/api/quotations/[id]/pdf";
  try {
    const {id} = await ctx.params;
    logRouteInfo("Starting quotation PDF generation", {
      route,
      method: "GET",
      params: {id},
      startedAt,
    });

    const me = await requireAuth();

    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});
    assertHasPermission(me.role.permissions, "quotation:read");

    const uc = makeQuotationsPdfUseCases(quotationRepo, quotationPdfExporter);

    const pdf = await uc.downloaderPdf.execute(id);
    logRouteInfo("Quotation PDF use case completed", {
      route,
      method: "GET",
      params: {id},
      meta: {found: Boolean(pdf)},
      startedAt,
    });

    if (!pdf) {
      return NextResponse.json(
        {error: "No se pudo generar el pdf"},
        {status: 500},
      );
    }
    const buffer = Buffer.from(pdf.buffer);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${pdf.filename}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return handleHttpError(err, {
      route,
      method: "GET",
      params: await ctx.params.catch(() => undefined),
      step: "downloadQuotationPdf",
      startedAt,
    });
  }
}
