import React from "react";
import {can} from "@/app/lib/auth.types";
import type {Me} from "@/app/lib/auth.types";
import Link from "next/link";
import ProductCreateForm from "./ProductCreateForm";

interface Props {
  me: Me;
}

export default async function PageContentNewProduct({me}: Props) {
  if (!can(me, "clients:manage")) {
    return (
      <div className="p-6 space-y-4">
        <div>
          <h1 className="text-xl font-semibold">Crear Producto</h1>
          <p className="text-sm text-red-600">
            No tienes permiso para administrar productos.
          </p>
        </div>

        <Link
          href="/dashboard/products"
          className="inline-block rounded border px-3 py-2 text-sm hover:bg-neutral-50">
          Volver
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <ProductCreateForm />
    </div>
  );
}
