import React from "react";
import {UseFormReturn} from "react-hook-form";
import {
  ProductSchemaForm,
  ProductSchemaInput,
} from "../../../core/products/schemas/product.schema";
import {InputForm} from "@/app/components/form/rhf/InputForm";
import {InputFileForm} from "@/app/components/form/rhf/InputFileForm";
import {TextareaForm} from "@/app/components/form/rhf/TextareaForm";
import Button from "@/app/components/ui/Button";
import {CurrencyInputForm} from "@/app/components/form/rhf/CurrencyInputForm";

type Props = {
  form: UseFormReturn<ProductSchemaInput, unknown, ProductSchemaForm>;
  onSubmit: () => void;
  submitLabel: string;
  serverError?: string | null;
};

export default function ProductForm({
  form,
  onSubmit,
  submitLabel,
  serverError,
}: Props) {
  const {
    control,
    formState: {errors, isSubmitting},
  } = form;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* GRID simétrica */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {/* Col 1 */}
        <InputForm
          label="Nombre del producto"
          control={control}
          name="name"
          type="text"
          error={errors.name}
        />

        {/* Col 2 */}
        <InputForm
          label="Codigo"
          control={control}
          name="code"
          type="text"
          error={errors.code}
        />

        <InputForm
          label="Unidad de medida"
          control={control}
          name="unit"
          type="text"
          error={errors.unit}
          placeholder="Ej: UNIDAD, M2, ML"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        <CurrencyInputForm
          label="Valor unitario "
          control={control}
          name="unitPrice"
          error={errors.unitPrice}
        />
      </div>

      {/* Col 2 */}

      {/* Full width */}
      <div className="md:col-span-3 flex flex-col gap-6">
        <TextareaForm
          label="Descripcion "
          control={control}
          name="description"
          error={errors.description}
        />
        <InputFileForm
          label="Imagen "
          control={control}
          name="imageUrl"
          error={errors.imageUrl}
        />
      </div>

      {serverError && (
        <div className="md:col-span-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {/* Footer full width */}
      <div className="w-full flex items-center justify-end gap-2 pt-2">
        <Button type="submit" disabled={isSubmitting} className="primary">
          {isSubmitting ? "Guardando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
