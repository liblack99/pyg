import type {
  CreateProjectNoteReplyInput,
  CreateProjectNoteReplyOutput,
  CreateProjectNote,
  CreateProjectOutput,
  ListProjectNotes,
  ToggleProjectNoteLikeOutput,
} from "../dto";
export interface ProjectNotesRepoPort {
  createNote: (
    id: string,
    note: CreateProjectNote,
  ) => Promise<CreateProjectOutput>;
  listByProject: (project: string, currentUserId?: string) => Promise<ListProjectNotes[]>;
  toggleLike: (
    projectId: string,
    noteId: string,
    userId: string,
  ) => Promise<ToggleProjectNoteLikeOutput>;
  createReply: (
    input: CreateProjectNoteReplyInput,
  ) => Promise<CreateProjectNoteReplyOutput>;
}
