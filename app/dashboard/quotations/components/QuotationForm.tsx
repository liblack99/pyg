"use client";

import Button from "@/app/components/ui/Button";
import {GeneralInfoSection} from "./GeneralInfoSection";
import {ClientFormSection} from "./ClientFormSection";
import {ProjectDetailsSection} from "./ProjectDetailsSection";
import {ProductsAndServiceSection} from "./ProductsAndServicesSection";
import TotalQuotation from "./TotalQuotation";
import FinalConditions from "./FinalConditions";
import TermsConditions from "./TermsConditions";
import CommercialConditions from "./CommercialConditions";
import {QuotationFloatingPdfButton} from "./QuotationFloatingPdfButton";
import type {PresentationType} from "../models/presentation.model";
import {useEffect, useMemo} from "react";
import {UseFormReturn} from "react-hook-form";
import {
  quotationSchema,
  type QuotationFormData,
} from "../../../core/quotations/schemas/quotation.schema";
import {ProductListItem} from "@/app/core/products/dto";
import {Item} from "../models/item.model";
import {Terms} from "../../../core/quotations/schemas/terms.schema";

type Props = {
  quotationId: string;
  form: UseFormReturn<QuotationFormData>;
  updateTermAccepted: (termKey: string, accepted: boolean) => void;
  addProductAsItem: (product: ProductListItem) => void;
  updateItem: (index: number, item: Item) => void;
  removeItem: (index: number) => void;
  presentation: PresentationType;
  items: Item[];
  onSubmit: () => void;
  terms: Terms[];
  serverError?: string | null;
  submitLabel: string;
  title: string;
};

export default function QuotationForm({
  quotationId,
  form,
  updateTermAccepted,
  addProductAsItem,
  updateItem,
  removeItem,
  presentation,
  items,
  onSubmit,
  terms,
  serverError,
  submitLabel,
  title,
}: Props) {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: {errors, isSubmitting},
  } = form;

  const setNumberQuotationId = (id: string) => {
    setValue("numberQuotation", id, {shouldDirty: true});
  };

  const formValues = watch();
  const pdfFormValues = useMemo<QuotationFormData>(() => {
    const clientEmail = formValues.client?.email?.trim();

    return {
      ...formValues,
      client: {
        ...formValues.client,
        email: clientEmail ? clientEmail : undefined,
      },
    };
  }, [formValues]);

  const canDownloadPdf = useMemo(
    () => quotationSchema.safeParse(pdfFormValues).success,
    [pdfFormValues],
  );

  useEffect(() => {
    setNumberQuotationId(quotationId);
  }, [quotationId]);

  return (
    <form
      className="space-y-12 p-2"
      onSubmit={handleSubmit(onSubmit, (errs) => {
        console.log("❌ errores de validación", errs);
      })}>
      {/* ---------------- GENERAL INFO ---------------- */}
      <h2 className="text-4xl font-extrabold mb-4 text-slate-900 dark:text-white tracking-tight">
        {title}
      </h2>
      <div className="">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-900 border-l-4 border-blue-700 pl-3">
            Información general
          </h3>
          <div className="rounded-lg bg-blue-50 px-4  py-2 text-blue-900 font-bold">
            No. {quotationId}
          </div>
        </div>
        <GeneralInfoSection control={control} errors={errors} />
      </div>
      {/* ---------------- CLIENTE ---------------- */}
      <div className="">
        <ClientFormSection
          watch={watch}
          control={control}
          errors={errors}
          setValue={setValue}
        />
      </div>

      {/* ---------------- PROYECTO ---------------- */}
      <div className="">
        <ProjectDetailsSection
          control={control}
          setValue={setValue}
          watch={watch}
          errors={errors}
        />
      </div>
      {/* ---------------- PRODUCTOS ---------------- */}
      <div className="">
        <ProductsAndServiceSection
          addProductAsItem={addProductAsItem}
          updateItem={(index, item) => updateItem(index, item)}
          removeItem={(id) => removeItem(id)}
          presentation={presentation as PresentationType}
          items={items}
          errors={errors}
          watch={watch}
        />
        {/* ---------------- TOTALES ---------------- */}

        <TotalQuotation Watch={watch} />
      </div>

      <div className="flex flex-col gap-8 mb-8">
        {/* ---------------- CONDICIONES FINALES ---------------- */}
        <FinalConditions watch={watch} setValue={setValue} />

        {/* ---------------- TÉRMINOS ---------------- */}
        <TermsConditions
          control={control}
          errors={errors}
          terms={terms}
          updateTermAccepted={updateTermAccepted}
        />

        {/* ---------------- COMERCIALES ---------------- */}

        <CommercialConditions control={control} errors={errors} />

        {serverError && (
          <div className="md:col-span-2 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {serverError}
          </div>
        )}
      </div>

      <div className="flex justify-end my-2">
        <Button type="submit" className="primary">
          {isSubmitting ? "Guardando..." : submitLabel}
        </Button>
      </div>

      <QuotationFloatingPdfButton
        formValues={pdfFormValues}
        disabled={!canDownloadPdf || isSubmitting}
      />
    </form>
  );
}
