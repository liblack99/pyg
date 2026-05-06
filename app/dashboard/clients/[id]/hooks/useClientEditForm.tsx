"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ClientSchema} from "@/app/core/clients/schema/client.schema";
import {ClientSchemaForm} from "@/app/core/clients/schema/client.schema";
import {apiPut} from "@/app/lib/api.client";
import {UpdateClientInput} from "@/app/core/clients/dto";

export default function useClientEditForm(
  id: string,
  defaults: UpdateClientInput,
) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ClientSchemaForm>({
    resolver: zodResolver(ClientSchema),
    defaultValues: {
      name: defaults.name,
      documentType: defaults.documentType,
      documentNumber: defaults.documentNumber,
      email: defaults.email,
      phone: defaults.phone,
      address: defaults.address,
      city: defaults.city,
      department: defaults.department,

      contactName1: defaults.contactName1,
      contactRole1: defaults.contactRole1,
      contactPhone1: defaults.contactPhone1,

      contactName2: defaults.contactName2,
      contactRole2: defaults.contactRole2,
      contactPhone2: defaults.contactPhone2,
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
      await apiPut(`/api/clients/${id}`, payload);
      router.push("/dashboard/clients");
      router.refresh();
    } catch (e: unknown) {
      setServerError(
        e instanceof Error ? e.message : "Error guardando cliente",
      );
    }
  });

  return {form, submit, serverError};
}
