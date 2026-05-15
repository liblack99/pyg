"use client";

import {useCallback, useEffect, useMemo, useState} from "react";
import {apiDelete, apiGet, apiPatch, apiPost, apiPut} from "@/app/lib/api.client";
import type {
  CreateProjectWarrantyCaseInput,
  ProjectWarrantyCaseListResult,
  ProjectWarrantyCaseView,
  ProjectWarrantySummary,
  UpdateProjectWarrantyCaseInput,
  UpdateProjectWarrantySummaryInput,
} from "@/app/core/projects/warranties/dto";
import {useProjectActivityStore} from "../../store/useProjectActivityStore";

type SupplierOption = {
  id: string;
  name: string;
};

type ReporterOption = {
  id: string;
  name: string;
};

type CaseDialogState =
  | {open: false; mode: "create"; selectedCase: null}
  | {
      open: true;
      mode: "create" | "edit";
      selectedCase: ProjectWarrantyCaseView | null;
    };

export function useProjectWarranty(projectId: string) {
  const [cases, setCases] = useState<ProjectWarrantyCaseView[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierOption[]>([]);
  const [reporters, setReporters] = useState<ReporterOption[]>([]);
  const [summary, setSummary] = useState<ProjectWarrantySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingCase, setSavingCase] = useState(false);
  const [savingSummary, setSavingSummary] = useState(false);
  const [deletingCaseId, setDeletingCaseId] = useState<string | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [caseDialog, setCaseDialog] = useState<CaseDialogState>({
    open: false,
    mode: "create",
    selectedCase: null,
  });
  const notifyChanged = useProjectActivityStore((state) => state.notifyChanged);
  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [warrantyData, suppliersData, reportersData, summaryData] =
        await Promise.all([
          apiGet<ProjectWarrantyCaseListResult>(
            `/api/projects/${projectId}/warranties`,
          ),
          apiGet<SupplierOption[]>("/api/suppliers"),
          apiGet<ReporterOption[]>("/api/users"),
          apiGet<ProjectWarrantySummary>(
            `/api/projects/${projectId}/warranties/summary`,
          ),
        ]);

      setCases(warrantyData.items);
      setSuppliers(suppliersData);
      setReporters(reportersData);
      setSummary(summaryData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const sortedCases = useMemo(
    () =>
      [...cases].sort(
        (a, b) =>
          new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime(),
      ),
    [cases],
  );

  const recomputeSummaryFromCases = useCallback(
    (
      nextCases: ProjectWarrantyCaseView[],
      currentSummary: ProjectWarrantySummary | null,
    ) => {
      if (!currentSummary) return currentSummary;

      const openCasesCount = nextCases.filter((item) =>
        ["OPEN", "IN_PROGRESS"].includes(item.status),
      ).length;

      const costTotal = nextCases.reduce((sum, item) => sum + item.realCost, 0);

      return {
        ...currentSummary,
        casesCount: nextCases.length,
        openCasesCount,
        costTotal,
      };
    },
    [],
  );

  const openCreate = useCallback(() => {
    setCaseDialog({
      open: true,
      mode: "create",
      selectedCase: null,
    });
  }, []);

  const openEdit = useCallback((item: ProjectWarrantyCaseView) => {
    setCaseDialog({
      open: true,
      mode: "edit",
      selectedCase: item,
    });
  }, []);

  const closeCaseDialog = useCallback(() => {
    if (savingCase) return;
    setCaseDialog({
      open: false,
      mode: "create",
      selectedCase: null,
    });
  }, [savingCase]);

  const updateSummary = useCallback(
    async (values: UpdateProjectWarrantySummaryInput) => {
      try {
        setSavingSummary(true);
        setError(null);

        const updated = await apiPut<ProjectWarrantySummary>(
          `/api/projects/${projectId}/warranties/summary`,
          values,
        );

        setSummary(updated);
        setSummaryOpen(false);
        notifyChanged(projectId);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error inesperado.");
        throw err;
      } finally {
        setSavingSummary(false);
      }
    },
    [projectId, notifyChanged],
  );

  const submitCase = useCallback(
    async (
      values: CreateProjectWarrantyCaseInput | UpdateProjectWarrantyCaseInput,
    ) => {
      try {
        setSavingCase(true);
        setError(null);

        if (caseDialog.mode === "create") {
          const created = await apiPost<ProjectWarrantyCaseView>(
            `/api/projects/${projectId}/warranties`,
            values,
          );

          setCases((prev) => {
            const nextCases = [created, ...prev];
            setSummary((current) =>
              recomputeSummaryFromCases(nextCases, current),
            );
            return nextCases;
          });
        } else {
          if (!caseDialog.selectedCase) {
            throw new Error("No se encontro el caso seleccionado.");
          }

          const updated = await apiPatch<ProjectWarrantyCaseView>(
            `/api/projects/${projectId}/warranties/${caseDialog.selectedCase.id}`,
            values,
          );

          setCases((prev) => {
            const nextCases = prev.map((item) =>
              item.id === updated.id ? updated : item,
            );
            setSummary((current) =>
              recomputeSummaryFromCases(nextCases, current),
            );
            return nextCases;
          });
        }

        setCaseDialog({
          open: false,
          mode: "create",
          selectedCase: null,
        });
        notifyChanged(projectId);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error inesperado.");
        throw err;
      } finally {
        setSavingCase(false);
      }
    },
    [caseDialog, projectId, recomputeSummaryFromCases, notifyChanged],
  );

  const deleteCase = useCallback(
    async (caseId: string) => {
      try {
        setDeletingCaseId(caseId);
        setError(null);

        await apiDelete(`/api/projects/${projectId}/warranties/${caseId}`);

        setCases((prev) => {
          const nextCases = prev.filter((item) => item.id !== caseId);
          setSummary((current) => recomputeSummaryFromCases(nextCases, current));
          return nextCases;
        });
        notifyChanged(projectId);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error inesperado.");
        throw err;
      } finally {
        setDeletingCaseId(null);
      }
    },
    [projectId, recomputeSummaryFromCases, notifyChanged],
  );

  return {
    cases: sortedCases,
    suppliers,
    reporters,
    summary,
    loading,
    error,
    savingCase,
    savingSummary,
    deletingCaseId,
    summaryOpen,
    caseDialog,
    setSummaryOpen,
    openCreate,
    openEdit,
    closeCaseDialog,
    updateSummary,
    submitCase,
    deleteCase,
    reload: loadAll,
  };
}
