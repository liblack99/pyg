// app/dashboard/users/hooks/useUserEditForm.ts
"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {apiPut} from "@/app/lib/api.client";
import type {
  ProductSchemaForm,
  ProductSchemaInput,
} from "../../../../core/products/schemas/product.schema";
import {ProductSchema} from "../../../../core/products/schemas/product.schema";
import {UpdateProductInput} from "@/app/core/products/dto";

export function useProductEditForm(
  productId: string,
  defaults: UpdateProductInput,
) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ProductSchemaInput, unknown, ProductSchemaForm>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: defaults.name,
      code: defaults.code,
      unit: defaults.unit ?? "",
      unitPrice: defaults.unitPrice,
      imageUrl: defaults.imageUrl,
      description: defaults.description,
    },
    mode: "onTouched",
  });

  const submit = form.handleSubmit(async (values) => {
    setServerError(null);

    const payload = {
      name: values.name,
      code: values.code,
      unit: values.unit,
      unitPrice: values.unitPrice,
      imageUrl: values.imageUrl,
      description: values.description,
    };

    try {
      await apiPut(`/api/products/${productId}`, payload);
      router.push("/dashboard/products");
      router.refresh();
    } catch (e: unknown) {
      setServerError(
        e instanceof Error ? e.message : "Error al guardar producto",
      );
    }
  });

  return {form, submit, serverError};
}
