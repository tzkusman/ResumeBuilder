import type { ResumeData } from "../../lib/types";
import { splitResumeData, getSectionProps, getItemProps, type OnSelectSectionFn } from "./types";

export default function StandardPage2({
  data,
  onSelectSection,
}: {
  data: ResumeData;
  onSelectSection?: OnSelectSectionFn;
}) {
  const { eduPage2, xpPage2, projectsPage2, certsPage2, languagesPage2, volunteerPage2, contact: c, accent } = splitResumeData(data);
  const t = data.template;

  // Typography archetype classes based on chosen template
  const isSerif = t === "craft" || t === "classic" || t === "academic";
  const isMono = t === "tech";
  const isMinimal = t === "minimal";
  const isLedger = t === "ledger";

  // Template-specific header accent rule
  const headerUnderline = isMono
    ? "border-b border-dashed border-neutral-400"
    : isSerif
    ? "border-b-2 border-double border-neutral-700"
    : "border-b pb-2.5";

  // Ledger layout continuation: Maintain 2-column format if template is Ledger
  if (isLedger) {
    return (
      <div className="resume-sheet page-2 resume-page-break flex bg-white text-neutral-900">
        <aside className="w-[240px] shrink-0 px-6 py-8 text-white flex flex-col justify-between" style={{ background: accent }}>
          <div className="space-y-6">
            <div className="border-b border-white/20 pb-2">
              <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] font-bold text-white/80">Page 2</p>
            </div>

            {eduPage2.length > 0 && (
              <div {...getSectionProps("education", onSelectSection)}>
                <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] opacity-85">Education</h2>
                <div className="mt-2.5 space-y-2 text-[11px]">
                  {eduPage2.map((e) => (
                    <div key={e.id} {...getItemProps("education", "school", e.id, onSelectSection)}>
                      <p className="font-bold" {...getItemProps("education", "degree", e.id, onSelectSection)}>{e.degree}</p>
                      <p className="opacity-80" {...getItemProps("education", "school", e.id, onSelectSection)}>{e.school} <span {...getItemProps("education", "year", e.id, onSelectSection)}>{e.year}</span></p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {certsPage2.length > 0 && (
              <div {...getItemProps("extras", "certifications", undefined, onSelectSection)}>
                <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] opacity-85">Certifications</h2>
                <ul className="mt-2 space-y-1 text-[11px] opacity-90">
                  {certsPage2.map((s, i) => <li key={i}>• {s}</li>)}
                </ul>
              </div>
            )}

            {languagesPage2.length > 0 && (
              <div {...getItemProps("extras", "languages", undefined, onSelectSection)}>
                <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] opacity-85">Languages</h2>
                <p className="mt-1.5 text-[11px] opacity-90">{languagesPage2.join(", ")}</p>
              </div>
            )}
          </div>

          <p className="font-mono text-[9px] uppercase tracking-widest opacity-60">Page 2 of 2</p>
        </aside>

        <div className="flex-1 px-8 py-8 flex flex-col justify-between">
          <div className="space-y-6">
            <header className="border-b border-neutral-200 pb-2.5 flex items-baseline justify-between font-mono text-[10.5px] text-neutral-400">
              <span className="font-bold text-neutral-700">Career History & Projects (Continued)</span>
              <span>Page 2 of 2</span>
            </header>

            {xpPage2.length > 0 && (
              <section {...getSectionProps("experience", onSelectSection)}>
                <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: accent }}>
                  Experience (Continued)
                </h2>
                <div className="mt-3.5 space-y-4">
                  {xpPage2.map((e) => (
                    <div key={e.id} {...getItemProps("experience", "role", e.id, onSelectSection)}>
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="text-[13px] font-bold" {...getItemProps("experience", "role", e.id, onSelectSection)}>
                          {e.role} <span className="font-semibold" style={{ color: accent }} {...getItemProps("experience", "company", e.id, onSelectSection)}>· {e.company}</span>
                        </p>
                        <p className="shrink-0 font-mono text-[10px] text-neutral-500" {...getItemProps("experience", "start", e.id, onSelectSection)}>{[e.start, e.end].filter(Boolean).join(" – ")}</p>
                      </div>
                      {e.location && <p className="text-[11px] text-neutral-500" {...getItemProps("experience", "company", e.id, onSelectSection)}>{e.location}</p>}
                      <ul className="mt-1.5 space-y-1" {...getItemProps("experience", "bullets", e.id, onSelectSection)}>
                        {e.bullets.filter(Boolean).map((b, i) => (
                          <li key={i} className="flex gap-2 text-[12px] leading-snug" {...getItemProps("experience", "bullets", e.id, onSelectSection)}>
                            <span className="mt-[6px] h-[3px] w-[3px] shrink-0" style={{ background: accent }} />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {projectsPage2.length > 0 && (
              <section {...getSectionProps("projects", onSelectSection)}>
                <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: accent }}>
                  Projects & Milestones
                </h2>
                <div className="mt-3 space-y-3">
                  {projectsPage2.map((p) => (
                    <div key={p.id} className="border-l-2 pl-3" style={{ borderColor: accent }} {...getItemProps("projects", "title", p.id, onSelectSection)}>
                      <div className="flex items-baseline justify-between">
                        <h4 className="text-[12.5px] font-bold text-neutral-900" {...getItemProps("projects", "title", p.id, onSelectSection)}>{p.title}</h4>
                        {p.date && <span className="font-mono text-[10px] text-neutral-500" {...getItemProps("projects", "date", p.id, onSelectSection)}>{p.date}</span>}
                      </div>
                      {p.subtitle && <p className="text-[11px] text-neutral-600 italic" {...getItemProps("projects", "subtitle", p.id, onSelectSection)}>{p.subtitle}</p>}
                      <ul className="mt-1 space-y-0.5 text-[11.5px] text-neutral-700" {...getItemProps("projects", "bullets", p.id, onSelectSection)}>
                        {p.bullets.filter(Boolean).map((b, bi) => <li key={bi} {...getItemProps("projects", "bullets", p.id, onSelectSection)}>• {b}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {volunteerPage2.length > 0 && (
              <section {...getSectionProps("projects", onSelectSection)}>
                <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: accent }}>
                  Volunteering & Leadership
                </h2>
                <div className="mt-2 space-y-1.5 text-[11.5px] text-neutral-700">
                  {volunteerPage2.map((v) => (
                    <p key={v.id} {...getItemProps("projects", "volunteer", v.id, onSelectSection)}>
                      <span className="font-semibold text-neutral-900">{v.role}</span> · {v.org} {v.year && `(${v.year})`}
                    </p>
                  ))}
                </div>
              </section>
            )}
          </div>

          <footer className="mt-6 border-t border-neutral-200 pt-2 flex items-center justify-between font-mono text-[10px] text-neutral-400">
            <span>Resume</span>
            <span>Page 2 of 2</span>
          </footer>
        </div>
      </div>
    );
  }

  // Standard Page 2 with template typography & styling
  return (
    <div
      className={`resume-sheet page-2 resume-page-break flex flex-col justify-between px-11 py-9 text-neutral-900 bg-white ${
        isSerif ? "font-serif" : isMono ? "font-mono" : ""
      }`}
    >
      <div className="space-y-3.5">
        {/* Continuing Work Experience */}
        {xpPage2.length > 0 && (
          <section className="mt-0" {...getSectionProps("experience", onSelectSection)}>
            <div className="flex items-center gap-2">
              {isMinimal && <span className="font-mono text-[10.5px] font-bold text-neutral-400">03 /</span>}
              <h2
                className={`text-[11.5px] font-bold uppercase tracking-[0.24em] ${isMono ? "font-mono" : "font-display"}`}
                style={{ color: accent }}
              >
                {isMono ? "// Work History (Continued)" : "Work History (Continued)"}
              </h2>
            </div>
            <div className="mt-2 space-y-2.5">
              {xpPage2.map((e) => (
                <div key={e.id} className={isMono ? "border-l-2 border-neutral-300 pl-3" : ""} {...getItemProps("experience", "role", e.id, onSelectSection)}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-[13.5px] font-bold text-neutral-900" {...getItemProps("experience", "role", e.id, onSelectSection)}>{e.role}</h3>
                    <span className="font-mono text-[10.5px] text-neutral-500 font-semibold" {...getItemProps("experience", "start", e.id, onSelectSection)}>
                      {[e.start, e.end].filter(Boolean).join(" – ")}
                    </span>
                  </div>
                  <p className="text-[12px] font-semibold text-neutral-700" {...getItemProps("experience", "company", e.id, onSelectSection)}>
                    {e.company}
                    {e.location && ` · ${e.location}`}
                  </p>
                  <ul className="mt-1 space-y-0.5" {...getItemProps("experience", "bullets", e.id, onSelectSection)}>
                    {e.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-[12px] leading-snug text-neutral-700" {...getItemProps("experience", "bullets", e.id, onSelectSection)}>
                        <span className="mt-[6px] h-[3px] w-[3px] shrink-0 rounded-full" style={{ background: accent }} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projectsPage2.length > 0 && (
          <section className="mt-0" {...getSectionProps("projects", onSelectSection)}>
            <div className="flex items-center gap-2">
              {isMinimal && <span className="font-mono text-[10.5px] font-bold text-neutral-400">04 /</span>}
              <h2
                className={`text-[11.5px] font-bold uppercase tracking-[0.24em] ${isMono ? "font-mono" : "font-display"}`}
                style={{ color: accent }}
              >
                {isMono ? "// Key Deliverables & Projects" : "Key Deliverables & Projects"}
              </h2>
            </div>
            <div className="mt-2 space-y-2">
              {projectsPage2.map((p) => (
                <div key={p.id} className="border-l-2 pl-3" style={{ borderColor: accent }} {...getItemProps("projects", "title", p.id, onSelectSection)}>
                  <div className="flex items-baseline justify-between">
                    <h4 className="text-[13px] font-bold text-neutral-900" {...getItemProps("projects", "title", p.id, onSelectSection)}>{p.title}</h4>
                    {p.date && <span className="font-mono text-[10px] text-neutral-500" {...getItemProps("projects", "date", p.id, onSelectSection)}>{p.date}</span>}
                  </div>
                  {p.subtitle && <p className="text-[11.5px] text-neutral-600 italic" {...getItemProps("projects", "subtitle", p.id, onSelectSection)}>{p.subtitle}</p>}
                  <ul className="mt-0.5 space-y-0.5 text-[11.5px] text-neutral-700" {...getItemProps("projects", "bullets", p.id, onSelectSection)}>
                    {p.bullets.filter(Boolean).map((b, bi) => (
                      <li key={bi} {...getItemProps("projects", "bullets", p.id, onSelectSection)}>• {b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education (when continuing onto page 2) */}
        {eduPage2.length > 0 && (
          <section className="mt-0" {...getSectionProps("education", onSelectSection)}>
            <div className="flex items-center gap-2">
              {isMinimal && <span className="font-mono text-[10.5px] font-bold text-neutral-400">05 /</span>}
              <h2
                className={`text-[11.5px] font-bold uppercase tracking-[0.24em] ${isMono ? "font-mono" : "font-display"}`}
                style={{ color: accent }}
              >
                {isMono ? "// Academic Qualifications" : "Education & Academic Background"}
              </h2>
            </div>
            <div className="mt-1.5 space-y-1 text-[12px]">
              {eduPage2.map((ed) => (
                <div key={ed.id} className="flex items-baseline justify-between" {...getItemProps("education", "school", ed.id, onSelectSection)}>
                  <span className="font-bold text-neutral-800" {...getItemProps("education", "degree", ed.id, onSelectSection)}>
                    {ed.degree} — <span className="font-normal text-neutral-600" {...getItemProps("education", "school", ed.id, onSelectSection)}>{ed.school}</span>
                  </span>
                  <span className="font-mono text-[10.5px] text-neutral-500" {...getItemProps("education", "year", ed.id, onSelectSection)}>{ed.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications & Licenses */}
        {certsPage2.length > 0 && (
          <section className="mt-0" {...getSectionProps("extras", onSelectSection)}>
            <h2
              className={`text-[11.5px] font-bold uppercase tracking-[0.24em] ${isMono ? "font-mono" : "font-display"}`}
              style={{ color: accent }}
            >
              {isMono ? "// Certifications" : "Certifications & Credentials"}
            </h2>
            <ul className="mt-1 space-y-0.5 text-[12px] text-neutral-700">
              {certsPage2.map((cert, i) => (
                <li key={i} className="flex items-center gap-2" {...getItemProps("extras", "certifications", undefined, onSelectSection)}>
                  <span className="h-1 w-1 rounded-full" style={{ background: accent }} />
                  {cert}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Languages & Volunteering */}
        {(languagesPage2.length > 0 || volunteerPage2.length > 0) && (
          <section className="mt-0 grid grid-cols-2 gap-4" {...getSectionProps("extras", onSelectSection)}>
            {languagesPage2.length > 0 && (
              <div {...getItemProps("extras", "languages", undefined, onSelectSection)}>
                <h3 className="font-mono text-[10.5px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                  Languages
                </h3>
                <p className="mt-1 text-[12px] text-neutral-700">{languagesPage2.join(", ")}</p>
              </div>
            )}
            {volunteerPage2.length > 0 && (
              <div>
                <h3 className="font-mono text-[10.5px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                  Volunteering & Leadership
                </h3>
                <div className="mt-1 space-y-1 text-[11.5px] text-neutral-700">
                  {volunteerPage2.map((v) => (
                    <p key={v.id} {...getItemProps("projects", "volunteer", v.id, onSelectSection)}>
                      <span className="font-semibold">{v.role}</span> · {v.org}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Clean Running Footer */}
      <footer className="mt-auto border-t border-neutral-200 pt-2 flex items-center justify-between font-mono text-[10px] text-neutral-400">
        <span>Resume</span>
        <span>Page 2 of 2</span>
      </footer>
    </div>
  );
}
