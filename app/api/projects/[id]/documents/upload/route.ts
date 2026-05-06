import {NextResponse} from "next/server";
import {requireAuth} from "@/app/api/_shared/auth";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {zohoWorkDriveService} from "@/app/infra/repositories/integrations/zoho/zoho-workdrive.service";
import {projectDocumentRepo} from "@/app/infra/repositories/project/documentation/project-document.prisma.repo";
import {makeDocumentProjectUseCase} from "@/app/core/projects/documents/usecases";
import {
  PROJECT_DOCUMENT_TYPES,
  type ProjectDocumentType,
} from "@/app/core/projects/documents/dto";
import {makeProjectActivityUseCases} from "@/app/core/projects/activity/usecases";
import {projectActivityPrismaRepo} from "@/app/infra/repositories/project/activity/project-activity.prisma.repo";
import {getProjectModuleByDocumentType} from "@/app/core/projects/documents/domain/document-type-module-map";

function isValidDocumentType(value: string): value is ProjectDocumentType {
  return (PROJECT_DOCUMENT_TYPES as readonly string[]).includes(value);
}

export async function POST(req: Request, ctx: {params: Promise<{id: string}>}) {
  try {
    const me = await requireAuth();

    if (!me) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    assertHasPermission(me.role.permissions, "project:update");

    const {id: projectId} = await ctx.params;
    const formData = await req.formData();

    const file = formData.get("file");
    const type = formData.get("type");
    const title = formData.get("title");
    const description = formData.get("description");
    const projectCode = formData.get("projectCode");

    if (!(file instanceof File)) {
      return NextResponse.json({error: "file is required"}, {status: 400});
    }

    if (typeof type !== "string" || !isValidDocumentType(type)) {
      return NextResponse.json(
        {error: "type is invalid or missing"},
        {status: 400},
      );
    }

    if (typeof projectCode !== "string" || !projectCode.trim()) {
      return NextResponse.json(
        {error: "projectCode is required"},
        {status: 400},
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const {uploadDocument} = makeDocumentProjectUseCase(
      projectDocumentRepo,
      zohoWorkDriveService,
    );

    const result = await uploadDocument.execute({
      projectId,
      projectCode: projectCode.trim(),
      type,
      title:
        typeof title === "string" && title.trim() ? title.trim() : file.name,
      description:
        typeof description === "string" && description.trim()
          ? description.trim()
          : null,
      fileBuffer,
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      fileSize: file.size,
      uploadedByUserId: me.id,
    });

    const activity = makeProjectActivityUseCases(projectActivityPrismaRepo);

    await activity.createProjectEvent.execute(projectId, {
      type: "DOCUMENT_UPLOADED",
      module: getProjectModuleByDocumentType(result.type),
      title: "Documento subido",
      description: result.title,
      entityId: result.id,
      metadata: {
        type: result.type,
        fileName: result.fileName,
      },
      createdById: me.id,
    });

    return NextResponse.json(result, {status: 201});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}

export async function GET(req: Request, ctx: {params: Promise<{id: string}>}) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    assertHasPermission(me.role.permissions, "project:read");

    const {id: projectId} = await ctx.params;

    const {listDocuments} = makeDocumentProjectUseCase(
      projectDocumentRepo,
      zohoWorkDriveService,
    );

    const result = await listDocuments.execute(projectId);

    return NextResponse.json(result, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
