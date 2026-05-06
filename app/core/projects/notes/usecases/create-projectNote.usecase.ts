import type {ProjectNotesRepoPort} from "../port/project.notes.repo.port";
import type {CreateProjectNote, CreateProjectOutput} from "../dto";

export class CreateProjectNoteUseCase {
  constructor(private repo: ProjectNotesRepoPort) {}

  async execute(
    projectId: string,
    note: CreateProjectNote,
  ): Promise<CreateProjectOutput> {
    const result = await this.repo.createNote(projectId, note);
    return result;
  }
}
