"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import {apiGet} from "@/app/lib/api.client";
import type {ProjectFabricationDetail} from "@/app/core/projects/fabrication/dto";

type ReloadOptions = {
  silent?: boolean;
};

export function useProjectFabrication(projectId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fabrication, setFabrication] =
    useState<ProjectFabricationDetail | null>(null);

  const aliveRef = useRef(true);

  const loadFabrication = useCallback(
    async (options?: ReloadOptions) => {
      const silent = options?.silent ?? false;

      if (!silent) {
        setLoading(true);
      }

      setError(null);

      try {
        const res = await apiGet<ProjectFabricationDetail>(
          `/api/projects/${projectId}/fabrication`,
        );

        if (!aliveRef.current) return;
        setFabrication(res);
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
    void loadFabrication();

    return () => {
      aliveRef.current = false;
    };
  }, [loadFabrication]);

  return {
    loading,
    error,
    fabrication,
    setFabrication,
    reloadFabrication: loadFabrication,
  };
}
