"use client";

import {moneyCOP} from "@/app/utils/moneyFormatted";
import {formatDate} from "@/app/utils/formatDate";
import {PURCHASES_STATUS_LABEL} from "@/app/core/projects/purchases/constant/purchases-status-label";
import type {
  ProjectShoppingItem,
  ProcurementStatus,
} from "@/app/core/projects/purchases/dto";
import type {GlobalSaveState} from "@/app/components/ui/CellSaveBadge";
import {statusPillClass} from "../ui/purchases.util";

interface Props {
  items: ProjectShoppingItem[];
  search: string;
  onSearchChange: (value: string) => void;
  committedAmount: number;
  globalSave: GlobalSaveState;
  onStatusChange: (itemId: string, status: ProcurementStatus) => void;
}

export function ProjectPurchasesTable({
  items,
  search,
  onSearchChange,
  committedAmount,
  globalSave,
  onStatusChange,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Compras
        </h3>

        <div className="flex items-center gap-3">
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
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <tr>
              <th className="px-6 py-4">Ítem / Descripción</th>
              <th className="px-6 py-4">Proveedor</th>
              <th className="px-6 py-4 text-center">Fecha</th>
              <th className="px-6 py-4 text-right">Monto Total</th>
              <th className="px-6 py-4 text-center">Estado</th>
              <th className="px-6 py-4 text-right">Acción</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {items.map((it) => {
              const supplierName = it.supplierNameSnapshot ?? "—";

              const dateCell =
                it.procurementStatus === "RECEIVED"
                  ? it.receivedAt
                  : it.procurementStatus === "ORDERED"
                    ? it.orderedAt
                    : it.createdAt;

              return (
                <tr
                  key={it.id}
                  className="transition-colors hover:bg-slate-50/30">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-slate-800">
                      {it.description}
                    </div>

                    {it.purchaseNotes ? (
                      <div className="mt-0.5 text-[10px] text-slate-400">
                        {it.purchaseNotes}
                      </div>
                    ) : null}
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-slate-700">
                    {supplierName}
                  </td>

                  <td className="px-6 py-4 text-center text-sm text-slate-500">
                    {formatDate(dateCell)}
                  </td>

                  <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">
                    {moneyCOP(it.totalCost)}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`rounded-full border px-2 py-1 text-[9px] font-bold uppercase ${statusPillClass(
                        it.procurementStatus,
                      )}`}>
                      {PURCHASES_STATUS_LABEL[it.procurementStatus]}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end">
                      <select
                        className={`rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                          globalSave === "error" ? "border-rose-300" : ""
                        }`}
                        value={it.procurementStatus}
                        onChange={(e) =>
                          onStatusChange(
                            it.id,
                            e.target.value as ProcurementStatus,
                          )
                        }>
                        <option value="PENDING">Pendiente</option>
                        <option value="ORDERED">Ordenado</option>
                        <option value="RECEIVED">Recibido</option>
                        <option value="CANCELLED">Cancelado</option>
                      </select>
                    </div>
                  </td>
                </tr>
              );
            })}

            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-sm text-slate-500">
                  No hay ítems de compra (costeados) que coincidan con tu
                  búsqueda.
                </td>
              </tr>
            ) : null}
          </tbody>

          <tfoot>
            <tr className="bg-slate-50/30">
              <td
                className="px-6 py-4 text-right text-sm font-bold text-slate-500"
                colSpan={3}>
                Total comprometido:
              </td>

              <td className="w-40 px-6 py-4 text-right text-lg font-bold text-blue-600">
                {moneyCOP(committedAmount)}
              </td>

              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
