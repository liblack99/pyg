"use client";

import {useCallback, useEffect, useRef} from "react";
import type {Quotation} from "@/app/core/quotations/dto";
import {apiGet} from "@/app/lib/api.client";
import {useQuotationViewStore} from "@/app/dashboard/quotations/[id]/ui/quotationView.store"; // ajusta path

export function useQuotationView() {
  const abortRef = useRef<AbortController | null>(null);

  const open = useQuotationViewStore((s) => s.open);
  const id = useQuotationViewStore((s) => s.id);
  const isLoading = useQuotationViewStore((s) => s.isLoading);
  const error = useQuotationViewStore((s) => s.error);
  const quotation = useQuotationViewStore((s) => s.data);

  const storeOpenById = useQuotationViewStore((s) => s.openById);
  const closeStore = useQuotationViewStore((s) => s.close);

  const setLoading = useQuotationViewStore((s) => s.setLoading);
  const setError = useQuotationViewStore((s) => s.setError);
  const setData = useQuotationViewStore((s) => s.setData);

  console.log("data", quotation);

  const close = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    closeStore();
  }, [closeStore]);

  const fetchById = useCallback(
    async (qid: string) => {
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      setLoading(true);
      setError(null);
      setData(null);

      try {
        // si tu apiGet soporta signal, pásalo; si no, quítalo
        const data = await apiGet<Quotation>(`/api/quotations/${qid}`);

        setLoading(false);
        setError(null);
        setData(data);

        return data;
      } catch (e: unknown) {
        if (e instanceof DOMException && e.name === "AbortError") return;

        const msg =
          e instanceof Error ? e.message : "Error cargando cotización";
        setLoading(false);
        setError(msg);
        setData(null);
      }
    },
    [setLoading, setError, setData],
  );

  const openById = useCallback(
    async (qid: string) => {
      storeOpenById(qid);
      await fetchById(qid);
    },
    [storeOpenById, fetchById],
  );

  const reload = useCallback(async () => {
    const qid = id;
    if (!qid) return;
    await fetchById(qid);
  }, [id, fetchById]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  return {
    open,
    id,
    isLoading,
    error,
    quotation,
    openById,
    close,
    reload,
  };
}
