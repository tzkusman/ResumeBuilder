import type { ResumeData } from "../lib/types";

/**
 * Renders the resume as a 794×1123 A4 sheet in one of fifteen distinct templates:
 * 1. merit: Recruiter-proof standard, clean mono section labels, scannable bullets.
 * 2. ledger: Visual dual-column with solid accent sidebar.
 * 3. atlas: Compact modern sheet with an accent bar on top and dot-separated skills.
 * 4. craft: Centered serif header with academic elegance.
 * 5. modern: Sleek contemporary layout with tinted header card and skill pill badges.
 * 6. classic: Traditional timeless standard with double hairline borders and serif headings.
 * 7. elegant: Refined luxury editorial style with wide letter-spacing and delicate accents.
 * 8. professional: Authoritative corporate layout with solid accent section badges.
 * 9. minimal: Scandinavian minimalist layout with numbered section markers.
 * 10. bold: High-impact layout with full-width accent banner header.
 * 11. creative: Asymmetric modern layout with timeline nodes and accent skill chips.
 * 12. executive: C-suite layout with monogram header and boxed executive summary.
 * 13. academic: Traditional CV curriculum vitae format with research & credential priority.
 * 14. tech: Developer-focused layout with monospace code-inspired syntax and tags.
 * 15. corporate: Enterprise Fortune 500 format with structured metadata and grid alignment.
 */
