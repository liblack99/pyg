"use client";

type Props = {
  executedPct: number;
};

export function ProjectBudgetExecutionProgress({executedPct}: Props) {
  const isOverLimit = executedPct >= 100;
  const progressWidth = Math.min(100, executedPct);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-3 flex items-end justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Ejecución (vs límite 65%)
        </h3>

        <div
          className={`text-sm font-bold ${
            isOverLimit ? "text-rose-600" : "text-blue-600"
          }`}>
          {executedPct.toFixed(1)}%
        </div>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full ${isOverLimit ? "bg-rose-500" : "bg-blue-500"}`}
          style={{width: `${progressWidth}%`}}
        />
      </div>

      {isOverLimit ? (
        <div className="mt-3 text-xs text-rose-700">
          Estás por encima del límite (65%). Revisa costos o cantidades.
        </div>
      ) : null}
    </div>
  );
}
