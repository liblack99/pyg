import {
  ProductListItem,
  ListProductInput,
  CreateProductInput,
  ListProductsOutput,
  CreateProductResult,
  UpdateProductInput,
  UpdateProductResult,
  ProductDashboardStats,
} from "../dto";

export interface ProductRepoPort {
  listPaged(input: ListProductInput): Promise<ListProductsOutput>;
  findById(id: string): Promise<ProductListItem | null>;
  create(input: CreateProductInput): Promise<CreateProductResult>;
  update(id: string, input: UpdateProductInput): Promise<UpdateProductResult>;
  delete(id: string): Promise<void>;
  getProductDashboardStats(): Promise<ProductDashboardStats>;
}