export default function ResumeDoc({ data }: { data: ResumeData }) {
  const { contact: c, accent } = data;
  const xp = data.experience.filter((e) => e.role || e.company);
  const edu = data.education.filter((e) => e.degree || e.school);
  const contactLine = [c.email, c.phone, c.location, c.website, c.linkedin].filter(Boolean);

  // =========================================================================
  // 1. LEDGER: Visual Two-Column Sidebar
  // =========================================================================
  if (data.template === "ledger") {
    return (
      <div className="resume-sheet flex overflow-hidden">
        <aside className="w-[240px] shrink-0 px-6 py-10 text-white" style={{ background: accent }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-80">Curriculum Vitae</p>
          <h1 className="mt-3 font-display text-3xl font-black leading-tight">{c.fullName || "Your Name"}</h1>
          <p className="mt-1 text-sm font-semibold opacity-90">{c.title}</p>
          <div className="mt-8 space-y-1.5 text-[11px] leading-relaxed opacity-95">
            {contactLine.map((s, i) => <p key={i} className="break-words">{s}</p>)}
          </div>
          {data.skills.length > 0 && (
            <>
              <h2 className="mt-9 font-mono text-[10px] font-bold uppercase tracking-[0.22em] opacity-80">Skills</h2>
              <ul className="mt-3 space-y-1.5 text-[11.5px]">{data.skills.filter(Boolean).map((s, i) => <li key={i} className="flex gap-2"><span className="mt-[7px] h-1 w-1 shrink-0 bg-white/80" />{s}</li>)}</ul>
            </>
          )}
          {edu.length > 0 && (
            <>
              <h2 className="mt-9 font-mono text-[10px] font-bold uppercase tracking-[0.22em] opacity-80">Education</h2>
              <div className="mt-3 space-y-3 text-[11.5px]">
                {edu.map((e) => <div key={e.id}><p className="font-bold">{e.degree}</p><p className="opacity-85">{e.school} {e.year}</p></div>)}
              </div>
            </>
          )}
          {data.certifications.length > 0 && (
            <>
              <h2 className="mt-9 font-mono text-[10px] font-bold uppercase tracking-[0.22em] opacity-80">Certifications</h2>
              <ul className="mt-3 space-y-1.5 text-[11px] leading-relaxed">{data.certifications.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </>
          )}
          {data.languages.length > 0 && (
            <>
              <h2 className="mt-9 font-mono text-[10px] font-bold uppercase tracking-[0.22em] opacity-80">Languages</h2>
              <p className="mt-2 text-[11px] leading-relaxed opacity-90">{data.languages.join(", ")}</p>
            </>
          )}
        </aside>
        <div className="flex-1 px-8 py-10">
          {data.summary && (<section><h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: accent }}>Profile</h2><p className="mt-2.5 text-[12.5px] leading-relaxed">{data.summary}</p></section>)}
          <section className="mt-7">
            <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: accent }}>Experience</h2>
            <div className="mt-3 space-y-5">
              {xp.map((e) => (
                <div key={e.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-[13.5px] font-bold">{e.role} <span className="font-semibold" style={{ color: accent }}>· {e.company}</span></p>
                    <p className="shrink-0 font-mono text-[10px] text-neutral-500">{e.start} – {e.end}</p>
                  </div>
                  {e.location && <p className="text-[11px] text-neutral-500">{e.location}</p>}
                  <ul className="mt-1.5 space-y-1">
                    {e.bullets.filter(Boolean).map((b, i) => <li key={i} className="flex gap-2 text-[12.5px] leading-snug"><span className="mt-[7px] h-[3px] w-[3px] shrink-0" style={{ background: accent }} />{b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. BOLD: Full-Width Accent Header Banner
  // =========================================================================
  if (data.template === "bold") {
    return (
      <div className="resume-sheet flex flex-col overflow-hidden">
        <header className="px-10 py-8 text-white" style={{ background: accent }}>
          <h1 className="font-display text-4xl font-black tracking-tight">{c.fullName || "Your Name"}</h1>
          {c.title && <p className="mt-1.5 inline-block bg-white/20 px-2.5 py-0.5 font-mono text-xs font-bold uppercase tracking-wider text-white backdrop-blur-xs">{c.title}</p>}
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[11.5px] font-medium opacity-90">
            {contactLine.map((s, i) => <span key={i}>{s}</span>)}
          </div>
        </header>

        <div className="flex-1 px-10 py-7 space-y-6">
          {data.summary && (
            <section>
              <h2 className="flex items-center gap-2 font-display text-sm font-black uppercase tracking-wider text-neutral-900">
                <span className="h-3.5 w-1.5" style={{ background: accent }} /> Professional Summary
              </h2>
              <p className="mt-2 text-[12.5px] leading-relaxed text-neutral-800">{data.summary}</p>
            </section>
          )}

          {xp.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 font-display text-sm font-black uppercase tracking-wider text-neutral-900">
                <span className="h-3.5 w-1.5" style={{ background: accent }} /> Experience
              </h2>
              <div className="mt-3 space-y-4">
                {xp.map((e) => (
                  <div key={e.id} className="border-l-2 pl-3.5" style={{ borderColor: `${accent}40` }}>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-[13.5px] font-bold text-neutral-900">{e.role} <span className="font-bold" style={{ color: accent }}>— {e.company}</span></p>
                      <span className="font-mono text-[10px] font-bold text-neutral-500">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                    </div>
                    {e.location && <p className="text-[11px] text-neutral-500">{e.location}</p>}
                    <ul className="mt-1.5 space-y-1">
                      {e.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} className="flex gap-2 text-[12.5px] leading-snug text-neutral-700">
                          <span className="mt-[6px] h-1 w-1 shrink-0" style={{ background: accent }} /> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {edu.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 font-display text-sm font-black uppercase tracking-wider text-neutral-900">
                <span className="h-3.5 w-1.5" style={{ background: accent }} /> Education
              </h2>
              <div className="mt-2 space-y-1.5">
                {edu.map((e) => (
                  <div key={e.id} className="flex items-baseline justify-between gap-3 text-[12.5px]">
                    <p><span className="font-bold">{e.degree}</span> — {e.school}{e.location && `, ${e.location}`}</p>
                    <span className="font-mono text-[10px] font-semibold text-neutral-500">{e.year}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.skills.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 font-display text-sm font-black uppercase tracking-wider text-neutral-900">
                <span className="h-3.5 w-1.5" style={{ background: accent }} /> Skills &amp; Proficiencies
              </h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {data.skills.filter(Boolean).map((s, i) => (
                  <span key={i} className="border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-800">{s}</span>
                ))}
              </div>
            </section>
          )}

          {(data.certifications.length > 0 || data.languages.length > 0) && (
            <div className="grid grid-cols-2 gap-4">
              {data.certifications.length > 0 && (
                <section>
                  <h2 className="font-display text-xs font-black uppercase tracking-wider text-neutral-900">Certifications</h2>
                  <ul className="mt-1.5 space-y-0.5 text-[11.5px] text-neutral-700">{data.certifications.map((s, i) => <li key={i}>• {s}</li>)}</ul>
                </section>
              )}
              {data.languages.length > 0 && (
                <section>
                  <h2 className="font-display text-xs font-black uppercase tracking-wider text-neutral-900">Languages</h2>
                  <p className="mt-1.5 text-[11.5px] text-neutral-700">{data.languages.join(", ")}</p>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. MODERN: Contemporary Card Header + Pill Badges
  // =========================================================================
  if (data.template === "modern") {
    return (
      <div className="resume-sheet px-10 py-9">
        <header className="rounded-lg p-6" style={{ background: `${accent}10`, border: `1px solid ${accent}30` }}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-black tracking-tight text-neutral-900">{c.fullName || "Your Name"}</h1>
              {c.title && <p className="mt-1 font-semibold text-[14px]" style={{ color: accent }}>{c.title}</p>}
            </div>
            <div className="flex flex-col text-right text-[11px] text-neutral-600 space-y-0.5">
              {contactLine.map((s, i) => <span key={i}>{s}</span>)}
            </div>
          </div>
        </header>

        <div className="mt-6 space-y-5">
          {data.summary && (
            <section>
              <h2 className="border-l-4 pl-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em]" style={{ borderColor: accent, color: accent }}>Professional Summary</h2>
              <p className="mt-2 text-[12.5px] leading-relaxed text-neutral-700">{data.summary}</p>
            </section>
          )}

          {xp.length > 0 && (
            <section>
              <h2 className="border-l-4 pl-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em]" style={{ borderColor: accent, color: accent }}>Experience</h2>
              <div className="mt-3 space-y-4">
                {xp.map((e) => (
                  <div key={e.id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-[13px] font-bold text-neutral-900">{e.role} <span className="font-semibold" style={{ color: accent }}>@ {e.company}</span>{e.location && <span className="text-[11px] font-normal text-neutral-500"> · {e.location}</span>}</p>
                      <span className="font-mono text-[10px] text-neutral-500">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                    </div>
                    <ul className="mt-1 space-y-1">
                      {e.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} className="flex gap-2 text-[12px] leading-snug text-neutral-700">
                          <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} /> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {edu.length > 0 && (
            <section>
              <h2 className="border-l-4 pl-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em]" style={{ borderColor: accent, color: accent }}>Education</h2>
              <div className="mt-2 space-y-1.5 text-[12px]">
                {edu.map((e) => (
                  <div key={e.id} className="flex items-baseline justify-between">
                    <p><span className="font-bold">{e.degree}</span> — {e.school}{e.location && ` (${e.location})`}</p>
                    <span className="font-mono text-[10px] text-neutral-500">{e.year}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.skills.length > 0 && (
            <section>
              <h2 className="border-l-4 pl-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em]" style={{ borderColor: accent, color: accent }}>Skills &amp; Expertise</h2>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {data.skills.filter(Boolean).map((s, i) => (
                  <span key={i} className="rounded px-2 py-0.5 text-[11px] font-medium border" style={{ borderColor: `${accent}35`, color: accent, background: `${accent}0c` }}>{s}</span>
                ))}
              </div>
            </section>
          )}

          {(data.certifications.length > 0 || data.languages.length > 0) && (
            <div className="grid grid-cols-2 gap-4 pt-1">
              {data.certifications.length > 0 && (
                <section>
                  <h2 className="border-l-4 pl-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ borderColor: accent, color: accent }}>Certifications</h2>
                  <ul className="mt-1.5 space-y-0.5 text-[11.5px] text-neutral-700">{data.certifications.map((s, i) => <li key={i}>• {s}</li>)}</ul>
                </section>
              )}
              {data.languages.length > 0 && (
                <section>
                  <h2 className="border-l-4 pl-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ borderColor: accent, color: accent }}>Languages</h2>
                  <p className="mt-1.5 text-[11.5px] text-neutral-700">{data.languages.join(", ")}</p>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. CLASSIC: Traditional Double Hairline Rules + Serif Headings
  // =========================================================================
  if (data.template === "classic") {
    return (
      <div className="resume-sheet px-12 py-10 font-serif">
        <header className="border-y-2 border-neutral-900 py-3.5 text-center">
          <h1 className="text-3xl font-bold uppercase tracking-widest text-neutral-900">{c.fullName || "Your Name"}</h1>
          {c.title && <p className="mt-1 text-sm font-semibold tracking-wider text-neutral-700" style={{ color: accent }}>{c.title}</p>}
          <p className="mt-2 text-[11px] font-sans text-neutral-600 space-x-3">
            {contactLine.map((s, i) => <span key={i}>{s}{i < contactLine.length - 1 ? "  •  " : ""}</span>)}
          </p>
        </header>

        <div className="mt-5 space-y-5">
          {data.summary && (
            <section>
              <h2 className="border-b border-neutral-400 pb-1 text-[11.5px] font-bold uppercase tracking-[0.2em] text-neutral-900">Profile</h2>
              <p className="mt-2 font-sans text-[12.5px] leading-relaxed text-neutral-800">{data.summary}</p>
            </section>
          )}

          {xp.length > 0 && (
            <section>
              <h2 className="border-b border-neutral-400 pb-1 text-[11.5px] font-bold uppercase tracking-[0.2em] text-neutral-900">Experience</h2>
              <div className="mt-3 space-y-3.5">
                {xp.map((e) => (
                  <div key={e.id}>
                    <div className="flex items-baseline justify-between">
                      <p className="text-[13px] font-bold text-neutral-900">{e.role}, <span className="italic text-neutral-700">{e.company}</span>{e.location && ` — ${e.location}`}</p>
                      <span className="font-sans text-[10.5px] italic text-neutral-600">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                    </div>
                    <ul className="mt-1 list-disc pl-5 font-sans space-y-0.5">
                      {e.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} className="text-[12px] leading-snug text-neutral-700">{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {edu.length > 0 && (
            <section>
              <h2 className="border-b border-neutral-400 pb-1 text-[11.5px] font-bold uppercase tracking-[0.2em] text-neutral-900">Education</h2>
              <div className="mt-2 space-y-1.5 font-sans text-[12px]">
                {edu.map((e) => (
                  <div key={e.id} className="flex items-baseline justify-between">
                    <p><span className="font-bold font-serif">{e.degree}</span>, {e.school}{e.location && ` · ${e.location}`}</p>
                    <span className="italic text-neutral-600">{e.year}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.skills.length > 0 && (
            <section>
              <h2 className="border-b border-neutral-400 pb-1 text-[11.5px] font-bold uppercase tracking-[0.2em] text-neutral-900">Skills &amp; Honors</h2>
              <p className="mt-2 font-sans text-[12px] leading-relaxed text-neutral-800">{data.skills.filter(Boolean).join(", ")}</p>
            </section>
          )}

          {(data.certifications.length > 0 || data.languages.length > 0) && (
            <div className="grid grid-cols-2 gap-4 font-sans text-[12px]">
              {data.certifications.length > 0 && (
                <div>
                  <h3 className="font-serif font-bold text-[11.5px] uppercase tracking-wider text-neutral-900">Certifications</h3>
                  <p className="mt-1 text-neutral-700">{data.certifications.join(", ")}</p>
                </div>
              )}
              {data.languages.length > 0 && (
                <div>
                  <h3 className="font-serif font-bold text-[11.5px] uppercase tracking-wider text-neutral-900">Languages</h3>
                  <p className="mt-1 text-neutral-700">{data.languages.join(", ")}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 5. ELEGANT: Luxury Editorial & Hairline Margin Accent
  // =========================================================================
  if (data.template === "elegant") {
    return (
      <div className="resume-sheet flex overflow-hidden">
        <div className="w-2 shrink-0" style={{ background: accent }} />
        <div className="flex-1 px-11 py-10">
          <header className="border-b border-neutral-200 pb-5">
            <h1 className="font-serif text-3xl font-light uppercase tracking-[0.18em] text-neutral-900">{c.fullName || "Your Name"}</h1>
            {c.title && <p className="mt-1 font-serif text-xs italic tracking-widest text-neutral-600" style={{ color: accent }}>{c.title}</p>}
            <p className="mt-3 flex flex-wrap gap-x-4 text-[10.5px] tracking-wider text-neutral-500 uppercase font-sans">
              {contactLine.map((s, i) => <span key={i}>{s}</span>)}
            </p>
          </header>

          <div className="mt-6 space-y-6">
            {data.summary && (
              <section>
                <h2 className="font-serif text-[11px] font-normal uppercase tracking-[0.28em] text-neutral-500">Statement</h2>
                <p className="mt-2 text-[12.5px] font-light leading-relaxed text-neutral-800">{data.summary}</p>
              </section>
            )}

            {xp.length > 0 && (
              <section>
                <h2 className="font-serif text-[11px] font-normal uppercase tracking-[0.28em] text-neutral-500">Career History</h2>
                <div className="mt-3 space-y-4">
                  {xp.map((e) => (
                    <div key={e.id}>
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="text-[13px] font-medium text-neutral-900">{e.role} <span className="italic font-serif text-neutral-600" style={{ color: accent }}>/ {e.company}</span></p>
                        <span className="font-mono text-[9.5px] text-neutral-400">{[e.start, e.end].filter(Boolean).join(" — ")}</span>
                      </div>
                      {e.location && <p className="text-[10.5px] italic text-neutral-400">{e.location}</p>}
                      <ul className="mt-1.5 space-y-1">
                        {e.bullets.filter(Boolean).map((b, i) => (
                          <li key={i} className="flex gap-2.5 text-[12px] leading-relaxed text-neutral-700">
                            <span className="mt-[7px] h-1 w-1 shrink-0 rotate-45" style={{ background: accent }} /> {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {edu.length > 0 && (
              <section>
                <h2 className="font-serif text-[11px] font-normal uppercase tracking-[0.28em] text-neutral-500">Academic Background</h2>
                <div className="mt-2 space-y-1 text-[12px]">
                  {edu.map((e) => (
                    <div key={e.id} className="flex items-baseline justify-between">
                      <p><span className="font-medium text-neutral-900">{e.degree}</span> — <span className="italic font-serif">{e.school}</span></p>
                      <span className="font-mono text-[9.5px] text-neutral-400">{e.year}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.skills.length > 0 && (
              <section>
                <h2 className="font-serif text-[11px] font-normal uppercase tracking-[0.28em] text-neutral-500">Competencies</h2>
                <p className="mt-2 text-[11.5px] font-light tracking-wide text-neutral-700">{data.skills.filter(Boolean).join("   ·   ")}</p>
              </section>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 6. PROFESSIONAL: Solid Accent Section Badges & Corporate Grid
  // =========================================================================
  if (data.template === "professional") {
    return (
      <div className="resume-sheet px-11 py-9">
        <header className="flex items-start justify-between border-b-2 pb-5" style={{ borderColor: accent }}>
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-neutral-900">{c.fullName || "Your Name"}</h1>
            {c.title && <p className="mt-1 font-bold text-sm tracking-wide text-neutral-700">{c.title}</p>}
          </div>
          <div className="text-right text-[11px] text-neutral-600 space-y-0.5 font-medium">
            {contactLine.map((s, i) => <p key={i}>{s}</p>)}
          </div>
        </header>

        <div className="mt-5 space-y-5">
          {data.summary && (
            <section>
              <div className="inline-block px-2.5 py-0.5 text-white font-mono text-[10px] font-bold uppercase tracking-wider" style={{ background: accent }}>Executive Summary</div>
              <p className="mt-2 text-[12.5px] leading-relaxed text-neutral-800">{data.summary}</p>
            </section>
          )}

          {xp.length > 0 && (
            <section>
              <div className="inline-block px-2.5 py-0.5 text-white font-mono text-[10px] font-bold uppercase tracking-wider" style={{ background: accent }}>Professional Experience</div>
              <div className="mt-3 space-y-3.5">
                {xp.map((e) => (
                  <div key={e.id}>
                    <div className="flex items-baseline justify-between">
                      <p className="text-[13px] font-bold text-neutral-900">{e.role} <span style={{ color: accent }}>| {e.company}</span>{e.location && <span className="font-normal text-neutral-500"> ({e.location})</span>}</p>
                      <span className="font-mono text-[10.5px] font-semibold text-neutral-600">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                    </div>
                    <ul className="mt-1 space-y-1">
                      {e.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} className="flex gap-2 text-[12px] leading-snug text-neutral-700">
                          <span className="mt-[6px] h-1.5 w-1.5 shrink-0" style={{ background: accent }} /> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="grid grid-cols-2 gap-6 pt-1">
            {edu.length > 0 && (
              <section>
                <div className="inline-block px-2.5 py-0.5 text-white font-mono text-[10px] font-bold uppercase tracking-wider" style={{ background: accent }}>Education</div>
                <div className="mt-2 space-y-1.5 text-[12px]">
                  {edu.map((e) => (
                    <div key={e.id}>
                      <p className="font-bold text-neutral-900">{e.degree}</p>
                      <p className="text-neutral-600">{e.school} · {e.year}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.skills.length > 0 && (
              <section>
                <div className="inline-block px-2.5 py-0.5 text-white font-mono text-[10px] font-bold uppercase tracking-wider" style={{ background: accent }}>Core Skills</div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {data.skills.filter(Boolean).map((s, i) => (
                    <span key={i} className="border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-[10.5px] font-semibold text-neutral-800">{s}</span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 7. MINIMAL: Swiss / Scandinavian Numbered Sections
  // =========================================================================
  if (data.template === "minimal") {
    return (
      <div className="resume-sheet px-12 py-11">
        <header>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-neutral-900">{c.fullName || "Your Name"}</h1>
          <div className="mt-1 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
            <p className="font-mono text-xs uppercase tracking-wider text-neutral-600">{c.title}</p>
          </div>
          <p className="mt-3 flex flex-wrap gap-x-4 text-[11px] text-neutral-500 font-mono">
            {contactLine.map((s, i) => <span key={i}>{s}</span>)}
          </p>
        </header>

        <div className="mt-8 space-y-6">
          {data.summary && (
            <section className="grid grid-cols-[100px_1fr] gap-4">
              <span className="font-mono text-[10.5px] font-bold text-neutral-400">01 / ABOUT</span>
              <p className="text-[12.5px] leading-relaxed text-neutral-800">{data.summary}</p>
            </section>
          )}

          {xp.length > 0 && (
            <section className="grid grid-cols-[100px_1fr] gap-4">
              <span className="font-mono text-[10.5px] font-bold text-neutral-400">02 / WORK</span>
              <div className="space-y-4">
                {xp.map((e) => (
                  <div key={e.id}>
                    <div className="flex items-baseline justify-between">
                      <p className="text-[13px] font-bold text-neutral-900">{e.role} <span className="font-medium text-neutral-600">· {e.company}</span></p>
                      <span className="font-mono text-[10px] text-neutral-400">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                    </div>
                    <ul className="mt-1 space-y-1 text-[12px] leading-snug text-neutral-700">
                      {e.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-neutral-400">—</span> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {edu.length > 0 && (
            <section className="grid grid-cols-[100px_1fr] gap-4">
              <span className="font-mono text-[10.5px] font-bold text-neutral-400">03 / EDU</span>
              <div className="space-y-1 text-[12px]">
                {edu.map((e) => (
                  <div key={e.id} className="flex justify-between">
                    <p><span className="font-bold">{e.degree}</span>, {e.school}</p>
                    <span className="font-mono text-[10px] text-neutral-400">{e.year}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.skills.length > 0 && (
            <section className="grid grid-cols-[100px_1fr] gap-4">
              <span className="font-mono text-[10.5px] font-bold text-neutral-400">04 / SKILLS</span>
              <p className="text-[12px] text-neutral-800 leading-relaxed">{data.skills.filter(Boolean).join(", ")}</p>
            </section>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 8. CREATIVE: Asymmetric Layout + Timeline Dots
  // =========================================================================
  if (data.template === "creative") {
    return (
      <div className="resume-sheet px-11 py-10">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b pb-5" style={{ borderColor: `${accent}30` }}>
          <div>
            <h1 className="font-display text-4xl font-black text-neutral-900 tracking-tight">{c.fullName || "Your Name"}</h1>
            <span className="mt-1 inline-block rounded-full px-3 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider" style={{ background: accent }}>{c.title || "Creative Professional"}</span>
          </div>
          <div className="flex flex-col text-right text-[11px] text-neutral-600 font-medium">
            {contactLine.map((s, i) => <span key={i}>{s}</span>)}
          </div>
        </header>

        <div className="mt-6 space-y-6">
          {data.summary && (
            <section className="rounded-lg p-4" style={{ background: `${accent}0d` }}>
              <p className="text-[12.5px] font-medium leading-relaxed text-neutral-800">{data.summary}</p>
            </section>
          )}

          {xp.length > 0 && (
            <section>
              <h2 className="font-display text-sm font-black uppercase tracking-wider" style={{ color: accent }}>Career Path</h2>
              <div className="mt-3 space-y-4 pl-3 border-l-2" style={{ borderColor: `${accent}40` }}>
                {xp.map((e) => (
                  <div key={e.id} className="relative">
                    <span className="absolute -left-[19px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white" style={{ background: accent }} />
                    <div className="flex items-baseline justify-between">
                      <p className="text-[13.5px] font-bold text-neutral-900">{e.role} <span className="font-semibold" style={{ color: accent }}>@ {e.company}</span></p>
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 font-mono text-[9.5px] font-bold text-neutral-600">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                    </div>
                    <ul className="mt-1 space-y-1 text-[12px] leading-snug text-neutral-700">
                      {e.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} className="flex gap-2"><span>✦</span> {b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.skills.length > 0 && (
            <section>
              <h2 className="font-display text-sm font-black uppercase tracking-wider" style={{ color: accent }}>Skill Palette</h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {data.skills.filter(Boolean).map((s, i) => (
                  <span key={i} className="rounded-full border px-3 py-0.5 text-[11px] font-bold transition-colors" style={{ borderColor: accent, color: accent, background: `${accent}0a` }}>{s}</span>
                ))}
              </div>
            </section>
          )}

          {edu.length > 0 && (
            <section>
              <h2 className="font-display text-sm font-black uppercase tracking-wider" style={{ color: accent }}>Education</h2>
              <div className="mt-2 space-y-1 text-[12px]">
                {edu.map((e) => (
                  <div key={e.id} className="flex justify-between">
                    <p><span className="font-bold">{e.degree}</span>, {e.school}</p>
                    <span className="font-mono text-[10px] font-bold text-neutral-500">{e.year}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 9. EXECUTIVE: C-Suite Monogram & Strategic Competencies
  // =========================================================================
  if (data.template === "executive") {
    const initials = (c.fullName || "Alex Morgan").split(" ").map(w => w[0]).slice(0, 2).join("");
    return (
      <div className="resume-sheet px-11 py-10">
        <header className="flex items-center gap-5 border-b-2 border-neutral-800 pb-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center font-serif text-xl font-black text-white" style={{ background: accent }}>
            {initials}
          </div>
          <div className="flex-1">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-neutral-900">{c.fullName || "Your Name"}</h1>
            <p className="mt-0.5 font-mono text-xs font-bold uppercase tracking-widest text-neutral-600">{c.title}</p>
          </div>
          <div className="text-right text-[10.5px] text-neutral-600 space-y-0.5">
            {contactLine.map((s, i) => <p key={i}>{s}</p>)}
          </div>
        </header>

        <div className="mt-5 space-y-5">
          {data.summary && (
            <div className="border-l-4 p-3.5" style={{ borderColor: accent, background: `${accent}0d` }}>
              <h2 className="font-serif text-[11px] font-bold uppercase tracking-widest" style={{ color: accent }}>Executive Value Proposition</h2>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-neutral-800">{data.summary}</p>
            </div>
          )}

          {data.skills.length > 0 && (
            <section>
              <h2 className="font-serif text-[11px] font-bold uppercase tracking-widest text-neutral-800">Core Leadership Competencies</h2>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center text-[11px] font-semibold text-neutral-800">
                {data.skills.filter(Boolean).slice(0, 9).map((s, i) => (
                  <div key={i} className="border border-neutral-300 bg-neutral-50 py-1">{s}</div>
                ))}
              </div>
            </section>
          )}

          {xp.length > 0 && (
            <section>
              <h2 className="font-serif text-[11px] font-bold uppercase tracking-widest text-neutral-800">Executive Experience &amp; Business Impact</h2>
              <div className="mt-3 space-y-4">
                {xp.map((e) => (
                  <div key={e.id}>
                    <div className="flex items-baseline justify-between">
                      <p className="text-[13.5px] font-bold text-neutral-900">{e.role} <span className="font-serif font-normal italic" style={{ color: accent }}>| {e.company}</span></p>
                      <span className="font-mono text-[10px] font-bold text-neutral-500">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                    </div>
                    {e.location && <p className="text-[11px] text-neutral-500">{e.location}</p>}
                    <ul className="mt-1.5 space-y-1 text-[12px] leading-snug text-neutral-700">
                      {e.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="font-bold" style={{ color: accent }}>›</span> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {edu.length > 0 && (
            <section>
              <h2 className="font-serif text-[11px] font-bold uppercase tracking-widest text-neutral-800">Education &amp; Governance</h2>
              <div className="mt-2 space-y-1 text-[12px]">
                {edu.map((e) => (
                  <div key={e.id} className="flex justify-between">
                    <p><span className="font-bold">{e.degree}</span> — {e.school}</p>
                    <span className="font-mono text-[10px] text-neutral-500">{e.year}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 10. ACADEMIC: Curriculum Vitae / Research & Publications Focus
  // =========================================================================
  if (data.template === "academic") {
    return (
      <div className="resume-sheet px-12 py-10 font-serif">
        <header className="text-center pb-4 border-b">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-neutral-500">Curriculum Vitae</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-neutral-900">{c.fullName || "Your Name"}</h1>
          {c.title && <p className="text-sm italic text-neutral-700">{c.title}</p>}
          <p className="mt-2 text-[11px] text-neutral-600 font-sans space-x-3">
            {contactLine.map((s, i) => <span key={i}>{s}{i < contactLine.length - 1 ? " · " : ""}</span>)}
          </p>
        </header>

        <div className="mt-5 space-y-5">
          {edu.length > 0 && (
            <section>
              <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] border-b border-neutral-400 pb-0.5" style={{ color: accent }}>Education</h2>
              <div className="mt-2 space-y-2 text-[12px]">
                {edu.map((e) => (
                  <div key={e.id} className="flex justify-between">
                    <div>
                      <p className="font-bold">{e.degree}</p>
                      <p className="italic text-neutral-700">{e.school}{e.location && `, ${e.location}`}</p>
                    </div>
                    <span className="font-sans text-[10.5px] text-neutral-500">{e.year}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.summary && (
            <section>
              <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] border-b border-neutral-400 pb-0.5" style={{ color: accent }}>Research Focus &amp; Interests</h2>
              <p className="mt-2 text-[12.5px] leading-relaxed text-neutral-800 font-sans">{data.summary}</p>
            </section>
          )}

          {xp.length > 0 && (
            <section>
              <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] border-b border-neutral-400 pb-0.5" style={{ color: accent }}>Academic &amp; Professional Appointments</h2>
              <div className="mt-2.5 space-y-3">
                {xp.map((e) => (
                  <div key={e.id}>
                    <div className="flex justify-between">
                      <p className="text-[12.5px] font-bold">{e.role}, <span className="font-normal italic">{e.company}</span></p>
                      <span className="font-sans text-[10.5px] text-neutral-500">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                    </div>
                    <ul className="mt-1 list-disc pl-5 text-[12px] font-sans space-y-0.5 text-neutral-700">
                      {e.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.skills.length > 0 && (
            <section>
              <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] border-b border-neutral-400 pb-0.5" style={{ color: accent }}>Methodologies &amp; Skills</h2>
              <p className="mt-1.5 text-[12px] font-sans text-neutral-800">{data.skills.filter(Boolean).join(", ")}</p>
            </section>
          )}

          {data.certifications.length > 0 && (
            <section>
              <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] border-b border-neutral-400 pb-0.5" style={{ color: accent }}>Publications &amp; Certifications</h2>
              <ul className="mt-1.5 space-y-1 text-[11.5px] font-sans text-neutral-700">
                {data.certifications.map((s, i) => <li key={i} className="pl-4 -indent-4">• {s}</li>)}
              </ul>
            </section>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 11. TECH: Terminal & Monospace Engineering Style
  // =========================================================================
  if (data.template === "tech") {
    return (
      <div className="resume-sheet px-10 py-9 font-mono">
        <header className="border-b-2 pb-4" style={{ borderColor: accent }}>
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-[11px] text-neutral-400">$ cat profile.json</p>
              <h1 className="text-3xl font-black text-neutral-900 tracking-tight">{c.fullName || "Your Name"}</h1>
            </div>
            <span className="border px-2 py-0.5 text-xs font-bold" style={{ borderColor: accent, color: accent }}>
              {`// ${c.title || "Developer"}`}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 text-[11px] text-neutral-500">
            {contactLine.map((s, i) => <span key={i}>&gt; {s}</span>)}
          </div>
        </header>

        <div className="mt-5 space-y-5">
          {data.summary && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accent }}># Summary</h2>
              <p className="mt-1.5 text-[12px] font-sans leading-relaxed text-neutral-800">{data.summary}</p>
            </section>
          )}

          {data.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accent }}># Tech Stack</h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {data.skills.filter(Boolean).map((s, i) => (
                  <span key={i} className="border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-[10.5px] font-bold text-neutral-800">
                    &lt;{s} /&gt;
                  </span>
                ))}
              </div>
            </section>
          )}

          {xp.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accent }}># Experience Log</h2>
              <div className="mt-3 space-y-3.5 font-sans">
                {xp.map((e) => (
                  <div key={e.id}>
                    <div className="flex items-baseline justify-between">
                      <p className="font-mono text-[13px] font-bold text-neutral-900">{e.role} <span style={{ color: accent }}>@ {e.company}</span></p>
                      <span className="font-mono text-[10px] text-neutral-500">[{[e.start, e.end].filter(Boolean).join(" : ")}]</span>
                    </div>
                    <ul className="mt-1 space-y-1 text-[12px] leading-snug text-neutral-700">
                      {e.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="font-mono font-bold" style={{ color: accent }}>-&gt;</span> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {edu.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accent }}># Education</h2>
              <div className="mt-1.5 space-y-1 text-[11.5px]">
                {edu.map((e) => (
                  <div key={e.id} className="flex justify-between">
                    <p><span className="font-bold">{e.degree}</span> · {e.school}</p>
                    <span className="text-neutral-500">{e.year}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 12. CORPORATE: Enterprise Fortune 500 Two-Column Split
  // =========================================================================
  if (data.template === "corporate") {
    return (
      <div className="resume-sheet px-11 py-9">
        <header className="border-b-2 border-neutral-800 pb-4">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="font-display text-3xl font-black uppercase tracking-wider text-neutral-900">{c.fullName || "Your Name"}</h1>
              {c.title && <p className="mt-1 font-bold text-xs uppercase tracking-widest" style={{ color: accent }}>{c.title}</p>}
            </div>
            <div className="text-right text-[10.5px] font-mono text-neutral-600 space-y-0.5">
              {contactLine.map((s, i) => <p key={i}>{s}</p>)}
            </div>
          </div>
        </header>

        <div className="mt-5 grid grid-cols-[1fr_210px] gap-6">
          <div className="space-y-5">
            {data.summary && (
              <section>
                <h2 className="font-display text-xs font-black uppercase tracking-wider border-b pb-1" style={{ borderColor: accent, color: accent }}>Professional Summary</h2>
                <p className="mt-2 text-[12.5px] leading-relaxed text-neutral-800">{data.summary}</p>
              </section>
            )}

            {xp.length > 0 && (
              <section>
                <h2 className="font-display text-xs font-black uppercase tracking-wider border-b pb-1" style={{ borderColor: accent, color: accent }}>Career Chronology</h2>
                <div className="mt-3 space-y-4">
                  {xp.map((e) => (
                    <div key={e.id}>
                      <div className="flex items-baseline justify-between">
                        <p className="text-[13px] font-bold text-neutral-900">{e.role} — <span style={{ color: accent }}>{e.company}</span></p>
                        <span className="font-mono text-[10px] font-semibold text-neutral-500">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                      </div>
                      {e.location && <p className="text-[11px] text-neutral-500">{e.location}</p>}
                      <ul className="mt-1 space-y-1">
                        {e.bullets.filter(Boolean).map((b, i) => (
                          <li key={i} className="flex gap-2 text-[12px] leading-snug text-neutral-700">
                            <span className="mt-[6px] h-1.5 w-1.5 shrink-0" style={{ background: accent }} /> {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-5 border-l pl-5" style={{ borderColor: `${accent}30` }}>
            {data.skills.length > 0 && (
              <section>
                <h2 className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-neutral-800">Core Expertise</h2>
                <div className="mt-2 flex flex-wrap gap-1">
                  {data.skills.filter(Boolean).map((s, i) => (
                    <span key={i} className="border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-[10.5px] font-medium text-neutral-800">{s}</span>
                  ))}
                </div>
              </section>
            )}

            {edu.length > 0 && (
              <section>
                <h2 className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-neutral-800">Credentials</h2>
                <div className="mt-2 space-y-2 text-[11.5px]">
                  {edu.map((e) => (
                    <div key={e.id}>
                      <p className="font-bold text-neutral-900">{e.degree}</p>
                      <p className="text-neutral-600">{e.school} ({e.year})</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.certifications.length > 0 && (
              <section>
                <h2 className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-neutral-800">Certifications</h2>
                <ul className="mt-1.5 space-y-1 text-[11px] text-neutral-700">{data.certifications.map((s, i) => <li key={i}>• {s}</li>)}</ul>
              </section>
            )}

            {data.languages.length > 0 && (
              <section>
                <h2 className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-neutral-800">Languages</h2>
                <p className="mt-1.5 text-[11.5px] text-neutral-700">{data.languages.join(", ")}</p>
              </section>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 13. CRAFT: Centered Serif Academic Header
  // =========================================================================
  const craft = data.template === "craft";
  // 14. ATLAS: Compact Bar Header
  const atlas = data.template === "atlas";

  // =========================================================================
  // 15. MERIT / ATLAS / CRAFT: Single Column Standard
  // =========================================================================
  return (
    <div className={`resume-sheet px-12 ${craft ? "py-14 text-center" : atlas ? "py-9" : "py-11"}`}>
      {atlas && <div className="mb-6 h-1.5 w-full" style={{ background: accent }} />}
      <header className={craft ? "" : atlas ? "" : "border-b-2 pb-5"} style={craft ? {} : { borderColor: accent }}>
        <h1 className={`font-display font-black leading-none ${craft ? "text-[38px]" : "text-[32px]"} ${atlas ? "uppercase tracking-tight" : ""}`}>
          {c.fullName || "Your Name"}
        </h1>
        {c.title && <p className={`font-semibold ${craft ? "mt-2 text-[14px] tracking-wide" : "mt-1.5 text-[14px]"}`} style={{ color: accent }}>{c.title}</p>}
        <p className={`mt-2.5 flex flex-wrap text-[11px] text-neutral-600 ${craft ? "justify-center" : ""} ${atlas ? "gap-x-3" : "gap-x-4"}`}>
          {contactLine.map((s, i) => <span key={i}>{s}</span>)}
        </p>
      </header>

      <div className={`mt-6 space-y-6 ${craft ? "text-left" : ""}`}>
        {data.summary && (
          <section>
            <h2 className={secCls(craft, atlas)} style={{ color: craft ? undefined : accent }}>{craft && <span className="mx-auto block max-w-[120px] border-b-2 pb-1 text-center" style={{ borderColor: accent }}>Summary</span>}{!craft && "Professional Summary"}</h2>
            <p className="mt-2 text-[12.5px] leading-relaxed">{data.summary}</p>
          </section>
        )}

        {xp.length > 0 && (
          <section>
            <h2 className={secCls(craft, atlas)} style={{ color: craft ? undefined : accent }}>{craft && <span className="mx-auto block max-w-[140px] border-b-2 pb-1 text-center" style={{ borderColor: accent }}>Experience</span>}{!craft && "Experience"}</h2>
            <div className={`space-y-4 ${craft ? "mx-auto max-w-[600px]" : "mt-2.5"}`}>
              {xp.map((e) => (
                <div key={e.id}>
                  <div className={`flex items-baseline justify-between gap-3 ${craft ? "justify-center gap-2" : ""}`}>
                    <p className="text-[13.5px] font-bold">{e.role}{e.company && <span className="font-semibold"> — {e.company}</span>}{e.location && <span className="font-normal text-neutral-500"> · {e.location}</span>}</p>
                    {!craft && <p className="shrink-0 font-mono text-[10px] text-neutral-500">{[e.start, e.end].filter(Boolean).join(" – ")}</p>}
                  </div>
                  {craft && (e.start || e.end) && <p className="text-center font-mono text-[10px] text-neutral-500">{[e.start, e.end].filter(Boolean).join(" – ")}</p>}
                  <ul className={`mt-1 space-y-1 ${craft ? "list-disc pl-5" : ""}`}>
                    {e.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className={`text-[12.5px] leading-snug ${craft ? "" : "flex gap-2"}`}>
                        {!craft && <span className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-full" style={{ background: accent }} />}
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {edu.length > 0 && (
          <section>
            <h2 className={secCls(craft, atlas)} style={{ color: craft ? undefined : accent }}>{craft && <span className="mx-auto block max-w-[120px] border-b-2 pb-1 text-center" style={{ borderColor: accent }}>Education</span>}{!craft && "Education"}</h2>
            <div className={`mt-2 space-y-1.5 ${craft ? "mx-auto max-w-[500px]" : ""}`}>
              {edu.map((e) => (
                <div key={e.id} className={`flex items-baseline justify-between gap-3 ${craft ? "justify-center" : ""}`}>
                  <p className="text-[12.5px]"><span className="font-bold">{e.degree}</span> — {e.school}{e.location && `, ${e.location}`}</p>
                  <p className="font-mono text-[10px] text-neutral-500">{e.year}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.skills.length > 0 && (
          <section>
            <h2 className={secCls(craft, atlas)} style={{ color: craft ? undefined : accent }}>{craft && <span className="mx-auto block max-w-[100px] border-b-2 pb-1 text-center" style={{ borderColor: accent }}>Skills</span>}{!craft && "Skills"}</h2>
            <p className={`mt-2 text-[12.5px] leading-relaxed ${craft ? "text-center" : ""}`}>{data.skills.filter(Boolean).join(atlas ? "  ·  " : ", ")}</p>
          </section>
        )}

        {data.certifications.length > 0 && (
          <section>
            <h2 className={secCls(craft, atlas)} style={{ color: craft ? undefined : accent }}>{craft && <span className="mx-auto block max-w-[170px] border-b-2 pb-1 text-center" style={{ borderColor: accent }}>Certifications</span>}{!craft && "Certifications"}</h2>
            <ul className={`mt-2 space-y-0.5 text-[12.5px] ${craft ? "text-center" : ""}`}>{data.certifications.map((s, i) => <li key={i}>{s}</li>)}</ul>
          </section>
        )}

        {data.languages.length > 0 && (
          <section>
            <h2 className={secCls(craft, atlas)} style={{ color: craft ? undefined : accent }}>{craft && <span className="mx-auto block max-w-[120px] border-b-2 pb-1 text-center" style={{ borderColor: accent }}>Languages</span>}{!craft && "Languages"}</h2>
            <p className={`mt-2 text-[12.5px] ${craft ? "text-center" : ""}`}>{data.languages.join(", ")}</p>
          </section>
        )}
      </div>
    </div>
  );
}

const secCls = (craft: boolean, atlas: boolean) =>
  craft
    ? "font-display text-[16px] font-bold"
    : atlas
      ? "font-mono text-[10.5px] font-bold uppercase tracking-[0.26em] border-b border-neutral-300 pb-1"
      : "font-mono text-[11px] font-bold uppercase tracking-[0.24em]";
