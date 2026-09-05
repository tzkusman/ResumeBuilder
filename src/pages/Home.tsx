import { useEffect, useMemo, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Icon, Reveal, Gauge, Seo, Kicker, Chip } from "../components/ui";
import ResumeDoc from "../components/ResumeDoc";
import { PROFESSIONS, PROFESSION_CATEGORIES, getProfession } from "../data/professions";
import { COUNTRIES } from "../data/countries";
import { resumeFromProfession } from "../lib/types";
import { useI18n } from "../store/AppStore";
import { track } from "../lib/analytics";
import { parsePdfFile } from "../lib/cv-analyzer";
import { parseCVToResume, mergeCVWithResume } from "../lib/cv-parser";
import type { ResumeData } from "../lib/types";

const ROTATING = ["Registered Nurse", "Software Engineer", "Sales Manager", "Electrician", "Data Analyst", "Elementary Teacher"];

function useTypewriter(words: string[], speed = 85, hold = 2100) {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  useEffect(() => {
    const word = words[i % words.length];
    let pos = 0;
    const typeId = setInterval(() => {
      pos++;
      setText(word.slice(0, pos));
      if (pos >= word.length) clearInterval(typeId);
    }, speed);
    const holdId = setTimeout(() => {
      const delId = setInterval(() => {
        pos--;
        setText(word.slice(0, Math.max(0, pos)));
        if (pos <= 0) { clearInterval(delId); setI((v) => v + 1); }
      }, 32);
    }, hold + words[0].length * speed);
    return () => { clearInterval(typeId); clearTimeout(holdId); };
  }, [i, words, speed, hold]);
  return text;
}

