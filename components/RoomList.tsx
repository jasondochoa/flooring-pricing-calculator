"use client";

import { Plus, Trash2 } from "lucide-react";
import { MATERIAL_LABELS } from "@/lib/format";
import { emptyRoom, roomSqFt } from "@/lib/calc";
import { MATERIAL_TYPES, type Room } from "@/lib/types";
import { number } from "@/lib/format";

export function RoomList({
  rooms,
  onChange,
}: {
  rooms: Room[];
  onChange: (rooms: Room[]) => void;
}) {
  const update = (id: string, patch: Partial<Room>) =>
    onChange(rooms.map((room) => (room.id === id ? { ...room, ...patch } : room)));

  return (
    <div>
      <div className="table-wrap">
        <table className="line-table min-w-[860px]">
          <thead>
            <tr>
              <th>Area</th>
              <th>L × W (ft)</th>
              <th>Sq ft</th>
              <th>Material</th>
              <th>Demo</th>
              <th>Underlay</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => {
              const sf = roomSqFt(room);
              return (
                <tr key={room.id}>
                  <td className="w-[18%]">
                    <input
                      className="field-input field-input-sm"
                      value={room.name}
                      onChange={(e) => update(room.id, { name: e.target.value })}
                    />
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={0}
                        step={0.1}
                        className="field-input field-input-sm w-[4.5rem]"
                        value={room.lengthFt}
                        onChange={(e) => update(room.id, { lengthFt: Number(e.target.value) || 0 })}
                      />
                      <span className="text-stone">×</span>
                      <input
                        type="number"
                        min={0}
                        step={0.1}
                        className="field-input field-input-sm w-[4.5rem]"
                        value={room.widthFt}
                        onChange={(e) => update(room.id, { widthFt: Number(e.target.value) || 0 })}
                      />
                    </div>
                  </td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      step={0.1}
                      className="field-input field-input-sm w-[5.5rem]"
                      placeholder={String(number(room.lengthFt * room.widthFt, 1))}
                      value={room.sqFtOverride ?? ""}
                      onChange={(e) =>
                        update(room.id, {
                          sqFtOverride: e.target.value === "" ? null : Number(e.target.value) || 0,
                        })
                      }
                    />
                    <div className="mt-1 text-[0.7rem] text-stone">
                      {room.sqFtOverride != null ? "override" : `${number(sf, 1)} sf`}
                    </div>
                  </td>
                  <td>
                    <select
                      className="field-input field-input-sm"
                      value={room.materialType}
                      onChange={(e) =>
                        update(room.id, { materialType: e.target.value as Room["materialType"] })
                      }
                    >
                      {MATERIAL_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {MATERIAL_LABELS[type]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={room.demoExisting}
                      onChange={(e) => update(room.id, { demoExisting: e.target.checked })}
                      aria-label="Remove existing floor"
                    />
                  </td>
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={room.underlayment}
                      onChange={(e) => update(room.id, { underlayment: e.target.checked })}
                      aria-label="Include underlayment"
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="rounded-lg p-2 text-stone hover:bg-paper hover:text-oak-deep"
                      onClick={() => onChange(rooms.filter((r) => r.id !== room.id))}
                      aria-label={`Remove ${room.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-line-strong bg-cream px-3 py-2 text-sm font-semibold text-oak-deep hover:bg-paper"
        onClick={() => onChange([...rooms, emptyRoom()])}
      >
        <Plus className="h-4 w-4" />
        Add room / area
      </button>
    </div>
  );
}
