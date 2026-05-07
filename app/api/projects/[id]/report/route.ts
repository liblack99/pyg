import {NextResponse} from "next/server";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {requireAuth} from "@/app/api/_shared/auth";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {makeProjectReportUseCases} from "@/app/core/projects/report/usecases";
import {projectReportPrismaRepo} from "@/app/infra/projects/report/project-report.prisma.repo";
import {renderProjectReportPdf} from "@/app/infra/pdf/project-report/project-report-pdf.service";

export async function GET(
  _req: Request,
  ctx: {params: Promise<{id: string}>},
) {
  const startedAt = Date.now();
  const route = "/api/projects/[id]/report";

  try {
    const {id} = await ctx.params;
    const me = await requireAuth();

    assertHasPermission(me.role.permissions, "project:read");

    const useCases = makeProjectReportUseCases(projectReportPrismaRepo);
    const report = await useCases.getProjectReport.execute(id);
    const result = await renderProjectReportPdf(report);

    return new NextResponse(Buffer.from(result.buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${result.filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err: unknown) {
    return handleHttpError(err, {
      route,
      method: "GET",
      params: await ctx.params.catch(() => undefined),
      step: "downloadProjectReport",
      startedAt,
    });
  }
}
