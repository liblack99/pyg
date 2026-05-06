"use client";

import {useMemo} from "react";
import UserForm from "../../components/UserForm";
import {useUserCreateForm} from "../hooks/useUserCreateForm";

import type {RoleRef} from "@/app/core/users/dto";

type Props = {
  roles: RoleRef[];
};

export default function UserCreateForm({roles}: Props) {
  const defaultRoleId = useMemo(() => roles[0]?.id ?? "", [roles]);

  const {form, submit, serverError} = useUserCreateForm(defaultRoleId);

  return (
    <UserForm
      form={form}
      roles={roles}
      onSubmit={submit}
      submitLabel="Crear"
      serverError={serverError}
    />
  );
}
