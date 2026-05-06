// app/dashboard/users/[id]/page.tsx
import {fetchServer} from "@/app/lib/fetch.server";
import type {Me} from "@/app/lib/auth.types";

import {ProductListItem} from "@/app/core/products/dto";
import PageContentEditProduct from "./compoments/PageContentEditProduct";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const {id} = await params;

  const me = await fetchServer<Me>("/api/me");
  const product = await fetchServer<ProductListItem>(`/api/products/${id}`);

  return <PageContentEditProduct product={product} me={me} />;
}
