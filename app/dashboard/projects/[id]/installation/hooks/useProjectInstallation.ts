"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import {apiGet} from "@/app/lib/api.client";
import type {ProjectInstallationDetail} from "@/app/core/projects/installation/dto";

type ReloadOptions = {
  silent?: boolean;
};

export function useProjectInstallation(projectId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [installation, setInstallation] =
    useState<ProjectInstallationDetail | null>(null);

  const aliveRef = useRef(true);

  const loadInstallation = useCallback(
    async (options?: ReloadOptions) => {
      const silent = options?.silent ?? false;

      if (!silent) {
        setLoading(true);
      }

      setError(null);

      try {
        const res = await apiGet<ProjectInstallationDetail>(
          `/api/projects/${projectId}/installation`,
        );

        if (!aliveRef.current) return;
        setInstallation(res);
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
    void loadInstallation();

    return () => {
      aliveRef.current = false;
    };
  }, [loadInstallation]);

  return {
    loading,
    error,
    installation,
    setInstallation,
    reloadInstallation: loadInstallation,
  };
}
