import {NextResponse} from "next/server";
import {requireAuth} from "@/app/api/_shared/auth";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {updateProjectFinanceEntrySchema} from "@/app/core/projects/finance/schema";
import {makeProjectFinanceUseCases} from "@/app/core/projects/finance/usecases";
import {projectFinancePrismaRepo} from "@/app/infra/repositories/project/finance/project-finance.prisma.repo";

export async function PUT(
  req: Request,
  ctx: {params: Promise<{id: string; entryId: string}>},
) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    const {entryId} = await ctx.params;

    assertHasPermission(me.role.permissions, "project:update");

    const body = await req.json().catch(() => ({}));
    const input = updateProjectFinanceEntrySchema.parse(body);

    const uc = makeProjectFinanceUseCases(projectFinancePrismaRepo);
    const result = await uc.updateProjectFinanceEntry.execute(entryId, input);

    return NextResponse.json(result, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}

export async function DELETE(
  req: Request,
  ctx: {params: Promise<{id: string; entryId: string}>},
) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    const {entryId} = await ctx.params;

    assertHasPermission(me.role.permissions, "project:update");

    const uc = makeProjectFinanceUseCases(projectFinancePrismaRepo);
    const result = await uc.voidProjectFinanceEntry.execute(entryId);

    return NextResponse.json(result, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
