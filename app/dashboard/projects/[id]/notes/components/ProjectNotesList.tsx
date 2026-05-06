"use client";

import type {ListProjectNotes} from "@/app/core/projects/notes/dto";
import {ProjectNoteCard} from "./ProjectNoteCard";

type Props = {
  notes: ListProjectNotes[];
  totalNotes: number;
  onLike: (noteId: string) => Promise<void>;
  onReply: (noteId: string, content: string) => Promise<void>;
};

export function ProjectNotesList({notes, onLike, onReply}: Props) {
  if (notes.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-sm text-slate-500 shadow-sm">
        No hay observaciones que coincidan con tu búsqueda o filtro.
      </div>
    );
  }

  return (
      <div className="space-y-4">
        {notes.map((note) => (
        <ProjectNoteCard
          key={note.id}
          note={note}
          onLike={onLike}
          onReply={onReply}
        />
      ))}
    </div>
  );
}
