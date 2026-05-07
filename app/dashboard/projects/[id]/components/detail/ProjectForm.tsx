"use client";

import React from "react";
import type {UseFormReturn} from "react-hook-form";
import {DateInputForm} from "@/app/components/form/rhf/DateInputForm";
import {SelectForm} from "@/app/components/form/rhf/SelectForm";
import Button from "@/app/components/ui/Button";
import type {ProjectFormValues} from "@/app/core/projects/schema/project.schema";

const statusOptions = [
  {value: "ACTIVE", label: "Activo"},
  {value: "COMPLETED", label: "Completado"},
  {value: "CANCELLED", label: "Cancelado"},
];

const kindOptions = [
  {value: "SUPPLY_ONLY", label: "Suministro"},
  {value: "EXECUTION", label: "Ejecución"},
  {value: "MIXED", label: "Mixto"},
];

interface Props {
  form: UseFormReturn<ProjectFormValues>;
  submit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  mode?: "create" | "update";
}

export default function ProjectForm({form, submit, mode = "update"}: Props) {
  const {
    control,
    formState: {isSubmitting, errors},
  } = form;

  const submitLabel =
    mode === "create"
      ? isSubmitting
        ? "Creando..."
        : "Crear proyecto"
      : isSubmitting
        ? "Guardando..."
        : "Guardar cambios";

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <SelectForm<ProjectFormValues>
          control={control}
          name="status"
          label="Estado del proyecto"
          options={statusOptions}
          error={errors.status}
          placeholder="Seleccione estado"
        />

        <SelectForm<ProjectFormValues>
          control={control}
          name="kind"
          label="Tipo de proyecto"
          options={kindOptions}
          error={errors.kind}
          placeholder="Seleccione tipo"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <DateInputForm<ProjectFormValues>
          control={control}
          name="procurementDueAt"
          label="Compras (Fecha planificada)"
          error={errors.procurementDueAt}
        />
        <DateInputForm<ProjectFormValues>
          control={control}
          name="procurementDoneAt"
          label="Compras (Fecha real)"
          error={errors.procurementDoneAt}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <DateInputForm<ProjectFormValues>
          control={control}
          name="fabricationDueAt"
          label="Fabricación (Fecha planificada)"
          error={errors.fabricationDueAt}
        />
        <DateInputForm<ProjectFormValues>
          control={control}
          name="fabricationDoneAt"
          label="Fabricación (Fecha real)"
          error={errors.fabricationDoneAt}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <DateInputForm<ProjectFormValues>
          control={control}
          name="installationDueAt"
          label="Instalación (Fecha planificada)"
          error={errors.installationDueAt}
        />
        <DateInputForm<ProjectFormValues>
          control={control}
          name="installationDoneAt"
          label="Instalación (Fecha real)"
          error={errors.installationDoneAt}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <DateInputForm<ProjectFormValues>
          control={control}
          name="deliveryDueAt"
          label="Entrega (Fecha planificada)"
          error={errors.deliveryDueAt}
        />
        <DateInputForm<ProjectFormValues>
          control={control}
          name="deliveryDoneAt"
          label="Entrega (Fecha real)"
          error={errors.deliveryDoneAt}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
