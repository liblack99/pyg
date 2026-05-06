import {InputForm} from "@/app/components/form/rhf/InputForm";
import {COMMERCIAL_CONDITIONS} from "../constant/commercialCondition";
import {GUARANTEES} from "../constant/guarantees";
import {FieldErrors, Control} from "react-hook-form";
import {QuotationFormData} from "../../../core/quotations/schemas/quotation.schema";
import {SelectForm} from "@/app/components/form/rhf/SelectForm";

type Props = {
  control: Control<QuotationFormData>;

  errors: FieldErrors<QuotationFormData>;
};

export default function CommercialConditions({control, errors}: Props) {
  return (
    <div>
      <h3 className="text-xl font-bold text-slate-900 mb-4 border-l-4 border-blue-700 pl-3">
        Condiciones comerciales
      </h3>

      <div className="space-y-5">
        <SelectForm
          label="Condición comercial"
          name="conditions.commercialCondition"
          control={control}
          options={COMMERCIAL_CONDITIONS.map((o) => ({
            value: o,
            label: o,
          }))}
          error={errors.conditions?.commercialCondition}
        />

        <SelectForm
          label="Garantías"
          name="conditions.guarantees"
          control={control}
          options={GUARANTEES.map((o) => ({
            value: o,
            label: o,
          }))}
          error={errors.conditions?.guarantees}
        />

        <InputForm
          label="Forma de pago"
          name="conditions.paymentMethod"
          control={control}
          error={errors.conditions?.paymentMethod}
        />
      </div>
    </div>
  );
}
