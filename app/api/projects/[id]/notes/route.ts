import {NextResponse} from "next/server";
import {requireAuth} from "@/app/api/_shared/auth";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {makeProjectNotesUseCases} from "@/app/core/projects/notes/usecases";
import {projectNoteRepo} from "@/app/infra/repositories/project/notes/projectNote.prisma.repo";
import {createProjectNoteSchema} from "@/app/core/projects/notes/schema/notes.schema";
import {makeProjectActivityUseCases} from "@/app/core/projects/activity/usecases";
import {projectActivityPrismaRepo} from "@/app/infra/repositories/project/activity/project-activity.prisma.repo";

export async function GET(req: Request, ctx: {params: Promise<{id: string}>}) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    assertHasPermission(me.role.permissions, "project:read");

    const {id} = await ctx.params;
    const {listProjectNotes} = makeProjectNotesUseCases(projectNoteRepo);

    const result = await listProjectNotes.execute(id, me.id);

    return NextResponse.json(result, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}

export async function POST(req: Request, ctx: {params: Promise<{id: string}>}) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    // Verificamos permiso para editar o comentar en proyectos
    assertHasPermission(me.role.permissions, "project:update");

    const {id} = await ctx.params;
    const body = createProjectNoteSchema.parse(
      await req.json().catch(() => ({})),
    );

    const {createProjectNote} = makeProjectNotesUseCases(projectNoteRepo);

    // Estructuramos el DTO para el caso de uso
    const result = await createProjectNote.execute(id, {
      ...body,
      userId: me.id,
      projectId: id,
    });

    const activity = makeProjectActivityUseCases(projectActivityPrismaRepo);
    await activity.createProjectEvent.execute(id, {
      type: "NOTE_CREATED",
      module: "NOTES",
      title: "Nueva nota registrada",
      description: body.content.slice(0, 140),
      entityId: result.id,
      metadata: {
        noteType: result.type,
        noteLevel: result.level,
        pinned: result.pinned,
      },
      createdById: me.id,
    });

    return NextResponse.json(result, {status: 201});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
