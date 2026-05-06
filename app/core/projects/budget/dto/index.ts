export type ProjectBudgetItemRow = {
  id: string;
  createdAt: Date;
  projectId: string;
  description: string;
  quantity: number | null;
  supplierId: string | null;
  supplierNameSnapshot: string | null;
  unitCost: number;
  totalCost: number;
  notes: string | null;
};

export type ProjectBudgetItemUpdateInput = {
  description?: string;
  quantity?: number;
  supplierId?: string | null;
  unitCost?: number | null;
  notes?: string | null;
};
