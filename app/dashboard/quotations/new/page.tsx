// app/dashboard/quotations/new/page.tsx
import Link from "next/link";
import {fetchServer} from "@/app/lib/fetch.server";
import type {Me} from "@/app/lib/auth.types";
import {can} from "@/app/lib/auth.types";

import QuotationCreateForm from "./components/QuotationCreateForm";

type NexNumberResponse = {
  nextNumberQuotation: string;
};

export default async function NewQuotationPage() {
  const me = await fetchServer<Me>("/api/me");

  if (!can(me, "quotation:create")) {
    return (
      <div className="p-6 space-y-4">
        <div>
          <h1 className="text-xl font-semibold">Crear cotización</h1>
          <p className="text-sm text-red-600">
            No tienes permiso para crear cotizaciones.
          </p>
        </div>

        <Link
          href="/dashboard/quotations"
          className="inline-block rounded border px-3 py-2 text-sm hover:bg-neutral-50">
          Volver
        </Link>
      </div>
    );
  }

  // ✅ SSR: creas el draft ANTES de renderizar el form (y ya tienes el número)
  const nextNumber = await fetchServer<NexNumberResponse>(
    "/api/quotations/next-number",
  );

  console.log(nextNumber);

  return (
    <div className="">
      <QuotationCreateForm quotationId={nextNumber.nextNumberQuotation} />
    </div>
  );
}
