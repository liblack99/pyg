import {NextResponse} from "next/server";
import {requireAuth} from "@/app/api/_shared/auth";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {makeReviewUseCases} from "@/app/core/review/usecases";
import {reviewRepo} from "@/app/infra/repositories/review/review.prisma.repo";
import {ReviewSchema} from "@/app/core/review/schema/review.schema";

export async function GET(req: Request, ctx: {params: Promise<{id: string}>}) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    assertHasPermission(me.role.permissions, "reviews:read");

    const {id} = await ctx.params;

    const uc = makeReviewUseCases(reviewRepo);
    const review = await uc.getReviewById.execute(id);

    return NextResponse.json(review, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}

export async function PUT(req: Request, ctx: {params: Promise<{id: string}>}) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    assertHasPermission(me.role.permissions, "reviews:update");

    const {id} = await ctx.params;

    const body = ReviewSchema.parse(await req.json().catch(() => ({})));

    const uc = makeReviewUseCases(reviewRepo);
    const updated = await uc.updateReview.execute(id, {...body, id: id});

    return NextResponse.json(updated, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}

export async function DELETE(
  req: Request,
  ctx: {params: Promise<{id: string}>},
) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    assertHasPermission(me.role.permissions, "reviews:delete");

    const {id} = await ctx.params;

    const uc = makeReviewUseCases(reviewRepo);
    await uc.deleteReview.execute(id);

    return NextResponse.json({ok: true}, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
