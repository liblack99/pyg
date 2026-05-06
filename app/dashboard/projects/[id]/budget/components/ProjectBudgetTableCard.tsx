"use client";

import type {ProjectBudgetItemRow} from "@/app/core/projects/budget/dto";
import {
  DataTable,
  type ColumnDef,
} from "@/app/components/data-display/DataTable";
import {CurrencyInput} from "@/app/components/form/base/CurrencyInput";
import {moneyCOP} from "@/app/utils/moneyFormatted";
import {Select} from "@/app/components/form/base";
import {ProjectBudgetTable} from "./ProjectBudgetTable";
import type {Supplier} from "@/app/core/supplier/dto";
import type {GlobalSaveState} from "@/app/components/ui/CellSaveBadge";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  items: ProjectBudgetItemRow[];
  suppliers: Supplier[];
  globalSave: GlobalSaveState;
  budgetCurrent: number;
  onSupplierChange: (itemId: string, supplierId: string | null) => void;
  onUnitCostChange: (itemId: string, value: number) => void;
  onUnitCostBlur: (itemId: string) => void;
};

export function ProjectBudgetTableCard({
  search,
  onSearchChange,
  items,
  suppliers,
  globalSave,
  budgetCurrent,
  onSupplierChange,
  onUnitCostChange,
  onUnitCostBlur,
}: Props) {
  const columns: ColumnDef<ProjectBudgetItemRow>[] = [
    {
      key: "description",
      header: "Ítem / Descripción",
      render: (it) => (
        <div>
          <div className="text-sm font-semibold text-slate-800">
            {it.description}
          </div>
          {it.notes ? (
            <div className="text-[10px] text-slate-400">{it.notes}</div>
          ) : null}
        </div>
      ),
    },
    {
      key: "supplier",
      header: "Proveedor",
      render: (it) => (
        <div className="w-44">
          <Select
            placeholder="Sin proveedor"
            options={[
              {label: "— Sin proveedor —", value: ""},
              ...suppliers.map((s) => ({
                label: s.name,
                value: s.id,
              })),
            ]}
            onChange={(e) => onSupplierChange(it.id, e.target.value)}
            error={globalSave === "error"}
          />

          {!suppliers.length && it.supplierNameSnapshot ? (
            <div className="mt-1 text-[10px] text-slate-400">
              {it.supplierNameSnapshot}
            </div>
          ) : null}
        </div>
      ),
    },
    {
      key: "quantity",
      header: "Cantidad",
      className: "w-10",
      render: (it) => (
        <div className="text-sm text-slate-600">{it.quantity}</div>
      ),
    },
    {
      key: "unitCost",
      header: "Costo Unit.",
      className: "w-[160px]",
      render: (it) => (
        <div className="w-36">
          <CurrencyInput
            value={it.unitCost ?? 0}
            error={globalSave === "error"}
            onChange={(value) => onUnitCostChange(it.id, value)}
            onBlur={() => onUnitCostBlur(it.id)}
          />
        </div>
      ),
    },
    {
      key: "total",
      header: "Total",
      className: "w-[500px]", // Ancho fijo y alineado a la derecha
      render: (it) => (
        <div className="font-semibold text-slate-800">
          {moneyCOP(it.totalCost)}
        </div>
      ),
    },
  ];

  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Presupuesto interno
        </h3>

        <div className="relative">
          <input
            className="w-56 rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            placeholder="Buscar ítem…"
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <svg
            className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* DataTable */}
      {/* <DataTable
        columns={columns}
        rows={items}
        rowKey={(row) => row.id}
        emptyText="No hay ítems que coincidan con tu búsqueda."
        footerLeft={
          <div className="flex w-full px-6 py-4 items-center gap-4  justify-end text-sm font-semibold text-slate-500">
            Subtotal presupuesto:{" "}
            <span className="text-lg  font-bold text-blue-600">
              {moneyCOP(budgetCurrent)}
            </span>
          </div>
        }
      /> */}
      <ProjectBudgetTable
        items={items}
        suppliers={suppliers}
        globalSave={globalSave}
        budgetCurrent={budgetCurrent}
        onSupplierChange={onSupplierChange}
        onUnitCostChange={onUnitCostChange}
        onUnitCostBlur={onUnitCostBlur}
      />
    </div>
  );
}
