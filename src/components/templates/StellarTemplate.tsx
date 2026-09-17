import type { TemplateProps } from "./types";
import { splitResumeData, getSectionProps, getItemProps } from "./types";
import { ResumePhoto } from "../ResumePhoto";

export default function StellarTemplate({ data, pageNumber, onSelectSection }: TemplateProps) {
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
    <div className="resume-sheet flex text-neutral-900 bg-white">
      {/* Left Stellar Column */}
      <aside className="w-[240px] shrink-0 bg-[#f8fafc] border-r border-neutral-200 px-6 py-8 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="h-1.5 w-8 rounded-full" style={{ background: accent }} />
            <ResumePhoto contact={c} size={56} />
          </div>
          <div {...getSectionProps("contact", onSelectSection)}>
            <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900 leading-snug" {...getItemProps("contact", "fullName", undefined, onSelectSection)}>
              {c.fullName || "Candidate Name"}
            </h1>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-neutral-500" {...getItemProps("contact", "title", undefined, onSelectSection)}>
              {c.title || "Professional Role"}
            </p>

            <div className="mt-4 space-y-1.5 text-[11px] text-neutral-600 font-medium">
              {contactLine.map((item, idx) => (
                <p key={idx} className="break-words" {...getItemProps("contact", item.key, undefined, onSelectSection)}>{item.val}</p>
              ))}
            </div>
          </div>

          {/* Skills */}
          {data.skills.length > 0 && (
            <div className="mt-5" {...getSectionProps("skills", onSelectSection)}>
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Expertise</h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {data.skills.filter(Boolean).map((sk, i) => (
                  <span key={i} className="rounded-full bg-white border border-neutral-200 px-2.5 py-0.5 text-[10.5px] font-medium text-neutral-700 shadow-xs" {...getItemProps("skills", "skills", undefined, onSelectSection)}>
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education on Page 1 */}
          {eduPage1.length > 0 && (
            <div className="mt-5" {...getSectionProps("education", onSelectSection)}>
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Education</h2>
              <div className="mt-2 space-y-1.5 text-[11.5px]">
                {eduPage1.map((ed) => (
                  <div key={ed.id} {...getItemProps("education", "school", ed.id, onSelectSection)}>
                    <p className="font-bold text-neutral-800">{ed.degree}</p>
                    <p className="text-neutral-500 text-[10.5px]">{ed.school} ({ed.year})</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certsPage1.length > 0 && (
            <div className="mt-5" {...getSectionProps("extras", onSelectSection)}>
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Certifications</h2>
              <ul className="mt-1.5 space-y-1 text-[11px] text-neutral-600" {...getItemProps("extras", "certifications", undefined, onSelectSection)}>
                {certsPage1.map((c, i) => <li key={i}>• {c}</li>)}
              </ul>
            </div>
          )}

          {languagesPage1.length > 0 && (
            <div className="mt-4" {...getSectionProps("extras", onSelectSection)}>
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Languages</h2>
              <p className="mt-1 text-[11px] text-neutral-600">{languagesPage1.join(", ")}</p>
            </div>
          )}
        </div>

        <p className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">
          Curriculum Vitae
        </p>
      </aside>

      {/* Main Narrative Column */}
      <main className="flex-1 px-8 py-8 flex flex-col justify-between">
        <div>
          {/* Summary */}
          {data.summary && (
            <section className="mb-5" {...getSectionProps("summary", onSelectSection)}>
              <h2 className="font-mono text-[10.5px] font-bold uppercase tracking-[0.22em] text-neutral-400">Executive Summary</h2>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-neutral-700" {...getItemProps("summary", "summary", undefined, onSelectSection)}>
                {data.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {xpPage1.length > 0 && (
            <section {...getSectionProps("experience", onSelectSection)}>
              <h2 className="font-mono text-[10.5px] font-bold uppercase tracking-[0.22em] text-neutral-400">
                Experience {isTwoPage && <span className="text-[9.5px] font-normal text-neutral-400">(Selected)</span>}
              </h2>
              <div className="mt-2.5 space-y-3.5">
                {xpPage1.map((e) => (
                  <div key={e.id} {...getItemProps("experience", "role", e.id, onSelectSection)}>
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-[14px] font-bold text-neutral-900" {...getItemProps("experience", "role", e.id, onSelectSection)}>{e.role}</h3>
                      <span className="font-mono text-[10px] font-medium text-neutral-400">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                    </div>
                    <p className="text-[12px] font-medium" style={{ color: accent }} {...getItemProps("experience", "company", e.id, onSelectSection)}>{e.company}{e.location && ` · ${e.location}`}</p>
                    <ul className="mt-1.5 space-y-1" {...getItemProps("experience", "bullets", e.id, onSelectSection)}>
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

          {/* Projects Page 1 */}
          {projectsPage1.length > 0 && (
            <section className="mt-6" {...getSectionProps("projects", onSelectSection)}>
              <h2 className="font-mono text-[10.5px] font-bold uppercase tracking-[0.22em] text-neutral-400">Key Projects</h2>
              <div className="mt-3 space-y-2">
                {projectsPage1.map((p) => (
                  <div key={p.id} className="rounded-sm border border-neutral-200 p-2.5 bg-[#fafafa]" {...getItemProps("projects", "title", p.id, onSelectSection)}>
                    <div className="flex items-baseline justify-between">
                      <h4 className="text-[12.5px] font-bold text-neutral-900">{p.title}</h4>
                      {p.date && <span className="font-mono text-[10px] text-neutral-400">{p.date}</span>}
                    </div>
                    {p.subtitle && <p className="text-[11px] text-neutral-500">{p.subtitle}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <footer className="mt-6 border-t border-neutral-100 pt-2 flex items-center justify-between font-mono text-[9.5px] text-neutral-400">
          <span>Stellar Format</span>
          <span>{isTwoPage ? "Page 1 of 2" : "Page 1 of 1"}</span>
        </footer>
      </main>
    </div>
  );

  const renderPage2 = () => (
    <div className="resume-sheet page-2 resume-page-break flex text-neutral-900 bg-white">
      {/* Left Column Page 2 */}
      <aside className="w-[240px] shrink-0 bg-[#f8fafc] border-r border-neutral-200 px-6 py-8 flex flex-col justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase font-bold text-neutral-500 tracking-wider mb-4">Page 2</p>

          {/* Education */}
          {eduPage2.length > 0 && (
            <div className="mt-4" {...getSectionProps("education", onSelectSection)}>
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Education</h2>
              <div className="mt-2 space-y-1.5 text-[11.5px]">
                {eduPage2.map((ed) => (
                  <div key={ed.id} {...getItemProps("education", "school", ed.id, onSelectSection)}>
                    <p className="font-bold text-neutral-800">{ed.degree}</p>
                    <p className="text-neutral-500 text-[10.5px]">{ed.school}</p>
                    <p className="font-mono text-[10px] text-neutral-400">{ed.year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certsPage2.length > 0 && (
            <div className="mt-5" {...getSectionProps("extras", onSelectSection)}>
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Certifications</h2>
              <ul className="mt-1.5 space-y-1 text-[11px] text-neutral-600" {...getItemProps("extras", "certifications", undefined, onSelectSection)}>
                {certsPage2.map((c, i) => <li key={i}>• {c}</li>)}
              </ul>
            </div>
          )}

          {/* Languages */}
          {languagesPage2.length > 0 && (
            <div className="mt-5" {...getSectionProps("extras", onSelectSection)}>
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Languages</h2>
              <p className="mt-1 text-[11px] text-neutral-600" {...getItemProps("extras", "languages", undefined, onSelectSection)}>{languagesPage2.join(", ")}</p>
            </div>
          )}

          {/* Volunteer */}
          {volunteerPage2.length > 0 && (
            <div className="mt-5" {...getSectionProps("projects", onSelectSection)}>
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Civic Roles</h2>
              <div className="mt-1 space-y-1 text-[11px] text-neutral-600">
                {volunteerPage2.map((v) => <p key={v.id} {...getItemProps("projects", "volunteer", v.id, onSelectSection)}><span className="font-bold">{v.role}</span> ({v.org})</p>)}
              </div>
            </div>
          )}
        </div>

        <p className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">
          Page 2 of 2
        </p>
      </aside>

      {/* Main Narrative Page 2 */}
      <main className="flex-1 px-8 py-8 flex flex-col justify-between">
        <div>
          {/* Continuing Experience */}
          {xpPage2.length > 0 && (
            <section className="mb-5" {...getSectionProps("experience", onSelectSection)}>
              <h2 className="font-mono text-[10.5px] font-bold uppercase tracking-[0.22em] text-neutral-400">Career History (Continued)</h2>
              <div className="mt-2.5 space-y-3.5">
                {xpPage2.map((e) => (
                  <div key={e.id} {...getItemProps("experience", "role", e.id, onSelectSection)}>
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-[13.5px] font-bold text-neutral-900" {...getItemProps("experience", "role", e.id, onSelectSection)}>{e.role}</h3>
                      <span className="font-mono text-[10px] font-medium text-neutral-400">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                    </div>
                    <p className="text-[11.5px] font-medium" style={{ color: accent }} {...getItemProps("experience", "company", e.id, onSelectSection)}>{e.company}{e.location && ` · ${e.location}`}</p>
                    <ul className="mt-1 space-y-1" {...getItemProps("experience", "bullets", e.id, onSelectSection)}>
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
          {projectsPage2.length > 0 && (
            <section {...getSectionProps("projects", onSelectSection)}>
              <h2 className="font-mono text-[10.5px] font-bold uppercase tracking-[0.22em] text-neutral-400">Featured Projects & Milestones</h2>
              <div className="mt-3.5 space-y-3">
                {projectsPage2.map((p) => (
                  <div key={p.id} className="rounded-sm border border-neutral-200 p-3 bg-[#fafafa]" {...getItemProps("projects", "title", p.id, onSelectSection)}>
                    <div className="flex items-baseline justify-between">
                      <h4 className="text-[13px] font-bold text-neutral-900" {...getItemProps("projects", "title", p.id, onSelectSection)}>{p.title}</h4>
                      {p.date && <span className="font-mono text-[10px] text-neutral-400">{p.date}</span>}
                    </div>
                    {p.subtitle && <p className="text-[11px] text-neutral-500" {...getItemProps("projects", "subtitle", p.id, onSelectSection)}>{p.subtitle}</p>}
                    <ul className="mt-1 space-y-0.5 text-[11.5px] text-neutral-700" {...getItemProps("projects", "bullets", p.id, onSelectSection)}>
                      {p.bullets.filter(Boolean).map((b, bi) => <li key={bi}>• {b}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <footer className="mt-6 border-t border-neutral-100 pt-2 flex items-center justify-between font-mono text-[9.5px] text-neutral-400">
          <span>Stellar Format</span>
          <span>Page 2 of 2</span>
        </footer>
      </main>
    </div>
  );

  return renderPage1();
}
