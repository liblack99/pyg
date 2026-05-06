"use client";

import React, {useEffect, useMemo} from "react";
import type {
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
  Control,
} from "react-hook-form";

import {SelectForm} from "@/app/components/form/rhf/SelectForm";
import type {QuotationFormData} from "../../../core/quotations/schemas/quotation.schema";

import {referencesOptions} from "../constant/referencesOptions";
import {detailOptions} from "../constant/referenceDetailsOptions";

type Props = {
  control: Control<QuotationFormData>;
  setValue: UseFormSetValue<QuotationFormData>;
  watch: UseFormWatch<QuotationFormData>;
  errors: FieldErrors<QuotationFormData>;
};

export function ProjectDetailsSection({
  control,
  setValue,
  watch,
  errors,
}: Props) {
  const base = watch("reference") ?? "";

  const selected = useMemo(
    () => referencesOptions.find((o) => o.value === base) ?? null,
    [base],
  );

  // Si la opción no requiere detail, limpiamos el detail
  useEffect(() => {
    if (!selected?.needsDetail) {
      setValue("referenceDetail", "", {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [selected, setValue]);

  const presentationOptions = [
    "De forma grupal",
    "Detalle por item con AIU detallado",
    "Detalle por item con AIU incluído",
  ];

  return (
    <section>
      <h3 className="text-xl font-bold text-slate-900 mb-4 border-l-4 border-blue-700 pl-3">
        Detalles del proyecto
      </h3>

      <div className="space-y-6">
        <SelectForm<QuotationFormData>
          label="Referencia"
          name="reference"
          control={control}
          options={referencesOptions.map((o) => ({
            value: o.value,
            label: o.label,
          }))}
          error={errors.reference}
          placeholder="Selecciona una referencia…"
        />

        {selected?.needsDetail && (
          <SelectForm<QuotationFormData>
            label="Detalle"
            name="referenceDetail"
            control={control}
            options={detailOptions.map((o) => ({value: o, label: o}))}
            error={errors.referenceDetail}
            placeholder="Seleccione una opción"
          />
        )}

        <SelectForm<QuotationFormData>
          label="Presentación"
          name="presentation"
          control={control}
          options={presentationOptions.map((o) => ({value: o, label: o}))}
          error={errors.presentation}
        />
      </div>
    </section>
  );
}
