"use client";

import {useEffect, useMemo} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import Modal from "@/app/components/ui/Modal";
import Button from "@/app/components/ui/Button";
import {
  type ProjectWarrantySummary,
  type UpdateProjectWarrantySummaryInput,
  PROJECT_WARRANTY_STATUSES,
} from "@/app/core/projects/warranties/dto";
import {
  toDateInputValue,
  PROJECT_WARRANTY_STATUS_LABELS,
} from "../ui/warranty.utils";

const schema = z.object({
  status: z.enum(PROJECT_WARRANTY_STATUSES),
  startsAt: z.string().nullable().optional(),
  endsAt: z.string().nullable().optional(),
  months: z.number().int().min(0).nullable().optional(),
  terms: z.string().trim().nullable().optional(),
  notes: z.string().trim().nullable().optional(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  summary: ProjectWarrantySummary;
  saving?: boolean;
  onClose: () => void;
  onSubmit: (values: UpdateProjectWarrantySummaryInput) => Promise<void>;
};

export function WarrantySummaryFormDialog({
  open,
  summary,
  saving = false,
  onClose,
  onSubmit,
}: Props) {
  const defaultValues = useMemo<FormValues>(
    () => ({
      status: summary.status,
      startsAt: toDateInputValue(summary.startsAt),
      endsAt: toDateInputValue(summary.endsAt),
      months: summary.months ?? null,
      terms: summary.terms ?? "",
      notes: summary.notes ?? "",
    }),
    [summary],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    }
  }, [open, defaultValues, form]);

  async function handleSubmit(values: FormValues) {
    await onSubmit({
      status: values.status,
      startsAt: values.startsAt ? new Date(values.startsAt) : null,
      endsAt: values.endsAt ? new Date(values.endsAt) : null,
      months: values.months ?? null,
      terms: values.terms?.trim() || null,
      notes: values.notes?.trim() || null,
    });
  }

  return (
    <Modal open={open} onClose={onClose} title="Editar garantía">
      <form
        onSubmit={form.handleSubmit(handleSubmit, (errs) => {
          console.log("❌ errores de validación", errs);
        })}
        className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          {/* STATUS */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Estado
            </label>
            <select
              {...form.register("status")}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200">
              {PROJECT_WARRANTY_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {PROJECT_WARRANTY_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>

          {/* MONTHS */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Meses
            </label>
            <input
              type="number"
              {...form.register("months", {valueAsNumber: true})} // <--- Esto hace la conversión automática
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              placeholder="Ej. 12"
            />
          </div>

          {/* START */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Inicio
            </label>
            <input
              type="date"
              {...form.register("startsAt")}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* END */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Fin
            </label>
            <input
              type="date"
              {...form.register("endsAt")}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* TERMS */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Términos
            </label>
            <textarea
              {...form.register("terms")}
              rows={3}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              placeholder="Condiciones de la garantía..."
            />
          </div>

          {/* NOTES */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Notas
            </label>
            <textarea
              {...form.register("notes")}
              rows={3}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              placeholder="Observaciones internas..."
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancelar
          </Button>

          <Button type="submit" disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
