import type {
  CreateProjectDocumentInput,
  ProjectDocumentEntity,
  UpdateProjectDocumentInput,
} from "../dto";
export interface DocumentRepoPort {
  create: (input: CreateProjectDocumentInput) => Promise<ProjectDocumentEntity>;
  update: (
    id: string,
    input: UpdateProjectDocumentInput,
  ) => Promise<ProjectDocumentEntity>;
  findById: (id: string) => Promise<ProjectDocumentEntity | null>;
  listByProject: (projectId: string) => Promise<ProjectDocumentEntity[]>;
}
