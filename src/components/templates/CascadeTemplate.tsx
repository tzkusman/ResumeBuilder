import type { TemplateProps } from "./types";
import { splitResumeData, getSectionProps, getItemProps } from "./types";
import { ResumePhoto } from "../ResumePhoto";

export default function CascadeTemplate({ data, pageNumber, onSelectSection }: TemplateProps) {
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
    <div className="resume-sheet flex flex-col justify-between px-11 py-9 text-neutral-900 bg-white">
      <div>
        {/* Cascade Header */}
        <header className="relative pl-5 border-l-4 flex items-start justify-between gap-4" style={{ borderColor: accent }} {...getSectionProps("contact", onSelectSection)}>
          <div className="flex-1">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-neutral-900" {...getItemProps("contact", "fullName", undefined, onSelectSection)}>
              {c.fullName || "Candidate Name"}
            </h1>
            <p className="mt-1 text-sm font-semibold tracking-wide uppercase" style={{ color: accent }} {...getItemProps("contact", "title", undefined, onSelectSection)}>
              {c.title || "Professional Role"}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[11.5px] text-neutral-600 font-medium">
              {contactLine.map((item, idx) => (
                <span key={idx} className="flex items-center gap-1.5" {...getItemProps("contact", item.key, undefined, onSelectSection)}>
                  {idx > 0 && <span className="text-neutral-300">|</span>}
                  {item.val}
                </span>
              ))}
            </div>
          </div>
          <ResumePhoto contact={c} />
        </header>

        {/* Executive Summary */}
        {data.summary && (
          <section className="mt-5" {...getSectionProps("summary", onSelectSection)}>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-sm" style={{ background: accent }} />
              <h2 className="font-display text-[13.5px] font-bold uppercase tracking-wider text-neutral-800">Professional Summary</h2>
            </div>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-neutral-700 pl-4 border-l border-neutral-200" {...getItemProps("summary", "summary", undefined, onSelectSection)}>
              {data.summary}
            </p>
          </section>
        )}

        {/* Work Experience */}
        {xpPage1.length > 0 && (
          <section className="mt-5" {...getSectionProps("experience", onSelectSection)}>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-sm" style={{ background: accent }} />
              <h2 className="font-display text-[13.5px] font-bold uppercase tracking-wider text-neutral-800">
                Experience {isTwoPage && <span className="text-[10px] font-normal text-neutral-500">(Core Roles)</span>}
              </h2>
            </div>
            <div className="mt-2.5 space-y-3.5 pl-4 border-l border-neutral-200">
              {xpPage1.map((e) => (
                <div key={e.id} className="relative" {...getItemProps("experience", "role", e.id, onSelectSection)}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-[14px] font-bold text-neutral-900" {...getItemProps("experience", "role", e.id, onSelectSection)}>{e.role}</h3>
                    <span className="font-mono text-[10.5px] font-semibold text-neutral-500">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                  </div>
                  <p className="text-[12px] font-medium" style={{ color: accent }} {...getItemProps("experience", "company", e.id, onSelectSection)}>{e.company}{e.location && ` · ${e.location}`}</p>
                  <ul className="mt-1.5 space-y-1" {...getItemProps("experience", "bullets", e.id, onSelectSection)}>
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
          <section className="mt-7" {...getSectionProps("skills", onSelectSection)}>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-sm" style={{ background: accent }} />
              <h2 className="font-display text-[14px] font-bold uppercase tracking-wider text-neutral-800">Core Expertise</h2>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5 pl-4 border-l border-neutral-200">
              {data.skills.filter(Boolean).map((s, i) => (
                <span key={i} className="rounded-sm bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-800 border border-neutral-200" {...getItemProps("skills", "skills", undefined, onSelectSection)}>
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {eduPage1.length > 0 && (
          <section className="mt-7" {...getSectionProps("education", onSelectSection)}>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-sm" style={{ background: accent }} />
              <h2 className="font-display text-[14px] font-bold uppercase tracking-wider text-neutral-800">Education</h2>
            </div>
            <div className="mt-2 pl-4 border-l border-neutral-200 space-y-1.5">
              {eduPage1.map((ed) => (
                <div key={ed.id} className="flex items-baseline justify-between text-[12px]" {...getItemProps("education", "school", ed.id, onSelectSection)}>
                  <span className="font-bold text-neutral-800">{ed.degree} <span className="font-normal text-neutral-600">— {ed.school}</span></span>
                  <span className="font-mono text-[10.5px] text-neutral-500">{ed.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {projectsPage1.length > 0 && (
          <section className="mt-6" {...getSectionProps("projects", onSelectSection)}>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-sm" style={{ background: accent }} />
              <h2 className="font-display text-[14px] font-bold uppercase tracking-wider text-neutral-800">Key Projects</h2>
            </div>
            <div className="mt-2 pl-4 border-l border-neutral-200 space-y-2">
              {projectsPage1.map((p) => (
                <div key={p.id} {...getItemProps("projects", "title", p.id, onSelectSection)}>
                  <div className="flex items-baseline justify-between">
                    <h4 className="text-[13px] font-bold text-neutral-800">{p.title}</h4>
                    {p.date && <span className="font-mono text-[10px] text-neutral-500">{p.date}</span>}
                  </div>
                  {p.subtitle && <p className="text-[11.5px] text-neutral-500">{p.subtitle}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {certsPage1.length > 0 && (
          <section className="mt-5 pl-4 border-l border-neutral-200" {...getSectionProps("extras", onSelectSection)}>
            <p className="text-[11.5px] text-neutral-600" {...getItemProps("extras", "certifications", undefined, onSelectSection)}><strong className="text-neutral-800">Certifications:</strong> {certsPage1.join(" · ")}</p>
          </section>
        )}

        {(languagesPage1.length > 0 || volunteerPage1.length > 0) && (
          <section className="mt-5 grid grid-cols-2 gap-4 pl-4 border-l border-neutral-200">
            {languagesPage1.length > 0 && (
              <div>
                <p className="text-[11.5px] text-neutral-600"><strong className="text-neutral-800">Languages:</strong> {languagesPage1.join(", ")}</p>
              </div>
            )}
            {volunteerPage1.length > 0 && (
              <div>
                <p className="text-[11.5px] text-neutral-600"><strong className="text-neutral-800">Volunteering:</strong> {volunteerPage1.map((v) => v.role).join(", ")}</p>
              </div>
            )}
          </section>
        )}
      </div>

      <footer className="mt-6 border-t border-neutral-200 pt-2 flex items-center justify-between font-mono text-[10px] text-neutral-400">
        <span>Cascade Format</span>
        <span>{isTwoPage ? "Page 1 of 2" : "Page 1 of 1"}</span>
      </footer>
    </div>
  );

  const renderPage2 = () => (
    <div className="resume-sheet page-2 resume-page-break flex flex-col justify-between px-11 py-9 text-neutral-900 bg-white">
      <div>
        {xpPage2.length > 0 && (
          <section className="mt-0" {...getSectionProps("experience", onSelectSection)}>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-sm" style={{ background: accent }} />
              <h2 className="font-display text-[14px] font-bold uppercase tracking-wider text-neutral-800">Career History (Continued)</h2>
            </div>
            <div className="mt-3 space-y-4 pl-4 border-l border-neutral-200">
              {xpPage2.map((e) => (
                <div key={e.id} {...getItemProps("experience", "role", e.id, onSelectSection)}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-[13.5px] font-bold text-neutral-900" {...getItemProps("experience", "role", e.id, onSelectSection)}>{e.role}</h3>
                    <span className="font-mono text-[10.5px] font-semibold text-neutral-500">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                  </div>
                  <p className="text-[12px] font-medium" style={{ color: accent }} {...getItemProps("experience", "company", e.id, onSelectSection)}>{e.company}{e.location && ` · ${e.location}`}</p>
                  <ul className="mt-1 space-y-1" {...getItemProps("experience", "bullets", e.id, onSelectSection)}>
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

        {projectsPage2.length > 0 && (
          <section className="mt-3.5" {...getSectionProps("projects", onSelectSection)}>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-sm" style={{ background: accent }} />
              <h2 className="font-display text-[14px] font-bold uppercase tracking-wider text-neutral-800">Key Projects & Initiatives</h2>
            </div>
            <div className="mt-2 space-y-2 pl-4 border-l border-neutral-200">
              {projectsPage2.map((p) => (
                <div key={p.id} {...getItemProps("projects", "title", p.id, onSelectSection)}>
                  <div className="flex items-baseline justify-between">
                    <h4 className="text-[13px] font-bold text-neutral-800" {...getItemProps("projects", "title", p.id, onSelectSection)}>{p.title}</h4>
                    {p.date && <span className="font-mono text-[10px] text-neutral-500" {...getItemProps("projects", "date", p.id, onSelectSection)}>{p.date}</span>}
                  </div>
                  {p.subtitle && <p className="text-[11.5px] text-neutral-500" {...getItemProps("projects", "subtitle", p.id, onSelectSection)}>{p.subtitle}</p>}
                  <ul className="mt-0.5 space-y-0.5 text-[11.5px] text-neutral-700" {...getItemProps("projects", "bullets", p.id, onSelectSection)}>
                    {p.bullets.filter(Boolean).map((b, bi) => <li key={bi} {...getItemProps("projects", "bullets", p.id, onSelectSection)}>• {b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {eduPage2.length > 0 && (
          <section className="mt-3.5" {...getSectionProps("education", onSelectSection)}>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-sm" style={{ background: accent }} />
              <h2 className="font-display text-[14px] font-bold uppercase tracking-wider text-neutral-800">Education & Degrees</h2>
            </div>
            <div className="mt-2 pl-4 border-l border-neutral-200 space-y-1">
              {eduPage2.map((ed) => (
                <div key={ed.id} className="flex items-baseline justify-between text-[12px]" {...getItemProps("education", "school", ed.id, onSelectSection)}>
                  <span className="font-bold text-neutral-800" {...getItemProps("education", "degree", ed.id, onSelectSection)}>{ed.degree} <span className="font-normal text-neutral-600" {...getItemProps("education", "school", ed.id, onSelectSection)}>— {ed.school}</span></span>
                  <span className="font-mono text-[10.5px] text-neutral-500" {...getItemProps("education", "year", ed.id, onSelectSection)}>{ed.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {certsPage2.length > 0 && (
          <section className="mt-3.5" {...getSectionProps("extras", onSelectSection)}>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-sm" style={{ background: accent }} />
              <h2 className="font-display text-[14px] font-bold uppercase tracking-wider text-neutral-800">Certifications</h2>
            </div>
            <ul className="mt-1.5 pl-4 border-l border-neutral-200 space-y-0.5 text-[12px] text-neutral-700" {...getItemProps("extras", "certifications", undefined, onSelectSection)}>
              {certsPage2.map((c, i) => <li key={i} {...getItemProps("extras", "certifications", undefined, onSelectSection)}>• {c}</li>)}
            </ul>
          </section>
        )}

        {(languagesPage2.length > 0 || volunteerPage2.length > 0) && (
          <section className="mt-3.5 grid grid-cols-2 gap-4 pl-4 border-l border-neutral-200">
            {languagesPage2.length > 0 && (
              <div {...getSectionProps("extras", onSelectSection)}>
                <h3 className="text-xs font-bold uppercase text-neutral-800">Languages</h3>
                <p className="mt-1 text-[11.5px] text-neutral-600" {...getItemProps("extras", "languages", undefined, onSelectSection)}>{languagesPage2.join(", ")}</p>
              </div>
            )}
            {volunteerPage2.length > 0 && (
              <div {...getSectionProps("projects", onSelectSection)}>
                <h3 className="text-xs font-bold uppercase text-neutral-800">Leadership & Volunteering</h3>
                <div className="mt-1 space-y-1 text-[11.5px] text-neutral-600">
                  {volunteerPage2.map((v) => <p key={v.id} {...getItemProps("projects", "volunteer", v.id, onSelectSection)}><span className="font-semibold text-neutral-800">{v.role}</span> · {v.org}</p>)}
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      <footer className="mt-auto border-t border-neutral-200 pt-2 flex items-center justify-between font-mono text-[10px] text-neutral-400">
        <span>Cascade Format</span>
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
