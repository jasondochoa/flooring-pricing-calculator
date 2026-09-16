"use client";

import { GRADE_OPTIONS, OCCUPANCY_OPTIONS, TIMELINE_OPTIONS, signedPercent } from "@/lib/format";
import type { AppliedScaler, Scalers } from "@/lib/types";
import { ImpactChip, Segmented } from "./ui";

export function ScalerPanel({
  scalers,
  applied,
  combinedPercent,
  onChange,
}: {
  scalers: Scalers;
  applied: AppliedScaler[];
  combinedPercent: number;
  onChange: (scalers: Scalers) => void;
}) {
  const byId = Object.fromEntries(applied.map((s) => [s.id, s]));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-paper px-4 py-3">
        <div>
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-stone">Quote impact</p>
          <p className="font-display text-2xl text-oak-deep">{signedPercent(combinedPercent, 1)}</p>
        </div>
        <p className="max-w-[12rem] text-right text-xs leading-relaxed text-stone">
          Combined occupancy, timeline, complexity, grade, and region.
        </p>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-stone">Occupancy</p>
          <ImpactChip percent={byId.occupancy?.percent ?? 0} />
        </div>
        <Segmented
          value={scalers.occupancy}
          options={OCCUPANCY_OPTIONS}
          onChange={(occupancy) => onChange({ ...scalers, occupancy })}
        />
        <p className="mt-2 text-xs text-stone">{byId.occupancy?.detail}</p>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-stone">Timeline</p>
          <ImpactChip percent={byId.timeline?.percent ?? 0} />
        </div>
        <Segmented
          value={scalers.timeline}
          options={TIMELINE_OPTIONS}
          onChange={(timeline) => onChange({ ...scalers, timeline })}
        />
        <p className="mt-2 text-xs text-stone">{byId.timeline?.detail}</p>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-stone">
            Complexity / access
          </p>
          <ImpactChip percent={byId.complexity?.percent ?? 0} />
        </div>
        <input
          type="range"
          min={0}
          max={25}
          step={1}
          value={scalers.complexityPct}
          onChange={(e) => onChange({ ...scalers, complexityPct: Number(e.target.value) })}
        />
        <div className="mt-1 flex justify-between text-[0.7rem] text-stone">
          <span>Open & empty</span>
          <span className="font-semibold text-oak-deep">{scalers.complexityPct}%</span>
          <span>Tight / occupied</span>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-stone">Material grade</p>
          <ImpactChip percent={byId.grade?.percent ?? 0} />
        </div>
        <Segmented
          value={scalers.grade}
          options={GRADE_OPTIONS}
          onChange={(grade) => onChange({ ...scalers, grade })}
        />
        <p className="mt-2 text-xs text-stone">{byId.grade?.detail}</p>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-stone">
            Regional cost index
          </p>
          <ImpactChip percent={byId.regional?.percent ?? 0} />
        </div>
        <input
          type="range"
          min={85}
          max={130}
          step={1}
          value={scalers.regionalIndex}
          onChange={(e) => onChange({ ...scalers, regionalIndex: Number(e.target.value) })}
        />
        <div className="mt-1 flex justify-between text-[0.7rem] text-stone">
          <span>85</span>
          <span className="font-semibold text-oak-deep">{scalers.regionalIndex} vs national 100</span>
          <span>130</span>
        </div>
      </div>
    </div>
  );
}
