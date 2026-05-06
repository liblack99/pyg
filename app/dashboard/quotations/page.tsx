// app/dashboard/quotations/new/page.tsx
import Link from "next/link";
import {fetchServer} from "@/app/lib/fetch.server";
import type {Me} from "@/app/lib/auth.types";
import {can} from "@/app/lib/auth.types";
import type {
  QuotationListItem,
  QuotationListQuery,
} from "@/app/core/quotations/dto";
import {toQuotationSearchParams} from "@/app/utils/toQuotationSearchParams";
import QuotationExportExcelButton from "./components/QuotationExportExcelButton";

import QuotationPageContent from "./components/QuotationPageContent";
import type {QuotationAdvisorOption} from "./components/QuotationToolbar";
import type {QuotationDashboardStats} from "@/app/core/quotations/dto";
import QuotationSummary from "./components/QuotationSummary";
import PageHeader from "@/app/components/layout/PageHeader";
import type {UserListItem} from "@/app/core/users/dto";
type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
};

export default async function QuotationPage({
  searchParams,
}: {
  searchParams: QuotationListQuery;
}) {
  const me = await fetchServer<Me>("/api/me");

  const params = await searchParams;

  const limit = params.limit ?? 5;

  const qs = toQuotationSearchParams({
    ...params,
    limit: limit,
  });

  if (!can(me, "quotation:read")) {
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

  const listQuotation = await fetchServer<CursorPage<QuotationListItem>>(
    `/api/quotations?${qs.toString()}`,
  );

  const summary = await fetchServer<QuotationDashboardStats>(
    "/api/quotations/summary",
  );

  const users = await fetchServer<UserListItem[]>("/api/users");

  const advisors: QuotationAdvisorOption[] = users.map((user) => ({
    id: user.id,
    name: user.name,
  }));

  return (
    <div className=" space-y-4">
      <PageHeader
        title="Cotizaciones"
        subtitle="Gestiona tus cotizaciones y propuestas comerciales"
        href={"/dashboard/quotations/new"}
        textButton=" Nueva Cotización">
        <QuotationExportExcelButton />
      </PageHeader>

      <QuotationSummary
        data={summary}
        canEditGoal={can(me, "quotation:update")}
      />

      <QuotationPageContent
        initialItems={listQuotation.items}
        initialNextCursor={listQuotation.nextCursor}
        query={params}
        limit={limit}
        advisors={advisors}
      />
    </div>
  );
}
