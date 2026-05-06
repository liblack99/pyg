// app/dashboard/users/new/useUserCreateForm.ts
"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {apiPost} from "@/app/lib/api.client";
import {
  CreateUserFormSchema,
  type CreateUserFormValues,
} from "../../../../core/users/schemas/user.schemas";

export function useUserCreateForm(defaultRoleId: string) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(CreateUserFormSchema),
    defaultValues: {
      name: "",
      email: "",
      roleId: defaultRoleId,
    },
    mode: "onTouched",
  });

  const submit = form.handleSubmit(async (values) => {
    setServerError(null);

    const payload = {
      email: values.email.toLowerCase(),
      name: values.name?.trim() ? values.name.trim() : undefined,
      roleId: values.roleId,
    };

    try {
      await apiPost("/api/users", payload);
      router.push("/dashboard/users");
      router.refresh();
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : "Error creando usuario");
    }
  });

  return {form, submit, serverError};
}
