"use client";

import {Search} from "lucide-react";
import type {UniversalSearchItem} from "@/app/core/search/dto";
import {SearchAutocomplete} from "@/app/components/search/SearchAutocomplete";
import {useUniversalSearch} from "../../dashboard/hooks/useUniversalSearch";

const TYPE_LABELS: Record<UniversalSearchItem["type"], string> = {
  CLIENT: "Cliente",
  QUOTATION: "Cotizacion",
  PROJECT: "Proyecto",
};

const TYPE_STYLES: Record<UniversalSearchItem["type"], string> = {
  CLIENT: "border-sky-200 bg-sky-50 text-sky-700",
  QUOTATION: "border-amber-200 bg-amber-50 text-amber-700",
  PROJECT: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export function UniversalSearch() {
  const {query, setQuery, searchFn, handleSelect} = useUniversalSearch();

  return (
    <>
      <div className="relative hidden w-full max-w-2xl lg:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <SearchAutocomplete<UniversalSearchItem>
          searchFn={searchFn}
          onSelect={handleSelect}
          getKey={(item) => `${item.type}-${item.id}`}
          value={query}
          onChangeValue={setQuery}
          minChars={2}
          debounceMs={200}
          clearOnSelect
          hideLabel
          placeholder="Buscar clientes, cotizaciones o proyectos..."
          inputClassName="rounded-full border-slate-200 bg-white pl-10 pr-4 py-2.5 shadow-sm"
          dropdownClassName="rounded-2xl border-slate-200 shadow-xl"
          renderItem={(item, isHighlighted) => (
            <div
              className={`flex items-start justify-between gap-4 px-4 py-3 ${
                isHighlighted ? "bg-blue-50" : ""
              }`}>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${TYPE_STYLES[item.type]}`}>
                    {TYPE_LABELS[item.type]}
                  </span>
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {item.title}
                  </p>
                </div>
                <p className="mt-1 truncate text-xs font-medium text-slate-500">
                  {item.subtitle}
                </p>
                {item.description ? (
                  <p className="mt-1 truncate text-xs text-slate-400">
                    {item.description}
                  </p>
                ) : null}
              </div>

              {item.meta ? (
                <span className="shrink-0 text-[11px] font-medium text-slate-400">
                  {item.meta}
                </span>
              ) : null}
            </div>
          )}
        />
      </div>
    </>
  );
}
