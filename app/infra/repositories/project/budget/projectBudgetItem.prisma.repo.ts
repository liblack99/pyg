import {prisma} from "@/app/lib/prisma";
import {Prisma} from "@/app/generated/prisma/client";
import type {ProjectBudgetItemUpdateInput} from "@/app/core/projects/budget/dto";
import {ProjectBudgetItemRepoPort} from "@/app/core/projects/budget/port/projectBudgetItem.repo.port";
import {toNum as toNumberQty} from "@/app/infra/utils/toNumber";

async function recomputeProjectBudget(
  tx: Prisma.TransactionClient,
  projectId: string,
) {
  // 1) sumar totalCost
  const agg = await tx.projectBudgetItem.aggregate({
    where: {projectId},
    _sum: {totalCost: true},
  });

  const budgetTotal = agg._sum.totalCost ?? 0;

  // 2) traer spendingLimit65 para remaining
  const project = await tx.project.findUnique({
    where: {id: projectId},
    select: {spendingLimit65: true},
  });
  if (!project) throw new Error("Project not found");

  const remaining = project.spendingLimit65.sub(budgetTotal);

  // 3) OP se deriva de presupuesto: existe item con supplier.requiresProductionOrder=true
  const needsOP = await tx.projectBudgetItem.findFirst({
    where: {
      projectId,
      supplierId: {not: null},
      supplier: {requiresProductionOrder: true},
    },
    select: {id: true},
  });

  await tx.project.update({
    where: {id: projectId},
    data: {
      budgetTotal,
      remaining,
      requiresProductionOrder: Boolean(needsOP),
    },
  });
}

export const projectBudgetItemRepo: ProjectBudgetItemRepoPort = {
  async listByProjectId(projectId: string) {
    const items = await prisma.projectBudgetItem.findMany({
      where: {projectId},
      orderBy: {createdAt: "asc"},
      select: {
        id: true,
        createdAt: true,
        projectId: true,

        description: true,
        quantity: true,

        supplierId: true,
        supplierNameSnapshot: true,

        unitCost: true,
        totalCost: true,

        notes: true,
      },
    });

    return items.map((it) => ({
      id: it.id,
      createdAt: it.createdAt,
      projectId: it.projectId,

      description: it.description,
      quantity: it.quantity ?? 0,

      supplierId: it.supplierId,
      supplierNameSnapshot: it.supplierNameSnapshot,

      unitCost: toNumberQty(it.unitCost),
      totalCost: toNumberQty(it.totalCost),

      notes: it.notes,
    }));
  },
  async getById(projectId: string, itemId: string) {
    const item = await prisma.projectBudgetItem.findUnique({
      where: {id: itemId},
      select: {
        id: true,
        createdAt: true,
        projectId: true,
        description: true,
        quantity: true,
        supplierId: true,
        supplierNameSnapshot: true,
        unitCost: true,
        totalCost: true,
        notes: true,
      },
    });

    if (!item) throw new Error("Budget item not found");
    if (item.projectId !== projectId) throw new Error("Invalid project");

    return {
      ...item,
      quantity: toNumberQty(item.quantity),
      unitCost: toNumberQty(item.unitCost),
      totalCost: toNumberQty(item.totalCost),
    };
  },
  async update(
    projectId: string,
    itemId: string,
    input: ProjectBudgetItemUpdateInput,
  ) {
    return prisma.$transaction(async (tx) => {
      // 1) Obtener estado actual
      const current = await tx.projectBudgetItem.findUnique({
        where: {id: itemId},
        select: {
          id: true,
          projectId: true,
          quantity: true,
          unitCost: true,
        },
      });

      if (!current) throw new Error("Budget item not found");
      if (current.projectId !== projectId) throw new Error("Invalid project");

      let supplierNameSnapshot: string | null | undefined = undefined;
      if ("supplierId" in input) {
        if (input.supplierId) {
          const s = await tx.supplier.findUnique({
            where: {id: input.supplierId},
            select: {name: true},
          });
          supplierNameSnapshot = s?.name ?? null;
        } else {
          supplierNameSnapshot = null;
        }
      }

      // 3) REFACTOR DE CÁLCULOS CON toNum
      // Si viene en el input lo usamos, si no, convertimos lo que hay en la DB
      const nextQty =
        input.quantity !== undefined
          ? input.quantity
          : toNumberQty(current.quantity);

      const nextUnitCost =
        input.unitCost !== undefined
          ? input.unitCost
          : toNumberQty(current.unitCost);

      // Cálculo del total simple y limpio
      const nextTotalCost = nextQty * (nextUnitCost ?? 0);

      // 4) Persistencia
      const updated = await tx.projectBudgetItem.update({
        where: {id: itemId},
        data: {
          description: input.description?.trim(),
          notes: input.notes,
          quantity: input.quantity, // Prisma acepta el number del input
          supplierId: input.supplierId,
          supplierNameSnapshot,
          unitCost: input.unitCost,
          totalCost: nextTotalCost, // Mandamos el number calculado
        },
        select: {
          id: true,
          createdAt: true,
          projectId: true,
          description: true,
          quantity: true,
          supplierId: true,
          supplierNameSnapshot: true,
          unitCost: true,
          totalCost: true,
          notes: true,
        },
      });

      // 5) Recalcular totales del proyecto
      await recomputeProjectBudget(tx, projectId);

      // 6) Retorno consistente (todo como number)
      return {
        ...updated,
        quantity: toNumberQty(updated.quantity),
        unitCost: toNumberQty(updated.unitCost),
        totalCost: toNumberQty(updated.totalCost),
      };
    });
  },

  async remove(projectId: string, itemId: string) {
    await prisma.$transaction(async (tx) => {
      const current = await tx.projectBudgetItem.findUnique({
        where: {id: itemId},
        select: {id: true, projectId: true},
      });

      if (!current) throw new Error("Budget item not found");
      if (current.projectId !== projectId) throw new Error("Invalid project");

      await tx.projectBudgetItem.delete({where: {id: itemId}});
      await recomputeProjectBudget(tx, projectId);
    });
  },
};
