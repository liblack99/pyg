import {NextResponse} from "next/server";
import {z} from "zod";
import {requireAuth} from "@/app/api/_shared/auth";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {makeProjectBudgetUseCases} from "@/app/core/projects/budget/usecases";
import {projectBudgetItemRepo} from "@/app/infra/repositories/project/budget/projectBudgetItem.prisma.repo";
import {projectActivityPrismaRepo} from "@/app/infra/repositories/project/activity/project-activity.prisma.repo";
import {makeProjectActivityUseCases} from "@/app/core/projects/activity/usecases";
const PatchSchema = z.object({
  description: z.string().min(1).optional(),
  quantity: z.coerce.number().int().min(0).optional(),
  supplierId: z.string().nullable().optional(),
  unitCost: z.coerce.number().min(0).nullable().optional(),
  notes: z.string().nullable().optional(),
});

export async function PUT(
  req: Request,
  ctx: {params: Promise<{id: string; itemId: string}>},
) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    assertHasPermission(me.role.permissions, "project:update");

    const body = PatchSchema.parse(await req.json().catch(() => ({})));

    const uc = makeProjectBudgetUseCases(projectBudgetItemRepo);

    const {id, itemId} = await ctx.params;

    console.log("Updating budget item", {id, itemId, body});

    const item = await uc.getBudgetItemById.execute(id, itemId);

    const updated = await uc.updateBudgetItem.execute(id, itemId, body);

    const supplierChanged = item.supplierId !== updated.supplierId;
    const unitCostChanged = item.unitCost !== updated.unitCost;

    const activity = makeProjectActivityUseCases(projectActivityPrismaRepo);

    if (supplierChanged || unitCostChanged) {
      await activity.createProjectEvent.execute(id, {
        type: "BUDGET_UPDATED",
        module: "BUDGET",
        title: supplierChanged
          ? `Proveedor del producto: ${item.description} fue actualizado`
          : `Costo unitario del producto: ${item.description} fue actualizado`,
        description: updated.description,
        entityId: itemId,
        metadata: {
          itemId,
          description: updated.description,
          changes: {
            supplier: supplierChanged
              ? {
                  from: item.supplierNameSnapshot ?? null,
                  to: updated.supplierNameSnapshot ?? null,
                }
              : undefined,
            unitCost: unitCostChanged
              ? {
                  from: item.unitCost,
                  to: updated.unitCost,
                }
              : undefined,
          },
        },
        createdById: me.id,
      });
    }
    return NextResponse.json(updated, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}

export async function DELETE(
  req: Request,
  ctx: {params: Promise<{id: string; itemId: string}>},
) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    assertHasPermission(me.role.permissions, "project:manage");

    const uc = makeProjectBudgetUseCases(projectBudgetItemRepo);

    const {id, itemId} = await ctx.params;

    const result = await uc.deleteBudgetItem.execute(id, itemId);

    return NextResponse.json(result, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
