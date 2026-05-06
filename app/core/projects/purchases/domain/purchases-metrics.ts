import type {ProjectShoppingItem} from "../dto";
import {formatDate} from "@/app/utils/formatDate";

export function getPurchasesMetrics(
  limit: number,
  draftItems: ProjectShoppingItem[],
) {
  const totalItems = draftItems.length;

  const committedAmount = draftItems.reduce((acc, it) => {
    if (
      it.procurementStatus === "ORDERED" ||
      it.procurementStatus === "RECEIVED"
    ) {
      return acc + it.totalCost;
    }
    return acc;
  }, 0);

  const committedPct = limit > 0 ? (committedAmount / limit) * 100 : 0;

  const pendingDeliveries = draftItems.reduce((acc, it) => {
    if (
      it.procurementStatus === "PENDING" ||
      it.procurementStatus === "ORDERED"
    )
      return acc + 1;
    return acc;
  }, 0);

  const next = draftItems
    .filter(
      (it) =>
        it.procurementStatus !== "RECEIVED" &&
        it.procurementStatus !== "CANCELLED",
    )
    .map((it) => (it.orderedAt ? new Date(it.orderedAt) : null))
    .filter((d): d is Date => !!d && !Number.isNaN(d.getTime()))
    .sort((a, b) => a.getTime() - b.getTime())[0];

  const nextText = next ? formatDate(next) : "Sin fecha";

  return {
    totalItems,
    committedAmount,
    committedPct,
    pendingDeliveries,
    nextText,
  };
}
