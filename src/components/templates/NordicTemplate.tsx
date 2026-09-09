import type { TemplateProps } from "./types";
import { splitResumeData } from "./types";

export default function NordicTemplate({ data, pageNumber }: TemplateProps) {
  const { isTwoPage, edu, xpPage1, xpPage2, projects, volunteer, contact: c, accent } = splitResumeData(data);
  const contactLine = [c.email, c.phone, c.location, c.website, c.linkedin].filter(Boolean);

  const renderPage1 = () => (
    <div className="resume-sheet flex flex-col justify-between p-12 text-[#1c1c1c] bg-[#fafafa]">
      <div>
        {/* Nordic Clean Header */}
        <header className="border-b border-neutral-300 pb-7">
          <div className="flex items-baseline justify-between">
            <h1 className="font-display text-4xl font-light tracking-tight text-neutral-900">
              {c.fullName || "Candidate Name"}
            </h1>
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-neutral-400">Nordic · Minimal</span>
          </div>
          <p className="mt-1.5 font-mono text-sm tracking-wide text-neutral-600 uppercase" style={{ color: accent }}>
            {c.title || "Professional Title"}
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-neutral-500 font-mono">
            {contactLine.map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-neutral-300">/</span>}
                {item}
              </span>
            ))}
          </div>
        </header>

        {/* Profile */}
        {data.summary && (
          <section className="mt-7">
            <h2 className="font-mono text-[10.5px] uppercase tracking-[0.28em] font-bold text-neutral-400">01 / Profile</h2>
            <p className="mt-2.5 text-[13px] leading-relaxed text-neutral-700 font-serif max-w-[680px]">
              {data.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {xpPage1.length > 0 && (
          <section className="mt-7">
            <h2 className="font-mono text-[10.5px] uppercase tracking-[0.28em] font-bold text-neutral-400">
              02 / Work Experience {isTwoPage && <span className="text-[9px] font-normal tracking-normal text-neutral-400">(Recent)</span>}
            </h2>
            <div className="mt-3.5 space-y-5">
              {xpPage1.map((e) => (
                <div key={e.id} className="group">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-[15px] font-semibold text-neutral-900">{e.role}</h3>
                    <span className="font-mono text-[10.5px] text-neutral-400">{[e.start, e.end].filter(Boolean).join(" — ")}</span>
                  </div>
                  <p className="text-[12.5px] font-medium text-neutral-600">
                    {e.company}{e.location ? ` · ${e.location}` : ""}
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {e.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[12px] leading-relaxed text-neutral-700">
                        <span className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-full" style={{ background: accent }} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills (if 1-page or first page) */}
        {data.skills.length > 0 && (
          <section className="mt-7">
            <h2 className="font-mono text-[10.5px] uppercase tracking-[0.28em] font-bold text-neutral-400">
              {isTwoPage ? "03 / Core Competencies" : "03 / Skills"}
            </h2>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {data.skills.filter(Boolean).map((sk, i) => (
                <span key={i} className="border border-neutral-200 bg-white px-2.5 py-1 font-mono text-[11px] text-neutral-700">
                  {sk}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* If 1 page, render education, certs, languages on Page 1 */}
        {!isTwoPage && (
          <>
            {edu.length > 0 && (
              <section className="mt-7">
                <h2 className="font-mono text-[10.5px] uppercase tracking-[0.28em] font-bold text-neutral-400">04 / Education</h2>
                <div className="mt-2.5 space-y-2">
                  {edu.map((ed) => (
                    <div key={ed.id} className="flex items-baseline justify-between text-[12.5px]">
                      <span className="font-semibold text-neutral-800">{ed.degree} — <span className="font-normal text-neutral-600">{ed.school}</span></span>
                      <span className="font-mono text-[10.5px] text-neutral-400">{ed.year}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.certifications.length > 0 && (
              <section className="mt-6">
                <h2 className="font-mono text-[10.5px] uppercase tracking-[0.28em] font-bold text-neutral-400">05 / Certifications</h2>
                <p className="mt-1.5 text-[12px] text-neutral-600">{data.certifications.join(" · ")}</p>
              </section>
            )}
          </>
        )}
      </div>

      {/* Page Footer */}
      <footer className="mt-8 border-t border-neutral-200 pt-3 flex items-center justify-between font-mono text-[10px] text-neutral-400">
        <span>{c.fullName || "Resume"}</span>
        <span>{isTwoPage ? "Page 1 of 2" : "Page 1 of 1"}</span>
      </footer>
    </div>
  );

  const renderPage2 = () => (
    <div className="resume-sheet page-2 resume-page-break flex flex-col justify-between p-12 text-[#1c1c1c] bg-[#fafafa]">
      <div>
        {/* Running Header */}
        <header className="border-b border-neutral-300 pb-4 flex items-baseline justify-between">
          <div>
            <span className="font-display text-lg font-semibold text-neutral-800">{c.fullName || "Candidate Name"}</span>
            <span className="ml-3 font-mono text-xs text-neutral-500 uppercase">{c.title}</span>
          </div>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-neutral-400">Page 2 of 2</span>
        </header>

        {/* Continuing Experience */}
        {xpPage2.length > 0 && (
          <section className="mt-6">
            <h2 className="font-mono text-[10.5px] uppercase tracking-[0.28em] font-bold text-neutral-400">
              04 / Career History (Continued)
            </h2>
            <div className="mt-3.5 space-y-4">
              {xpPage2.map((e) => (
                <div key={e.id}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-[14.5px] font-semibold text-neutral-900">{e.role}</h3>
                    <span className="font-mono text-[10.5px] text-neutral-400">{[e.start, e.end].filter(Boolean).join(" — ")}</span>
                  </div>
                  <p className="text-[12px] text-neutral-600">{e.company}{e.location ? ` · ${e.location}` : ""}</p>
                  <ul className="mt-1.5 space-y-1">
                    {e.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[12px] leading-relaxed text-neutral-700">
                        <span className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-full" style={{ background: accent }} />
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
          <section className="mt-6">
            <h2 className="font-mono text-[10.5px] uppercase tracking-[0.28em] font-bold text-neutral-400">
              05 / Key Deliverables & Projects
            </h2>
            <div className="mt-3 space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="border-l-2 pl-3 border-neutral-300">
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-display text-[13.5px] font-semibold text-neutral-900">{p.title}</h4>
                    {p.date && <span className="font-mono text-[10.5px] text-neutral-400">{p.date}</span>}
                  </div>
                  {p.subtitle && <p className="font-mono text-[11px] text-neutral-500">{p.subtitle}</p>}
                  <ul className="mt-1 space-y-1">
                    {p.bullets.filter(Boolean).map((b, bi) => (
                      <li key={bi} className="text-[12px] text-neutral-700 leading-snug">• {b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {edu.length > 0 && (
          <section className="mt-6">
            <h2 className="font-mono text-[10.5px] uppercase tracking-[0.28em] font-bold text-neutral-400">
              06 / Education & Academic Credentials
            </h2>
            <div className="mt-2.5 space-y-2">
              {edu.map((ed) => (
                <div key={ed.id} className="flex items-baseline justify-between text-[12.5px]">
                  <span className="font-semibold text-neutral-800">{ed.degree} — <span className="font-normal text-neutral-600">{ed.school}</span></span>
                  <span className="font-mono text-[10.5px] text-neutral-400">{ed.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications & Licenses */}
        {data.certifications.length > 0 && (
          <section className="mt-6">
            <h2 className="font-mono text-[10.5px] uppercase tracking-[0.28em] font-bold text-neutral-400">
              07 / Certifications & Accreditations
            </h2>
            <ul className="mt-2 space-y-1 text-[12px] text-neutral-700">
              {data.certifications.map((c, i) => <li key={i} className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-neutral-400" />{c}</li>)}
            </ul>
          </section>
        )}

        {/* Languages & Volunteer */}
        {(data.languages.length > 0 || volunteer.length > 0) && (
          <section className="mt-6 grid grid-cols-2 gap-4">
            {data.languages.length > 0 && (
              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] font-bold text-neutral-400">Languages</h3>
                <p className="mt-1.5 text-[12px] text-neutral-700">{data.languages.join(", ")}</p>
              </div>
            )}
            {volunteer.length > 0 && (
              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] font-bold text-neutral-400">Volunteering</h3>
                <div className="mt-1.5 space-y-1 text-[11.5px] text-neutral-700">
                  {volunteer.map((v) => <p key={v.id}><span className="font-semibold">{v.role}</span> · {v.org} {v.year && `(${v.year})`}</p>)}
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Page 2 Footer */}
      <footer className="mt-8 border-t border-neutral-200 pt-3 flex items-center justify-between font-mono text-[10px] text-neutral-400">
        <span>{c.fullName || "Resume"}</span>
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
