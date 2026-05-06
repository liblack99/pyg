import {NextResponse} from "next/server";
import {requireAuth} from "@/app/api/_shared/auth";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import z from "zod";
import {makeProjectsUseCases} from "@/app/core/projects/usecases";
import {projectRepo} from "@/app/infra/repositories/project/project.prisma.repo";
import {ProjectKind, ProjectStatus} from "@/app/generated/prisma/enums";

const statusEnum = z.enum(ProjectStatus);
const kindEnum = z.enum(ProjectKind);

const updateProjectSchema = z
  .object({
    status: statusEnum.optional(),
    kind: kindEnum.optional(),

    procurementDueAt: z.date().nullable().optional(),
    procurementDoneAt: z.date().nullable().optional(),

    fabricationDueAt: z.date().nullable().optional(),
    fabricationDoneAt: z.date().nullable().optional(),

    installationDueAt: z.date().nullable().optional(),
    installationDoneAt: z.date().nullable().optional(),

    deliveryDueAt: z.date().nullable().optional(),
    deliveryDoneAt: z.date().nullable().optional(),
  })
  .strict();

export async function GET(req: Request, ctx: {params: Promise<{id: string}>}) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    const {id} = await ctx.params;

    assertHasPermission(me.role.permissions, "project:read");

    console.log("GET /api/projects/[id] with id:", id);

    const uc = makeProjectsUseCases(projectRepo);
    const project = await uc.GetProjectByID.execute(id);

    return NextResponse.json(project, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}

export async function PUT(req: Request, ctx: {params: Promise<{id: string}>}) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    const {id} = await ctx.params;

    assertHasPermission(me.role.permissions, "project:update");

    const body = await req.json().catch(() => ({}));
    const input = updateProjectSchema.parse(body);

    const uc = makeProjectsUseCases(projectRepo);

    const result = await uc.Update.execute(id, input);

    return NextResponse.json(result, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
