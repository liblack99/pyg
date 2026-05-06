"use client";

import {
  AlertTriangle,
  ArrowLeftRight,
  CircleGauge,
  FileWarning,
} from "lucide-react";
import {DashboardStatCard} from "@/app/dashboard/components/DashboardStatCard";
import type {ProjectFinanceSummary} from "@/app/core/projects/finance/dto";
import {moneyCOP} from "@/app/utils/moneyFormatted";
import {getFinanceAlertClass, getMarginVariant} from "../ui/project-finance.utils";

type Props = {
  summary: ProjectFinanceSummary;
};

export function ProjectFinanceHealthSection({summary}: Props) {
  const budgetHealth =
    summary.budgetCurrent > summary.spendingLimit65
      ? "Fuera del 65%"
      : "Dentro del 65%";

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          title="Control 65%"
          value={budgetHealth}
          icon={CircleGauge}
          variant={
            summary.budgetCurrent > summary.spendingLimit65 ? "rose" : "emerald"
          }
          hint={
            <span className="text-slate-500">
              Saldo: {moneyCOP(summary.budgetRemaining)}
            </span>
          }
        />

        <DashboardStatCard
          title="Pendiente por cobrar"
          value={moneyCOP(summary.pendingToCollect)}
          icon={FileWarning}
          variant={summary.pendingToCollect > 0 ? "amber" : "emerald"}
          hint={<span className="text-slate-500">Contra venta total</span>}
        />

        <DashboardStatCard
          title="Pendiente por pagar"
          value={moneyCOP(summary.pendingToPay)}
          icon={ArrowLeftRight}
          variant={summary.pendingToPay > 0 ? "amber" : "emerald"}
          hint={<span className="text-slate-500">Contra compras comprometidas</span>}
        />

        <DashboardStatCard
          title="Saldo de caja"
          value={moneyCOP(summary.cashFlowBalance)}
          icon={AlertTriangle}
          variant={summary.cashFlowBalance < 0 ? "rose" : getMarginVariant(summary.currentMarginPercent)}
          hint={<span className="text-slate-500">Cobrado + ingresos - pagos - extras</span>}
        />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Alertas financieras
        </h3>

        <div className="mt-5 space-y-3">
          {summary.alerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-xl border px-4 py-3 ${getFinanceAlertClass(
                alert.tone,
              )}`}>
              <p className="text-sm font-semibold">{alert.title}</p>
              <p className="mt-1 text-sm">{alert.message}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
