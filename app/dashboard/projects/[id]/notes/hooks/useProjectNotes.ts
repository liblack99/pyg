"use client";

import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {apiGet, apiPost} from "@/app/lib/api.client";
import type {
  CreateProjectNoteReplyOutput,
  CreateProjectOutput,
  ListProjectNotes,
  ProjectNoteLevelValue,
  ProjectNoteTypeValue,
  ToggleProjectNoteLikeOutput,
} from "@/app/core/projects/notes/dto";
import {
  applyNotesFilter,
  formatShortDateTime,
  type NotesFilter,
} from "../ui/project-notes.utils";
import {useProjectActivityStore} from "../../store/useProjectActivityStore";

type SaveState = "idle" | "saving" | "saved" | "error";

type NotesDraft = {
  content: string;
  type: ProjectNoteTypeValue;
  level: ProjectNoteLevelValue;
  pinned: boolean;
};

const defaultDraft: NotesDraft = {
  content: "",
  type: "GENERAL",
  level: "INFO",
  pinned: false,
};

export function useProjectNotes(projectId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<ListProjectNotes[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<NotesFilter>("ALL");
  const [draft, setDraft] = useState<NotesDraft>(defaultDraft);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const saveTimerRef = useRef<number | null>(null);
  const notifyChanged = useProjectActivityStore((state) => state.notifyChanged);

  const loadNotes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiGet<ListProjectNotes[]>(
        `/api/projects/${projectId}/notes`,
      );
      setNotes(res ?? []);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Error desconocido";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    void loadNotes();
  }, [loadNotes]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  const computed = useMemo(() => {
    const total = notes.length;
    const pinnedCount = notes.filter((x) => x.pinned).length;
    const warnings = notes.filter(
      (x) => x.level === "WARNING" || x.level === "ISSUE",
    ).length;
    const lastNote = notes[0]?.createdAt ?? null;

    return {
      total,
      pinnedCount,
      warnings,
      lastNoteText: lastNote ? formatShortDateTime(lastNote) : "Sin notas",
    };
  }, [notes]);

  const filteredNotes = useMemo(
    () => applyNotesFilter(notes, filter, search),
    [notes, filter, search],
  );

  const updateDraft = useCallback((patch: Partial<NotesDraft>) => {
    setDraft((prev) => ({
      ...prev,
      ...patch,
    }));
  }, []);

  const createNote = useCallback(async () => {
    const trimmed = draft.content.trim();
    if (trimmed.length < 3) return;

    setSaveState("saving");

    try {
      const res = await apiPost<CreateProjectOutput>(
        `/api/projects/${projectId}/notes`,
        {
          content: trimmed,
          type: draft.type,
          level: draft.level,
          pinned: draft.pinned,
        },
      );

      if (!res) throw new Error("No se pudo guardar la nota");

      setNotes((prev) => [res, ...prev]);
      setDraft(defaultDraft);
      setSaveState("saved");

      window.clearTimeout(saveTimerRef.current ?? undefined);
      saveTimerRef.current = window.setTimeout(() => {
        setSaveState("idle");
      }, 900);
      notifyChanged(projectId);
    } catch (e: unknown) {
      setSaveState("error");
      setError(e instanceof Error ? e.message : "Error desconocido");

      window.clearTimeout(saveTimerRef.current ?? undefined);
      saveTimerRef.current = window.setTimeout(() => {
        setSaveState("idle");
      }, 1500);
    }
  }, [draft, projectId, notifyChanged]);

  const toggleNoteLike = useCallback(
    async (noteId: string) => {
      const result = await apiPost<ToggleProjectNoteLikeOutput>(
        `/api/projects/${projectId}/notes/${noteId}/likes`,
        {},
      );

      setNotes((prev) =>
        prev.map((note) =>
          note.id === noteId
            ? {
                ...note,
                likesCount: result.likesCount,
                likedByMe: result.likedByMe,
              }
            : note,
        ),
      );
    },
    [projectId],
  );

  const replyToNote = useCallback(
    async (noteId: string, content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;

      const result = await apiPost<CreateProjectNoteReplyOutput>(
        `/api/projects/${projectId}/notes/${noteId}/replies`,
        {content: trimmed},
      );

      setNotes((prev) =>
        prev.map((note) =>
          note.id === noteId
            ? {
                ...note,
                repliesCount: result.repliesCount,
                replies: [...note.replies, result.reply],
              }
            : note,
        ),
      );
    },
    [projectId],
  );

  return {
    loading,
    error,
    notes,
    filteredNotes,
    saveState,
    search,
    filter,
    draft,
    computed,
    setSearch,
    setFilter,
    updateDraft,
    createNote,
    toggleNoteLike,
    replyToNote,
    reloadNotes: loadNotes,
  };
}
