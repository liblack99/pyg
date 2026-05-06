import {fetchServer} from "@/app/lib/fetch.server";
import {Me} from "@/app/lib/auth.types";
import PageContentNewProduct from "./components/PageContentNewProduct";

export default async function NewProductPage() {
  const me = await fetchServer<Me>("/api/me");

  return <PageContentNewProduct me={me} />;
}
