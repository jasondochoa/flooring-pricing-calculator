"use client";

import { currency, number, signedPercent } from "@/lib/format";
import type { QuoteTotals } from "@/lib/types";

export function TotalsCard({ totals, taxRate, depositPct }: { totals: QuoteTotals; taxRate: number; depositPct: number }) {
  const rows = [
    { label: "Measured area", value: `${number(totals.netSqFt, 0)} sf` },
    { label: "With waste", value: `${number(totals.installSqFt, 0)} sf` },
    { label: "Line-item subtotal", value: currency(totals.lineSubtotal) },
    {
      label: `Client scalers (${signedPercent(totals.scalerPercent, 1)})`,
      value: currency(totals.scaledSubtotal),
    },
    { label: "Discount", value: totals.discountAmount ? `−${currency(totals.discountAmount)}` : "—" },
    { label: `Tax (${taxRate}%)`, value: currency(totals.taxAmount) },
  ];

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.label} className="flex items-baseline justify-between gap-3 text-sm">
          <span className="text-stone">{row.label}</span>
          <span className="font-semibold tabular-nums">{row.value}</span>
        </div>
      ))}
      <div className="rounded-2xl bg-ink px-4 py-4 text-cream">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-cream/55">Project total</p>
            <p className="font-display text-3xl tracking-tight">{currency(totals.total)}</p>
          </div>
          <div className="text-right text-sm">
            <p className="text-cream/55">{depositPct}% deposit</p>
            <p className="text-lg font-semibold tabular-nums">{currency(totals.deposit)}</p>
          </div>
        </div>
        <p className="mt-3 border-t border-cream/15 pt-3 text-sm text-cream/80">
          Balance due on completion {currency(totals.balance)}
        </p>
      </div>
    </div>
  );
}
