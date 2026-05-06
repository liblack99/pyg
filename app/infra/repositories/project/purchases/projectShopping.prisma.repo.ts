import {ProjectPurchasesRepoPort} from "@/app/core/projects/purchases/port/project.purchases.repo.port";
import type {
  UpdateProcurementInput,
  ProcurementStatus,
} from "@/app/core/projects/purchases/dto";

import {prisma} from "@/app/lib/prisma";
import {Prisma} from "@/app/generated/prisma/client";
import {toNum} from "@/app/infra/utils/toNumber";

export const projectPurchasesRepo: ProjectPurchasesRepoPort = {
  async listPurchasableBudgetItems(projectId: string) {
    const items = await prisma.projectBudgetItem.findMany({
      where: {
        projectId,
        supplierId: {not: null},
        totalCost: {gt: 0},
      },
      orderBy: [{procurementStatus: "asc"}, {createdAt: "asc"}],
      select: {
        id: true,
        createdAt: true,

        description: true,
        quantity: true,

        supplierId: true,
        supplierNameSnapshot: true,
        supplier: {
          select: {id: true, name: true, requiresProductionOrder: true},
        },

        unitCost: true,
        totalCost: true,

        procurementStatus: true,
        orderedAt: true,
        receivedAt: true,
        purchaseNotes: true,
      },
    });

    // normalizar nombre del proveedor (snapshot > relación)
    return items.map((it) => ({
      ...it,
      supplierName: it.supplierNameSnapshot ?? it.supplier?.name ?? "Proveedor",
      unitCost: toNum(it.unitCost) ?? 0,
      totalCost: toNum(it.totalCost) ?? 0,
    }));
  },
  async updateBudgetItemProcurementStatus(
    projectId: string,
    budgetItemId: string,
    input: UpdateProcurementInput,
  ) {
    const status = input.status as ProcurementStatus;

    // 1) Cargar item (validar project + campos para guards)
    const item = await prisma.projectBudgetItem.findFirst({
      where: {id: budgetItemId, projectId},
      select: {
        id: true,
        projectId: true,
        supplierId: true,
        totalCost: true,
        procurementStatus: true,
        orderedAt: true,
        receivedAt: true,
        purchaseNotes: true,
      },
    });

    if (!item) throw new Error("Budget item not found for this project");

    // 2) Guards: para estados de compra, debe tener proveedor y costo > 0
    const total = Number(item.totalCost ?? 0);

    const requiresSupplierAndCost =
      status === "ORDERED" || status === "RECEIVED";

    if (requiresSupplierAndCost) {
      if (!item.supplierId) {
        throw new Error("Cannot mark as ORDERED/RECEIVED without supplier");
      }
      if (!Number.isFinite(total) || total <= 0) {
        throw new Error(
          "Cannot mark as ORDERED/RECEIVED without totalCost > 0",
        );
      }
    }

    // 3) Preparar update con reglas de fechas
    const data: Prisma.ProjectBudgetItemUpdateInput = {
      procurementStatus: status,
    };

    if (input.purchaseNotes !== undefined) {
      data.purchaseNotes = input.purchaseNotes;
    }

    if (status === "PENDING") {
      // reset suave
      data.orderedAt = null;
      data.receivedAt = null;
    }

    if (status === "ORDERED") {
      // si ya tenía orderedAt, no lo pisamos
      data.orderedAt = item.orderedAt ?? new Date();
      data.receivedAt = null;
    }

    if (status === "RECEIVED") {
      // si no estaba ordenado, lo marcamos ordenado automáticamente
      data.orderedAt = item.orderedAt ?? new Date();
      data.receivedAt = item.receivedAt ?? new Date();
    }

    if (status === "CANCELLED") {
      // cancelado: mantén trazabilidad de fechas si quieres, o resetea.
      // Aquí lo dejo reseteando recibido (y conserva orderedAt si ya existía)
      data.receivedAt = null;
    }

    // 4) Guardar
    const updated = await prisma.projectBudgetItem.update({
      where: {id: item.id},
      data,
      select: {
        id: true,
        procurementStatus: true,
        orderedAt: true,
        receivedAt: true,
        purchaseNotes: true,
        supplierId: true,
        totalCost: true,
      },
    });

    const updateResponse = {
      id: updated.id,
      procurementStatus: updated.procurementStatus as ProcurementStatus,
      orderedAt: updated.orderedAt,
      receivedAt: updated.receivedAt,
      purchaseNotes: updated.purchaseNotes,
      supplierId: updated.supplierId,
      totalCost: toNum(updated.totalCost) ?? 0,
    };

    return updateResponse;
  },
};
