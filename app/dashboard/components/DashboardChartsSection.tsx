"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

import type {DashboardChartPoint} from "@/app/core/dashboard/dto";
import {toChartData} from "@/app/dashboard/ui/charts/dashboard-chart.config";

type Props = {
  quotationTrend: DashboardChartPoint[];
  quotationStatus: DashboardChartPoint[];
  projectStages: DashboardChartPoint[];
};

const QUOTATION_STATUS_COLORS: Record<string, string> = {
  DRAFT: "#94a3b8",
  SENT: "#3b82f6",
  APPROVED: "#22c55e",
  REJECTED: "#ef4444",
  CANCELLED: "#64748b",
  EXPIRED: "#f97316",
  PENDING: "#f59e0b",

  Borrador: "#94a3b8",
  Enviada: "#3b82f6",
  Aprobada: "#22c55e",
  Rechazada: "#ef4444",
  Cancelada: "#64748b",
  Expirada: "#f97316",
  Pendiente: "#f59e0b",
};
const PROJECT_STAGE_COLORS: Record<string, string> = {
  PLANIFICACION: "#94a3b8",
  COMPRAS: "#f59e0b",
  PRODUCCION: "#3b82f6",
  ENTREGA: "#22c55e",
  CIERRE: "#8b5cf6",

  // por si vienen en texto
  Planificación: "#94a3b8",
  Compras: "#f59e0b",
  Producción: "#3b82f6",
  Entrega: "#22c55e",
  Cierre: "#8b5cf6",
};

function buildProjectStagesData(data: DashboardChartPoint[]) {
  return toChartData(data).map((point) => ({
    ...point,
    fill: PROJECT_STAGE_COLORS[point.label] ?? "#6366f1",
  }));
}

function buildQuotationStatusChartData(data: DashboardChartPoint[]) {
  return toChartData(data).map((point) => ({
    ...point,
    fill: QUOTATION_STATUS_COLORS[point.label] ?? "#6366f1",
  }));
}

function renderPieLabel({name, percent}: {name?: string; percent?: number}) {
  if (!name || percent === undefined) return "";
  return `${name} ${(percent * 100).toFixed(0)}%`;
}

export function DashboardChartsSection({
  quotationTrend,
  quotationStatus,
  projectStages,
}: Props) {
  const quotationTrendData = toChartData(quotationTrend);
  const quotationStatusData = buildQuotationStatusChartData(quotationStatus);
  const projectStagesData = toChartData(projectStages);
  const projectStagesColored = buildProjectStagesData(projectStagesData);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Lectura visual</h2>
        <p className="text-sm text-slate-500">
          Tendencias útiles para seguimiento comercial y operativo.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.5fr_1fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Cotizaciones últimos 14 días
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Volumen diario de creación de cotizaciones.
            </p>
          </div>

          <div className="h-56">
            {quotationTrendData.length === 0 ? (
              <p className="text-sm text-slate-500">
                Sin datos de cotizaciones.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={quotationTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    tick={{fontSize: 10, fill: "#64748b"}}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{fontSize: 10, fill: "#64748b"}}
                  />
                  <Tooltip />
                  <Bar dataKey="value" fill={"#3b82f6"} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Cotizaciones por estado
            </h3>
          </div>

          <div className="h-66">
            {quotationStatusData.length === 0 ? (
              <p className="text-sm text-slate-500">
                Sin datos de cotizaciones.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={quotationStatusData}
                    dataKey="value"
                    nameKey="label"
                    outerRadius={78}
                    label={renderPieLabel}
                  />
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Proyectos por etapa
            </h3>
          </div>

          <div className="h-56">
            {projectStagesData.length === 0 ? (
              <p className="text-sm text-slate-500">Sin proyectos activos.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={projectStagesColored}
                  layout="vertical"
                  margin={{top: 8, right: 16, bottom: 8, left: 16}}
                  barCategoryGap={12}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{fontSize: 10, fill: "#64748b"}}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="label"
                    width={100}
                    tick={{fontSize: 10, fill: "#64748b"}}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="value"
                    fill="fill"
                    radius={[0, 2, 2, 0]}
                    barSize={18}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
