import type { TemplateProps } from "./types";
import { splitResumeData } from "./types";

export default function StellarTemplate({ data, pageNumber }: TemplateProps) {
  const { isTwoPage, edu, xpPage1, xpPage2, projects, volunteer, contact: c, accent } = splitResumeData(data);
  const contactLine = [c.email, c.phone, c.location, c.website, c.linkedin].filter(Boolean);

  const renderPage1 = () => (
    <div className="resume-sheet flex overflow-hidden text-neutral-900 bg-white">
      {/* Left Stellar Column */}
      <aside className="w-[260px] shrink-0 bg-[#f8fafc] border-r border-neutral-200 p-8 flex flex-col justify-between">
        <div>
          <div className="h-1.5 w-10 mb-6 rounded-full" style={{ background: accent }} />
          <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900 leading-snug">
            {c.fullName || "Candidate Name"}
          </h1>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-neutral-500">
            {c.title || "Professional Role"}
          </p>

          <div className="mt-6 space-y-2 text-[11px] text-neutral-600 font-medium">
            {contactLine.map((s, idx) => (
              <p key={idx} className="break-words">{s}</p>
            ))}
          </div>

          {/* Skills */}
          {data.skills.length > 0 && (
            <div className="mt-8">
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Expertise</h2>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {data.skills.filter(Boolean).map((sk, i) => (
                  <span key={i} className="rounded-full bg-white border border-neutral-200 px-2.5 py-0.5 text-[10.5px] font-medium text-neutral-700 shadow-xs">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education if single page */}
          {!isTwoPage && edu.length > 0 && (
            <div className="mt-8">
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Education</h2>
              <div className="mt-2.5 space-y-2 text-[11.5px]">
                {edu.map((ed) => (
                  <div key={ed.id}>
                    <p className="font-bold text-neutral-800">{ed.degree}</p>
                    <p className="text-neutral-500 text-[10.5px]">{ed.school} ({ed.year})</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isTwoPage && data.certifications.length > 0 && (
            <div className="mt-8">
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Certifications</h2>
              <ul className="mt-2 space-y-1 text-[11px] text-neutral-600">
                {data.certifications.map((c, i) => <li key={i}>• {c}</li>)}
              </ul>
            </div>
          )}
        </div>

        <p className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">
          {isTwoPage ? "Page 1 of 2" : "Page 1 of 1"}
        </p>
      </aside>

      {/* Main Narrative Column */}
      <main className="flex-1 p-9 flex flex-col justify-between">
        <div>
          {/* Summary */}
          {data.summary && (
            <section className="mb-7">
              <h2 className="font-mono text-[10.5px] font-bold uppercase tracking-[0.22em] text-neutral-400">Executive Summary</h2>
              <p className="mt-2 text-[12.5px] leading-relaxed text-neutral-700">
                {data.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {xpPage1.length > 0 && (
            <section>
              <h2 className="font-mono text-[10.5px] font-bold uppercase tracking-[0.22em] text-neutral-400">
                Experience {isTwoPage && <span className="text-[9.5px] font-normal text-neutral-400">(Selected)</span>}
              </h2>
              <div className="mt-4 space-y-5">
                {xpPage1.map((e) => (
                  <div key={e.id}>
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-[14px] font-bold text-neutral-900">{e.role}</h3>
                      <span className="font-mono text-[10px] font-medium text-neutral-400">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                    </div>
                    <p className="text-[12px] font-medium" style={{ color: accent }}>{e.company}{e.location && ` · ${e.location}`}</p>
                    <ul className="mt-1.5 space-y-1">
                      {e.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-[12px] leading-relaxed text-neutral-700">
                          <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <footer className="mt-6 border-t border-neutral-100 pt-2 flex items-center justify-between font-mono text-[9.5px] text-neutral-400">
          <span>{c.fullName || "Candidate"}</span>
          <span>Stellar Flow</span>
        </footer>
      </main>
    </div>
  );

  const renderPage2 = () => (
    <div className="resume-sheet page-2 resume-page-break flex overflow-hidden text-neutral-900 bg-white">
      {/* Left Column Page 2 */}
      <aside className="w-[260px] shrink-0 bg-[#f8fafc] border-r border-neutral-200 p-8 flex flex-col justify-between">
        <div>
          <div className="h-1.5 w-10 mb-6 rounded-full" style={{ background: accent }} />
          <h3 className="font-display text-lg font-bold text-neutral-900">{c.fullName || "Candidate Name"}</h3>
          <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">Page 2 Documentation</p>

          {/* Education */}
          {edu.length > 0 && (
            <div className="mt-7">
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Education</h2>
              <div className="mt-2.5 space-y-2 text-[11.5px]">
                {edu.map((ed) => (
                  <div key={ed.id}>
                    <p className="font-bold text-neutral-800">{ed.degree}</p>
                    <p className="text-neutral-500 text-[10.5px]">{ed.school}</p>
                    <p className="font-mono text-[10px] text-neutral-400">{ed.year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <div className="mt-7">
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Certifications</h2>
              <ul className="mt-2 space-y-1 text-[11px] text-neutral-600">
                {data.certifications.map((c, i) => <li key={i}>• {c}</li>)}
              </ul>
            </div>
          )}

          {/* Languages */}
          {data.languages.length > 0 && (
            <div className="mt-7">
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Languages</h2>
              <p className="mt-1 text-[11px] text-neutral-600">{data.languages.join(", ")}</p>
            </div>
          )}

          {/* Volunteer */}
          {volunteer.length > 0 && (
            <div className="mt-7">
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Civic Roles</h2>
              <div className="mt-1 space-y-1 text-[11px] text-neutral-600">
                {volunteer.map((v) => <p key={v.id}><span className="font-bold">{v.role}</span> ({v.org})</p>)}
              </div>
            </div>
          )}
        </div>

        <p className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">
          Page 2 of 2
        </p>
      </aside>

      {/* Main Narrative Page 2 */}
      <main className="flex-1 p-9 flex flex-col justify-between">
        <div>
          {/* Continuing Experience */}
          {xpPage2.length > 0 && (
            <section className="mb-7">
              <h2 className="font-mono text-[10.5px] font-bold uppercase tracking-[0.22em] text-neutral-400">Career History (Continued)</h2>
              <div className="mt-4 space-y-4">
                {xpPage2.map((e) => (
                  <div key={e.id}>
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-[13.5px] font-bold text-neutral-900">{e.role}</h3>
                      <span className="font-mono text-[10px] font-medium text-neutral-400">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                    </div>
                    <p className="text-[11.5px] font-medium" style={{ color: accent }}>{e.company}{e.location && ` · ${e.location}`}</p>
                    <ul className="mt-1 space-y-1">
                      {e.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11.5px] leading-relaxed text-neutral-700">
                          <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
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
          {projects.length > 0 && (
            <section>
              <h2 className="font-mono text-[10.5px] font-bold uppercase tracking-[0.22em] text-neutral-400">Featured Projects & Milestones</h2>
              <div className="mt-3.5 space-y-3">
                {projects.map((p) => (
                  <div key={p.id} className="rounded-sm border border-neutral-200 p-3 bg-[#fafafa]">
                    <div className="flex items-baseline justify-between">
                      <h4 className="text-[13px] font-bold text-neutral-900">{p.title}</h4>
                      {p.date && <span className="font-mono text-[10px] text-neutral-400">{p.date}</span>}
                    </div>
                    {p.subtitle && <p className="text-[11px] text-neutral-500">{p.subtitle}</p>}
                    <ul className="mt-1 space-y-0.5 text-[11.5px] text-neutral-700">
                      {p.bullets.filter(Boolean).map((b, bi) => <li key={bi}>• {b}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <footer className="mt-6 border-t border-neutral-100 pt-2 flex items-center justify-between font-mono text-[9.5px] text-neutral-400">
          <span>{c.fullName || "Candidate"}</span>
          <span>Page 2 of 2</span>
        </footer>
      </main>
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
