import type {
  ProjectFinanceEntryCategory,
  ProjectFinanceEntryStatus,
  ProjectFinanceEntryType,
} from "../dto";

export const PROJECT_FINANCE_ENTRY_TYPE_LABELS: Record<
  ProjectFinanceEntryType,
  string
> = {
  COLLECTION: "Cobro",
  PAYMENT: "Pago",
  EXTRA_INCOME: "Ingreso extra",
  EXTRA_EXPENSE: "Costo extra",
  ADJUSTMENT_POSITIVE: "Ajuste positivo",
  ADJUSTMENT_NEGATIVE: "Ajuste negativo",
};

export const PROJECT_FINANCE_ENTRY_CATEGORY_LABELS: Record<
  ProjectFinanceEntryCategory,
  string
> = {
  ADVANCE: "Anticipo",
  CLIENT_PAYMENT: "Pago de cliente",
  SUPPLIER_PAYMENT: "Pago a proveedor",
  MATERIAL: "Material",
  TRANSPORT: "Transporte",
  LABOR: "Mano de obra",
  WARRANTY: "Garantía",
  INSTALLATION: "Instalación",
  FABRICATION: "Fabricación",
  ADMINISTRATIVE: "Administrativo",
  REFUND: "Devolución",
  OTHER: "Otro",
};

export const PROJECT_FINANCE_ENTRY_STATUS_LABELS: Record<
  ProjectFinanceEntryStatus,
  string
> = {
  ACTIVE: "Activo",
  VOID: "Anulado",
};
