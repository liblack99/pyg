// app/(auth)/login/LoginForm.tsx
"use client";
import {InputForm} from "@/app/components/form/rhf/InputForm";
import Button from "@/app/components/ui/Button";
import {UseFormReturn} from "react-hook-form";
import {LoginFormValues} from "@/app/core/auth/schema/login.schema";

interface Props {
  form: UseFormReturn<LoginFormValues>;
  onSubmit: () => void;
  error?: string;
}

export function LoginForm({form, onSubmit, error}: Props) {
  const {
    control,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = form;

  return (
    <div className="w-full max-w-md">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-medium text-slate-500">Parque y Grama</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Iniciar sesión
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Ingresa con tu correo y contraseña para acceder al sistema.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <InputForm
              control={control}
              name="email"
              label="Correo"
              type="email"
              placeholder="correo@empresa.com"
              error={errors.email}
            />
          </div>

          <div>
            <InputForm
              control={control}
              name="password"
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              error={errors.password}
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="w-full justify-center">
            {isSubmitting ? "Ingresando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
