"use client";

import {useState} from "react";
import {Heart, MessageSquare, Send} from "lucide-react";
import type {ListProjectNotes} from "@/app/core/projects/notes/dto";
import {
  formatShortDateTime,
  initials,
  levelBadgeClass,
  levelBorderClass,
  noteLevelLabel,
  noteTypeLabel,
  typeBadgeClass,
} from "../ui/project-notes.utils";

type Props = {
  note: ListProjectNotes;
  onLike: (noteId: string) => Promise<void>;
  onReply: (noteId: string, content: string) => Promise<void>;
};

export function ProjectNoteCard({note, onLike, onReply}: Props) {
  const authorName = note.user?.name ?? "Sistema";
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  async function handleLike() {
    try {
      setIsLiking(true);
      await onLike(note.id);
    } finally {
      setIsLiking(false);
    }
  }

  async function handleReply() {
    const trimmed = replyContent.trim();
    if (!trimmed) return;

    try {
      setIsReplying(true);
      await onReply(note.id, trimmed);
      setReplyContent("");
      setShowReplyBox(false);
    } finally {
      setIsReplying(false);
    }
  }

  return (
    <div
      className={`rounded-2xl border border-slate-200 border-l-4 bg-white p-6 shadow-sm ${levelBorderClass(
        note.level,
      )}`}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs font-bold text-slate-700 shadow-sm">
            {initials(authorName)}
          </div>

          <div className="min-w-0">
            <h4 className="truncate text-sm font-bold text-slate-900">
              {authorName}
            </h4>

            <p className="text-[10px] font-semibold uppercase text-slate-400">
              {note.pinned ? "Nota importante" : "Observacion de proyecto"}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="text-xs text-slate-400">
            {formatShortDateTime(note.createdAt)}
          </span>

          <div className="flex flex-wrap justify-end gap-2">
            {note.pinned ? (
              <span className="rounded-full border border-indigo-100 bg-indigo-50 px-2 py-1 text-[9px] font-bold uppercase text-indigo-700">
                Fijada
              </span>
            ) : null}

            <span
              className={`rounded-full border px-2 py-1 text-[9px] font-bold uppercase ${typeBadgeClass(
                note.type,
              )}`}>
              {noteTypeLabel(note.type)}
            </span>

            <span
              className={`rounded-full border px-2 py-1 text-[9px] font-bold uppercase ${levelBadgeClass(
                note.level,
              )}`}>
              {noteLevelLabel(note.level)}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
        {note.content}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => void handleLike()}
          disabled={isLiking}
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition ${
            note.likedByMe
              ? "border-rose-200 bg-rose-50 text-rose-700"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}>
          <Heart className={`h-4 w-4 ${note.likedByMe ? "fill-current" : ""}`} />
          {note.likesCount} me gusta
        </button>

        <button
          type="button"
          onClick={() => setShowReplyBox((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">
          <MessageSquare className="h-4 w-4" />
          {note.repliesCount} respuestas
        </button>
      </div>

      {showReplyBox ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Escribe una respuesta..."
            className="min-h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400"
          />

          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setReplyContent("");
                setShowReplyBox(false);
              }}
              disabled={isReplying}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
              Cancelar
            </button>

            <button
              type="button"
              onClick={() => void handleReply()}
              disabled={isReplying || replyContent.trim().length === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60">
              <Send className="h-4 w-4" />
              {isReplying ? "Enviando..." : "Responder"}
            </button>
          </div>
        </div>
      ) : null}

      {note.replies.length > 0 ? (
        <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
          {note.replies.map((reply) => (
            <div
              key={reply.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[10px] font-bold text-slate-700 shadow-sm">
                    {initials(reply.user?.name ?? "Sistema")}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {reply.user?.name ?? "Sistema"}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {formatShortDateTime(reply.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                {reply.content}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
