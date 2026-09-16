"use client";

import { includedItems, lineTotal, roomSqFt } from "@/lib/calc";
import { currency, formatDate, MATERIAL_SHORT, number, signedPercent, UNIT_LABELS } from "@/lib/format";
import type { QuoteState, QuoteTotals } from "@/lib/types";
import { Mark } from "./ui";

export function ProposalView({ state, totals }: { state: QuoteState; totals: QuoteTotals }) {
  const items = includedItems(state.items);
  const validUntil = validDate(state.project.date, state.project.validDays);

  return (
    <article className="proposal-sheet mx-auto w-full max-w-[816px] overflow-hidden rounded-[1.6rem] border border-line-strong shadow-[0_30px_80px_-40px_rgba(28,25,22,0.55)]">
      <div className="relative bg-ink px-8 py-8 text-cream sm:px-12">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-copper via-[#e8c9a0] to-moss" />
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <Mark initials={state.company.initials} src={state.company.logoDataUrl} size="lg" />
            <div>
              <p className="font-display text-3xl leading-none tracking-tight">{state.company.name}</p>
              <p className="mt-1 text-sm text-cream/70">{state.company.tagline}</p>
              <p className="mt-3 text-xs leading-relaxed text-cream/60">
                {state.company.address}
                <br />
                {state.company.phone} · {state.company.email}
                <br />
                {state.company.website} · {state.company.license}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-copper">Proposal</p>
            <p className="mt-1 font-display text-2xl">{state.project.proposalNumber}</p>
            <p className="mt-2 text-sm text-cream/70">{formatDate(state.project.date)}</p>
            <p className="text-xs text-cream/50">Valid through {validUntil}</p>
          </div>
        </div>
      </div>

      <div className="space-y-8 px-8 py-8 sm:px-12 sm:py-10">
        <section className="grid gap-6 break-inside-avoid sm:grid-cols-2">
          <div>
            <h3 className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-stone">Prepared for</h3>
            <p className="mt-2 font-display text-2xl leading-tight">{state.project.clientName}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">
              {state.project.address}
              <br />
              {state.project.cityStateZip}
              <br />
              {state.project.clientPhone}
              <br />
              {state.project.clientEmail}
            </p>
          </div>
          <div>
            <h3 className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-stone">Project</h3>
            <p className="mt-2 font-display text-2xl leading-tight">Interior flooring installation</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">
              Estimator {state.project.estimator}
              <br />
              {number(totals.netSqFt, 0)} sf measured · {number(totals.installSqFt, 0)} sf with{" "}
              {state.rates.wasteFactorPct}% waste
              <br />
              {state.rooms.length} areas · {state.rates.stairCount} stair treads
            </p>
          </div>
        </section>

        <section className="break-inside-avoid">
          <h3 className="font-display text-2xl">Scope of work</h3>
          <div className="mt-3 overflow-hidden rounded-2xl border border-line">
            <table className="w-full text-sm">
              <thead className="bg-paper text-left text-[0.68rem] font-bold uppercase tracking-[0.12em] text-stone">
                <tr>
                  <th className="px-4 py-2.5">Area</th>
                  <th className="px-4 py-2.5">Size</th>
                  <th className="px-4 py-2.5">Flooring</th>
                  <th className="px-4 py-2.5">Notes</th>
                </tr>
              </thead>
              <tbody>
                {state.rooms.map((room) => (
                  <tr key={room.id} className="border-t border-line">
                    <td className="px-4 py-2.5 font-medium">{room.name}</td>
                    <td className="px-4 py-2.5 tabular-nums">
                      {room.lengthFt} × {room.widthFt} ft · {number(roomSqFt(room), 0)} sf
                    </td>
                    <td className="px-4 py-2.5">{MATERIAL_SHORT[room.materialType]}</td>
                    <td className="px-4 py-2.5 text-ink-soft">
                      {[
                        room.demoExisting ? "remove existing" : null,
                        room.underlayment ? "underlayment" : null,
                        room.notes,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {state.project.notes && (
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{state.project.notes}</p>
          )}
        </section>

        <section className="break-inside-avoid">
          <h3 className="font-display text-2xl">Itemized pricing</h3>
          <div className="mt-3 overflow-hidden rounded-2xl border border-line">
            <table className="w-full text-sm">
              <thead className="bg-paper text-left text-[0.68rem] font-bold uppercase tracking-[0.12em] text-stone">
                <tr>
                  <th className="px-4 py-2.5">Description</th>
                  <th className="px-4 py-2.5 text-right">Qty</th>
                  <th className="px-4 py-2.5">Unit</th>
                  <th className="px-4 py-2.5 text-right">Rate</th>
                  <th className="px-4 py-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-line">
                    <td className="px-4 py-2.5">{item.name}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{number(item.qty, item.qty % 1 ? 1 : 0)}</td>
                    <td className="px-4 py-2.5">{UNIT_LABELS[item.unit]}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{currency(item.unitPrice)}</td>
                    <td className="px-4 py-2.5 text-right font-medium tabular-nums">{currency(lineTotal(item))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="break-inside-avoid rounded-2xl bg-paper px-5 py-5">
          <h3 className="font-display text-xl">How this price was built</h3>
          <p className="mt-1 text-sm text-ink-soft">
            Base line items total {currency(totals.lineSubtotal)}. The adjustments below scale that figure by{" "}
            {signedPercent(totals.scalerPercent, 1)} before tax.
          </p>
          <ul className="mt-4 space-y-2">
            {totals.appliedScalers.map((scaler) => (
              <li key={scaler.id} className="flex gap-3 text-sm">
                <span className="w-16 shrink-0 font-bold text-oak-deep">{signedPercent(scaler.percent, 0)}</span>
                <span>
                  <span className="font-semibold">{scaler.label}. </span>
                  <span className="text-ink-soft">{scaler.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="ml-auto w-full max-w-sm break-inside-avoid space-y-2 text-sm">
          <Row label="Subtotal (scaled)" value={currency(totals.scaledSubtotal)} />
          {totals.discountAmount > 0 && (
            <Row label={`Discount (${state.rates.discountPct}%)`} value={`−${currency(totals.discountAmount)}`} />
          )}
          <Row label={`Tax (${state.rates.taxRatePct}%)`} value={currency(totals.taxAmount)} />
          <div className="flex items-baseline justify-between border-t border-line pt-3 font-display text-2xl">
            <span>Total</span>
            <span>{currency(totals.total)}</span>
          </div>
          <Row label={`Deposit due to schedule (${state.rates.depositPct}%)`} value={currency(totals.deposit)} />
          <Row label="Balance due on completion" value={currency(totals.balance)} />
        </section>

        <section className="break-inside-avoid">
          <h3 className="font-display text-2xl">Terms</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{state.project.terms}</p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <Signature label="Client acceptance" name={state.project.clientName} />
            <Signature label="For Hearth & Grain" name={state.project.estimator} />
          </div>
        </section>
      </div>
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6">
      <span className="text-stone">{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  );
}

function Signature({ label, name }: { label: string; name: string }) {
  return (
    <div>
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-stone">{label}</p>
      <div className="mt-8 border-b border-ink/30" />
      <p className="mt-2 text-sm text-ink-soft">{name}</p>
    </div>
  );
}

function validDate(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return "—";
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + Math.max(0, days));
  return formatDate(
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
  );
}
