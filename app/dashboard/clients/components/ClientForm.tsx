import React from "react";

import type {UseFormReturn} from "react-hook-form";
import type {ClientSchemaForm} from "@/app/core/clients/schema/client.schema";
import Button from "@/app/components/ui/Button";
import {InputForm} from "@/app/components/form/rhf/InputForm";
import {SelectForm} from "@/app/components/form/rhf/SelectForm";

type Props = {
  form: UseFormReturn<ClientSchemaForm>;
  onSubmit: () => void;
  submitLabel: string;
  serverError?: string | null;
};

export default function ClientForm({
  form,
  onSubmit,
  submitLabel,
  serverError,
}: Props) {
  const {
    control,
    formState: {errors, isSubmitting},
  } = form;

  const documentType = [
    {value: "RUT", label: "RUT"},
    {value: "NIT", label: "NIT"},
    {value: "C.C", label: "C.C"},
    {value: "C.E", label: "C.E"},
    {value: "PASAPORTE", label: "PASAPORTE"},
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InputForm
          label="Nombre del cliente"
          control={control}
          name="name"
          type="text"
          error={errors.name}
        />

        <SelectForm
          control={control}
          name="documentType"
          label="Tipo de documento"
          options={documentType.map((r) => ({
            value: r.value,
            label: r.label,
          }))}
          error={errors.documentType}
        />

        <InputForm
          label="Numero de documento"
          control={control}
          name="documentNumber"
          type="text"
          error={errors.documentNumber}
        />

        <InputForm
          label="Correo electronico"
          control={control}
          name="email"
          type="email"
          error={errors.email}
        />

        <InputForm
          label="Telefono"
          control={control}
          name="phone"
          type="text"
          error={errors.phone}
        />

        <InputForm
          label="Direccion"
          control={control}
          name="address"
          type="text"
          error={errors.address}
        />

        <InputForm
          label="Ciudad"
          control={control}
          name="city"
          type="text"
          error={errors.city}
        />

        <InputForm
          label="Departamento"
          control={control}
          name="department"
          type="text"
          error={errors.department}
        />

        <div className="md:col-span-2 pt-2">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Contacto 1
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
        </div>

        <InputForm
          label="Nombre contacto"
          control={control}
          name="contactName1"
          type="text"
          error={errors.contactName1}
        />

        <InputForm
          label="Cargo del contacto"
          control={control}
          name="contactRole1"
          type="text"
          error={errors.contactRole1}
        />

        <InputForm
          label="Telefono del contacto"
          control={control}
          name="contactPhone1"
          type="text"
          error={errors.contactPhone1}
        />

        <div className="hidden md:block" />

        <div className="md:col-span-2 pt-2">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Contacto 2
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
        </div>

        <InputForm
          label="Nombre contacto"
          control={control}
          name="contactName2"
          type="text"
          error={errors.contactName2}
        />

        <InputForm
          label="Cargo del contacto"
          control={control}
          name="contactRole2"
          type="text"
          error={errors.contactRole2}
        />

        <InputForm
          label="Telefono del contacto"
          control={control}
          name="contactPhone2"
          type="text"
          error={errors.contactPhone2}
        />

        <div className="hidden md:block" />

        {serverError && (
          <div className="md:col-span-2 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <div className="md:col-span-2 flex items-center justify-end gap-2 pt-2">
          <Button type="submit" disabled={isSubmitting} className="primary">
            {isSubmitting ? "Guardando..." : submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}
