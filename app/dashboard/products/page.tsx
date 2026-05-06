// app/dashboard/products/page.tsx
import {fetchServer} from "@/app/lib/fetch.server";
import type {Me} from "@/app/lib/auth.types";
import type {ProductDashboardStats} from "@/app/core/products/dto";
import type {ProductListItem} from "@/app/core/products/dto";
import PageContentProduct from "./components/PageContentProduct";

type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
};

type SearchParams = {
  search?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const me = await fetchServer<Me>("/api/me");

  const sp = await searchParams;
  const search = sp?.search ?? "";

  const qs = new URLSearchParams();
  qs.set("limit", "5");
  if (search) qs.set("search", search);

  const productPage = await fetchServer<CursorPage<ProductListItem>>(
    `/api/products?${qs.toString()}`,
  );
  const summary = await fetchServer<ProductDashboardStats>(
    `/api/products/summary`,
  );

  return (
    <PageContentProduct
      me={me}
      summary={summary}
      page1={productPage}
      search={search}
    />
  );
}
