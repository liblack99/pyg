import {NextRequest, NextResponse} from "next/server";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {requireAuth} from "@/app/api/_shared/auth";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {makeOrderProductionUseCases} from "@/app/core/projects/orderPdf/usecases";
import {projectRepo} from "@/app/infra/repositories/project/project.prisma.repo";
import {projectProductionOrderPdf} from "@/app/infra/repositories/project/productionOrder/project.productionOrder.pdf";

export async function GET(
  _req: NextRequest,
  ctx: {params: Promise<{id: string; productionOrderId: string}>},
) {
  const startedAt = Date.now();
  const route = "/api/projects/[id]/productionOrder/[productionOrderId]";

  try {
    const {id, productionOrderId} = await ctx.params;

    const me = await requireAuth();
    assertHasPermission(me.role.permissions, "project:read");

    const uc = makeOrderProductionUseCases(
      projectRepo,
      projectProductionOrderPdf,
    );

    const item = await uc.getById.execute(id, productionOrderId);

    if (!item) {
      return NextResponse.json(
        {error: "Production order not found"},
        {status: 404},
      );
    }

    return NextResponse.json(item, {status: 200});
  } catch (err) {
    return handleHttpError(err, {
      route,
      method: "GET",
      params: await ctx.params.catch(() => undefined),
      step: "getProductionOrderById",
      startedAt,
    });
  }
}
