"use client";

import {useCallback, useEffect, useRef} from "react";
import type {BaseSyntheticEvent} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {apiPost, apiPut} from "@/app/lib/api.client";
import {
  projectInstallationItemFormSchema,
  type ProjectInstallationItemFormValues,
} from "@/app/core/projects/installation/schema";
import type {
  CreateProjectInstallationItemInput,
  UpdateProjectInstallationItemInput,
} from "@/app/core/projects/installation/dto";
import {
  buildCreateInstallationItem,
  buildUpdateInstallationItem,
} from "../mappers/project-installation.form";
import {useProjectInstallationItemFormStore} from "../store/installationItemForm.store";
import {useProjectActivityStore} from "../../store/useProjectActivityStore";

const defaultValues: ProjectInstallationItemFormValues = {
  name: "",
  description: null,
  status: "PENDING",
  responsible: null,
  plannedAt: null,
  completedAt: null,
  orderIndex: 0,
  notes: null,
};

type MutationResponse = {id: string};

export function useProjectInstallationItemForm() {
  const abortRef = useRef<AbortController | null>(null);
  const store = useProjectInstallationItemFormStore();
  const notifyChanged = useProjectActivityStore((state) => state.notifyChanged);
  const form = useForm<ProjectInstallationItemFormValues>({
    resolver: zodResolver(projectInstallationItemFormSchema),
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
    async (values: ProjectInstallationItemFormValues) => {
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      store.setSaving(true);
      store.setError(null);

      try {
        let result: MutationResponse;

        if (store.mode === "create") {
          if (!store.installationId || !store.projectId) {
            throw new Error("Faltan datos para crear la actividad");
          }

          const payload: CreateProjectInstallationItemInput =
            buildCreateInstallationItem({
              ...values,
              installationId: store.installationId,
            });

          result = await apiPost<MutationResponse>(
            `/api/projects/${store.projectId}/installation/items`,
            payload,
          );
        } else {
          if (!store.itemId || !store.projectId) {
            throw new Error("No hay actividad seleccionada");
          }

          const payload: UpdateProjectInstallationItemInput =
            buildUpdateInstallationItem(values);

          result = await apiPut<MutationResponse>(
            `/api/projects/${store.projectId}/installation/items/${store.itemId}`,
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
          e instanceof Error ? e.message : "Error guardando actividad";

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
    installationId: store.installationId,
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
