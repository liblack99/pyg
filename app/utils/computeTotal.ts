import {Item} from "../core/quotations/schemas/item.schema";

function computeTotal(items: Item[], reference: string) {
  if (items.length === 0) return 0;

  // Normalizamos la referencia para que no importe mayúsculas/minúsculas
  const refLower = reference.toLowerCase();
  const isAiuContract =
    refLower.includes("suministro e instalación") ||
    refLower.includes("suministro e instalacion");

  const total = items.reduce((sum, item) => {
    const subtotal = item.quantity * item.unitPrice;

    const adminCost = subtotal * (item.adminPercent / 100);
    const imprCost = subtotal * (item.imprPercent / 100);
    const utilCost = subtotal * (item.utilPercent / 100);

    // Aplicamos la lógica de base de IVA
    const ivaBaseAmount = isAiuContract ? utilCost : subtotal;
    const iva = ivaBaseAmount * (item.ivaPercent / 100);

    const lineTotal = subtotal + adminCost + imprCost + utilCost + iva;

    return sum + lineTotal;
  }, 0);

  return Math.round(total);
}

export {computeTotal};
