"use client";

import {useCallback, useEffect, useState} from "react";
import {apiGet, apiGetFile, apiPost} from "@/app/lib/api.client";
import {downloadBlob} from "@/app/lib/downloadBlob";
import type {
  ProductionOrderListItem,
  ProductionOrderRecord,
} from "@/app/core/projects/orderPdf/dto";
import {useProductionOrderViewStore} from "../store/productionOrderView.store";

export function useProductionOrderHistory() {
  const listOpen = useProductionOrderViewStore((s) => s.listOpen);
  const detailOpen = useProductionOrderViewStore((s) => s.detailOpen);
  const projectId = useProductionOrderViewStore((s) => s.projectId);
  const selectedId = useProductionOrderViewStore((s) => s.selectedId);
  const closeList = useProductionOrderViewStore((s) => s.closeList);
  const closeDetail = useProductionOrderViewStore((s) => s.closeDetail);
  const openDetail = useProductionOrderViewStore((s) => s.openDetail);

  const [items, setItems] = useState<ProductionOrderListItem[]>([]);
  const [selected, setSelected] = useState<ProductionOrderRecord | null>(null);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [approving, setApproving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    if (!projectId) return;

    setLoadingList(true);
    setError(null);

    try {
      const data = await apiGet<ProductionOrderListItem[]>(
        `/api/projects/${projectId}/productionOrder`,
      );
      setItems(data);
    } catch (e: unknown) {
      setError(
        e instanceof Error
          ? e.message
          : "No se pudo cargar la lista de ordenes de produccion",
      );
    } finally {
      setLoadingList(false);
    }
  }, [projectId]);

  const fetchDetail = useCallback(async () => {
    if (!projectId || !selectedId) return;

    setLoadingDetail(true);
    setError(null);

    try {
      const data = await apiGet<ProductionOrderRecord>(
        `/api/projects/${projectId}/productionOrder/${selectedId}`,
      );
      setSelected(data);
    } catch (e: unknown) {
      setError(
        e instanceof Error
          ? e.message
          : "No se pudo cargar la orden de produccion",
      );
    } finally {
      setLoadingDetail(false);
    }
  }, [projectId, selectedId]);

  const download = useCallback(
    async (productionOrderId: string) => {
      if (!projectId || downloading) return;

      setDownloading(true);
      setError(null);

      try {
        const {blob, filename} = await apiGetFile(
          `/api/projects/${projectId}/productionOrder/${productionOrderId}/pdf`,
        );

        console.log("Blob descargado:", blob);

        downloadBlob({
          blob,
          filename:
            filename ??
            `orden-produccion-${new Date().toISOString().slice(0, 10)}.pdf`,
        });
      } catch (e: unknown) {
        setError(
          e instanceof Error
            ? e.message === "Failed to fetch"
              ? "La descarga fallo por red del navegador. Intenta de nuevo."
              : e.message
            : "No se pudo descargar la orden de produccion",
        );
      } finally {
        setDownloading(false);
      }
    },
    [projectId, downloading],
  );

  const approve = useCallback(async () => {
    if (!projectId || !selectedId) return;

    setApproving(true);
    setError(null);

    try {
      const data = await apiPost<ProductionOrderRecord>(
        `/api/projects/${projectId}/productionOrder/${selectedId}/approve`,
        {},
      );

      setSelected(data);
      setItems((prev) =>
        prev.map((item) =>
          item.id === data.id
            ? {
                ...item,
                reviewedBy: data.payload.reviewedBy ?? null,
                authorizedBy: data.payload.authorizedBy ?? null,
              }
            : item,
        ),
      );
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "No se pudo aprobar la orden");
    } finally {
      setApproving(false);
    }
  }, [projectId, selectedId]);

  useEffect(() => {
    if (listOpen) {
      fetchList();
    }
  }, [listOpen, fetchList]);

  useEffect(() => {
    if (detailOpen) {
      fetchDetail();
    } else {
      setSelected(null);
    }
  }, [detailOpen, fetchDetail]);

  return {
    listOpen,
    detailOpen,
    projectId,
    selectedId,
    items,
    selected,
    loadingList,
    loadingDetail,
    approving,
    downloading,
    error,
    openDetail,
    closeList,
    closeDetail,
    refreshList: fetchList,
    approve,
    download,
  };
}
