"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import {useQuotationActions} from "../hooks/useQuotationActions";
import type {QuotationStatus} from "@/app/core/quotations/dto";
import {MoreHorizontal} from "lucide-react";

type ActionKey = "send" | "approve" | "reject" | "cancel";

function labelOf(a: ActionKey) {
  switch (a) {
    case "send":
      return "Enviar";
    case "approve":
      return "Aprobar";
    case "reject":
      return "Rechazar";
    case "cancel":
      return "Cancelar";
  }
}

function isDestructive(a: ActionKey) {
  return a === "reject" || a === "cancel";
}

function allowedByStatus(status: QuotationStatus): ActionKey[] {
  switch (status) {
    case "DRAFT":
      return ["send", "cancel"];
    case "SENT":
      return ["approve", "reject", "cancel"];
    case "EXPIRED":
      return ["send", "cancel"];
    default:
      return [];
  }
}

export default function QuotationActionsMenu(props: {
  id: string;
  status: QuotationStatus;

  canSend?: boolean;
  canApprove?: boolean;
  canReject?: boolean;
  canCancel?: boolean;

  menuWidthPx?: number; // opcional
}) {
  const {state, send, approve, reject, cancel} = useQuotationActions();

  const {
    id,
    status,
    canSend = true,
    canApprove = true,
    canReject = true,
    canCancel = true,
    menuWidthPx = 176, // ~ w-44
  } = props;

  const [open, setOpen] = useState(false);

  // posición fixed del menú
  const [pos, setPos] = useState<{top: number; left: number} | null>(null);

  const btnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const actions = useMemo(() => {
    return allowedByStatus(status).filter((a) => {
      if (a === "send") return canSend;
      if (a === "approve") return canApprove;
      if (a === "reject") return canReject;
      if (a === "cancel") return canCancel;
      return false;
    });
  }, [status, canSend, canApprove, canReject, canCancel]);

  function computePos() {
    const el = btnRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();

    // Intentamos abrir hacia abajo.
    // left: alineado a la derecha del botón.
    let top = r.bottom + 8;
    let left = r.right - menuWidthPx;

    // Ajustes para que no se salga de la pantalla
    const padding = 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // clamp horizontal
    left = Math.max(padding, Math.min(left, vw - menuWidthPx - padding));

    // si se sale por abajo, abrir hacia arriba
    const estimatedMenuHeight = 220; // aproximación
    if (top + estimatedMenuHeight > vh - padding) {
      top = r.top - 8 - estimatedMenuHeight;
      top = Math.max(padding, top);
    }

    setPos({top, left});
  }

  function toggleOpen() {
    if (!open) {
      computePos();
      setOpen(true);
      return;
    }
    setOpen(false);
  }

  // Cerrar en click afuera + ESC
  useEffect(() => {
    if (!open) return;

    function onMouseDown(e: MouseEvent) {
      const t = e.target as Node;
      if (panelRef.current?.contains(t)) return;
      if (btnRef.current?.contains(t)) return;
      setOpen(false);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    // si el usuario scrollea, recalcular posición para que “siga” al botón
    function onScrollOrResize() {
      computePos();
    }

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function runAction(a: ActionKey) {
    if (isDestructive(a)) {
      const ok = window.confirm(
        `¿Seguro que deseas ${labelOf(a).toLowerCase()} esta cotización?`,
      );
      if (!ok) return;
    }

    if (a === "send") await send(id);
    if (a === "approve") await approve(id);
    if (a === "reject") await reject(id);
    if (a === "cancel") await cancel(id);

    setOpen(false);
  }

  if (actions.length === 0) return null;

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggleOpen}
        disabled={state.isPending}
        className="rounded-lg shadow-sm cursor-pointer px-2 py-1 text-sm hover:bg-black/5 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-white/10"
        aria-label="Acciones">
        <MoreHorizontal />
      </button>

      {open && pos && (
        <div
          ref={panelRef}
          className="fixed flex flex-col z-100 w-44 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
          style={{top: pos.top, left: pos.left}}>
          {actions.map((a) => (
            <button
              key={a}
              type="button"
              disabled={state.isPending}
              onClick={() => runAction(a)}
              className={[
                "w-full rounded-lg px-3 py-2 text-left text-sm",
                "hover:bg-slate-50 disabled:opacity-50 dark:hover:bg-slate-800",
                isDestructive(a) ? "text-red-600 dark:text-red-400" : "",
              ].join(" ")}>
              {state.isPending ? "Procesando..." : labelOf(a)}
            </button>
          ))}

          {state.error ? (
            <p className="px-3 py-2 text-xs text-red-600 dark:text-red-400">
              {state.error}
            </p>
          ) : null}
        </div>
      )}
    </>
  );
}
