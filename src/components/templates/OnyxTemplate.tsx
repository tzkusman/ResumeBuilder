import type { TemplateProps } from "./types";
import { splitResumeData } from "./types";

export default function OnyxTemplate({ data, pageNumber }: TemplateProps) {
  const { isTwoPage, edu, xpPage1, xpPage2, projects, volunteer, contact: c, accent } = splitResumeData(data);
  const contactLine = [c.email, c.phone, c.location, c.website, c.linkedin].filter(Boolean);

  const renderPage1 = () => (
    <div className="resume-sheet flex flex-col justify-between p-11 text-[#111] bg-white">
      <div>
        {/* Onyx Top Accent Bar */}
        <div className="h-2 w-full mb-6" style={{ background: accent }} />

        {/* Header */}
        <header className="flex items-start justify-between border-b-2 border-neutral-900 pb-5">
          <div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-neutral-900">
              {c.fullName || "Candidate Name"}
            </h1>
            <p className="mt-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
              {c.title || "Professional Title"}
            </p>
          </div>
          <div className="text-right space-y-1 font-mono text-[11px] text-neutral-600">
            {contactLine.map((s, idx) => (
              <p key={idx}>{s}</p>
            ))}
          </div>
        </header>

        {/* Executive Summary */}
        {data.summary && (
          <section className="mt-6">
            <h2 className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-neutral-900 flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-neutral-900" /> Professional Summary
            </h2>
            <p className="mt-2 text-[12.5px] leading-relaxed text-neutral-700">
              {data.summary}
            </p>
          </section>
        )}

        {/* Work Experience */}
        {xpPage1.length > 0 && (
          <section className="mt-6">
            <h2 className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-neutral-900 flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-neutral-900" /> Work History {isTwoPage && <span className="text-[9.5px] font-normal text-neutral-500">(Primary)</span>}
            </h2>
            <div className="mt-3 space-y-4">
              {xpPage1.map((e) => (
                <div key={e.id} className="border-l border-neutral-300 pl-3.5">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-[14px] font-bold text-neutral-900">{e.role}</h3>
                    <span className="font-mono text-[10.5px] bg-neutral-100 px-1.5 py-0.5 text-neutral-600 font-semibold">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                  </div>
                  <p className="text-[12px] font-semibold" style={{ color: accent }}>{e.company}{e.location && ` · ${e.location}`}</p>
                  <ul className="mt-1.5 space-y-1">
                    {e.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-[12px] leading-relaxed text-neutral-700">
                        <span className="mt-[6px] h-1 w-1 shrink-0 bg-neutral-900" />
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
          <section className="mt-6">
            <h2 className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-neutral-900 flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-neutral-900" /> Competencies & Tooling
            </h2>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {data.skills.filter(Boolean).map((sk, i) => (
                <span key={i} className="border border-neutral-900 bg-neutral-900 text-white px-2 py-0.5 font-mono text-[10.5px] font-bold">
                  {sk}
                </span>
              ))}
            </div>
          </section>
        )}

        {!isTwoPage && (
          <>
            {edu.length > 0 && (
              <section className="mt-6">
                <h2 className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-neutral-900 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-neutral-900" /> Education
                </h2>
                <div className="mt-2 space-y-1 text-[12px]">
                  {edu.map((ed) => (
                    <div key={ed.id} className="flex items-baseline justify-between">
                      <span className="font-bold text-neutral-900">{ed.degree} — <span className="font-normal text-neutral-700">{ed.school}</span></span>
                      <span className="font-mono text-[10.5px] text-neutral-500">{ed.year}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.certifications.length > 0 && (
              <section className="mt-5">
                <p className="font-mono text-[11px] text-neutral-700"><strong className="text-neutral-900 font-bold">CERTS:</strong> {data.certifications.join(" | ")}</p>
              </section>
            )}
          </>
        )}
      </div>

      <footer className="mt-6 border-t-2 border-neutral-900 pt-2 flex items-center justify-between font-mono text-[10px] text-neutral-500">
        <span>{c.fullName || "Resume"} // ONYX</span>
        <span>{isTwoPage ? "Page 01 / 02" : "Page 01 / 01"}</span>
      </footer>
    </div>
  );

  const renderPage2 = () => (
    <div className="resume-sheet page-2 resume-page-break flex flex-col justify-between p-11 text-[#111] bg-white">
      <div>
        <div className="h-2 w-full mb-6" style={{ background: accent }} />

        <header className="flex items-baseline justify-between border-b-2 border-neutral-900 pb-3">
          <span className="font-display text-lg font-extrabold text-neutral-900">{c.fullName || "Candidate Name"} // DOSSIER</span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">Page 02 / 02</span>
        </header>

        {xpPage2.length > 0 && (
          <section className="mt-6">
            <h2 className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-neutral-900 flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-neutral-900" /> Career History (Cont.)
            </h2>
            <div className="mt-3 space-y-3.5">
              {xpPage2.map((e) => (
                <div key={e.id} className="border-l border-neutral-300 pl-3.5">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-[13.5px] font-bold text-neutral-900">{e.role}</h3>
                    <span className="font-mono text-[10px] bg-neutral-100 px-1.5 py-0.5 text-neutral-600 font-semibold">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                  </div>
                  <p className="text-[11.5px] font-semibold" style={{ color: accent }}>{e.company}{e.location && ` · ${e.location}`}</p>
                  <ul className="mt-1 space-y-1">
                    {e.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11.5px] text-neutral-700">
                        <span className="mt-[6px] h-1 w-1 shrink-0 bg-neutral-900" />
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
            <h2 className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-neutral-900 flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-neutral-900" /> Technical Projects & Systems
            </h2>
            <div className="mt-3 space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="border border-neutral-200 p-3 bg-neutral-50/50">
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-mono text-[12.5px] font-bold text-neutral-900">{p.title}</h4>
                    {p.date && <span className="font-mono text-[10px] text-neutral-500">{p.date}</span>}
                  </div>
                  {p.subtitle && <p className="font-mono text-[11px] text-neutral-600">{p.subtitle}</p>}
                  <ul className="mt-1 space-y-0.5 text-[11.5px] text-neutral-700">
                    {p.bullets.filter(Boolean).map((b, bi) => <li key={bi}>- {b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {edu.length > 0 && (
          <section className="mt-6">
            <h2 className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-neutral-900 flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-neutral-900" /> Education & Academia
            </h2>
            <div className="mt-2 space-y-1.5 text-[12px]">
              {edu.map((ed) => (
                <div key={ed.id} className="flex items-baseline justify-between">
                  <span className="font-bold text-neutral-900">{ed.degree} — <span className="font-normal text-neutral-700">{ed.school}</span></span>
                  <span className="font-mono text-[10px] text-neutral-500">{ed.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.certifications.length > 0 && (
          <section className="mt-6">
            <h2 className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-neutral-900 flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-neutral-900" /> Certifications & Compliance
            </h2>
            <div className="mt-2 flex flex-wrap gap-2 text-[11.5px]">
              {data.certifications.map((c, i) => (
                <span key={i} className="border border-neutral-300 px-2 py-0.5 font-mono text-[10.5px] text-neutral-800">
                  {c}
                </span>
              ))}
            </div>
          </section>
        )}

        {(data.languages.length > 0 || volunteer.length > 0) && (
          <section className="mt-6 grid grid-cols-2 gap-4">
            {data.languages.length > 0 && (
              <div>
                <h3 className="font-mono text-[10.5px] font-bold uppercase text-neutral-900">Languages</h3>
                <p className="mt-1 text-[11.5px] text-neutral-700 font-mono">{data.languages.join(", ")}</p>
              </div>
            )}
            {volunteer.length > 0 && (
              <div>
                <h3 className="font-mono text-[10.5px] font-bold uppercase text-neutral-900">Community & Volunteering</h3>
                <div className="mt-1 space-y-1 text-[11.5px] text-neutral-700">
                  {volunteer.map((v) => <p key={v.id}><span className="font-bold">{v.role}</span> · {v.org}</p>)}
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      <footer className="mt-6 border-t-2 border-neutral-900 pt-2 flex items-center justify-between font-mono text-[10px] text-neutral-500">
        <span>{c.fullName || "Resume"} // ONYX</span>
        <span>Page 02 / 02</span>
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
