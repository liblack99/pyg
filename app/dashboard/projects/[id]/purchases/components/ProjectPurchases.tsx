"use client";

import {useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import Button from "@/app/components/ui/Button";
import CellSaveBadge from "@/app/components/ui/CellSaveBadge";
import type {ProcurementStatus} from "@/app/core/projects/purchases/dto";
import {ProjectPurchasesMetrics} from "./ProjectPurchasesMetrics";
import type {ProjectView} from "@/app/core/projects/dto";
import {getPurchasesMetrics} from "@/app/core/projects/purchases/domain/purchases-metrics";
import {ProjectPurchasesTable} from "./ProjectPurchasesTable";
import ErrorSection from "@/app/components/ui/ErrorSection";
import LoadingSection from "@/app/components/ui/LoadingSection";
import {useProjectPurchases} from "../hook/useProjectPurchases";

export type ProjectPurchaseItemUpdateInput = {
  status: ProcurementStatus;
  purchaseNotes?: string;
};

interface Props {
  project: ProjectView;
}

export function ProjectPurchases({project}: Props) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const {loading, error, items, globalSave, updateStatus} = useProjectPurchases(
    project.id,
  );

  const computed = useMemo(() => {
    return getPurchasesMetrics(project.spendingLimit65, items);
  }, [items, project.spendingLimit65]);

  const filteredItems = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return items;
    return items.filter((it) => it.description.toLowerCase().includes(s));
  }, [items, search]);

  if (loading) {
    return <LoadingSection message="Cargando compras…" />;
  }

  if (error) {
    return <ErrorSection message={error} />;
  }

  return (
    <section className="space-y-6" data-purpose="purchases-v1">
      <ProjectPurchasesMetrics metrics={computed} />

      <ProjectPurchasesTable
        items={filteredItems}
        search={search}
        onSearchChange={setSearch}
        committedAmount={computed.committedAmount}
        globalSave={globalSave}
        onStatusChange={updateStatus}
      />

      <div className="flex w-full items-center justify-end gap-4">
        <CellSaveBadge state={globalSave} />
        <Button
          variant="primary"
          onClick={() => router.refresh()}
          disabled={globalSave === "saving"}>
          {globalSave === "error" ? "Reintentar" : "Actualizar"}
        </Button>
      </div>
    </section>
  );
}
