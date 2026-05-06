"use client";

import {useQuotationForm} from "../hooks/useQuotationForm";
import QuotationForm from "../../components/QuotationForm";
import type {PresentationType} from "../../models/presentation.model";

type Props = {
  quotationId: string;
};

export default function QuotationCreateForm({quotationId}: Props) {
  const {
    form,
    items,
    presentation,
    terms,
    serverError,
    addProductAsItem,
    removeItem,
    updateItem,
    submit,
    updateTermAccepted,
  } = useQuotationForm();

  return (
    <div>
      <QuotationForm
        title="Crear Nueva Cotización"
        quotationId={quotationId}
        form={form}
        items={items}
        presentation={presentation as PresentationType}
        terms={terms}
        serverError={serverError}
        addProductAsItem={addProductAsItem}
        removeItem={removeItem}
        updateItem={updateItem}
        onSubmit={submit}
        updateTermAccepted={updateTermAccepted}
        submitLabel={"Crear cotizacion"}
      />
    </div>
  );
}
