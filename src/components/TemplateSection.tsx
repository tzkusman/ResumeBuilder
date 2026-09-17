import React from "react";
import { Icon } from "./ui";
import { ACCENTS, type ResumeData, type TemplateId } from "../lib/types";

interface TemplateOption {
  id: TemplateId;
  name: string;
  note: string;
  tag: string;
  tagColor: string;
}

export const ALL_TEMPLATES: TemplateOption[] = [
  { id: "merit", name: "Merit", note: "ATS-Safe single column standard", tag: "ATS Standard", tagColor: "bg-pine/15 text-pine-deep" },
  { id: "modern", name: "Modern", note: "Clean contemporary layout", tag: "Most Popular", tagColor: "bg-acid text-ink" },
  { id: "nordic", name: "Nordic", note: "Minimalist Scandinavian typography", tag: "Minimal", tagColor: "bg-neutral-200 text-neutral-800" },
  { id: "classic", name: "Classic", note: "Traditional serif format for law & finance", tag: "Traditional", tagColor: "bg-amber-100 text-amber-900" },
  { id: "cascade", name: "Cascade", note: "Modern tiered accents & hierarchy", tag: "Executive", tagColor: "bg-blue-100 text-blue-900" },
  { id: "summit", name: "Summit", note: "Authoritative leadership aesthetic", tag: "C-Suite", tagColor: "bg-purple-100 text-purple-900" },
  { id: "onyx", name: "Onyx", note: "High-contrast technical precision", tag: "Tech & Eng", tagColor: "bg-emerald-100 text-emerald-900" },
  { id: "stellar", name: "Stellar", note: "Dual-tone telemetry sidebar", tag: "Telemetry", tagColor: "bg-indigo-100 text-indigo-900" },
  { id: "ledger", name: "Ledger", note: "Visual two-column sidebar layout", tag: "Sidebar", tagColor: "bg-rose-100 text-rose-900" },
  { id: "bold", name: "Bold", note: "Strong impact with bold color header", tag: "Impact", tagColor: "bg-orange-100 text-orange-900" },
  { id: "elegant", name: "Elegant", note: "Sophisticated editorial luxury serif", tag: "Editorial", tagColor: "bg-neutral-100 text-neutral-900" },
  { id: "professional", name: "Professional", note: "Corporate formal business layout", tag: "Corporate", tagColor: "bg-sky-100 text-sky-900" },
  { id: "minimal", name: "Minimal", note: "Distraction-free high readability", tag: "Clean", tagColor: "bg-gray-100 text-gray-900" },
  { id: "creative", name: "Creative", note: "Artistic header & modern flair", tag: "Design", tagColor: "bg-fuchsia-100 text-fuchsia-900" },
  { id: "executive", name: "Executive", note: "Senior leadership structured format", tag: "Director", tagColor: "bg-stone-200 text-stone-900" },
  { id: "tech", name: "Tech", note: "Software, DevOps & Startup optimized", tag: "DevOps", tagColor: "bg-cyan-100 text-cyan-900" },
  { id: "academic", name: "Academic", note: "Research, publications & education focus", tag: "Academic", tagColor: "bg-yellow-100 text-yellow-900" },
  { id: "atlas", name: "Atlas", note: "Compact modern bar header", tag: "Compact", tagColor: "bg-teal-100 text-teal-900" },
  { id: "craft", name: "Craft", note: "Refined centered typography", tag: "Handcrafted", tagColor: "bg-lime-100 text-lime-900" },
  { id: "corporate", name: "Corporate", note: "Strict enterprise hierarchy", tag: "Enterprise", tagColor: "bg-slate-200 text-slate-900" },
];