function Hero() {
  const { t } = useI18n();
  const typed = useTypewriter(ROTATING);
  const sample = useMemo(() => resumeFromProfession(getProfession("software-engineer")!), []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const atsFileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  const handlePdfImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    // Validate file type - support PDF and DOCX
    const isPdf = uploadedFile.name.endsWith('.pdf');
    const isDocx = uploadedFile.name.endsWith('.docx') || uploadedFile.name.endsWith('.doc');
    
    if (!isPdf && !isDocx) {
      alert('Please upload a PDF or DOCX file');
      return;
    }

    setIsImporting(true);
    try {
      let text = '';
      
      if (isPdf) {
        // Parse PDF file
        const result = await parsePdfFile(uploadedFile);
        text = result.text;
      } else {
        // For DOCX files, we'll need to read as text (basic support)
        // In production, you'd use a library like mammoth.js for proper DOCX parsing
        text = await uploadedFile.text();
        // Basic cleanup for DOCX text
        text = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      }
      
      // Parse CV into structured resume data
      const parsed = parseCVToResume(text);
      
      // Get existing resume from localStorage or create new one
      const existingResumeStr = localStorage.getItem('rb_resume_v1');
      const existingResume: ResumeData | null = existingResumeStr ? JSON.parse(existingResumeStr) : null;
      
      // Create empty resume as fallback
      const emptyResume: ResumeData = {
        id: Math.random().toString(36).slice(2, 10),
        roleSlug: null,
        contact: { fullName: '', title: '', email: '', phone: '', location: '', website: '', linkedin: '' },
        summary: '',
        experience: [],
        education: [],
        skills: [],
        languages: [],
        certifications: [],
        template: 'merit',
        accent: '#17594a'
      };
      
      // Merge parsed data with existing or empty resume
      const merged = mergeCVWithResume(parsed, existingResume || emptyResume);
      
      // Save to localStorage
      localStorage.setItem('rb_resume_v1', JSON.stringify(merged));
      
      // Show success message
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 5000);
      
      // Redirect to builder
      window.location.href = '/builder';
    } catch (err) {
      console.error('Import error:', err);
      alert('Failed to import CV. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <section className="dotgrid relative overflow-hidden border-b-2 border-ink">
      <div className="pointer-events-none absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-acid/25 blur-[110px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[380px] w-[380px] rounded-full bg-pine/15 blur-[110px]" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pb-24 lg:pt-16">
        <div>
          <Reveal>
            <p className="kicker flex items-center gap-2 text-pine">
              <span className="inline-block h-2 w-2 bg-coral pulse-dot" /> {t("hero.kicker")}
            </p>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="mt-5 font-display text-[44px] font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-[72px]">
              {t("hero.title1")}{" "}
              <em className="relative inline-block text-pine">
                {t("hero.title2")}
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 220 12" fill="none" aria-hidden="true">
                  <path d="M3 9c40-6 140-6 214-3" stroke="var(--color-acid)" strokeWidth="6" strokeLinecap="round" />
                </svg>
              </em>
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">{t("hero.sub")}</p>
          </Reveal>
          <Reveal delay={260}>
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                to="/builder"
                onClick={() => track("cta_click", { label: "home_hero_builder" })}
                className="hs group inline-flex items-center gap-2.5 border-2 border-ink bg-acid px-6 py-3.5 text-base font-bold text-ink transition-all hover:-translate-y-0.5 hover:shadow-[6px_8px_0_0_var(--color-ink)] active:translate-y-0"
              >
                {t("cta.start")} <Icon name="arrow" size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/examples" className="group inline-flex items-center gap-2 border-b-2 border-ink px-1 pb-1 text-base font-bold transition-colors hover:text-pine hover:border-pine">
                {t("hero.cta2")} <Icon name="arrow" size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              {/* Import PDF Button */}
              <button
                onClick={() => atsFileInputRef.current?.click()}
                disabled={isImporting}
                className="group inline-flex items-center gap-2 border-2 border-ink px-4 py-3.5 text-base font-bold transition-all hover:bg-card hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isImporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-ink"></div>
                    Importing...
                  </>
                ) : (
                  <>
                    <Icon name="upload" size={18} />
                    Import PDF
                  </>
                )}
              </button>
              <input
                ref={atsFileInputRef}
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handlePdfImport}
                className="hidden"
              />
            </div>
          </Reveal>
          <Reveal delay={340}>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs text-ink-soft">
              <span><strong className="text-ink">94%</strong> average ATS pass</span>
              <span><strong className="text-ink">20</strong> profession examples</span>
              <span><strong className="text-ink">16</strong> country CV guides</span>
              <span><strong className="text-ink">~90 sec</strong> to a first draft</span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200} className="relative">
          <div className="relative mx-auto max-w-[520px]">
            <div className="absolute -inset-3 rotate-2 border-2 border-ink/15 bg-card" />
            <div className="relative overflow-hidden border-2 border-ink bg-white hs-acid">
              <div className="flex items-center justify-between border-b-2 border-ink bg-acid px-4 py-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">Live preview · A4</span>
                <span className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 border border-ink bg-paper" /><span className="h-2.5 w-2.5 border border-ink bg-paper" /><span className="h-2.5 w-2.5 border border-ink bg-coral" />
                </span>
              </div>
              <div className="overflow-hidden" style={{ height: 430 }}>
                <div className="origin-top-left" style={{ transform: "scale(0.62)", width: 794 }}>
                  <ResumeDoc data={sample} />
                </div>
              </div>
              <div className="border-t-2 border-ink bg-ink px-4 py-2 font-mono text-[11px] text-paper">
                <span className="text-acid">▸ tailoring:</span> {typed}<span className="caret text-acid">▌</span>
              </div>
            </div>
            <div className="floaty absolute -right-4 -top-6 border-2 border-ink bg-card px-4 py-3 hs-sm sm:-right-10">
              <Gauge value={92} size={104} label="ATS pass" />
            </div>
            <div className="floaty-slow absolute -bottom-6 -left-3 flex items-center gap-2 border-2 border-ink bg-pine px-3.5 py-2.5 text-paper hs-sm sm:-left-8">
              <Icon name="shield" size={18} className="text-acid" />
              <span className="text-xs font-bold">12/14 checks passing</span>
            </div>
          </div>
        </Reveal>
      </div>
      {/* Import Success Toast */}
      {importSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in z-50">
          <Icon name="check" size={24} />
          <div>
            <p className="font-semibold">Resume imported successfully!</p>
            <p className="text-sm text-green-100">Redirecting to builder...</p>
          </div>
        </div>
      )}
    </section>
  );
}

