import {NextResponse} from "next/server";
import {z} from "zod";
import {requireAuth} from "@/app/api/_shared/auth";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {makeReviewUseCases} from "@/app/core/review/usecases";
import {reviewRepo} from "@/app/infra/repositories/review/review.prisma.repo";
import {ReviewSchema} from "@/app/core/review/schema/review.schema";
import {QuerySchema} from "@/app/core/review/schema/query.schema";

export async function GET(req: Request) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    assertHasPermission(me.role.permissions, "reviews:read");

    const url = new URL(req.url);
    const query = QuerySchema.parse({
      search: url.searchParams.get("search") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined,
      cursor: url.searchParams.get("cursor") ?? undefined,
    });

    const uc = makeReviewUseCases(reviewRepo);
    const result = await uc.listReviews.execute(query);

    return NextResponse.json(result, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}

export async function POST(req: Request) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    assertHasPermission(me.role.permissions, "reviews:create");

    const body = ReviewSchema.parse(await req.json().catch(() => ({})));

    const uc = makeReviewUseCases(reviewRepo);
    const created = await uc.createReview.execute({
      title: body.title,
      details: body.details ?? null,
      createdById: me.id,
    });

    return NextResponse.json(created, {status: 201});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
