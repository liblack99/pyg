// app/dashboard/users/UserForm.tsx
"use client";

import {InputForm} from "@/app/components/form/rhf/InputForm";
import {SelectForm} from "@/app/components/form/rhf/SelectForm";
import Button from "@/app/components/ui/Button";
import type {UseFormReturn} from "react-hook-form";
import type {CreateUserFormValues} from "@/app/core/users/schemas/user.schemas";
import type {RoleRef} from "@/app/core/users/dto";

type Props = {
  form: UseFormReturn<CreateUserFormValues>;
  roles: RoleRef[];
  onSubmit: () => void;
  submitLabel: string;
  serverError?: string | null;
};

export default function UserForm({
  form,
  roles,
  onSubmit,
  submitLabel,
  serverError,
}: Props) {
  const {
    control,
    formState: {errors, isSubmitting},
  } = form;

  return (
    <form onSubmit={onSubmit} className="w-full space-y-4 rounded bg-white p-4">
      <InputForm
        control={control}
        name="name"
        label="Nombre"
        type="text"
        error={errors.name}
      />

      <InputForm
        control={control}
        name="email"
        label="Email"
        type="email"
        error={errors.email}
      />

      <SelectForm
        control={control}
        name="roleId"
        label="Rol"
        options={roles.map((r) => ({value: r.id, label: r.name}))}
        error={errors.roleId}
      />

      {serverError && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <div className="flex gap-2">
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Guardando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
