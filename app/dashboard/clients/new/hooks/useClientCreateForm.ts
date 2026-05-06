"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {apiPost} from "@/app/lib/api.client";
import {
  ClientSchema,
  type ClientSchemaForm,
} from "@/app/core/clients/schema/client.schema";

export function useClientCreateForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ClientSchemaForm>({
    resolver: zodResolver(ClientSchema),
    defaultValues: {
      name: "",
      documentType: "",
      documentNumber: "",

      email: "",
      phone: "",
      address: "",
      city: "",
      department: "",

      contactName1: "",
      contactRole1: "",
      contactPhone1: "",

      contactName2: "",
      contactRole2: "",
      contactPhone2: "",
    },
    mode: "onTouched",
  });

  const submit = form.handleSubmit(async (values) => {
    setServerError(null);

    const payload = {
      name: values.name,
      documentType: values.documentType,
      documentNumber: values.documentNumber,

      email: values.email,
      phone: values.phone,
      address: values.address,
      city: values.city,
      department: values.department,

      contactName1: values.contactName1,
      contactRole1: values.contactRole1,
      contactPhone1: values.contactPhone1,

      contactName2: values.contactName2,
      contactRole2: values.contactRole2,
      contactPhone2: values.contactPhone2,
    };

    try {
      await apiPost("/api/clients", payload);
      router.push("/dashboard/clients");
      router.refresh();
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : "Error creando cliente");
    }
  });

  return {form, submit, serverError};
}
