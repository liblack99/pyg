import type {ProjectBudgetItemRow} from "../dto";

export type ProjectBudgetComputed = {
  base: number;
  limit65: number;
  budgetCurrent: number;
  balance: number;
  executedPct: number;
  availablePct: number;
};

export function computeProjectBudgetFromItems(input: {
  totalQuotationSinIVA: number;
  spendingLimit65: number;
  items: ProjectBudgetItemRow[];
}): ProjectBudgetComputed {
  const base = input.totalQuotationSinIVA;
  const limit65 = input.spendingLimit65;

  const budgetCurrent = input.items.reduce((acc, item) => {
    return acc + item.totalCost;
  }, 0);

  const balance = limit65 - budgetCurrent;
  const executedPct = limit65 > 0 ? (budgetCurrent / limit65) * 100 : 0;
  const availablePct = limit65 > 0 ? (Math.max(0, balance) / limit65) * 100 : 0;

  return {
    base,
    limit65,
    budgetCurrent,
    balance,
    executedPct,
    availablePct,
  };
}
