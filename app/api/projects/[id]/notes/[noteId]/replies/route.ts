import {NextResponse} from "next/server";
import {requireAuth} from "@/app/api/_shared/auth";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {makeProjectNotesUseCases} from "@/app/core/projects/notes/usecases";
import {projectNoteRepo} from "@/app/infra/repositories/project/notes/projectNote.prisma.repo";
import {createProjectNoteReplySchema} from "@/app/core/projects/notes/schema/notes.schema";

export async function POST(
  req: Request,
  ctx: {params: Promise<{id: string; noteId: string}>},
) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    assertHasPermission(me.role.permissions, "project:update");

    const {id: projectId, noteId} = await ctx.params;
    const body = createProjectNoteReplySchema.parse(
      await req.json().catch(() => ({})),
    );

    const {createProjectNoteReply} = makeProjectNotesUseCases(projectNoteRepo);

    const result = await createProjectNoteReply.execute({
      projectId,
      noteId,
      userId: me.id,
      content: body.content,
    });

    return NextResponse.json(result, {status: 201});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
