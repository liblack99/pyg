"use client";

import ProductForm from "../../components/ProductForm";
import {useProductCreateForm} from "../hooks/useProductCreateForm";

export default function ProductCreateForm() {
  const {form, submit, serverError} = useProductCreateForm();

  const value = form.watch("unitPrice");

  console.log(value, typeof value);
  return (
    <ProductForm
      form={form}
      onSubmit={submit}
      serverError={serverError}
      submitLabel="Crear"
    />
  );
}
