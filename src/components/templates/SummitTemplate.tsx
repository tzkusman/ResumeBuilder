import type { TemplateProps } from "./types";
import { splitResumeData, getSectionProps, getItemProps } from "./types";
import { ResumePhoto } from "../ResumePhoto";

export default function SummitTemplate({ data, pageNumber, onSelectSection }: TemplateProps) {
  const {
    isTwoPage,
    xpPage1,
    xpPage2,
    eduPage1,
    eduPage2,
    projectsPage1,
    projectsPage2,
    certsPage1,
    certsPage2,
    languagesPage1,
    languagesPage2,
    volunteerPage1,
    volunteerPage2,
    contact: c,
    accent
  } = splitResumeData(data);
  const contactLine = [
    { key: "email", val: c.email },
    { key: "phone", val: c.phone },
    { key: "location", val: c.location },
    { key: "website", val: c.website },
    { key: "linkedin", val: c.linkedin }
  ].filter((item) => Boolean(item.val));

  const renderPage1 = () => (
    <div className="resume-sheet flex flex-col justify-between px-11 py-9 text-slate-900 bg-[#fdfdfd]">
      <div>
        {/* Summit Executive Header Card */}
        <header className="border-2 border-slate-900 p-4.5 bg-slate-50/70 flex items-start justify-between gap-4" {...getSectionProps("contact", onSelectSection)}>
          <div className="flex-1">
            <div className="flex items-baseline justify-between border-b border-slate-300 pb-2">
              <h1 className="font-display text-3xl font-black tracking-tight text-slate-900 uppercase" {...getItemProps("contact", "fullName", undefined, onSelectSection)}>
                {c.fullName || "Candidate Name"}
              </h1>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Executive Brief</span>
            </div>
            <p className="mt-1.5 text-sm font-bold tracking-widest uppercase" style={{ color: accent }} {...getItemProps("contact", "title", undefined, onSelectSection)}>
              {c.title || "Executive Role"}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] text-slate-600">
              {contactLine.map((item, idx) => (
                <span key={idx} {...getItemProps("contact", item.key, undefined, onSelectSection)}>{item.val}</span>
              ))}
            </div>
          </div>
          <ResumePhoto contact={c} />
        </header>

        {/* Executive Summary */}
        {data.summary && (
          <section className="mt-5" {...getSectionProps("summary", onSelectSection)}>
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1">
              <h2 className="font-display text-[13px] font-black uppercase tracking-wider text-slate-900">Executive Profile</h2>
              <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400">Leadership & Vision</span>
            </div>
            <p className="mt-2 text-[12.5px] leading-relaxed text-slate-700 font-serif" {...getItemProps("summary", "summary", undefined, onSelectSection)}>
              {data.summary}
            </p>
          </section>
        )}

        {/* Core Experience */}
        {xpPage1.length > 0 && (
          <section className="mt-5" {...getSectionProps("experience", onSelectSection)}>
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1">
              <h2 className="font-display text-[13px] font-black uppercase tracking-wider text-slate-900">
                Professional Leadership {isTwoPage && <span className="text-[10px] font-normal text-slate-500">(Senior Roles)</span>}
              </h2>
              <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400">Impact & Scale</span>
            </div>
            <div className="mt-2.5 space-y-3.5">
              {xpPage1.map((e) => (
                <div key={e.id} {...getItemProps("experience", "role", e.id, onSelectSection)}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-[14.5px] font-bold text-slate-900" {...getItemProps("experience", "role", e.id, onSelectSection)}>{e.role}</h3>
                    <span className="font-mono text-[10.5px] font-semibold text-slate-500">{[e.start, e.end].filter(Boolean).join(" — ")}</span>
                  </div>
                  <p className="text-[12px] font-semibold" style={{ color: accent }} {...getItemProps("experience", "company", e.id, onSelectSection)}>{e.company}{e.location && ` · ${e.location}`}</p>
                  <ul className="mt-1.5 space-y-1" {...getItemProps("experience", "bullets", e.id, onSelectSection)}>
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
          <section className="mt-7" {...getSectionProps("skills", onSelectSection)}>
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1">
              <h2 className="font-display text-[13px] font-black uppercase tracking-wider text-slate-900">Core Competencies</h2>
              <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400">Strategy & Governance</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {data.skills.filter(Boolean).map((sk, i) => (
                <div key={i} className="border border-slate-300 bg-white p-1.5 text-center font-mono text-[10.5px] font-semibold text-slate-800" {...getItemProps("skills", "skills", undefined, onSelectSection)}>
                  {sk}
                </div>
              ))}
            </div>
          </section>
        )}

        {eduPage1.length > 0 && (
          <section className="mt-7" {...getSectionProps("education", onSelectSection)}>
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1">
              <h2 className="font-display text-[13px] font-black uppercase tracking-wider text-slate-900">Education & Board Credentials</h2>
            </div>
            <div className="mt-2 space-y-1.5 text-[12px]">
              {eduPage1.map((ed) => (
                <div key={ed.id} className="flex items-baseline justify-between" {...getItemProps("education", "school", ed.id, onSelectSection)}>
                  <span className="font-bold text-slate-800">{ed.degree} — <span className="font-normal text-slate-600">{ed.school}</span></span>
                  <span className="font-mono text-[10px] text-slate-500">{ed.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {projectsPage1.length > 0 && (
          <section className="mt-6" {...getSectionProps("projects", onSelectSection)}>
            <div className="border-b-2 border-slate-900 pb-1">
              <h2 className="font-display text-[13px] font-black uppercase tracking-wider text-slate-900">Key Initiatives</h2>
            </div>
            <div className="mt-2 space-y-2">
              {projectsPage1.map((p) => (
                <div key={p.id} className="border-l-2 border-slate-400 pl-3" {...getItemProps("projects", "title", p.id, onSelectSection)}>
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-bold text-[13px] text-slate-900">{p.title}</h4>
                    {p.date && <span className="font-mono text-[10px] text-slate-500">{p.date}</span>}
                  </div>
                  {p.subtitle && <p className="text-[11px] text-slate-500 font-mono">{p.subtitle}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {certsPage1.length > 0 && (
          <section className="mt-5" {...getSectionProps("extras", onSelectSection)}>
            <div className="border-b border-slate-300 pb-1">
              <h3 className="font-display text-[11.5px] font-bold uppercase tracking-wider text-slate-900">Credentials</h3>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-2 text-[11px] text-slate-700">
              {certsPage1.map((c, i) => (
                <span key={i} className="border border-slate-200 bg-white px-2 py-0.5">✓ {c}</span>
              ))}
            </div>
          </section>
        )}
      </div>

      <footer className="mt-8 border-t border-slate-300 pt-2 flex items-center justify-between font-mono text-[10px] text-slate-400 uppercase">
        <span>Confidential Resume</span>
        <span>Executive Resume</span>
      </footer>
    </div>
  );

  const renderPage2 = () => (
    <div className="resume-sheet page-2 resume-page-break flex flex-col justify-between px-11 py-9 text-slate-900 bg-[#fdfdfd]">
      <div>
        {xpPage2.length > 0 && (
          <section className="mt-0" {...getSectionProps("experience", onSelectSection)}>
            <div className="border-b-2 border-slate-900 pb-1">
              <h2 className="font-display text-[13px] font-black uppercase tracking-wider text-slate-900">Earlier Career Progression</h2>
            </div>
            <div className="mt-3.5 space-y-3.5">
              {xpPage2.map((e) => (
                <div key={e.id} {...getItemProps("experience", "role", e.id, onSelectSection)}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-[14px] font-bold text-slate-900" {...getItemProps("experience", "role", e.id, onSelectSection)}>{e.role}</h3>
                    <span className="font-mono text-[10px] font-semibold text-slate-500">{[e.start, e.end].filter(Boolean).join(" — ")}</span>
                  </div>
                  <p className="text-[11.5px] font-semibold" style={{ color: accent }} {...getItemProps("experience", "company", e.id, onSelectSection)}>{e.company}{e.location && ` · ${e.location}`}</p>
                  <ul className="mt-1 space-y-1" {...getItemProps("experience", "bullets", e.id, onSelectSection)}>
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

        {projectsPage2.length > 0 && (
          <section className="mt-3.5" {...getSectionProps("projects", onSelectSection)}>
            <div className="border-b-2 border-slate-900 pb-1">
              <h2 className="font-display text-[13px] font-black uppercase tracking-wider text-slate-900">Key Programs & Transformational Initiatives</h2>
            </div>
            <div className="mt-2 space-y-2">
              {projectsPage2.map((p) => (
                <div key={p.id} className="border-l-2 border-slate-400 pl-3" {...getItemProps("projects", "title", p.id, onSelectSection)}>
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-bold text-[13px] text-slate-900" {...getItemProps("projects", "title", p.id, onSelectSection)}>{p.title}</h4>
                    {p.date && <span className="font-mono text-[10px] text-slate-500" {...getItemProps("projects", "date", p.id, onSelectSection)}>{p.date}</span>}
                  </div>
                  {p.subtitle && <p className="text-[11px] text-slate-500 font-mono" {...getItemProps("projects", "subtitle", p.id, onSelectSection)}>{p.subtitle}</p>}
                  <ul className="mt-0.5 space-y-0.5 text-[11.5px] text-slate-700" {...getItemProps("projects", "bullets", p.id, onSelectSection)}>
                    {p.bullets.filter(Boolean).map((b, bi) => <li key={bi} {...getItemProps("projects", "bullets", p.id, onSelectSection)}>• {b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {eduPage2.length > 0 && (
          <section className="mt-3.5" {...getSectionProps("education", onSelectSection)}>
            <div className="border-b-2 border-slate-900 pb-1">
              <h2 className="font-display text-[13px] font-black uppercase tracking-wider text-slate-900">Education & Executive Credentials</h2>
            </div>
            <div className="mt-2 space-y-1 text-[12px]">
              {eduPage2.map((ed) => (
                <div key={ed.id} className="flex items-baseline justify-between" {...getItemProps("education", "school", ed.id, onSelectSection)}>
                  <span className="font-bold text-slate-800" {...getItemProps("education", "degree", ed.id, onSelectSection)}>{ed.degree} — <span className="font-normal text-slate-600" {...getItemProps("education", "school", ed.id, onSelectSection)}>{ed.school}</span></span>
                  <span className="font-mono text-[10px] text-slate-500" {...getItemProps("education", "year", ed.id, onSelectSection)}>{ed.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {certsPage2.length > 0 && (
          <section className="mt-3.5" {...getSectionProps("extras", onSelectSection)}>
            <div className="border-b-2 border-slate-900 pb-1">
              <h2 className="font-display text-[13px] font-black uppercase tracking-wider text-slate-900">Certifications & Advisory Boards</h2>
            </div>
            <div className="mt-1.5 grid grid-cols-2 gap-2 text-[11.5px] text-slate-700">
              {certsPage2.map((c, i) => (
                <div key={i} className="border border-slate-200 bg-white p-1.5" {...getItemProps("extras", "certifications", undefined, onSelectSection)}>✓ {c}</div>
              ))}
            </div>
          </section>
        )}

        {(languagesPage2.length > 0 || volunteerPage2.length > 0) && (
          <section className="mt-3.5 grid grid-cols-2 gap-4">
            {languagesPage2.length > 0 && (
              <div {...getSectionProps("extras", onSelectSection)}>
                <h3 className="font-display text-xs font-black uppercase text-slate-900">Languages</h3>
                <p className="mt-1 text-[11.5px] text-slate-600 font-mono" {...getItemProps("extras", "languages", undefined, onSelectSection)}>{languagesPage2.join(", ")}</p>
              </div>
            )}
            {volunteerPage2.length > 0 && (
              <div {...getSectionProps("projects", onSelectSection)}>
                <h3 className="font-display text-xs font-black uppercase text-slate-900">Board & Civic Service</h3>
                <div className="mt-1 space-y-1 text-[11.5px] text-slate-600">
                  {volunteerPage2.map((v) => <p key={v.id} {...getItemProps("projects", "volunteer", v.id, onSelectSection)}><span className="font-bold text-slate-800">{v.role}</span> · {v.org}</p>)}
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      <footer className="mt-auto border-t border-slate-300 pt-2 flex items-center justify-between font-mono text-[10px] text-slate-400 uppercase">
        <span>Confidential Resume</span>
        <span>Page 2 of 2</span>
      </footer>
    </div>
  );

  return renderPage1();
}
