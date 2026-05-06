"use client";

import {DashboardStatCard} from "@/app/dashboard/components/DashboardStatCard";
import {
  ShoppingCart,
  Receipt,
  PackageCheck,
  Package,
  HandCoins,
  CheckCircle2,
} from "lucide-react";
import {moneyCOP} from "@/app/utils/moneyFormatted";

export type PurchasesMetrics = {
  totalItems: number;
  committedAmount: number;
  committedPct: number;
  pendingDeliveries: number;
};

interface Props {
  metrics: PurchasesMetrics;
}

export function ProjectPurchasesMetrics({metrics}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <DashboardStatCard
        title="Ítems de Compra"
        value={metrics.totalItems}
        icon={ShoppingCart}
        variant="blue"
        hint={
          <>
            <Package size={12} strokeWidth={2.5} className="text-slate-400" />
            <span className="text-slate-400">Presupuesto costeado</span>
          </>
        }
      />

      <DashboardStatCard
        title="Monto Comprometido"
        value={moneyCOP(metrics.committedAmount)}
        icon={Receipt}
        variant="slate"
        progress={{
          current: metrics.committedPct,
          total: 100,
        }}
        hint={
          <>
            <HandCoins size={12} strokeWidth={2.5} className="text-slate-400" />
            <span className="text-slate-400">
              {metrics.committedPct.toFixed(1)}% del límite 65%
            </span>
          </>
        }
      />

      <DashboardStatCard
        title="Estado Entregas"
        value={metrics.pendingDeliveries}
        icon={PackageCheck}
        variant={metrics.pendingDeliveries === 0 ? "emerald" : "amber"}
        hint={
          <div
            className={`flex items-center gap-1 ${
              metrics.pendingDeliveries === 0
                ? "text-emerald-600"
                : "text-amber-600"
            }`}>
            {metrics.pendingDeliveries === 0 ? (
              <CheckCircle2 size={12} strokeWidth={2.5} />
            ) : (
              <ShoppingCart size={12} strokeWidth={2.5} />
            )}
            <span>
              {metrics.pendingDeliveries === 0
                ? "Todo recibido"
                : "Pendientes por llegar"}
            </span>
          </div>
        }
      />
    </div>
  );
}
