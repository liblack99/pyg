"use client";

import type {ProjectBudgetItemRow} from "@/app/core/projects/budget/dto";
import {moneyCOP} from "@/app/utils/moneyFormatted";
import {ProjectBudgetTableRow} from "./ProjectBudgetTableRow";
import type {Supplier} from "@/app/core/supplier/dto";
type GlobalSaveState = "idle" | "saving" | "saved" | "error";

type Props = {
  items: ProjectBudgetItemRow[];
  suppliers: Supplier[];
  globalSave: GlobalSaveState;
  budgetCurrent: number;
  onSupplierChange: (itemId: string, supplierId: string | null) => void;
  onUnitCostChange: (itemId: string, value: number) => void;
  onUnitCostBlur: (itemId: string, value: number) => void;
};

export function ProjectBudgetTable({
  items,
  suppliers,
  globalSave,
  budgetCurrent,
  onSupplierChange,
  onUnitCostChange,
  onUnitCostBlur,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50/50">
            <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400">
              Ítem / Descripción
            </th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400">
              Proveedor
            </th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400">
              Cantidad
            </th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400">
              Costo Unit.
            </th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400">
              Total
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {items.map((item) => (
            <ProjectBudgetTableRow
              key={item.id}
              item={item}
              suppliers={suppliers}
              globalSave={globalSave}
              onSupplierChange={onSupplierChange}
              onUnitCostChange={onUnitCostChange}
              onUnitCostBlur={onUnitCostBlur}
            />
          ))}

          {items.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-10 text-sm text-slate-500">
                No hay ítems que coincidan con tu búsqueda.
              </td>
            </tr>
          ) : null}
        </tbody>

        <tfoot>
          <tr className="bg-slate-50/30">
            <td
              colSpan={4}
              className="px-6 py-4 text-right text-sm font-bold text-slate-500">
              Subtotal presupuesto:
            </td>
            <td className="w-40 px-6 py-4 text-lg font-bold text-blue-600">
              {moneyCOP(budgetCurrent)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
