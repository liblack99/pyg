"use client";

import {useRouter} from "next/navigation";
import {Controller} from "react-hook-form";
import Modal from "@/app/components/ui/Modal";
import Button from "@/app/components/ui/Button";
import {InputForm} from "@/app/components/form/rhf/InputForm";
import {SelectForm} from "@/app/components/form/rhf/SelectForm";
import {TextareaForm} from "@/app/components/form/rhf/TextareaForm";
import {
  PROJECT_FINANCE_ENTRY_CATEGORIES,
  PROJECT_FINANCE_ENTRY_TYPES,
} from "@/app/core/projects/finance/dto";
import {
  PROJECT_FINANCE_ENTRY_CATEGORY_LABELS,
  PROJECT_FINANCE_ENTRY_TYPE_LABELS,
} from "@/app/core/projects/finance/constants/labels";
import {useProjectFinanceEntryForm} from "../hooks/useProjectFinanceEntryForm";

export function ProjectFinanceEntryDialog() {
  const {open, mode, close, form, submit, isSaving, error, documents} =
    useProjectFinanceEntryForm();
  const router = useRouter();

  return (
    <Modal
      open={open}
      onClose={close}
      title={
        mode === "update"
          ? "Editar movimiento financiero"
          : "Nuevo movimiento financiero"
      }
      footer={
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-rose-600">{error}</p>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={close}>
              Cancelar
            </Button>

            <Button
              type="submit"
              onClick={() => router.refresh()}
              form="project-finance-entry-form"
              disabled={isSaving}>
              {isSaving
                ? "Guardando..."
                : mode === "update"
                  ? "Guardar cambios"
                  : "Crear movimiento"}
            </Button>
          </div>
        </div>
      }>
      <form
        id="project-finance-entry-form"
        onSubmit={submit}
        className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <SelectForm
            label="Tipo"
            name="type"
            control={form.control}
            error={form.formState.errors.type}
            options={PROJECT_FINANCE_ENTRY_TYPES.map((type) => ({
              value: type,
              label: PROJECT_FINANCE_ENTRY_TYPE_LABELS[type],
            }))}
          />

          <SelectForm
            label="Categoría"
            name="category"
            control={form.control}
            error={form.formState.errors.category}
            options={PROJECT_FINANCE_ENTRY_CATEGORIES.map((category) => ({
              value: category,
              label: PROJECT_FINANCE_ENTRY_CATEGORY_LABELS[category],
            }))}
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Valor
            </label>
            <Controller
              control={form.control}
              name="amount"
              render={({field}) => (
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  placeholder="0"
                />
              )}
            />
            {form.formState.errors.amount ? (
              <p className="mt-1 text-xs text-rose-600">
                {form.formState.errors.amount.message}
              </p>
            ) : null}
          </div>

          <InputForm
            label="Fecha"
            name="date"
            control={form.control}
            error={form.formState.errors.date}
            type="date"
          />

          <div className="md:col-span-2">
            <InputForm
              label="Descripción"
              name="description"
              control={form.control}
              error={form.formState.errors.description}
              placeholder="Ej. Cobro de anticipo del cliente"
            />
          </div>

          <div className="md:col-span-2">
            <SelectForm
              label="Soporte asociado"
              name="documentId"
              control={form.control}
              error={form.formState.errors.documentId}
              options={documents.map((document) => ({
                value: document.id,
                label: `${document.title} · ${document.type}`,
              }))}
              placeholder="Sin soporte asociado"
            />
          </div>

          <div className="md:col-span-2">
            <TextareaForm
              label="Notas"
              name="notes"
              control={form.control}
              error={form.formState.errors.notes}
              rows={3}
              placeholder="Observaciones adicionales del movimiento..."
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
