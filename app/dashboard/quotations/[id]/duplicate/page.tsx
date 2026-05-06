import {fetchServer} from "@/app/lib/fetch.server";
import type {Me} from "@/app/lib/auth.types";
import {can} from "@/app/lib/auth.types";
import type {UpdateQuotationDefaultValues} from "@/app/core/quotations/dto";
import QuotationDuplicateForm from "./components/QuotationDuplicateForm";

type Response = {
  response: string;
  user: Me;
};

export default async function DuplicateQuotationPage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const {id} = await params;

  const me = await fetchServer<Response>("/api/me");

  if (!can(me.user, "quotation:read")) {
    return (
      <div className="p-6 space-y-4">
        <p className="text-sm text-red-600">
          No tienes permiso para administrar cotizaciones.
        </p>
      </div>
    );
  }

  const quotation = await fetchServer<UpdateQuotationDefaultValues>(
    `/api/quotations/${id}`,
  );

  return (
    <div className="p-6 space-y-4">
      <QuotationDuplicateForm
        quotationId={quotation.id}
        quotationNumber={quotation.numberQuotation}
        defaults={quotation}
      />
    </div>
  );
}
