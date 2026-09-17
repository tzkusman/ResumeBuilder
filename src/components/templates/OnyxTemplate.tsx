import type { TemplateProps } from "./types";
import { splitResumeData, getSectionProps, getItemProps } from "./types";
import { ResumePhoto } from "../ResumePhoto";

export default function OnyxTemplate({ data, pageNumber, onSelectSection }: TemplateProps) {
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
    <div className="resume-sheet flex flex-col justify-between px-11 py-9 text-[#111] bg-white">
      <div>
        {/* Onyx Top Accent Bar - Page 1 Only */}
        <div className="h-1.5 w-full mb-4" style={{ background: accent }} />

        {/* Header - Page 1 Only */}
        <header className="flex items-start justify-between border-b-2 border-neutral-900 pb-4 gap-4" {...getSectionProps("contact", onSelectSection)}>
          <div className="flex-1">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-neutral-900" {...getItemProps("contact", "fullName", undefined, onSelectSection)}>
              {c.fullName || "Candidate Name"}
            </h1>
            <p className="mt-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-neutral-500" {...getItemProps("contact", "title", undefined, onSelectSection)}>
              {c.title || "Professional Title"}
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-neutral-600">
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
            <h2 className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-neutral-900 flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-neutral-900" /> Professional Summary
            </h2>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-neutral-700" {...getItemProps("summary", "summary", undefined, onSelectSection)}>
              {data.summary}
            </p>
          </section>
        )}

        {/* Work Experience */}
        {xpPage1.length > 0 && (
          <section className="mt-5" {...getSectionProps("experience", onSelectSection)}>
            <h2 className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-neutral-900 flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-neutral-900" /> Work History {isTwoPage && xpPage2.length > 0 && <span className="text-[9.5px] font-normal text-neutral-500">(Primary)</span>}
            </h2>
            <div className="mt-2.5 space-y-3.5">
              {xpPage1.map((e) => (
                <div key={e.id} className="border-l border-neutral-300 pl-3.5" {...getItemProps("experience", "role", e.id, onSelectSection)}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-[14px] font-bold text-neutral-900" {...getItemProps("experience", "role", e.id, onSelectSection)}>{e.role}</h3>
                    <span className="font-mono text-[10.5px] bg-neutral-100 px-1.5 py-0.5 text-neutral-600 font-semibold">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                  </div>
                  <p className="text-[12px] font-semibold" style={{ color: accent }} {...getItemProps("experience", "company", e.id, onSelectSection)}>{e.company}{e.location && ` · ${e.location}`}</p>
                  <ul className="mt-1.5 space-y-1" {...getItemProps("experience", "bullets", e.id, onSelectSection)}>
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
          <section className="mt-6" {...getSectionProps("skills", onSelectSection)}>
            <h2 className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-neutral-900 flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-neutral-900" /> Competencies & Tooling
            </h2>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {data.skills.filter(Boolean).map((sk, i) => (
                <span key={i} className="border border-neutral-900 bg-neutral-900 text-white px-2 py-0.5 font-mono text-[10.5px] font-bold" {...getItemProps("skills", "skills", undefined, onSelectSection)}>
                  {sk}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Education on Page 1 */}
        {eduPage1.length > 0 && (
          <section className="mt-6" {...getSectionProps("education", onSelectSection)}>
            <h2 className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-neutral-900 flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-neutral-900" /> Education & Academia
            </h2>
            <div className="mt-2 space-y-1 text-[12px]">
              {eduPage1.map((ed) => (
                <div key={ed.id} className="flex items-baseline justify-between" {...getItemProps("education", "school", ed.id, onSelectSection)}>
                  <span className="font-bold text-neutral-900">{ed.degree} — <span className="font-normal text-neutral-700">{ed.school}</span></span>
                  <span className="font-mono text-[10.5px] text-neutral-500">{ed.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects on Page 1 */}
        {projectsPage1.length > 0 && (
          <section className="mt-6" {...getSectionProps("projects", onSelectSection)}>
            <h2 className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-neutral-900 flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-neutral-900" /> Key Projects & Systems
            </h2>
            <div className="mt-2 space-y-2.5">
              {projectsPage1.map((p) => (
                <div key={p.id} className="border border-neutral-200 p-2.5 bg-neutral-50/50" {...getItemProps("projects", "title", p.id, onSelectSection)}>
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-mono text-[12px] font-bold text-neutral-900">{p.title}</h4>
                    {p.date && <span className="font-mono text-[10px] text-neutral-500">{p.date}</span>}
                  </div>
                  {p.subtitle && <p className="font-mono text-[10.5px] text-neutral-600">{p.subtitle}</p>}
                  <ul className="mt-1 space-y-0.5 text-[11px] text-neutral-700">
                    {p.bullets.filter(Boolean).map((b, bi) => <li key={bi}>- {b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications on Page 1 */}
        {certsPage1.length > 0 && (
          <section className="mt-5" {...getSectionProps("extras", onSelectSection)}>
            <h2 className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-neutral-900 flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-neutral-900" /> Certifications & Compliance
            </h2>
            <div className="mt-2 flex flex-wrap gap-1.5 text-[11.5px]">
              {certsPage1.map((c, i) => (
                <span key={i} className="border border-neutral-300 px-2 py-0.5 font-mono text-[10.5px] text-neutral-800" {...getItemProps("extras", "certifications", undefined, onSelectSection)}>
                  {c}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Languages & Volunteer on Page 1 */}
        {(languagesPage1.length > 0 || volunteerPage1.length > 0) && (
          <section className="mt-5 grid grid-cols-2 gap-4">
            {languagesPage1.length > 0 && (
              <div {...getSectionProps("extras", onSelectSection)}>
                <p className="font-mono text-[11px] text-neutral-700" {...getItemProps("extras", "languages", undefined, onSelectSection)}>
                  <strong className="text-neutral-900 font-bold">LANGUAGES:</strong> {languagesPage1.join(", ")}
                </p>
              </div>
            )}
            {volunteerPage1.length > 0 && (
              <div {...getSectionProps("projects", onSelectSection)}>
                <div className="text-[11px] text-neutral-700">
                  {volunteerPage1.map((v) => <p key={v.id}><span className="font-bold">{v.role}</span> · {v.org}</p>)}
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      <footer className="mt-6 border-t-2 border-neutral-900 pt-2 flex items-center justify-between font-mono text-[10px] text-neutral-500">
        <span>ONYX</span>
        <span>Executive Brief</span>
      </footer>
    </div>
  );

  const renderPage2 = () => (
    <div className="resume-sheet page-2 resume-page-break flex flex-col justify-between px-11 py-9 text-[#111] bg-white">
      <div>
        {/* Directly continue with content - no redundant header, name, or banner */}
        {xpPage2.length > 0 && (
          <section className="mt-0" {...getSectionProps("experience", onSelectSection)}>
            <h2 className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-neutral-900 flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-neutral-900" /> Career History (Cont.)
            </h2>
            <div className="mt-3 space-y-3.5">
              {xpPage2.map((e) => (
                <div key={e.id} className="border-l border-neutral-300 pl-3.5" {...getItemProps("experience", "role", e.id, onSelectSection)}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-[13.5px] font-bold text-neutral-900" {...getItemProps("experience", "role", e.id, onSelectSection)}>{e.role}</h3>
                    <span className="font-mono text-[10px] bg-neutral-100 px-1.5 py-0.5 text-neutral-600 font-semibold">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                  </div>
                  <p className="text-[11.5px] font-semibold" style={{ color: accent }} {...getItemProps("experience", "company", e.id, onSelectSection)}>{e.company}{e.location && ` · ${e.location}`}</p>
                  <ul className="mt-1 space-y-1" {...getItemProps("experience", "bullets", e.id, onSelectSection)}>
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

        {projectsPage2.length > 0 && (
          <section className={xpPage2.length > 0 ? "mt-3.5" : "mt-0"} {...getSectionProps("projects", onSelectSection)}>
            <h2 className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-neutral-900 flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-neutral-900" /> Technical Projects & Systems
            </h2>
            <div className="mt-2 space-y-2">
              {projectsPage2.map((p) => (
                <div key={p.id} className="border border-neutral-200 p-2.5 bg-neutral-50/50" {...getItemProps("projects", "title", p.id, onSelectSection)}>
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-mono text-[12.5px] font-bold text-neutral-900" {...getItemProps("projects", "title", p.id, onSelectSection)}>{p.title}</h4>
                    {p.date && <span className="font-mono text-[10px] text-neutral-500" {...getItemProps("projects", "date", p.id, onSelectSection)}>{p.date}</span>}
                  </div>
                  {p.subtitle && <p className="font-mono text-[11px] text-neutral-600" {...getItemProps("projects", "subtitle", p.id, onSelectSection)}>{p.subtitle}</p>}
                  <ul className="mt-0.5 space-y-0.5 text-[11.5px] text-neutral-700" {...getItemProps("projects", "bullets", p.id, onSelectSection)}>
                    {p.bullets.filter(Boolean).map((b, bi) => <li key={bi} {...getItemProps("projects", "bullets", p.id, onSelectSection)}>- {b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {eduPage2.length > 0 && (
          <section className={xpPage2.length > 0 || projectsPage2.length > 0 ? "mt-3.5" : "mt-0"} {...getSectionProps("education", onSelectSection)}>
            <h2 className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-neutral-900 flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-neutral-900" /> Education & Academia
            </h2>
            <div className="mt-1.5 space-y-1 text-[12px]">
              {eduPage2.map((ed) => (
                <div key={ed.id} className="flex items-baseline justify-between" {...getItemProps("education", "school", ed.id, onSelectSection)}>
                  <span className="font-bold text-neutral-900" {...getItemProps("education", "degree", ed.id, onSelectSection)}>{ed.degree} — <span className="font-normal text-neutral-700" {...getItemProps("education", "school", ed.id, onSelectSection)}>{ed.school}</span></span>
                  <span className="font-mono text-[10px] text-neutral-500" {...getItemProps("education", "year", ed.id, onSelectSection)}>{ed.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {certsPage2.length > 0 && (
          <section className="mt-3.5" {...getSectionProps("extras", onSelectSection)}>
            <h2 className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-neutral-900 flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-neutral-900" /> Certifications & Compliance
            </h2>
            <div className="mt-1.5 flex flex-wrap gap-2 text-[11.5px]">
              {certsPage2.map((c, i) => (
                <span key={i} className="border border-neutral-300 px-2 py-0.5 font-mono text-[10.5px] text-neutral-800" {...getItemProps("extras", "certifications", undefined, onSelectSection)}>
                  {c}
                </span>
              ))}
            </div>
          </section>
        )}

        {(languagesPage2.length > 0 || volunteerPage2.length > 0) && (
          <section className="mt-3.5 grid grid-cols-2 gap-4">
            {languagesPage2.length > 0 && (
              <div {...getSectionProps("extras", onSelectSection)}>
                <h3 className="font-mono text-[10.5px] font-bold uppercase text-neutral-900">Languages</h3>
                <p className="mt-1 text-[11.5px] text-neutral-700 font-mono" {...getItemProps("extras", "languages", undefined, onSelectSection)}>{languagesPage2.join(", ")}</p>
              </div>
            )}
            {volunteerPage2.length > 0 && (
              <div {...getSectionProps("projects", onSelectSection)}>
                <h3 className="font-mono text-[10.5px] font-bold uppercase text-neutral-900">Community & Volunteering</h3>
                <div className="mt-1 space-y-1 text-[11.5px] text-neutral-700">
                  {volunteerPage2.map((v) => <p key={v.id} {...getItemProps("projects", "volunteer", v.id, onSelectSection)}><span className="font-bold">{v.role}</span> · {v.org}</p>)}
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      <footer className="mt-auto border-t-2 border-neutral-900 pt-2 flex items-center justify-between font-mono text-[10px] text-neutral-500">
        <span>ONYX</span>
        <span>Page 02 / 02</span>
      </footer>
    </div>
  );

  return renderPage1();
}
