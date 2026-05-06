export function moneyCOP(value: number | string | null | undefined): string {
  // Convertimos a número y validamos
  const n = typeof value === "string" ? parseFloat(value) : Number(value);

  // Si no es un número válido, retornamos el valor "cero" formateado
  if (!Number.isFinite(n)) {
    return "$ 0";
  }

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}
