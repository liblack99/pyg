import {fetchServer} from "@/app/lib/fetch.server";
import type {Me} from "@/app/lib/auth.types";
import {can} from "@/app/lib/auth.types";
import QuotationEditForm from "./components/QuotationEditForm";
import type {UpdateQuotationDefaultValues} from "@/app/core/quotations/dto";

type Response = {
  response: string;
  user: Me;
};

export default async function EditQuotationPage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const {id} = await params;

  const me = await fetchServer<Response>("/api/me");

  console.log(me);

  if (!can(me.user, "quotation:create")) {
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
      <QuotationEditForm
        quotationId={quotation.id}
        quotationNumber={quotation.numberQuotation}
        defaults={quotation}
      />
    </div>
  );
}
