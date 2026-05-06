import {ListPurchasesItemUsesCases} from "./list-purchases-items.usecase";
import type {ProjectPurchasesRepoPort} from "../port/project.purchases.repo.port";
import {UpdatePurchasesItemUseCase} from "./update-purchases-item.usecase";

export function makeProjectPurchasesUseCases(repo: ProjectPurchasesRepoPort) {
  return {
    ListShoppingItems: new ListPurchasesItemUsesCases(repo),
    Update: new UpdatePurchasesItemUseCase(repo),
  };
}
