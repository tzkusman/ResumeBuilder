import type { TemplateProps } from "./types";
import { splitResumeData } from "./types";

export default function SummitTemplate({ data, pageNumber }: TemplateProps) {
  const { isTwoPage, edu, xpPage1, xpPage2, projects, volunteer, contact: c, accent } = splitResumeData(data);
  const contactLine = [c.email, c.phone, c.location, c.website, c.linkedin].filter(Boolean);

  const renderPage1 = () => (
    <div className="resume-sheet flex flex-col justify-between p-12 text-slate-900 bg-[#fdfdfd]">
      <div>
        {/* Summit Executive Header Card */}
        <header className="border-2 border-slate-900 p-6 bg-slate-50/70">
          <div className="flex items-baseline justify-between border-b border-slate-300 pb-3">
            <h1 className="font-display text-3xl font-black tracking-tight text-slate-900 uppercase">
              {c.fullName || "Candidate Name"}
            </h1>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Executive Brief</span>
          </div>
          <p className="mt-2 text-sm font-bold tracking-widest uppercase" style={{ color: accent }}>
            {c.title || "Executive Role"}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] text-slate-600">
            {contactLine.map((s, idx) => (
              <span key={idx}>{s}</span>
            ))}
          </div>
        </header>

        {/* Executive Summary */}
        {data.summary && (
          <section className="mt-7">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1">
              <h2 className="font-display text-[13px] font-black uppercase tracking-wider text-slate-900">Executive Profile</h2>
              <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400">Leadership & Vision</span>
            </div>
            <p className="mt-2.5 text-[12.5px] leading-relaxed text-slate-700 font-serif">
              {data.summary}
            </p>
          </section>
        )}

        {/* Core Experience */}
        {xpPage1.length > 0 && (
          <section className="mt-7">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1">
              <h2 className="font-display text-[13px] font-black uppercase tracking-wider text-slate-900">
                Professional Leadership {isTwoPage && <span className="text-[10px] font-normal text-slate-500">(Senior Roles)</span>}
              </h2>
              <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400">Impact & Scale</span>
            </div>
            <div className="mt-3.5 space-y-4">
              {xpPage1.map((e) => (
                <div key={e.id}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-[14.5px] font-bold text-slate-900">{e.role}</h3>
                    <span className="font-mono text-[10.5px] font-semibold text-slate-500">{[e.start, e.end].filter(Boolean).join(" — ")}</span>
                  </div>
                  <p className="text-[12px] font-semibold" style={{ color: accent }}>{e.company}{e.location && ` · ${e.location}`}</p>
                  <ul className="mt-1.5 space-y-1">
                    {e.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[12px] leading-relaxed text-slate-700">
                        <span className="mt-[7px] h-1 w-2 shrink-0 rounded-xs" style={{ background: accent }} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Competencies */}
        {data.skills.length > 0 && (
          <section className="mt-7">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1">
              <h2 className="font-display text-[13px] font-black uppercase tracking-wider text-slate-900">Core Competencies</h2>
              <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400">Strategy & Governance</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {data.skills.filter(Boolean).map((sk, i) => (
                <div key={i} className="border border-slate-300 bg-white p-1.5 text-center font-mono text-[10.5px] font-semibold text-slate-800">
                  {sk}
                </div>
              ))}
            </div>
          </section>
        )}

        {!isTwoPage && (
          <>
            {edu.length > 0 && (
              <section className="mt-7">
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1">
                  <h2 className="font-display text-[13px] font-black uppercase tracking-wider text-slate-900">Education & Board Credentials</h2>
                </div>
                <div className="mt-2 space-y-1.5 text-[12px]">
                  {edu.map((ed) => (
                    <div key={ed.id} className="flex items-baseline justify-between">
                      <span className="font-bold text-slate-800">{ed.degree} — <span className="font-normal text-slate-600">{ed.school}</span></span>
                      <span className="font-mono text-[10px] text-slate-500">{ed.year}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      <footer className="mt-8 border-t border-slate-300 pt-2 flex items-center justify-between font-mono text-[10px] text-slate-400 uppercase">
        <span>Confidential Resume · {c.fullName || "Candidate"}</span>
        <span>{isTwoPage ? "Page 1 of 2" : "Page 1 of 1"}</span>
      </footer>
    </div>
  );

  const renderPage2 = () => (
    <div className="resume-sheet page-2 resume-page-break flex flex-col justify-between p-12 text-slate-900 bg-[#fdfdfd]">
      <div>
        <header className="border-b-2 border-slate-900 pb-3 flex items-baseline justify-between">
          <div>
            <span className="font-display text-xl font-bold uppercase text-slate-900">{c.fullName || "Candidate Name"}</span>
            <span className="ml-3 font-mono text-xs uppercase text-slate-500">Executive Dossier</span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Page 2 of 2</span>
        </header>

        {xpPage2.length > 0 && (
          <section className="mt-6">
            <div className="border-b-2 border-slate-900 pb-1">
              <h2 className="font-display text-[13px] font-black uppercase tracking-wider text-slate-900">Earlier Career Progression</h2>
            </div>
            <div className="mt-3.5 space-y-3.5">
              {xpPage2.map((e) => (
                <div key={e.id}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-[14px] font-bold text-slate-900">{e.role}</h3>
                    <span className="font-mono text-[10px] font-semibold text-slate-500">{[e.start, e.end].filter(Boolean).join(" — ")}</span>
                  </div>
                  <p className="text-[11.5px] font-semibold" style={{ color: accent }}>{e.company}{e.location && ` · ${e.location}`}</p>
                  <ul className="mt-1 space-y-1">
                    {e.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11.5px] leading-relaxed text-slate-700">
                        <span className="mt-[6px] h-1 w-1.5 shrink-0" style={{ background: accent }} />
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
            <div className="border-b-2 border-slate-900 pb-1">
              <h2 className="font-display text-[13px] font-black uppercase tracking-wider text-slate-900">Key Programs & Transformational Initiatives</h2>
            </div>
            <div className="mt-3 space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="border-l-2 border-slate-400 pl-3">
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-bold text-[13px] text-slate-900">{p.title}</h4>
                    {p.date && <span className="font-mono text-[10px] text-slate-500">{p.date}</span>}
                  </div>
                  {p.subtitle && <p className="text-[11px] text-slate-500 font-mono">{p.subtitle}</p>}
                  <ul className="mt-1 space-y-0.5 text-[11.5px] text-slate-700">
                    {p.bullets.filter(Boolean).map((b, bi) => <li key={bi}>• {b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {edu.length > 0 && (
          <section className="mt-6">
            <div className="border-b-2 border-slate-900 pb-1">
              <h2 className="font-display text-[13px] font-black uppercase tracking-wider text-slate-900">Education & Executive Credentials</h2>
            </div>
            <div className="mt-2.5 space-y-1.5 text-[12px]">
              {edu.map((ed) => (
                <div key={ed.id} className="flex items-baseline justify-between">
                  <span className="font-bold text-slate-800">{ed.degree} — <span className="font-normal text-slate-600">{ed.school}</span></span>
                  <span className="font-mono text-[10px] text-slate-500">{ed.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.certifications.length > 0 && (
          <section className="mt-6">
            <div className="border-b-2 border-slate-900 pb-1">
              <h2 className="font-display text-[13px] font-black uppercase tracking-wider text-slate-900">Certifications & Advisory Boards</h2>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-[11.5px] text-slate-700">
              {data.certifications.map((c, i) => (
                <div key={i} className="border border-slate-200 bg-white p-1.5">✓ {c}</div>
              ))}
            </div>
          </section>
        )}

        {(data.languages.length > 0 || volunteer.length > 0) && (
          <section className="mt-6 grid grid-cols-2 gap-4">
            {data.languages.length > 0 && (
              <div>
                <h3 className="font-display text-xs font-black uppercase text-slate-900">Languages</h3>
                <p className="mt-1 text-[11.5px] text-slate-600 font-mono">{data.languages.join(", ")}</p>
              </div>
            )}
            {volunteer.length > 0 && (
              <div>
                <h3 className="font-display text-xs font-black uppercase text-slate-900">Board & Civic Service</h3>
                <div className="mt-1 space-y-1 text-[11.5px] text-slate-600">
                  {volunteer.map((v) => <p key={v.id}><span className="font-bold text-slate-800">{v.role}</span> · {v.org}</p>)}
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      <footer className="mt-8 border-t border-slate-300 pt-2 flex items-center justify-between font-mono text-[10px] text-slate-400 uppercase">
        <span>Confidential Resume · {c.fullName || "Candidate"}</span>
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
