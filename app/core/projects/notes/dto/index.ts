import {ProjectNoteLevel, ProjectNoteType} from "@/app/generated/prisma/client";

export const PROJECT_NOTE_TYPES = [
  "GENERAL",
  "PROCUREMENT",
  "INSTALLATION",
  "PRODUCTION",
  "DELIVERY",
  "CLIENT",
] as const;

export const PROJECT_NOTE_LEVELS = [
  "INFO",
  "WARNING",
  "ISSUE",
  "SUCCESS",
] as const;

export type ProjectNoteTypeValue = ProjectNoteType;
export type ProjectNoteLevelValue = ProjectNoteLevel;

export type UserNote = {
  id: string;
  name: string | null;
};

export interface ProjectNote {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  projectId: string;
  userId: string | null;
  content: string;
  type: ProjectNoteType;
  level: ProjectNoteLevel;
  pinned: boolean;
}

export interface ProjectNoteReply {
  id: string;
  noteId: string;
  userId: string | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: UserNote | null;
}

export interface ProjectNoteView extends ProjectNote {
  user: UserNote | null;
  likesCount: number;
  likedByMe: boolean;
  repliesCount: number;
  replies: ProjectNoteReply[];
}

export type CreateProjectNote = Omit<
  ProjectNote,
  "createdAt" | "updatedAt" | "id"
>;

export type CreateProjectOutput = ProjectNoteView;
export type ListProjectNotes = ProjectNoteView;

export type ToggleProjectNoteLikeOutput = {
  noteId: string;
  likesCount: number;
  likedByMe: boolean;
};

export type CreateProjectNoteReplyInput = {
  projectId: string;
  noteId: string;
  userId: string | null;
  content: string;
};

export type CreateProjectNoteReplyOutput = {
  noteId: string;
  reply: ProjectNoteReply;
  repliesCount: number;
};
