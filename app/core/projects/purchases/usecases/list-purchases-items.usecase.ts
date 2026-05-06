import type {ProjectPurchasesRepoPort} from "../port/project.purchases.repo.port";

export class ListPurchasesItemUsesCases {
  constructor(private repo: ProjectPurchasesRepoPort) {}

  async execute(projectId: string) {
    const items = await this.repo.listPurchasableBudgetItems(projectId);
    return items;
  }
}
