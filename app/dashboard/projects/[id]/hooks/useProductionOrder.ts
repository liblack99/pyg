"use client";

import {useCallback, useEffect, useMemo, useRef} from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {apiPost} from "@/app/lib/api.client";
import {
  productionOrderFormSchema,
  type ProductionOrderFormValues,
} from "@/app/core/projects/orderPdf/schema/production-order.schema";
import type {ProductionOrderRecord} from "@/app/core/projects/orderPdf/dto";

import {useProductionOrderStore} from "@/app/dashboard/projects/[id]/store/productionOder.store";
import {useProjectActivityStore} from "../store/useProjectActivityStore";

// defaults para RHF
const defaultValues: ProductionOrderFormValues = {
  color: "",
  deliveryDateText: "",
  observation: "",
};

export function useProductionOrder() {
  const router = useRouter();
  const abortRef = useRef<AbortController | null>(null);
  const submittingRef = useRef(false);

  const store = useProductionOrderStore();
  const notifyChanged = useProjectActivityStore((state) => state.notifyChanged);
  const form = useForm<ProductionOrderFormValues>({
    resolver: zodResolver(productionOrderFormSchema),
    defaultValues,
    mode: "onSubmit",
  });

  // Cuando se abre, cargamos initialValues en el form
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

  const genaretOp = useCallback(
    async (values: ProductionOrderFormValues) => {
      if (submittingRef.current || store.isSaving) {
        return;
      }

      const id = store.id;
      if (!id) throw new Error("No hay proyecto seleccionado");

      submittingRef.current = true;
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      store.setSaving(true);
      store.setError(null);

      try {
        await apiPost<ProductionOrderRecord>(
          `/api/projects/${id}/productionOrder`,
          values,
        );

        store.setSaving(false);
        store.setError(null);
      } catch (e: unknown) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        const msg =
          e instanceof Error
            ? e.message
            : "Error al general la orden de production";
        store.setSaving(false);
        store.setError(msg);
        throw e;
      } finally {
        submittingRef.current = false;
        router.refresh();
        store.close();
        notifyChanged(store.id ?? "");
      }
    },
    [store, router, notifyChanged],
  );

  const submit = useMemo(() => form.handleSubmit(genaretOp), [form, genaretOp]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  return {
    // estado global
    open: store.open,
    id: store.id,
    isSaving: store.isSaving,
    error: store.error,
    initialValues: store.initialValues,

    openById: store.openById,
    close,

    form,
    submit,
  };
}
