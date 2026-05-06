"use client";

import React, {useId, useMemo, useState} from "react";

export interface FileUploadFieldProps {
  label: string;
  error?: string;
  disabled?: boolean;
  accept?: string;
  helperText?: string;
  recommendedMaxText?: string;
  value?: File | null;
  onChange?: (file: File | null) => void;
  onBlur?: () => void;
  name?: string;
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let v = bytes;

  while (v >= 1024 && i < units.length - 1) {
    v = v / 1024;
    i++;
  }

  return `${v.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function FileUploadField({
  label,
  error,
  disabled = false,
  accept,
  helperText,
  recommendedMaxText = "Máx recomendado: 5MB",
  value = null,
  onChange,
  onBlur,
  name,
}: FileUploadFieldProps) {
  const inputId = useId();
  const [resetKey, setResetKey] = useState(0);

  const fileSubtitle = useMemo(() => {
    if (!value) {
      return "Arrastra y suelta un archivo aquí o haz click para buscar";
    }

    const size = formatBytes(value.size);
    return size ? `${value.name} • ${size}` : value.name;
  }, [value]);

  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold text-[#0F172A]">{label}</div>

      <input
        key={resetKey}
        id={inputId}
        type="file"
        accept={accept}
        disabled={disabled}
        className="hidden"
        name={name}
        onBlur={onBlur}
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          onChange?.(file);
        }}
      />

      <label
        htmlFor={inputId}
        className={[
          "group relative flex w-full items-center gap-3 rounded-md border-2 border-dashed p-4 transition",
          "focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2",
          error
            ? "border-red-400 bg-red-50/40 focus-within:ring-red-500/30 ring-offset-white"
            : "border-slate-300 bg-white hover:bg-slate-50 focus-within:ring-[#0A3D91]/25 ring-offset-white",
          disabled
            ? "cursor-not-allowed bg-slate-100 opacity-70"
            : "cursor-pointer shadow-sm",
        ].join(" ")}>
        <div
          className={[
            "flex h-10 w-10 items-center justify-center rounded-lg border",
            error
              ? "border-red-200 bg-red-50"
              : "border-slate-200 bg-slate-50 group-hover:bg-white",
          ].join(" ")}>
          <svg
            viewBox="0 0 24 24"
            className={[
              "h-5 w-5",
              error ? "text-red-600" : "text-slate-600",
            ].join(" ")}
            fill="none"
            stroke="currentColor"
            strokeWidth="2">
            <path d="M12 16V4" />
            <path d="M7 9l5-5 5 5" />
            <path d="M20 16.5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4" />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-900">
              {value ? "Archivo seleccionado" : "Subir archivo"}
            </span>

            {!disabled && !value ? (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                Click
              </span>
            ) : null}
          </div>

          <p className="truncate text-xs text-slate-500">{fileSubtitle}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {value ? (
            <>
              <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm">
                Cambiar
              </span>

              <button
                type="button"
                disabled={disabled}
                onClick={(ev) => {
                  ev.preventDefault();

                  onChange?.(null);
                  setResetKey((k) => k + 1);
                }}
                className={[
                  "rounded-lg border px-3 py-1.5 text-xs font-medium shadow-sm transition",
                  "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/15 focus-visible:ring-offset-2",
                  disabled ? "cursor-not-allowed opacity-60" : "",
                ].join(" ")}>
                Quitar
              </button>
            </>
          ) : (
            <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm group-hover:bg-slate-50">
              Buscar
            </span>
          )}
        </div>
      </label>

      <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
        <span>
          {helperText ??
            (accept ? `Formatos: ${accept}` : "Formatos: JPG, PNG, PDF")}
        </span>
        <span className={error ? "text-red-600" : ""}>
          {error ? error : recommendedMaxText}
        </span>
      </div>
    </div>
  );
}
