import {NextRequest, NextResponse} from "next/server";
import {z} from "zod";

import {requireAuth} from "@/app/api/_shared/auth";

import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {projectWarrantyPrismaRepo} from "@/app/infra/repositories/project/warranties/project-warranty.prisma.repo";
import {makeProjectWarrantyUseCases} from "@/app/core/projects/warranties/usecases";
import {
  WARRANTY_CASE_TYPES,
  WARRANTY_CASE_STATUSES,
  WARRANTY_RESPONSIBILITIES,
} from "@/app/core/projects/warranties/dto";
import {makeProjectActivityUseCases} from "@/app/core/projects/activity/usecases";
import {projectActivityPrismaRepo} from "@/app/infra/repositories/project/activity/project-activity.prisma.repo";

const nullableDateField = z.coerce.date().nullable().optional();

const createProjectWarrantyCaseSchema = z.object({
  type: z.enum(WARRANTY_CASE_TYPES),
  status: z.enum(WARRANTY_CASE_STATUSES).optional(),
  responsibility: z.enum(WARRANTY_RESPONSIBILITIES).optional(),

  title: z.string().trim().min(1),
  description: z.string().trim().nullable().optional(),

  reportedAt: z.coerce.date(),
  detectedAt: nullableDateField,
  startedAt: nullableDateField,
  resolvedAt: nullableDateField,

  estimatedCost: z.coerce.number().optional(),
  realCost: z.coerce.number().optional(),

  supplierId: z.string().trim().nullable().optional(),

  resolutionNotes: z.string().trim().nullable().optional(),
  internalNotes: z.string().trim().nullable().optional(),
});

const listProjectWarrantyCasesQuerySchema = z.object({
  search: z.string().trim().optional(),
  type: z.enum(WARRANTY_CASE_TYPES).optional(),
  status: z.enum(WARRANTY_CASE_STATUSES).optional(),
  responsibility: z.enum(WARRANTY_RESPONSIBILITIES).optional(),
  reportedFrom: z.coerce.date().optional(),
  reportedTo: z.coerce.date().optional(),
  resolvedFrom: z.coerce.date().optional(),
  resolvedTo: z.coerce.date().optional(),
  cursor: z.string().trim().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const warrantyUseCases = makeProjectWarrantyUseCases(projectWarrantyPrismaRepo);

export async function GET(
  req: NextRequest,
  context: {params: Promise<{id: string}>},
) {
  const startedAt = Date.now();
  const route = "/api/projects/[id]/warranties";
  try {
    const me = await requireAuth();
    assertHasPermission(me.role.permissions, "project:read");

    const {id: projectId} = await context.params;
    const searchParams = req.nextUrl.searchParams;

    const query = listProjectWarrantyCasesQuerySchema.parse({
      search: searchParams.get("search") ?? undefined,
      type: searchParams.get("type") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      responsibility: searchParams.get("responsibility") ?? undefined,
      reportedFrom: searchParams.get("reportedFrom") ?? undefined,
      reportedTo: searchParams.get("reportedTo") ?? undefined,
      resolvedFrom: searchParams.get("resolvedFrom") ?? undefined,
      resolvedTo: searchParams.get("resolvedTo") ?? undefined,
      cursor: searchParams.get("cursor") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    const result = await warrantyUseCases.listProjectWarrantyCases.execute({
      projectId,
      ...query,
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleHttpError(error, {
      route,
      method: "GET",
      params: await context.params.catch(() => undefined),
      query: Object.fromEntries(req.nextUrl.searchParams.entries()),
      step: "listProjectWarrantyCases",
      startedAt,
    });
  }
}

export async function POST(
  req: NextRequest,
  context: {params: Promise<{id: string}>},
) {
  const startedAt = Date.now();
  const route = "/api/projects/[id]/warranties";
  try {
    const me = await requireAuth();
    assertHasPermission(me.role.permissions, "project:update");

    const {id: projectId} = await context.params;
    const json = await req.json();

    const input = createProjectWarrantyCaseSchema.parse(json);

    const created = await warrantyUseCases.createProjectWarrantyCase.execute(
      projectId,
      {
        ...input,
        reportedByUserId: me.id,
      },
    );

    const activity = makeProjectActivityUseCases(projectActivityPrismaRepo);
    await activity.createProjectEvent.execute(projectId, {
      type: "WARRANTY_OPENED",
      module: "WARRANTY",
      title: "Caso de garantia creado",
      description: created.title,
      entityId: created.id,
      metadata: {
        type: created.type,
        status: created.status,
        responsibility: created.responsibility,
      },
      createdById: me.id,
    });
    await activity.syncProjectAlerts.execute(projectId);

    return NextResponse.json(created, {status: 201});
  } catch (error) {
    return handleHttpError(error, {
      route,
      method: "POST",
      params: await context.params.catch(() => undefined),
      step: "createProjectWarrantyCase",
      startedAt,
    });
  }
}
