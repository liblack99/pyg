"use client";

import {useCallback, useEffect, useRef} from "react";
import {useRouter} from "next/navigation";
import {apiPut} from "@/app/lib/api.client";
import {useQuotationAddNoteStore} from "@/app/dashboard/quotations/[id]/ui/quotationAddNote.store"; // ajusta path

export function useQuotationAddNote() {
  const router = useRouter();
  const abortRef = useRef<AbortController | null>(null);

  const open = useQuotationAddNoteStore((s) => s.open);
  const id = useQuotationAddNoteStore((s) => s.id);
  const isSaving = useQuotationAddNoteStore((s) => s.isSaving);
  const error = useQuotationAddNoteStore((s) => s.error);
  const initialNote = useQuotationAddNoteStore((s) => s.initialNote);

  const openById = useQuotationAddNoteStore((s) => s.openById);
  const storeClose = useQuotationAddNoteStore((s) => s.close);
  const setSaving = useQuotationAddNoteStore((s) => s.setSaving);
  const setError = useQuotationAddNoteStore((s) => s.setError);

  const close = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    storeClose();
  }, [storeClose]);

  const addNote = useCallback(
    async (note: string) => {
      if (!id) throw new Error("No hay cotización seleccionada");

      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      setSaving(true);
      setError(null);

      try {
        const res = await apiPut<string>(`/api/quotations/${id}/note`, note);

        setSaving(false);
        setError(null);
        return res;
      } catch (e: unknown) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        const msg = e instanceof Error ? e.message : "Error guardando nota";
        setSaving(false);
        setError(msg);
        throw e;
      } finally {
        router.refresh();
      }
    },
    [id, router, setSaving, setError],
  );

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  return {
    open,
    id,
    isSaving,
    error,
    initialNote,
    openById,
    close,
    addNote,
  };
}
