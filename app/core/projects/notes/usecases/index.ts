import {ProjectNotesRepoPort} from "../port/project.notes.repo.port";
import {CreateProjectNoteUseCase} from "./create-projectNote.usecase";
import {ListProjectNotesUseCase} from "./list-projectNote.usecase";
import {ToggleProjectNoteLikeUseCase} from "./toggle-project-note-like.usecase";
import {CreateProjectNoteReplyUseCase} from "./create-project-note-reply.usecase";

export const makeProjectNotesUseCases = (repo: ProjectNotesRepoPort) => {
  return {
    createProjectNote: new CreateProjectNoteUseCase(repo),
    listProjectNotes: new ListProjectNotesUseCase(repo),
    toggleProjectNoteLike: new ToggleProjectNoteLikeUseCase(repo),
    createProjectNoteReply: new CreateProjectNoteReplyUseCase(repo),
  };
};
