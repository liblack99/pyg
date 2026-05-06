import type {
  ListProjectNotes,
  ProjectNoteLevelValue,
  ProjectNoteTypeValue,
} from "@/app/core/projects/notes/dto";

export type NotesFilter = "ALL" | ProjectNoteTypeValue | ProjectNoteLevelValue;

export function formatShortDateTime(d: Date | string | null | undefined) {
  if (!d) return "—";
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return "—";

  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dt);
}

export function noteTypeLabel(type: ProjectNoteTypeValue) {
  if (type === "GENERAL") return "General";
  if (type === "PROCUREMENT") return "Compras";
  if (type === "INSTALLATION") return "Instalación";
  if (type === "PRODUCTION") return "Producción";
  if (type === "DELIVERY") return "Entrega";
  return "Cliente";
}

export function noteLevelLabel(level: ProjectNoteLevelValue) {
  if (level === "INFO") return "Info";
  if (level === "WARNING") return "Advertencia";
  if (level === "ISSUE") return "Problema";
  return "Correcto";
}

export function levelBorderClass(level: ProjectNoteLevelValue) {
  if (level === "WARNING") return "border-l-amber-400";
  if (level === "ISSUE") return "border-l-rose-400";
  if (level === "SUCCESS") return "border-l-emerald-400";
  return "border-l-blue-400";
}

export function levelBadgeClass(level: ProjectNoteLevelValue) {
  if (level === "WARNING") return "bg-amber-50 text-amber-700 border-amber-100";
  if (level === "ISSUE") return "bg-rose-50 text-rose-700 border-rose-100";
  if (level === "SUCCESS")
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  return "bg-blue-50 text-blue-700 border-blue-100";
}

export function typeBadgeClass(type: ProjectNoteTypeValue) {
  if (type === "PROCUREMENT") return "bg-sky-50 text-sky-700 border-sky-100";
  if (type === "INSTALLATION")
    return "bg-violet-50 text-violet-700 border-violet-100";
  if (type === "PRODUCTION")
    return "bg-indigo-50 text-indigo-700 border-indigo-100";
  if (type === "DELIVERY")
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  if (type === "CLIENT")
    return "bg-orange-50 text-orange-700 border-orange-100";
  return "bg-slate-50 text-slate-700 border-slate-200";
}

export function initials(name: string | null | undefined) {
  if (!name) return "SI";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((x) => x.charAt(0).toUpperCase()).join("");
}

export function applyNotesFilter(
  notes: ListProjectNotes[],
  filter: NotesFilter,
  search: string,
) {
  const s = search.trim().toLowerCase();

  return notes.filter((note) => {
    const matchesFilter =
      filter === "ALL" || note.type === filter || note.level === filter;

    const matchesSearch =
      !s ||
      note.content.toLowerCase().includes(s) ||
      (note.user?.name ?? "").toLowerCase().includes(s);

    return matchesFilter && matchesSearch;
  });
}
