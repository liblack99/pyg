"use client";

import CellSaveBadge from "@/app/components/ui/CellSaveBadge";
import Button from "@/app/components/ui/Button";
import {
  PROJECT_NOTE_LEVELS,
  PROJECT_NOTE_TYPES,
  type ProjectNoteLevelValue,
  type ProjectNoteTypeValue,
} from "@/app/core/projects/notes/dto";
import {noteLevelLabel, noteTypeLabel} from "../ui/project-notes.utils";

type SaveState = "idle" | "saving" | "saved" | "error";

type Props = {
  draft: {
    content: string;
    type: ProjectNoteTypeValue;
    level: ProjectNoteLevelValue;
    pinned: boolean;
  };
  saveState: SaveState;
  onChange: (
    patch: Partial<{
      content: string;
      type: ProjectNoteTypeValue;
      level: ProjectNoteLevelValue;
      pinned: boolean;
    }>,
  ) => void;
  onSubmit: () => Promise<void>;
};

export function ProjectNotesComposer({
  draft,
  saveState,
  onChange,
  onSubmit,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-slate-800">
        Añadir nueva nota
      </h3>

      <div className="space-y-4">
        <textarea
          className="min-h-[110px] w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
          placeholder="Escriba aquí sus observaciones o comentarios técnicos..."
          value={draft.content}
          onChange={(e) => onChange({content: e.target.value})}
        />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <select
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:ring-blue-500"
              value={draft.type}
              onChange={(e) =>
                onChange({type: e.target.value as ProjectNoteTypeValue})
              }>
              {PROJECT_NOTE_TYPES.map((type) => (
                <option key={type} value={type}>
                  Categoría: {noteTypeLabel(type)}
                </option>
              ))}
            </select>

            <select
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:ring-blue-500"
              value={draft.level}
              onChange={(e) =>
                onChange({level: e.target.value as ProjectNoteLevelValue})
              }>
              {PROJECT_NOTE_LEVELS.map((level) => (
                <option key={level} value={level}>
                  Nivel: {noteLevelLabel(level)}
                </option>
              ))}
            </select>

            <label className="inline-flex items-center gap-2 px-2 text-xs text-slate-600">
              <input
                type="checkbox"
                checked={draft.pinned}
                onChange={(e) => onChange({pinned: e.target.checked})}
                className="rounded border-slate-300"
              />
              Importante
            </label>
          </div>

          <div className="flex items-center gap-4">
            <CellSaveBadge state={saveState} />
            <Button
              variant="primary"
              onClick={() => void onSubmit()}
              disabled={saveState === "saving" || draft.content.trim().length < 3}>
              {saveState === "saving" ? "Guardando..." : "Guardar nota"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
