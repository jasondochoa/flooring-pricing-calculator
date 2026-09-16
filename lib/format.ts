import type { MaterialType, Occupancy, Timeline, MaterialGrade, Unit } from "./types";

export const MATERIAL_LABELS: Record<MaterialType, string> = {
  hardwood: "Solid hardwood",
  engineered: "Engineered hardwood",
  lvp: "Luxury vinyl plank",
  tile: "Porcelain / ceramic tile",
  carpet: "Carpet",
  laminate: "Laminate",
  vinyl: "Sheet vinyl",
};

export const MATERIAL_SHORT: Record<MaterialType, string> = {
  hardwood: "Hardwood",
  engineered: "Engineered",
  lvp: "LVP",
  tile: "Tile",
  carpet: "Carpet",
  laminate: "Laminate",
  vinyl: "Vinyl",
};

export const UNIT_LABELS: Record<Unit, string> = {
  sf: "sf",
  lf: "lf",
  ea: "ea",
  hr: "hr",
  step: "step",
  ls: "ls",
};

export const OCCUPANCY_OPTIONS: { id: Occupancy; label: string; multiplier: number; hint: string }[] = [
  { id: "residential", label: "Residential", multiplier: 1, hint: "Single-family home" },
  { id: "multifamily", label: "Multi-family", multiplier: 1.08, hint: "Condos, apartments" },
  { id: "commercial", label: "Commercial", multiplier: 1.18, hint: "Retail, office, HOA" },
];

export const TIMELINE_OPTIONS: { id: Timeline; label: string; multiplier: number; hint: string }[] = [
  { id: "standard", label: "Standard", multiplier: 1, hint: "3–5 week schedule" },
  { id: "priority", label: "Priority", multiplier: 1.1, hint: "Start within 2 weeks" },
  { id: "rush", label: "Rush", multiplier: 1.2, hint: "Start this week" },
];

export const GRADE_OPTIONS: { id: MaterialGrade; label: string; multiplier: number; hint: string }[] = [
  { id: "builder", label: "Builder", multiplier: 0.92, hint: "Value-grade product" },
  { id: "standard", label: "Standard", multiplier: 1, hint: "Mid-grade, most homes" },
  { id: "premium", label: "Premium", multiplier: 1.12, hint: "Better wear layer / species" },
  { id: "heritage", label: "Heritage", multiplier: 1.28, hint: "Wide plank, boutique mills" },
];

export function currency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

export function number(value: number, digits = 0): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(Number.isFinite(value) ? value : 0);
}

export function signedPercent(value: number, digits = 0): string {
  const n = Number.isFinite(value) ? value : 0;
  const formatted = `${n > 0 ? "+" : ""}${n.toFixed(digits)}%`;
  return formatted;
}

export function formatDate(iso: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(y, m - 1, d));
}

export function companyInitials(name: string, fallback: string): string {
  const parts = name
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((p) => p && !/^(and|&|the|co|llc|inc|studio|flooring)$/i.test(p));
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  if (parts[0]) return parts[0].slice(0, 2).toUpperCase();
  return fallback.slice(0, 2).toUpperCase() || "HG";
}
