"use client";

import Button from "@/app/components/ui/Button";
import {ProjectBudgetOverviewCards} from "./ProjectBudgetOverviewCards";
import {computeProjectBudgetFromItems} from "@/app/core/projects/budget/domain/project-budget.metrics";
import {ProjectView} from "@/app/core/projects/dto";
import {ProjectBudgetTableCard} from "./ProjectBudgetTableCard";
import {ProjectBudgetExecutionProgress} from "./ProjectBudgetExecutionProgress";
import LoadingSection from "@/app/components/ui/LoadingSection";
import ErrorSection from "@/app/components/ui/ErrorSection";
import CellSaveBadge from "@/app/components/ui/CellSaveBadge";
import {useState, useMemo} from "react";
import {useProjectBudget} from "../hooks/useProjectBudget";

interface Prop {
  project: ProjectView;
}

export function ProjectBudget({project}: Prop) {
  const [search, setSearch] = useState("");
  const {
    loading,
    error,
    items,
    suppliers,
    globalSave,
    updateSupplier,
    updateUnitCostDraft,
    commitUnitCost,
    router,
  } = useProjectBudget(project.id);

  const computed = useMemo(() => {
    return computeProjectBudgetFromItems({
      totalQuotationSinIVA: project.totalQuotationSinIVA,
      spendingLimit65: project.spendingLimit65,
      items,
    });
  }, [project.totalQuotationSinIVA, project.spendingLimit65, items]);

  const filteredItems = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return items;
    return items.filter((it) => it.description.toLowerCase().includes(s));
  }, [items, search]);

  if (loading) {
    return <LoadingSection message="Cargando presupuesto…" />;
  }

  if (error) {
    return <ErrorSection message={error} />;
  }

  return (
    <section className="space-y-6" data-purpose="budget-v1">
      <ProjectBudgetOverviewCards
        limit65={computed.limit65}
        budgetCurrent={computed.budgetCurrent}
        balance={computed.balance}
        executedPct={computed.executedPct}
      />

      <ProjectBudgetTableCard
        search={search}
        onSearchChange={setSearch}
        items={filteredItems}
        suppliers={suppliers}
        globalSave={globalSave}
        budgetCurrent={computed.budgetCurrent}
        onSupplierChange={updateSupplier}
        onUnitCostChange={updateUnitCostDraft}
        onUnitCostBlur={commitUnitCost}
      />

      <ProjectBudgetExecutionProgress executedPct={computed.executedPct} />

      <div className="flex w-full items-center justify-end gap-4">
        {CellSaveBadge({state: globalSave})}
        <Button
          variant="primary"
          onClick={() => router.refresh()}
          disabled={globalSave === "saving"}>
          {globalSave === "error" ? "Reintentar" : "Guardar"}
        </Button>
      </div>
    </section>
  );
}
