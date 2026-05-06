"use client";

import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {apiGet} from "@/app/lib/api.client";
import type {ProjectDocumentEntity} from "@/app/core/projects/documents/dto";
import {DOCUMENT_GROUPS} from "../constants/document-groups";
import {useProjectActivityStore} from "../../store/useProjectActivityStore";

type ReloadOptions = {
  silent?: boolean;
};

export function useProjectDocuments(projectId: string) {
  const router = useRouter();
  const [documents, setDocuments] = useState<ProjectDocumentEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const aliveRef = useRef(true);
  const notifyActivityChanged = useProjectActivityStore(
    (state) => state.notifyChanged,
  );

  const loadDocuments = useCallback(
    async (options?: ReloadOptions) => {
      const silent = options?.silent ?? false;

      if (!silent) {
        setLoading(true);
      }

      setError(null);

      try {
        const data = await apiGet<ProjectDocumentEntity[]>(
          `/api/projects/${projectId}/documents/upload`,
        );

        if (!aliveRef.current) return;
        setDocuments(data ?? []);
        notifyActivityChanged(projectId);
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
    [projectId, notifyActivityChanged],
  );

  useEffect(() => {
    aliveRef.current = true;
    void loadDocuments();

    return () => {
      aliveRef.current = false;
    };
  }, [loadDocuments]);

  const summary = useMemo(() => {
    const totalRequired = DOCUMENT_GROUPS.reduce(
      (acc, group) => acc + group.items.length,
      0,
    );

    const completed = DOCUMENT_GROUPS.reduce((acc, group) => {
      const availableInGroup = group.items.filter((item) =>
        documents.some(
          (document) =>
            document.type === item.type && document.status === "AVAILABLE",
        ),
      ).length;

      return acc + availableInGroup;
    }, 0);

    const pending = totalRequired - completed;
    const completionPct =
      totalRequired > 0 ? Math.round((completed / totalRequired) * 100) : 0;

    return {
      totalRequired,
      completed,
      pending,
      completionPct,
    };
  }, [documents]);

  const refresh = useCallback(async () => {
    await loadDocuments({silent: true});
    router.refresh();
  }, [loadDocuments, router]);

  return {
    documents,
    loading,
    error,
    summary,
    refresh,
    reloadDocuments: loadDocuments,
  };
}
