"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import {apiGet} from "@/app/lib/api.client";
import type {ProjectDocumentEntity} from "@/app/core/projects/documents/dto";
import type {ProjectFinanceView} from "@/app/core/projects/finance/dto";

type ReloadOptions = {
  silent?: boolean;
};

export function useProjectFinance(projectId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [finance, setFinance] = useState<ProjectFinanceView | null>(null);
  const [documents, setDocuments] = useState<ProjectDocumentEntity[]>([]);
  const aliveRef = useRef(true);

  const loadFinance = useCallback(
    async (options?: ReloadOptions) => {
      const silent = options?.silent ?? false;

      if (!silent) {
        setLoading(true);
      }

      setError(null);

      try {
        const [financeRes, documentsRes] = await Promise.all([
          apiGet<ProjectFinanceView>(`/api/projects/${projectId}/finance`),
          apiGet<ProjectDocumentEntity[]>(`/api/projects/${projectId}/documents/upload`),
        ]);

        if (!aliveRef.current) return;
        setFinance(financeRes);
        setDocuments(documentsRes);
      } catch (e: unknown) {
        if (!aliveRef.current) return;
        const message = e instanceof Error ? e.message : "Error desconocido";
        setError(message);
      } finally {
        if (!aliveRef.current) return;
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [projectId],
  );

  useEffect(() => {
    aliveRef.current = true;
    void loadFinance();

    return () => {
      aliveRef.current = false;
    };
  }, [loadFinance]);

  return {
    loading,
    error,
    finance,
    documents,
    reloadFinance: loadFinance,
  };
}
