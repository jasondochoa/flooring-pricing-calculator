"use client";

import { Plus, Trash2 } from "lucide-react";
import { emptyManualItem, lineTotal } from "@/lib/calc";
import { currency, UNIT_LABELS } from "@/lib/format";
import { UNITS, type LineItem, type Unit } from "@/lib/types";

export function LineItemTable({
  items,
  onChange,
}: {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
}) {
  const update = (id: string, patch: Partial<LineItem>) =>
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  return (
    <div>
      <div className="table-wrap">
        <table className="line-table min-w-[780px]">
          <thead>
            <tr>
              <th className="w-10">On</th>
              <th>Service / product</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Unit price</th>
              <th className="text-right">Line total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className={!item.include ? "opacity-45" : undefined}>
                <td>
                  <input
                    type="checkbox"
                    checked={item.include}
                    onChange={(e) => update(item.id, { include: e.target.checked })}
                    aria-label={`Include ${item.name}`}
                  />
                </td>
                <td>
                  <input
                    className="field-input field-input-sm"
                    value={item.name}
                    onChange={(e) => update(item.id, { name: e.target.value })}
                  />
                  {item.source === "derived" && (
                    <div className="mt-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-stone">
                      Linked to rooms / rates
                    </div>
                  )}
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    className="field-input field-input-sm w-[5.5rem]"
                    value={item.qty}
                    onChange={(e) => update(item.id, { qty: Number(e.target.value) || 0 })}
                    disabled={item.source === "derived"}
                  />
                </td>
                <td>
                  <select
                    className="field-input field-input-sm w-[4.8rem]"
                    value={item.unit}
                    onChange={(e) => update(item.id, { unit: e.target.value as Unit })}
                    disabled={item.source === "derived"}
                  >
                    {UNITS.map((unit) => (
                      <option key={unit} value={unit}>
                        {UNIT_LABELS[unit]}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    step={0.05}
                    className="field-input field-input-sm w-[6.2rem]"
                    value={item.unitPrice}
                    onChange={(e) => update(item.id, { unitPrice: Number(e.target.value) || 0 })}
                  />
                </td>
                <td className="whitespace-nowrap text-right font-semibold tabular-nums">
                  {currency(lineTotal({ ...item, include: true }))}
                </td>
                <td>
                  {item.source === "manual" && (
                    <button
                      type="button"
                      className="rounded-lg p-2 text-stone hover:bg-paper hover:text-oak-deep"
                      onClick={() => onChange(items.filter((row) => row.id !== item.id))}
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-stone">
        Material, labor, demo, underlayment, transitions, and stairs stay linked to rooms and the rate
        sheet. Add anything else as a custom line.
      </p>
      <button
        type="button"
        className="mt-3 inline-flex items-center gap-2 rounded-xl border border-line-strong bg-cream px-3 py-2 text-sm font-semibold text-oak-deep hover:bg-paper"
        onClick={() => onChange([...items, emptyManualItem()])}
      >
        <Plus className="h-4 w-4" />
        Add line item
      </button>
    </div>
  );
}
