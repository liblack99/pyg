"use client";

import {useMemo} from "react";
import {moneyCOP} from "@/app/utils/moneyFormatted";

type Props = {
  totalQuotationSinIVA: number;
  budgetTotal: number;
  spendingLimit65: number;
  remaining: number;
};

export default function ProjectFinancialSummaryCard({
  totalQuotationSinIVA,
  budgetTotal,
  spendingLimit65,
  remaining,
}: Props) {
  const pct = useMemo(() => {
    const limit = spendingLimit65;
    const used = Math.max(0, limit - remaining);
    const pct = limit > 0 ? (used / limit) * 100 : 0;

    return {limit, used, remaining, pct};
  }, [spendingLimit65, remaining]);

  const riskLabel =
    pct.pct >= 100
      ? "🔴 Excedido"
      : pct.pct >= 80
        ? "🟡 Cerca del límite"
        : "🟢 Dentro del límite";

  return (
    <div
      className="soft-card rounded-xl bg-slate-900 p-6 text-white"
      data-purpose="financial-summary-card">
      <div className="mb-8 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-400">
          Resumen Financiero
        </h3>

        <svg
          className="h-5 w-5 text-slate-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="space-y-6">
        <div>
          <span className="mb-1 block text-xs text-slate-400">
            Total cotización (sin IVA)
          </span>
          <div className="text-2xl font-bold tracking-tight">
            {moneyCOP(totalQuotationSinIVA)}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">{riskLabel}</span>
            <span className="font-medium text-amber-400">
              {Math.round(pct.pct)}%
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-emerald-500"
              style={{width: `${Math.min(100, Math.max(0, pct.pct))}%`}}
            />
          </div>

          <div className="flex justify-between pt-1 text-[10px] text-slate-500">
            <span>$0</span>
            <span>{moneyCOP(budgetTotal)}</span>
            <span>{moneyCOP(spendingLimit65)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-4">
          <div>
            <span className="block text-[10px] font-bold uppercase text-slate-500">
              Presupuesto actual
            </span>
            <span className="text-lg font-semibold">
              {moneyCOP(budgetTotal)}
            </span>
          </div>

          <div>
            <span className="block text-[10px] font-bold uppercase text-slate-500">
              Saldo
            </span>
            <span
              className={[
                "text-lg font-semibold",
                remaining >= 0 ? "text-emerald-400" : "text-rose-400",
              ].join(" ")}>
              {moneyCOP(remaining)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
