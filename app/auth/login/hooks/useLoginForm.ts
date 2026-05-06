"use client";

import {useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {apiPost} from "@/app/lib/api.client";
import {ApiError} from "@/app/lib/http/api-error";
import {
  loginSchema,
  LoginFormValues,
} from "@/app/core/auth/schema/login.schema";
import {Me} from "@/app/lib/auth.types";

export function useLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const next = searchParams.get("next") || "/";
  const [submitError, setSubmitError] = useState("");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@local.com",
      password: "",
    },
    mode: "onSubmit",
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError("");

    try {
      await apiPost<Me>("/api/auth/login", {
        email: values.email.trim(),
        password: values.password,
      });

      router.replace(next);
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setSubmitError("Correo o contraseña incorrectos.");
        } else {
          setSubmitError(err.message || "No se pudo iniciar sesión.");
        }
      } else {
        setSubmitError("Ocurrió un error inesperado.");
      }
    }
  });

  return {
    form,
    onSubmit,
    submitError,
    isSubmitting,
  };
}
