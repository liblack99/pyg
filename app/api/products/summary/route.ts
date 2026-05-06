import {NextResponse} from "next/server";
import {requireAuth} from "@/app/api/_shared/auth";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {makeProductUseCases} from "@/app/core/products/usecases";
import {productRepo} from "@/app/infra/repositories/product/product.prisma.repo";

export async function GET() {
  console.log(" [PRODUCT DASHBOARD DEBUG]: Start GET /api/products/summary");

  try {
    // 1. Verificación de Autenticación
    const me = await requireAuth();
    if (!me) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    assertHasPermission(me.role.permissions, "products:read");

    const uc = makeProductUseCases(productRepo);

    const stats = await uc.summary.execute();

    // 5. Validación de consistencia para evitar el error de serialización
    if (!stats) {
      console.error(" [PRODUCT DASHBOARD DEBUG]: UseCase returned undefined");
      return NextResponse.json(
        {error: "No product data available"},
        {status: 500},
      );
    }

    console.log(" [PRODUCT DASHBOARD DEBUG]: Stats successfully retrieved");

    return NextResponse.json(stats, {status: 200});
  } catch (e: unknown) {
    console.error(" [PRODUCT DASHBOARD DEBUG]: Error in Route:", e);
    return handleHttpError(e);
  }
}
