"use client";

import {useCallback, useEffect, useRef} from "react";
import type {BaseSyntheticEvent} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {apiPost, apiPut} from "@/app/lib/api.client";
import {
  projectFinanceEntryFormSchema,
  type ProjectFinanceEntryFormValues,
} from "@/app/core/projects/finance/schema";
import type {
  CreateProjectFinanceEntryInput,
  UpdateProjectFinanceEntryInput,
} from "@/app/core/projects/finance/dto";
import {
  buildCreateFinanceEntry,
  buildUpdateFinanceEntry,
} from "../mappers/project-finance.form";
import {useProjectFinanceEntryFormStore} from "../store/financeEntryForm.store";
import {useProjectActivityStore} from "../../store/useProjectActivityStore";

const defaultValues: ProjectFinanceEntryFormValues = {
  type: "COLLECTION",
  category: "CLIENT_PAYMENT",
  amount: 0,
  date: "",
  description: "",
  notes: null,
  documentId: null,
};

type MutationResponse = {id: string};

export function useProjectFinanceEntryForm() {
  const abortRef = useRef<AbortController | null>(null);
  const store = useProjectFinanceEntryFormStore();
  const notifyChanged = useProjectActivityStore((state) => state.notifyChanged);

  const form = useForm<ProjectFinanceEntryFormValues>({
    resolver: zodResolver(projectFinanceEntryFormSchema),
    defaultValues,
    mode: "onSubmit",
  });

  useEffect(() => {
    if (!store.open) return;

    form.reset({
      ...defaultValues,
      ...store.initialValues,
    });
  }, [store.open, store.initialValues, form]);

  const close = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    store.close();
    form.reset(defaultValues);
  }, [store, form]);

  const onSubmitValues = useCallback(
    async (values: ProjectFinanceEntryFormValues) => {
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      store.setSaving(true);
      store.setError(null);

      try {
        let result: MutationResponse;

        if (store.mode === "create") {
          if (!store.projectId) {
            throw new Error("Faltan datos para crear el movimiento");
          }

          const payload: CreateProjectFinanceEntryInput =
            buildCreateFinanceEntry(values);

          result = await apiPost<MutationResponse>(
            `/api/projects/${store.projectId}/finance/entries`,
            payload,
          );
        } else {
          if (!store.entryId || !store.projectId) {
            throw new Error("No hay movimiento seleccionado");
          }

          const payload: UpdateProjectFinanceEntryInput =
            buildUpdateFinanceEntry(values);

          result = await apiPut<MutationResponse>(
            `/api/projects/${store.projectId}/finance/entries/${store.entryId}`,
            payload,
          );
        }

        await store.onSaved?.();

        store.setSaving(false);
        store.setError(null);
        store.close();
        form.reset(defaultValues);
        notifyChanged(store.projectId ?? "");

        return result;
      } catch (e: unknown) {
        if (e instanceof DOMException && e.name === "AbortError") return;

        const msg =
          e instanceof Error ? e.message : "Error guardando movimiento";

        store.setSaving(false);
        store.setError(msg);
        throw e;
      }
    },
    [store, form, notifyChanged],
  );

  const submit = useCallback(
    async (e?: BaseSyntheticEvent) => {
      await form.handleSubmit(onSubmitValues)(e);
    },
    [form, onSubmitValues],
  );

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  return {
    open: store.open,
    mode: store.mode,
    entryId: store.entryId,
    projectId: store.projectId,
    isSaving: store.isSaving,
    error: store.error,
    initialValues: store.initialValues,
    documents: store.documents,
    openCreate: store.openCreate,
    openUpdate: store.openUpdate,
    close,
    form,
    submit,
  };
}
