import type {ProjectFinanceEntry} from "../dto";
import type {ProjectFinanceRepoPort} from "../port/project-finance.repo.port";

export class VoidProjectFinanceEntryUseCase {
  constructor(private readonly repo: ProjectFinanceRepoPort) {}

  async execute(entryId: string): Promise<ProjectFinanceEntry> {
    const existing = await this.repo.getEntryById(entryId);

    if (!existing) {
      throw new Error("Project finance entry not found");
    }

    return this.repo.voidEntry(entryId);
  }
}
