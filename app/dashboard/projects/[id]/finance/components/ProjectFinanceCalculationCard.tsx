"use client";

import type {ProjectFinanceSummary} from "@/app/core/projects/finance/dto";
import {moneyCOP} from "@/app/utils/moneyFormatted";

type Props = {
  summary: ProjectFinanceSummary;
};

function Row({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "positive" | "negative";
}) {
  const toneClass =
    tone === "positive"
      ? "text-emerald-600"
      : tone === "negative"
        ? "text-rose-600"
        : "text-slate-900";

  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-3 last:border-b-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={`text-sm font-semibold ${toneClass}`}>{value}</span>
    </div>
  );
}

export function ProjectFinanceCalculationCard({summary}: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Composición del resultado
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Este bloque muestra cómo se está construyendo la rentabilidad del
          proyecto con datos automáticos y movimientos manuales.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 p-4">
          <Row
            label="Venta sin IVA"
            value={moneyCOP(summary.saleValueWithoutTax)}
            tone="positive"
          />
          <Row label="Presupuesto actual" value={moneyCOP(summary.budgetCurrent)} />
          <Row
            label="Costos extra manuales"
            value={moneyCOP(summary.extraCostsTotal)}
          />
          <Row
            label="Costo garantías"
            value={moneyCOP(summary.warrantyCostTotal)}
          />
          <Row
            label="Utilidad esperada"
            value={moneyCOP(summary.expectedProfit)}
            tone={summary.expectedProfit < 0 ? "negative" : "positive"}
          />
        </div>

        <div className="rounded-2xl border border-slate-100 p-4">
          <Row
            label="Compras ejecutadas"
            value={moneyCOP(summary.executedPurchasesCost)}
          />
          <Row
            label="Ingresos extraordinarios"
            value={moneyCOP(summary.extraIncomeTotal)}
            tone="positive"
          />
          <Row
            label="Costo actual total"
            value={moneyCOP(summary.actualCostTotal)}
          />
          <Row
            label="Utilidad actual"
            value={moneyCOP(summary.currentProfit)}
            tone={summary.currentProfit < 0 ? "negative" : "positive"}
          />
          <Row
            label="Margen actual"
            value={`${summary.currentMarginPercent.toFixed(2)}%`}
            tone={summary.currentMarginPercent < 0 ? "negative" : "positive"}
          />
        </div>
      </div>
    </section>
  );
}
