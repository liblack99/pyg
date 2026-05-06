// app/dashboard/users/hooks/useUserEditForm.ts
"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {apiPost} from "@/app/lib/api.client";
import {
  ReviewSchema,
  ReviewSchemaForm,
} from "../../../../core/review/schema/review.schema";

export function useReviewCreateForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ReviewSchemaForm>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      title: "",
      details: "",
    },
    mode: "onTouched",
  });

  const submit = form.handleSubmit(async (values) => {
    setServerError(null);

    const payload = {
      title: values.title,
      details: values.details,
    };

    try {
      await apiPost("/api/reviews", payload);
      router.push("/dashboard/reviews");
      router.refresh();
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : "Error creando reseña");
    }
  });

  return {form, submit, serverError};
}
