import type {ProjectFinanceView} from "../dto";
import type {ProjectFinanceRepoPort} from "../port/project-finance.repo.port";

export class GetProjectFinanceUseCase {
  constructor(private readonly repo: ProjectFinanceRepoPort) {}

  async execute(projectId: string): Promise<ProjectFinanceView> {
    return this.repo.getProjectFinance(projectId);
  }
}
