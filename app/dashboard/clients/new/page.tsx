import {fetchServer} from "@/app/lib/fetch.server";
import {Me} from "@/app/lib/auth.types";
import PageContentNewClient from "./components/PageContentNewClient";

export default async function NewClientPage() {
  const me = await fetchServer<Me>("/api/me");

  return <PageContentNewClient me={me} />;
}
