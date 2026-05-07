"use client";

import {useCallback, useEffect, useRef} from "react";
import type {BaseSyntheticEvent} from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {apiPost, apiPut} from "@/app/lib/api.client";
import {
  ProjectCreateSchema,
  ProjectFormSchema,
  type ProjectFormValues,
  type ProjectUpdateValues,
} from "@/app/core/projects/schema/project.schema";
import {useProjectFormStore} from "../store/projectForm.store";

const defaultValues: ProjectFormValues = {
  quotationId: "",
  status: undefined,
  kind: undefined,

  procurementDueAt: null,
  procurementDoneAt: null,

  fabricationDueAt: null,
  fabricationDoneAt: null,

  installationDueAt: null,
  installationDoneAt: null,

  deliveryDueAt: null,
  deliveryDoneAt: null,
};

type MutationResponse = {id: string; code: string};

function toUpdateValues(values: ProjectFormValues): ProjectUpdateValues {
  return {
    status: values.status,
    kind: values.kind,
    procurementDueAt: values.procurementDueAt,
    procurementDoneAt: values.procurementDoneAt,
    fabricationDueAt: values.fabricationDueAt,
    fabricationDoneAt: values.fabricationDoneAt,
    installationDueAt: values.installationDueAt,
    installationDoneAt: values.installationDoneAt,
    deliveryDueAt: values.deliveryDueAt,
    deliveryDoneAt: values.deliveryDoneAt,
  };
}

export function useProjectForm() {
  const router = useRouter();
  const abortRef = useRef<AbortController | null>(null);
  const store = useProjectFormStore();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues,
    mode: "onSubmit",
  });

  useEffect(() => {
    if (!store.open) return;

    form.reset({
      ...defaultValues,
      ...store.initialValues,
      quotationId: store.quotationId ?? "",
    });
  }, [store.open, store.initialValues, store.quotationId, form]);

  const close = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    store.close();
    form.reset(defaultValues);
  }, [store, form]);

  const onSubmitValues = useCallback(
    async (values: ProjectFormValues) => {
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      store.setSaving(true);
      store.setError(null);

      try {
        let result: MutationResponse;

        if (store.mode === "create") {
          const createValues = ProjectCreateSchema.parse(values);
          result = await apiPost<MutationResponse>(
            "/api/projects",
            createValues,
          );
        } else {
          if (!store.projectId) {
            throw new Error("No hay proyecto seleccionado");
          }

          result = await apiPut<MutationResponse>(
            `/api/projects/${store.projectId}`,
            toUpdateValues(values),
          );
        }

        store.setSaving(false);
        store.setError(null);

        router.refresh();
        store.close();
        form.reset(defaultValues);
        router.push("/dashboard/projects");

        return result;
      } catch (e: unknown) {
        if (e instanceof DOMException && e.name === "AbortError") return;

        const msg = e instanceof Error ? e.message : "Error guardando proyecto";

        store.setSaving(false);
        store.setError(msg);
        throw e;
      }
    },
    [store, router, form],
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
    projectId: store.projectId,
    quotationId: store.quotationId,
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
