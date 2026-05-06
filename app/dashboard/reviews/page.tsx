// app/dashboard/clients/page.tsx
import ReviewsTable from "./components/ReviewsTable";
import ReviewsToolbar from "./components/ReviewsToolbar";
import {fetchServer} from "@/app/lib/fetch.server";
import {can} from "@/app/lib/auth.types";
import type {Me} from "@/app/lib/auth.types";
import {Review} from "@/app/core/review/dto";
import PageHeader from "@/app/components/layout/PageHeader";

type CursorPage = {
  items: Review[];
  nextCursor: string | null;
};

type SearchParams = {
  title?: string;
};

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const me = await fetchServer<Me>("/api/me");

  const sp = await searchParams; // ✅ IMPORTANT
  const title = sp?.title ?? "";

  const qs = new URLSearchParams();
  qs.set("limit", "5");
  if (title) qs.set("search", title);

  const page1 = await fetchServer<CursorPage>(`/api/reviews?${qs.toString()}`);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Reseñas"
        subtitle="Gestiona tus reseñas"
        href="/dashboard/reviews/new"
        textButton="Nueva reseña"
      />
      <div className=" flex flex-col gap-6 bg-white pt-6 rounded-xl shadow-sm overflow-hidden ">
        <ReviewsToolbar
          values={{title}}
          canManage={can(me, "reviews:manage")}
        />
        <ReviewsTable
          initialItems={page1.items}
          initialNextCursor={page1.nextCursor}
          canManage={can(me, "reviews:manage")}
        />
      </div>
    </div>
  );
}
