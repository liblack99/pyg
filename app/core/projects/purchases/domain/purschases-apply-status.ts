import type {ProjectShoppingItem, ProcurementStatus} from "../dto";

export function applyProcurementStatus(
  item: ProjectShoppingItem,
  status: ProcurementStatus,
): ProjectShoppingItem {
  const nowIso = new Date();

  if (status === "PENDING") {
    return {
      ...item,
      procurementStatus: "PENDING",
      orderedAt: null,
      receivedAt: null,
    };
  }

  if (status === "ORDERED") {
    return {
      ...item,
      procurementStatus: "ORDERED",
      orderedAt: item.orderedAt ?? nowIso,
      receivedAt: null,
    };
  }

  if (status === "RECEIVED") {
    return {
      ...item,
      procurementStatus: "RECEIVED",
      orderedAt: item.orderedAt ?? nowIso,
      receivedAt: item.receivedAt ?? nowIso,
    };
  }

  // CANCELLED
  return {
    ...item,
    procurementStatus: "CANCELLED",
    receivedAt: null,
  };
}
