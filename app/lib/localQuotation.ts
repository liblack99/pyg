import {QuotationFormData} from "@/app/core/quotations/schemas/quotation.schema";
const STORAGE_KEY = "quotations";

export function getLocalQuotations(): QuotationFormData[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function saveLocalQuotation(quotation: QuotationFormData) {
  const existing = getLocalQuotations();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, quotation]));
}

export function getNextQuotationNumber(): string {
  const existing = getLocalQuotations();
  const next = existing.length + 1;
  return `COTIZ-${next.toString().padStart(3, "0")}`;
}
