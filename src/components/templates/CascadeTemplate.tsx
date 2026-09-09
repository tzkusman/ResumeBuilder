import type { TemplateProps } from "./types";
import { splitResumeData } from "./types";

export default function CascadeTemplate({ data, pageNumber }: TemplateProps) {
  const { isTwoPage, edu, xpPage1, xpPage2, projects, volunteer, contact: c, accent } = splitResumeData(data);
  const contactLine = [c.email, c.phone, c.location, c.website, c.linkedin].filter(Boolean);

  const renderPage1 = () => (
    <div className="resume-sheet flex flex-col justify-between p-11 text-neutral-900 bg-white">
      <div>
        {/* Cascade Header */}
        <header className="relative pl-5 border-l-4" style={{ borderColor: accent }}>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-neutral-900">
            {c.fullName || "Candidate Name"}
          </h1>
          <p className="mt-1 text-sm font-semibold tracking-wide uppercase" style={{ color: accent }}>
            {c.title || "Professional Role"}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-neutral-600 font-medium">
            {contactLine.map((s, idx) => (
              <span key={idx} className="flex items-center gap-1.5">
                {idx > 0 && <span className="text-neutral-300">|</span>}
                {s}
              </span>
            ))}
          </div>
        </header>

        {/* Executive Summary */}
        {data.summary && (
          <section className="mt-7">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-sm" style={{ background: accent }} />
              <h2 className="font-display text-[14px] font-bold uppercase tracking-wider text-neutral-800">Professional Summary</h2>
            </div>
            <p className="mt-2 text-[12.5px] leading-relaxed text-neutral-700 pl-4 border-l border-neutral-200">
              {data.summary}
            </p>
          </section>
        )}

        {/* Work Experience */}
        {xpPage1.length > 0 && (
          <section className="mt-7">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-sm" style={{ background: accent }} />
              <h2 className="font-display text-[14px] font-bold uppercase tracking-wider text-neutral-800">
                Experience {isTwoPage && <span className="text-[10px] font-normal text-neutral-500">(Core Roles)</span>}
              </h2>
            </div>
            <div className="mt-3.5 space-y-4 pl-4 border-l border-neutral-200">
              {xpPage1.map((e) => (
                <div key={e.id} className="relative">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-[14px] font-bold text-neutral-900">{e.role}</h3>
                    <span className="font-mono text-[10.5px] font-semibold text-neutral-500">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                  </div>
                  <p className="text-[12px] font-medium" style={{ color: accent }}>{e.company}{e.location && ` · ${e.location}`}</p>
                  <ul className="mt-1.5 space-y-1">
                    {e.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-[12px] leading-relaxed text-neutral-700">
                        <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-xs" style={{ background: accent }} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section className="mt-7">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-sm" style={{ background: accent }} />
              <h2 className="font-display text-[14px] font-bold uppercase tracking-wider text-neutral-800">Core Expertise</h2>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5 pl-4 border-l border-neutral-200">
              {data.skills.filter(Boolean).map((s, i) => (
                <span key={i} className="rounded-sm bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-800 border border-neutral-200">
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {!isTwoPage && (
          <>
            {edu.length > 0 && (
              <section className="mt-7">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-sm" style={{ background: accent }} />
                  <h2 className="font-display text-[14px] font-bold uppercase tracking-wider text-neutral-800">Education</h2>
                </div>
                <div className="mt-2 pl-4 border-l border-neutral-200 space-y-1.5">
                  {edu.map((ed) => (
                    <div key={ed.id} className="flex items-baseline justify-between text-[12px]">
                      <span className="font-bold text-neutral-800">{ed.degree} <span className="font-normal text-neutral-600">— {ed.school}</span></span>
                      <span className="font-mono text-[10.5px] text-neutral-500">{ed.year}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.certifications.length > 0 && (
              <section className="mt-5 pl-4 border-l border-neutral-200">
                <p className="text-[11.5px] text-neutral-600"><strong className="text-neutral-800">Certifications:</strong> {data.certifications.join(" · ")}</p>
              </section>
            )}
          </>
        )}
      </div>

      <footer className="mt-6 border-t border-neutral-200 pt-2 flex items-center justify-between font-mono text-[10px] text-neutral-400">
        <span>{c.fullName || "Resume"} · Cascade Format</span>
        <span>{isTwoPage ? "Page 1 of 2" : "Page 1 of 1"}</span>
      </footer>
    </div>
  );

  const renderPage2 = () => (
    <div className="resume-sheet page-2 resume-page-break flex flex-col justify-between p-11 text-neutral-900 bg-white">
      <div>
        <header className="border-b-2 pb-3 flex items-baseline justify-between" style={{ borderColor: accent }}>
          <div>
            <span className="font-display text-lg font-bold text-neutral-900">{c.fullName || "Candidate Name"}</span>
            <span className="ml-3 text-xs font-semibold uppercase text-neutral-500">{c.title}</span>
          </div>
          <span className="font-mono text-[10.5px] uppercase tracking-wider text-neutral-400">Page 2 of 2</span>
        </header>

        {xpPage2.length > 0 && (
          <section className="mt-6">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-sm" style={{ background: accent }} />
              <h2 className="font-display text-[14px] font-bold uppercase tracking-wider text-neutral-800">Career History (Continued)</h2>
            </div>
            <div className="mt-3 space-y-4 pl-4 border-l border-neutral-200">
              {xpPage2.map((e) => (
                <div key={e.id}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-[13.5px] font-bold text-neutral-900">{e.role}</h3>
                    <span className="font-mono text-[10.5px] font-semibold text-neutral-500">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                  </div>
                  <p className="text-[12px] font-medium" style={{ color: accent }}>{e.company}{e.location && ` · ${e.location}`}</p>
                  <ul className="mt-1 space-y-1">
                    {e.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-[12px] text-neutral-700">
                        <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-xs" style={{ background: accent }} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section className="mt-6">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-sm" style={{ background: accent }} />
              <h2 className="font-display text-[14px] font-bold uppercase tracking-wider text-neutral-800">Key Projects & Initiatives</h2>
            </div>
            <div className="mt-3 space-y-3 pl-4 border-l border-neutral-200">
              {projects.map((p) => (
                <div key={p.id}>
                  <div className="flex items-baseline justify-between">
                    <h4 className="text-[13px] font-bold text-neutral-800">{p.title}</h4>
                    {p.date && <span className="font-mono text-[10px] text-neutral-500">{p.date}</span>}
                  </div>
                  {p.subtitle && <p className="text-[11.5px] text-neutral-500">{p.subtitle}</p>}
                  <ul className="mt-1 space-y-0.5 text-[11.5px] text-neutral-700">
                    {p.bullets.filter(Boolean).map((b, bi) => <li key={bi}>• {b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {edu.length > 0 && (
          <section className="mt-6">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-sm" style={{ background: accent }} />
              <h2 className="font-display text-[14px] font-bold uppercase tracking-wider text-neutral-800">Education & Degrees</h2>
            </div>
            <div className="mt-2.5 pl-4 border-l border-neutral-200 space-y-1.5">
              {edu.map((ed) => (
                <div key={ed.id} className="flex items-baseline justify-between text-[12px]">
                  <span className="font-bold text-neutral-800">{ed.degree} <span className="font-normal text-neutral-600">— {ed.school}</span></span>
                  <span className="font-mono text-[10.5px] text-neutral-500">{ed.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.certifications.length > 0 && (
          <section className="mt-6">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-sm" style={{ background: accent }} />
              <h2 className="font-display text-[14px] font-bold uppercase tracking-wider text-neutral-800">Certifications</h2>
            </div>
            <ul className="mt-2 pl-4 border-l border-neutral-200 space-y-1 text-[12px] text-neutral-700">
              {data.certifications.map((c, i) => <li key={i}>• {c}</li>)}
            </ul>
          </section>
        )}

        {(data.languages.length > 0 || volunteer.length > 0) && (
          <section className="mt-6 grid grid-cols-2 gap-4 pl-4 border-l border-neutral-200">
            {data.languages.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase text-neutral-800">Languages</h3>
                <p className="mt-1 text-[11.5px] text-neutral-600">{data.languages.join(", ")}</p>
              </div>
            )}
            {volunteer.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase text-neutral-800">Leadership & Volunteering</h3>
                <div className="mt-1 space-y-1 text-[11.5px] text-neutral-600">
                  {volunteer.map((v) => <p key={v.id}><span className="font-semibold text-neutral-800">{v.role}</span> · {v.org}</p>)}
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      <footer className="mt-6 border-t border-neutral-200 pt-2 flex items-center justify-between font-mono text-[10px] text-neutral-400">
        <span>{c.fullName || "Resume"} · Cascade Format</span>
        <span>Page 2 of 2</span>
      </footer>
    </div>
  );

  if (pageNumber === 1) return renderPage1();
  if (pageNumber === 2) return renderPage2();

  return (
    <>
      {renderPage1()}
      {isTwoPage && renderPage2()}
    </>
  );
}
