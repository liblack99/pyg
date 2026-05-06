"use client";

import {
  BadgeDollarSign,
  BriefcaseBusiness,
  CircleDollarSign,
  HandCoins,
  PiggyBank,
  Receipt,
  ShieldAlert,
  TrendingDown,
  Wallet,
} from "lucide-react";
import {DashboardStatCard} from "@/app/dashboard/components/DashboardStatCard";
import type {ProjectFinanceSummary} from "@/app/core/projects/finance/dto";
import {moneyCOP} from "@/app/utils/moneyFormatted";
import {getMarginVariant} from "../ui/project-finance.utils";

type Props = {
  summary: ProjectFinanceSummary;
};

export function ProjectFinanceSummaryCards({summary}: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      <DashboardStatCard
        title="Venta sin IVA"
        value={moneyCOP(summary.saleValueWithoutTax)}
        icon={BadgeDollarSign}
        variant="blue"
        hint={<span className="text-slate-500">Base comercial del proyecto</span>}
      />

      <DashboardStatCard
        title="Presupuesto actual"
        value={moneyCOP(summary.budgetCurrent)}
        icon={BriefcaseBusiness}
        variant="slate"
        progress={{
          current: summary.budgetCurrent,
          total: summary.spendingLimit65 || 1,
        }}
        hint={<span className="text-slate-500">Frente al límite 65%</span>}
      />

      <DashboardStatCard
        title="Compras comprometidas"
        value={moneyCOP(summary.committedPurchasesCost)}
        icon={Receipt}
        variant="indigo"
        hint={<span className="text-slate-500">Ordenadas o recibidas</span>}
      />

      <DashboardStatCard
        title="Garantías"
        value={moneyCOP(summary.warrantyCostTotal)}
        icon={ShieldAlert}
        variant={summary.warrantyCostTotal > 0 ? "amber" : "emerald"}
        hint={<span className="text-slate-500">Impacto acumulado</span>}
      />

      <DashboardStatCard
        title="Costos extra"
        value={moneyCOP(summary.extraCostsTotal)}
        icon={TrendingDown}
        variant={summary.extraCostsTotal > 0 ? "rose" : "slate"}
        hint={<span className="text-slate-500">Movimientos manuales de costo</span>}
      />

      <DashboardStatCard
        title="Utilidad actual"
        value={moneyCOP(summary.currentProfit)}
        icon={Wallet}
        variant={summary.currentProfit < 0 ? "rose" : "emerald"}
        hint={<span className="text-slate-500">Venta menos costo real</span>}
      />

      <DashboardStatCard
        title="Margen actual"
        value={`${summary.currentMarginPercent.toFixed(1)}%`}
        icon={PiggyBank}
        variant={getMarginVariant(summary.currentMarginPercent)}
        hint={<span className="text-slate-500">Rentabilidad del proyecto</span>}
      />

      <DashboardStatCard
        title="Cobrado"
        value={moneyCOP(summary.collectedAmount)}
        icon={CircleDollarSign}
        variant="emerald"
        hint={<span className="text-slate-500">Ingresos registrados</span>}
      />

      <DashboardStatCard
        title="Pagado"
        value={moneyCOP(summary.paidAmount)}
        icon={HandCoins}
        variant="amber"
        hint={<span className="text-slate-500">Pagos manuales registrados</span>}
      />
    </div>
  );
}
