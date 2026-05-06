"use client";

import {useCallback, useMemo} from "react";
import {useRouter} from "next/navigation";
import type {CursorPage} from "@/app/components/search/SearchAutocomplete";
import type {UniversalSearchItem} from "@/app/core/search/dto";
import {useUniversalSearchStore} from "@/app/dashboard/stores/useUniversalSearchStore";

async function parseResponse<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      typeof body?.error === "string"
        ? body.error
        : "No se pudo completar la busqueda.";

    throw new Error(message);
  }

  return body as T;
}

export function useUniversalSearch() {
  const router = useRouter();

  const {query, modalTarget, setQuery, openClient, openQuotation, closeModal} =
    useUniversalSearchStore();

  const searchFn = useCallback(
    async (
      term: string,
      signal: AbortSignal,
    ): Promise<CursorPage<UniversalSearchItem>> => {
      const url = `/api/search/universal?search=${encodeURIComponent(term)}&limit=4`;

      const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
        credentials: "include",
        signal,
      });

      return parseResponse<CursorPage<UniversalSearchItem>>(res);
    },
    [],
  );

  const handleSelect = useCallback(
    (item: UniversalSearchItem) => {
      setQuery("");

      if (item.type === "PROJECT") {
        router.push(item.href);
        return;
      }

      if (item.type === "CLIENT") {
        openClient(item.id);
        return;
      }

      if (item.type === "QUOTATION") {
        openQuotation(item.id);
      }
    },
    [router, setQuery, openClient, openQuotation],
  );

  const state = useMemo(
    () => ({
      query,
      modalTarget,
      isClientOpen: modalTarget?.type === "CLIENT",
      isQuotationOpen: modalTarget?.type === "QUOTATION",
      selectedId: modalTarget?.id ?? null,
    }),
    [query, modalTarget],
  );

  return {
    ...state,
    setQuery,
    searchFn,
    handleSelect,
    closeModal,
  };
}
