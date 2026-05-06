"use client";

import React from "react";
import {QuotationItemCard} from "./QuotationItemCard";
import type {PresentationType} from "../models/presentation.model";
import {
  SearchAutocomplete,
  type CursorPage,
} from "@/app/components/search/SearchAutocomplete";
import type {Item} from "../models/item.model";
import {ProductListItem} from "@/app/core/products/dto";
import {apiGet} from "@/app/lib/api.client";
import {FieldErrors, UseFormWatch} from "react-hook-form";
import type {QuotationFormData} from "../../../core/quotations/schemas/quotation.schema";

type Props = {
  addProductAsItem: (product: ProductListItem) => void;
  updateItem: (index: number, item: Item) => void;
  removeItem: (index: number) => void;
  presentation: PresentationType;
  items: Item[];
  errors?: FieldErrors<QuotationFormData>;
  watch: UseFormWatch<QuotationFormData>;
};

type ProductListResponse = CursorPage<ProductListItem>;

export function ProductsAndServiceSection({
  addProductAsItem,
  updateItem,
  removeItem,
  presentation,
  items,
  errors,
  watch,
}: Props) {
  const searchProduct = async (term: string) => {
    const url = `/api/products?search=${encodeURIComponent(term)}&limit=10`;
    const res = await apiGet<ProductListResponse>(url);
    return res;
  };
  const reference = watch("reference");
  return (
    <div className="mb-4">
      <h3 className="text-xl font-bold text-slate-900 mb-4 border-l-4 border-blue-700 pl-3">
        Productos y servicios
      </h3>
      <div className="rounded-xl  mb-4">
        <SearchAutocomplete
          minChars={2}
          label="Producto o servicio"
          debounceMs={250}
          getKey={(c) => c.id}
          searchFn={searchProduct}
          onSelect={(c) => addProductAsItem(c)}
          renderItem={(product) => (
            <div className="px-4 py-3 flex justify-between hover:bg-blue-50 transition">
              <div>
                <div className="text-xs text-slate-500">{product.code}</div>
                <div className="font-medium text-slate-900">{product.name}</div>
              </div>
              <div className="font-bold text-blue-900">
                ${product.unitPrice.toLocaleString("es-CO")}
              </div>
            </div>
          )}
        />
      </div>

      {items?.length > 0 && (
        <div className="space-y-4">
          {items?.map((item, index) => (
            <QuotationItemCard
              reference={reference}
              key={item.code}
              item={item}
              presentationType={presentation as PresentationType}
              onRemove={() => removeItem(index)}
              onItemChange={(updatedItem) => updateItem(index, updatedItem)}
              errors={{
                unit: errors?.items?.[index]?.unit?.message,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
