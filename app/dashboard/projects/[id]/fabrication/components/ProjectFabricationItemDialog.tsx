"use client";

import Modal from "@/app/components/ui/Modal";
import {InputForm} from "@/app/components/form/rhf/InputForm";
import {SelectForm} from "@/app/components/form/rhf/SelectForm";
import {TextareaForm} from "@/app/components/form/rhf/TextareaForm";

import {FABRICATION_ITEM_STATUSES} from "@/app/core/projects/fabrication/dto";
import {FABRICATION_ITEM_STATUS_LABELS} from "@/app/core/projects/fabrication/constants/status-labels";
import {useProjectFabricationItemForm} from "../hooks/useProjectFabricationItemForm";
import Button from "@/app/components/ui/Button";
import {useRouter} from "next/navigation";

export function ProjectFabricationItemDialog() {
  const {open, mode, close, form, submit, isSaving, error} =
    useProjectFabricationItemForm();

  const route = useRouter();

  const statusOptions = FABRICATION_ITEM_STATUSES.map((status) => ({
    value: status,
    label: FABRICATION_ITEM_STATUS_LABELS[status],
  }));

  return (
    <Modal
      open={open}
      onClose={close}
      title={
        mode === "update"
          ? "Editar item de fabricación"
          : "Nuevo item de fabricación"
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
              onClick={() => route.refresh()}
              form="fabrication-item-form"
              disabled={isSaving}>
              {isSaving
                ? "Guardando..."
                : mode === "update"
                  ? "Guardar cambios"
                  : "Crear item"}
            </Button>
          </div>
        </div>
      }>
      <form id="fabrication-item-form" onSubmit={submit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <InputForm
              label="Nombre"
              name="name"
              control={form.control}
              error={form.formState.errors.name}
              placeholder="Ej. Corte de piezas metálicas"
            />
          </div>

          <InputForm
            label="Unidad"
            name="unit"
            control={form.control}
            error={form.formState.errors.unit}
            placeholder="m2, und, rollo..."
          />

          <InputForm
            label="Cantidad"
            name="quantity"
            control={form.control}
            error={form.formState.errors.quantity}
            placeholder="10"
          />

          <SelectForm
            label="Estado"
            name="status"
            control={form.control}
            error={form.formState.errors.status}
            options={statusOptions}
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
