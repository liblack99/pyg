import {NextResponse} from "next/server";
import {requireAuth} from "@/app/api/_shared/auth";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {makeProjectActivityUseCases} from "@/app/core/projects/activity/usecases";
import {projectActivityPrismaRepo} from "@/app/infra/repositories/project/activity/project-activity.prisma.repo";

export async function PATCH(
  req: Request,
  ctx: {params: Promise<{id: string; alertId: string}>},
) {
  try {
    const me = await requireAuth();
    assertHasPermission(me.role.permissions, "project:update");

    const {alertId} = await ctx.params;
    const uc = makeProjectActivityUseCases(projectActivityPrismaRepo);
    const result = await uc.dismissProjectAlert.execute(alertId);

    return NextResponse.json(result, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
