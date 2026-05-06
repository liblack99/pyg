// app/dashboard/users/[id]/page.tsx
import Link from "next/link";
import {fetchServer} from "@/app/lib/fetch.server";
import type {Me} from "@/app/lib/auth.types";
import {can} from "@/app/lib/auth.types";
import ReviewEditForm from "./components/ReviewEditForm";
import type {UpdateReview} from "@/app/core/review/dto";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const {id} = await params;
  console.log(id);

  const me = await fetchServer<Me>("/api/me");

  if (!can(me, "products:manage")) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-xl font-semibold">Editar reseña</h1>
        <p className="text-sm text-red-600">
          No tienes permiso para administrar reseña.
        </p>
        <Link
          className="inline-block rounded border px-3 py-2 text-sm"
          href="/dashboard/products">
          Volver
        </Link>
      </div>
    );
  }

  const reviews = await fetchServer<UpdateReview>(`/api/reviews/${id}`);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Editar reseña</h1>
        </div>

        <Link
          href="/dashboard/reviews"
          className="rounded border px-3 py-2 text-sm hover:bg-neutral-50">
          Volver
        </Link>
      </div>

      <ReviewEditForm reviewId={reviews.id} defaults={reviews} />
    </div>
  );
}
