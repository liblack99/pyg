// app/dashboard/quotations/[id]/hooks/useQuotationFormState.ts
"use client";
import {useState} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm, useFieldArray, useWatch} from "react-hook-form";
import {useCallback, useEffect} from "react";
import {
  quotationSchema,
  QuotationFormData,
} from "../../../core/quotations/schemas/quotation.schema";
import type {Item} from "../models/item.model";
import {ProductListItem} from "@/app/core/products/dto";
import {termsAndConditions} from "../constant/terms";
import {computeTotal} from "@/app/utils/computeTotal";
import type {UpdateQuotationDefaultValues} from "@/app/core/quotations/dto";
import {Client} from "@/app/core/clients/dto";

const defaultTermsAccepted = termsAndConditions.map((term) => ({
  key: term.key,
  text: term.text,
  required: term.required,
  accepted: term.defaultChecked ?? false,
}));

export type UseQuotationFormStateArgs = {
  defaultValues?: UpdateQuotationDefaultValues;
  mode?: "onSubmit" | "onTouched";
};

export function useQuotationFormState(args?: UseQuotationFormStateArgs) {
  const client = args?.defaultValues?.clientSnapshot as Client;
  const form = useForm<QuotationFormData>({
    resolver: zodResolver(quotationSchema),
    mode: args?.mode ?? "onSubmit",
    defaultValues: {
      ...args?.defaultValues,
      date: args?.defaultValues?.date
        ? new Date(args.defaultValues.date).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      numberQuotation: args?.defaultValues?.numberQuotation ?? "",
      validDays: args?.defaultValues?.validDays ?? 30,
      client: {
        id: client?.id ?? "",
        name: client?.name ?? "",
        documentType: client?.documentType ?? "",
        documentNumber: client?.documentNumber ?? "",
        email: client?.email ?? "",
        phone: client?.phone ?? "",
        address: client?.address ?? "",
        city: client?.city ?? "",
        department: client?.department ?? "",
        contactName1: client?.contactName1 ?? "",
        contactPhone1: client?.contactPhone1 ?? "",
        contactRole1: client?.contactRole1 ?? "",
        contactName2: client?.contactName2 ?? "",
        contactPhone2: client?.contactPhone2 ?? "",
        contactRole2: client?.contactRole2 ?? "",
      },

      reference: args?.defaultValues?.projectReference ?? "",
      referenceDetail: args?.defaultValues?.projectReferenceDetail ?? "",
      presentation: args?.defaultValues?.projectPresentation ?? "",

      items: args?.defaultValues?.items?.length ? args.defaultValues.items : [],
      terms: args?.defaultValues?.terms?.length
        ? args.defaultValues.terms
        : defaultTermsAccepted,
      specialConditions: args?.defaultValues?.specialConditions ?? "",
      timeDelivery: args?.defaultValues?.timeDelivery ?? "",
      workLocation: args?.defaultValues?.workLocation ?? "",

      conditions: {
        guarantees: args?.defaultValues?.guarantees ?? "",
        commercialCondition: args?.defaultValues?.commercialCondition ?? "",
        paymentMethod:
          "Consignación en la Cuenta Corriente de Bancolombia N°: 487-000032-08 a nombre de Parque y Grama Construcciones S.A.S.",
        reviews: args?.defaultValues?.reviewTitle ?? "",
        reviewsDetails: args?.defaultValues?.reviewDetails ?? "",
      },
      totalGeneral: Number(args?.defaultValues?.totalGeneral ?? 0),
    },
  });

  const items = useWatch({control: form.control, name: "items"});

  const reference = useWatch({control: form.control, name: "reference"});

  console.log("valores de formulario", form.getValues());

  useEffect(() => {
    const total = computeTotal(items, reference);
    form.setValue("totalGeneral", Number(total.toFixed(2)), {
      shouldDirty: true,
    });
  }, [items, form, reference]);

  const terms = useWatch({control: form.control, name: "terms"});

  const presentation = useWatch({
    control: form.control,
    name: "presentation",
  });
  const itemsArray = useFieldArray({control: form.control, name: "items"});

  const updateItem = (index: number, updatedItem: Item) => {
    itemsArray.update(index, updatedItem);
  };

  const removeItem = (index: number) => {
    itemsArray.remove(index);
  };
  const updateTermAccepted = useCallback(
    (key: string, accepted: boolean) => {
      const current = form.getValues("terms");
      const updated = current.map((t) =>
        t.key === key ? {...t, accepted} : t,
      );
      form.setValue("terms", updated, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [form],
  );

  const convertProductToItem = useCallback(
    (product: ProductListItem, quantity: number = 1): Item => ({
      code: product.code,
      productName: product.name,
      description: product.description,
      unit: product.unit,
      productId: product.id,
      quantity,
      unitPrice: product.unitPrice,
      adminPercent: 2.5,
      imprPercent: 2.5,
      utilPercent: 10,
      ivaPercent: 19,
    }),
    [],
  );

  const addProductAsItem = useCallback(
    (product: ProductListItem, quantity: number = 1) => {
      const exists = itemsArray.fields.some(
        (item) => item.productId === product.id,
      );
      if (exists) {
        alert("El producto ya está en la lista");
        return;
      }
      itemsArray.append(convertProductToItem(product, quantity));
    },
    [itemsArray, convertProductToItem],
  );

  return {
    form,
    itemsArray,
    items,
    presentation,
    terms,
    updateItem,
    removeItem,
    updateTermAccepted,
    addProductAsItem,
  };
}
