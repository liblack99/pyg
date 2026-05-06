import {ProductRepoPort} from "../port/product.repo.port";
import {ListProductsUseCase} from "./list-products.usecase";
import {CreateProductUseCase} from "./create-product.usecase";
import {UpdateProductUseCase} from "./update-product.usecase";
import {DeleteProductUseCase} from "./delete-product.usecase";
import {GetProductByIdUseCase} from "./get-product-by-id.usecase";
import {DashboardProductsUseCase} from "./dashboard-product.usecase";

export function makeProductUseCases(productRepo: ProductRepoPort) {
  return {
    listProducts: new ListProductsUseCase(productRepo),
    getProductById: new GetProductByIdUseCase(productRepo),
    createProduct: new CreateProductUseCase(productRepo),
    updateProduct: new UpdateProductUseCase(productRepo),
    deleteProduct: new DeleteProductUseCase(productRepo),
    summary: new DashboardProductsUseCase(productRepo),
  };
}
