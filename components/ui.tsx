import type { ReactNode } from "react";

export function Card({
  title,
  kicker,
  action,
  children,
  className = "",
}: {
  title?: string;
  kicker?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`card p-5 sm:p-6 ${className}`}>
      {(title || action) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {kicker && (
              <p className="mb-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-stone">
                {kicker}
              </p>
            )}
            {title && <h2 className="font-display text-2xl tracking-tight text-ink">{title}</h2>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function Field({
  label,
  children,
  hint,
  className = "",
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[0.7rem] font-bold uppercase tracking-[0.12em] text-stone">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-stone">{hint}</span>}
    </label>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (id: T) => void;
}) {
  return (
    <div className="segmented" role="tablist">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          role="tab"
          data-active={value === option.id}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function Mark({ initials, src, size = "md" }: { initials: string; src?: string; size?: "sm" | "md" | "lg" }) {
  const dim = size === "lg" ? "h-16 w-16 text-2xl" : size === "sm" ? "h-9 w-9 text-sm" : "h-11 w-11 text-lg";
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt="Company logo"
        className={`${dim} rounded-xl object-cover shadow-sm ring-1 ring-line-strong/70`}
      />
    );
  }
  return <div className={`mark ${dim}`}>{initials.slice(0, 2)}</div>;
}

export function ImpactChip({ percent }: { percent: number }) {
  const positive = percent > 0.05;
  const negative = percent < -0.05;
  const label = `${percent > 0 ? "+" : ""}${percent.toFixed(0)}%`;
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[0.7rem] font-bold ${
        positive
          ? "bg-copper/15 text-oak-deep"
          : negative
            ? "bg-moss/15 text-moss"
            : "bg-line text-stone"
      }`}
    >
      {label}
    </span>
  );
}
