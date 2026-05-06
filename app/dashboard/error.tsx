"use client";

import Button from "@/app/components/ui/Button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  return (
    <div className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700">
        <p className="font-semibold">No se pudo cargar el dashboard.</p>
        <p className="mt-2 text-sm">{error.message}</p>
      </div>
      <Button onClick={reset}>Reintentar</Button>
    </div>
  );
}
