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

const nullableDateField = z.coerce.date().nullable().optional();

const updateProjectWarrantyCaseSchema = z.object({
  type: z.enum(WARRANTY_CASE_TYPES).optional(),
  status: z.enum(WARRANTY_CASE_STATUSES).optional(),
  responsibility: z.enum(WARRANTY_RESPONSIBILITIES).optional(),

  title: z.string().trim().min(1).optional(),
  description: z.string().trim().nullable().optional(),

  reportedAt: z.coerce.date().optional(),
  detectedAt: nullableDateField,
  startedAt: nullableDateField,
  resolvedAt: nullableDateField,

  estimatedCost: z.coerce.number().optional(),
  realCost: z.coerce.number().optional(),

  supplierId: z.string().trim().nullable().optional(),
  reportedByUserId: z.string().trim().nullable().optional(),

  resolutionNotes: z.string().trim().nullable().optional(),
  internalNotes: z.string().trim().nullable().optional(),
});

const warrantyUseCases = makeProjectWarrantyUseCases(projectWarrantyPrismaRepo);

export async function PATCH(
  req: NextRequest,
  context: {params: Promise<{id: string; caseId: string}>},
) {
  const startedAt = Date.now();
  const route = "/api/projects/[id]/warranties/[caseId]";
  try {
    const me = await requireAuth();
    assertHasPermission(me.role.permissions, "project:update");

    const {id: projectId, caseId} = await context.params;
    const json = await req.json();

    const input = updateProjectWarrantyCaseSchema.parse(json);

    const existing = await projectWarrantyPrismaRepo.getCaseById(caseId);

    if (!existing) {
      return NextResponse.json(
        {message: "Caso de garantía no encontrado."},
        {status: 404},
      );
    }

    if (existing.projectId !== projectId) {
      return NextResponse.json(
        {message: "El caso no pertenece al proyecto indicado."},
        {status: 400},
      );
    }

    const updated = await warrantyUseCases.updateProjectWarrantyCase.execute(
      caseId,
      input,
    );

    return NextResponse.json(updated);
  } catch (error) {
    return handleHttpError(error, {
      route,
      method: "PATCH",
      params: await context.params.catch(() => undefined),
      step: "updateProjectWarrantyCase",
      startedAt,
    });
  }
}
