"use client";

import {useRouter} from "next/navigation";
import Modal from "@/app/components/ui/Modal";
import Button from "@/app/components/ui/Button";
import {InputForm} from "@/app/components/form/rhf/InputForm";
import {SelectForm} from "@/app/components/form/rhf/SelectForm";
import {TextareaForm} from "@/app/components/form/rhf/TextareaForm";
import {INSTALLATION_ITEM_STATUSES} from "@/app/core/projects/installation/dto";
import {INSTALLATION_ITEM_STATUS_LABELS} from "@/app/core/projects/installation/constants/status-labels";
import {useProjectInstallationItemForm} from "../hooks/useProjectInstallationItemForm";

export function ProjectInstallationItemDialog() {
  const {open, mode, close, form, submit, isSaving, error} =
    useProjectInstallationItemForm();
  const router = useRouter();

  const statusOptions = INSTALLATION_ITEM_STATUSES.map((status) => ({
    value: status,
    label: INSTALLATION_ITEM_STATUS_LABELS[status],
  }));

  return (
    <Modal
      open={open}
      onClose={close}
      title={
        mode === "update"
          ? "Editar actividad de instalación"
          : "Nueva actividad de instalación"
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
              form="installation-item-form"
              disabled={isSaving}>
              {isSaving
                ? "Guardando..."
                : mode === "update"
                  ? "Guardar cambios"
                  : "Crear actividad"}
            </Button>
          </div>
        </div>
      }>
      <form
        id="installation-item-form"
        onSubmit={submit}
        className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <InputForm
              label="Actividad"
              name="name"
              control={form.control}
              error={form.formState.errors.name}
              placeholder="Ej. Instalación de malla frontal"
            />
          </div>

          <InputForm
            label="Responsable"
            name="responsible"
            control={form.control}
            error={form.formState.errors.responsible}
            placeholder="Equipo o responsable"
          />

          <SelectForm
            label="Estado"
            name="status"
            control={form.control}
            error={form.formState.errors.status}
            options={statusOptions}
          />

          <InputForm
            label="Fecha plan"
            name="plannedAt"
            control={form.control}
            error={form.formState.errors.plannedAt}
            type="date"
          />

          <InputForm
            label="Fecha completada"
            name="completedAt"
            control={form.control}
            error={form.formState.errors.completedAt}
            type="date"
          />

          <div className="md:col-span-2">
            <TextareaForm
              label="Descripción"
              name="description"
              control={form.control}
              error={form.formState.errors.description}
              rows={3}
            />
          </div>

          <div className="md:col-span-2">
            <TextareaForm
              label="Notas"
              name="notes"
              control={form.control}
              error={form.formState.errors.notes}
              rows={3}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
