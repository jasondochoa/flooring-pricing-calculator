"use client";

import { Field } from "./ui";
import type { ProjectInfo } from "@/lib/types";

export function ProjectDetails({
  project,
  onChange,
}: {
  project: ProjectInfo;
  onChange: (project: ProjectInfo) => void;
}) {
  const set = (key: keyof ProjectInfo, value: string | number) =>
    onChange({ ...project, [key]: value });

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Field label="Client name" className="sm:col-span-2">
        <input
          className="field-input"
          value={project.clientName}
          onChange={(e) => set("clientName", e.target.value)}
        />
      </Field>
      <Field label="Estimator">
        <input
          className="field-input"
          value={project.estimator}
          onChange={(e) => set("estimator", e.target.value)}
        />
      </Field>
      <Field label="Date">
        <input
          type="date"
          className="field-input"
          value={project.date}
          onChange={(e) => set("date", e.target.value)}
        />
      </Field>
      <Field label="Project address" className="sm:col-span-2">
        <input
          className="field-input"
          value={project.address}
          onChange={(e) => set("address", e.target.value)}
        />
      </Field>
      <Field label="City, state ZIP">
        <input
          className="field-input"
          value={project.cityStateZip}
          onChange={(e) => set("cityStateZip", e.target.value)}
        />
      </Field>
      <Field label="Proposal #">
        <input
          className="field-input"
          value={project.proposalNumber}
          onChange={(e) => set("proposalNumber", e.target.value)}
        />
      </Field>
      <Field label="Client email">
        <input
          className="field-input"
          value={project.clientEmail}
          onChange={(e) => set("clientEmail", e.target.value)}
        />
      </Field>
      <Field label="Client phone">
        <input
          className="field-input"
          value={project.clientPhone}
          onChange={(e) => set("clientPhone", e.target.value)}
        />
      </Field>
      <Field label="Valid (days)">
        <input
          type="number"
          min={1}
          className="field-input"
          value={project.validDays}
          onChange={(e) => set("validDays", Number(e.target.value) || 0)}
        />
      </Field>
    </div>
  );
}
