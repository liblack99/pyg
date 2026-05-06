"use client";

import ProductForm from "../../components/ProductForm";
import {useProductEditForm} from "../hooks/useProductEditForm";
import type {UpdateProductInput} from "@/app/core/products/dto";

type Props = {
  productId: string;
  defaults: UpdateProductInput;
};

export default function ProductEditForm({productId, defaults}: Props) {
  const {form, submit, serverError} = useProductEditForm(productId, defaults);
  return (
    <ProductForm
      form={form}
      onSubmit={submit}
      serverError={serverError}
      submitLabel="Guardar"
    />
  );
}
