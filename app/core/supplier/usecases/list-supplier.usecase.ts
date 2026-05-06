import type {SupplierRepo} from "../port/supplier.repo.port";

export class ListSupplierUseCase {
  constructor(private repo: SupplierRepo) {}
  async execute() {
    const suppliers = await this.repo.listSupplier();
    return suppliers;
  }
}
