import {NextResponse} from "next/server";
import {requireAuth} from "@/app/api/_shared/auth";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {makeDashboardUseCases} from "@/app/core/dashboard/usecases";
import {dashboardRepo} from "@/app/infra/repositories/dashboard/dashboard.prisma.repo";

export async function GET() {
  try {
    const me = await requireAuth();
    const {getDashboardOverview} = makeDashboardUseCases(dashboardRepo);
    const result = await getDashboardOverview.execute(me.role.permissions);

    return NextResponse.json(result, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
