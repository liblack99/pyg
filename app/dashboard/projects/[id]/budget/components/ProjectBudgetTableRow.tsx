"use client";

import {useState} from "react";
import type {ProjectBudgetItemRow} from "@/app/core/projects/budget/dto";
import {moneyCOP} from "@/app/utils/moneyFormatted";
import {CurrencyInput} from "@/app/components/form/base/CurrencyInput";
import {SupplierInfoCard} from "./SupplierInfoCard";
import type {Supplier} from "@/app/core/supplier/dto";
import type {GlobalSaveState} from "@/app/components/ui/CellSaveBadge";

type Props = {
  item: ProjectBudgetItemRow;
  suppliers: Supplier[]; // Cambiado a la interfaz completa
  globalSave: GlobalSaveState;
  onSupplierChange: (itemId: string, supplierId: string | null) => void;
  onUnitCostChange: (itemId: string, value: number) => void;
  onUnitCostBlur: (itemId: string, value: number) => void;
};

export function ProjectBudgetTableRow({
  item,
  suppliers,
  globalSave,
  onSupplierChange,
  onUnitCostChange,
  onUnitCostBlur,
}: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const total = item.totalCost;

  // Buscamos la info completa del proveedor seleccionado
  const selectedSupplier = suppliers.find((s) => s.id === item.supplierId);

  return (
    <tr className="hover:bg-slate-50/30">
      <td className="px-6 py-4">
        <div className="text-sm font-semibold text-slate-800">
          {item.description}
        </div>
        {item.notes ? (
          <div className="text-[10px] text-slate-400">{item.notes}</div>
        ) : null}
      </td>

      <td className="px-6 py-4 relative">
        <div
          className="flex items-center gap-2"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}>
          {isHovered && selectedSupplier ? (
            <div className="absolute left-40 z-50 bottom-[332px]">
              <SupplierInfoCard supplier={selectedSupplier} />
            </div>
          ) : null}
          <select
            className={`rounded-lg border bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
              globalSave === "error" ? "border-rose-300" : "border-slate-200"
            } transition-colors cursor-pointer`}
            value={item.supplierId ?? ""}
            onChange={(e) => onSupplierChange(item.id, e.target.value || null)}>
            <option value="">— Sin proveedor —</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        {!suppliers.length && item.supplierNameSnapshot ? (
          <div className="mt-1 text-[10px] text-slate-400">
            {item.supplierNameSnapshot}
          </div>
        ) : null}
      </td>

      <td className="px-6 py-4">
        <div className="text-sm text-slate-600">{item.quantity}</div>
      </td>

      <td className="px-6 py-4">
        <div className="relative flex items-center gap-2 w-40">
          <CurrencyInput
            value={item.unitCost ?? 0}
            onChange={(value) => onUnitCostChange(item.id, value)}
            onBlur={() => onUnitCostBlur(item.id, item.unitCost)}
            error={globalSave === "error"}
          />
        </div>
      </td>

      <td className="px-6 py-4 text-sm font-semibold text-slate-800">
        {moneyCOP(total)}
      </td>
    </tr>
  );
}
