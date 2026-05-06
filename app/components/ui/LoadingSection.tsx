"use client";

interface Props {
  message?: string;
  className?: string; // opcional por si quieres ajustar altura
}

export default function LoadingSection({
  message = "Cargando…",
  className = "h-[300px]",
}: Props) {
  return (
    <div
      className={`w-full flex flex-col items-center justify-center gap-3 h-60`}>
      {/* Spinner */}
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />

      {/* Texto */}
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}
