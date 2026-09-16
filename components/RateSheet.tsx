"use client";

import { Field } from "./ui";
import { MATERIAL_LABELS, MATERIAL_SHORT } from "@/lib/format";
import { MATERIAL_TYPES, type RateSheet } from "@/lib/types";

export function RateSheetEditor({
  rates,
  onChange,
}: {
  rates: RateSheet;
  onChange: (rates: RateSheet) => void;
}) {
  const set = (patch: Partial<RateSheet>) => onChange({ ...rates, ...patch });

  return (
    <div className="space-y-5">
      <div className="table-wrap">
        <table className="line-table min-w-[520px]">
          <thead>
            <tr>
              <th>Material</th>
              <th>Base material / sf</th>
              <th>Install labor / sf</th>
            </tr>
          </thead>
          <tbody>
            {MATERIAL_TYPES.map((type) => (
              <tr key={type}>
                <td className="font-medium">{MATERIAL_SHORT[type]}</td>
                <td>
                  <input
                    type="number"
                    min={0}
                    step={0.05}
                    className="field-input field-input-sm w-28"
                    value={rates.materials[type].material}
                    onChange={(e) =>
                      set({
                        materials: {
                          ...rates.materials,
                          [type]: { ...rates.materials[type], material: Number(e.target.value) || 0 },
                        },
                      })
                    }
                    aria-label={`${MATERIAL_LABELS[type]} material rate`}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    step={0.05}
                    className="field-input field-input-sm w-28"
                    value={rates.materials[type].labor}
                    onChange={(e) =>
                      set({
                        materials: {
                          ...rates.materials,
                          [type]: { ...rates.materials[type], labor: Number(e.target.value) || 0 },
                        },
                      })
                    }
                    aria-label={`${MATERIAL_LABELS[type]} labor rate`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Removal / demo ($/sf)">
          <input
            type="number"
            min={0}
            step={0.05}
            className="field-input"
            value={rates.removalPerSf}
            onChange={(e) => set({ removalPerSf: Number(e.target.value) || 0 })}
          />
        </Field>
        <Field label="Underlayment ($/sf)">
          <input
            type="number"
            min={0}
            step={0.05}
            className="field-input"
            value={rates.underlaymentPerSf}
            onChange={(e) => set({ underlaymentPerSf: Number(e.target.value) || 0 })}
          />
        </Field>
        <Field label="Transitions ($/lf)">
          <input
            type="number"
            min={0}
            step={0.25}
            className="field-input"
            value={rates.transitionPerLf}
            onChange={(e) => set({ transitionPerLf: Number(e.target.value) || 0 })}
          />
        </Field>
        <Field label="Stairs ($/step)">
          <input
            type="number"
            min={0}
            step={1}
            className="field-input"
            value={rates.stairPerStep}
            onChange={(e) => set({ stairPerStep: Number(e.target.value) || 0 })}
          />
        </Field>
        <Field label="Transition length (lf)" hint="Reducers, T-molds, thresholds">
          <input
            type="number"
            min={0}
            step={1}
            className="field-input"
            value={rates.transitionLf}
            onChange={(e) => set({ transitionLf: Number(e.target.value) || 0 })}
          />
        </Field>
        <Field label="Stair count" hint="Treads / nosings to finish">
          <input
            type="number"
            min={0}
            step={1}
            className="field-input"
            value={rates.stairCount}
            onChange={(e) => set({ stairCount: Number(e.target.value) || 0 })}
          />
        </Field>
        <Field label="Waste factor %">
          <input
            type="number"
            min={0}
            max={40}
            step={0.5}
            className="field-input"
            value={rates.wasteFactorPct}
            onChange={(e) => set({ wasteFactorPct: Number(e.target.value) || 0 })}
          />
        </Field>
        <Field label="Tax rate %">
          <input
            type="number"
            min={0}
            step={0.05}
            className="field-input"
            value={rates.taxRatePct}
            onChange={(e) => set({ taxRatePct: Number(e.target.value) || 0 })}
          />
        </Field>
        <Field label="Deposit %">
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            className="field-input"
            value={rates.depositPct}
            onChange={(e) => set({ depositPct: Number(e.target.value) || 0 })}
          />
        </Field>
        <Field label="Discount %">
          <input
            type="number"
            min={0}
            max={40}
            step={0.5}
            className="field-input"
            value={rates.discountPct}
            onChange={(e) => set({ discountPct: Number(e.target.value) || 0 })}
          />
        </Field>
      </div>
    </div>
  );
}
