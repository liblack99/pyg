import {Section} from "@/app/components/layout/Section";
import PageHeader from "@/app/components/layout/PageHeader";
import {can} from "@/app/lib/auth.types";
import type {Me} from "@/app/lib/auth.types";
import Link from "next/link";
import ProductEditForm from "./ProductEditForm";
import type {ProductListItem} from "@/app/core/products/dto";

interface Props {
  product: ProductListItem;
  me: Me;
}

export default function PageContentEditProduct({product, me}: Props) {
  if (!can(me, "products:manage")) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-xl font-semibold">Editar producto</h1>
        <p className="text-sm text-red-600">
          No tienes permiso para administrar productos.
        </p>
        <Link
          className="inline-block rounded border px-3 py-2 text-sm"
          href="/dashboard/products">
          Volver
        </Link>
      </div>
    );
  }

  return (
    <Section>
      <PageHeader
        title={"Editar producto"}
        subtitle={`Editando producto: ${product.code} - ${product.name}`}
        href="/dashboard/products"
        textButton="Volver"
        variantButton="outline"
      />

      <ProductEditForm productId={product.id} defaults={product} />
    </Section>
  );
}
