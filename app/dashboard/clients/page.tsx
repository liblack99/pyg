// app/dashboard/clients/page.tsx
import {fetchServer} from "@/app/lib/fetch.server";
import type {Me} from "@/app/lib/auth.types";
import {ClientListItem, ClientDashboardStats} from "@/app/core/clients/dto";
import PageContentClient from "./components/PageContentClient";

type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
};

type SearchParams = {
  name?: string;
  document?: string;
};

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const me = await fetchServer<Me>("/api/me");
  console.log(me);
  const sp = await searchParams;

  const name = sp?.name ?? "";
  const document = sp?.document ?? "";

  const qs = new URLSearchParams();
  qs.set("limit", "5");
  if (name) qs.set("search", name);
  if (document) qs.set("document", document);

  const clientPage = await fetchServer<CursorPage<ClientListItem>>(
    `/api/clients?${qs.toString()}`,
  );

  const summary =
    await fetchServer<ClientDashboardStats>(`/api/clients/summary`);

  return (
    <PageContentClient
      clients={clientPage}
      me={me}
      summary={summary}
      values={{name, document}}
    />
  );
}
