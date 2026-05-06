import {NextResponse} from "next/server";
import {requireAuth} from "@/app/api/_shared/auth";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {makeProjectFabricationUseCases} from "@/app/core/projects/fabrication/usecases";
import {projectFabricationPrismaRepo} from "@/app/infra/repositories/project/fabrication/project-fabrication.prisma.repo";
import {updateProjectFabricationSchema} from "@/app/core/projects/fabrication/schema";

export async function GET(req: Request, ctx: {params: Promise<{id: string}>}) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    const {id} = await ctx.params;

    assertHasPermission(me.role.permissions, "project:read");

    const uc = makeProjectFabricationUseCases(projectFabricationPrismaRepo);
    const fabrication = await uc.getProjectFabrication.execute(id);

    return NextResponse.json(fabrication, {status: 200});
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
    const input = updateProjectFabricationSchema.parse(body);

    const uc = makeProjectFabricationUseCases(projectFabricationPrismaRepo);
    const fabrication = await uc.getProjectFabrication.execute(projectId);

    const result = await uc.updateProjectFabrication.execute(fabrication.id, {
      ...input,
      updatedById: me.id,
    });

    return NextResponse.json(result, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
