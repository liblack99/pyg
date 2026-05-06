"use client";

import type {NotesFilter} from "../ui/project-notes.utils";

type Props = {
  search: string;
  filter: NotesFilter;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: NotesFilter) => void;
};

export function ProjectNotesFilters({
  search,
  filter,
  onSearchChange,
  onFilterChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <h2 className="text-lg font-bold text-slate-900">
        Historial de observaciones
      </h2>

      <div className="flex flex-wrap items-center gap-2">
        <input
          className="w-56 rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          placeholder="Buscar nota..."
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <button
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
            filter === "ALL"
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
          onClick={() => onFilterChange("ALL")}>
          Todas
        </button>

        <button
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
            filter === "WARNING"
              ? "border-amber-500 bg-amber-500 text-white"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
          onClick={() => onFilterChange("WARNING")}>
          Advertencias
        </button>

        <button
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
            filter === "ISSUE"
              ? "border-rose-500 bg-rose-500 text-white"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
          onClick={() => onFilterChange("ISSUE")}>
          Problemas
        </button>

        <button
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
            filter === "INSTALLATION"
              ? "border-violet-500 bg-violet-500 text-white"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
          onClick={() => onFilterChange("INSTALLATION")}>
          Instalación
        </button>
      </div>
    </div>
  );
}
