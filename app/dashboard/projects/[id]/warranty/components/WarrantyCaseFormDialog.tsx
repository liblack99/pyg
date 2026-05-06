"use client";

import {useEffect, useMemo} from "react";
import {z} from "zod";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import Modal from "@/app/components/ui/Modal";
import Button from "@/app/components/ui/Button";
import type {
  CreateProjectWarrantyCaseInput,
  ProjectWarrantyCaseView,
  UpdateProjectWarrantyCaseInput,
} from "@/app/core/projects/warranties/dto";

import {
  WARRANTY_CASE_STATUSES,
  WARRANTY_CASE_TYPES,
  WARRANTY_RESPONSIBILITIES,
} from "@/app/core/projects/warranties/dto";

import {
  WARRANTY_CASE_STATUS_LABELS,
  WARRANTY_CASE_TYPE_LABELS,
  WARRANTY_RESPONSIBILITY_LABELS,
} from "../ui/warranty.utils";
import {toDateInputValue} from "../ui/warranty.utils";

const schema = z.object({
  type: z.enum(WARRANTY_CASE_TYPES),
  status: z.enum(WARRANTY_CASE_STATUSES),
  responsibility: z.enum(WARRANTY_RESPONSIBILITIES),
  title: z.string().trim().min(2, "El título es obligatorio."),
  description: z.string().trim().nullable().optional(),

  reportedAt: z.string().min(1, "La fecha de reporte es obligatoria."),
  detectedAt: z.string().nullable().optional(),
  startedAt: z.string().nullable().optional(),
  resolvedAt: z.string().nullable().optional(),

  estimatedCost: z.number().min(0, "No puede ser negativo.").nullable(),
  realCost: z.number().min(0, "No puede ser negativo.").nullable(),

  supplierId: z.string().trim().nullable().optional(),
  reportedByUserId: z.string().trim().nullable().optional(),
  resolutionNotes: z.string().trim().nullable().optional(),
  internalNotes: z.string().trim().nullable().optional(),
});

type FormValues = z.infer<typeof schema>;

type SupplierOption = {
  id: string;
  name: string;
};

type ReporterOption = {
  id: string;
  name: string;
};

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: ProjectWarrantyCaseView | null;
  suppliers?: SupplierOption[];
  reporters?: ReporterOption[];
  saving?: boolean;
  onClose: () => void;
  onSubmit: (
    values: CreateProjectWarrantyCaseInput | UpdateProjectWarrantyCaseInput,
  ) => Promise<void>;
};

export function WarrantyCaseFormDialog({
  open,
  mode,
  initialData,
  suppliers = [],
  reporters = [],
  saving = false,
  onClose,
  onSubmit,
}: Props) {
  const defaultValues = useMemo<FormValues>(
    () => ({
      type: initialData?.type ?? "OTHER",
      status: initialData?.status ?? "OPEN",
      responsibility: initialData?.responsibility ?? "UNDEFINED",
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      reportedAt: toDateInputValue(initialData?.reportedAt),
      detectedAt: toDateInputValue(initialData?.detectedAt),
      startedAt: toDateInputValue(initialData?.startedAt),
      resolvedAt: toDateInputValue(initialData?.resolvedAt),
      estimatedCost:
        initialData?.estimatedCost !== null &&
        initialData?.estimatedCost !== undefined
          ? Number(initialData.estimatedCost)
          : null,
      realCost:
        initialData?.realCost !== null && initialData?.realCost !== undefined
          ? Number(initialData.realCost)
          : null,
      supplierId: initialData?.supplierId ?? "",
      reportedByUserId: initialData?.reportedByUserId ?? "",
      resolutionNotes: initialData?.resolutionNotes ?? "",
      internalNotes: initialData?.internalNotes ?? "",
    }),
    [initialData],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form, open]);

  async function handleSubmit(values: FormValues) {
    const payload = {
      type: values.type,
      status: values.status,
      responsibility: values.responsibility,
      title: values.title.trim(),
      description: values.description?.trim()
        ? values.description.trim()
        : null,
      reportedAt: new Date(values.reportedAt),
      detectedAt: values.detectedAt?.trim()
        ? new Date(values.detectedAt)
        : null,
      startedAt: values.startedAt?.trim() ? new Date(values.startedAt) : null,
      resolvedAt: values.resolvedAt?.trim()
        ? new Date(values.resolvedAt)
        : null,
      estimatedCost: values.estimatedCost ?? 0,
      realCost: values.realCost ?? 0,
      supplierId: values.supplierId?.trim() ? values.supplierId : null,
      reportedByUserId: values.reportedByUserId?.trim()
        ? values.reportedByUserId
        : null,
      resolutionNotes: values.resolutionNotes?.trim()
        ? values.resolutionNotes.trim()
        : null,
      internalNotes: values.internalNotes?.trim()
        ? values.internalNotes.trim()
        : null,
    };

    await onSubmit(payload);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        mode === "create" ? "Nuevo caso de garantía" : "Editar caso de garantía"
      }>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Tipo
            </label>
            <select
              {...form.register("type")}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
              {WARRANTY_CASE_TYPES.map((value) => (
                <option key={value} value={value}>
                  {WARRANTY_CASE_TYPE_LABELS[value]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Estado
            </label>
            <select
              {...form.register("status")}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
              {WARRANTY_CASE_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {WARRANTY_CASE_STATUS_LABELS[value]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Responsable
            </label>
            <select
              {...form.register("responsibility")}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
              {WARRANTY_RESPONSIBILITIES.map((value) => (
                <option key={value} value={value}>
                  {WARRANTY_RESPONSIBILITY_LABELS[value]}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Título
            </label>
            <input
              {...form.register("title")}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              placeholder="Ej. Ajuste de instalación en zona norte"
            />
            {form.formState.errors.title && (
              <p className="mt-1 text-xs text-rose-600">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Descripción
            </label>
            <textarea
              {...form.register("description")}
              rows={3}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              placeholder="Describe el caso reportado"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Reportado el
            </label>
            <input
              type="date"
              {...form.register("reportedAt")}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Detectado el
            </label>
            <input
              type="date"
              {...form.register("detectedAt")}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Iniciado el
            </label>
            <input
              type="date"
              {...form.register("startedAt")}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Resuelto el
            </label>
            <input
              type="date"
              {...form.register("resolvedAt")}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Costo estimado
            </label>
            <Controller
              control={form.control}
              name="estimatedCost"
              render={({field}) => (
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  placeholder="0"
                />
              )}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Costo real
            </label>
            <Controller
              control={form.control}
              name="realCost"
              render={({field}) => (
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  placeholder="0"
                />
              )}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Proveedor
            </label>
            <select
              {...form.register("supplierId")}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
              <option value="">Sin proveedor</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Reportado por
            </label>
            <select
              {...form.register("reportedByUserId")}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
              <option value="">Sin usuario</option>
              {reporters.map((reporter) => (
                <option key={reporter.id} value={reporter.id}>
                  {reporter.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Notas de resolución
            </label>
            <textarea
              {...form.register("resolutionNotes")}
              rows={3}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              placeholder="Acción correctiva o resultado"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Notas internas
            </label>
            <textarea
              {...form.register("internalNotes")}
              rows={3}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              placeholder="Observaciones internas"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={saving}>
            {saving
              ? "Guardando..."
              : mode === "create"
                ? "Crear caso"
                : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
