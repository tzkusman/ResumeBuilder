import type { ResumeData } from "../../lib/types";
import { splitResumeData } from "./types";

export default function StandardPage2({ data }: { data: ResumeData }) {
  const { edu, xpPage2, projects, volunteer, contact: c, accent } = splitResumeData(data);

  return (
    <div className="resume-sheet page-2 resume-page-break flex flex-col justify-between p-11 text-neutral-900 bg-white">
      <div>
        {/* Running Header */}
        <header className="border-b-2 pb-3.5 flex items-baseline justify-between" style={{ borderColor: accent }}>
          <div>
            <span className="font-display text-lg font-bold text-neutral-900">{c.fullName || "Candidate Name"}</span>
            <span className="ml-3 font-mono text-xs uppercase tracking-wider text-neutral-500">{c.title}</span>
          </div>
          <span className="font-mono text-[10.5px] font-bold uppercase tracking-widest text-neutral-400">Page 2 of 2</span>
        </header>

        {/* Continuing Experience */}
        {xpPage2.length > 0 && (
          <section className="mt-6">
            <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: accent }}>
              Work History (Continued)
            </h2>
            <div className="mt-3.5 space-y-4">
              {xpPage2.map((e) => (
                <div key={e.id}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-[13.5px] font-bold text-neutral-900">{e.role}</h3>
                    <span className="font-mono text-[10.5px] text-neutral-500 font-semibold">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                  </div>
                  <p className="text-[12px] font-semibold text-neutral-700">{e.company}{e.location && ` · ${e.location}`}</p>
                  <ul className="mt-1.5 space-y-1">
                    {e.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-[12px] leading-relaxed text-neutral-700">
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
        {projects.length > 0 && (
          <section className="mt-6">
            <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: accent }}>
              Key Projects & Milestones
            </h2>
            <div className="mt-3 space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="border-l-2 pl-3" style={{ borderColor: accent }}>
                  <div className="flex items-baseline justify-between">
                    <h4 className="text-[13px] font-bold text-neutral-900">{p.title}</h4>
                    {p.date && <span className="font-mono text-[10px] text-neutral-500">{p.date}</span>}
                  </div>
                  {p.subtitle && <p className="text-[11.5px] text-neutral-600 italic">{p.subtitle}</p>}
                  <ul className="mt-1 space-y-0.5 text-[11.5px] text-neutral-700">
                    {p.bullets.filter(Boolean).map((b, bi) => <li key={bi}>• {b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {edu.length > 0 && (
          <section className="mt-6">
            <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: accent }}>
              Education & Academic Background
            </h2>
            <div className="mt-2.5 space-y-1.5 text-[12px]">
              {edu.map((ed) => (
                <div key={ed.id} className="flex items-baseline justify-between">
                  <span className="font-bold text-neutral-800">{ed.degree} — <span className="font-normal text-neutral-600">{ed.school}</span></span>
                  <span className="font-mono text-[10.5px] text-neutral-500">{ed.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications & Licenses */}
        {data.certifications.length > 0 && (
          <section className="mt-6">
            <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: accent }}>
              Certifications & Professional Credentials
            </h2>
            <ul className="mt-2 space-y-1 text-[12px] text-neutral-700">
              {data.certifications.map((cert, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full" style={{ background: accent }} />
                  {cert}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Languages & Volunteering */}
        {(data.languages.length > 0 || volunteer.length > 0) && (
          <section className="mt-6 grid grid-cols-2 gap-4">
            {data.languages.length > 0 && (
              <div>
                <h3 className="font-mono text-[10.5px] font-bold uppercase tracking-[0.2em] text-neutral-500">Languages</h3>
                <p className="mt-1 text-[12px] text-neutral-700">{data.languages.join(", ")}</p>
              </div>
            )}
            {volunteer.length > 0 && (
              <div>
                <h3 className="font-mono text-[10.5px] font-bold uppercase tracking-[0.2em] text-neutral-500">Volunteering & Leadership</h3>
                <div className="mt-1 space-y-1 text-[11.5px] text-neutral-700">
                  {volunteer.map((v) => <p key={v.id}><span className="font-semibold">{v.role}</span> · {v.org}</p>)}
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-6 border-t border-neutral-200 pt-2 flex items-center justify-between font-mono text-[10px] text-neutral-400">
        <span>{c.fullName || "Resume"}</span>
        <span>Page 2 of 2</span>
      </footer>
    </div>
  );
}
