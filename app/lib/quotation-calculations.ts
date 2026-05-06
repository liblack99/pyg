import {Prisma} from "@/app/generated/prisma/client";

export interface CalcInputItem {
  quantity: number | Prisma.Decimal;
  unitPrice: number | Prisma.Decimal;
  adminPercent: number | Prisma.Decimal;
  imprPercent: number | Prisma.Decimal;
  utilPercent: number | Prisma.Decimal;
  ivaPercent: number | Prisma.Decimal;
}

export function calculateItemTotals(item: CalcInputItem, reference: string) {
  const qty = Number(item.quantity);
  const up = Number(item.unitPrice);
  const pAdmin = Number(item.adminPercent) / 100;
  const pImpr = Number(item.imprPercent) / 100;
  const pUtil = Number(item.utilPercent) / 100;
  const pIva = Number(item.ivaPercent) / 100;

  const subtotalBase = qty * up;
  const adminAmount = subtotalBase * pAdmin;
  const imprAmount = subtotalBase * pImpr;
  const utilAmount = subtotalBase * pUtil;

  const subTotalWithoutIva =
    subtotalBase + adminAmount + imprAmount + utilAmount;

  const isAiu =
    reference.toLowerCase().includes("suministro e instalación") ||
    reference.toLowerCase().includes("suministro e instalacion");

  const ivaBase = isAiu ? utilAmount : subtotalBase;
  const ivaAmount = ivaBase * pIva;

  return {
    subTotalWithoutIva: new Prisma.Decimal(subTotalWithoutIva),
    ivaAmount: new Prisma.Decimal(ivaAmount),
    totalWithIva: new Prisma.Decimal(subTotalWithoutIva + ivaAmount),
    unitPriceWithoutIva: new Prisma.Decimal(subTotalWithoutIva / qty),
  };
}
