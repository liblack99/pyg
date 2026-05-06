import {redirect} from "next/navigation";
import {fetchServer} from "@/app/lib/fetch.server";
import {Me} from "./lib/auth.types";

export default async function HomePage() {
  const data = await fetchServer<Me>("/api/me");

  if (data) {
    redirect("/dashboard");
  }

  redirect("/auth/login");
}
