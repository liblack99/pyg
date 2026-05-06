"use client";

import {UseFormReturn} from "react-hook-form";

import {InputForm} from "@/app/components/form/rhf/InputForm";
import Button from "@/app/components/ui/Button";
import {ReviewSchemaForm} from "../../../core/review/schema/review.schema";
import RichTextEditor from "@/app/components/RichTextEditor";
import {Controller} from "react-hook-form";
type Props = {
  form: UseFormReturn<ReviewSchemaForm>;
  onSubmit: () => void;
  submitLabel: string;
  serverError?: string | null;
};

export default function ReviewForm({
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-1 md:gap-6 mb-14">
        {/* Col 1 */}
        <InputForm
          label="Nombre de la reseña *"
          control={control}
          name="title"
          type="text"
          error={errors.title}
        />
        <Controller
          control={control}
          name="details"
          render={({field}) => (
            <RichTextEditor
              value={field.value ?? "<p></p>"}
              onChange={(html) => field.onChange(html)}
            />
          )}
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
