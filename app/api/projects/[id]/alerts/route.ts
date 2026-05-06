import {NextRequest, NextResponse} from "next/server";
import {requireAuth} from "@/app/api/_shared/auth";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {
  createProjectAlertSchema,
  listProjectAlertsQuerySchema,
} from "@/app/core/projects/activity/schema";
import {makeProjectActivityUseCases} from "@/app/core/projects/activity/usecases";
import {projectActivityPrismaRepo} from "@/app/infra/repositories/project/activity/project-activity.prisma.repo";

export async function GET(
  req: NextRequest,
  ctx: {params: Promise<{id: string}>},
) {
  try {
    const me = await requireAuth();
    assertHasPermission(me.role.permissions, "project:read");

    const {id: projectId} = await ctx.params;
    const query = listProjectAlertsQuerySchema.parse({
      limit: req.nextUrl.searchParams.get("limit") ?? undefined,
      status: req.nextUrl.searchParams.get("status") ?? undefined,
    });

    const uc = makeProjectActivityUseCases(projectActivityPrismaRepo);
    await uc.syncProjectAlerts.execute(projectId);
    const result = await uc.listProjectAlerts.execute(projectId, query);

    return NextResponse.json(result, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}

export async function POST(
  req: NextRequest,
  ctx: {params: Promise<{id: string}>},
) {
  try {
    const me = await requireAuth();
    assertHasPermission(me.role.permissions, "project:update");

    const {id: projectId} = await ctx.params;
    const body = createProjectAlertSchema.parse(
      await req.json().catch(() => ({})),
    );

    const uc = makeProjectActivityUseCases(projectActivityPrismaRepo);
    const result = await uc.createProjectAlert.execute(projectId, {
      ...body,
      createdById: body.createdById ?? me.id,
    });

    return NextResponse.json(result, {status: 201});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
