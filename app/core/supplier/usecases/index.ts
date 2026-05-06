import {SupplierRepo} from "../port/supplier.repo.port";
import {ListSupplierUseCase} from "./list-supplier.usecase";

export const makeSupplierUseCases = (repo: SupplierRepo) => {
  return {
    listSupplier: new ListSupplierUseCase(repo),
  };
};
