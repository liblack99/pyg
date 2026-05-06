import {NextResponse} from "next/server";
import {requireAuth} from "@/app/api/_shared/auth";

import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import z from "zod";
import {ProcurementStatus} from "@/app/generated/prisma/enums";

const status = z.enum(ProcurementStatus);

import {makeProjectPurchasesUseCases} from "@/app/core/projects/purchases/usecases";

import {projectPurchasesRepo} from "@/app/infra/repositories/project/purchases/projectShopping.prisma.repo";
import {makeProjectActivityUseCases} from "@/app/core/projects/activity/usecases";
import {projectActivityPrismaRepo} from "@/app/infra/repositories/project/activity/project-activity.prisma.repo";

const PatchSchema = z.object({
  status: status,
  purchaseNotes: z.string().nullable(),
});

export async function PUT(
  req: Request,
  ctx: {params: Promise<{id: string; budgetId: string}>},
) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    assertHasPermission(me.role.permissions, "project:update");

    const body = PatchSchema.parse(await req.json().catch(() => ({})));

    const uc = makeProjectPurchasesUseCases(projectPurchasesRepo);

    const {id, budgetId} = await ctx.params;

    const updated = await uc.Update.execute(id, budgetId, body);
    const activity = makeProjectActivityUseCases(projectActivityPrismaRepo);

    await activity.createProjectEvent.execute(id, {
      type: "PURCHASE_STATUS_CHANGED",
      module: "PURCHASES",
      title: "Estado de compra actualizado",
      description: `El item de compra cambio a estado ${updated.procurementStatus}.`,
      entityId: updated.id,
      metadata: {
        procurementStatus: updated.procurementStatus,
        supplierId: updated.supplierId,
        totalCost: updated.totalCost,
      },
      createdById: me.id,
    });
    await activity.syncProjectAlerts.execute(id);

    return NextResponse.json(updated, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
