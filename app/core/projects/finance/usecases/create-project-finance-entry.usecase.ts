import type {
  CreateProjectFinanceEntryInput,
  ProjectFinanceEntry,
} from "../dto";
import type {ProjectFinanceRepoPort} from "../port/project-finance.repo.port";

export class CreateProjectFinanceEntryUseCase {
  constructor(private readonly repo: ProjectFinanceRepoPort) {}

  async execute(
    projectId: string,
    input: CreateProjectFinanceEntryInput,
  ): Promise<ProjectFinanceEntry> {
    return this.repo.createEntry(projectId, input);
  }
}
