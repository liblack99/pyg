// app/dashboard/users/hooks/useUserEditForm.ts
"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {apiPost} from "@/app/lib/api.client";
import type {ProductSchemaForm} from "../../../../core/products/schemas/product.schema";
import {ProductSchema} from "../../../../core/products/schemas/product.schema";

export function useProductCreateForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ProductSchemaForm>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: "",
      code: "",
      unit: "UNIDAD",
      unitPrice: 0,
      imageUrl: "",
      description: "",
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
      await apiPost("/api/products", payload);
      router.push("/dashboard/products");
      router.refresh();
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : "Error creando producto");
    }
  });

  return {form, submit, serverError};
}
