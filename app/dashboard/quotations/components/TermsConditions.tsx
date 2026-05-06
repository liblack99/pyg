import React from "react";
import {InputForm} from "@/app/components/form/rhf/InputForm";
import {CheckboxList} from "@/app/components/ui/CheckboxList";
import {Terms} from "../../../core/quotations/schemas/terms.schema";
import {FieldErrors, Control} from "react-hook-form";
import {QuotationFormData} from "../../../core/quotations/schemas/quotation.schema";
import {TextareaForm} from "@/app/components/form/rhf/TextareaForm";
import {SelectForm} from "@/app/components/form/rhf/SelectForm";
import {installationSystemOptions} from "../constant/installationSystemOptions";

type Props = {
  control: Control<QuotationFormData>;
  errors: FieldErrors<QuotationFormData>;
  terms: Terms[];
  updateTermAccepted: (key: string, accepted: boolean) => void;
};

export default function TermsConditions({
  control,
  errors,
  terms,
  updateTermAccepted,
}: Props) {
  return (
    <div>
      <h3 className="text-xl font-bold text-slate-800 mb-4 border-l-4 border-blue-700 pl-3">
        Términos y condiciones
      </h3>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <InputForm
          label="Tiempo de entrega"
          name="timeDelivery"
          control={control}
          error={errors.timeDelivery}
        />
        <InputForm
          label="Lugar de la obra"
          name="workLocation"
          control={control}
          error={errors.workLocation}
        />
        <SelectForm
          label="Sistemas de instalación"
          name="installationSystem"
          control={control}
          error={errors.installationSystem}
          options={installationSystemOptions}
        />
      </div>
      <div className="mb-4">
        <TextareaForm
          label="Condiciones especiales"
          name="specialConditions"
          control={control}
          error={errors.specialConditions}
        />
      </div>

      <div className=" border-slate-200 bg-slate-50 ">
        <CheckboxList
          items={terms}
          onChange={(key, checked) => updateTermAccepted(key, checked)}
          errorMessage={errors.terms?.message}
        />
      </div>
    </div>
  );
}
