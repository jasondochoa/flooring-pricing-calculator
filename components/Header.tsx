"use client";

import { Printer, RotateCcw, ScrollText } from "lucide-react";
import { Mark, Segmented } from "./ui";
import type { Company } from "@/lib/types";

export function Header({
  company,
  view,
  onView,
  onPrint,
  onReset,
}: {
  company: Company;
  view: "estimate" | "proposal";
  onView: (view: "estimate" | "proposal") => void;
  onPrint: () => void;
  onReset: () => void;
}) {
  return (
    <header className="no-print sticky top-0 z-30 border-b border-oak-deep/20 bg-ink/95 text-cream backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-4 py-3 sm:px-6">
        <Mark initials={company.initials} src={company.logoDataUrl} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg leading-tight text-cream">{company.name}</p>
          <p className="truncate text-xs text-cream/65">{company.tagline} · Project pricing</p>
        </div>
        <div className="hidden min-w-[240px] sm:block">
          <Segmented
            value={view}
            onChange={onView}
            options={[
              { id: "estimate", label: "Estimate" },
              { id: "proposal", label: "Proposal" },
            ]}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-xl border border-cream/15 px-3 py-2 text-xs font-semibold text-cream/80 hover:bg-cream/10"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Sample</span>
          </button>
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 rounded-xl bg-copper px-3 py-2 text-xs font-semibold text-cream hover:bg-oak"
          >
            {view === "proposal" ? <Printer className="h-3.5 w-3.5" /> : <ScrollText className="h-3.5 w-3.5" />}
            {view === "proposal" ? "Print / PDF" : "Preview"}
          </button>
        </div>
      </div>
      <div className="border-t border-cream/10 px-4 py-2 sm:hidden">
        <Segmented
          value={view}
          onChange={onView}
          options={[
            { id: "estimate", label: "Estimate" },
            { id: "proposal", label: "Proposal" },
          ]}
        />
      </div>
    </header>
  );
}
