import {computeTotal} from "@/app/utils/computeTotal";
import {QuotationFormData} from "../../../../core/quotations/schemas/quotation.schema";

export function buildQuotationDraftPayload(data: QuotationFormData) {
  const totalGeneral = computeTotal(data.items, data.reference);

  return {
    numberQuotation: data.numberQuotation,
    date: new Date(data.date).toISOString(),
    validDays: data.validDays ?? 30,

    clientId: data.client?.id ?? null,
    clientSnapshot: data.client ?? null,

    projectReference: data.reference ?? "",
    projectReferenceDetail: data.referenceDetail ?? "",
    projectPresentation: data.presentation ?? "",

    specialConditions: data.specialConditions ?? null,
    timeDelivery: data.timeDelivery ?? null,
    workLocation: data.workLocation ?? null,
    installationSystem: data.installationSystem ?? null,

    guarantees: data.conditions?.guarantees ?? null,
    commercialCondition: data.conditions?.commercialCondition ?? null,
    paymentMethod: data.conditions?.paymentMethod ?? null,

    reviewTitle: data.conditions?.reviews ?? null,
    reviewDetails: data.conditions?.reviewsDetails ?? null,

    totalGeneral,
    items: data.items,
    terms: data.terms,
  };
}
