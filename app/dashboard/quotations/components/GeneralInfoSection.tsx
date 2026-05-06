"use client";

import type {Control, FieldErrors} from "react-hook-form";
import {InputForm} from "../../../components/form/rhf/InputForm";
import {SelectForm} from "@/app/components/form/rhf/SelectForm";
import type {QuotationFormData} from "../../../core/quotations/schemas/quotation.schema";

type Props = {
  control: Control<QuotationFormData>;
  errors: FieldErrors<QuotationFormData>;
};

const validDates = [
  {value: "8", label: "8 días"},
  {value: "15", label: "15 días"},
  {value: "20", label: "20 días"},
];
export function GeneralInfoSection({control, errors}: Props) {
  return (
    <section>
      <div className="grid gap-6 md:grid-cols-2">
        <InputForm<QuotationFormData>
          label="Fecha de cotización"
          name="date"
          control={control}
          error={errors.date}
          type="date"
        />

        <SelectForm
          label="Válido por"
          name="validDays"
          control={control}
          options={validDates}
          error={errors.validDays}
          valueAsNumber={true}
        />
      </div>
    </section>
  );
}
