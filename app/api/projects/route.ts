import {NextResponse} from "next/server";
import {z} from "zod";
import {requireAuth} from "@/app/api/_shared/auth";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {makeProjectsUseCases} from "@/app/core/projects/usecases";
import {ProjectKind, ProjectStatus} from "@/app/generated/prisma/enums";
import {CreateProjectUseCase} from "@/app/core/projects/usecases/create-project.usecase";
import {projectRepo} from "@/app/infra/repositories/project/project.prisma.repo";
import {projectDocumentRepo} from "@/app/infra/repositories/project/documentation/project-document.prisma.repo";
import {zohoWorkDriveService} from "@/app/infra/repositories/integrations/zoho/zoho-workdrive.service";
import {quotationRepo} from "@/app/infra/repositories/quotation/quotation.prisma.repo";
import {quotationPdfExporter} from "@/app/infra/repositories/quotation/pdf/quotation.pdf.prisma.repo";
import {logger} from "@/app/lib/logger";
import {makeProjectActivityUseCases} from "@/app/core/projects/activity/usecases";
import {projectActivityPrismaRepo} from "@/app/infra/repositories/project/activity/project-activity.prisma.repo";

const status = z.enum(["ACTIVE", "PAUSED", "CLOSED", "CANCELLED"]);
const kind = z.enum(["SUPPLY_ONLY", "EXECUTION", "MIXED"]);

const QuerySchema = z.object({
  search: z.string().optional(),
  status: status.optional(),
  kind: kind.optional(),
  attention: z
    .enum([
      "budget-risk",
      "delivery-soon",
      "pending-purchases",
      "warranty-open",
      "installation-tomorrow",
      "margin-risk",
    ])
    .optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
  cursor: z.string().optional(),
});

const dateFromInput = z
  .union([z.string(), z.null()])
  .optional()
  .transform((v) => {
    if (v === undefined) return undefined;
    if (v === null) return null;
    const s = v.trim();
    if (!s) return null;
    return new Date(`${s}T00:00:00.000Z`);
  });

const statusEnum = z.enum(ProjectStatus);
const kindEnum = z.enum(ProjectKind);

const ProjectSchema = z
  .object({
    quotationId: z.string(),
    status: statusEnum.optional(),
    kind: kindEnum.optional(),

    procurementDueAt: dateFromInput,
    procurementDoneAt: dateFromInput,

    fabricationDueAt: dateFromInput,
    fabricationDoneAt: dateFromInput,

    installationDueAt: dateFromInput,
    installationDoneAt: dateFromInput,

    deliveryDueAt: dateFromInput,
    deliveryDoneAt: dateFromInput,
  })
  .strict();

export async function GET(req: Request) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    assertHasPermission(me.role.permissions, "project:read");

    const url = new URL(req.url);
    const q = QuerySchema.parse({
      search: url.searchParams.get("search") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      kind: url.searchParams.get("kind") ?? undefined,
      attention: url.searchParams.get("attention") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined,
      cursor: url.searchParams.get("cursor") ?? undefined,
    });

    const uc = makeProjectsUseCases(projectRepo);
    const result = await uc.ListProjects.execute({
      limit: q.limit,
      cursor: q.cursor ?? null,
      search: q.search,
      status: q.status,
      kind: q.kind,
      attention: q.attention,
    });

    return NextResponse.json(result, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}

export async function POST(req: Request) {
  try {
    const me = await requireAuth();
    if (!me) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    assertHasPermission(me.role.permissions, "project:create");

    const body = ProjectSchema.parse(await req.json().catch(() => ({})));

    logger.info("api.projects.create", "Project payload validated", {
      quotationId: body.quotationId,
      status: body.status ?? null,
      kind: body.kind ?? null,
    });
    const {quotationId, ...input} = body;

    const create = new CreateProjectUseCase(
      projectRepo,
      quotationRepo,
      quotationPdfExporter,
      projectDocumentRepo,
      zohoWorkDriveService,
    );

    const created = await create.execute(quotationId, input, me.id);
    const activity = makeProjectActivityUseCases(projectActivityPrismaRepo);

    await activity.createProjectEvent.execute(created.id, {
      type: "PROJECT_CREATED",
      module: "SUMMARY",
      title: "Proyecto creado",
      description: `Se creo el proyecto ${created.code} a partir de una cotizacion aprobada.`,
      entityId: created.id,
      metadata: {
        quotationId,
        projectCode: created.code,
      },
      createdById: me.id,
    });

    return NextResponse.json(created, {status: 201});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
