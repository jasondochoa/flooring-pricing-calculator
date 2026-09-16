"use client";

import { useEffect, useMemo, useState } from "react";
import { applyDerivedPriceToRates, applyRoomRateSync, computeTotals } from "@/lib/calc";
import { clearState, createSampleState, loadState, saveState } from "@/lib/storage";
import type { QuoteState } from "@/lib/types";
import { CompanyBrand } from "./CompanyBrand";
import { Header } from "./Header";
import { LineItemTable } from "./LineItemTable";
import { NotesTerms } from "./NotesTerms";
import { ProjectDetails } from "./ProjectDetails";
import { ProposalView } from "./ProposalView";
import { RateSheetEditor } from "./RateSheet";
import { RoomList } from "./RoomList";
import { ScalerPanel } from "./ScalerPanel";
import { TotalsCard } from "./TotalsCard";
import { Card } from "./ui";

export default function CalculatorApp() {
  const [state, setState] = useState<QuoteState | null>(null);
  const [view, setView] = useState<"estimate" | "proposal">("estimate");
  const [ready, setReady] = useState(false);
  const [printWhenReady, setPrintWhenReady] = useState(false);

  useEffect(() => {
    setState(loadState() ?? createSampleState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready && state) saveState(state);
  }, [ready, state]);

  useEffect(() => {
    if (view !== "proposal" || !printWhenReady || !state) return;
    const previous = document.title;
    document.title = `${state.project.proposalNumber} ${state.project.clientName}`;
    const timer = window.setTimeout(() => {
      window.print();
      document.title = previous;
      setPrintWhenReady(false);
    }, 120);
    return () => window.clearTimeout(timer);
  }, [view, printWhenReady, state]);

  const totals = useMemo(() => (state ? computeTotals(state) : null), [state]);

  const patch = (updater: (current: QuoteState) => QuoteState, sync = false) => {
    setState((current) => {
      if (!current) return current;
      const next = updater(current);
      return sync ? applyRoomRateSync(next) : next;
    });
  };

  const printProposal = () => {
    setView("proposal");
    setPrintWhenReady(true);
  };

  if (!state || !totals) {
    return (
      <div className="grid min-h-screen place-items-center">
        <p className="font-display text-2xl text-oak-deep">Opening the estimator…</p>
      </div>
    );
  }

  return (
    <div className={`print-root min-h-screen ${view === "proposal" ? "bg-paper" : ""}`}>
      <Header
        company={state.company}
        view={view}
        onView={setView}
        onPrint={() => {
          if (view === "proposal") printProposal();
          else setView("proposal");
        }}
        onReset={() => {
          clearState();
          setState(createSampleState());
        }}
      />

      {view === "estimate" ? (
        <main className="no-print mx-auto grid max-w-[1440px] gap-5 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_360px] sm:px-6">
          <div className="space-y-5">
            <Card kicker="Job file" title="Project details">
              <ProjectDetails
                project={state.project}
                onChange={(project) => patch((s) => ({ ...s, project }))}
              />
            </Card>
            <Card
              kicker="Takeoff"
              title="Rooms & areas"
              action={
                <p className="text-right text-sm text-stone">
                  {totals.netSqFt.toFixed(0)} sf net
                  <br />
                  {totals.installSqFt.toFixed(0)} sf with waste
                </p>
              }
            >
              <RoomList rooms={state.rooms} onChange={(rooms) => patch((s) => ({ ...s, rooms }), true)} />
            </Card>
            <Card kicker="House rates" title="Materials, labor & extras">
              <RateSheetEditor rates={state.rates} onChange={(rates) => patch((s) => ({ ...s, rates }), true)} />
            </Card>
            <Card kicker="Quote" title="Table of services">
              <LineItemTable
                items={state.items}
                onChange={(items) =>
                  patch((s) => {
                    let rates = s.rates;
                    for (const item of items) {
                      if (item.source === "derived") rates = applyDerivedPriceToRates(rates, item);
                    }
                    return { ...s, rates, items };
                  })
                }
              />
            </Card>
            <Card kicker="Client-facing copy" title="Notes & terms">
              <NotesTerms project={state.project} onChange={(project) => patch((s) => ({ ...s, project }))} />
            </Card>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <Card kicker="Adjustments" title="Client scalers">
              <ScalerPanel
                scalers={state.scalers}
                applied={totals.appliedScalers}
                combinedPercent={totals.scalerPercent}
                onChange={(scalers) => patch((s) => ({ ...s, scalers }))}
              />
            </Card>
            <Card kicker="Live math" title="Totals">
              <TotalsCard
                totals={totals}
                taxRate={state.rates.taxRatePct}
                depositPct={state.rates.depositPct}
              />
            </Card>
            <Card kicker="Letterhead" title="Company branding">
              <CompanyBrand company={state.company} onChange={(company) => patch((s) => ({ ...s, company }))} />
            </Card>
          </aside>
        </main>
      ) : (
        <main className="px-3 py-6 sm:px-6 sm:py-10">
          <div className="no-print mx-auto mb-6 flex max-w-[816px] flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-soft">
              Client-ready view. Print or use your browser’s Save as PDF.
            </p>
            <button
              type="button"
              onClick={printProposal}
              className="rounded-xl bg-oak-deep px-4 py-2 text-sm font-semibold text-cream hover:bg-ink"
            >
              Download PDF
            </button>
          </div>
          <ProposalView state={state} totals={totals} />
        </main>
      )}
    </div>
  );
}
