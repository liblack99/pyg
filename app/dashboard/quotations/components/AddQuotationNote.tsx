"use client";

import {useState} from "react";

interface Props {
  initialNote?: string;
  isLoading: boolean;
  error: string | null;
  addNote: (note: string) => Promise<string | undefined>;
  close: () => void;
}

export default function AddQuotationNote({
  initialNote = "",
  error,
  isLoading,
  addNote,
  close,
}: Props) {
  const [note, setNote] = useState(initialNote);

  async function handleSave() {
    addNote(note);

    close();
  }

  return (
    <div>
      <div>
        <label className="text-[20px] font-semibold text-slate-900">
          Nota interna
        </label>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          placeholder="Agregar nota..."
          className="mt-1 w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#0A3D91] focus:outline-none focus:ring-2 focus:ring-[#0A3D91]/30"
        />
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={isLoading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50">
          {isLoading ? "Guardando..." : "Guardar nota"}
        </button>
      </div>
    </div>
  );
}
