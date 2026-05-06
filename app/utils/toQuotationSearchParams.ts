// app/core/quotations/querystring.ts
import type {QuotationListQuery} from "@/app/core/quotations/dto";

export function toQuotationSearchParams(q: Partial<QuotationListQuery>) {
  const sp = new URLSearchParams();

  const set = (k: keyof QuotationListQuery, v: unknown) => {
    if (v === undefined || v === null) return;
    if (typeof v === "string" && v.trim() === "") return;

    // booleans: manda "true"/"false"
    if (typeof v === "boolean") sp.set(String(k), v ? "true" : "false");
    // numbers: manda "123"
    else if (typeof v === "number") sp.set(String(k), String(v));
    else sp.set(String(k), String(v));
  };

  set("clientId", q.clientId);
  set("createdById", q.createdById);
  set("status", q.status);

  set("dateField", q.dateField);
  set("dateFrom", q.dateFrom);
  set("dateTo", q.dateTo);

  set("totalMin", q.totalMin);
  set("totalMax", q.totalMax);

  set("isExpired", q.isExpired);
  set("hasClient", q.hasClient);

  set("numberQuotation", q.numberQuotation);
  set("search", q.search);

  set("sortBy", q.sortBy);
  set("sortDir", q.sortDir);

  set("cursor", q.cursor);
  set("limit", q.limit);
  set("reference", q.reference);

  return sp;
}