interface TemplateSectionProps {
  resume: ResumeData;
  onChange: (fn: (r: ResumeData) => ResumeData) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function TemplateSection({ resume, onChange, onNext, onPrev }: TemplateSectionProps) {
  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="border-2 border-ink bg-card p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pine text-white text-[11px] font-bold">
            🎨
          </span>
          <h2 className="font-display text-base font-bold text-ink">Choose Template & Styling</h2>
        </div>
        <p className="text-xs text-neutral-600 leading-relaxed">
          Select an ATS-optimized template. Changes update live in your right-hand continuous preview. All templates auto-adjust smoothly when printed or exported.
        </p>
      </div>

      {/* Accent Color Picker */}
      <div className="border-2 border-ink bg-card p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="font-display text-sm font-bold text-ink">Accent Color & Ink</h3>
            <p className="font-mono text-[10.5px] text-ink-soft">Applied to headers, borders, tags, and bullets</p>
          </div>
          <span
            className="inline-block h-6 w-12 border-2 border-ink shadow-xs"
            style={{ backgroundColor: resume.accent }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {ACCENTS.map((color) => {
            const isSelected = resume.accent === color;
            return (
              <button
                key={color}
                type="button"
                onClick={() => onChange((r) => ({ ...r, accent: color }))}
                aria-label={`Select accent ${color}`}
                className={`relative h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 shadow-xs ${
                  isSelected ? "border-ink ring-2 ring-acid ring-offset-1 scale-110" : "border-neutral-300"
                }`}
                style={{ backgroundColor: color }}
              >
                {isSelected && (
                  <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold drop-shadow">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Page Count Format */}
      <div className="border-2 border-ink bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-sm font-bold text-ink">Page Format Mode</h3>
            <p className="font-mono text-[10.5px] text-ink-soft">
              Preview displays full content continuously; print automatically formats pages cleanly.
            </p>
          </div>
          <div className="inline-flex border-2 border-ink bg-white p-0.5">
            <button
              type="button"
              onClick={() => onChange((r) => ({ ...r, pageCount: 1 }))}
              className={`px-3 py-1.5 font-mono text-xs font-bold transition-colors ${
                resume.pageCount !== 2 ? "bg-ink text-acid" : "text-ink-soft hover:text-ink"
              }`}
            >
              1 Page (ATS Standard)
            </button>
            <button
              type="button"
              onClick={() => onChange((r) => ({ ...r, pageCount: 2 }))}
              className={`px-3 py-1.5 font-mono text-xs font-bold transition-colors ${
                resume.pageCount === 2 ? "bg-ink text-acid" : "text-ink-soft hover:text-ink"
              }`}
            >
              2 Pages (Extended)
            </button>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="border-2 border-ink bg-card p-4">
        <div className="mb-3">
          <h3 className="font-display text-sm font-bold text-ink">Select Layout Template ({ALL_TEMPLATES.length})</h3>
          <p className="font-mono text-[10.5px] text-ink-soft">Click any template to instantly preview it</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
          {ALL_TEMPLATES.map((tp) => {
            const isSelected = resume.template === tp.id;
            return (
              <button
                key={tp.id}
                type="button"
                onClick={() => onChange((r) => ({ ...r, template: tp.id }))}
                className={`flex flex-col text-left p-3 border-2 transition-all ${
                  isSelected
                    ? "border-ink bg-acid/25 shadow-[2px_2px_0_0_var(--color-ink)]"
                    : "border-ink/20 bg-paper hover:border-ink/60 hover:bg-card"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-display text-sm font-bold text-ink">{tp.name}</span>
                  <span className={`px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase rounded ${tp.tagColor}`}>
                    {tp.tag}
                  </span>
                </div>
                <p className="text-[11.5px] text-neutral-600 leading-tight mb-2">{tp.note}</p>
                <div className="mt-auto flex items-center justify-between pt-1 border-t border-ink/10">
                  <span className="font-mono text-[10px] text-ink-soft">
                    {isSelected ? "● Active Template" : "Click to apply"}
                  </span>
                  <div
                    className="h-2 w-10 rounded-full"
                    style={{ backgroundColor: isSelected ? resume.accent : "#cbd5e1" }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Next Step Nav Bar */}
      <div className="flex items-center justify-between border-t-2 border-ink/20 pt-4 bg-card p-3 border-2 border-ink">
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center gap-1 border border-ink bg-paper px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider hover:bg-line"
        >
          <Icon name="chev" size={12} className="rotate-90" />
          <span>Back: Education</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-1.5 border-2 border-ink bg-acid px-4 py-2 font-mono text-[11px] font-black uppercase tracking-wider text-ink shadow-[2px_2px_0_0_var(--color-ink)] hover:bg-acid-hover active:translate-x-[1px] active:translate-y-[1px]"
        >
          <span>Next: Review & Export</span>
          <Icon name="chev" size={12} className="-rotate-90" />
        </button>
      </div>
    </div>
  );
}
