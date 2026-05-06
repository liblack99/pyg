import Link from "next/link";
import {can} from "@/app/lib/auth.types";
import {fetchServer} from "@/app/lib/fetch.server";
import {Me} from "@/app/lib/auth.types";
import ReviewCreateForm from "./components/ReviewCreateForm";

export default async function NewReviewPage() {
  const me = await fetchServer<Me>("/api/me");

  if (!can(me, "reviews:manage")) {
    return (
      <div className="p-6 space-y-4">
        <div>
          <h1 className="text-xl font-semibold">Crear reseña</h1>
          <p className="text-sm text-red-600">
            No tienes permiso para administrar reseñas.
          </p>
        </div>

        <Link
          href="/dashboard/reviews"
          className="inline-block rounded border px-3 py-2 text-sm hover:bg-neutral-50">
          Volver
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <ReviewCreateForm />
    </div>
  );
}
