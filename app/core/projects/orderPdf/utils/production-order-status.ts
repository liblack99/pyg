type ProductionOrderApprovalSource = {
  reviewedBy?: string | null;
  authorizedBy?: string | null;
};

export function isProductionOrderApproved(
  source: ProductionOrderApprovalSource | null | undefined,
) {
  return Boolean(source?.reviewedBy && source?.authorizedBy);
}

export function getProductionOrderStatusLabel(
  source: ProductionOrderApprovalSource | null | undefined,
) {
  return isProductionOrderApproved(source) ? "Aprobada" : "Pendiente";
}

export function getProductionOrderReviewLabel(
  source: ProductionOrderApprovalSource | null | undefined,
) {
  return source?.reviewedBy ?? "Sin revisar";
}

export function getProductionOrderAuthorizationLabel(
  source: ProductionOrderApprovalSource | null | undefined,
) {
  return source?.authorizedBy ?? "Sin autorizar";
}

export function getProductionOrderDocumentStatusLabel(
  source: ProductionOrderApprovalSource | null | undefined,
) {
  return isProductionOrderApproved(source)
    ? "Revisada y autorizada"
    : "Pendiente";
}
