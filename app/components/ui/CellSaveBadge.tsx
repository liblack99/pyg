import React from "react";

export type GlobalSaveState = "idle" | "saving" | "saved" | "error";

interface Props {
  state: GlobalSaveState;
}

export default function CellSaveBadge({state}: Props) {
  let text = "";
  let cls = "text-transparent";

  if (state === "saving") {
    text = "Guardando…";
    cls = "text-slate-400";
  } else if (state === "saved") {
    text = "Guardado";
    cls = "text-emerald-600";
  } else if (state === "error") {
    text = "Error";
    cls = "text-rose-600";
  }

  return (
    <div className="text-md font-semibold" aria-live="polite">
      <span className={`transition-opacity duration-150 w-full ${cls}`}>
        {text || "placeholder"}
      </span>
    </div>
  );
}
