/**
 * Campos editables (form)
 */
export interface Product {
  name: string;
  code: string;
  unitPrice: number;
  imageUrl?: string | null;
  description?: string | null;
}

export interface ProductListItem extends Product {
  id: string;
}

export interface CreateProductInput extends Product {
  createdById: string;
}

export type UpdateProductInput = Partial<Product>;

export interface ListProductInput {
  search?: string;
  limit?: number;
  cursor?: string;
}

export interface ListProductsOutput {
  items: ProductListItem[];
  nextCursor: string | null;
}

export interface CreateProductResult {
  name: string;
}

export interface UpdateProductResult {
  name: string;
}

export interface ProductDashboardStats {
  catalogSize: {
    count: number;
    subtext: string; // Ej: "+5 este mes"
    isPositive: boolean;
  };
  averagePrice: {
    amount: number;
    formatted: string; // Ej: "$1.250.000"
    subtext: string;
  };
  topProduct: {
    name: string;
    code: string;
    usage: string; // Ej: "15 veces usado"
    subtext: string; // "Producto más vendido"
  };
}
export interface ProductMetricsQueryResult {
  total_products: number;
  avg_price: number;
  new_this_month: number;
}

export interface TopProductQueryResult {
  name: string;
  code: string;
  occurrences: number;
}
