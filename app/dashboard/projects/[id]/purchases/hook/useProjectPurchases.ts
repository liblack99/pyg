"use client";

import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {apiGet, apiPut} from "@/app/lib/api.client";
import type {GlobalSaveState} from "@/app/components/ui/CellSaveBadge";
import type {
  ProjectShoppingItem,
  ProcurementStatus,
} from "@/app/core/projects/purchases/dto";
import {applyProcurementStatus} from "@/app/core/projects/purchases/domain/purschases-apply-status";
import {useProjectActivityStore} from "../../store/useProjectActivityStore";

export type ProjectPurchaseItemUpdateInput = {
  status: ProcurementStatus;
  purchaseNotes?: string;
};

export function useProjectPurchases(projectId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ProjectShoppingItem[]>([]);
  const [globalSave, setGlobalSave] = useState<GlobalSaveState>("idle");
  const notifyChanged = useProjectActivityStore((state) => state.notifyChanged);

  const saveTimerRef = useRef<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await apiGet<ProjectShoppingItem[]>(
          `/api/projects/${projectId}/shopping`,
        );

        if (!alive) return;
        setItems(res ?? []);
      } catch (e: unknown) {
        if (!alive) return;
        const message = e instanceof Error ? e.message : "Error desconocido";
        setError(message);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    void load();

    return () => {
      alive = false;
      window.clearTimeout(saveTimerRef.current ?? undefined);
    };
  }, [projectId]);

  async function patchItem(
    itemId: string,
    patch: ProjectPurchaseItemUpdateInput,
  ) {
    setGlobalSave("saving");

    const cleanPatch =
      patch.purchaseNotes === undefined
        ? {status: patch.status, purchaseNotes: null}
        : {status: patch.status, purchaseNotes: patch.purchaseNotes};

    try {
      const res = await apiPut(
        `/api/projects/${projectId}/shopping/${itemId}`,
        cleanPatch,
      );

      if (!res) throw new Error("No se pudo guardar");

      setGlobalSave("saved");

      window.clearTimeout(saveTimerRef.current ?? undefined);
      saveTimerRef.current = window.setTimeout(() => {
        setGlobalSave("idle");
      }, 900);

      router.refresh();
      notifyChanged(projectId);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Error desconocido";
      console.error("Error al guardar compra:", message);

      setGlobalSave("error");

      window.clearTimeout(saveTimerRef.current ?? undefined);
      saveTimerRef.current = window.setTimeout(() => {
        setGlobalSave("idle");
      }, 1500);
    }
  }

  function updateStatus(itemId: string, status: ProcurementStatus) {
    setItems((arr) =>
      arr.map((x) => (x.id === itemId ? applyProcurementStatus(x, status) : x)),
    );

    void patchItem(itemId, {status});
  }

  return {
    loading,
    error,
    items,
    globalSave,
    updateStatus,
    router,
  };
}
