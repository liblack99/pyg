"use client";

import {useCallback, useEffect, useState} from "react";
import {apiGet, apiPatch} from "@/app/lib/api.client";
import type {
  ProjectAlertView,
  ProjectEventView,
} from "@/app/core/projects/activity/dto";
import {useProjectActivityStore} from "../store/useProjectActivityStore";

export function useProjectActivity(projectId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<ProjectEventView[]>([]);
  const [alerts, setAlerts] = useState<ProjectAlertView[]>([]);
  const [savingAlertId, setSavingAlertId] = useState<string | null>(null);

  // 🔥 Escucha cambios globales por proyecto
  const activityVersion = useProjectActivityStore(
    (state) => state.versions[projectId] ?? 0,
  );

  const refreshLatestActivity = useCallback(async () => {
    try {
      const [latestEvents, latestAlerts] = await Promise.all([
        apiGet<ProjectEventView[]>(`/api/projects/${projectId}/events?limit=1`),
        apiGet<ProjectAlertView[]>(`/api/projects/${projectId}/alerts?limit=1`),
      ]);

      const event = latestEvents?.[0];
      const alert = latestAlerts?.[0];

      if (event) {
        setEvents((prev) => {
          if (prev.some((item) => item.id === event.id)) return prev;
          return [event, ...prev].slice(0, 8);
        });
      }

      if (alert) {
        setAlerts((prev) => {
          if (prev.some((item) => item.id === alert.id)) return prev;
          return [alert, ...prev].slice(0, 6);
        });
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    }
  }, [projectId]);

  // 🔥 Se dispara cuando cualquier módulo notifica cambio
  useEffect(() => {
    if (activityVersion === 0) return;
    void refreshLatestActivity();
  }, [activityVersion, refreshLatestActivity]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [eventsRes, alertsRes] = await Promise.all([
        apiGet<ProjectEventView[]>(`/api/projects/${projectId}/events?limit=4`),
        apiGet<ProjectAlertView[]>(`/api/projects/${projectId}/alerts?limit=4`),
      ]);

      setEvents(eventsRes ?? []);
      setAlerts(alertsRes ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    void load();
  }, [load]);

  const resolveAlert = useCallback(
    async (alertId: string) => {
      setSavingAlertId(alertId);
      try {
        await apiPatch(
          `/api/projects/${projectId}/alerts/${alertId}/resolve`,
          {},
        );
        setAlerts((prev) => prev.filter((item) => item.id !== alertId));
      } finally {
        setSavingAlertId(null);
      }
    },
    [projectId],
  );

  const dismissAlert = useCallback(
    async (alertId: string) => {
      setSavingAlertId(alertId);
      try {
        await apiPatch(
          `/api/projects/${projectId}/alerts/${alertId}/dismiss`,
          {},
        );
        setAlerts((prev) => prev.filter((item) => item.id !== alertId));
      } finally {
        setSavingAlertId(null);
      }
    },
    [projectId],
  );

  return {
    loading,
    error,
    events,
    alerts,
    savingAlertId,
    reloadActivity: load,
    resolveAlert,
    dismissAlert,
  };
}
