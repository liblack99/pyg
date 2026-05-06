import {ProjectNotesRepoPort} from "../port/project.notes.repo.port";
import {CreateProjectNoteReplyInput} from "../dto";

export class CreateProjectNoteReplyUseCase {
  constructor(private readonly repo: ProjectNotesRepoPort) {}

  execute(input: CreateProjectNoteReplyInput) {
    return this.repo.createReply(input);
  }
}
