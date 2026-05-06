import {NextRequest, NextResponse} from "next/server";
import {z} from "zod";

import {requireAuth} from "@/app/api/_shared/auth";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {projectWarrantyPrismaRepo} from "@/app/infra/repositories/project/warranties/project-warranty.prisma.repo";
import {makeProjectWarrantyUseCases} from "@/app/core/projects/warranties/usecases";
import {PROJECT_WARRANTY_STATUSES} from "@/app/core/projects/warranties/dto";

const nullableDateField = z.coerce.date().nullable().optional();

const updateProjectWarrantySummarySchema = z.object({
  status: z.enum(PROJECT_WARRANTY_STATUSES),
  startsAt: nullableDateField,
  endsAt: nullableDateField,
  months: z.coerce.number().int().min(0).nullable().optional(),
  terms: z.string().trim().nullable().optional(),
  notes: z.string().trim().nullable().optional(),
});

const warrantyUseCases = makeProjectWarrantyUseCases(projectWarrantyPrismaRepo);

export async function GET(
  _req: NextRequest,
  context: {params: Promise<{id: string}>},
) {
  const startedAt = Date.now();
  const route = "/api/projects/[id]/warranties/summary";
  try {
    const me = await requireAuth();
    assertHasPermission(me.role.permissions, "project:read");

    const {id: projectId} = await context.params;

    const summary =
      await warrantyUseCases.getProjectWarrantySummary.execute(projectId);

    return NextResponse.json(summary);
  } catch (error) {
    return handleHttpError(error, {
      route,
      method: "GET",
      params: await context.params.catch(() => undefined),
      step: "getProjectWarrantySummary",
      startedAt,
    });
  }
}

export async function PUT(
  req: NextRequest,
  context: {params: Promise<{id: string}>},
) {
  const startedAt = Date.now();
  const route = "/api/projects/[id]/warranties/summary";
  try {
    const me = await requireAuth();
    assertHasPermission(me.role.permissions, "project:update");

    const {id: projectId} = await context.params;
    const json = await req.json();

    const input = updateProjectWarrantySummarySchema.parse(json);

    const summary = await warrantyUseCases.updateProjectWarrantySummary.execute(
      projectId,
      input,
    );

    return NextResponse.json(summary);
  } catch (error) {
    return handleHttpError(error, {
      route,
      method: "PUT",
      params: await context.params.catch(() => undefined),
      step: "updateProjectWarrantySummary",
      startedAt,
    });
  }
}
