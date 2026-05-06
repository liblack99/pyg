"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import {CalendarRange} from "lucide-react";
import Button from "../ui/Button";
import {Input} from "../form/base";
import {FormFieldBase} from "../form/base";

function fmtLabel(from?: string, to?: string) {
  if (!from && !to) return "Rango de fechas";
  if (from && !to) return `Desde ${from}`;
  if (!from && to) return `Hasta ${to}`;
  return `${from} → ${to}`;
}

type DateRangeValue = {
  from?: string;
  to?: string;
};

type DateRangePopoverProps = {
  value: DateRangeValue;
  onChange: (next: DateRangeValue) => void;
};

export function DateRangePopover({value, onChange}: DateRangePopoverProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const [draft, setDraft] = useState<{from: string; to: string}>({
    from: value.from ?? "",
    to: value.to ?? "",
  });

  useEffect(() => {
    setDraft({
      from: value.from ?? "",
      to: value.to ?? "",
    });
  }, [value.from, value.to]);

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

  const label = useMemo(
    () => fmtLabel(value.from, value.to),
    [value.from, value.to],
  );

  const hasRangeError = !!draft.from && !!draft.to && draft.from > draft.to;

  function apply() {
    const from = draft.from.trim() || undefined;
    const to = draft.to.trim() || undefined;

    if (from && to && from > to) {
      onChange({from: to, to: from});
    } else {
      onChange({from, to});
    }

    setOpen(false);
  }

  function cancel() {
    setDraft({
      from: value.from ?? "",
      to: value.to ?? "",
    });
    setOpen(false);
  }

  function clear() {
    setDraft({from: "", to: ""});
    onChange({from: undefined, to: undefined});
    setOpen(false);
  }

  return (
    <div className="relative inline-block">
      <button
        ref={anchorRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
        <CalendarRange className="h-4 w-4" />
        {label}
        <span className="ml-1 opacity-60">▾</span>
      </button>

      {open ? (
        <div
          ref={panelRef}
          className="absolute left-0 z-50 mt-2 min-w-[280px] rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
          <div className="mb-3 text-sm font-medium text-slate-900">
            Selecciona rango
          </div>

          <div className="grid gap-3">
            <FormFieldBase label="Desde">
              <Input
                type="date"
                value={draft.from}
                onChange={(e) =>
                  setDraft((prev) => ({...prev, from: e.target.value}))
                }
              />
            </FormFieldBase>

            <FormFieldBase
              label="Hasta"
              error={
                hasRangeError ? "La fecha final no puede ser menor." : undefined
              }>
              <Input
                type="date"
                value={draft.to}
                onChange={(e) =>
                  setDraft((prev) => ({...prev, to: e.target.value}))
                }
                error={hasRangeError}
              />
            </FormFieldBase>
          </div>

          <div className="mt-4 flex items-center justify-between gap-2 text-[11px] text-slate-500">
            <span>Selecciona una fecha inicial y/o final.</span>
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
                variant="primary"
                onClick={apply}
                disabled={!draft.from && !draft.to}>
                Aplicar
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
