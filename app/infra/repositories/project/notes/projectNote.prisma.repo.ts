import {ProjectNotesRepoPort} from "@/app/core/projects/notes/port/project.notes.repo.port";
import {
  CreateProjectNote,
  CreateProjectNoteReplyInput,
  CreateProjectNoteReplyOutput,
  CreateProjectOutput,
  ListProjectNotes,
  ToggleProjectNoteLikeOutput,
} from "@/app/core/projects/notes/dto";
import {prisma} from "@/app/lib/prisma";

type NoteRecord = Awaited<ReturnType<typeof getNoteByIdWithRelations>>;
type ReplyRecord = NonNullable<NoteRecord>["replies"][number];

async function getNoteByIdWithRelations(id: string) {
  return prisma.projectNote.findUnique({
    where: {id},
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      likes: {
        select: {
          userId: true,
        },
      },
      replies: {
        orderBy: {createdAt: "asc"},
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
}

function mapReply(reply: ReplyRecord) {
  return {
    id: reply.id,
    noteId: reply.noteId,
    userId: reply.userId ?? null,
    content: reply.content,
    createdAt: reply.createdAt,
    updatedAt: reply.updatedAt,
    user: reply.user
      ? {
          id: reply.user.id,
          name: reply.user.name,
        }
      : null,
  };
}

function mapNote(note: NonNullable<NoteRecord>, currentUserId?: string): ListProjectNotes {
  return {
    id: note.id,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
    projectId: note.projectId,
    userId: note.userId ?? null,
    content: note.content,
    type: note.type,
    level: note.level,
    pinned: note.pinned,
    user: note.user
      ? {
          id: note.user.id,
          name: note.user.name,
        }
      : null,
    likesCount: note.likes.length,
    likedByMe: currentUserId
      ? note.likes.some((like) => like.userId === currentUserId)
      : false,
    repliesCount: note.replies.length,
    replies: note.replies.map(mapReply),
  };
}

export const projectNoteRepo: ProjectNotesRepoPort = {
  async createNote(projectId: string, input: CreateProjectNote) {
    const note = await prisma.projectNote.create({
      data: {
        projectId,
        userId: input.userId ?? null,
        content: input.content,
        type: input.type ?? "GENERAL",
        level: input.level ?? "INFO",
        pinned: input.pinned ?? false,
      },
      select: {
        id: true,
      },
    });

    const created = await getNoteByIdWithRelations(note.id);

    if (!created) {
      throw new Error("No se pudo cargar la nota creada");
    }

    return mapNote(created, input.userId ?? undefined) as CreateProjectOutput;
  },

  async listByProject(projectId: string, currentUserId?: string) {
    const notes = await prisma.projectNote.findMany({
      where: {
        projectId,
      },
      orderBy: [{pinned: "desc"}, {createdAt: "desc"}],
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        replies: {
          orderBy: {createdAt: "asc"},
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return notes.map((note) => mapNote(note, currentUserId));
  },

  async toggleLike(
    projectId: string,
    noteId: string,
    userId: string,
  ): Promise<ToggleProjectNoteLikeOutput> {
    const note = await prisma.projectNote.findFirst({
      where: {
        id: noteId,
        projectId,
      },
      select: {id: true},
    });

    if (!note) {
      throw new Error("No se encontró la nota del proyecto.");
    }

    const existingLike = await prisma.projectNoteLike.findUnique({
      where: {
        noteId_userId: {
          noteId,
          userId,
        },
      },
    });

    if (existingLike) {
      await prisma.projectNoteLike.delete({
        where: {
          noteId_userId: {
            noteId,
            userId,
          },
        },
      });
    } else {
      await prisma.projectNoteLike.create({
        data: {
          noteId,
          userId,
        },
      });
    }

    const likesCount = await prisma.projectNoteLike.count({
      where: {noteId},
    });

    return {
      noteId,
      likesCount,
      likedByMe: !existingLike,
    };
  },

  async createReply(
    input: CreateProjectNoteReplyInput,
  ): Promise<CreateProjectNoteReplyOutput> {
    const note = await prisma.projectNote.findFirst({
      where: {
        id: input.noteId,
        projectId: input.projectId,
      },
      select: {id: true},
    });

    if (!note) {
      throw new Error("No se encontró la nota del proyecto.");
    }

    const reply = await prisma.projectNoteReply.create({
      data: {
        noteId: input.noteId,
        userId: input.userId ?? null,
        content: input.content,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const repliesCount = await prisma.projectNoteReply.count({
      where: {noteId: input.noteId},
    });

    return {
      noteId: input.noteId,
      reply: mapReply(reply),
      repliesCount,
    };
  },
};
