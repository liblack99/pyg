import {useState, useRef, useEffect} from "react";
import {useRouter} from "next/navigation";
import {apiGet, apiPut} from "@/app/lib/api.client";
import type {GlobalSaveState} from "@/app/components/ui/CellSaveBadge";
import type {Supplier} from "@/app/core/supplier/dto";
import type {
  ProjectBudgetItemRow,
  ProjectBudgetItemUpdateInput,
} from "@/app/core/projects/budget/dto";
import {useProjectActivityStore} from "../../store/useProjectActivityStore";

export function useProjectBudget(projectId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ProjectBudgetItemRow[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [globalSave, setGlobalSave] = useState<GlobalSaveState>("idle");

  const notifyChanged = useProjectActivityStore((state) => state.notifyChanged);

  const router = useRouter();
  const saveTimerRef = useRef<number | null>(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [budgetRes, suppliersRes] = await Promise.all([
          apiGet<ProjectBudgetItemRow[]>(`/api/projects/${projectId}/budget`),
          apiGet<Supplier[]>(`/api/suppliers`),
        ]);

        if (!alive) return;

        setItems(budgetRes ?? []);
        setSuppliers(suppliersRes ?? []);
      } catch (e: unknown) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Error desconocido");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();

    return () => {
      alive = false;
      window.clearTimeout(saveTimerRef.current ?? undefined);
    };
  }, [projectId]);

  async function patchItem(
    itemId: string,
    patch: ProjectBudgetItemUpdateInput,
  ) {
    setGlobalSave("saving");

    try {
      const res = await apiPut(
        `/api/projects/${projectId}/budget/${itemId}`,
        patch,
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
      console.error(e);
      setGlobalSave("error");

      window.clearTimeout(saveTimerRef.current ?? undefined);
      saveTimerRef.current = window.setTimeout(() => {
        setGlobalSave("idle");
      }, 1500);
    }
  }

  function updateSupplier(itemId: string, supplierId: string | null) {
    const name = suppliers.find((s) => s.id === supplierId)?.name ?? null;

    setItems((arr) =>
      arr.map((x) =>
        x.id === itemId
          ? {
              ...x,
              supplierId,
              supplierNameSnapshot: name,
            }
          : x,
      ),
    );

    void patchItem(itemId, {supplierId});
  }

  function updateUnitCostDraft(itemId: string, value: number) {
    setItems((arr) =>
      arr.map((x) => {
        if (x.id !== itemId) return x;

        const quantity = Number(x.quantity ?? 0);
        const totalCost = quantity * value;

        return {
          ...x,
          unitCost: value,
          totalCost,
        };
      }),
    );
  }

  function commitUnitCost(itemId: string) {
    const item = items.find((x) => x.id === itemId);
    if (!item) return;

    void patchItem(itemId, {unitCost: item.unitCost ?? 0});
  }

  return {
    loading,
    error,
    items,
    suppliers,
    globalSave,
    updateSupplier,
    updateUnitCostDraft,
    commitUnitCost,
    router,
  };
}
