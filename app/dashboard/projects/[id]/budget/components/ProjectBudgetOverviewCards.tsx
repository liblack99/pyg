"use client";

import {ShieldAlert, Wallet, Scale} from "lucide-react";
import {DashboardStatCard} from "@/app/dashboard/components/DashboardStatCard";
import {moneyCOP} from "@/app/utils/moneyFormatted";

type Props = {
  limit65: number;
  budgetCurrent: number;
  balance: number;
  executedPct: number;
};

export function ProjectBudgetOverviewCards({
  limit65,
  budgetCurrent,
  balance,
  executedPct,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <DashboardStatCard
        title="Límite de gasto"
        value={moneyCOP(limit65)}
        icon={ShieldAlert}
        variant="blue"
        hint={<span className="text-slate-400">65% del total sin IVA</span>}
      />

      <DashboardStatCard
        title="Presupuesto actual"
        value={moneyCOP(budgetCurrent)}
        icon={Wallet}
        variant={
          executedPct >= 100 ? "rose" : executedPct >= 80 ? "amber" : "emerald"
        }
        progress={{
          current: executedPct,
          total: 100,
        }}
        hint={
          <span className="font-bold">{executedPct.toFixed(1)}% ejecutado</span>
        }
      />

      <DashboardStatCard
        title="Saldo"
        value={moneyCOP(balance)}
        icon={Scale}
        variant={balance < 0 ? "rose" : "emerald"}
        hint={
          <span className={balance < 0 ? "text-rose-600" : "text-emerald-600"}>
            {limit65 > 0
              ? `${((Math.max(0, balance) / limit65) * 100).toFixed(1)}% disponible`
              : "—"}
          </span>
        }
      />
    </div>
  );
}
