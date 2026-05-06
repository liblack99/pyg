export const calculateItemTotals = (
  reference: string,
  quantity: number,
  unitPrice: number,
  adminPercent: number = 2.5,
  imprPercent: number = 2.5,
  utilPercent: number = 10,
  ivaPercent: number = 19,
) => {
  const subtotal = quantity * unitPrice;

  const admin = subtotal * (adminPercent / 100);
  const impr = subtotal * (imprPercent / 100);
  const util = subtotal * (utilPercent / 100);

  const ivaBase = reference.includes("Suministro e instalación de")
    ? util
    : subtotal;

  const iva = ivaBase * (ivaPercent / 100);

  const total = subtotal + admin + impr + util + iva;

  return {
    subtotal,
    admin,
    impr,
    util,
    iva,
    total,
  };
};
