import {NextResponse} from "next/server";
import {requireAuth} from "@/app/api/_shared/auth";

import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";

import {makeProjectPurchasesUseCases} from "@/app/core/projects/purchases/usecases";

import {projectPurchasesRepo} from "@/app/infra/repositories/project/purchases/projectShopping.prisma.repo";

export async function GET(req: Request, ctx: {params: Promise<{id: string}>}) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    assertHasPermission(me.role.permissions, "project:read");

    const {id} = await ctx.params;

    const uc = makeProjectPurchasesUseCases(projectPurchasesRepo);

    const items = await uc.ListShoppingItems.execute(id);

    return NextResponse.json(items, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
