"use client";

type AlertTone = "danger" | "warning" | "info";

type ProjectSummaryAlert = {
  tone: AlertTone;
  text: string;
};

type Props = {
  alerts: ProjectSummaryAlert[];
};

export function ProjectSummaryAlerts({alerts}: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
        Alertas y pendientes
      </h3>

      <div className="mt-5 space-y-3">
        {alerts.length === 0 ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            El proyecto no presenta alertas relevantes por ahora.
          </div>
        ) : (
          alerts.map((alert, index) => (
            <ProjectSummaryAlertRow
              key={`${alert.text}-${index}`}
              tone={alert.tone}
              text={alert.text}
            />
          ))
        )}
      </div>
    </section>
  );
}

function ProjectSummaryAlertRow({tone, text}: {tone: AlertTone; text: string}) {
  const styles =
    tone === "danger"
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : tone === "warning"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-blue-200 bg-blue-50 text-blue-700";

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>
      {text}
    </div>
  );
}
