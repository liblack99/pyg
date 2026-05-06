import {NextRequest} from "next/server";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {requireAuth} from "@/app/api/_shared/auth";
import {handleHttpError, logRouteInfo} from "@/app/api/_shared/http-error";
import {makeOrderProductionUseCases} from "@/app/core/projects/orderPdf/usecases";
import {projectRepo} from "@/app/infra/repositories/project/project.prisma.repo";
import {projectProductionOrderPdf} from "@/app/infra/repositories/project/productionOrder/project.productionOrder.pdf";

export const runtime = "nodejs";

import {NextResponse} from "next/server";

export async function GET(
  _req: NextRequest,
  ctx: {params: Promise<{id: string}>},
) {
  const startedAt = Date.now();
  const route = "/api/projects/[id]/productionOrder";

  try {
    const {id} = await ctx.params;

    const me = await requireAuth();
    assertHasPermission(me.role.permissions, "project:read");

    const uc = makeOrderProductionUseCases(
      projectRepo,
      projectProductionOrderPdf,
    );

    const items = await uc.list.execute(id);

    return NextResponse.json(items, {status: 200});
  } catch (err) {
    return handleHttpError(err, {
      route,
      method: "GET",
      params: await ctx.params.catch(() => undefined),
      step: "listProductionOrders",
      startedAt,
    });
  }
}

export async function POST(
  req: NextRequest,
  ctx: {params: Promise<{id: string}>},
) {
  const startedAt = Date.now();
  const route = "/api/projects/[id]/productionOrder";
  try {
    const {id} = await ctx.params;
    logRouteInfo("Starting production order creation", {
      route,
      method: "POST",
      params: {id},
      startedAt,
    });

    const me = await requireAuth();

    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});
    assertHasPermission(me.role.permissions, "quotation:read");
    logRouteInfo("Production order auth OK", {
      route,
      method: "POST",
      params: {id},
      meta: {userId: me.id},
      startedAt,
    });

    const body = await req.json().catch(() => ({}));

    const uc = makeOrderProductionUseCases(
      projectRepo,
      projectProductionOrderPdf,
    );

    const created = await uc.create.execute(id, body);
    logRouteInfo("Production order created", {
      route,
      method: "POST",
      params: {id},
      meta: {
        productionOrderId: created.id,
        reviewedBy: created.payload.reviewedBy ?? null,
        authorizedBy: created.payload.authorizedBy ?? null,
      },
      startedAt,
    });

    return NextResponse.json(created, {status: 201});
  } catch (err) {
    return handleHttpError(err, {
      route,
      method: "POST",
      params: await ctx.params.catch(() => undefined),
      step: "createProductionOrder",
      startedAt,
    });
  }
}
