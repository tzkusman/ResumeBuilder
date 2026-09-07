import type { ResumeData } from "../lib/types";

export interface CoverLetterDocProps {
  data: ResumeData;
  company?: string;
  role?: string;
  manager?: string;
  why?: string;
  customBody?: string;
  dateStr?: string;
}

/**
 * Renders the Cover Letter as a 794×1123 A4 sheet formatted in any of the 15 templates,
 * strictly matching the visual theme, layout, accent color, and typography of the resume.
 */
export default function CoverLetterDoc({
  data,
  company = "",
  role = "",
  manager = "Hiring Manager",
  why = "",
  customBody,
  dateStr,
}: CoverLetterDocProps) {
  const { contact: c, accent, template } = data;
  const firstXp = data.experience.find((e) => e.role);
  const targetRole = role || c.title || "the open role";
  const targetCompany = company || "your company";
  const bestMetric = firstXp?.bullets.find((b) => /\d/.test(b));
  const topSkills = data.skills.slice(0, 5).join(", ");
  const date = dateStr || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const contactLine = [c.email, c.phone, c.location, c.website, c.linkedin].filter(Boolean);

  // Default professional letter paragraphs if customBody is not provided
  const paragraphs = customBody
    ? customBody.split("\n\n").filter(Boolean)
    : [
        `I am writing to express my strong interest in the ${targetRole} position at ${targetCompany}. With a proven track record as ${firstXp ? `${firstXp.role} at ${firstXp.company}` : (c.title || "a dedicated professional")}, I have built my career around driving measurable impact, delivering high-performance results, and solving complex problems with agility.`,
        bestMetric
          ? `Throughout my career, I have consistently prioritized measurable business outcomes. In my most recent role, I ${bestMetric.charAt(0).toLowerCase() + bestMetric.slice(1).replace(/\.$/, "")}. Leveraging core competencies in ${topSkills || "key technical and strategic disciplines"}, I bring hands-on execution and the leadership required to hit the ground running.`
          : `Throughout my career, I have consistently prioritized tangible business outcomes and collaborative execution. Leveraging core competencies in ${topSkills || "industry best practices"}, I bring hands-on execution, cross-functional communication, and strategic problem-solving to every initiative.`,
        why
          ? why
          : `What particularly excites me about ${targetCompany} is your team's reputation for high standards and forward-thinking innovation. I am eager to apply my background in ${c.title || "this field"} to help accelerate your upcoming quarterly and annual milestones.`,
        `Thank you for your time and consideration. I would welcome the opportunity to discuss how my qualifications, technical skills, and leadership style directly align with the goals of ${targetCompany}. I look forward to hearing from you.`,
      ];

  // =========================================================================
  // 1. LEDGER: Sidebar Layout for Cover Letter
  // =========================================================================
  if (template === "ledger") {
    return (
      <div className="resume-sheet flex overflow-hidden">
        <aside className="w-[240px] shrink-0 px-6 py-10 text-white" style={{ background: accent }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-80">Application</p>
          <h1 className="mt-3 font-display text-3xl font-black leading-tight">{c.fullName || "Your Name"}</h1>
          <p className="mt-1 text-sm font-semibold opacity-90">{c.title}</p>
          
          <div className="mt-8 space-y-1.5 text-[11px] leading-relaxed opacity-95">
            {contactLine.map((s, i) => <p key={i} className="break-words">{s}</p>)}
          </div>

          <div className="mt-10 border-t border-white/20 pt-6 text-[11px]">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-80">Recipient</p>
            <p className="mt-2 font-bold">{manager || "Hiring Manager"}</p>
            <p className="opacity-90">{company || "Prospective Employer"}</p>
            <p className="mt-4 font-mono text-[10px] opacity-75">{date}</p>
          </div>

          {data.skills.length > 0 && (
            <div className="mt-10 border-t border-white/20 pt-6">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Top Skills</p>
              <ul className="mt-2 space-y-1 text-[11px] opacity-90">
                {data.skills.slice(0, 6).map((s, i) => <li key={i}>• {s}</li>)}
              </ul>
            </div>
          )}
        </aside>

        <main className="flex-1 px-10 py-12 flex flex-col justify-between">
          <div>
            <div className="border-b pb-4" style={{ borderColor: `${accent}30` }}>
              <p className="font-mono text-[11px] font-bold uppercase tracking-wider" style={{ color: accent }}>
                Subject: Application for {targetRole}
              </p>
            </div>

            <p className="mt-8 font-bold text-sm text-neutral-900">Dear {manager || "Hiring Manager"},</p>

            <div className="mt-5 space-y-4 text-[13px] leading-relaxed text-neutral-800">
              {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>

          <div className="mt-10 pt-4 border-t border-neutral-200">
            <p className="text-[13px] text-neutral-600">Sincerely,</p>
            <p className="mt-2 font-display text-lg font-black text-neutral-900">{c.fullName || "Your Name"}</p>
            {c.title && <p className="text-xs font-semibold" style={{ color: accent }}>{c.title}</p>}
          </div>
        </main>
      </div>
    );
  }

  // =========================================================================
  // 2. BOLD: Full-Width Accent Header Banner
  // =========================================================================
  if (template === "bold") {
    return (
      <div className="resume-sheet flex flex-col overflow-hidden">
        <header className="px-10 py-8 text-white" style={{ background: accent }}>
          <h1 className="font-display text-4xl font-black tracking-tight">{c.fullName || "Your Name"}</h1>
          {c.title && <p className="mt-1.5 inline-block bg-white/20 px-2.5 py-0.5 font-mono text-xs font-bold uppercase tracking-wider text-white backdrop-blur-xs">{c.title}</p>}
          <div className="mt-3 flex flex-wrap gap-x-5 text-[11.5px] font-medium opacity-90">
            {contactLine.map((s, i) => <span key={i}>{s}</span>)}
          </div>
        </header>

        <div className="flex-1 px-10 py-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-baseline border-b-2 pb-3" style={{ borderColor: `${accent}30` }}>
              <div>
                <p className="text-[12px] font-bold text-neutral-900">{manager || "Hiring Manager"}</p>
                <p className="text-[11.5px] text-neutral-600">{company || "Target Company"}</p>
              </div>
              <p className="font-mono text-[11px] font-bold text-neutral-500">{date}</p>
            </div>

            <p className="mt-6 font-mono text-xs font-bold uppercase tracking-wide" style={{ color: accent }}>
              Re: Application for {targetRole}
            </p>

            <p className="mt-4 font-bold text-sm text-neutral-900">Dear {manager || "Hiring Manager"},</p>

            <div className="mt-4 space-y-4 text-[13px] leading-relaxed text-neutral-800">
              {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>

          <div className="mt-8 border-l-4 pl-3 py-1" style={{ borderColor: accent }}>
            <p className="text-[12.5px] text-neutral-600">Sincerely,</p>
            <p className="mt-1 font-display text-base font-black text-neutral-900">{c.fullName || "Your Name"}</p>
            {c.title && <p className="text-xs font-semibold" style={{ color: accent }}>{c.title}</p>}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. MODERN: Card Header + Pill Badges
  // =========================================================================
  if (template === "modern") {
    return (
      <div className="resume-sheet px-10 py-9 flex flex-col justify-between">
        <div>
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

          <div className="mt-6 flex justify-between items-baseline text-[12px] text-neutral-700">
            <div>
              <p className="font-bold text-neutral-900">{manager || "Hiring Manager"}</p>
              <p className="text-neutral-600">{company || "Target Company"}</p>
            </div>
            <p className="font-mono text-[11px] text-neutral-500">{date}</p>
          </div>

          <div className="mt-5 border-l-4 pl-3 py-0.5" style={{ borderColor: accent }}>
            <p className="font-mono text-[11px] font-bold uppercase tracking-wider" style={{ color: accent }}>
              Application for {targetRole}
            </p>
          </div>

          <p className="mt-5 font-bold text-sm text-neutral-900">Dear {manager || "Hiring Manager"},</p>

          <div className="mt-4 space-y-4 text-[13px] leading-relaxed text-neutral-800">
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t" style={{ borderColor: `${accent}30` }}>
          <p className="text-[12.5px] text-neutral-600">Sincerely,</p>
          <p className="mt-1 font-display text-base font-black text-neutral-900">{c.fullName || "Your Name"}</p>
          {c.title && <p className="text-xs font-semibold" style={{ color: accent }}>{c.title}</p>}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. CLASSIC: Centered Double Hairline Rules + Serif Font
  // =========================================================================
  if (template === "classic") {
    return (
      <div className="resume-sheet px-12 py-10 font-serif flex flex-col justify-between">
        <div>
          <header className="border-y-2 border-neutral-900 py-3.5 text-center">
            <h1 className="text-3xl font-bold uppercase tracking-widest text-neutral-900">{c.fullName || "Your Name"}</h1>
            {c.title && <p className="mt-1 text-sm font-semibold tracking-wider text-neutral-700" style={{ color: accent }}>{c.title}</p>}
            <p className="mt-2 text-[11px] font-sans text-neutral-600 space-x-3">
              {contactLine.map((s, i) => <span key={i}>{s}{i < contactLine.length - 1 ? "  •  " : ""}</span>)}
            </p>
          </header>

          <div className="mt-6 flex justify-between font-sans text-[12px]">
            <div>
              <p className="font-bold font-serif text-neutral-900">{manager || "Hiring Manager"}</p>
              <p className="text-neutral-700">{company || "Target Organization"}</p>
            </div>
            <p className="italic text-neutral-600">{date}</p>
          </div>

          <p className="mt-6 border-b border-neutral-400 pb-1 text-[11.5px] font-bold uppercase tracking-[0.2em] text-neutral-900 font-serif">
            Re: Application for {targetRole}
          </p>

          <p className="mt-5 font-bold text-sm text-neutral-900">Dear {manager || "Hiring Manager"},</p>

          <div className="mt-4 space-y-4 font-sans text-[13px] leading-relaxed text-neutral-800">
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-neutral-300">
          <p className="text-[13px] text-neutral-600 font-sans">Respectfully,</p>
          <p className="mt-1 font-serif text-lg font-bold text-neutral-900">{c.fullName || "Your Name"}</p>
          {c.title && <p className="font-sans text-xs italic text-neutral-600">{c.title}</p>}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 5. ELEGANT: Luxury Editorial + Vertical Hairline Margin
  // =========================================================================
  if (template === "elegant") {
    return (
      <div className="resume-sheet flex overflow-hidden">
        <div className="w-2 shrink-0" style={{ background: accent }} />
        <div className="flex-1 px-11 py-10 flex flex-col justify-between">
          <div>
            <header className="border-b border-neutral-200 pb-5">
              <h1 className="font-serif text-3xl font-light uppercase tracking-[0.18em] text-neutral-900">{c.fullName || "Your Name"}</h1>
              {c.title && <p className="mt-1 font-serif text-xs italic tracking-widest text-neutral-600" style={{ color: accent }}>{c.title}</p>}
              <p className="mt-3 flex flex-wrap gap-x-4 text-[10.5px] tracking-wider text-neutral-500 uppercase font-sans">
                {contactLine.map((s, i) => <span key={i}>{s}</span>)}
              </p>
            </header>

            <div className="mt-6 flex justify-between font-serif text-[12px]">
              <div>
                <p className="font-medium text-neutral-900">{manager || "Hiring Manager"}</p>
                <p className="italic text-neutral-500">{company || "Target Company"}</p>
              </div>
              <p className="font-mono text-[10px] text-neutral-400">{date}</p>
            </div>

            <p className="mt-6 font-serif text-[11px] font-normal uppercase tracking-[0.28em] text-neutral-500">
              Application for {targetRole}
            </p>

            <p className="mt-5 font-medium text-sm text-neutral-900">Dear {manager || "Hiring Manager"},</p>

            <div className="mt-4 space-y-4 text-[13px] font-light leading-relaxed text-neutral-800">
              {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-neutral-200">
            <p className="font-serif italic text-[12px] text-neutral-500">With highest regards,</p>
            <p className="mt-1 font-serif text-base text-neutral-900 tracking-wider">{c.fullName || "Your Name"}</p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 6. PROFESSIONAL: Solid Accent Badges & Corporate Header
  // =========================================================================
  if (template === "professional") {
    return (
      <div className="resume-sheet px-11 py-9 flex flex-col justify-between">
        <div>
          <header className="flex items-start justify-between border-b-2 pb-5" style={{ borderColor: accent }}>
            <div>
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-neutral-900">{c.fullName || "Your Name"}</h1>
              {c.title && <p className="mt-1 font-bold text-sm tracking-wide text-neutral-700">{c.title}</p>}
            </div>
            <div className="text-right text-[11px] text-neutral-600 space-y-0.5 font-medium">
              {contactLine.map((s, i) => <p key={i}>{s}</p>)}
            </div>
          </header>

          <div className="mt-5 flex justify-between items-baseline text-[12px]">
            <div>
              <p className="font-bold text-neutral-900">{manager || "Hiring Manager"}</p>
              <p className="text-neutral-600">{company || "Corporate Organization"}</p>
            </div>
            <span className="font-mono text-[10.5px] font-semibold text-neutral-600">{date}</span>
          </div>

          <div className="mt-4 inline-block px-2.5 py-0.5 text-white font-mono text-[10px] font-bold uppercase tracking-wider" style={{ background: accent }}>
            Formal Application — {targetRole}
          </div>

          <p className="mt-5 font-bold text-sm text-neutral-900">Dear {manager || "Hiring Manager"},</p>

          <div className="mt-4 space-y-4 text-[13px] leading-relaxed text-neutral-800">
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-neutral-300">
          <p className="text-[12.5px] text-neutral-600">Sincerely,</p>
          <p className="mt-1 font-display text-base font-bold text-neutral-900">{c.fullName || "Your Name"}</p>
          {c.title && <p className="text-xs font-semibold" style={{ color: accent }}>{c.title}</p>}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 7. MINIMAL: Swiss Numbered Header & High Contrast
  // =========================================================================
  if (template === "minimal") {
    return (
      <div className="resume-sheet px-12 py-11 flex flex-col justify-between">
        <div>
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

          <div className="mt-8 flex justify-between font-mono text-[11px] text-neutral-500">
            <div>
              <p className="font-bold text-neutral-900">{manager || "Hiring Manager"}</p>
              <p>{company || "Target Company"}</p>
            </div>
            <p>{date}</p>
          </div>

          <p className="mt-6 font-mono text-[11px] font-bold text-neutral-900">
            01 / APPLICATION &gt; {targetRole}
          </p>

          <p className="mt-5 font-bold text-sm text-neutral-900">Dear {manager || "Hiring Manager"},</p>

          <div className="mt-4 space-y-4 text-[13px] leading-relaxed text-neutral-800">
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-neutral-200">
          <p className="font-mono text-[11px] text-neutral-500">SIGN-OFF</p>
          <p className="mt-1 font-display text-base font-bold text-neutral-900">{c.fullName || "Your Name"}</p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 8. CREATIVE: Asymmetric Pill Header & Creative Flourishes
  // =========================================================================
  if (template === "creative") {
    return (
      <div className="resume-sheet px-11 py-10 flex flex-col justify-between">
        <div>
          <header className="flex flex-wrap items-center justify-between gap-4 border-b pb-5" style={{ borderColor: `${accent}30` }}>
            <div>
              <h1 className="font-display text-4xl font-black text-neutral-900 tracking-tight">{c.fullName || "Your Name"}</h1>
              <span className="mt-1 inline-block rounded-full px-3 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider" style={{ background: accent }}>{c.title || "Creative Candidate"}</span>
            </div>
            <div className="flex flex-col text-right text-[11px] text-neutral-600 font-medium">
              {contactLine.map((s, i) => <span key={i}>{s}</span>)}
            </div>
          </header>

          <div className="mt-6 flex justify-between items-baseline text-[12px]">
            <div>
              <p className="font-bold text-neutral-900">{manager || "Hiring Manager"}</p>
              <p className="text-neutral-600">{company || "Innovative Team"}</p>
            </div>
            <span className="rounded-full bg-neutral-100 px-3 py-1 font-mono text-[10px] font-bold text-neutral-600">{date}</span>
          </div>

          <div className="mt-5 rounded-lg p-3" style={{ background: `${accent}0d` }}>
            <p className="font-display text-xs font-black uppercase tracking-wider" style={{ color: accent }}>
              ✦ Re: {targetRole} Application
            </p>
          </div>

          <p className="mt-5 font-bold text-sm text-neutral-900">Dear {manager || "Hiring Manager"},</p>

          <div className="mt-4 space-y-4 text-[13px] leading-relaxed text-neutral-800">
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t" style={{ borderColor: `${accent}30` }}>
          <p className="text-[12px] text-neutral-600">Warm regards,</p>
          <p className="mt-1 font-display text-lg font-black text-neutral-900">{c.fullName || "Your Name"}</p>
          {c.title && <p className="text-xs font-bold" style={{ color: accent }}>{c.title}</p>}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 9. EXECUTIVE: Monogram Header & Executive Letterhead
  // =========================================================================
  if (template === "executive") {
    const initials = (c.fullName || "Alex Morgan").split(" ").map(w => w[0]).slice(0, 2).join("");
    return (
      <div className="resume-sheet px-11 py-10 flex flex-col justify-between">
        <div>
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

          <div className="mt-6 flex justify-between text-[12px]">
            <div>
              <p className="font-bold font-serif text-neutral-900">{manager || "Hiring Manager"}</p>
              <p className="text-neutral-600">{company || "Enterprise Leadership"}</p>
            </div>
            <p className="font-mono text-[10.5px] font-bold text-neutral-500">{date}</p>
          </div>

          <div className="mt-5 border-l-4 p-2.5" style={{ borderColor: accent, background: `${accent}0d` }}>
            <p className="font-serif text-[11px] font-bold uppercase tracking-widest" style={{ color: accent }}>
              Confidential Application: {targetRole}
            </p>
          </div>

          <p className="mt-5 font-bold text-sm text-neutral-900 font-serif">Dear {manager || "Hiring Manager"},</p>

          <div className="mt-4 space-y-4 text-[13px] leading-relaxed text-neutral-800 font-sans">
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-neutral-300 font-serif">
          <p className="text-[13px] text-neutral-600">Sincerely,</p>
          <p className="mt-1 text-lg font-bold text-neutral-900">{c.fullName || "Your Name"}</p>
          {c.title && <p className="font-sans text-xs uppercase tracking-widest text-neutral-500">{c.title}</p>}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 10. ACADEMIC: Curriculum Vitae Letter of Application
  // =========================================================================
  if (template === "academic") {
    return (
      <div className="resume-sheet px-12 py-10 font-serif flex flex-col justify-between">
        <div>
          <header className="text-center pb-4 border-b">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-neutral-500">Letter of Application</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-neutral-900">{c.fullName || "Your Name"}</h1>
            {c.title && <p className="text-sm italic text-neutral-700">{c.title}</p>}
            <p className="mt-2 text-[11px] text-neutral-600 font-sans space-x-3">
              {contactLine.map((s, i) => <span key={i}>{s}{i < contactLine.length - 1 ? " · " : ""}</span>)}
            </p>
          </header>

          <div className="mt-6 flex justify-between text-[12px] font-sans">
            <div>
              <p className="font-bold font-serif text-neutral-900">{manager || "Search Committee Chair"}</p>
              <p className="text-neutral-700">{company || "Institution / Department"}</p>
            </div>
            <p className="text-neutral-500">{date}</p>
          </div>

          <p className="mt-6 text-[12px] font-bold uppercase tracking-[0.2em] border-b border-neutral-400 pb-0.5" style={{ color: accent }}>
            Re: Candidacy for {targetRole}
          </p>

          <p className="mt-5 font-bold text-sm text-neutral-900">Dear {manager || "Members of the Search Committee"},</p>

          <div className="mt-4 space-y-4 text-[13px] leading-relaxed text-neutral-800 font-sans">
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-neutral-300">
          <p className="text-[13px] text-neutral-600 font-sans">Respectfully submitted,</p>
          <p className="mt-1 font-bold text-base text-neutral-900">{c.fullName || "Your Name"}</p>
          {c.title && <p className="text-xs text-neutral-600 italic font-sans">{c.title}</p>}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 11. TECH: Code-Inspired Terminal Letterhead
  // =========================================================================
  if (template === "tech") {
    return (
      <div className="resume-sheet px-10 py-9 font-mono flex flex-col justify-between">
        <div>
          <header className="border-b-2 pb-4" style={{ borderColor: accent }}>
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-[11px] text-neutral-400">$ cat cover_letter.md</p>
                <h1 className="text-3xl font-black text-neutral-900 tracking-tight">{c.fullName || "Your Name"}</h1>
              </div>
              <span className="border px-2 py-0.5 text-xs font-bold" style={{ borderColor: accent, color: accent }}>
                {`// ${c.title || "Applicant"}`}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 text-[11px] text-neutral-500">
              {contactLine.map((s, i) => <span key={i}>&gt; {s}</span>)}
            </div>
          </header>

          <div className="mt-5 flex justify-between text-[11.5px] text-neutral-600">
            <div>
              <p className="font-bold text-neutral-900">&gt; To: {manager || "Hiring Manager"}</p>
              <p>&gt; Org: {company || "Engineering Team"}</p>
            </div>
            <p>[{date}]</p>
          </div>

          <div className="mt-4 border px-2.5 py-1 text-xs font-bold" style={{ borderColor: accent, color: accent }}>
            # target = &quot;{targetRole}&quot;
          </div>

          <p className="mt-5 font-bold text-sm text-neutral-900 font-sans">Hello {manager || "Hiring Team"},</p>

          <div className="mt-4 space-y-4 text-[12.5px] font-sans leading-relaxed text-neutral-800">
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-neutral-300">
          <p className="text-[11.5px] text-neutral-500">// Best,</p>
          <p className="mt-0.5 font-bold text-base text-neutral-900">{c.fullName || "Your Name"}</p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 12. CORPORATE: Enterprise Fortune 500 Letterhead
  // =========================================================================
  if (template === "corporate") {
    return (
      <div className="resume-sheet px-11 py-9 flex flex-col justify-between">
        <div>
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

          <div className="mt-6 flex justify-between text-[12px]">
            <div>
              <p className="font-bold text-neutral-900">{manager || "Hiring Manager"}</p>
              <p className="text-neutral-600">{company || "Corporate Department"}</p>
            </div>
            <p className="font-mono text-[10.5px] font-semibold text-neutral-500">{date}</p>
          </div>

          <div className="mt-5 border-b pb-1" style={{ borderColor: accent }}>
            <p className="font-display text-xs font-black uppercase tracking-wider" style={{ color: accent }}>
              Subject: Candidacy for {targetRole} Position
            </p>
          </div>

          <p className="mt-5 font-bold text-sm text-neutral-900">Dear {manager || "Hiring Manager"},</p>

          <div className="mt-4 space-y-4 text-[13px] leading-relaxed text-neutral-800">
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-neutral-300">
          <p className="text-[12.5px] text-neutral-600">Sincerely,</p>
          <p className="mt-1 font-display text-base font-bold text-neutral-900">{c.fullName || "Your Name"}</p>
          {c.title && <p className="text-xs font-semibold text-neutral-600">{c.title}</p>}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 13. CRAFT: Centered Serif Academic Letterhead
  // =========================================================================
  if (template === "craft") {
    return (
      <div className="resume-sheet px-12 py-12 text-center flex flex-col justify-between">
        <div>
          <header>
            <h1 className="font-display text-4xl font-black text-neutral-900">{c.fullName || "Your Name"}</h1>
            {c.title && <p className="mt-2 text-sm font-semibold tracking-wide" style={{ color: accent }}>{c.title}</p>}
            <p className="mt-2 flex flex-wrap justify-center gap-x-4 text-[11px] text-neutral-600">
              {contactLine.map((s, i) => <span key={i}>{s}</span>)}
            </p>
          </header>

          <div className="mx-auto my-6 h-0.5 w-24" style={{ background: accent }} />

          <div className="mx-auto max-w-[620px] text-left">
            <div className="flex justify-between text-[12px] text-neutral-600">
              <div>
                <p className="font-bold text-neutral-900">{manager || "Hiring Manager"}</p>
                <p>{company || "Organization"}</p>
              </div>
              <p className="font-mono text-[10.5px]">{date}</p>
            </div>

            <p className="mt-6 font-display text-sm font-bold" style={{ color: accent }}>
              Application for {targetRole}
            </p>

            <p className="mt-4 font-bold text-sm text-neutral-900">Dear {manager || "Hiring Manager"},</p>

            <div className="mt-4 space-y-4 text-[13px] leading-relaxed text-neutral-800">
              {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[620px] text-left mt-8 pt-4 border-t border-neutral-300">
          <p className="text-[12.5px] text-neutral-600">With sincere appreciation,</p>
          <p className="mt-1 font-display text-lg font-bold text-neutral-900">{c.fullName || "Your Name"}</p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 14. ATLAS: Compact Bar Header
  // =========================================================================
  if (template === "atlas") {
    return (
      <div className="resume-sheet px-12 py-10 flex flex-col justify-between">
        <div>
          <div className="mb-6 h-1.5 w-full" style={{ background: accent }} />
          <header>
            <h1 className="font-display text-3xl font-black uppercase tracking-tight text-neutral-900">{c.fullName || "Your Name"}</h1>
            {c.title && <p className="mt-1 text-sm font-semibold" style={{ color: accent }}>{c.title}</p>}
            <p className="mt-2.5 flex flex-wrap gap-x-3 text-[11px] text-neutral-600">
              {contactLine.map((s, i) => <span key={i}>{s}</span>)}
            </p>
          </header>

          <div className="mt-6 flex justify-between text-[12px] text-neutral-700 border-t pt-4">
            <div>
              <p className="font-bold text-neutral-900">{manager || "Hiring Manager"}</p>
              <p className="text-neutral-600">{company || "Target Company"}</p>
            </div>
            <p className="font-mono text-[10.5px] text-neutral-500">{date}</p>
          </div>

          <p className="mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.24em] border-b border-neutral-300 pb-1" style={{ color: accent }}>
            Re: {targetRole}
          </p>

          <p className="mt-5 font-bold text-sm text-neutral-900">Dear {manager || "Hiring Manager"},</p>

          <div className="mt-4 space-y-4 text-[13px] leading-relaxed text-neutral-800">
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-neutral-300">
          <p className="text-[12.5px] text-neutral-600">Sincerely,</p>
          <p className="mt-1 font-display text-base font-black text-neutral-900">{c.fullName || "Your Name"}</p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 15. MERIT: Recruiter-Proof Single Column Standard
  // =========================================================================
  return (
    <div className="resume-sheet px-12 py-11 flex flex-col justify-between">
      <div>
        <header className="border-b-2 pb-5" style={{ borderColor: accent }}>
          <h1 className="font-display text-3xl font-black text-neutral-900">{c.fullName || "Your Name"}</h1>
          {c.title && <p className="mt-1 text-sm font-semibold" style={{ color: accent }}>{c.title}</p>}
          <p className="mt-2.5 flex flex-wrap gap-x-4 text-[11px] text-neutral-600">
            {contactLine.map((s, i) => <span key={i}>{s}</span>)}
          </p>
        </header>

        <div className="mt-6 flex justify-between text-[12px] text-neutral-700">
          <div>
            <p className="font-bold text-neutral-900">{manager || "Hiring Manager"}</p>
            <p className="text-neutral-600">{company || "Target Company"}</p>
          </div>
          <p className="font-mono text-[10.5px] text-neutral-500">{date}</p>
        </div>

        <h2 className="mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: accent }}>
          Application for {targetRole}
        </h2>

        <p className="mt-5 font-bold text-sm text-neutral-900">Dear {manager || "Hiring Manager"},</p>

        <div className="mt-4 space-y-4 text-[13px] leading-relaxed text-neutral-800">
          {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-neutral-300">
        <p className="text-[12.5px] text-neutral-600">Sincerely,</p>
        <p className="mt-1 font-display text-base font-bold text-neutral-900">{c.fullName || "Your Name"}</p>
        {c.title && <p className="text-xs font-semibold" style={{ color: accent }}>{c.title}</p>}
      </div>
    </div>
  );
}
