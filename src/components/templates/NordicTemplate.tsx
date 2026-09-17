import type { TemplateProps } from "./types";
import { splitResumeData, getSectionProps, getItemProps } from "./types";
import { ResumePhoto } from "../ResumePhoto";

export default function NordicTemplate({ data, pageNumber, onSelectSection }: TemplateProps) {
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
    <div className="resume-sheet flex flex-col justify-between px-11 py-9 text-[#1c1c1c] bg-[#fafafa]">
      <div>
        {/* Nordic Clean Header */}
        <header className="border-b border-neutral-300 pb-4 flex items-start justify-between gap-4" {...getSectionProps("contact", onSelectSection)}>
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <h1 className="font-display text-3xl font-light tracking-tight text-neutral-900" {...getItemProps("contact", "fullName", undefined, onSelectSection)}>
                {c.fullName || "Candidate Name"}
              </h1>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">Nordic · Minimal</span>
            </div>
            <p className="mt-1 font-mono text-sm tracking-wide text-neutral-600 uppercase" style={{ color: accent }} {...getItemProps("contact", "title", undefined, onSelectSection)}>
              {c.title || "Professional Title"}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[11.5px] text-neutral-500 font-mono">
              {contactLine.map((item, i) => (
                <span key={i} className="flex items-center gap-1.5" {...getItemProps("contact", item.key, undefined, onSelectSection)}>
                  {i > 0 && <span className="text-neutral-300">/</span>}
                  {item.val}
                </span>
              ))}
            </div>
          </div>
          <ResumePhoto contact={c} />
        </header>

        {/* Profile */}
        {data.summary && (
          <section className="mt-5" {...getSectionProps("summary", onSelectSection)}>
            <h2 className="font-mono text-[10.5px] uppercase tracking-[0.28em] font-bold text-neutral-400">01 / Profile</h2>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-neutral-700 font-serif max-w-[680px]" {...getItemProps("summary", "summary", undefined, onSelectSection)}>
              {data.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {xpPage1.length > 0 && (
          <section className="mt-5" {...getSectionProps("experience", onSelectSection)}>
            <h2 className="font-mono text-[10.5px] uppercase tracking-[0.28em] font-bold text-neutral-400">
              02 / Work Experience {isTwoPage && <span className="text-[9px] font-normal tracking-normal text-neutral-400">(Recent)</span>}
            </h2>
            <div className="mt-2.5 space-y-3.5">
              {xpPage1.map((e) => (
                <div key={e.id} className="group" {...getItemProps("experience", "role", e.id, onSelectSection)}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-[14px] font-semibold text-neutral-900" {...getItemProps("experience", "role", e.id, onSelectSection)}>{e.role}</h3>
                    <span className="font-mono text-[10px] text-neutral-400">{[e.start, e.end].filter(Boolean).join(" — ")}</span>
                  </div>
                  <p className="text-[12px] font-medium text-neutral-600" {...getItemProps("experience", "company", e.id, onSelectSection)}>
                    {e.company}{e.location ? ` · ${e.location}` : ""}
                  </p>
                  <ul className="mt-1 space-y-1" {...getItemProps("experience", "bullets", e.id, onSelectSection)}>
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
          <section className="mt-5" {...getSectionProps("skills", onSelectSection)}>
            <h2 className="font-mono text-[10.5px] uppercase tracking-[0.28em] font-bold text-neutral-400">
              {isTwoPage ? "03 / Core Competencies" : "03 / Skills"}
            </h2>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {data.skills.filter(Boolean).map((sk, i) => (
                <span key={i} className="border border-neutral-200 bg-white px-2.5 py-1 font-mono text-[11px] text-neutral-700" {...getItemProps("skills", "skills", undefined, onSelectSection)}>
                  {sk}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Education Page 1 */}
        {eduPage1.length > 0 && (
          <section className="mt-7" {...getSectionProps("education", onSelectSection)}>
            <h2 className="font-mono text-[10.5px] uppercase tracking-[0.28em] font-bold text-neutral-400">04 / Education</h2>
            <div className="mt-2.5 space-y-2">
              {eduPage1.map((ed) => (
                <div key={ed.id} className="flex items-baseline justify-between text-[12.5px]" {...getItemProps("education", "school", ed.id, onSelectSection)}>
                  <span className="font-semibold text-neutral-800">{ed.degree} — <span className="font-normal text-neutral-600">{ed.school}</span></span>
                  <span className="font-mono text-[10.5px] text-neutral-400">{ed.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Page 1 */}
        {projectsPage1.length > 0 && (
          <section className="mt-7" {...getSectionProps("projects", onSelectSection)}>
            <h2 className="font-mono text-[10.5px] uppercase tracking-[0.28em] font-bold text-neutral-400">05 / Key Deliverables</h2>
            <div className="mt-2.5 space-y-2.5">
              {projectsPage1.map((p) => (
                <div key={p.id} className="border-l-2 pl-3 border-neutral-300" {...getItemProps("projects", "title", p.id, onSelectSection)}>
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-display text-[13.5px] font-semibold text-neutral-900">{p.title}</h4>
                    {p.date && <span className="font-mono text-[10px] text-neutral-400">{p.date}</span>}
                  </div>
                  {p.subtitle && <p className="font-mono text-[11px] text-neutral-500">{p.subtitle}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications Page 1 */}
        {certsPage1.length > 0 && (
          <section className="mt-6" {...getSectionProps("extras", onSelectSection)}>
            <h2 className="font-mono text-[10.5px] uppercase tracking-[0.28em] font-bold text-neutral-400">06 / Certifications</h2>
            <p className="mt-1.5 text-[12px] text-neutral-600" {...getItemProps("extras", "certifications", undefined, onSelectSection)}>{certsPage1.join(" · ")}</p>
          </section>
        )}

        {/* Languages & Volunteer Page 1 */}
        {(languagesPage1.length > 0 || volunteerPage1.length > 0) && (
          <section className="mt-6 grid grid-cols-2 gap-4">
            {languagesPage1.length > 0 && (
              <div {...getSectionProps("extras", onSelectSection)}>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] font-bold text-neutral-400">Languages</h3>
                <p className="mt-1.5 text-[12px] text-neutral-700" {...getItemProps("extras", "languages", undefined, onSelectSection)}>{languagesPage1.join(", ")}</p>
              </div>
            )}
            {volunteerPage1.length > 0 && (
              <div {...getSectionProps("projects", onSelectSection)}>
                <div className="mt-1.5 space-y-1 text-[11.5px] text-neutral-700">
                  {volunteerPage1.map((v) => <p key={v.id} {...getItemProps("projects", "volunteer", v.id, onSelectSection)}><span className="font-semibold">{v.role}</span> · {v.org}</p>)}
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Page Footer */}
      <footer className="mt-8 border-t border-neutral-200 pt-3 flex items-center justify-between font-mono text-[10px] text-neutral-400">
        <span>Nordic Minimal</span>
        <span>Curriculum Vitae</span>
      </footer>
    </div>
  );

  const renderPage2 = () => (
    <div className="resume-sheet page-2 resume-page-break flex flex-col justify-between px-11 py-9 text-[#1c1c1c] bg-[#fafafa]">
      <div>
        {/* Continuing Experience */}
        {xpPage2.length > 0 && (
          <section className="mt-0" {...getSectionProps("experience", onSelectSection)}>
            <h2 className="font-mono text-[10.5px] uppercase tracking-[0.28em] font-bold text-neutral-400">
              04 / Career History (Continued)
            </h2>
            <div className="mt-2.5 space-y-2.5">
              {xpPage2.map((e) => (
                <div key={e.id} {...getItemProps("experience", "role", e.id, onSelectSection)}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-[14.5px] font-semibold text-neutral-900" {...getItemProps("experience", "role", e.id, onSelectSection)}>{e.role}</h3>
                    <span className="font-mono text-[10.5px] text-neutral-400" {...getItemProps("experience", "start", e.id, onSelectSection)}>{[e.start, e.end].filter(Boolean).join(" — ")}</span>
                  </div>
                  <p className="text-[12px] text-neutral-600" {...getItemProps("experience", "company", e.id, onSelectSection)}>{e.company}{e.location ? ` · ${e.location}` : ""}</p>
                  <ul className="mt-1 space-y-0.5" {...getItemProps("experience", "bullets", e.id, onSelectSection)}>
                    {e.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[12px] leading-relaxed text-neutral-700" {...getItemProps("experience", "bullets", e.id, onSelectSection)}>
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
        {projectsPage2.length > 0 && (
          <section className="mt-3.5" {...getSectionProps("projects", onSelectSection)}>
            <h2 className="font-mono text-[10.5px] uppercase tracking-[0.28em] font-bold text-neutral-400">
              05 / Key Deliverables & Projects
            </h2>
            <div className="mt-2 space-y-2">
              {projectsPage2.map((p) => (
                <div key={p.id} className="border-l-2 pl-3 border-neutral-300" {...getItemProps("projects", "title", p.id, onSelectSection)}>
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-display text-[13.5px] font-semibold text-neutral-900" {...getItemProps("projects", "title", p.id, onSelectSection)}>{p.title}</h4>
                    {p.date && <span className="font-mono text-[10.5px] text-neutral-400" {...getItemProps("projects", "date", p.id, onSelectSection)}>{p.date}</span>}
                  </div>
                  {p.subtitle && <p className="font-mono text-[11px] text-neutral-500" {...getItemProps("projects", "subtitle", p.id, onSelectSection)}>{p.subtitle}</p>}
                  <ul className="mt-1 space-y-0.5" {...getItemProps("projects", "bullets", p.id, onSelectSection)}>
                    {p.bullets.filter(Boolean).map((b, bi) => (
                      <li key={bi} className="text-[12px] text-neutral-700 leading-snug" {...getItemProps("projects", "bullets", p.id, onSelectSection)}>• {b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {eduPage2.length > 0 && (
          <section className="mt-3.5" {...getSectionProps("education", onSelectSection)}>
            <h2 className="font-mono text-[10.5px] uppercase tracking-[0.28em] font-bold text-neutral-400">
              06 / Education & Academic Credentials
            </h2>
            <div className="mt-2 space-y-1.5">
              {eduPage2.map((ed) => (
                <div key={ed.id} className="flex items-baseline justify-between text-[12.5px]" {...getItemProps("education", "school", ed.id, onSelectSection)}>
                  <span className="font-semibold text-neutral-800" {...getItemProps("education", "degree", ed.id, onSelectSection)}>{ed.degree} — <span className="font-normal text-neutral-600" {...getItemProps("education", "school", ed.id, onSelectSection)}>{ed.school}</span></span>
                  <span className="font-mono text-[10.5px] text-neutral-400" {...getItemProps("education", "year", ed.id, onSelectSection)}>{ed.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications & Licenses */}
        {certsPage2.length > 0 && (
          <section className="mt-3.5" {...getSectionProps("extras", onSelectSection)}>
            <h2 className="font-mono text-[10.5px] uppercase tracking-[0.28em] font-bold text-neutral-400">
              07 / Certifications & Accreditations
            </h2>
            <ul className="mt-1.5 space-y-0.5 text-[12px] text-neutral-700" {...getItemProps("extras", "certifications", undefined, onSelectSection)}>
              {certsPage2.map((c, i) => <li key={i} className="flex items-center gap-2" {...getItemProps("extras", "certifications", undefined, onSelectSection)}><span className="h-1 w-1 rounded-full bg-neutral-400" />{c}</li>)}
            </ul>
          </section>
        )}

        {/* Languages & Volunteer */}
        {(languagesPage2.length > 0 || volunteerPage2.length > 0) && (
          <section className="mt-3.5 grid grid-cols-2 gap-4">
            {languagesPage2.length > 0 && (
              <div {...getSectionProps("extras", onSelectSection)}>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] font-bold text-neutral-400">Languages</h3>
                <p className="mt-1 text-[12px] text-neutral-700" {...getItemProps("extras", "languages", undefined, onSelectSection)}>{languagesPage2.join(", ")}</p>
              </div>
            )}
            {volunteerPage2.length > 0 && (
              <div {...getSectionProps("projects", onSelectSection)}>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] font-bold text-neutral-400">Volunteering</h3>
                <div className="mt-1 space-y-1 text-[11.5px] text-neutral-700">
                  {volunteerPage2.map((v) => <p key={v.id} {...getItemProps("projects", "volunteer", v.id, onSelectSection)}><span className="font-semibold">{v.role}</span> · {v.org} {v.year && `(${v.year})`}</p>)}
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Page 2 Footer */}
      <footer className="mt-auto border-t border-neutral-200 pt-2 flex items-center justify-between font-mono text-[10px] text-neutral-400">
        <span>Nordic Minimal</span>
        <span>Page 2 of 2</span>
      </footer>
    </div>
  );

  return renderPage1();
}
