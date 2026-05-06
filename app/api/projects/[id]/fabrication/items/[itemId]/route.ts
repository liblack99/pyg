import {NextResponse} from "next/server";
import {requireAuth} from "@/app/api/_shared/auth";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {makeProjectFabricationUseCases} from "@/app/core/projects/fabrication/usecases";
import {projectFabricationPrismaRepo} from "@/app/infra/repositories/project/fabrication/project-fabrication.prisma.repo";
import {updateProjectFabricationItemSchema} from "@/app/core/projects/fabrication/schema";
import {makeProjectActivityUseCases} from "@/app/core/projects/activity/usecases";
import {projectActivityPrismaRepo} from "@/app/infra/repositories/project/activity/project-activity.prisma.repo";

export async function PUT(
  req: Request,
  ctx: {params: Promise<{id: string; itemId: string}>},
) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    const {id: projectId, itemId} = await ctx.params;

    assertHasPermission(me.role.permissions, "project:update");

    const body = await req.json().catch(() => ({}));
    const input = updateProjectFabricationItemSchema.parse(body);

    const uc = makeProjectFabricationUseCases(projectFabricationPrismaRepo);
    const result = await uc.updateProjectFabricationItem.execute(itemId, input);

    if (result.status === "COMPLETED") {
      const activity = makeProjectActivityUseCases(projectActivityPrismaRepo);
      await activity.createProjectEvent.execute(projectId, {
        type: "FABRICATION_ITEM_COMPLETED",
        module: "FABRICATION",
        title: "Item de fabricacion completado",
        description: result.name,
        entityId: result.id,
        metadata: {
          status: result.status,
          actualEndAt: result.actualEndAt,
        },
        createdById: me.id,
      });
    }

    return NextResponse.json(result, {status: 200});
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

    const {itemId} = await ctx.params;

    assertHasPermission(me.role.permissions, "project:update");

    const uc = makeProjectFabricationUseCases(projectFabricationPrismaRepo);
    await uc.deleteProjectFabricationItem.execute(itemId);

    return NextResponse.json({ok: true}, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
