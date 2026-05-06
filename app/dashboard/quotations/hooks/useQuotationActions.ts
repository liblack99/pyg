// app/dashboard/quotations/[id]/hooks/useQuotationActions.ts
"use client";

import {useState} from "react";
import {apiPost, apiPut, apiDelete} from "@/app/lib/api.client";
import {useRouter} from "next/navigation";

export type ActionState = {
  isPending: boolean;
  error: string | null;
};

type CreateQuotationResponse = {
  id: string;
  numberQuotation: string;
  status: string;
};

export function useQuotationActions() {
  const [state, setState] = useState<ActionState>({
    isPending: false,
    error: null,
  });
  const router = useRouter();

  const run = async <T>(fn: () => Promise<T>): Promise<T> => {
    setState({isPending: true, error: null});
    try {
      const res = await fn();
      setState({isPending: false, error: null});
      router.refresh();
      return res;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error inesperado";
      setState({isPending: false, error: msg});
      throw e;
    }
  };

  return {
    state,
    createDraft: (payload: unknown) =>
      run(() =>
        apiPost<CreateQuotationResponse>("/api/quotations/draft", payload),
      ),
    updateDraft: (id: string, payload: unknown) =>
      run(() => apiPut(`/api/quotations/${id}`, payload)),
    duplicateDraft: (id: string) =>
      run(() => apiPost(`/api/quotations/${id}/duplicate`, {})),
    send: (id: string) => run(() => apiPost(`/api/quotations/${id}/send`, {})),
    approve: (id: string) =>
      run(() => apiPost(`/api/quotations/${id}/approve`, {})),
    reject: (id: string) =>
      run(() => apiPost(`/api/quotations/${id}/reject`, {})),
    cancel: (id: string) =>
      run(() => apiPost(`/api/quotations/${id}/cancel`, {})),
    deleteDraft: async (id: string) => {
      const ok = window.confirm("¿Seguro que deseas eliminar este producto?");
      if (!ok) return;
      return run(() => apiDelete(`/api/quotations/${id}`));
    },
  };
}
