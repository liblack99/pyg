import type {ProjectNotesRepoPort} from "../port/project.notes.repo.port";
import type {ListProjectNotes} from "../dto";

export class ListProjectNotesUseCase {
  constructor(private repo: ProjectNotesRepoPort) {}

  async execute(projectId: string, currentUserId?: string): Promise<ListProjectNotes[]> {
    const notes = await this.repo.listByProject(projectId, currentUserId);
    return notes;
  }
}
