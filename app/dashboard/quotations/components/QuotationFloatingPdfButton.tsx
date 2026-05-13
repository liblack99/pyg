"use client";

import {useState} from "react";
import {Document, pdf} from "@react-pdf/renderer";
import {FileDown, Loader2} from "lucide-react";

import Button from "@/app/components/ui/Button";
import type {Quotation} from "@/app/core/quotations/dto";
import type {QuotationFormData} from "@/app/core/quotations/schemas/quotation.schema";
import {QuotationInvoicePdf} from "@/app/core/quotations/pdf/react-pdf/QuotationInvoicePdf";
import {downloadBlob} from "@/app/lib/downloadBlob";
import {computeTotal} from "@/app/utils/computeTotal";

type Props = {
  formValues: QuotationFormData;
  disabled: boolean;
};

function fileSafeName(value: string) {
  return value.trim().replace(/[^\w.-]+/g, "-") || "cotizacion";
}

function asDataUri(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

async function getBrandLogoSrc() {
  const response = await fetch("/parque_y_grama.png");
  if (!response.ok) return null;
  return asDataUri(await response.blob());
}

function buildQuotationPreview(data: QuotationFormData): Quotation {
  const now = new Date();
  const quotationId = "preview";

  return {
    id: quotationId,
    createdAt: now,
    updatedAt: now,
    numberQuotation: data.numberQuotation,
    status: "DRAFT",
    sentAt: null,
    approvedAt: null,
    rejectedAt: null,
    expiredAt: null,
    cancelledAt: null,
    date: new Date(data.date),
    validDays: data.validDays,
    createdById: "",
    createdBy: null,
    clientId: data.client?.id ?? null,
    clientSnapshot: data.client,
    projectReference: data.reference,
    projectReferenceDetail: data.referenceDetail,
    projectPresentation: data.presentation,
    specialConditions: data.specialConditions ?? null,
    timeDelivery: data.timeDelivery ?? null,
    workLocation: data.workLocation ?? null,
    guarantees: data.conditions?.guarantees ?? null,
    commercialCondition: data.conditions?.commercialCondition ?? null,
    paymentMethod: data.conditions?.paymentMethod ?? null,
    installationSystem: data.installationSystem ?? null,
    reviewTemplateId: null,
    reviewTemplate: null,
    reviewTitle: data.conditions?.reviews ?? null,
    reviewDetails: data.conditions?.reviewsDetails ?? null,
    totalGeneral: Number(computeTotal(data.items, data.reference).toFixed(2)),
    items: data.items.map((item, index) => ({
      id: `${quotationId}-item-${index}`,
      createdAt: now,
      quotationId,
      productId: item.productId,
      productName: item.productName,
      code: item.code,
      description: item.description ?? "",
      unit: item.unit,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      adminPercent: item.adminPercent,
      utilPercent: item.utilPercent,
      imprPercent: item.imprPercent,
      ivaPercent: item.ivaPercent,
    })),
    terms: data.terms.map((term, index) => ({
      id: `${quotationId}-term-${term.key}`,
      quotationId,
      key: term.key,
      text: term.text,
      required: term.required,
      accepted: term.accepted,
      order: index,
    })),
    projectId: null,
    contractId: null,
    note: null,
  };
}

export function QuotationFloatingPdfButton({formValues, disabled}: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (disabled || isGenerating) return;

    try {
      setIsGenerating(true);
      setError(null);

      const [brandLogoSrc] = await Promise.all([getBrandLogoSrc()]);
      const quotation = buildQuotationPreview(formValues);
      const blob = await pdf(
        <Document>
          <QuotationInvoicePdf q={quotation} brandLogoSrc={brandLogoSrc} />
        </Document>,
      ).toBlob();

      downloadBlob({
        blob,
        filename: `${fileSafeName(quotation.numberQuotation)}.pdf`,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo generar el PDF",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed top-24 right-10 z-40 flex flex-col items-end gap-2">
      {error ? (
        <div className="max-w-xs rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 shadow-sm">
          {error}
        </div>
      ) : null}
      <Button
        type="button"
        variant="primary"
        onClick={handleDownload}
        disabled={disabled || isGenerating}
        title={
          disabled
            ? "Completa los datos requeridos para descargar la cotizacion"
            : "Descargar cotizacion"
        }
        className=" shadow-lg shadow-blue-900/20 disabled:cursor-not-allowed disabled:opacity-60">
        {isGenerating ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <FileDown size={18} />
        )}
        <span className="hidden sm:inline">
          {isGenerating ? "Generando..." : "Descargar PDF"}
        </span>
      </Button>
    </div>
  );
}
