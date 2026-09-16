import type { AppliedScaler, LineItem, QuoteState, QuoteTotals, RateSheet, Room } from "./types";
import { GRADE_OPTIONS, MATERIAL_LABELS, OCCUPANCY_OPTIONS, TIMELINE_OPTIONS } from "./format";
import { uid } from "./id";

export function roomSqFt(room: Room): number {
  if (room.sqFtOverride != null && room.sqFtOverride > 0) return round2(room.sqFtOverride);
  return round2(Math.max(0, room.lengthFt) * Math.max(0, room.widthFt));
}

export function netSqFt(rooms: Room[]): number {
  return round2(rooms.reduce((sum, room) => sum + roomSqFt(room), 0));
}

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function lineTotal(item: LineItem): number {
  if (!item.include) return 0;
  return round2(Math.max(0, item.qty) * Math.max(0, item.unitPrice));
}

export function scalerBreakdown(state: QuoteState): AppliedScaler[] {
  const occupancy = OCCUPANCY_OPTIONS.find((o) => o.id === state.scalers.occupancy) ?? OCCUPANCY_OPTIONS[0];
  const timeline = TIMELINE_OPTIONS.find((o) => o.id === state.scalers.timeline) ?? TIMELINE_OPTIONS[0];
  const grade = GRADE_OPTIONS.find((o) => o.id === state.scalers.grade) ?? GRADE_OPTIONS[1];
  const complexity = Math.max(0, Math.min(25, state.scalers.complexityPct)) / 100;
  const regional = Math.max(80, Math.min(140, state.scalers.regionalIndex)) / 100;

  return [
    {
      id: "occupancy",
      label: occupancy.label,
      detail:
        occupancy.id === "residential"
          ? "Priced as a single-family residential install — no occupancy premium."
          : occupancy.id === "multifamily"
            ? "Multi-family / HOA work includes extra coordination, access, and insurance overhead."
            : "Commercial work includes after-hours potential, insurance, and higher jobsite overhead.",
      multiplier: occupancy.multiplier,
      percent: round2((occupancy.multiplier - 1) * 100),
    },
    {
      id: "timeline",
      label: `${timeline.label} timeline`,
      detail:
        timeline.id === "standard"
          ? "Standard 3–5 week production calendar with normal crew sequencing."
          : timeline.id === "priority"
            ? "Priority start within two weeks — overtime and schedule compression."
            : "Rush start this week — crew reallocation and compressed lead times.",
      multiplier: timeline.multiplier,
      percent: round2((timeline.multiplier - 1) * 100),
    },
    {
      id: "complexity",
      label: "Site complexity",
      detail:
        complexity === 0
          ? "Straightforward layout: empty rooms, square cuts, easy access."
          : `Access, furniture, diagonals, or uneven subfloors add ${round2(complexity * 100)}% to labor-sensitive pricing.`,
      multiplier: 1 + complexity,
      percent: round2(complexity * 100),
    },
    {
      id: "grade",
      label: `${grade.label} grade`,
      detail: grade.hint + (grade.multiplier === 1 ? " — priced at the house standard." : " — scales material and finish quality."),
      multiplier: grade.multiplier,
      percent: round2((grade.multiplier - 1) * 100),
    },
    {
      id: "regional",
      label: "Regional cost index",
      detail:
        regional === 1
          ? "Priced at the national-average cost index (100)."
          : `Local labor and freight are ${round2(regional * 100)}% of the national average.`,
      multiplier: regional,
      percent: round2((regional - 1) * 100),
    },
  ];
}

export function computeTotals(state: QuoteState): QuoteTotals {
  const net = netSqFt(state.rooms);
  const waste = round2(net * (Math.max(0, state.rates.wasteFactorPct) / 100));
  const lineSubtotal = round2(state.items.reduce((sum, item) => sum + lineTotal(item), 0));
  const appliedScalers = scalerBreakdown(state);
  const scalerMultiplier = round2(
    appliedScalers.reduce((acc, scaler) => acc * scaler.multiplier, 1) * 10000,
  ) / 10000;
  const scaledSubtotal = round2(lineSubtotal * scalerMultiplier);
  const discountAmount = round2(scaledSubtotal * (Math.max(0, state.rates.discountPct) / 100));
  const afterDiscount = round2(Math.max(0, scaledSubtotal - discountAmount));
  const taxAmount = round2(afterDiscount * (Math.max(0, state.rates.taxRatePct) / 100));
  const total = round2(afterDiscount + taxAmount);
  const deposit = round2(total * (Math.max(0, state.rates.depositPct) / 100));

  return {
    netSqFt: net,
    wasteSqFt: waste,
    installSqFt: round2(net + waste),
    lineSubtotal,
    scalerMultiplier,
    scalerPercent: round2((scalerMultiplier - 1) * 100),
    appliedScalers,
    scaledSubtotal,
    discountAmount,
    afterDiscount,
    taxAmount,
    total,
    deposit,
    balance: round2(total - deposit),
  };
}

