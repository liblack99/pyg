"use client";

import {useState} from "react";
import type {QuotationDashboardStats} from "@/app/core/quotations/dto";
import Modal from "@/app/components/ui/Modal";
import Button from "@/app/components/ui/Button";
import {apiPut} from "@/app/lib/api.client";
import CardDashboard from "../../../components/ui/CardDashboard";
import {CurrencyInput} from "@/app/components/form/base/CurrencyInput";
import {FormFieldBase} from "@/app/components/form/base";

import {
  FileIcon,
  TrendingUpIcon,
  Clock,
  DollarSignIcon,
  Calendar,
  Target,
  Award,
  UserCircle,
  Pencil,
} from "lucide-react";

interface Props {
  data: QuotationDashboardStats;
  canEditGoal?: boolean;
}

function formatGoalValue(value: number) {
  return Number.isFinite(value) ? String(Math.round(value)) : "0";
}

export default function QuotationSummary({data, canEditGoal = false}: Props) {
  const [summary, setSummary] = useState(data);
  const [open, setOpen] = useState(false);

  const [goalValue, setGoalValue] = useState(data.goalCompliance.target);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSaveGoal() {
    const nextTarget = Number(goalValue);

    if (!Number.isFinite(nextTarget) || nextTarget < 0) {
      setError("Ingresa una meta válida");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const updated = await apiPut<{monthlySalesGoal: number}>(
        "/api/quotations/summary/goal",
        {monthlySalesGoal: nextTarget},
      );

      setSummary((prev) => {
        const newTarget = updated.monthlySalesGoal;
        return {
          ...prev,
          goalCompliance: {
            ...prev.goalCompliance,
            target: newTarget,
            // Recalculamos el porcentaje con la nueva meta
            percentage:
              newTarget > 0
                ? Math.round((prev.goalCompliance.current / newTarget) * 100)
                : 0,
          },
        };
      });

      setOpen(false);
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "No se pudo actualizar la meta",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-gray-50">
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
        <CardDashboard
          title="Cotizaciones Activas"
          value={summary.activeQuotations.total}
          subtext={summary.activeQuotations.subtext}
          icon={<FileIcon />}
        />
        <CardDashboard
          title="Tasa de Aprobacion"
          value={summary.approvalRate.percentage}
          subtext={summary.approvalRate.subtext}
          isPositive={summary.approvalRate.isPositive}
          icon={<TrendingUpIcon />}
        />
        <CardDashboard
          title="Valor en Proceso"
          value={summary.valueInProcess.formatted}
          subtext="Total acumulado"
          icon={<DollarSignIcon />}
        />
        <CardDashboard
          title="Promedio Respuesta"
          value={summary.averageResponse.value}
          subtext="Tiempo de cierre"
          icon={<Clock />}
        />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CardDashboard
          title="Venta del Ano"
          value={summary.yearlySales.formatted}
          subtext="Acumulado anual"
          icon={<Calendar className="text-slate-600" />}
        />
        <CardDashboard
          title="Venta del Mes"
          value={summary.monthlySales.formatted}
          subtext="Ventas aprobadas"
          icon={<DollarSignIcon className="text-emerald-600" />}
        />

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-2 flex justify-between items-start">
            <p className="text-xs font-semibold uppercase text-slate-400">
              Cumplimiento Mes
            </p>
            <div className="flex items-center gap-2">
              {canEditGoal ? (
                <button
                  type="button"
                  onClick={() => {
                    setGoalValue(summary.goalCompliance.target);
                    setError(null);
                    setOpen(true);
                  }}
                  className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Editar meta mensual">
                  <Pencil size={16} />
                </button>
              ) : null}
              <Target size={20} className="text-orange-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {summary.goalCompliance.percentage}%
            </span>
            <span className="line-clamp-1 text-[10px] text-slate-400">
              Meta: {summary.goalCompliance.target.toLocaleString()}
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-orange-500 transition-all duration-1000"
              style={{
                width: `${Math.min(summary.goalCompliance.percentage, 100)}%`,
              }}
            />
          </div>
        </div>

        <CardDashboard
          title="Lider en Cotizaciones"
          value={summary.advisorsRank[0]?.name || "N/A"}
          subtext={`${summary.advisorsRank[0]?.count ?? 0} cotizaciones`}
          icon={<Award className="text-amber-500" />}
        />
      </div>

      <div className="mb-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <UserCircle className="text-slate-400" size={20} />
          <h4 className="font-bold text-slate-800">Ranking de Asesores</h4>
        </div>
        <div className="space-y-5">
          {summary.advisorsRank.map((advisor, index) => (
            <div key={advisor.id} className="group">
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="font-medium text-slate-600">
                  {index + 1}. {advisor.name}
                </span>
                <span className="font-semibold text-slate-900">
                  {advisor.count} cotizaciones
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-50">
                <div
                  className="h-full rounded-full bg-blue-500 opacity-70 transition-opacity group-hover:opacity-100"
                  style={{
                    width: `${(advisor.count / (summary.advisorsRank[0]?.count || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatusMiniCard
          label="Pendientes"
          count={summary.statusDetails.DRAFT}
          color="bg-yellow-400"
        />
        <StatusMiniCard
          label="Enviadas"
          count={summary.statusDetails.SENT}
          color="bg-blue-500"
        />
        <StatusMiniCard
          label="Aprobadas"
          count={summary.statusDetails.APPROVED}
          color="bg-green-500"
        />
        <StatusMiniCard
          label="Rechazadas"
          count={summary.statusDetails.REJECTED}
          color="bg-red-500"
        />
        <StatusMiniCard
          label="Vencidas"
          count={summary.statusDetails.EXPIRED}
          color="bg-gray-400"
        />
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Actualizar meta mensual">
        <form className="space-y-4" onSubmit={handleSaveGoal}>
          <FormFieldBase label="Meta mensual">
            <CurrencyInput
              value={goalValue}
              onChange={(value) => {
                setGoalValue(value);
                if (error) setError(null);
              }}
              placeholder="0"
              disabled={saving}
            />
          </FormFieldBase>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

const StatusMiniCard = ({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) => (
  <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm">
    <div className={`h-3 w-3 rounded-full ${color}`} />
    <div>
      <p className="text-xl font-bold">{count}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  </div>
);
