// app/dashboard/users/[id]/UserEditForm.tsx
"use client";

import UserForm from "../../components/UserForm";
import {useUserEditForm} from "../hooks/useUserEditForm";
import type {RoleRef, DefaultsEditUserValues} from "@/app/core/users/dto";

interface Props {
  userId: string;
  roles: RoleRef[];
  defaults: DefaultsEditUserValues;
}

export default function UserEditForm({userId, roles, defaults}: Props) {
  const {form, submit, serverError} = useUserEditForm(userId, defaults);

  return (
    <UserForm
      form={form}
      roles={roles}
      onSubmit={submit}
      submitLabel="Guardar cambios"
      serverError={serverError}
    />
  );
}
