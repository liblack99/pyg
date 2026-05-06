// app/dashboard/users/hooks/useUserEditForm.ts
"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {apiPut} from "@/app/lib/api.client";
import {
  CreateUserFormSchema,
  type CreateUserFormValues,
} from "@/app/core/users/schemas/user.schemas";
import type {DefaultsEditUserValues} from "@/app/core/users/dto";

export function useUserEditForm(
  userId: string,
  defaults: DefaultsEditUserValues,
) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(CreateUserFormSchema),
    defaultValues: {
      name: defaults.name ?? "",
      email: defaults.email ?? "",
      roleId: defaults.roleId ?? "",
    },
    mode: "onTouched",
  });

  const submit = form.handleSubmit(async (values) => {
    setServerError(null);
    const payload = {
      name: values.name?.trim() ? values.name.trim() : undefined,
      roleId: values.roleId,
    };

    try {
      await apiPut(`/api/users/${userId}`, payload);
      router.push("/dashboard/users");
      router.refresh();
    } catch (e: unknown) {
      setServerError(
        e instanceof Error ? e.message : "Error guardando usuario",
      );
    }
  });

  return {form, submit, serverError};
}