export function syncDerivedItems(state: QuoteState): LineItem[] {
  const waste = 1 + Math.max(0, state.rates.wasteFactorPct) / 100;
  const grouped = new Map<string, { materialType: LineItem["materialType"]; sf: number; demo: number; under: number }>();

  for (const room of state.rooms) {
    const sf = roomSqFt(room);
    const current = grouped.get(room.materialType) ?? {
      materialType: room.materialType,
      sf: 0,
      demo: 0,
      under: 0,
    };
    current.sf += sf;
    if (room.demoExisting) current.demo += sf;
    if (room.underlayment) current.under += sf;
    grouped.set(room.materialType, current);
  }

  const derived: LineItem[] = [];

  for (const group of grouped.values()) {
    if (group.sf <= 0 || !group.materialType) continue;
    const rates = state.rates.materials[group.materialType];
    const materialQty = round2(group.sf * waste);
    derived.push({
      id: `derived-mat-${group.materialType}`,
      name: `${MATERIAL_LABELS[group.materialType]} — material`,
      qty: materialQty,
      unit: "sf",
      unitPrice: rates.material,
      kind: "material",
      source: "derived",
      materialType: group.materialType,
      include: true,
    });
    derived.push({
      id: `derived-labor-${group.materialType}`,
      name: `${MATERIAL_LABELS[group.materialType]} — install labor`,
      qty: round2(group.sf),
      unit: "sf",
      unitPrice: rates.labor,
      kind: "labor",
      source: "derived",
      materialType: group.materialType,
      include: true,
    });
  }

  const demoSf = round2([...grouped.values()].reduce((s, g) => s + g.demo, 0));
  if (demoSf > 0) {
    derived.push({
      id: "derived-demo",
      name: "Existing floor removal & haul-off",
      qty: demoSf,
      unit: "sf",
      unitPrice: state.rates.removalPerSf,
      kind: "demo",
      source: "derived",
      include: true,
    });
  }

  const underSf = round2([...grouped.values()].reduce((s, g) => s + g.under, 0) * waste);
  if (underSf > 0) {
    derived.push({
      id: "derived-underlayment",
      name: "Underlayment / moisture barrier",
      qty: underSf,
      unit: "sf",
      unitPrice: state.rates.underlaymentPerSf,
      kind: "underlayment",
      source: "derived",
      include: true,
    });
  }

  if (state.rates.transitionLf > 0) {
    derived.push({
      id: "derived-transitions",
      name: "Transitions, reducers & T-moldings",
      qty: round2(state.rates.transitionLf),
      unit: "lf",
      unitPrice: state.rates.transitionPerLf,
      kind: "trim",
      source: "derived",
      include: true,
    });
  }

  if (state.rates.stairCount > 0) {
    derived.push({
      id: "derived-stairs",
      name: "Stair treads, risers & nosing",
      qty: round2(state.rates.stairCount),
      unit: "step",
      unitPrice: state.rates.stairPerStep,
      kind: "stairs",
      source: "derived",
      include: true,
    });
  }

  const previous = new Map(state.items.map((item) => [item.id, item]));
  const mergedDerived = derived.map((item) => {
    const existing = previous.get(item.id);
    if (!existing) return item;
    return {
      ...item,
      name: existing.name,
      include: existing.include,
    };
  });

  const manuals = state.items.filter((item) => item.source === "manual");
  return [...mergedDerived, ...manuals];
}

export function applyRoomRateSync(state: QuoteState): QuoteState {
  return { ...state, items: syncDerivedItems(state) };
}

export function applyDerivedPriceToRates(rates: RateSheet, item: LineItem): RateSheet {
  if (item.source !== "derived") return rates;
  if (item.kind === "material" && item.materialType) {
    const current = rates.materials[item.materialType];
    return {
      ...rates,
      materials: { ...rates.materials, [item.materialType]: { ...current, material: item.unitPrice } },
    };
  }
  if (item.kind === "labor" && item.materialType) {
    const current = rates.materials[item.materialType];
    return {
      ...rates,
      materials: { ...rates.materials, [item.materialType]: { ...current, labor: item.unitPrice } },
    };
  }
  if (item.kind === "demo") return { ...rates, removalPerSf: item.unitPrice };
  if (item.kind === "underlayment") return { ...rates, underlaymentPerSf: item.unitPrice };
  if (item.kind === "trim") return { ...rates, transitionPerLf: item.unitPrice };
  if (item.kind === "stairs") return { ...rates, stairPerStep: item.unitPrice };
  return rates;
}

export function emptyManualItem(): LineItem {
  return {
    id: uid("item"),
    name: "Custom line",
    qty: 1,
    unit: "ea",
    unitPrice: 0,
    kind: "custom",
    source: "manual",
    include: true,
  };
}

export function emptyRoom(): Room {
  return {
    id: uid("room"),
    name: "New area",
    lengthFt: 12,
    widthFt: 10,
    sqFtOverride: null,
    materialType: "lvp",
    demoExisting: true,
    underlayment: true,
    notes: "",
  };
}

export function includedItems(items: LineItem[]): LineItem[] {
  return items.filter((item) => item.include && item.qty > 0);
}
