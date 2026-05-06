// app/dashboard/users/[id]/UserEditForm.tsx
"use client";

import ClientForm from "../../components/ClientForm";
import useClientEditForm from "../hooks/useClientEditForm";

import type {UpdateClientInput} from "@/app/core/clients/dto";

type Props = {
  userId: string;
  defaultsData: UpdateClientInput;
};

export default function ClientEditForm({userId, defaultsData}: Props) {
  const {form, submit, serverError} = useClientEditForm(userId, defaultsData);

  return (
    <ClientForm
      form={form}
      onSubmit={submit}
      submitLabel="Guardar cambios"
      serverError={serverError}
    />
  );
}
