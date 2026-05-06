"use client";
import QuotationForm from "../../../components/QuotationForm";
import {useQuotationDuplicate} from "../hooks/useQuoationDuplicate";
import type {PresentationType} from "../../../models/presentation.model";
import type {UpdateQuotationDefaultValues} from "@/app/core/quotations/dto";

type Props = {
  quotationId: string;
  defaults: UpdateQuotationDefaultValues;
  quotationNumber: string;
};

export default function QuotationDuplicateForm({
  quotationId,
  quotationNumber,
  defaults,
}: Props) {
  const {
    form,
    items,
    presentation,
    terms,
    updateItem,
    removeItem,
    addProductAsItem,
    updateTermAccepted,
    submit,
    serverError,
  } = useQuotationDuplicate(quotationId, defaults);

  return (
    <QuotationForm
      title="Duplicandon cotizacion"
      quotationId={quotationNumber}
      form={form}
      items={items}
      presentation={presentation as PresentationType}
      terms={terms}
      updateItem={updateItem}
      removeItem={removeItem}
      addProductAsItem={addProductAsItem}
      updateTermAccepted={updateTermAccepted}
      onSubmit={submit}
      serverError={serverError}
      submitLabel={"Duplicar cotizacion"}
    />
  );
}
