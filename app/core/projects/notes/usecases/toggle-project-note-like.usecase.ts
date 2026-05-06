import {ProjectNotesRepoPort} from "../port/project.notes.repo.port";

export class ToggleProjectNoteLikeUseCase {
  constructor(private readonly repo: ProjectNotesRepoPort) {}

  execute(projectId: string, noteId: string, userId: string) {
    return this.repo.toggleLike(projectId, noteId, userId);
  }
}
