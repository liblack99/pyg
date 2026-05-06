import {NextResponse} from "next/server";
import {requireAuth} from "@/app/api/_shared/auth";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {updateProjectInstallationSchema} from "@/app/core/projects/installation/schema";
import {makeProjectInstallationUseCases} from "@/app/core/projects/installation/usecases";
import {projectInstallationPrismaRepo} from "@/app/infra/repositories/project/installation/project-installation.prisma.repo";

export async function GET(req: Request, ctx: {params: Promise<{id: string}>}) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    const {id} = await ctx.params;

    assertHasPermission(me.role.permissions, "project:read");

    const uc = makeProjectInstallationUseCases(projectInstallationPrismaRepo);
    const installation = await uc.getProjectInstallation.execute(id);

    return NextResponse.json(installation, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}

export async function PUT(req: Request, ctx: {params: Promise<{id: string}>}) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    const {id: projectId} = await ctx.params;

    assertHasPermission(me.role.permissions, "project:update");

    const body = await req.json().catch(() => ({}));
    const input = updateProjectInstallationSchema.parse(body);

    const uc = makeProjectInstallationUseCases(projectInstallationPrismaRepo);
    const installation = await uc.getProjectInstallation.execute(projectId);

    const result = await uc.updateProjectInstallation.execute(
      installation.id,
      input,
    );

    return NextResponse.json(result, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
