"use client";

import {useQuotationEdit} from "../hooks/useQuotationEdit";

import QuotationForm from "../../components/QuotationForm";

import {PresentationType} from "../../models/presentation.model";
import type {UpdateQuotationDefaultValues} from "@/app/core/quotations/dto";

type Props = {
  quotationId: string;
  defaults: UpdateQuotationDefaultValues;
  quotationNumber: string;
};

export default function QuotationEditForm({
  quotationId,
  defaults,
  quotationNumber,
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
  } = useQuotationEdit(quotationId, defaults);

  return (
    <QuotationForm
      title="Editar Cotización"
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
      submitLabel={"Guardar cotizacion"}
    />
  );
}
