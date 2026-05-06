import {Supplier} from "../dto";
export interface SupplierRepo {
  listSupplier: () => Promise<Supplier[]>;
}
