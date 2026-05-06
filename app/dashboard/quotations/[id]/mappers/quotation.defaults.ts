// app/dashboard/quotations/[id]/mappers/quotation.defaults.ts
import {termsAndConditions} from "../../constant/terms";
import type {QuotationFormData} from "../../../../core/quotations/schemas/quotation.schema";
import type {Item} from "../../models/item.model";

export type QuotationDetailDTO = {
  id: string;
  numberQuotation: string | null;
  status: string;

  date: string | Date;
  validDays: number;

  clientId: string | null;
  clientSnapshot: unknown | null;

  projectReference: string;
  projectReferenceDetail: string | null;
  projectPresentation: string;

  specialConditions: string | null;
  timeDelivery: string | null;
  workLocation: string | null;

  guarantees: string | null;
  commercialCondition: string | null;
  paymentMethod: string | null;

  reviewTitle: string | null;
  reviewDetails: string | null;

  totalGeneral: unknown; // puede ser number o Decimal (lo normalizamos)
  items: Array<{
    productId: string;
    productName: string;
    code: string | null;
    description: string;
    unit: string;
    quantity: unknown; // number/Decimal/string
    unitPrice: unknown;
    adminPercent: unknown;
    utilPercent: unknown;
    imprPercent: unknown;
    ivaPercent: unknown;
  }>;

  terms: Array<{
    key: string | null;
    text: string;
    required: boolean;
    accepted: boolean;
    order: number;
  }>;
};

function toISODateOnly(d: string | Date): string {
  const dateObj = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(dateObj.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }
  return dateObj.toISOString().slice(0, 10);
}

function toNumber(v: unknown, fallback = 0): number {
  if (typeof v === "number") return Number.isFinite(v) ? v : fallback;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }
  // Prisma.Decimal a veces viene como objeto con toString()
  if (v && typeof v === "object" && "toString" in v) {
    const n = Number(String(v.toString()));
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}

function toStringOrEmpty(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function snapshotToClientForm(snapshot: unknown): QuotationFormData["client"] {
  if (!snapshot || typeof snapshot !== "object") {
    return {
      id: "",
      name: "",
      documentType: "",
      documentNumber: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      department: "",
    };
  }

  const o = snapshot as Record<string, unknown>;

  return {
    id: toStringOrEmpty(o["id"]),

    name: toStringOrEmpty(o["name"]),
    documentType: toStringOrEmpty(o["documentType"]),
    documentNumber: toStringOrEmpty(o["documentNumber"]),
    email: toStringOrEmpty(o["email"]),
    phone: toStringOrEmpty(o["phone"]),
    address: toStringOrEmpty(o["address"]),
    city: toStringOrEmpty(o["city"]),
    department: toStringOrEmpty(["department"]), // por si cambiaste el nombre
  };
}

/**
 * Los items de DB -> items del form
 */
function toItemForm(it: QuotationDetailDTO["items"][number]): Item {
  return {
    productId: it.productId,
    productName: it.productName,
    code: it.code ?? "",
    description: it.description ?? "",
    unit: it.unit ?? "",
    quantity: toNumber(it.quantity, 1),
    unitPrice: toNumber(it.unitPrice, 0),
    adminPercent: toNumber(it.adminPercent, 0),
    utilPercent: toNumber(it.utilPercent, 0),
    imprPercent: toNumber(it.imprPercent, 0),
    ivaPercent: toNumber(it.ivaPercent, 0),
  };
}

/**
 * terms guardados (tal vez solo aceptados) -> termsAccepted completo
 * Regla:
 * - partimos del catálogo (termsAndConditions)
 * - marcamos accepted=true si existe en q.terms algún term con mismo key y accepted=true
 */
function buildTermsAcceptedFromDetail(
  detailTerms: QuotationDetailDTO["terms"],
) {
  const acceptedKeys = new Set(
    detailTerms.filter((t) => t.accepted && t.key).map((t) => String(t.key)),
  );

  return termsAndConditions.map((term) => ({
    key: term.key,
    text: term.text,
    required: term.required,
    accepted: acceptedKeys.has(term.key),
  }));
}

/**
 * MAIN: QuotationDetail -> DefaultValues del form
 */
export function quotationDetailToDefaults(
  q: QuotationDetailDTO,
): Partial<QuotationFormData> {
  return {
    date: toISODateOnly(q.date),
    numberQuotation: q.numberQuotation ?? "",

    validDays: q.validDays ?? 30,

    client: snapshotToClientForm(q.clientSnapshot),

    reference: q.projectReference ?? "",
    presentation: q.projectPresentation ?? "",

    items: (q.items ?? []).map(toItemForm),

    terms: buildTermsAcceptedFromDetail(q.terms ?? []),
    specialConditions: q.specialConditions ?? "",
    timeDelivery: q.timeDelivery ?? "",
    workLocation: q.workLocation ?? "",

    conditions: {
      guarantees: q.guarantees ?? "",
      commercialCondition: q.commercialCondition ?? "",
      paymentMethod: q.paymentMethod ?? "",
      reviews: q.reviewTitle ?? "",
      reviewsDetails: q.reviewDetails ?? "",
    },

    totalGeneral: toNumber(q.totalGeneral, 0),
  };
}
