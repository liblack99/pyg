// app/api/roles/route.ts
import {NextResponse} from "next/server";
import {assertHasPermission} from "../_shared/auth-dev";
import {makeSupplierUseCases} from "@/app/core/supplier/usecases";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {supplierRepo} from "@/app/infra/repositories/supplier/supplier.prisma.repo";
import {requireAuth} from "@/app/api/_shared/auth";

export async function GET() {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    assertHasPermission(me.role.permissions, "suppliers:manage");

    // Usecases (inyección)
    const uc = makeSupplierUseCases(supplierRepo);
    const suppliers = await uc.listSupplier.execute();

    return NextResponse.json(suppliers);
  } catch (e: unknown) {
    return handleHttpError(e, {
      route: "/api/suppliers",
      method: "GET",
      step: "listSuppliers",
    });
  }
}
