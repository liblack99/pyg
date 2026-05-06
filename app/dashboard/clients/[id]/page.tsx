// app/dashboard/users/[id]/page.tsx
import {fetchServer} from "@/app/lib/fetch.server";
import type {Me} from "@/app/lib/auth.types";
import {ClientListItem} from "@/app/core/clients/dto";
import PageContentEditClient from "./components/PageContentEditClient";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const {id} = await params;

  const me = await fetchServer<Me>("/api/me");
  const client = await fetchServer<ClientListItem>(`/api/clients/${id}`);

  return <PageContentEditClient client={client} me={me} />;
}
