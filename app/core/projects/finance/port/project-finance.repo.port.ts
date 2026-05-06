import type {
  CreateProjectFinanceEntryInput,
  ProjectFinanceEntry,
  ProjectFinanceView,
  UpdateProjectFinanceEntryInput,
} from "../dto";

export interface ProjectFinanceRepoPort {
  getProjectFinance(projectId: string): Promise<ProjectFinanceView>;
  getEntryById(entryId: string): Promise<ProjectFinanceEntry | null>;
  createEntry(
    projectId: string,
    input: CreateProjectFinanceEntryInput,
  ): Promise<ProjectFinanceEntry>;
  updateEntry(
    entryId: string,
    input: UpdateProjectFinanceEntryInput,
  ): Promise<ProjectFinanceEntry>;
  voidEntry(entryId: string): Promise<ProjectFinanceEntry>;
}
