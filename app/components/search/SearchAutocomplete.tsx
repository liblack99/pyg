"use client";

import React, {useEffect, useRef, useState, useCallback} from "react";

export type CursorPage<T> = {
  items: T[];
  nextCursor?: string | null;
};

interface SearchAutocompleteRemoteProps<T> {
  searchFn: (term: string, signal: AbortSignal) => Promise<CursorPage<T>>;
  onSelect: (item: T) => void;
  renderItem: (item: T, isHighlighted: boolean) => React.ReactNode;
  getKey: (item: T) => string | number;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  dropdownClassName?: string;
  minChars?: number;
  debounceMs?: number;
  clearOnSelect?: boolean;
  label?: string;
  hideLabel?: boolean;
  onChangeValue?: (value: string) => void;
  value?: string;
}

export function SearchAutocomplete<T>({
  searchFn,
  onSelect,
  renderItem,
  getKey,
  onChangeValue,
  label,
  placeholder = "",
  className = "",
  inputClassName = "",
  dropdownClassName = "",
  minChars = 2,
  debounceMs = 250,
  clearOnSelect = true,
  value,
  hideLabel = false,
}: SearchAutocompleteRemoteProps<T>) {
  const [term, setTerm] = useState<string>(value ?? "");
  const [results, setResults] = useState<T[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ref = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (typeof value === "string") setTerm(value);
  }, [value]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);

    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }

      abortRef.current?.abort();
    };
  }, []);

  const runSearch = useCallback(
    (raw: string) => {
      const q = raw.trim();

      if (!q || q.length < minChars) {
        abortRef.current?.abort();
        setResults([]);
        setError(null);
        setLoading(false);
        setHighlightedIndex(-1);
        return;
      }

      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = window.setTimeout(async () => {
        abortRef.current?.abort();
        const ctrl = new AbortController();
        abortRef.current = ctrl;

        try {
          setLoading(true);
          setError(null);

          const page = await searchFn(q, ctrl.signal);
          if (ctrl.signal.aborted) return;

          setResults(page.items ?? []);
          setHighlightedIndex(-1);
        } catch (err: unknown) {
          if (err instanceof DOMException && err.name === "AbortError") return;

          setError("No se pudo buscar. Intenta de nuevo.");
          setResults([]);
        } finally {
          if (!ctrl.signal.aborted) {
            setLoading(false);
          }
        }
      }, debounceMs);
    },
    [debounceMs, minChars, searchFn],
  );

  const onChangeTerm = (nextValue: string) => {
    if (typeof value !== "string") {
      setTerm(nextValue);
    }

    runSearch(nextValue);
    onChangeValue?.(nextValue);
  };

  const shouldOpen = isOpen && (loading || results.length > 0 || !!error);

  const handleSelect = (item: T) => {
    onSelect(item);

    if (clearOnSelect) {
      if (typeof value === "string") onChangeValue?.("");
      else setTerm("");

      setResults([]);
      setError(null);
      setHighlightedIndex(-1);
    }

    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      <div className="flex flex-col gap-1.5">
        {!hideLabel ? (
          <label className="text-sm font-semibold text-[#0F172A]">
            {label ? label : "Buscar"}
          </label>
        ) : null}

        <input
          value={term}
          onChange={(e) => onChangeTerm(e.target.value)}
          onFocus={() => {
            setIsOpen(true);
            runSearch(term);
          }}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-white px-3 py-2 text-sm text-[#0F172A] placeholder:text-slate-400 transition focus:outline-none ${
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-500/30"
              : "border-slate-300 focus:border-[#0A3D91] focus:ring-2 focus:ring-[#0A3D91]/30"
          } ${inputClassName}`}
        />
      </div>

      {shouldOpen ? (
        <div
          className={`absolute z-50 mt-1 max-h-72 w-full overflow-auto rounded-md border bg-white ${dropdownClassName}`}>
          {loading ? (
            <div className="px-4 py-3 text-sm text-slate-500">Buscando...</div>
          ) : null}

          {!loading && error ? (
            <div className="px-4 py-3 text-sm text-red-600">{error}</div>
          ) : null}

          {!loading && !error && results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-slate-500">
              Sin resultados
            </div>
          ) : null}

          {!loading && !error
            ? results.map((item, index) => (
                <div
                  key={String(getKey(item))}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`cursor-pointer ${
                    index === highlightedIndex
                      ? "bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}>
                  {renderItem(item, index === highlightedIndex)}
                </div>
              ))
            : null}
        </div>
      ) : null}
    </div>
  );
}