function Ticker() {
  const items = PROFESSIONS.map((p) => p.title);
  return (
    <div className="overflow-hidden border-b-2 border-ink bg-ink py-3" aria-label="Profession examples">
      <div className="marquee-track flex items-center gap-3">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0 items-center gap-3">
            {items.map((title, i) => {
              const p = PROFESSIONS[i];
              return (
                <Link key={`${dup}-${p.slug}`} to={`/examples/${p.slug}`} className="group flex items-center gap-3 border border-paper/25 px-3.5 py-1.5 text-sm font-semibold text-paper/85 transition-colors hover:border-acid hover:text-acid">
                  {title} <span className="text-acid transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function AtsSection() {
  return (
    <section className="border-b-2 border-ink bg-pine-deep text-paper">
      <div className="dotgrid-dark mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <div>
          <Reveal><Kicker className="text-acid">The ATS engine</Kicker></Reveal>
          <Reveal delay={80}>
            <h2 className="mt-4 font-display text-4xl font-black leading-tight sm:text-5xl">75% of resumes are killed by a robot. <em className="text-acid">Yours won't be.</em></h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-5 max-w-lg leading-relaxed text-paper/75">
              Every draft is scored against the 14 checks real parsing engines run — contact data, standard headings,
              action verbs, quantified metrics, single-column layout. Paste the job description and the engine shows
              exactly which keywords you're missing.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <ul className="mt-8 space-y-4">
              {[
                ["Parse", "Single-column, standard-heading layouts that survive Workday, Taleo and Greenhouse."],
                ["Match", "Your bullets checked against the posting's own vocabulary — verbs, tools, metrics."],
                ["Score", "A 0–100 report with weighted fixes, so you repair the 12-point gaps first."],
              ].map(([h, b], i) => (
                <li key={h} className="flex gap-4 border-l-2 border-acid/50 pl-4">
                  <span className="font-mono text-sm font-bold text-acid">0{i + 1}</span>
                  <div>
                    <p className="font-display text-lg font-bold">{h}</p>
                    <p className="mt-0.5 text-sm text-paper/70">{b}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={320}>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link to="/ats-checker" className="hs-sm inline-flex items-center gap-2.5 border-2 border-acid bg-acid px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-bold text-ink transition-all hover:-translate-y-0.5">
                Score my resume free <Icon name="arrow" size={17} />
              </Link>
              {/* Import CV Button - same design as Score button */}
              <button
                onClick={() => atsFileInputRef.current?.click()}
                disabled={isImporting}
                className="hs-sm inline-flex items-center gap-2.5 border-2 border-ink bg-card px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-bold text-ink transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isImporting ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-ink"></div>
                    <span className="hidden sm:inline">Importing...</span>
                    <span className="sm:hidden">Import...</span>
                  </>
                ) : (
                  <>
                    <Icon name="upload" size={16} className="sm:size-[18]" />
                    <span className="hidden sm:inline">Import CV</span>
                    <span className="sm:hidden">Import</span>
                    <Icon name="chev" size={12} className="hidden sm:block transition-transform group-hover:translate-y-0.5" />
                  </>
                )}
              </button>
              <input
                ref={atsFileInputRef}
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handlePdfImport}
                className="hidden"
              />
            </div>
          </Reveal>
        </div>
        <Reveal delay={200}>
          <div className="relative mx-auto max-w-md border-2 border-acid/60 bg-ink p-8">
            <div className="absolute -top-4 left-6 border border-acid bg-ink px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-acid">Sample report</div>
            <div className="flex justify-center"><Gauge value={88} size={160} label="ATS score" /></div>
            <ul className="mt-7 space-y-3 text-sm">
              {[
                [true, "Single-column layout", "Parses cleanly in Workday & Taleo"],
                [true, "Quantified metrics", "9 of 10 bullets contain numbers"],
                [true, "Action verbs", "Led, cut, shipped, negotiated…"],
                [false, "Missing keywords", "'Kubernetes' & 'Terraform' not found"],
              ].map(([ok, label, detail]) => (
                <li key={label as string} className="flex items-start gap-3 border-b border-paper/10 pb-3">
                  <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center border ${ok ? "border-acid text-acid" : "border-coral text-coral"}`}>
                    <Icon name={ok ? "check" : "x"} size={12} />
                  </span>
                  <div>
                    <p className="font-bold">{label}</p>
                    <p className="text-xs text-paper/60">{detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ExamplesIndex() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Reveal><Kicker className="text-pine">Programmatic, not generic</Kicker></Reveal>
          <Reveal delay={80}><h2 className="mt-3 font-display text-4xl font-black tracking-tight sm:text-5xl">Real examples for real jobs.</h2></Reveal>
        </div>
        <Reveal delay={160}>
          <Link to="/examples" className="group inline-flex items-center gap-2 border-b-2 border-ink pb-1 font-bold hover:border-pine hover:text-pine">
            Browse all 20 examples <Icon name="arrow" size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
      <div className="mt-10 grid gap-x-12 gap-y-1 md:grid-cols-2">
        {PROFESSIONS.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 6) * 60}>
            <Link to={`/examples/${p.slug}`} className="group flex items-center justify-between gap-4 border-b border-ink/15 px-2 py-4 transition-all hover:bg-card hover:px-4">
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-ink-soft/70">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="font-display text-lg font-bold leading-tight transition-colors group-hover:text-pine">{p.title} <span className="font-body text-sm font-semibold text-ink-soft">Resume Example</span></p>
                  <p className="mt-0.5 font-mono text-[11px] text-ink-soft">{p.category} · {p.salary} · demand: {p.demand}</p>
                </div>
              </div>
              <span className="grid h-8 w-8 shrink-0 place-items-center border-2 border-ink/20 transition-all group-hover:border-ink group-hover:bg-acid"><Icon name="arrow" size={15} /></span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CountriesStrip() {
  return (
    <section className="border-y-2 border-ink bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Reveal><Kicker className="text-pine">Localized experience</Kicker></Reveal>
            <Reveal delay={80}><h2 className="mt-3 font-display text-3xl font-black sm:text-4xl">CV rules change at every border.</h2></Reveal>
          </div>
          <Reveal delay={160}><Chip className="text-pine-deep"><Icon name="globe" size={13} /> 16 country guides · photos, pages, dates, ATS</Chip></Reveal>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {COUNTRIES.slice(0, 8).map((c, i) => (
            <Reveal key={c.code} delay={i * 60}>
              <Link to={`/countries/${c.code}`} className="group flex h-full items-center justify-between border-2 border-ink/15 bg-paper px-4 py-4 transition-all hover:-translate-y-1 hover:border-ink hover:shadow-[4px_4px_0_0_var(--color-ink)]">
                <div>
                  <p className="font-display text-lg font-bold leading-tight group-hover:text-pine">{c.name}</p>
                  <p className="mt-1 font-mono text-[10.5px] uppercase tracking-wider text-ink-soft">
                    {c.docName} · photo: <span className={c.photo === "Never" ? "text-coral font-bold" : "text-pine font-bold"}>{c.photo.toLowerCase()}</span>
                  </p>
                </div>
                <Icon name="arrow" size={16} className="text-ink-soft transition-all group-hover:translate-x-1 group-hover:text-ink" />
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <div className="mt-6 flex flex-wrap gap-2">
            {COUNTRIES.slice(8).map((c) => (
              <Link key={c.code} to={`/countries/${c.code}`} className="border border-ink/20 bg-paper px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:border-ink hover:text-ink">{c.name}</Link>
            ))}
            <Link to="/countries" className="border border-ink bg-ink px-3 py-1.5 text-xs font-bold text-acid transition-transform hover:-translate-y-0.5">All countries →</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    ["Pick your role", "Start from a pre-filled example for your exact profession — nurse, accountant, electrician — or a blank A4 sheet.", "/examples"],
    ["Tailor to the posting", "Paste the job description. The engine matches keywords and rewrites your skills list in one click.", "/builder"],
    ["Export everywhere", "ATS-safe PDF, editable DOCX, plain text, or a shareable link. One click each, all free.", "/pricing"],
  ] as const;
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <Reveal><Kicker className="text-pine">How it works</Kicker></Reveal>
      <div className="mt-8 border-t-2 border-ink">
        {steps.map(([h, b, to], i) => (
          <Reveal key={h} delay={i * 90}>
            <Link to={to} className="group grid grid-cols-[auto_1fr_auto] items-center gap-6 border-b-2 border-ink py-7 transition-colors hover:bg-card sm:gap-10 sm:px-4">
              <span className="font-display text-4xl font-black text-line transition-colors group-hover:text-acid sm:text-6xl">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-display text-2xl font-black sm:text-3xl">{h}</h3>
                <p className="mt-1.5 max-w-2xl text-ink-soft">{b}</p>
              </div>
              <span className="hidden h-11 w-11 place-items-center border-2 border-ink transition-all group-hover:bg-acid sm:grid"><Icon name="arrow" size={19} /></span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState(0);
  const faqs = [
    ["Is ResumeBuild really free?", "Yes. Building, ATS scoring and share links are free forever — and every account gets 1 free PDF/DOCX/TXT export the moment you sign up, no card needed. Pro ($7/mo, $49/yr or $79 lifetime) makes exports, tailoring and cover letters unlimited."],
    ["Will my resume pass ATS software?", "Every draft is checked against the 14 formatting and content rules used by Workday, Taleo, Greenhouse and Lever. The average ResumeBuild draft scores 88+ before export."],
    ["Do you support Pakistani and Indian job markets?", "Yes — dedicated country guides cover the local two-format reality (traditional CV vs. US-style resume), Naukri optimization, notice-period norms, and WhatsApp contact conventions. The interface also toggles between English and اردو."],
    ["What formats can I download?", "ATS-safe PDF (print-perfect A4), DOCX for editing in Word, plain text for portal pasting, and a shareable link that renders your resume online."],
    ["Is my data private?", "Resumes live in your browser by default. If you create an account, data is stored in your private Supabase-backed workspace with row-level security — never sold, never used to train models."],
  ];
  return (
    <section id="faq" className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
      <Reveal><Kicker className="text-center text-pine">Questions</Kicker></Reveal>
      <Reveal delay={80}><h2 className="mt-3 text-center font-display text-4xl font-black">Before you ask.</h2></Reveal>
      <div className="mt-10 border-t-2 border-ink">
        {faqs.map(([q, a], i) => (
          <div key={q} className="border-b-2 border-ink">
            <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 py-5 text-left" aria-expanded={open === i}>
              <span className="font-display text-xl font-bold">{q}</span>
              <span className={`grid h-8 w-8 shrink-0 place-items-center border-2 border-ink transition-transform duration-300 ${open === i ? "rotate-45 bg-acid" : ""}`}><Icon name="plus" size={15} /></span>
            </button>
            <div className={`grid transition-all duration-300 ${open === i ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden"><p className="max-w-2xl leading-relaxed text-ink-soft">{a}</p></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Seo
        title="ResumeBuild — Free ATS-Proof Resume Builder & CV Maker"
        description="Build an ATS-proof resume in minutes with real examples for 20+ professions, CV rules for 16 countries, live ATS scoring and free PDF/DOCX export."
        path="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "ResumeBuild",
          applicationCategory: "BusinessApplication",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          description: "Free ATS-proof resume builder with profession-specific examples and country-by-country CV guides.",
        }}
      />
      <Hero />
      <Ticker />
      <AtsSection />
      <ExamplesIndex />
      <CountriesStrip />
      <HowItWorks />
      <div className="border-y-2 border-ink bg-acid">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-display text-3xl font-black sm:text-5xl">Your next callback is one draft away.</h2>
            <p className="mt-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-pine-deep">1 free export with every account · no card required · {PROFESSION_CATEGORIES.length} industries covered</p>
          </div>
          <Link to="/builder" onClick={() => track("cta_click", { label: "home_bottom_band" })} className="hs group inline-flex shrink-0 items-center gap-3 border-2 border-ink bg-ink px-7 py-4 text-lg font-bold text-acid transition-all hover:-translate-y-0.5">
            Open the builder <Icon name="arrow" size={20} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
      <Faq />
    </>
  );
}
