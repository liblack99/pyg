"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";
import {useWatch} from "react-hook-form";

import {useQuotationFormState} from "../../hooks/useQuotationFormState";
import {useQuotationActions} from "../../hooks/useQuotationActions";
import {useLocalDraft, clearLocalDraft} from "../../hooks/useLocalDraft";
import {buildQuotationDraftPayload} from "../../[id]/mappers/quotation.payload";

export const LOCAL_KEY = "quotation_draft";

export function useQuotationForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [draftEnabled, setDraftEnabled] = useState(true);

  const {
    form,
    itemsArray,
    items,
    updateTermAccepted,
    addProductAsItem,
    presentation,
    terms,
    updateItem,
    removeItem,
  } = useQuotationFormState({mode: "onSubmit"});

  const values = useWatch({control: form.control});

  useLocalDraft({
    key: LOCAL_KEY,
    values,
    enabled: draftEnabled,
    onHydrate: (draft) => form.reset(draft, {keepDefaultValues: true}),
  });

  const {createDraft, state} = useQuotationActions();

  const submit = form.handleSubmit(async (data) => {
    setServerError(null);
    setDraftEnabled(false);
    const payload = buildQuotationDraftPayload(data);
    try {
      const res = await createDraft(payload);
      clearLocalDraft(LOCAL_KEY);
      alert(`Cotización ${res.numberQuotation} creada correctamente`);
      router.push("/dashboard/quotations");
    } catch (e: unknown) {
      setDraftEnabled(true);
      setServerError(
        e instanceof Error ? e.message : "Error al crear cotización",
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
