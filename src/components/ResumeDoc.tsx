import type { ResumeData } from "../lib/types";

/**
 * Renders the resume as a 794×1123 A4 sheet in one of four templates.
 * "merit", "atlas", "craft" are ATS-safe single column; "ledger" uses a
 * sidebar (flagged by the ATS engine as a parsing risk).
 */
export default function ResumeDoc({ data }: { data: ResumeData }) {
  const { contact: c, accent } = data;
  const xp = data.experience.filter((e) => e.role || e.company);
  const edu = data.education.filter((e) => e.degree || e.school);
  const contactLine = [c.email, c.phone, c.location, c.website, c.linkedin].filter(Boolean);

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

  const craft = data.template === "craft";
  const atlas = data.template === "atlas";

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
