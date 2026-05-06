// app/components/Modal.tsx
"use client";

import {useEffect} from "react";
import {X} from "lucide-react";
export default function Modal({
  open,
  title,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-9999">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl ">
          <div className="flex items-center justify-between p-2 dark:border-slate-700">
            <div className="text-md font-semibold pl-2">{title ?? ""}</div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10">
              <X />
            </button>
          </div>

          <div className="max-h-[78vh] overflow-auto px-4 pb-4">{children}</div>

          {footer ? (
            <div className="p-4 dark:border-slate-700">{footer}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
