import type { QuoteState } from "./types";
import { applyRoomRateSync } from "./calc";

export const STORAGE_KEY = "hearth-grain-quote-v1";

export function createSampleState(): QuoteState {
  const state: QuoteState = {
    company: {
      name: "Hearth & Grain Flooring",
      tagline: "Floors that feel like home.",
      phone: "(503) 555-0148",
      email: "hello@hearthandgrain.com",
      website: "hearthandgrain.com",
      address: "214 Division Street, Portland, OR 97209",
      license: "CCB #219044",
      initials: "HG",
      logoDataUrl: "",
    },
    project: {
      clientName: "Margaret & James Ellison",
      clientEmail: "ellison.home@icloud.com",
      clientPhone: "(971) 555-0192",
      address: "1847 Willowbrook Lane",
      cityStateZip: "Portland, OR 97202",
      date: "2026-09-16",
      estimator: "Elena Vargas",
      proposalNumber: "HG-2026-0847",
      validDays: 30,
      notes:
        "Match existing white oak tone in the living room where possible. Kitchen island remains in place; run plank direction toward the garden doors. Client will keep the piano in the dining room — we will wrap and work around it.",
      terms:
        "Proposal is valid for 30 days. A 40% deposit schedules the job; balance is due on completion. Existing subfloor repairs, leveling beyond 1/8\" in 10', or hidden water damage are extra and will be quoted before work proceeds. Manufacturer warranties apply to materials; Hearth & Grain warrants installation workmanship for two years. Lead times depend on mill stock. Change orders must be written.",
    },
    rooms: [
      {
        id: "room-living",
        name: "Living room",
        lengthFt: 18,
        widthFt: 16,
        sqFtOverride: null,
        materialType: "hardwood",
        demoExisting: true,
        underlayment: true,
        notes: "7\" white oak, site-finished matte",
      },
      {
        id: "room-dining",
        name: "Dining room",
        lengthFt: 13,
        widthFt: 12,
        sqFtOverride: null,
        materialType: "hardwood",
        demoExisting: true,
        underlayment: true,
        notes: "Continue living-room oak through cased opening",
      },
      {
        id: "room-kitchen",
        name: "Kitchen",
        lengthFt: 16,
        widthFt: 12,
        sqFtOverride: null,
        materialType: "lvp",
        demoExisting: true,
        underlayment: true,
        notes: "Waterproof LVP, 20 mil wear layer",
      },
      {
        id: "room-hall",
        name: "Hallway",
        lengthFt: 22,
        widthFt: 4,
        sqFtOverride: null,
        materialType: "lvp",
        demoExisting: true,
        underlayment: true,
        notes: "Same LVP as kitchen, reducers at bedrooms",
      },
      {
        id: "room-primary",
        name: "Primary bedroom",
        lengthFt: 16,
        widthFt: 14,
        sqFtOverride: null,
        materialType: "carpet",
        demoExisting: true,
        underlayment: false,
        notes: "Low-profile wool blend over 8 lb pad",
      },
    ],
    rates: {
      materials: {
        hardwood: { material: 8.75, labor: 6.5 },
        engineered: { material: 6.4, labor: 5.1 },
        lvp: { material: 4.35, labor: 3.85 },
        tile: { material: 7.6, labor: 9.25 },
        carpet: { material: 3.65, labor: 2.4 },
        laminate: { material: 2.95, labor: 3.1 },
        vinyl: { material: 2.45, labor: 2.8 },
      },
      removalPerSf: 1.85,
      underlaymentPerSf: 0.85,
      transitionPerLf: 12.5,
      stairPerStep: 92,
      wasteFactorPct: 10,
      taxRatePct: 8.25,
      depositPct: 40,
      discountPct: 0,
      transitionLf: 28,
      stairCount: 13,
    },
    items: [
      {
        id: "item-prep",
        name: "Subfloor prep & minor patching",
        qty: 1,
        unit: "ls",
        unitPrice: 650,
        kind: "custom",
        source: "manual",
        include: true,
      },
      {
        id: "item-furniture",
        name: "Furniture move, wrap & reset",
        qty: 1,
        unit: "ls",
        unitPrice: 425,
        kind: "custom",
        source: "manual",
        include: true,
      },
      {
        id: "item-base",
        name: "Shoe molding / quarter round, stain-to-match",
        qty: 164,
        unit: "lf",
        unitPrice: 4.25,
        kind: "custom",
        source: "manual",
        include: true,
      },
      {
        id: "item-moisture",
        name: "Concrete moisture test (kitchen)",
        qty: 1,
        unit: "ea",
        unitPrice: 95,
        kind: "custom",
        source: "manual",
        include: true,
      },
    ],
    scalers: {
      occupancy: "residential",
      timeline: "standard",
      complexityPct: 8,
      grade: "premium",
      regionalIndex: 108,
    },
  };

  return applyRoomRateSync(state);
}

export function loadState(): QuoteState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as QuoteState;
    if (!parsed?.company || !parsed?.project || !Array.isArray(parsed.rooms)) return null;
    return applyRoomRateSync(parsed);
  } catch {
    return null;
  }
}

export function saveState(state: QuoteState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota or private mode — keep working in memory.
  }
}

export function clearState(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
