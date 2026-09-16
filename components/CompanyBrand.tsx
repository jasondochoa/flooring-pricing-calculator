"use client";

import { Field } from "./ui";
import { companyInitials } from "@/lib/format";
import type { Company } from "@/lib/types";

async function fileToLogo(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Could not read logo"));
      img.src = url;
    });
    const max = 360;
    const scale = Math.min(1, max / Math.max(image.width, image.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function CompanyBrand({
  company,
  onChange,
}: {
  company: Company;
  onChange: (company: Company) => void;
}) {
  const set = (patch: Partial<Company>) => {
    const next = { ...company, ...patch };
    if (patch.name && !company.logoDataUrl) {
      next.initials = companyInitials(patch.name, company.initials);
    }
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <Field label="Company name">
        <input className="field-input" value={company.name} onChange={(e) => set({ name: e.target.value })} />
      </Field>
      <Field label="Tagline">
        <input className="field-input" value={company.tagline} onChange={(e) => set({ tagline: e.target.value })} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Phone">
          <input className="field-input" value={company.phone} onChange={(e) => set({ phone: e.target.value })} />
        </Field>
        <Field label="Email">
          <input className="field-input" value={company.email} onChange={(e) => set({ email: e.target.value })} />
        </Field>
      </div>
      <Field label="Website">
        <input className="field-input" value={company.website} onChange={(e) => set({ website: e.target.value })} />
      </Field>
      <Field label="Address">
        <input className="field-input" value={company.address} onChange={(e) => set({ address: e.target.value })} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="License">
          <input className="field-input" value={company.license} onChange={(e) => set({ license: e.target.value })} />
        </Field>
        <Field label="Initials mark">
          <input
            className="field-input"
            maxLength={3}
            value={company.initials}
            onChange={(e) => set({ initials: e.target.value.toUpperCase() })}
          />
        </Field>
      </div>
      <Field label="Logo" hint="PNG or JPG. Used on the printed proposal.">
        <input
          type="file"
          accept="image/*"
          className="block w-full text-sm text-stone file:mr-3 file:rounded-lg file:border-0 file:bg-oak file:px-3 file:py-2 file:text-sm file:font-semibold file:text-cream"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const logoDataUrl = await fileToLogo(file);
            set({ logoDataUrl });
          }}
        />
      </Field>
      {company.logoDataUrl && (
        <button
          type="button"
          className="text-xs font-semibold text-oak-deep underline"
          onClick={() => set({ logoDataUrl: "" })}
        >
          Remove logo
        </button>
      )}
    </div>
  );
}
