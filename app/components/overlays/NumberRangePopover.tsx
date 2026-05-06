"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import {DollarSign} from "lucide-react";
import Button from "../ui/Button";
import {CurrencyInput} from "../form/base/CurrencyInput";
import {FormFieldBase} from "../form/base/FormFieldBase";
import {moneyCOP} from "../../utils/moneyFormatted";

type NumberRangeValue = {
  min?: string;
  max?: string;
};

type NumberRangePopoverProps = {
  label?: string;
  value: NumberRangeValue;
  onChange: (next: NumberRangeValue) => void;
  placeholderMin?: string;
  placeholderMax?: string;
};

function parseToNullableNumber(value?: string) {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function fmtLabel(min?: string, max?: string) {
  if (!min && !max) return "Rango (Total)";
  if (min && !max) return `≥ ${moneyCOP(min)}`;
  if (!min && max) return `≤ ${moneyCOP(max)}`;
  return `${moneyCOP(min)} → ${moneyCOP(max)}`;
}

export function NumberRangePopover({
  label,
  value,
  onChange,
  placeholderMin,
  placeholderMax,
}: NumberRangePopoverProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const [draft, setDraft] = useState<{min: number | null; max: number | null}>({
    min: parseToNullableNumber(value.min),
    max: parseToNullableNumber(value.max),
  });

  useEffect(() => {
    setDraft({
      min: parseToNullableNumber(value.min),
      max: parseToNullableNumber(value.max),
    });
  }, [value.min, value.max]);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!open) return;

      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;

      setOpen(false);
    }

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open]);

  const triggerLabel = useMemo(() => {
    const base = label ?? "Total";
    return `${base}: ${fmtLabel(value.min, value.max)}`;
  }, [label, value.min, value.max]);

  const hasRangeError =
    draft.min !== null && draft.max !== null && draft.min > draft.max;

  function apply() {
    const min = draft.min;
    const max = draft.max;

    if (min !== null && max !== null && min > max) {
      onChange({
        min: String(max),
        max: String(min),
      });
    } else {
      onChange({
        min: min !== null ? String(min) : undefined,
        max: max !== null ? String(max) : undefined,
      });
    }

    setOpen(false);
  }

  function cancel() {
    setDraft({
      min: parseToNullableNumber(value.min),
      max: parseToNullableNumber(value.max),
    });
    setOpen(false);
  }

  function clear() {
    setDraft({min: null, max: null});
    onChange({min: undefined, max: undefined});
    setOpen(false);
  }

  return (
    <div className="relative inline-block">
      <button
        ref={anchorRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
        <DollarSign className="h-4 w-4" />
        {triggerLabel}
        <span className="ml-1 opacity-60">▾</span>
      </button>

      {open ? (
        <div
          ref={panelRef}
          className="absolute left-0 z-50 mt-2 min-w-[300px] rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-3 text-sm font-medium text-slate-900 dark:text-slate-100">
            {label ?? "Rango"}
          </div>

          <div className="grid grid-cols-1 gap-3">
            <FormFieldBase label="Mín">
              <CurrencyInput
                value={draft.min}
                onChange={(next) => setDraft((prev) => ({...prev, min: next}))}
                placeholder={placeholderMin ?? "0"}
                error={hasRangeError}
              />
            </FormFieldBase>

            <FormFieldBase
              label="Máx"
              error={
                hasRangeError
                  ? "El valor máximo no puede ser menor al mínimo."
                  : undefined
              }>
              <CurrencyInput
                value={draft.max}
                onChange={(next) => setDraft((prev) => ({...prev, max: next}))}
                placeholder={placeholderMax ?? "0"}
                error={hasRangeError}
              />
            </FormFieldBase>
          </div>

          <div className="mt-4 flex items-center justify-between gap-2 text-[11px] text-slate-500">
            <span>Ingresa un valor mínimo y/o máximo.</span>
            <span className={hasRangeError ? "text-red-600" : ""}>
              {hasRangeError ? "Revisa el rango" : "Opcional"}
            </span>
          </div>

          <div className="mt-4 flex justify-between gap-2">
            <Button type="button" variant="outline" onClick={clear}>
              Limpiar
            </Button>

            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={cancel}>
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={apply}
                disabled={draft.min === null && draft.max === null}>
                Aplicar
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
