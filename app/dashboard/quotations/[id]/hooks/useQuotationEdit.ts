// app/dashboard/quotations/[id]/edit/hooks/useQuotationEdit.ts
"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";
import {useQuotationFormState} from "../../hooks/useQuotationFormState";
import {useQuotationActions} from "../../hooks/useQuotationActions";
import {buildQuotationDraftPayload} from "../mappers/quotation.payload";
import type {UpdateQuotationDefaultValues} from "@/app/core/quotations/dto";

export function useQuotationEdit(
  id: string,
  defaults: UpdateQuotationDefaultValues,
) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    form,
    itemsArray,
    items,
    presentation,
    terms,
    updateItem,
    removeItem,
    updateTermAccepted,
    addProductAsItem,
  } = useQuotationFormState({mode: "onSubmit", defaultValues: defaults});

  const {updateDraft, state} = useQuotationActions();

  const submit = form.handleSubmit(async (data) => {
    setServerError(null);
    const payload = buildQuotationDraftPayload(data);

    try {
      await updateDraft(id, payload);
      router.push("/dashboard/quotations");
      router.refresh();
    } catch (e: unknown) {
      setServerError(
        e instanceof Error ? e.message : "Error al actualizar cotización",
      );
    }
  });

  return {
    form,
    itemsArray,
    items,
    presentation,
    terms,
    updateItem,
    removeItem,
    addProductAsItem,
    updateTermAccepted,
    submit,
    serverError,
    isPending: state.isPending,
  };
}
