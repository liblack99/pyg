// app/core/projects/documents/usecases/list-project-documents.use-case.ts

import type {DocumentRepoPort} from "../port/document-port";

export class ListProjectDocumentsUseCase {
  constructor(private readonly repo: DocumentRepoPort) {}

  async execute(projectId: string) {
    return this.repo.listByProject(projectId);
  }
}
