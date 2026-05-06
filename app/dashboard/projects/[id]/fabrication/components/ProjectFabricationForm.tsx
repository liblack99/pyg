"use client";

import type {ProjectFabricationDetail} from "@/app/core/projects/fabrication/dto";
import {useProjectFabricationForm} from "../hooks/useProjectFabricationForm";
import {InputForm} from "@/app/components/form/rhf/InputForm";
import {TextareaForm} from "@/app/components/form/rhf/TextareaForm";
import {useFabricationDialogStore} from "../store/useFabricationDialog.store";
import Button from "@/app/components/ui/Button";
type Props = {
  fabrication: ProjectFabricationDetail;
};

export function ProjectFabricationForm({fabrication}: Props) {
  const {form, onSubmit, submitError, isSubmitting} = useProjectFabricationForm(
    {
      fabrication,
    },
  );

  const {close} = useFabricationDialogStore();

  return (
    <section className="rounded-2xl  bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Plan de fabricación
        </h3>
        <p className="mb-1 mt-1 text-sm text-slate-500">
          Configura la información general y las fechas planificadas del
          proceso.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <InputForm
            label="Título"
            name="title"
            control={form.control}
            error={form.formState.errors.title}
            placeholder="Ej. Fabricación de estructura metálica"
          />

          <div className="grid gap-4 md:grid-cols-2">
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
          </div>
        </div>

        <div className="space-y-4">
          <TextareaForm
            label="Descripción"
            name="description"
            control={form.control}
            error={form.formState.errors.description}
            rows={3}
            placeholder="Describe el alcance del proceso..."
          />

          <TextareaForm
            label="Notas generales"
            name="notes"
            control={form.control}
            error={form.formState.errors.notes}
            rows={3}
            placeholder="Observaciones internas..."
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-rose-600">{submitError}</p>

          <Button
            type="submit"
            onClick={() => close()}
            disabled={isSubmitting}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? "Guardando..." : "Guardar fabricación"}
          </Button>
        </div>
      </form>
    </section>
  );
}
