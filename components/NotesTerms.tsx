"use client";

import { Field } from "./ui";
import type { ProjectInfo } from "@/lib/types";

export function NotesTerms({
  project,
  onChange,
}: {
  project: ProjectInfo;
  onChange: (project: ProjectInfo) => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Field label="Scope notes (shown on proposal)">
        <textarea
          className="field-input min-h-[140px] resize-y"
          value={project.notes}
          onChange={(e) => onChange({ ...project, notes: e.target.value })}
        />
      </Field>
      <Field label="Terms">
        <textarea
          className="field-input min-h-[140px] resize-y"
          value={project.terms}
          onChange={(e) => onChange({ ...project, terms: e.target.value })}
        />
      </Field>
    </div>
  );
}
