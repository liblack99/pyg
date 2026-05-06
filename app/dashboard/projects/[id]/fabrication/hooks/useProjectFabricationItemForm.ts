"use client";

import {useCallback, useEffect, useRef} from "react";
import type {BaseSyntheticEvent} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {apiPost, apiPut} from "@/app/lib/api.client";
import {useProjectFabricationItemFormStore} from "../store/fabricationItemForm.store";
import {
  buildCreateFabricationItem,
  buildUpdateFabricationItem,
} from "../mappers/project-fabrication.form";
import {
  projectFabricationItemFormSchema,
  type ProjectFabricationItemFormValues,
} from "@/app/core/projects/fabrication/schema";
import type {
  CreateProjectFabricationItemInput,
  UpdateProjectFabricationItemInput,
} from "@/app/core/projects/fabrication/dto";
import {useProjectActivityStore} from "../../store/useProjectActivityStore";

const defaultValues: ProjectFabricationItemFormValues = {
  name: "",
  description: null,
  unit: null,
  quantity: null,
  status: "PENDING",
  plannedStartAt: null,
  plannedEndAt: null,
  actualStartAt: null,
  actualEndAt: null,
  orderIndex: 0,
  notes: null,
};

type MutationResponse = {id: string};

export function useProjectFabricationItemForm() {
  const abortRef = useRef<AbortController | null>(null);
  const store = useProjectFabricationItemFormStore();
  const notifyChanged = useProjectActivityStore((state) => state.notifyChanged);

  const form = useForm<ProjectFabricationItemFormValues>({
    resolver: zodResolver(projectFabricationItemFormSchema),
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
    async (values: ProjectFabricationItemFormValues) => {
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      store.setSaving(true);
      store.setError(null);

      try {
        let result: MutationResponse;

        if (store.mode === "create") {
          if (!store.fabricationId || !store.projectId) {
            throw new Error("Faltan datos para crear el item");
          }

          const payload: CreateProjectFabricationItemInput =
            buildCreateFabricationItem({
              ...values,
              fabricationId: store.fabricationId,
            });

          result = await apiPost<MutationResponse>(
            `/api/projects/${store.projectId}/fabrication/items`,
            payload,
          );
        } else {
          if (!store.itemId || !store.projectId) {
            throw new Error("No hay item seleccionado");
          }

          const payload: UpdateProjectFabricationItemInput =
            buildUpdateFabricationItem(values);

          result = await apiPut<MutationResponse>(
            `/api/projects/${store.projectId}/fabrication/items/${store.itemId}`,
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
          e instanceof Error
            ? e.message
            : "Error guardando item de fabricación";

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
    itemId: store.itemId,
    projectId: store.projectId,
    fabricationId: store.fabricationId,
    isSaving: store.isSaving,
    error: store.error,
    initialValues: store.initialValues,

    openCreate: store.openCreate,
    openUpdate: store.openUpdate,
    close,

    form,
    submit,
  };
}
