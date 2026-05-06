// app/dashboard/quotations/[id]/hooks/useLocalDraft.ts
"use client";

import {useEffect, useRef} from "react";

export function useLocalDraft<T>(opts: {
  key: string;
  values: T;
  onHydrate: (draft: T) => void;
  delayMs?: number;
  enabled?: boolean;
}) {
  const hydratedRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!opts.enabled) return;

    const raw = localStorage.getItem(opts.key);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as T;
        opts.onHydrate(parsed);
      } catch {
        // ignora
      }
    }
    hydratedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts.key, opts.enabled]);

  useEffect(() => {
    if (!opts.enabled) return;
    if (!hydratedRef.current) return;

    if (timerRef.current) window.clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(() => {
      try {
        localStorage.setItem(opts.key, JSON.stringify(opts.values));
      } catch {
        // ignora
      }
    }, opts.delayMs ?? 400);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [opts.values, opts.key, opts.delayMs, opts.enabled]);
}

export function clearLocalDraft(key: string) {
  console.log(key);
  localStorage.removeItem(key);
}
