export const MATERIAL_TYPES = [
  "hardwood",
  "engineered",
  "lvp",
  "tile",
  "carpet",
  "laminate",
  "vinyl",
] as const;

export type MaterialType = (typeof MATERIAL_TYPES)[number];

export const UNITS = ["sf", "lf", "ea", "hr", "step", "ls"] as const;
export type Unit = (typeof UNITS)[number];

export type Occupancy = "residential" | "multifamily" | "commercial";
export type Timeline = "standard" | "priority" | "rush";
export type MaterialGrade = "builder" | "standard" | "premium" | "heritage";
export type LineKind =
  | "material"
  | "labor"
  | "demo"
  | "underlayment"
  | "trim"
  | "stairs"
  | "custom";

export interface Room {
  id: string;
  name: string;
  lengthFt: number;
  widthFt: number;
  sqFtOverride: number | null;
  materialType: MaterialType;
  demoExisting: boolean;
  underlayment: boolean;
  notes: string;
}

export interface LineItem {
  id: string;
  name: string;
  qty: number;
  unit: Unit;
  unitPrice: number;
  kind: LineKind;
  source: "derived" | "manual";
  materialType?: MaterialType;
  include: boolean;
}

export interface Company {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  license: string;
  initials: string;
  logoDataUrl: string;
}

export interface ProjectInfo {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  address: string;
  cityStateZip: string;
  date: string;
  estimator: string;
  proposalNumber: string;
  validDays: number;
  notes: string;
  terms: string;
}

export interface MaterialRates {
  material: number;
  labor: number;
}

export interface RateSheet {
  materials: Record<MaterialType, MaterialRates>;
  removalPerSf: number;
  underlaymentPerSf: number;
  transitionPerLf: number;
  stairPerStep: number;
  wasteFactorPct: number;
  taxRatePct: number;
  depositPct: number;
  discountPct: number;
  transitionLf: number;
  stairCount: number;
}

export interface Scalers {
  occupancy: Occupancy;
  timeline: Timeline;
  complexityPct: number;
  grade: MaterialGrade;
  regionalIndex: number;
}

export interface QuoteState {
  company: Company;
  project: ProjectInfo;
  rooms: Room[];
  rates: RateSheet;
  items: LineItem[];
  scalers: Scalers;
}

export interface AppliedScaler {
  id: string;
  label: string;
  detail: string;
  multiplier: number;
  percent: number;
}

export interface QuoteTotals {
  netSqFt: number;
  wasteSqFt: number;
  installSqFt: number;
  lineSubtotal: number;
  scalerMultiplier: number;
  scalerPercent: number;
  appliedScalers: AppliedScaler[];
  scaledSubtotal: number;
  discountAmount: number;
  afterDiscount: number;
  taxAmount: number;
  total: number;
  deposit: number;
  balance: number;
}
