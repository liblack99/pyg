import type {
  CreateProjectFinanceEntryInput,
  ProjectFinanceEntry,
  UpdateProjectFinanceEntryInput,
} from "@/app/core/projects/finance/dto";
import type {ProjectFinanceEntryFormValues} from "@/app/core/projects/finance/schema";

export function buildFinanceEntryDefaults(
  entry?: ProjectFinanceEntry | null,
): ProjectFinanceEntryFormValues {
  return {
    type: entry?.type ?? "COLLECTION",
    category: entry?.category ?? "CLIENT_PAYMENT",
    amount: entry?.amount ?? 0,
    date: entry?.date ? entry.date.slice(0, 10) : "",
    description: entry?.description ?? "",
    notes: entry?.notes ?? null,
    documentId: entry?.documentId ?? null,
  };
}

export function buildCreateFinanceEntry(
  values: ProjectFinanceEntryFormValues,
): CreateProjectFinanceEntryInput {
  return {
    type: values.type,
    category: values.category,
    amount: values.amount,
    date: values.date,
    description: values.description,
    notes: values.notes ?? null,
    documentId: values.documentId ?? null,
  };
}

export function buildUpdateFinanceEntry(
  values: ProjectFinanceEntryFormValues,
): UpdateProjectFinanceEntryInput {
  return {
    type: values.type,
    category: values.category,
    amount: values.amount,
    date: values.date,
    description: values.description,
    notes: values.notes ?? null,
    documentId: values.documentId ?? null,
  };
}
