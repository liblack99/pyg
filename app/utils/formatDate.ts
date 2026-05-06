export function formatDate(
  value: string | Date | null | undefined,
  locale: string = "es-CO",
): string {
  if (!value) return "—";

  const d = new Date(value);

  if (Number.isNaN(d.getTime())) return "—";

  return d.toLocaleDateString(locale);
}
