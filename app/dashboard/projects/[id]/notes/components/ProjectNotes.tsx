"use client";

import LoadingSection from "@/app/components/ui/LoadingSection";
import ErrorSection from "@/app/components/ui/ErrorSection";
import {useProjectNotes} from "../hooks/useProjectNotes";
import {ProjectNotesSummaryCards} from "./ProjectNotesSummaryCards";
import {ProjectNotesComposer} from "./ProjectNotesComposer";
import {ProjectNotesFilters} from "./ProjectNotesFilters";
import {ProjectNotesList} from "./ProjectNotesList";

type Props = {
  projectId: string;
};

export function ProjectNotes({projectId}: Props) {
  const {
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
  } = useProjectNotes(projectId);

  if (loading) {
    return <LoadingSection message="Cargando observaciones..." />;
  }

  if (error) {
    return <ErrorSection message={error} />;
  }

  return (
    <section className="space-y-6" data-purpose="project-notes-v2">
      <ProjectNotesSummaryCards computed={computed} />

      <ProjectNotesComposer
        draft={draft}
        saveState={saveState}
        onChange={updateDraft}
        onSubmit={createNote}
      />

      <ProjectNotesFilters
        search={search}
        filter={filter}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
      />

      <ProjectNotesList
        notes={filteredNotes}
        totalNotes={notes.length}
        onLike={toggleNoteLike}
        onReply={replyToNote}
      />
    </section>
  );
}
