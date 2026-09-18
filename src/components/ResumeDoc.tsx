import { useRef, useLayoutEffect, useEffect } from "react";
import type { ResumeData, ProjectEntry, VolunteerEntry } from "../lib/types";
import NordicTemplate from "./templates/NordicTemplate";
import CascadeTemplate from "./templates/CascadeTemplate";
import SummitTemplate from "./templates/SummitTemplate";
import OnyxTemplate from "./templates/OnyxTemplate";
import StellarTemplate from "./templates/StellarTemplate";
import StandardPage2 from "./templates/StandardPage2";
import { ResumePhoto } from "./ResumePhoto";
import { splitResumeData, getSectionProps, getItemProps, type ResumeSectionKey, type OnSelectSectionFn } from "./templates/types";

type TemplateVariant =
  | "atlas"
  | "craft"
  | "merit"
  | "ledger"
  | "bold"
  | "modern"
  | "classic"
  | "elegant"
  | "professional"
  | "minimal"
  | "creative"
  | "executive"
  | "academic"
  | "tech"
  | "corporate";

interface RenderProjectsProps {
  projects: ProjectEntry[];
  accent: string;
  variant: TemplateVariant;
}

interface RenderVolunteerProps {
  volunteer: VolunteerEntry[];
  accent: string;
  variant: TemplateVariant;
}

