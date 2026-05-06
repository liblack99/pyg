"use client";
import ClientForm from "../../components/ClientForm";
import {useClientCreateForm} from "../hooks/useClientCreateForm";

export default function ClientCreateForm() {
  const {form, submit, serverError} = useClientCreateForm();
  return (
    <ClientForm
      form={form}
      onSubmit={submit}
      serverError={serverError}
      submitLabel="Crear"
    />
  );
}
