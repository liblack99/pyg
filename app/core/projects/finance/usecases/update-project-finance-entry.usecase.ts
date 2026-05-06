import type {
  ProjectFinanceEntry,
  UpdateProjectFinanceEntryInput,
} from "../dto";
import type {ProjectFinanceRepoPort} from "../port/project-finance.repo.port";

export class UpdateProjectFinanceEntryUseCase {
  constructor(private readonly repo: ProjectFinanceRepoPort) {}

  async execute(
    entryId: string,
    input: UpdateProjectFinanceEntryInput,
  ): Promise<ProjectFinanceEntry> {
    const existing = await this.repo.getEntryById(entryId);

    if (!existing) {
      throw new Error("Project finance entry not found");
    }

    return this.repo.updateEntry(entryId, input);
  }
}
