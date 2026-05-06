import {InputForm} from "@/app/components/form/rhf/InputForm";
import {UseFormReturn} from "react-hook-form";
import Button from "@/app/components/ui/Button";
import {ProductionOrderFormValues} from "@/app/core/projects/orderPdf/schema/production-order.schema";
import {TextareaForm} from "@/app/components/form/rhf/TextareaForm";

interface Props {
  form: UseFormReturn<ProductionOrderFormValues>;
  submit: () => void;
  isSaving?: boolean;
}

export default function ProductionOrderForm({
  form,
  submit,
  isSaving = false,
}: Props) {
  const {
    control,
    formState: {isSubmitting, errors},
  } = form;
  return (
    <form onSubmit={submit}>
      <div className="flex flex-col gap-4">
        <InputForm
          type="date"
          control={control}
          label="Fecha de entrega"
          name="deliveryDateText"
          error={errors.deliveryDateText}
        />

        <TextareaForm
          control={control}
          label="Observacion"
          name="observation"
          error={errors.observation}
        />

        <InputForm
          control={control}
          label="Definir color (opcional)"
          name="color"
          error={errors.color}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || isSaving}>
            {isSubmitting || isSaving ? "Generando orden..." : "Generar orden"}
          </Button>
        </div>
      </div>
    </form>
  );
}
