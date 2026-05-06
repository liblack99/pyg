"use client";

import Button from "@/app/components/ui/Button";
import {InputForm} from "@/app/components/form/rhf/InputForm";
import {SelectForm} from "@/app/components/form/rhf/SelectForm";
import {TextareaForm} from "@/app/components/form/rhf/TextareaForm";
import type {ProjectInstallationDetail} from "@/app/core/projects/installation/dto";
import {PROJECT_INSTALLATION_STATUSES} from "@/app/core/projects/installation/dto";
import {PROJECT_INSTALLATION_STATUS_LABELS} from "@/app/core/projects/installation/constants/status-labels";
import {useProjectInstallationForm} from "../hooks/useProjectInstallationForm";
import {useInstallationDialogStore} from "../store/useInstallationDialog.store";

type Props = {
  installation: ProjectInstallationDetail;
};

export function ProjectInstallationForm({installation}: Props) {
  const {form, onSubmit, submitError, isSubmitting} = useProjectInstallationForm(
    {
      installation,
    },
  );
  const {close} = useInstallationDialogStore();

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Plan de instalación
        </h3>
        <p className="mb-1 mt-1 text-sm text-slate-500">
          Configura responsable, estado y fechas generales de la instalación.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <InputForm
            label="Responsable"
            name="responsible"
            control={form.control}
            error={form.formState.errors.responsible}
            placeholder="Ej. Coordinador de instalación"
          />

          <SelectForm
            label="Estado"
            name="status"
            control={form.control}
            error={form.formState.errors.status}
            options={PROJECT_INSTALLATION_STATUSES.map((status) => ({
              value: status,
              label: PROJECT_INSTALLATION_STATUS_LABELS[status],
            }))}
          />

          <InputForm
            label="Inicio planificado"
            name="plannedStartAt"
            control={form.control}
            error={form.formState.errors.plannedStartAt}
            type="date"
          />

          <InputForm
            label="Fin planificado"
            name="plannedEndAt"
            control={form.control}
            error={form.formState.errors.plannedEndAt}
            type="date"
          />

          <InputForm
            label="Inicio real"
            name="actualStartAt"
            control={form.control}
            error={form.formState.errors.actualStartAt}
            type="date"
          />

          <InputForm
            label="Fin real"
            name="actualEndAt"
            control={form.control}
            error={form.formState.errors.actualEndAt}
            type="date"
          />
        </div>

        <TextareaForm
          label="Resumen general"
          name="summary"
          control={form.control}
          error={form.formState.errors.summary}
          rows={3}
          placeholder="Describe el alcance general de la fase de instalación..."
        />

        <TextareaForm
          label="Notas"
          name="notes"
          control={form.control}
          error={form.formState.errors.notes}
          rows={4}
          placeholder="Observaciones operativas, restricciones o pendientes..."
        />

        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-rose-600">{submitError}</p>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={close}>
              Cancelar
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar instalación"}
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
