import {NextRequest, NextResponse} from "next/server";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {requireAuth} from "@/app/api/_shared/auth";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {makeOrderProductionUseCases} from "@/app/core/projects/orderPdf/usecases";
import {projectRepo} from "@/app/infra/repositories/project/project.prisma.repo";
import {projectProductionOrderPdf} from "@/app/infra/repositories/project/productionOrder/project.productionOrder.pdf";

export async function POST(
  _req: NextRequest,
  ctx: {params: Promise<{id: string; productionOrderId: string}>},
) {
  const startedAt = Date.now();
  const route =
    "/api/projects/[id]/productionOrder/[productionOrderId]/approve";

  try {
    const {id, productionOrderId} = await ctx.params;

    const me = await requireAuth();

    assertHasPermission(me.role.permissions, "project:update");

    const uc = makeOrderProductionUseCases(
      projectRepo,
      projectProductionOrderPdf,
    );

    const approved = await uc.approve.execute(
      id,
      productionOrderId,
      me.name ?? me.email,
    );

    return NextResponse.json(approved, {status: 200});
  } catch (err) {
    return handleHttpError(err, {
      route,
      method: "POST",
      params: await ctx.params.catch(() => undefined),
      step: "approveProductionOrder",
      startedAt,
    });
  }
}