function RenderProjects({ projects, accent, variant }: RenderProjectsProps) {
  if (!projects || projects.length === 0) return null;

  if (variant === "craft") {
    return (
      <section
        data-section="projects"
        className="group/sec transition-colors hover:bg-pine/5 rounded p-1.5 -m-1.5"
      >
        <h2 className="font-display text-[15px] font-bold text-center">
          <span className="mx-auto block max-w-[170px] border-b-2 pb-1 text-center" style={{ borderColor: accent }}>
            Key Projects
          </span>
        </h2>
        <div className="mx-auto max-w-[600px] space-y-3 mt-2">
          {projects.map((p) => (
            <div key={p.id} data-section="projects" data-item-id={p.id} className="hover:bg-pine/10 p-1.5 rounded transition-colors">
              <div className="flex items-baseline justify-center gap-2">
                <p data-section="projects" data-subfield="title" data-item-id={p.id} className="text-[13px] font-bold hover:underline hover:decoration-pine">
                  {p.title}{p.subtitle && <span className="font-semibold text-neutral-600 ml-1.5" data-section="projects" data-subfield="subtitle" data-item-id={p.id}>· {p.subtitle}</span>}
                </p>
              </div>
              {p.date && <p data-section="projects" data-subfield="date" data-item-id={p.id} className="text-center font-mono text-[10px] text-neutral-500">{p.date}</p>}
              {p.bullets && p.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-1 list-disc pl-5 space-y-0.5 text-left">
                  {p.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} data-section="projects" data-subfield="bullets" data-item-id={p.id} className="text-[12px] leading-snug hover:underline hover:decoration-pine">{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (variant === "atlas") {
    return (
      <section
        data-section="projects"
        className="group/sec transition-colors hover:bg-pine/5 rounded p-1.5 -m-1.5"
      >
        <h2 className="font-mono text-[10.5px] font-bold uppercase tracking-[0.26em] border-b border-neutral-300 pb-1" style={{ color: accent }}>
          Projects &amp; Systems
        </h2>
        <div className="mt-2 space-y-2.5">
          {projects.map((p) => (
            <div key={p.id} data-section="projects" data-item-id={p.id} className="hover:bg-pine/10 p-1.5 rounded transition-colors">
              <div className="flex items-baseline justify-between gap-3">
                <p data-section="projects" data-subfield="title" data-item-id={p.id} className="text-[13px] font-bold text-neutral-900 hover:underline hover:decoration-pine">
                  {p.title}{p.subtitle && <span className="font-semibold text-neutral-600 ml-1.5" data-section="projects" data-subfield="subtitle" data-item-id={p.id}>· {p.subtitle}</span>}
                </p>
                {p.date && <p data-section="projects" data-subfield="date" data-item-id={p.id} className="shrink-0 font-mono text-[10px] text-neutral-500">{p.date}</p>}
              </div>
              {p.bullets && p.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-1 space-y-0.5">
                  {p.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} data-section="projects" data-subfield="bullets" data-item-id={p.id} className="flex gap-2 text-[12px] leading-snug hover:underline hover:decoration-pine">
                      <span className="mt-[6px] h-[3px] w-[3px] shrink-0 rounded-full" style={{ background: accent }} />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (variant === "bold") {
    return (
      <section data-section="projects">
        <h2 className="flex items-center gap-2 font-display text-sm font-black uppercase tracking-wider text-neutral-900">
          <span className="h-3.5 w-1.5" style={{ background: accent }} /> Key Projects &amp; Systems
        </h2>
        <div className="mt-2 space-y-2.5">
          {projects.map((p) => (
            <div key={p.id} data-section="projects" data-item-id={p.id}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[13px] font-bold text-neutral-900" data-section="projects" data-subfield="title" data-item-id={p.id}>
                  {p.title}{p.subtitle && <span className="font-bold ml-1.5" style={{ color: accent }} data-section="projects" data-subfield="subtitle" data-item-id={p.id}>— {p.subtitle}</span>}
                </p>
                {p.date && <span className="font-mono text-[10px] font-bold text-neutral-500" data-section="projects" data-subfield="date" data-item-id={p.id}>{p.date}</span>}
              </div>
              {p.bullets && p.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-1 space-y-0.5">
                  {p.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} className="flex gap-2 text-[12px] leading-snug text-neutral-700" data-section="projects" data-subfield="bullets" data-item-id={p.id}>
                      <span className="mt-[6px] h-1 w-1 shrink-0" style={{ background: accent }} /> {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (variant === "modern") {
    return (
      <section data-section="projects">
        <h2 className="border-l-4 pl-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em]" style={{ borderColor: accent, color: accent }}>Key Projects &amp; Systems</h2>
        <div className="mt-2 space-y-2.5">
          {projects.map((p) => (
            <div key={p.id} data-section="projects" data-item-id={p.id}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[13px] font-bold text-neutral-900" data-section="projects" data-subfield="title" data-item-id={p.id}>
                  {p.title}{p.subtitle && <span className="font-normal text-neutral-600 ml-1.5" data-section="projects" data-subfield="subtitle" data-item-id={p.id}>· {p.subtitle}</span>}
                </p>
                {p.date && <span className="font-mono text-[10px] text-neutral-500" data-section="projects" data-subfield="date" data-item-id={p.id}>{p.date}</span>}
              </div>
              {p.bullets && p.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-1 space-y-0.5">
                  {p.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} className="flex gap-2 text-[12px] leading-snug text-neutral-700" data-section="projects" data-subfield="bullets" data-item-id={p.id}>
                      <span className="mt-[6px] h-1 w-1 rounded-full shrink-0" style={{ background: accent }} /> {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (variant === "classic") {
    return (
      <section data-section="projects">
        <h2 className="border-b border-neutral-400 pb-0.5 text-[11.5px] font-bold uppercase tracking-[0.2em] text-neutral-900">Key Projects &amp; Deliverables</h2>
        <div className="mt-2 space-y-2.5">
          {projects.map((p) => (
            <div key={p.id} data-section="projects" data-item-id={p.id}>
              <div className="flex items-baseline justify-between">
                <p className="text-[13px] font-bold font-serif text-neutral-900" data-section="projects" data-subfield="title" data-item-id={p.id}>
                  {p.title}{p.subtitle && <span className="font-sans font-normal italic text-neutral-600 ml-1.5" data-section="projects" data-subfield="subtitle" data-item-id={p.id}>— {p.subtitle}</span>}
                </p>
                {p.date && <span className="italic text-[11px] text-neutral-600 font-serif" data-section="projects" data-subfield="date" data-item-id={p.id}>{p.date}</span>}
              </div>
              {p.bullets && p.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-1 list-disc pl-5 font-sans text-[12px] text-neutral-800 space-y-0.5">
                  {p.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} data-section="projects" data-subfield="bullets" data-item-id={p.id}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (variant === "elegant") {
    return (
      <section data-section="projects">
        <h2 className="font-serif text-[11px] font-normal uppercase tracking-[0.28em] text-neutral-500">Key Deliverables &amp; Systems</h2>
        <div className="mt-2 space-y-2.5">
          {projects.map((p) => (
            <div key={p.id} data-section="projects" data-item-id={p.id}>
              <div className="flex items-baseline justify-between">
                <p className="text-[12.5px] text-neutral-900" data-section="projects" data-subfield="title" data-item-id={p.id}>
                  <span className="font-medium">{p.title}</span>{p.subtitle && <span className="italic font-serif ml-1.5">— {p.subtitle}</span>}
                </p>
                {p.date && <span className="font-mono text-[9.5px] text-neutral-400" data-section="projects" data-subfield="date" data-item-id={p.id}>{p.date}</span>}
              </div>
              {p.bullets && p.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-1 space-y-0.5 text-[11.5px] text-neutral-700">
                  {p.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} className="flex gap-2" data-section="projects" data-subfield="bullets" data-item-id={p.id}>
                      <span className="mt-[6px] h-1 w-1 rounded-full shrink-0 opacity-40" style={{ background: accent }} /> {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (variant === "professional") {
    return (
      <section data-section="projects">
        <div className="inline-block px-2.5 py-0.5 text-white font-mono text-[10px] font-bold uppercase tracking-wider" style={{ background: accent }}>Key Projects &amp; Systems</div>
        <div className="mt-2 space-y-2.5">
          {projects.map((p) => (
            <div key={p.id} data-section="projects" data-item-id={p.id}>
              <div className="flex items-baseline justify-between gap-3 text-[12.5px]">
                <p className="font-bold text-neutral-900" data-section="projects" data-subfield="title" data-item-id={p.id}>
                  {p.title}{p.subtitle && <span className="font-normal text-neutral-600 ml-1.5" data-section="projects" data-subfield="subtitle" data-item-id={p.id}>— {p.subtitle}</span>}
                </p>
                {p.date && <span className="font-mono text-[10px] text-neutral-500" data-section="projects" data-subfield="date" data-item-id={p.id}>{p.date}</span>}
              </div>
              {p.bullets && p.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-1 space-y-0.5 text-[11.5px] text-neutral-700">
                  {p.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} className="flex gap-2" data-section="projects" data-subfield="bullets" data-item-id={p.id}>
                      <span className="mt-[5px] h-1.5 w-1.5 shrink-0" style={{ background: accent }} /> {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (variant === "minimal") {
    return (
      <section className="grid grid-cols-[100px_1fr] gap-4" data-section="projects">
        <span className="font-mono text-[10.5px] font-bold text-neutral-400">03 / PROJECTS</span>
        <div className="space-y-2">
          {projects.map((p) => (
            <div key={p.id} data-section="projects" data-item-id={p.id}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[12.5px] font-bold text-neutral-900" data-section="projects" data-subfield="title" data-item-id={p.id}>
                  {p.title}{p.subtitle && <span className="font-normal text-neutral-500 ml-1.5" data-section="projects" data-subfield="subtitle" data-item-id={p.id}>· {p.subtitle}</span>}
                </p>
                {p.date && <span className="font-mono text-[10px] text-neutral-400" data-section="projects" data-subfield="date" data-item-id={p.id}>{p.date}</span>}
              </div>
              {p.bullets && p.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-0.5 space-y-0.5 text-[11.5px] text-neutral-600">
                  {p.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} data-section="projects" data-subfield="bullets" data-item-id={p.id}>— {b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (variant === "creative") {
    return (
      <section data-section="projects">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
          <h2 className="font-display text-sm font-bold uppercase tracking-wider" style={{ color: accent }}>Key Projects &amp; Systems</h2>
        </div>
        <div className="mt-2 space-y-2.5">
          {projects.map((p) => (
            <div key={p.id} data-section="projects" data-item-id={p.id}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[13px] font-bold text-neutral-900" data-section="projects" data-subfield="title" data-item-id={p.id}>
                  {p.title}{p.subtitle && <span className="font-normal text-neutral-600 ml-1.5" data-section="projects" data-subfield="subtitle" data-item-id={p.id}>({p.subtitle})</span>}
                </p>
                {p.date && <span className="font-mono text-[10px] text-neutral-500" data-section="projects" data-subfield="date" data-item-id={p.id}>{p.date}</span>}
              </div>
              {p.bullets && p.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-1 space-y-0.5 text-[11.5px] text-neutral-700">
                  {p.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} data-section="projects" data-subfield="bullets" data-item-id={p.id}>• {b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (variant === "executive") {
    return (
      <section data-section="projects">
        <h2 className="border-b border-neutral-300 pb-1 font-serif text-sm font-bold uppercase tracking-wider text-neutral-900">Strategic Projects &amp; Initiatives</h2>
        <div className="mt-2 space-y-2.5">
          {projects.map((p) => (
            <div key={p.id} data-section="projects" data-item-id={p.id}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[13px] font-bold text-neutral-900 font-serif" data-section="projects" data-subfield="title" data-item-id={p.id}>
                  {p.title}{p.subtitle && <span className="font-sans font-normal text-neutral-600 ml-1.5" data-section="projects" data-subfield="subtitle" data-item-id={p.id}>— {p.subtitle}</span>}
                </p>
                {p.date && <span className="font-mono text-[10px] text-neutral-500" data-section="projects" data-subfield="date" data-item-id={p.id}>{p.date}</span>}
              </div>
              {p.bullets && p.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-1 space-y-0.5 text-[11.5px] text-neutral-700 font-sans">
                  {p.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} data-section="projects" data-subfield="bullets" data-item-id={p.id}>• {b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (variant === "academic") {
    return (
      <section data-section="projects">
        <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] border-b border-neutral-400 pb-0.5" style={{ color: accent }}>Key Projects &amp; Research</h2>
        <div className="mt-2 space-y-2.5">
          {projects.map((p) => (
            <div key={p.id} data-section="projects" data-item-id={p.id}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[13px] font-bold text-neutral-900" data-section="projects" data-subfield="title" data-item-id={p.id}>
                  {p.title}{p.subtitle && <span className="italic font-normal text-neutral-700 ml-1.5" data-section="projects" data-subfield="subtitle" data-item-id={p.id}>({p.subtitle})</span>}
                </p>
                {p.date && <span className="font-sans text-[10.5px] text-neutral-500" data-section="projects" data-subfield="date" data-item-id={p.id}>{p.date}</span>}
              </div>
              {p.bullets && p.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-1 list-disc pl-5 font-sans text-[11.5px] text-neutral-700 space-y-0.5">
                  {p.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} data-section="projects" data-subfield="bullets" data-item-id={p.id}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (variant === "tech") {
    return (
      <section data-section="projects">
        <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accent }}>{`// KEY PROJECTS & SYSTEMS`}</h2>
        <div className="mt-2 space-y-2.5">
          {projects.map((p) => (
            <div key={p.id} data-section="projects" data-item-id={p.id}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[12.5px] font-bold text-neutral-900" data-section="projects" data-subfield="title" data-item-id={p.id}>
                  {p.title}{p.subtitle && <span className="text-neutral-500 font-normal ml-1.5" data-section="projects" data-subfield="subtitle" data-item-id={p.id}>[{p.subtitle}]</span>}
                </p>
                {p.date && <span className="text-[10px] text-neutral-400" data-section="projects" data-subfield="date" data-item-id={p.id}>{p.date}</span>}
              </div>
              {p.bullets && p.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-1 space-y-0.5 text-[11.5px] text-neutral-700 font-sans">
                  {p.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} data-section="projects" data-subfield="bullets" data-item-id={p.id}>&gt; {b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (variant === "corporate") {
    return (
      <section data-section="projects">
        <h2 className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-neutral-800 border-b border-neutral-200 pb-1" style={{ color: accent }}>Key Projects &amp; Systems</h2>
        <div className="mt-2 space-y-2.5">
          {projects.map((p) => (
            <div key={p.id} data-section="projects" data-item-id={p.id}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[13px] font-bold text-neutral-900" data-section="projects" data-subfield="title" data-item-id={p.id}>
                  {p.title}{p.subtitle && <span className="font-semibold text-neutral-600 ml-1.5" data-section="projects" data-subfield="subtitle" data-item-id={p.id}>— {p.subtitle}</span>}
                </p>
                {p.date && <span className="font-mono text-[10px] text-neutral-500" data-section="projects" data-subfield="date" data-item-id={p.id}>{p.date}</span>}
              </div>
              {p.bullets && p.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-1 space-y-0.5 text-[11.5px] text-neutral-700">
                  {p.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} data-section="projects" data-subfield="bullets" data-item-id={p.id}>• {b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Default / Merit / Ledger
  return (
    <section
      data-section="projects"
      className="group/sec transition-colors hover:bg-pine/5 rounded p-1.5 -m-1.5"
    >
      <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: accent }}>
        Key Projects &amp; Systems
      </h2>
      <div className="mt-2 space-y-2.5">
        {projects.map((p) => (
          <div key={p.id} data-section="projects" data-item-id={p.id} className="hover:bg-pine/10 p-1.5 rounded transition-colors">
            <div className="flex items-baseline justify-between gap-3">
              <p data-section="projects" data-subfield="title" data-item-id={p.id} className="text-[13px] font-bold hover:underline hover:decoration-pine">
                {p.title}{p.subtitle && <span className="font-semibold text-neutral-600 ml-1.5" data-section="projects" data-subfield="subtitle" data-item-id={p.id}>· {p.subtitle}</span>}
              </p>
              {p.date && <p data-section="projects" data-subfield="date" data-item-id={p.id} className="shrink-0 font-mono text-[10px] text-neutral-500">{p.date}</p>}
            </div>
            {p.bullets && p.bullets.filter(Boolean).length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {p.bullets.filter(Boolean).map((b, i) => (
                  <li key={i} data-section="projects" data-subfield="bullets" data-item-id={p.id} className="flex gap-2 text-[12px] leading-snug hover:underline hover:decoration-pine">
                    <span className="mt-[6px] h-[3px] w-[3px] shrink-0 rounded-full" style={{ background: accent }} />
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function RenderVolunteer({ volunteer, accent, variant }: RenderVolunteerProps) {
  if (!volunteer || volunteer.length === 0) return null;

  if (variant === "craft") {
    return (
      <section
        data-section="extras"
        data-subfield="volunteer"
        className="group/sec transition-colors hover:bg-pine/5 rounded p-1.5 -m-1.5"
      >
        <h2 className="font-display text-[15px] font-bold text-center">
          <span className="mx-auto block max-w-[200px] border-b-2 pb-1 text-center" style={{ borderColor: accent }}>
            Volunteering
          </span>
        </h2>
        <div className="mx-auto max-w-[500px] space-y-1 mt-2 text-center text-[12px]">
          {volunteer.map((v) => (
            <p key={v.id} data-section="extras" data-subfield="volunteer" data-item-id={v.id} className="hover:underline hover:decoration-pine">
              <span className="font-bold">{v.role}</span> — {v.org} {v.year && <span className="font-mono text-[10px] text-neutral-500">({v.year})</span>}
            </p>
          ))}
        </div>
      </section>
    );
  }

  if (variant === "classic") {
    return (
      <section data-section="extras" data-subfield="volunteer">
        <h2 className="border-b border-neutral-400 pb-0.5 text-[11.5px] font-bold uppercase tracking-[0.2em] text-neutral-900">Volunteering &amp; Service</h2>
        <div className="mt-1.5 space-y-1 font-sans text-[12px] text-neutral-800">
          {volunteer.map((v) => (
            <p key={v.id} data-section="extras" data-subfield="volunteer" data-item-id={v.id}>
              <span className="font-bold">{v.role}</span> — {v.org} {v.year && <span className="italic text-neutral-600 font-serif">({v.year})</span>}
            </p>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      data-section="extras"
      data-subfield="volunteer"
      className="group/sec transition-colors hover:bg-pine/5 rounded p-1.5 -m-1.5"
    >
      <h2 className="font-mono text-[10.5px] font-bold uppercase tracking-[0.24em]" style={{ color: accent }}>
        Volunteering &amp; Leadership
      </h2>
      <div className="mt-1.5 space-y-1 text-[12px] text-neutral-700">
        {volunteer.map((v) => (
          <p key={v.id} data-section="extras" data-subfield="volunteer" data-item-id={v.id} className="hover:underline hover:decoration-pine">
            <span className="font-bold text-neutral-900">{v.role}</span> — {v.org} {v.year && <span className="font-mono text-[10px] text-neutral-500">({v.year})</span>}
          </p>
        ))}
      </div>
    </section>
  );
}

/**
 * Renders the resume as a 794×1123 A4 sheet in one of twenty distinct templates:
 * 1. merit: Recruiter-proof standard, clean mono section labels, scannable bullets.
 * 2. ledger: Visual dual-column with solid accent sidebar.
 * 3. atlas: Compact modern sheet with an accent bar on top and dot-separated skills.
 * 4. craft: Centered serif header with academic elegance.
 * 5. modern: Sleek contemporary layout with tinted header card and skill pill badges.
 * 6. classic: Traditional timeless standard with double hairline borders and serif headings.
 * 7. elegant: Refined luxury editorial style with wide letter-spacing and delicate accents.
 * 8. professional: Authoritative corporate layout with solid accent section badges.
 * 9. minimal: Scandinavian minimalist layout with numbered section markers.
 * 10. bold: High-impact layout with full-width accent banner header.
 * 11. creative: Asymmetric modern layout with timeline nodes and accent skill chips.
 * 12. executive: C-suite layout with monogram header and boxed executive summary.
 * 13. academic: Traditional CV curriculum vitae format with research & credential priority.
 * 14. tech: Developer-focused layout with monospace code-inspired syntax and tags.
 * 15. corporate: Enterprise Fortune 500 format with structured metadata and grid alignment.
 * 16. nordic: Minimalist Scandinavian high-contrast typography and subtle borders.
 * 17. cascade: Dynamic tiered modern layout with cascading accent markers.
 * 18. summit: Executive leadership with high-impact dossier header and strategy grids.
 * 19. onyx: Dark top accent bar, monospace technical tags, and sharp architectural grids.
 * 20. stellar: Dual-tone layout with left telemetry sidebar and narrative experience column.
 */
/**
 * Universal DOM Annotator:
 * Inspects the rendered DOM of any of the 20 templates and assigns
 * data-section, data-subfield, data-item-id, data-bullet-text, and data-bullet-index
 * so all templates get the exact same hover cues, dashed borders, and click focus as Merit.
 */
function annotateResumeDocument(container: HTMLElement, data: ResumeData) {
  if (!container) return;

  const c = data.contact || ({} as any);
  const xp = data.experience || [];
  const edu = data.education || [];
  const projects = data.projects || [];
  const skills = data.skills || [];

  // 1. Tag Header / Contact Info
  const h1 = container.querySelector("h1");
  if (h1) {
    h1.setAttribute("data-section", "contact");
    h1.setAttribute("data-subfield", "fullName");
    const headerParent = h1.closest("header, aside, .resume-sheet > div:first-child") || h1.parentElement;
    if (headerParent && !headerParent.getAttribute("data-section")) {
      headerParent.setAttribute("data-section", "contact");
    }
  }

  // Tag candidate title, email, phone, location, website, linkedin
  const textElements = container.querySelectorAll("h1, h2, h3, h4, p, span, a, li");
  textElements.forEach((node) => {
    const el = node as HTMLElement;
    const raw = (el.innerText || el.textContent || "").trim();
    if (!raw) return;
    const lower = raw.toLowerCase();

    if (c.title && !el.getAttribute("data-subfield") && (raw === c.title || lower === c.title.toLowerCase())) {
      el.setAttribute("data-section", "contact");
      el.setAttribute("data-subfield", "title");
    } else if (c.email && !el.getAttribute("data-subfield") && (raw === c.email || lower === c.email.toLowerCase() || (lower.includes("@") && lower.includes(".")))) {
      el.setAttribute("data-section", "contact");
      el.setAttribute("data-subfield", "email");
    } else if (c.phone && !el.getAttribute("data-subfield") && (raw === c.phone || (c.phone.length > 5 && raw.includes(c.phone)))) {
      el.setAttribute("data-section", "contact");
      el.setAttribute("data-subfield", "phone");
    } else if (c.linkedin && !el.getAttribute("data-subfield") && (raw === c.linkedin || lower.includes("linkedin.com") || (c.linkedin.length > 5 && lower.includes(c.linkedin.toLowerCase())))) {
      el.setAttribute("data-section", "contact");
      el.setAttribute("data-subfield", "linkedin");
    } else if (c.website && !el.getAttribute("data-subfield") && (raw === c.website || lower.includes("http") || lower.includes(".com") || (c.website.length > 5 && lower.includes(c.website.toLowerCase())))) {
      el.setAttribute("data-section", "contact");
      el.setAttribute("data-subfield", "website");
    } else if (c.location && !el.getAttribute("data-subfield") && (raw === c.location || (c.location.length > 3 && raw.includes(c.location) && el.closest("header, aside, [data-section='contact']")))) {
      el.setAttribute("data-section", "contact");
      el.setAttribute("data-subfield", "location");
    }
  });

  // 2. Tag Sections by Headings
  const blocks = container.querySelectorAll("section, aside, header, div");
  blocks.forEach((block) => {
    const el = block as HTMLElement;
    const heading = el.querySelector("h2, h3, h4, [class*='font-bold'], [class*='tracking-']") as HTMLElement | null;
    if (!heading) return;
    const hText = (heading.innerText || heading.textContent || "").toLowerCase().trim();

    if (hText.includes("summary") || hText.includes("profile") || hText.includes("statement") || hText.includes("about")) {
      if (!el.getAttribute("data-section")) el.setAttribute("data-section", "summary");
      el.querySelectorAll("p").forEach((p) => {
        p.setAttribute("data-section", "summary");
        p.setAttribute("data-subfield", "summary");
      });
    } else if (hText.includes("experience") || hText.includes("work") || hText.includes("employment") || hText.includes("career") || hText.includes("history")) {
      if (!el.getAttribute("data-section")) el.setAttribute("data-section", "experience");
    } else if (hText.includes("education") || hText.includes("academic") || hText.includes("studies")) {
      if (!el.getAttribute("data-section")) el.setAttribute("data-section", "education");
    } else if (hText.includes("skill") || hText.includes("technolog") || hText.includes("competenc") || hText.includes("proficienc")) {
      if (!el.getAttribute("data-section")) el.setAttribute("data-section", "skills");
      el.querySelectorAll("span, li, p, div").forEach((skNode) => {
        const skTxt = (skNode.textContent || "").trim();
        if (skTxt && skills.some((s) => s && (skTxt === s || skTxt.includes(s)))) {
          skNode.setAttribute("data-section", "skills");
          skNode.setAttribute("data-subfield", "skills");
        }
      });
    } else if (hText.includes("project") || hText.includes("deliverable") || hText.includes("initiative")) {
      if (!el.getAttribute("data-section")) el.setAttribute("data-section", "projects");
    } else if (hText.includes("certif")) {
      if (!el.getAttribute("data-section")) el.setAttribute("data-section", "extras");
      el.querySelectorAll("li, p, span").forEach((cNode) => {
        cNode.setAttribute("data-section", "extras");
        cNode.setAttribute("data-subfield", "certifications");
      });
    } else if (hText.includes("languag")) {
      if (!el.getAttribute("data-section")) el.setAttribute("data-section", "extras");
      el.querySelectorAll("li, p, span").forEach((lNode) => {
        lNode.setAttribute("data-section", "extras");
        lNode.setAttribute("data-subfield", "languages");
      });
    } else if (hText.includes("volunteer") || hText.includes("community")) {
      if (!el.getAttribute("data-section")) el.setAttribute("data-section", "extras");
      el.querySelectorAll("li, p, span").forEach((vNode) => {
        vNode.setAttribute("data-section", "extras");
        vNode.setAttribute("data-subfield", "volunteer");
      });
    }
  });

  // 3. Experience Items & Individual Bullets
  const xpContainers = container.querySelectorAll("[data-section='experience']");
  xpContainers.forEach((xpSec) => {
    xp.forEach((e) => {
      // Look for role or company inside
      const candidates = xpSec.querySelectorAll("div, article, p, h3, h4");
      for (let i = 0; i < candidates.length; i++) {
        const cand = candidates[i] as HTMLElement;
        const txt = (cand.innerText || cand.textContent || "").toLowerCase();
        const roleMatch = e.role && (txt.includes(e.role.toLowerCase()) || e.role.toLowerCase().includes(txt));
        const compMatch = e.company && (txt.includes(e.company.toLowerCase()) || e.company.toLowerCase().includes(txt));

        if (roleMatch || compMatch) {
          const entry = cand.closest("div[class*='border'], div.group, div.space-y, div.p-, div:not([data-section='experience'])") as HTMLElement || cand;
          if (entry && entry !== xpSec) {
            entry.setAttribute("data-section", "experience");
            entry.setAttribute("data-item-id", e.id);
          }
          if (roleMatch) {
            cand.setAttribute("data-section", "experience");
            cand.setAttribute("data-subfield", "role");
            cand.setAttribute("data-item-id", e.id);
          }
          if (compMatch) {
            cand.setAttribute("data-section", "experience");
            cand.setAttribute("data-subfield", "company");
            cand.setAttribute("data-item-id", e.id);
          }
        }
      }

      // Explicitly tag every bullet in this job's entry
      const entryEl = xpSec.querySelector(`[data-item-id='${e.id}']`);
      if (entryEl) {
        const lis = entryEl.querySelectorAll("li");
        lis.forEach((li, idx) => {
          li.setAttribute("data-section", "experience");
          li.setAttribute("data-subfield", "bullets");
          li.setAttribute("data-item-id", e.id);
          li.setAttribute("data-bullet-index", String(idx));
          const bulletClean = (li.innerText || li.textContent || "").replace(/^[\s•\->\*\–·]+/, "").trim();
          if (bulletClean) {
            li.setAttribute("data-bullet-text", bulletClean);
          }
        });
      }
    });
  });

  // 4. Education Items
  const eduContainers = container.querySelectorAll("[data-section='education']");
  eduContainers.forEach((eduSec) => {
    edu.forEach((ed) => {
      const candidates = eduSec.querySelectorAll("div, p, span, h4");
      for (let i = 0; i < candidates.length; i++) {
        const cand = candidates[i] as HTMLElement;
        const txt = (cand.innerText || cand.textContent || "").toLowerCase();
        const degMatch = ed.degree && txt.includes(ed.degree.toLowerCase());
        const schMatch = ed.school && txt.includes(ed.school.toLowerCase());
        if (degMatch || schMatch) {
          const entry = cand.closest("div:not([data-section='education'])") as HTMLElement || cand;
          if (entry && entry !== eduSec) {
            entry.setAttribute("data-section", "education");
            entry.setAttribute("data-item-id", ed.id);
          }
          if (degMatch) {
            cand.setAttribute("data-section", "education");
            cand.setAttribute("data-subfield", "degree");
            cand.setAttribute("data-item-id", ed.id);
          }
          if (schMatch) {
            cand.setAttribute("data-section", "education");
            cand.setAttribute("data-subfield", "school");
            cand.setAttribute("data-item-id", ed.id);
          }
        }
      }
    });
  });

  // 5. Projects Items & Bullets
  const projContainers = container.querySelectorAll("[data-section='projects']");
  projContainers.forEach((projSec) => {
    projects.forEach((p) => {
      const candidates = projSec.querySelectorAll("div, p, h3, h4");
      for (let i = 0; i < candidates.length; i++) {
        const cand = candidates[i] as HTMLElement;
        const txt = (cand.innerText || cand.textContent || "").toLowerCase();
        if (p.title && txt.includes(p.title.toLowerCase())) {
          const entry = cand.closest("div:not([data-section='projects'])") as HTMLElement || cand;
          if (entry && entry !== projSec) {
            entry.setAttribute("data-section", "projects");
            entry.setAttribute("data-item-id", p.id);
          }
          cand.setAttribute("data-section", "projects");
          cand.setAttribute("data-subfield", "title");
          cand.setAttribute("data-item-id", p.id);
        }
      }
      const entryEl = projSec.querySelector(`[data-item-id='${p.id}']`);
      if (entryEl) {
        const lis = entryEl.querySelectorAll("li");
        lis.forEach((li, idx) => {
          li.setAttribute("data-section", "projects");
          li.setAttribute("data-subfield", "bullets");
          li.setAttribute("data-item-id", p.id);
          li.setAttribute("data-bullet-index", String(idx));
          const bulletClean = (li.innerText || li.textContent || "").replace(/^[\s•\->\*\–·]+/, "").trim();
          if (bulletClean) {
            li.setAttribute("data-bullet-text", bulletClean);
          }
        });
      }
    });
  });

  // 6. Universal Bullet / LI Safeguard
  const allLis = container.querySelectorAll("li");
  allLis.forEach((li) => {
    if (!li.getAttribute("data-subfield")) {
      li.setAttribute("data-subfield", "bullets");
      const parentSec = li.closest("[data-section]") as HTMLElement | null;
      if (parentSec) {
        li.setAttribute("data-section", parentSec.getAttribute("data-section") || "experience");
      } else {
        li.setAttribute("data-section", "experience");
      }
      const parentItem = li.closest("[data-item-id]") as HTMLElement | null;
      if (parentItem) {
        li.setAttribute("data-item-id", parentItem.getAttribute("data-item-id") || "");
      }
      const bulletClean = (li.innerText || li.textContent || "").replace(/^[\s•\->\*\–·]+/, "").trim();
      if (bulletClean) {
        li.setAttribute("data-bullet-text", bulletClean);
      }
    }
  });
}

export default function ResumeDoc({
  data,
  pageNumber,
  onSelectSection,
}: {
  data: ResumeData;
  pageNumber?: 1 | 2;
  onSelectSection?: OnSelectSectionFn;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      annotateResumeDocument(containerRef.current, data);
    }
  });

  useEffect(() => {
    if (containerRef.current) {
      annotateResumeDocument(containerRef.current, data);
    }
  }, [data, pageNumber]);

  const {
    isTwoPage,
    xpPage1,
    eduPage1,
    projectsPage1,
    certsPage1,
    languagesPage1,
    volunteerPage1,
    contact: c,
    accent
  } = splitResumeData(data);

  const rawXp = data.experience.filter((e) => e.role || e.company);
  const xp = isTwoPage ? xpPage1 : rawXp;
  const rawEdu = data.education.filter((e) => e.degree || e.school);
  const edu = isTwoPage ? eduPage1 : rawEdu;
  const rawProjects = data.projects?.filter((p) => p.title) || [];
  const projects = isTwoPage ? projectsPage1 : rawProjects;
  const rawCerts = data.certifications || [];
  const certs = isTwoPage ? certsPage1 : rawCerts;
  const rawLangs = data.languages || [];
  const languages = isTwoPage ? languagesPage1 : rawLangs;
  const rawVol = data.volunteer?.filter((v) => v.role || v.org) || [];
  const volunteer = isTwoPage ? volunteerPage1 : rawVol;
  const contactLine = [c.email, c.phone, c.location, c.website, c.linkedin].filter(Boolean);

  const handleUniversalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSelectSection) return;

    // Do not trigger if user is actively highlighting/selecting text (e.g. copying text with cursor)
    const sel = window.getSelection();
    if (sel && sel.toString().trim().length > 0) return;

    const target = e.target as HTMLElement;
    if (!target) return;

    // Extract bullet text and index if clicked element is an li or inside an li
    const liEl = target.closest("li");
    let bulletText: string | undefined = undefined;
    let bulletIndex: number | undefined = undefined;
    if (liEl) {
      bulletText = liEl.getAttribute("data-bullet-text") || (liEl.innerText || liEl.textContent || "").trim();
      const bIdxAttr = liEl.getAttribute("data-bullet-index");
      if (bIdxAttr) {
        bulletIndex = parseInt(bIdxAttr, 10);
      } else if (liEl.parentElement) {
        const lis = Array.from(liEl.parentElement.querySelectorAll("li"));
        const idx = lis.indexOf(liEl);
        if (idx !== -1) bulletIndex = idx;
      }
    }

    // 1. Direct explicit data-attribute matching (from getItemProps or getSectionProps)
    const subEl = target.closest("[data-subfield]") as HTMLElement | null;
    const itemEl = target.closest("[data-item-id]") as HTMLElement | null;
    const secEl = target.closest("[data-section]") as HTMLElement | null;

    let s = (secEl?.getAttribute("data-section") || subEl?.getAttribute("data-section") || itemEl?.getAttribute("data-section")) as ResumeSectionKey | undefined;
    let sub = subEl?.getAttribute("data-subfield") || itemEl?.getAttribute("data-subfield") || target.getAttribute("data-subfield") || undefined;
    let item = itemEl?.getAttribute("data-item-id") || subEl?.getAttribute("data-item-id") || target.getAttribute("data-item-id") || undefined;

    if (s) {
      const rawText = (target.innerText || target.textContent || "").trim();
      const text = rawText.toLowerCase();

      // Deep resolve experience item and subfield if missing
      if (s === "experience") {
        if (!item) {
          const matchedXp = (data.experience || []).find((x) =>
            (x.company && (text.includes(x.company.toLowerCase()) || x.company.toLowerCase().includes(text))) ||
            (x.role && (text.includes(x.role.toLowerCase()) || x.role.toLowerCase().includes(text))) ||
            x.bullets.some((b) => b && (text.includes(b.slice(0, 15).toLowerCase()) || b.toLowerCase().includes(text.slice(0, 15))))
          );
          if (matchedXp) item = matchedXp.id;
        }
        if (!sub) {
          if (liEl || target.tagName === "LI" || !!target.closest("li")) {
            sub = "bullets";
          } else if (target.tagName === "H3" || target.tagName === "H4" || (target.tagName === "P" && !text.includes("–") && !text.includes("-") && !text.includes("present"))) {
            sub = "role";
          } else if (text.includes("–") || text.includes("-") || text.includes("present") || text.includes("20")) {
            sub = "start";
          } else {
            sub = "company";
          }
        }
      } else if (s === "education") {
        if (!item) {
          const matchedEdu = (data.education || []).find((ed) =>
            (ed.school && (text.includes(ed.school.toLowerCase()) || ed.school.toLowerCase().includes(text))) ||
            (ed.degree && (text.includes(ed.degree.toLowerCase()) || ed.degree.toLowerCase().includes(text)))
          );
          if (matchedEdu) item = matchedEdu.id;
        }
        if (!sub) {
          if (text.includes("bachelor") || text.includes("master") || text.includes("b.s") || text.includes("m.s") || text.includes("degree")) {
            sub = "degree";
          } else if (text.includes("20") || text.includes("19")) {
            sub = "year";
          } else {
            sub = "school";
          }
        }
      } else if (s === "projects") {
        if (!item) {
          const matchedP = (data.projects || []).find((p) =>
            p.title && (text.includes(p.title.toLowerCase()) || p.title.toLowerCase().includes(text))
          );
          if (matchedP) item = matchedP.id;
        }
        if (!sub) {
          if (liEl || target.tagName === "LI" || !!target.closest("li")) {
            sub = "bullets";
          } else {
            sub = "title";
          }
        }
      }

      e.stopPropagation();
      onSelectSection(s, sub, item, bulletText, bulletIndex);
      return;
    }

    // 2. Intelligent deep content heuristic matching (works across all 20 templates without data attributes)
    const rawText = (target.innerText || target.textContent || "").trim();
    const text = rawText.toLowerCase();

    // Look at the containing semantic block
    const secContainer = target.closest("section, aside, header") as HTMLElement | null;
    const headingText = (secContainer?.querySelector("h1, h2, h3, h4")?.textContent || "").toLowerCase();
    const containerText = ((secContainer?.textContent || "") + " " + headingText).toLowerCase();

    // A. Languages
    if (
      headingText.includes("language") ||
      containerText.includes("language") ||
      text.includes("native") ||
      text.includes("fluent") ||
      text.includes("bilingual") ||
      text.includes("c1") ||
      text.includes("c2") ||
      (data.languages || []).some((l) => l && (text.includes(l.toLowerCase()) || l.toLowerCase().includes(text)))
    ) {
      e.stopPropagation();
      onSelectSection("extras", "languages");
      return;
    }

    // B. Certifications
    if (
      headingText.includes("cert") ||
      containerText.includes("cert") ||
      text.includes("certified") ||
      text.includes("aws") ||
      text.includes("cka") ||
      text.includes("pmp") ||
      (data.certifications || []).some((c) => c && (text.includes(c.toLowerCase()) || c.toLowerCase().includes(text)))
    ) {
      e.stopPropagation();
      onSelectSection("extras", "certifications");
      return;
    }

    // C. Volunteer
    if (
      headingText.includes("volunteer") ||
      containerText.includes("volunteer") ||
      (data.volunteer || []).some((v) => (v.org && text.includes(v.org.toLowerCase())) || (v.role && text.includes(v.role.toLowerCase())))
    ) {
      e.stopPropagation();
      const matchedV = (data.volunteer || []).find((v) => (v.org && text.includes(v.org.toLowerCase())) || (v.role && text.includes(v.role.toLowerCase())));
      onSelectSection("extras", "volunteer", matchedV?.id);
      return;
    }

    // D. Projects / Key Deliverables
    if (
      headingText.includes("project") ||
      headingText.includes("deliverable") ||
      headingText.includes("system") ||
      (data.projects || []).some((p) => p.title && (text.includes(p.title.toLowerCase()) || p.title.toLowerCase().includes(text)))
    ) {
      e.stopPropagation();
      const matchedP = (data.projects || []).find((p) => p.title && (text.includes(p.title.toLowerCase()) || p.title.toLowerCase().includes(text)));
      const isBullet = !!liEl;
      onSelectSection("projects", isBullet ? "bullets" : "title", matchedP?.id, bulletText, bulletIndex);
      return;
    }

    // E. Skills & Proficiencies
    if (
      headingText.includes("skill") ||
      headingText.includes("technologies") ||
      headingText.includes("expertise") ||
      headingText.includes("proficienc") ||
      headingText.includes("competenc") ||
      (data.skills || []).some((sk) => sk && (text.includes(sk.toLowerCase()) || sk.toLowerCase().includes(text)))
    ) {
      e.stopPropagation();
      onSelectSection("skills", "skills");
      return;
    }

    // F. Education
    if (
      headingText.includes("education") ||
      headingText.includes("academic") ||
      text.includes("bachelor") ||
      text.includes("master") ||
      text.includes("ph.d") ||
      text.includes("degree") ||
      text.includes("university") ||
      text.includes("college") ||
      (data.education || []).some((ed) =>
        (ed.school && text.includes(ed.school.toLowerCase())) ||
        (ed.degree && text.includes(ed.degree.toLowerCase()))
      )
    ) {
      e.stopPropagation();
      const matchedEdu = (data.education || []).find((ed) =>
        (ed.school && text.includes(ed.school.toLowerCase())) ||
        (ed.degree && text.includes(ed.degree.toLowerCase()))
      );
      const isDegree = text.includes("bachelor") || text.includes("master") || text.includes("degree") || text.includes("b.s") || text.includes("m.s");
      const isYear = text.includes("20") || text.includes("19");
      const eduSub = isDegree ? "degree" : isYear ? "year" : "school";
      onSelectSection("education", eduSub, matchedEdu?.id || data.education[0]?.id);
      return;
    }

    // G. Experience & Career History
    if (
      headingText.includes("experience") ||
      headingText.includes("work") ||
      headingText.includes("career") ||
      headingText.includes("employment") ||
      headingText.includes("history") ||
      liEl ||
      (data.experience || []).some((x) =>
        (x.company && text.includes(x.company.toLowerCase())) ||
        (x.role && text.includes(x.role.toLowerCase())) ||
        x.bullets.some((b) => b && (text.includes(b.slice(0, 15).toLowerCase()) || b.toLowerCase().includes(text.slice(0, 15))))
      )
    ) {
      e.stopPropagation();
      const matchedXp = (data.experience || []).find((x) =>
        (x.company && text.includes(x.company.toLowerCase())) ||
        (x.role && text.includes(x.role.toLowerCase())) ||
        x.bullets.some((b) => b && (text.includes(b.slice(0, 15).toLowerCase()) || b.toLowerCase().includes(text.slice(0, 15))))
      );
      const isBullet = !!liEl || target.tagName === "LI" || !!target.closest("li");
      onSelectSection("experience", isBullet ? "bullets" : "role", matchedXp?.id || data.experience[0]?.id, bulletText, bulletIndex);
      return;
    }

    // H. Summary / Profile / Statement
    if (
      headingText.includes("summary") ||
      headingText.includes("profile") ||
      headingText.includes("statement") ||
      headingText.includes("about") ||
      (data.summary && (text.includes(data.summary.slice(0, 20).toLowerCase()) || data.summary.toLowerCase().includes(text.slice(0, 20))))
    ) {
      e.stopPropagation();
      onSelectSection("summary", "summary");
      return;
    }

    // I. Contact & Header info
    if (
      secContainer?.tagName === "HEADER" ||
      secContainer?.tagName === "ASIDE" ||
      text.includes("@") ||
      text.includes("http") ||
      text.includes("linkedin") ||
      text.match(/\+?\d[\d\s\-().]{7,}/) ||
      (c.fullName && text.includes(c.fullName.toLowerCase())) ||
      (c.title && text.includes(c.title.toLowerCase())) ||
      (c.email && text.includes(c.email.toLowerCase())) ||
      (c.phone && text.includes(c.phone.toLowerCase())) ||
      (c.location && text.includes(c.location.toLowerCase()))
    ) {
      e.stopPropagation();
      let sub = "fullName";
      if (text.includes("@") || (c.email && text.includes(c.email.toLowerCase()))) sub = "email";
      else if (text.match(/\+?\d[\d\s\-().]{7,}/) || (c.phone && text.includes(c.phone.toLowerCase()))) sub = "phone";
      else if (c.location && text.includes(c.location.toLowerCase())) sub = "location";
      else if (c.title && text.includes(c.title.toLowerCase())) sub = "title";
      else if (text.includes("linkedin") || (c.linkedin && text.includes(c.linkedin.toLowerCase()))) sub = "linkedin";
      else if (text.includes("http") || text.includes(".com") || (c.website && text.includes(c.website.toLowerCase()))) sub = "website";
      onSelectSection("contact", sub);
      return;
    }

    // Default fallback to contact
    onSelectSection("contact", "fullName");
  };

  const renderDocumentContent = () => {
    // Specialized 5-template engine dispatch
    if (data.template === "nordic") return <NordicTemplate data={data} pageNumber={pageNumber} onSelectSection={onSelectSection} />;
    if (data.template === "cascade") return <CascadeTemplate data={data} pageNumber={pageNumber} onSelectSection={onSelectSection} />;
    if (data.template === "summit") return <SummitTemplate data={data} pageNumber={pageNumber} onSelectSection={onSelectSection} />;
    if (data.template === "onyx") return <OnyxTemplate data={data} pageNumber={pageNumber} onSelectSection={onSelectSection} />;
    if (data.template === "stellar") return <StellarTemplate data={data} pageNumber={pageNumber} onSelectSection={onSelectSection} />;
  const renderWithPage2 = (page1Content: React.ReactNode) => {
    return <>{page1Content}</>;
  };

  // =========================================================================
  // 1. LEDGER: Visual Two-Column Sidebar
  // =========================================================================
  if (data.template === "ledger") {
    return renderWithPage2(
      <div className="resume-sheet flex">
        <aside className="w-[240px] shrink-0 px-6 py-8 text-white" style={{ background: accent }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-80">Curriculum Vitae</p>
          <h1 className="mt-1.5 font-display text-3xl font-black leading-tight">{c.fullName || "Your Name"}</h1>
          <p className="mt-1 text-sm font-semibold opacity-90">{c.title}</p>
          <div className="mt-5 space-y-1.5 text-[11px] leading-relaxed opacity-95">
            {contactLine.map((s, i) => <p key={i} className="break-words">{s}</p>)}
          </div>
          {data.skills.length > 0 && (
            <>
              <h2 className="mt-5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] opacity-80">Skills</h2>
              <ul className="mt-2 space-y-1 text-[11.5px]">{data.skills.filter(Boolean).map((s, i) => <li key={i} className="flex gap-2"><span className="mt-[7px] h-1 w-1 shrink-0 bg-white/80" />{s}</li>)}</ul>
            </>
          )}
          {edu.length > 0 && (
            <>
              <h2 className="mt-5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] opacity-80">Education</h2>
              <div className="mt-2 space-y-2 text-[11.5px]">
                {edu.map((e) => <div key={e.id}><p className="font-bold">{e.degree}</p><p className="opacity-85">{e.school} {e.year}</p></div>)}
              </div>
            </>
          )}
          {certs.length > 0 && (
            <>
              <h2 className="mt-5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] opacity-80">Certifications</h2>
              <ul className="mt-2 space-y-1 text-[11px] leading-relaxed">{certs.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </>
          )}
          {languages.length > 0 && (
            <>
              <h2 className="mt-5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] opacity-80">Languages</h2>
              <p className="mt-1.5 text-[11px] leading-relaxed opacity-90">{languages.join(", ")}</p>
            </>
          )}
          <RenderVolunteer volunteer={volunteer} accent={accent} variant="ledger" />
        </aside>
        <div className="flex-1 px-8 py-8">
          {data.summary && (<section><h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: accent }}>Profile</h2><p className="mt-1.5 text-[12.5px] leading-relaxed text-neutral-800">{data.summary}</p></section>)}
          <section className="mt-5">
            <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: accent }}>Experience</h2>
            <div className="mt-2.5 space-y-3.5">
              {xp.map((e) => (
                <div key={e.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-[13.5px] font-bold">{e.role} <span className="font-semibold" style={{ color: accent }}>· {e.company}</span></p>
                    <p className="shrink-0 font-mono text-[10px] text-neutral-500">{e.start} – {e.end}</p>
                  </div>
                  {e.location && <p className="text-[11px] text-neutral-500">{e.location}</p>}
                  <ul className="mt-1 space-y-1">
                    {e.bullets.filter(Boolean).map((b, i) => <li key={i} className="flex gap-2 text-[12.5px] leading-snug"><span className="mt-[7px] h-[3px] w-[3px] shrink-0" style={{ background: accent }} />{b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
          <RenderProjects projects={projects} accent={accent} variant="ledger" />
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. BOLD: Full-Width Accent Header Banner
  // =========================================================================
  if (data.template === "bold") {
    return renderWithPage2(
      <div className="resume-sheet flex flex-col">
        <header className="px-9 py-6 text-white" style={{ background: accent }}>
          <h1 className="font-display text-3xl font-black tracking-tight">{c.fullName || "Your Name"}</h1>
          {c.title && <p className="mt-1.5 inline-block bg-white/20 px-2.5 py-0.5 font-mono text-xs font-bold uppercase tracking-wider text-white backdrop-blur-xs">{c.title}</p>}
          <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 text-[11.5px] font-medium opacity-90">
            {contactLine.map((s, i) => <span key={i}>{s}</span>)}
          </div>
        </header>

        <div className="flex-1 px-9 py-6 space-y-4">
          {data.summary && (
            <section>
              <h2 className="flex items-center gap-2 font-display text-sm font-black uppercase tracking-wider text-neutral-900">
                <span className="h-3.5 w-1.5" style={{ background: accent }} /> Professional Summary
              </h2>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-neutral-800">{data.summary}</p>
            </section>
          )}

          {xp.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 font-display text-sm font-black uppercase tracking-wider text-neutral-900">
                <span className="h-3.5 w-1.5" style={{ background: accent }} /> Experience
              </h2>
              <div className="mt-2.5 space-y-3.5">
                {xp.map((e) => (
                  <div key={e.id} className="border-l-2 pl-3.5" style={{ borderColor: `${accent}40` }}>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-[13.5px] font-bold text-neutral-900">{e.role} <span className="font-bold" style={{ color: accent }}>— {e.company}</span></p>
                      <span className="font-mono text-[10px] font-bold text-neutral-500">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                    </div>
                    {e.location && <p className="text-[11px] text-neutral-500">{e.location}</p>}
                    <ul className="mt-1 space-y-1">
                      {e.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} className="flex gap-2 text-[12.5px] leading-snug text-neutral-700">
                          <span className="mt-[6px] h-1 w-1 shrink-0" style={{ background: accent }} /> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          <RenderProjects projects={projects} accent={accent} variant="bold" />

          {edu.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 font-display text-sm font-black uppercase tracking-wider text-neutral-900">
                <span className="h-3.5 w-1.5" style={{ background: accent }} /> Education
              </h2>
              <div className="mt-2 space-y-1.5">
                {edu.map((e) => (
                  <div key={e.id} className="flex items-baseline justify-between gap-3 text-[12.5px]">
                    <p><span className="font-bold">{e.degree}</span> — {e.school}{e.location && `, ${e.location}`}</p>
                    <span className="font-mono text-[10px] font-semibold text-neutral-500">{e.year}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.skills.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 font-display text-sm font-black uppercase tracking-wider text-neutral-900">
                <span className="h-3.5 w-1.5" style={{ background: accent }} /> Skills &amp; Proficiencies
              </h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {data.skills.filter(Boolean).map((s, i) => (
                  <span key={i} className="border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-800">{s}</span>
                ))}
              </div>
            </section>
          )}

          {(certs.length > 0 || languages.length > 0) && (
            <div className="grid grid-cols-2 gap-4">
              {certs.length > 0 && (
                <section>
                  <h2 className="font-display text-xs font-black uppercase tracking-wider text-neutral-900">Certifications</h2>
                  <ul className="mt-1.5 space-y-0.5 text-[11.5px] text-neutral-700">{certs.map((s, i) => <li key={i}>• {s}</li>)}</ul>
                </section>
              )}
              {languages.length > 0 && (
                <section>
                  <h2 className="font-display text-xs font-black uppercase tracking-wider text-neutral-900">Languages</h2>
                  <p className="mt-1.5 text-[11.5px] text-neutral-700">{languages.join(", ")}</p>
                </section>
              )}
            </div>
          )}

          <RenderVolunteer volunteer={volunteer} accent={accent} variant="bold" />
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. MODERN: Contemporary Card Header + Pill Badges
  // =========================================================================
  if (data.template === "modern") {
    return renderWithPage2(
      <div className="resume-sheet px-11 py-9">
        <header className="rounded-lg p-4" style={{ background: `${accent}10`, border: `1px solid ${accent}30` }}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-black tracking-tight text-neutral-900">{c.fullName || "Your Name"}</h1>
              {c.title && <p className="mt-1 font-semibold text-[14px]" style={{ color: accent }}>{c.title}</p>}
            </div>
            <div className="flex flex-col text-right text-[11px] text-neutral-600 space-y-0.5">
              {contactLine.map((s, i) => <span key={i}>{s}</span>)}
            </div>
          </div>
        </header>

        <div className="mt-5 space-y-4">
          {data.summary && (
            <section>
              <h2 className="border-l-4 pl-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em]" style={{ borderColor: accent, color: accent }}>Professional Summary</h2>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-neutral-700">{data.summary}</p>
            </section>
          )}

          {xp.length > 0 && (
            <section>
              <h2 className="border-l-4 pl-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em]" style={{ borderColor: accent, color: accent }}>Experience</h2>
              <div className="mt-2.5 space-y-3.5">
                {xp.map((e) => (
                  <div key={e.id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-[13px] font-bold text-neutral-900">{e.role} <span className="font-semibold" style={{ color: accent }}>@ {e.company}</span>{e.location && <span className="text-[11px] font-normal text-neutral-500"> · {e.location}</span>}</p>
                      <span className="font-mono text-[10px] text-neutral-500">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                    </div>
                    <ul className="mt-1 space-y-1">
                      {e.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} className="flex gap-2 text-[12px] leading-snug text-neutral-700">
                          <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} /> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          <RenderProjects projects={projects} accent={accent} variant="modern" />

          {edu.length > 0 && (
            <section>
              <h2 className="border-l-4 pl-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em]" style={{ borderColor: accent, color: accent }}>Education</h2>
              <div className="mt-2 space-y-1.5 text-[12px]">
                {edu.map((e) => (
                  <div key={e.id} className="flex items-baseline justify-between">
                    <p><span className="font-bold">{e.degree}</span> — {e.school}{e.location && ` (${e.location})`}</p>
                    <span className="font-mono text-[10px] text-neutral-500">{e.year}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.skills.length > 0 && (
            <section>
              <h2 className="border-l-4 pl-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em]" style={{ borderColor: accent, color: accent }}>Skills &amp; Expertise</h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {data.skills.filter(Boolean).map((s, i) => (
                  <span key={i} className="rounded px-2 py-0.5 text-[11px] font-medium border" style={{ borderColor: `${accent}35`, color: accent, background: `${accent}0c` }}>{s}</span>
                ))}
              </div>
            </section>
          )}

          {(certs.length > 0 || languages.length > 0) && (
            <div className="grid grid-cols-2 gap-4 pt-1">
              {certs.length > 0 && (
                <section>
                  <h2 className="border-l-4 pl-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ borderColor: accent, color: accent }}>Certifications</h2>
                  <ul className="mt-1.5 space-y-0.5 text-[11.5px] text-neutral-700">{certs.map((s, i) => <li key={i}>• {s}</li>)}</ul>
                </section>
              )}
              {languages.length > 0 && (
                <section>
                  <h2 className="border-l-4 pl-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ borderColor: accent, color: accent }}>Languages</h2>
                  <p className="mt-1.5 text-[11.5px] text-neutral-700">{languages.join(", ")}</p>
                </section>
              )}
            </div>
          )}

          <RenderVolunteer volunteer={volunteer} accent={accent} variant="modern" />
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. CLASSIC: Traditional Double Hairline Rules + Serif Headings
  // =========================================================================
  if (data.template === "classic") {
    return renderWithPage2(
      <div className="resume-sheet px-11 py-9 font-serif">
        <header className="border-y-2 border-neutral-900 py-3 text-center">
          <h1 className="text-3xl font-bold uppercase tracking-widest text-neutral-900">{c.fullName || "Your Name"}</h1>
          {c.title && <p className="mt-1 text-sm font-semibold tracking-wider text-neutral-700" style={{ color: accent }}>{c.title}</p>}
          <p className="mt-1.5 text-[11px] font-sans text-neutral-600 space-x-3">
            {contactLine.map((s, i) => <span key={i}>{s}{i < contactLine.length - 1 ? "  •  " : ""}</span>)}
          </p>
        </header>

        <div className="mt-5 space-y-4">
          {data.summary && (
            <section>
              <h2 className="border-b border-neutral-400 pb-0.5 text-[11.5px] font-bold uppercase tracking-[0.2em] text-neutral-900">Profile</h2>
              <p className="mt-1.5 font-sans text-[12.5px] leading-relaxed text-neutral-800">{data.summary}</p>
            </section>
          )}

          {xp.length > 0 && (
            <section>
              <h2 className="border-b border-neutral-400 pb-0.5 text-[11.5px] font-bold uppercase tracking-[0.2em] text-neutral-900">Experience</h2>
              <div className="mt-2.5 space-y-3.5">
                {xp.map((e) => (
                  <div key={e.id}>
                    <div className="flex items-baseline justify-between">
                      <p className="text-[13px] font-bold text-neutral-900">{e.role}, <span className="italic text-neutral-700">{e.company}</span>{e.location && ` — ${e.location}`}</p>
                      <span className="font-sans text-[10.5px] italic text-neutral-600">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                    </div>
                    <ul className="mt-1 list-disc pl-5 font-sans space-y-0.5">
                      {e.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} className="text-[12px] leading-snug text-neutral-700">{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          <RenderProjects projects={projects} accent={accent} variant="classic" />

          {edu.length > 0 && (
            <section>
              <h2 className="border-b border-neutral-400 pb-0.5 text-[11.5px] font-bold uppercase tracking-[0.2em] text-neutral-900">Education</h2>
              <div className="mt-2 space-y-1.5 font-sans text-[12px]">
                {edu.map((e) => (
                  <div key={e.id} className="flex items-baseline justify-between">
                    <p><span className="font-bold font-serif">{e.degree}</span>, {e.school}{e.location && ` · ${e.location}`}</p>
                    <span className="italic text-neutral-600">{e.year}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.skills.length > 0 && (
            <section>
              <h2 className="border-b border-neutral-400 pb-0.5 text-[11.5px] font-bold uppercase tracking-[0.2em] text-neutral-900">Skills &amp; Honors</h2>
              <p className="mt-1.5 font-sans text-[12px] leading-relaxed text-neutral-800">{data.skills.filter(Boolean).join(", ")}</p>
            </section>
          )}

          {(certs.length > 0 || languages.length > 0) && (
            <div className="grid grid-cols-2 gap-4 font-sans text-[12px] pt-1">
              {certs.length > 0 && (
                <div>
                  <h3 className="font-serif font-bold text-[11.5px] uppercase tracking-wider text-neutral-900">Certifications</h3>
                  <p className="mt-1 text-neutral-700">{certs.join(", ")}</p>
                </div>
              )}
              {languages.length > 0 && (
                <div>
                  <h3 className="font-serif font-bold text-[11.5px] uppercase tracking-wider text-neutral-900">Languages</h3>
                  <p className="mt-1 text-neutral-700">{languages.join(", ")}</p>
                </div>
              )}
            </div>
          )}

          <RenderVolunteer volunteer={volunteer} accent={accent} variant="classic" />
        </div>
      </div>
    );
  }

  // =========================================================================
  // 5. ELEGANT: Luxury Editorial & Hairline Margin Accent
  // =========================================================================
  if (data.template === "elegant") {
    return renderWithPage2(
      <div className="resume-sheet flex">
        <div className="w-2 shrink-0" style={{ background: accent }} />
        <div className="flex-1 px-11 py-9">
          <header className="border-b border-neutral-200 pb-4">
            <h1 className="font-serif text-3xl font-light uppercase tracking-[0.18em] text-neutral-900">{c.fullName || "Your Name"}</h1>
            {c.title && <p className="mt-1 font-serif text-xs italic tracking-widest text-neutral-600" style={{ color: accent }}>{c.title}</p>}
            <p className="mt-2.5 flex flex-wrap gap-x-4 text-[10.5px] tracking-wider text-neutral-500 uppercase font-sans">
              {contactLine.map((s, i) => <span key={i}>{s}</span>)}
            </p>
          </header>

          <div className="mt-5 space-y-4">
            {data.summary && (
              <section>
                <h2 className="font-serif text-[11px] font-normal uppercase tracking-[0.28em] text-neutral-500">Statement</h2>
                <p className="mt-1.5 text-[12.5px] font-light leading-relaxed text-neutral-800">{data.summary}</p>
              </section>
            )}

            {xp.length > 0 && (
              <section>
                <h2 className="font-serif text-[11px] font-normal uppercase tracking-[0.28em] text-neutral-500">Career History</h2>
                <div className="mt-2.5 space-y-3.5">
                  {xp.map((e) => (
                    <div key={e.id}>
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="text-[13px] font-medium text-neutral-900">{e.role} <span className="italic font-serif text-neutral-600" style={{ color: accent }}>/ {e.company}</span></p>
                        <span className="font-mono text-[9.5px] text-neutral-400">{[e.start, e.end].filter(Boolean).join(" — ")}</span>
                      </div>
                      {e.location && <p className="text-[10.5px] italic text-neutral-400">{e.location}</p>}
                      <ul className="mt-1 space-y-1">
                        {e.bullets.filter(Boolean).map((b, i) => (
                          <li key={i} className="flex gap-2.5 text-[12px] leading-relaxed text-neutral-700">
                            <span className="mt-[7px] h-1 w-1 shrink-0 rotate-45" style={{ background: accent }} /> {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <RenderProjects projects={projects} accent={accent} variant="elegant" />

            {edu.length > 0 && (
              <section>
                <h2 className="font-serif text-[11px] font-normal uppercase tracking-[0.28em] text-neutral-500">Academic Background</h2>
                <div className="mt-2 space-y-1 text-[12px]">
                  {edu.map((e) => (
                    <div key={e.id} className="flex items-baseline justify-between">
                      <p><span className="font-medium text-neutral-900">{e.degree}</span> — <span className="italic font-serif">{e.school}</span></p>
                      <span className="font-mono text-[9.5px] text-neutral-400">{e.year}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.skills.length > 0 && (
              <section>
                <h2 className="font-serif text-[11px] font-normal uppercase tracking-[0.28em] text-neutral-500">Competencies</h2>
                <p className="mt-1.5 text-[11.5px] font-light tracking-wide text-neutral-700">{data.skills.filter(Boolean).join("   ·   ")}</p>
              </section>
            )}

            {(certs.length > 0 || languages.length > 0) && (
              <div className="grid grid-cols-2 gap-4 pt-1 font-sans text-[12px]">
                {certs.length > 0 && (
                  <div>
                    <h3 className="font-serif text-[11px] font-normal uppercase tracking-[0.28em] text-neutral-500">Certifications</h3>
                    <p className="mt-1 text-neutral-700">{certs.join(", ")}</p>
                  </div>
                )}
                {languages.length > 0 && (
                  <div>
                    <h3 className="font-serif text-[11px] font-normal uppercase tracking-[0.28em] text-neutral-500">Languages</h3>
                    <p className="mt-1 text-neutral-700">{languages.join(", ")}</p>
                  </div>
                )}
              </div>
            )}

            <RenderVolunteer volunteer={volunteer} accent={accent} variant="elegant" />
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 6. PROFESSIONAL: Solid Accent Section Badges & Corporate Grid
  // =========================================================================
  if (data.template === "professional") {
    return renderWithPage2(
      <div className="resume-sheet px-11 py-9">
        <header className="flex items-start justify-between border-b-2 pb-4" style={{ borderColor: accent }}>
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-neutral-900">{c.fullName || "Your Name"}</h1>
            {c.title && <p className="mt-1 font-bold text-sm tracking-wide text-neutral-700">{c.title}</p>}
          </div>
          <div className="text-right text-[11px] text-neutral-600 space-y-0.5 font-medium">
            {contactLine.map((s, i) => <p key={i}>{s}</p>)}
          </div>
        </header>

        <div className="mt-5 space-y-4">
          {data.summary && (
            <section>
              <div className="inline-block px-2.5 py-0.5 text-white font-mono text-[10px] font-bold uppercase tracking-wider" style={{ background: accent }}>Executive Summary</div>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-neutral-800">{data.summary}</p>
            </section>
          )}

          {xp.length > 0 && (
            <section>
              <div className="inline-block px-2.5 py-0.5 text-white font-mono text-[10px] font-bold uppercase tracking-wider" style={{ background: accent }}>Professional Experience</div>
              <div className="mt-2.5 space-y-3.5">
                {xp.map((e) => (
                  <div key={e.id}>
                    <div className="flex items-baseline justify-between">
                      <p className="text-[13px] font-bold text-neutral-900">{e.role} <span style={{ color: accent }}>| {e.company}</span>{e.location && <span className="font-normal text-neutral-500"> ({e.location})</span>}</p>
                      <span className="font-mono text-[10.5px] font-semibold text-neutral-600">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                    </div>
                    <ul className="mt-1 space-y-1">
                      {e.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} className="flex gap-2 text-[12px] leading-snug text-neutral-700">
                          <span className="mt-[6px] h-1.5 w-1.5 shrink-0" style={{ background: accent }} /> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          <RenderProjects projects={projects} accent={accent} variant="professional" />

          <div className="grid grid-cols-2 gap-6 pt-1">
            {edu.length > 0 && (
              <section>
                <div className="inline-block px-2.5 py-0.5 text-white font-mono text-[10px] font-bold uppercase tracking-wider" style={{ background: accent }}>Education</div>
                <div className="mt-2 space-y-1.5 text-[12px]">
                  {edu.map((e) => (
                    <div key={e.id}>
                      <p className="font-bold text-neutral-900">{e.degree}</p>
                      <p className="text-neutral-600">{e.school} · {e.year}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.skills.length > 0 && (
              <section>
                <div className="inline-block px-2.5 py-0.5 text-white font-mono text-[10px] font-bold uppercase tracking-wider" style={{ background: accent }}>Core Skills</div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {data.skills.filter(Boolean).map((s, i) => (
                    <span key={i} className="border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-[10.5px] font-semibold text-neutral-800">{s}</span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {(certs.length > 0 || languages.length > 0) && (
            <div className="grid grid-cols-2 gap-6 pt-1">
              {certs.length > 0 && (
                <section>
                  <div className="inline-block px-2.5 py-0.5 text-white font-mono text-[10px] font-bold uppercase tracking-wider" style={{ background: accent }}>Certifications</div>
                  <ul className="mt-1.5 space-y-0.5 text-[11.5px] text-neutral-700">{certs.map((s, i) => <li key={i}>• {s}</li>)}</ul>
                </section>
              )}
              {languages.length > 0 && (
                <section>
                  <div className="inline-block px-2.5 py-0.5 text-white font-mono text-[10px] font-bold uppercase tracking-wider" style={{ background: accent }}>Languages</div>
                  <p className="mt-1.5 text-[11.5px] text-neutral-700">{languages.join(", ")}</p>
                </section>
              )}
            </div>
          )}

          <RenderVolunteer volunteer={volunteer} accent={accent} variant="professional" />
        </div>
      </div>
    );
  }

  // =========================================================================
  // 7. MINIMAL: Swiss / Scandinavian Numbered Sections
  // =========================================================================
  if (data.template === "minimal") {
    return renderWithPage2(
      <div className="resume-sheet px-11 py-9">
        <header>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-neutral-900">{c.fullName || "Your Name"}</h1>
          <div className="mt-1 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
            <p className="font-mono text-xs uppercase tracking-wider text-neutral-600">{c.title}</p>
          </div>
          <p className="mt-2.5 flex flex-wrap gap-x-4 text-[11px] text-neutral-500 font-mono">
            {contactLine.map((s, i) => <span key={i}>{s}</span>)}
          </p>
        </header>

        <div className="mt-6 space-y-4">
          {data.summary && (
            <section className="grid grid-cols-[100px_1fr] gap-4">
              <span className="font-mono text-[10.5px] font-bold text-neutral-400">01 / ABOUT</span>
              <p className="text-[12.5px] leading-relaxed text-neutral-800">{data.summary}</p>
            </section>
          )}

          {xp.length > 0 && (
            <section className="grid grid-cols-[100px_1fr] gap-4">
              <span className="font-mono text-[10.5px] font-bold text-neutral-400">02 / WORK</span>
              <div className="space-y-3.5">
                {xp.map((e) => (
                  <div key={e.id}>
                    <div className="flex items-baseline justify-between">
                      <p className="text-[13px] font-bold text-neutral-900">{e.role} <span className="font-medium text-neutral-600">· {e.company}</span></p>
                      <span className="font-mono text-[10px] text-neutral-400">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                    </div>
                    <ul className="mt-1 space-y-1 text-[12px] leading-snug text-neutral-700">
                      {e.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-neutral-400">—</span> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          <RenderProjects projects={projects} accent={accent} variant="minimal" />

          {edu.length > 0 && (
            <section className="grid grid-cols-[100px_1fr] gap-4">
              <span className="font-mono text-[10.5px] font-bold text-neutral-400">03 / EDU</span>
              <div className="space-y-1 text-[12px]">
                {edu.map((e) => (
                  <div key={e.id} className="flex justify-between">
                    <p><span className="font-bold">{e.degree}</span>, {e.school}</p>
                    <span className="font-mono text-[10px] text-neutral-400">{e.year}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.skills.length > 0 && (
            <section className="grid grid-cols-[100px_1fr] gap-4">
              <span className="font-mono text-[10.5px] font-bold text-neutral-400">04 / SKILLS</span>
              <p className="text-[12px] text-neutral-800 leading-relaxed">{data.skills.filter(Boolean).join(", ")}</p>
            </section>
          )}

          {(certs.length > 0 || languages.length > 0) && (
            <section className="grid grid-cols-[100px_1fr] gap-4">
              <span className="font-mono text-[10.5px] font-bold text-neutral-400">05 / EXTRAS</span>
              <div className="grid grid-cols-2 gap-4 text-[12px] text-neutral-700">
                {certs.length > 0 && <div><span className="font-bold text-neutral-900 block text-[11px] uppercase font-mono">Certs:</span> {certs.join(", ")}</div>}
                {languages.length > 0 && <div><span className="font-bold text-neutral-900 block text-[11px] uppercase font-mono">Languages:</span> {languages.join(", ")}</div>}
              </div>
            </section>
          )}

          <RenderVolunteer volunteer={volunteer} accent={accent} variant="minimal" />
        </div>
      </div>
    );
  }

  // =========================================================================
  // 8. CREATIVE: Asymmetric Layout + Timeline Dots
  // =========================================================================
  if (data.template === "creative") {
    return renderWithPage2(
      <div className="resume-sheet px-11 py-9">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b pb-4" style={{ borderColor: `${accent}30` }}>
          <div>
            <h1 className="font-display text-4xl font-black text-neutral-900 tracking-tight">{c.fullName || "Your Name"}</h1>
            <span className="mt-1 inline-block rounded-full px-3 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider" style={{ background: accent }}>{c.title || "Creative Professional"}</span>
          </div>
          <div className="flex flex-col text-right text-[11px] text-neutral-600 font-medium">
            {contactLine.map((s, i) => <span key={i}>{s}</span>)}
          </div>
        </header>

        <div className="mt-5 space-y-4">
          {data.summary && (
            <section className="rounded-lg p-3.5" style={{ background: `${accent}0d` }}>
              <p className="text-[12.5px] font-medium leading-relaxed text-neutral-800">{data.summary}</p>
            </section>
          )}

          {xp.length > 0 && (
            <section>
              <h2 className="font-display text-sm font-black uppercase tracking-wider" style={{ color: accent }}>Career Path</h2>
              <div className="mt-2.5 space-y-3.5 pl-3 border-l-2" style={{ borderColor: `${accent}40` }}>
                {xp.map((e) => (
                  <div key={e.id} className="relative">
                    <span className="absolute -left-[19px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white" style={{ background: accent }} />
                    <div className="flex items-baseline justify-between">
                      <p className="text-[13.5px] font-bold text-neutral-900">{e.role} <span className="font-semibold" style={{ color: accent }}>@ {e.company}</span></p>
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 font-mono text-[9.5px] font-bold text-neutral-600">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                    </div>
                    <ul className="mt-1 space-y-1 text-[12px] leading-snug text-neutral-700">
                      {e.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} className="flex gap-2"><span>✦</span> {b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          <RenderProjects projects={projects} accent={accent} variant="creative" />

          {data.skills.length > 0 && (
            <section>
              <h2 className="font-display text-sm font-black uppercase tracking-wider" style={{ color: accent }}>Skill Palette</h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {data.skills.filter(Boolean).map((s, i) => (
                  <span key={i} className="rounded-full border px-3 py-0.5 text-[11px] font-bold transition-colors" style={{ borderColor: accent, color: accent, background: `${accent}0a` }}>{s}</span>
                ))}
              </div>
            </section>
          )}

          {edu.length > 0 && (
            <section>
              <h2 className="font-display text-sm font-black uppercase tracking-wider" style={{ color: accent }}>Education</h2>
              <div className="mt-2 space-y-1 text-[12px]">
                {edu.map((e) => (
                  <div key={e.id} className="flex justify-between">
                    <p><span className="font-bold">{e.degree}</span>, {e.school}</p>
                    <span className="font-mono text-[10px] font-bold text-neutral-500">{e.year}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(certs.length > 0 || languages.length > 0) && (
            <div className="grid grid-cols-2 gap-4 pt-1 text-[12px]">
              {certs.length > 0 && (
                <div>
                  <h3 className="font-display text-xs font-bold uppercase" style={{ color: accent }}>Certifications</h3>
                  <p className="mt-1 text-neutral-700">{certs.join(", ")}</p>
                </div>
              )}
              {languages.length > 0 && (
                <div>
                  <h3 className="font-display text-xs font-bold uppercase" style={{ color: accent }}>Languages</h3>
                  <p className="mt-1 text-neutral-700">{languages.join(", ")}</p>
                </div>
              )}
            </div>
          )}

          <RenderVolunteer volunteer={volunteer} accent={accent} variant="creative" />
        </div>
      </div>
    );
  }

  // =========================================================================
  // 9. EXECUTIVE: C-Suite Monogram & Strategic Competencies
  // =========================================================================
  if (data.template === "executive") {
    const initials = (c.fullName || "Alex Morgan").split(" ").map(w => w[0]).slice(0, 2).join("");
    return renderWithPage2(
      <div className="resume-sheet px-11 py-9">
        <header className="flex items-center gap-5 border-b-2 border-neutral-800 pb-4">
          <div className="flex h-13 w-13 shrink-0 items-center justify-center font-serif text-xl font-black text-white" style={{ background: accent }}>
            {initials}
          </div>
          <div className="flex-1">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-neutral-900">{c.fullName || "Your Name"}</h1>
            <p className="mt-0.5 font-mono text-xs font-bold uppercase tracking-widest text-neutral-600">{c.title}</p>
          </div>
          <div className="text-right text-[10.5px] text-neutral-600 space-y-0.5">
            {contactLine.map((s, i) => <p key={i}>{s}</p>)}
          </div>
        </header>

        <div className="mt-5 space-y-4">
          {data.summary && (
            <div className="border-l-4 p-3" style={{ borderColor: accent, background: `${accent}0d` }}>
              <h2 className="font-serif text-[11px] font-bold uppercase tracking-widest" style={{ color: accent }}>Executive Value Proposition</h2>
              <p className="mt-1 text-[12.5px] leading-relaxed text-neutral-800">{data.summary}</p>
            </div>
          )}

          {data.skills.length > 0 && (
            <section>
              <h2 className="font-serif text-[11px] font-bold uppercase tracking-widest text-neutral-800">Core Leadership Competencies</h2>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center text-[11px] font-semibold text-neutral-800">
                {data.skills.filter(Boolean).slice(0, 9).map((s, i) => (
                  <div key={i} className="border border-neutral-300 bg-neutral-50 py-1">{s}</div>
                ))}
              </div>
            </section>
          )}

          {xp.length > 0 && (
            <section>
              <h2 className="font-serif text-[11px] font-bold uppercase tracking-widest text-neutral-800">Executive Experience &amp; Business Impact</h2>
              <div className="mt-2.5 space-y-3.5">
                {xp.map((e) => (
                  <div key={e.id}>
                    <div className="flex items-baseline justify-between">
                      <p className="text-[13.5px] font-bold text-neutral-900">{e.role} <span className="font-serif font-normal italic" style={{ color: accent }}>| {e.company}</span></p>
                      <span className="font-mono text-[10px] font-bold text-neutral-500">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                    </div>
                    {e.location && <p className="text-[11px] text-neutral-500">{e.location}</p>}
                    <ul className="mt-1 space-y-1 text-[12px] leading-snug text-neutral-700">
                      {e.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="font-bold" style={{ color: accent }}>›</span> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          <RenderProjects projects={projects} accent={accent} variant="executive" />

          {edu.length > 0 && (
            <section>
              <h2 className="font-serif text-[11px] font-bold uppercase tracking-widest text-neutral-800">Education &amp; Governance</h2>
              <div className="mt-2 space-y-1 text-[12px]">
                {edu.map((e) => (
                  <div key={e.id} className="flex justify-between">
                    <p><span className="font-bold">{e.degree}</span> — {e.school}</p>
                    <span className="font-mono text-[10px] text-neutral-500">{e.year}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(certs.length > 0 || languages.length > 0) && (
            <div className="grid grid-cols-2 gap-4 pt-1 font-serif text-[12px]">
              {certs.length > 0 && (
                <div>
                  <h3 className="font-bold text-[11px] uppercase tracking-wider text-neutral-800">Credentials &amp; Certifications</h3>
                  <p className="mt-1 text-neutral-700 font-sans">{certs.join(", ")}</p>
                </div>
              )}
              {languages.length > 0 && (
                <div>
                  <h3 className="font-bold text-[11px] uppercase tracking-wider text-neutral-800">Languages</h3>
                  <p className="mt-1 text-neutral-700 font-sans">{languages.join(", ")}</p>
                </div>
              )}
            </div>
          )}

          <RenderVolunteer volunteer={volunteer} accent={accent} variant="executive" />
        </div>
      </div>
    );
  }

  // =========================================================================
  // 10. ACADEMIC: Curriculum Vitae / Research & Publications Focus
  // =========================================================================
  if (data.template === "academic") {
    return renderWithPage2(
      <div className="resume-sheet px-11 py-9 font-serif">
        <header className="text-center pb-3.5 border-b">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-neutral-500">Curriculum Vitae</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-neutral-900">{c.fullName || "Your Name"}</h1>
          {c.title && <p className="text-sm italic text-neutral-700">{c.title}</p>}
          <p className="mt-1.5 text-[11px] text-neutral-600 font-sans space-x-3">
            {contactLine.map((s, i) => <span key={i}>{s}{i < contactLine.length - 1 ? " · " : ""}</span>)}
          </p>
        </header>

        <div className="mt-5 space-y-4">
          {edu.length > 0 && (
            <section>
              <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] border-b border-neutral-400 pb-0.5" style={{ color: accent }}>Education</h2>
              <div className="mt-2 space-y-2 text-[12px]">
                {edu.map((e) => (
                  <div key={e.id} className="flex justify-between">
                    <div>
                      <p className="font-bold">{e.degree}</p>
                      <p className="italic text-neutral-700">{e.school}{e.location && `, ${e.location}`}</p>
                    </div>
                    <span className="font-sans text-[10.5px] text-neutral-500">{e.year}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.summary && (
            <section>
              <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] border-b border-neutral-400 pb-0.5" style={{ color: accent }}>Research Focus &amp; Interests</h2>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-neutral-800 font-sans">{data.summary}</p>
            </section>
          )}

          {xp.length > 0 && (
            <section>
              <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] border-b border-neutral-400 pb-0.5" style={{ color: accent }}>Academic &amp; Professional Appointments</h2>
              <div className="mt-2.5 space-y-3">
                {xp.map((e) => (
                  <div key={e.id}>
                    <div className="flex justify-between">
                      <p className="text-[12.5px] font-bold">{e.role}, <span className="font-normal italic">{e.company}</span></p>
                      <span className="font-sans text-[10.5px] text-neutral-500">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                    </div>
                    <ul className="mt-1 list-disc pl-5 text-[12px] font-sans space-y-0.5 text-neutral-700">
                      {e.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          <RenderProjects projects={projects} accent={accent} variant="academic" />

          {data.skills.length > 0 && (
            <section>
              <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] border-b border-neutral-400 pb-0.5" style={{ color: accent }}>Methodologies &amp; Skills</h2>
              <p className="mt-1.5 text-[12px] font-sans text-neutral-800">{data.skills.filter(Boolean).join(", ")}</p>
            </section>
          )}

          {(certs.length > 0 || languages.length > 0) && (
            <section>
              <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] border-b border-neutral-400 pb-0.5" style={{ color: accent }}>Publications &amp; Credentials</h2>
              <ul className="mt-1.5 space-y-1 text-[11.5px] font-sans text-neutral-700">
                {certs.map((s, i) => <li key={i} className="pl-4 -indent-4">• {s}</li>)}
                {languages.length > 0 && <li className="pl-4 -indent-4">• Languages: {languages.join(", ")}</li>}
              </ul>
            </section>
          )}

          <RenderVolunteer volunteer={volunteer} accent={accent} variant="academic" />
        </div>
      </div>
    );
  }

  // =========================================================================
  // 11. TECH: Terminal & Monospace Engineering Style
  // =========================================================================
  if (data.template === "tech") {
    return renderWithPage2(
      <div className="resume-sheet px-11 py-9 font-mono">
        <header className="border-b-2 pb-4" style={{ borderColor: accent }}>
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-[11px] text-neutral-400">$ cat profile.json</p>
              <h1 className="text-3xl font-black text-neutral-900 tracking-tight">{c.fullName || "Your Name"}</h1>
            </div>
            <span className="border px-2 py-0.5 text-xs font-bold" style={{ borderColor: accent, color: accent }}>
              {`// ${c.title || "Developer"}`}
            </span>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-x-4 text-[11px] text-neutral-500">
            {contactLine.map((s, i) => <span key={i}>&gt; {s}</span>)}
          </div>
        </header>

        <div className="mt-5 space-y-4">
          {data.summary && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accent }}># Summary</h2>
              <p className="mt-1 text-[12px] font-sans leading-relaxed text-neutral-800">{data.summary}</p>
            </section>
          )}

          {data.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accent }}># Tech Stack</h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {data.skills.filter(Boolean).map((s, i) => (
                  <span key={i} className="border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-[10.5px] font-bold text-neutral-800">
                    &lt;{s} /&gt;
                  </span>
                ))}
              </div>
            </section>
          )}

          {xp.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accent }}># Experience Log</h2>
              <div className="mt-2.5 space-y-3.5 font-sans">
                {xp.map((e) => (
                  <div key={e.id}>
                    <div className="flex items-baseline justify-between">
                      <p className="font-mono text-[13px] font-bold text-neutral-900">{e.role} <span style={{ color: accent }}>@ {e.company}</span></p>
                      <span className="font-mono text-[10px] text-neutral-500">[{[e.start, e.end].filter(Boolean).join(" : ")}]</span>
                    </div>
                    <ul className="mt-1 space-y-1 text-[12px] leading-snug text-neutral-700">
                      {e.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="font-mono font-bold" style={{ color: accent }}>-&gt;</span> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          <RenderProjects projects={projects} accent={accent} variant="tech" />

          {edu.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accent }}># Education</h2>
              <div className="mt-1.5 space-y-1 text-[11.5px]">
                {edu.map((e) => (
                  <div key={e.id} className="flex justify-between">
                    <p><span className="font-bold">{e.degree}</span> · {e.school}</p>
                    <span className="text-neutral-500">{e.year}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(certs.length > 0 || languages.length > 0) && (
            <div className="grid grid-cols-2 gap-4 pt-1 text-[11.5px]">
              {certs.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: accent }}># Certifications</h3>
                  <p className="mt-1 text-neutral-700 font-sans">{certs.join(", ")}</p>
                </div>
              )}
              {languages.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: accent }}># Languages</h3>
                  <p className="mt-1 text-neutral-700 font-sans">{languages.join(", ")}</p>
                </div>
              )}
            </div>
          )}

          <RenderVolunteer volunteer={volunteer} accent={accent} variant="tech" />
        </div>
      </div>
    );
  }

  // =========================================================================
  // 12. CORPORATE: Enterprise Fortune 500 Two-Column Split
  // =========================================================================
  if (data.template === "corporate") {
    return renderWithPage2(
      <div className="resume-sheet px-11 py-9">
        <header className="border-b-2 border-neutral-800 pb-4">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="font-display text-3xl font-black uppercase tracking-wider text-neutral-900">{c.fullName || "Your Name"}</h1>
              {c.title && <p className="mt-1 font-bold text-xs uppercase tracking-widest" style={{ color: accent }}>{c.title}</p>}
            </div>
            <div className="text-right text-[10.5px] font-mono text-neutral-600 space-y-0.5">
              {contactLine.map((s, i) => <p key={i}>{s}</p>)}
            </div>
          </div>
        </header>

        <div className="mt-5 grid grid-cols-[1fr_210px] gap-6">
          <div className="space-y-4">
            {data.summary && (
              <section>
                <h2 className="font-display text-xs font-black uppercase tracking-wider border-b pb-1" style={{ borderColor: accent, color: accent }}>Professional Summary</h2>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-neutral-800">{data.summary}</p>
              </section>
            )}

            {xp.length > 0 && (
              <section>
                <h2 className="font-display text-xs font-black uppercase tracking-wider border-b pb-1" style={{ borderColor: accent, color: accent }}>Career Chronology</h2>
                <div className="mt-2.5 space-y-3.5">
                  {xp.map((e) => (
                    <div key={e.id}>
                      <div className="flex items-baseline justify-between">
                        <p className="text-[13px] font-bold text-neutral-900">{e.role} — <span style={{ color: accent }}>{e.company}</span></p>
                        <span className="font-mono text-[10px] font-semibold text-neutral-500">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                      </div>
                      {e.location && <p className="text-[11px] text-neutral-500">{e.location}</p>}
                      <ul className="mt-1 space-y-1">
                        {e.bullets.filter(Boolean).map((b, i) => (
                          <li key={i} className="flex gap-2 text-[12px] leading-snug text-neutral-700">
                            <span className="mt-[6px] h-1.5 w-1.5 shrink-0" style={{ background: accent }} /> {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <RenderProjects projects={projects} accent={accent} variant="corporate" />
          </div>

          <div className="space-y-4 border-l pl-5" style={{ borderColor: `${accent}30` }}>
            {data.skills.length > 0 && (
              <section>
                <h2 className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-neutral-800">Core Expertise</h2>
                <div className="mt-2 flex flex-wrap gap-1">
                  {data.skills.filter(Boolean).map((s, i) => (
                    <span key={i} className="border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-[10.5px] font-medium text-neutral-800">{s}</span>
                  ))}
                </div>
              </section>
            )}

            {edu.length > 0 && (
              <section>
                <h2 className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-neutral-800">Credentials</h2>
                <div className="mt-2 space-y-2 text-[11.5px]">
                  {edu.map((e) => (
                    <div key={e.id}>
                      <p className="font-bold text-neutral-900">{e.degree}</p>
                      <p className="text-neutral-600">{e.school} ({e.year})</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {certs.length > 0 && (
              <section>
                <h2 className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-neutral-800">Certifications</h2>
                <ul className="mt-1.5 space-y-1 text-[11px] text-neutral-700">{certs.map((s, i) => <li key={i}>• {s}</li>)}</ul>
              </section>
            )}

            {languages.length > 0 && (
              <section>
                <h2 className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-neutral-800">Languages</h2>
                <p className="mt-1.5 text-[11.5px] text-neutral-700">{languages.join(", ")}</p>
              </section>
            )}

            <RenderVolunteer volunteer={volunteer} accent={accent} variant="corporate" />
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 13. CRAFT: Centered Serif Academic Header
  // =========================================================================
  const craft = data.template === "craft";
  // 14. ATLAS: Compact Bar Header
  const atlas = data.template === "atlas";

    // =========================================================================
    // 15. MERIT / ATLAS / CRAFT: Single Column Standard
    // =========================================================================
    return renderWithPage2(
      <div className={`resume-sheet px-11 ${craft ? "py-10 text-center" : atlas ? "py-8" : "py-9"}`}>
        {atlas && <div className="mb-4 h-1 w-full" style={{ background: accent }} />}
        <header
          data-section="contact"
          className={`group/sec transition-colors hover:bg-pine/5 rounded p-1 -m-1 ${craft ? "" : atlas ? "" : "border-b-2 pb-4"}`}
          style={craft ? {} : { borderColor: accent }}
        >
          <h1
            data-section="contact"
            data-subfield="fullName"
            className={`font-display font-black leading-none ${craft ? "text-[34px]" : "text-[30px]"} ${atlas ? "uppercase tracking-tight" : ""} hover:underline hover:decoration-pine`}
          >
            {c.fullName || "Your Name"}
          </h1>
          {c.title && (
            <p
              data-section="contact"
              data-subfield="title"
              className={`font-semibold ${craft ? "mt-1.5 text-[14px] tracking-wide" : "mt-1 text-[13.5px]"} hover:underline hover:decoration-pine`}
              style={{ color: accent }}
            >
              {c.title}
            </p>
          )}
          <p className={`mt-2 flex flex-wrap text-[11px] text-neutral-600 ${craft ? "justify-center" : ""} ${atlas ? "gap-x-3" : "gap-x-4"}`}>
            {contactLine.map((s, i) => (
              <span key={i} data-section="contact" className="hover:text-neutral-900 hover:underline">{s}</span>
            ))}
          </p>
        </header>

        <div className={`mt-5 space-y-4 ${craft ? "text-left" : ""}`}>
          {data.summary && (
            <section
              data-section="summary"
              data-subfield="summary"
              className="group/sec transition-colors hover:bg-pine/5 rounded p-1.5 -m-1.5"
            >
              <h2 className={secCls(craft, atlas)} style={{ color: craft ? undefined : accent }}>{craft && <span className="mx-auto block max-w-[120px] border-b-2 pb-1 text-center" style={{ borderColor: accent }}>Summary</span>}{!craft && "Professional Summary"}</h2>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-neutral-800">{data.summary}</p>
            </section>
          )}

          {xp.length > 0 && (
            <section
              data-section="experience"
              className="group/sec transition-colors hover:bg-pine/5 rounded p-1.5 -m-1.5"
            >
              <h2 className={secCls(craft, atlas)} style={{ color: craft ? undefined : accent }}>{craft && <span className="mx-auto block max-w-[140px] border-b-2 pb-1 text-center" style={{ borderColor: accent }}>Experience</span>}{!craft && "Experience"}</h2>
              <div className={`space-y-3.5 ${craft ? "mx-auto max-w-[600px]" : "mt-2"}`}>
                {xp.map((e) => (
                  <div
                    key={e.id}
                    data-section="experience"
                    data-item-id={e.id}
                    className="hover:bg-pine/10 p-1.5 rounded transition-colors"
                  >
                    <div className={`flex items-baseline justify-between gap-3 ${craft ? "justify-center gap-2" : ""}`}>
                      <p
                        data-section="experience"
                        data-subfield="role"
                        data-item-id={e.id}
                        className="text-[13.5px] font-bold hover:underline hover:decoration-pine"
                      >
                        {e.role}{e.company && <span className="font-semibold" data-section="experience" data-subfield="company" data-item-id={e.id}> — {e.company}</span>}{e.location && <span className="font-normal text-neutral-500"> · {e.location}</span>}
                      </p>
                      {!craft && <p className="shrink-0 font-mono text-[10px] text-neutral-500">{[e.start, e.end].filter(Boolean).join(" – ")}</p>}
                    </div>
                    {craft && (e.start || e.end) && <p className="text-center font-mono text-[10px] text-neutral-500">{[e.start, e.end].filter(Boolean).join(" – ")}</p>}
                    <ul className={`mt-1 space-y-1 ${craft ? "list-disc pl-5" : ""}`}>
                      {e.bullets.filter(Boolean).map((b, i) => (
                        <li
                          key={i}
                          data-section="experience"
                          data-subfield="bullets"
                          data-item-id={e.id}
                          className={`text-[12.5px] leading-snug ${craft ? "" : "flex gap-2"} hover:underline hover:decoration-pine`}
                        >
                          {!craft && <span className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-full" style={{ background: accent }} />}
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          <RenderProjects projects={projects} accent={accent} variant={craft ? "craft" : atlas ? "atlas" : "merit"} />

          {edu.length > 0 && (
            <section
              data-section="education"
              className="group/sec transition-colors hover:bg-pine/5 rounded p-1.5 -m-1.5"
            >
              <h2 className={secCls(craft, atlas)} style={{ color: craft ? undefined : accent }}>{craft && <span className="mx-auto block max-w-[120px] border-b-2 pb-1 text-center" style={{ borderColor: accent }}>Education</span>}{!craft && "Education"}</h2>
              <div className={`mt-2 space-y-1.5 ${craft ? "mx-auto max-w-[500px]" : ""}`}>
                {edu.map((e) => (
                  <div
                    key={e.id}
                    data-section="education"
                    data-item-id={e.id}
                    className={`flex items-baseline justify-between gap-3 ${craft ? "justify-center" : ""} hover:bg-pine/10 p-1 rounded transition-colors`}
                  >
                    <p
                      data-section="education"
                      data-subfield="degree"
                      data-item-id={e.id}
                      className="text-[12.5px] hover:underline hover:decoration-pine"
                    >
                      <span className="font-bold">{e.degree}</span> — {e.school}{e.location && `, ${e.location}`}
                    </p>
                    <p className="font-mono text-[10px] text-neutral-500">{e.year}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.skills.length > 0 && (
            <section
              data-section="skills"
              data-subfield="skills"
              className="group/sec transition-colors hover:bg-pine/5 rounded p-1.5 -m-1.5"
            >
              <h2 className={secCls(craft, atlas)} style={{ color: craft ? undefined : accent }}>{craft && <span className="mx-auto block max-w-[100px] border-b-2 pb-1 text-center" style={{ borderColor: accent }}>Skills</span>}{!craft && "Skills"}</h2>
              <p className={`mt-2 text-[12.5px] leading-relaxed ${craft ? "text-center" : ""}`}>{data.skills.filter(Boolean).join(atlas ? "  ·  " : ", ")}</p>
            </section>
          )}

          {certs.length > 0 && (
            <section
              data-section="extras"
              data-subfield="certifications"
              className="group/sec transition-colors hover:bg-pine/5 rounded p-1.5 -m-1.5"
            >
              <h2 className={secCls(craft, atlas)} style={{ color: craft ? undefined : accent }}>{craft && <span className="mx-auto block max-w-[170px] border-b-2 pb-1 text-center" style={{ borderColor: accent }}>Certifications</span>}{!craft && "Certifications"}</h2>
              <ul className={`mt-2 space-y-0.5 text-[12.5px] ${craft ? "text-center" : ""}`}>{certs.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </section>
          )}

          {languages.length > 0 && (
            <section
              data-section="extras"
              data-subfield="languages"
              className="group/sec transition-colors hover:bg-pine/5 rounded p-1.5 -m-1.5"
            >
              <h2 className={secCls(craft, atlas)} style={{ color: craft ? undefined : accent }}>{craft && <span className="mx-auto block max-w-[120px] border-b-2 pb-1 text-center" style={{ borderColor: accent }}>Languages</span>}{!craft && "Languages"}</h2>
              <p className={`mt-2 text-[12.5px] ${craft ? "text-center" : ""}`}>{languages.join(", ")}</p>
            </section>
          )}

          <RenderVolunteer volunteer={volunteer} accent={accent} variant={craft ? "craft" : atlas ? "atlas" : "merit"} />
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`relative select-text resume-sheet-interactive ${onSelectSection ? "cursor-pointer group/resume-interactive" : ""}`}
      onClickCapture={handleUniversalClick}
      title={onSelectSection ? "Click any text in the resume to jump to and focus that field in the editor" : undefined}
    >
      {renderDocumentContent()}
    </div>
  );
}

const secCls = (craft: boolean, atlas: boolean) =>
  craft
    ? "font-display text-[16px] font-bold"
    : atlas
      ? "font-mono text-[10.5px] font-bold uppercase tracking-[0.26em] border-b border-neutral-300 pb-1"
      : "font-mono text-[11px] font-bold uppercase tracking-[0.24em]";
