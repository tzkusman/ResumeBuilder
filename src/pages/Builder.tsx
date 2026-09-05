import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useSearchParams } from "react-router-dom";
import { Icon, Seo, Gauge } from "../components/ui";
import ResumeDoc from "../components/ResumeDoc";
import { useResume, useToast, useAuth } from "../store/AppStore";
import { ACCENTS, uid, type ResumeData, type TemplateId, type XpEntry } from "../lib/types";
import { atsScore, extractKeywords, matchKeywords, downloadDocx, downloadTxt, printPdf, shareUrl } from "../lib/utils";
import { track, trackDownload } from "../lib/analytics";
import { isSupabaseConfigured } from "../lib/supabase";
import { getProfession } from "../data/professions";

const TEMPLATES: { id: TemplateId; name: string; note: string }[] = [
  { id: "merit", name: "Merit", note: "ATS-safe · single column" },
  { id: "atlas", name: "Atlas", note: "Compact · modern bar" },
  { id: "ledger", name: "Ledger", note: "Sidebar · visual" },
  { id: "craft", name: "Craft", note: "Serif · centered header" },
  { id: "modern", name: "Modern", note: "Clean · contemporary" },
  { id: "classic", name: "Classic", note: "Traditional · timeless" },
  { id: "elegant", name: "Elegant", note: "Sophisticated · refined" },
  { id: "professional", name: "Professional", note: "Business · formal" },
  { id: "minimal", name: "Minimal", note: "Simple · focused" },
  { id: "bold", name: "Bold", note: "Strong · impactful" },
  { id: "creative", name: "Creative", note: "Artistic · unique" },
  { id: "executive", name: "Executive", note: "Leadership · senior" },
  { id: "academic", name: "Academic", note: "Research · education" },
  { id: "tech", name: "Tech", note: "Startup · innovative" },
  { id: "corporate", name: "Corporate", note: "Enterprise · structured" },
];

const inputCls = "w-full border border-ink/25 bg-white px-3 py-2 text-sm transition-colors placeholder:text-ink-soft/50 focus:border-pine focus:outline-none";
const labelCls = "mb-1 block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft";

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={inputCls} />
    </label>
  );
}

function SectionShell({ title, hint, children, open, onToggle }: { title: string; hint: string; children: React.ReactNode; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-2 border-ink bg-card">
      <button onClick={onToggle} className="flex w-full items-center justify-between px-4 py-3.5 text-left" aria-expanded={open}>
        <div>
          <p className="font-display text-lg font-black leading-none">{title}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-soft">{hint}</p>
        </div>
        <span className={`grid h-7 w-7 place-items-center border-2 border-ink transition-transform duration-300 ${open ? "rotate-180 bg-acid" : "bg-paper"}`}><Icon name="chev" size={14} /></span>
      </button>
      {open && <div className="border-t-2 border-ink/15 p-4">{children}</div>}
    </div>
  );
}

export default function Builder() {
  const { resume, setResume, loadRole, savedAt, saveToCloud } = useResume();
  const { toast } = useToast();
  const { user, isPro, freeExportsLeft, consumeDownload } = useAuth();
  const [gate, setGate] = useState<null | "signin" | "upgrade">(null);
  const [params, setParams] = useSearchParams();
  const [tab, setTab] = useState("contact");
  const [showAts, setShowAts] = useState(false);
  const [jd, setJd] = useState("");
  const [jdAnalyzed, setJdAnalyzed] = useState<ReturnType<typeof matchKeywords> | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const previewWrap = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const bootRef = useRef(false);

  /* Pre-fill from SEO pages: /builder?role=registered-nurse */
  useEffect(() => {
    const role = params.get("role");
    if (role && !bootRef.current) {
      bootRef.current = true;
      if (loadRole(role)) toast(`Loaded the ${getProfession(role)?.title} example — make it yours.`, "ok");
      setParams({}, { replace: true });
    }
  }, [params, loadRole, setParams, toast]);

  /* Responsive preview scale */
  useEffect(() => {
    const el = previewWrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(Math.min(1, el.clientWidth / 794)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const report = useMemo(() => atsScore(resume), [resume]);
  const fileName = resume.contact.fullName.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "resume";

  const set = (fn: (r: ResumeData) => ResumeData) => setResume(fn);
  const setContact = (k: keyof ResumeData["contact"], v: string) => set((r) => ({ ...r, contact: { ...r.contact, [k]: v } }));

  const setXp = (id: string, patch: Partial<XpEntry>) =>
    set((r) => ({ ...r, experience: r.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)) }));

  const analyze = () => {
    if (jd.trim().length < 40) { toast("Paste a fuller job description first (40+ characters).", "warn"); return; }
    const kws = extractKeywords(jd);
    setJdAnalyzed(matchKeywords(resume, kws));
    track("ats_score", { score: report.score, jd: true });
  };

  const addMissing = () => {
    if (!jdAnalyzed) return;
    const missing = jdAnalyzed.filter((k) => !k.matched).map((k) => k.term);
    if (!missing.length) { toast("Nothing missing — you already match every keyword.", "ok"); return; }
    set((r) => ({ ...r, skills: [...r.skills, ...missing.slice(0, 10).map((m) => m.replace(/\b\w/g, (c) => c.toUpperCase()))] }));
    toast(`Added ${Math.min(missing.length, 10)} keywords to your skills.`, "ok");
    setJdAnalyzed(matchKeywords({ ...resume, skills: [...resume.skills, ...missing] }, jdAnalyzed));
  };

  const onExport = (kind: "pdf" | "docx" | "txt" | "share") => {
    setExportOpen(false);
    // Share links stay free for everyone — they're the viral loop.
    if (kind === "share") {
      const url = shareUrl(resume);
      navigator.clipboard?.writeText(url).catch(() => {});
      track("share", {});
      toast("Share link copied to clipboard.", "ok");
      return;
    }
    // Subscription gate: guest → sign in, free → 1 export per account, Pro → unlimited.
    const res = consumeDownload();
    if (!res.allowed) {
      setGate(res.reason === "guest" ? "signin" : "upgrade");
      track("upgrade_view", { trigger: res.reason === "guest" ? "export_guest" : "export_limit", format: kind });
      return;
    }
    const tier = isPro ? "pro" : "free";
    if (kind === "pdf") { printPdf(); trackDownload("pdf", tier); }
    if (kind === "docx") { downloadDocx(resume); trackDownload("docx", tier); toast("DOCX downloaded — opens in Word or Google Docs.", "ok"); }
    if (kind === "txt") { downloadTxt(resume); trackDownload("txt", tier); toast("Plain text downloaded — paste it into any portal.", "ok"); }
    if (!isPro && res.remaining === 0) toast("That was your free export — go Pro for unlimited downloads.", "warn");
  };

  const cloudSave = async () => {
    setSaving(true);
    const ok = await saveToCloud();
    setSaving(false);
    if (!isSupabaseConfigured) { toast("Cloud sync needs Supabase credentials — resume is safe in your browser.", "warn"); return; }
    if (!user) { toast("Sign in first to sync this resume to the cloud.", "warn"); return; }
    toast(ok ? "Saved to your cloud workspace." : "Cloud save failed — check connection.", ok ? "ok" : "warn");
  };

  const sections = [
    { id: "contact", label: "Contact" },
    { id: "summary", label: "Summary" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "extras", label: "Extras" },
  ];

  return (
    <div className="min-h-screen bg-paper">
      <Seo title="Resume Builder — Free ATS-Proof Resume Maker | ResumeBuild" description="Build your resume with a live A4 preview, ATS score, job-description keyword matching and free PDF, DOCX and TXT export." path="/builder" />

      {/* toolbar */}
      <div className="sticky top-16 z-40 border-b-2 border-ink bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-3 px-4 py-3">
          <Link to="/" className="group flex items-center gap-2 text-sm font-bold text-ink-soft hover:text-ink"><Icon name="arrow" size={15} className="rotate-180 transition-transform group-hover:-translate-x-0.5" /> Home</Link>
          <span className="hidden h-5 w-px bg-ink/20 sm:block" />
          <button onClick={() => setShowAts(!showAts)} className={`flex items-center gap-2 border-2 px-3 py-1.5 text-sm font-bold transition-colors ${report.score >= 80 ? "border-pine bg-pine text-paper" : report.score >= 55 ? "border-ink bg-acid-soft" : "border-coral bg-card text-coral"}`}>
            <Icon name="gauge" size={15} /> ATS {report.score}
          </button>
          <span className="hidden font-mono text-[10.5px] text-ink-soft md:block">
            {savedAt ? `autosaved ${new Date(savedAt).toLocaleTimeString()}` : "autosave on"} · stored in your browser
          </span>
          <div className="ml-auto flex items-center gap-2.5">
            {user && isPro && (
              <span className="hidden items-center gap-1.5 border-2 border-ink bg-ink px-2.5 py-1.5 font-mono text-[10.5px] font-bold uppercase tracking-wider text-acid lg:flex"><Icon name="zap" size={13} /> Pro · unlimited</span>
            )}
            {user && !isPro && freeExportsLeft > 0 && (
              <span className="hidden items-center gap-1.5 border border-pine/50 bg-acid-soft px-2.5 py-1.5 font-mono text-[10.5px] font-bold text-pine-deep lg:flex"><Icon name="star" size={13} /> {freeExportsLeft} free export left</span>
            )}
            {!user && (
              <Link to="/auth?next=/builder" className="hidden items-center gap-1.5 border border-dashed border-ink/40 px-2.5 py-1.5 font-mono text-[10.5px] font-bold text-ink-soft transition-colors hover:border-ink hover:text-ink lg:flex"><Icon name="user" size={13} /> Sign in → 1 free export</Link>
            )}
            <button onClick={() => void cloudSave()} disabled={saving} className="hidden items-center gap-2 border border-ink/30 px-3 py-2 text-sm font-semibold text-ink-soft transition-colors hover:border-ink hover:text-ink sm:flex">
              <Icon name="cloud" size={15} /> {saving ? "Saving…" : "Cloud save"}
            </button>
            <div className="relative">
              <button onClick={() => setExportOpen(!exportOpen)} className="hs-sm flex items-center gap-2 border-2 border-ink bg-acid px-4 py-2 text-sm font-bold transition-all hover:-translate-y-0.5">
                <Icon name="download" size={16} /> Export <Icon name="chev" size={13} />
              </button>
              {exportOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-60 border-2 border-ink bg-card hs-sm">
                  {([["pdf", "PDF — ATS-safe print", "doc"], ["docx", "DOCX — editable in Word", "edit"], ["txt", "Plain text — portal paste", "copy"], ["share", "Shareable link — always free", "link"]] as const).map(([k, l, ic]) => (
                    <button key={k} onClick={() => onExport(k)} className="flex w-full items-center gap-3 border-b border-ink/10 px-4 py-3 text-left text-sm font-semibold transition-colors last:border-0 hover:bg-acid-soft">
                      <Icon name={ic} size={16} className="text-pine" /> <span className="flex-1">{l}</span>
                      {k !== "share" && (
                        !user
                          ? <span className="border border-dashed border-ink/40 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase text-ink-soft">sign in</span>
                          : isPro
                            ? <span className="bg-ink px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase text-acid">pro</span>
                            : <span className="border border-pine/50 bg-acid-soft px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase text-pine-deep">{freeExportsLeft} left</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-6 lg:grid-cols-[440px_1fr]">
        {/* ------------ editor column ------------ */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1.5 border-2 border-ink bg-ink p-1.5">
            {sections.map((s) => (
              <button key={s.id} onClick={() => setTab(s.id)} className={`px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors ${tab === s.id ? "bg-acid text-ink" : "text-paper/70 hover:text-paper"}`}>{s.label}</button>
            ))}
          </div>

          {tab === "contact" && (
            <SectionShell title="Contact details" hint="Parsers read these first" open onToggle={() => {}}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Full name" value={resume.contact.fullName} onChange={(v) => setContact("fullName", v)} placeholder="Alex Morgan" />
                <Field label="Job title" value={resume.contact.title} onChange={(v) => setContact("title", v)} placeholder="Registered Nurse" />
                <Field label="Email" type="email" value={resume.contact.email} onChange={(v) => setContact("email", v)} placeholder="alex@email.com" />
                <Field label="Phone" value={resume.contact.phone} onChange={(v) => setContact("phone", v)} placeholder="+1 (555) 014-2288" />
                <Field label="Location" value={resume.contact.location} onChange={(v) => setContact("location", v)} placeholder="City, Country" />
                <Field label="Website / portfolio" value={resume.contact.website} onChange={(v) => setContact("website", v)} placeholder="yoursite.com" />
                <div className="sm:col-span-2"><Field label="LinkedIn" value={resume.contact.linkedin} onChange={(v) => setContact("linkedin", v)} placeholder="linkedin.com/in/you" /></div>
              </div>
            </SectionShell>
          )}

          {tab === "summary" && (
            <SectionShell title="Professional summary" hint="25–90 words · no 'I' or 'my'" open onToggle={() => {}}>
              <textarea value={resume.summary} onChange={(e) => set((r) => ({ ...r, summary: e.target.value }))} rows={6} className={inputCls} placeholder="Licensed professional with 6 years of…" />
              <p className="mt-2 font-mono text-[10.5px] text-ink-soft">{resume.summary.trim().split(/\s+/).filter(Boolean).length} words — aim for 25–90.</p>
            </SectionShell>
          )}

          {tab === "experience" && (
            <div className="space-y-4">
              {resume.experience.map((e, idx) => (
                <SectionShell key={e.id} title={e.role ? `Role ${idx + 1} — ${e.role}` : `Role ${idx + 1}`} hint="3+ metric-rich bullets" open onToggle={() => {}}>
                  <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Job title" value={e.role} onChange={(v) => setXp(e.id, { role: v })} placeholder="Software Engineer II" />
                      <Field label="Company" value={e.company} onChange={(v) => setXp(e.id, { company: v })} placeholder="Northwind Labs" />
                      <Field label="Start" value={e.start} onChange={(v) => setXp(e.id, { start: v })} placeholder="Mar 2022" />
                      <Field label="End" value={e.end} onChange={(v) => setXp(e.id, { end: v })} placeholder="Present" />
                    </div>
                    <Field label="Location" value={e.location} onChange={(v) => setXp(e.id, { location: v })} placeholder="Remote" />
                    <label className="block">
                      <span className={labelCls}>Achievements — one per line, start with a verb, add a number</span>
                      <textarea
                        value={e.bullets.join("\n")}
                        onChange={(ev) => setXp(e.id, { bullets: ev.target.value.split("\n") })}
                        rows={5}
                        className={`${inputCls} font-mono text-[12.5px]`}
                        placeholder={"Cut p95 latency from 840ms to 210ms\nLed a team of 4 through 3 launches"}
                      />
                    </label>
                    <button onClick={() => set((r) => ({ ...r, experience: r.experience.filter((x) => x.id !== e.id) }))} className="flex items-center gap-2 text-xs font-bold text-coral hover:underline">
                      <Icon name="trash" size={13} /> Remove role
                    </button>
                  </div>
                </SectionShell>
              ))}
              <button onClick={() => set((r) => ({ ...r, experience: [...r.experience, { id: uid(), role: "", company: "", location: "", start: "", end: "", bullets: [""] }] }))} className="flex w-full items-center justify-center gap-2 border-2 border-dashed border-ink/40 py-3.5 text-sm font-bold text-ink-soft transition-colors hover:border-ink hover:text-ink">
                <Icon name="plus" size={16} /> Add another role
              </button>
            </div>
          )}

          {tab === "education" && (
            <div className="space-y-4">
              {resume.education.map((e, idx) => (
                <SectionShell key={e.id} title={e.degree ? e.degree : `Entry ${idx + 1}`} hint="Degree, school, year" open onToggle={() => {}}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Degree / program" value={e.degree} onChange={(v) => set((r) => ({ ...r, education: r.education.map((x) => x.id === e.id ? { ...x, degree: v } : x) }))} placeholder="B.S., Computer Science" />
                    <Field label="School" value={e.school} onChange={(v) => set((r) => ({ ...r, education: r.education.map((x) => x.id === e.id ? { ...x, school: v } : x) }))} placeholder="University of Texas" />
                    <Field label="Location" value={e.location} onChange={(v) => set((r) => ({ ...r, education: r.education.map((x) => x.id === e.id ? { ...x, location: v } : x) }))} placeholder="Austin, TX" />
                    <Field label="Year" value={e.year} onChange={(v) => set((r) => ({ ...r, education: r.education.map((x) => x.id === e.id ? { ...x, year: v } : x) }))} placeholder="2019" />
                  </div>
                  <button onClick={() => set((r) => ({ ...r, education: r.education.filter((x) => x.id !== e.id) }))} className="mt-3 flex items-center gap-2 text-xs font-bold text-coral hover:underline"><Icon name="trash" size={13} /> Remove</button>
                </SectionShell>
              ))}
              <button onClick={() => set((r) => ({ ...r, education: [...r.education, { id: uid(), degree: "", school: "", location: "", year: "" }] }))} className="flex w-full items-center justify-center gap-2 border-2 border-dashed border-ink/40 py-3.5 text-sm font-bold text-ink-soft transition-colors hover:border-ink hover:text-ink">
                <Icon name="plus" size={16} /> Add education
              </button>
            </div>
          )}

          {tab === "skills" && (
            <SectionShell title="Skills" hint="The #1 ATS keyword source — aim for 6+" open onToggle={() => {}}>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((s, i) => (
                  <span key={`${s}-${i}`} className="group flex items-center gap-1.5 border border-ink bg-white px-2.5 py-1.5 text-sm font-semibold">
                    {s}
                    <button onClick={() => set((r) => ({ ...r, skills: r.skills.filter((_, j) => j !== i) }))} className="text-ink-soft transition-colors hover:text-coral" aria-label={`Remove ${s}`}><Icon name="x" size={12} /></button>
                  </span>
                ))}
              </div>
              <input
                className={`${inputCls} mt-3`}
                placeholder="Type a skill and press Enter"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const v = (e.target as HTMLInputElement).value.trim();
                    if (v) { set((r) => ({ ...r, skills: [...r.skills, v] })); (e.target as HTMLInputElement).value = ""; }
                  }
                }}
              />
            </SectionShell>
          )}

          {tab === "extras" && (
            <SectionShell title="Certifications & languages" hint="License numbers, CEFR levels" open onToggle={() => {}}>
              <label className="block"><span className={labelCls}>Certifications — one per line</span>
                <textarea value={resume.certifications.join("\n")} onChange={(e) => set((r) => ({ ...r, certifications: e.target.value.split("\n") }))} rows={4} className={`${inputCls} font-mono text-[12.5px]`} placeholder={"PMP (PMI, 2021)\nOSHA 30"} />
              </label>
              <label className="mt-3 block"><span className={labelCls}>Languages — one per line</span>
                <textarea value={resume.languages.join("\n")} onChange={(e) => set((r) => ({ ...r, languages: e.target.value.split("\n") }))} rows={3} className={`${inputCls} font-mono text-[12.5px]`} placeholder={"English (Native)\nUrdu (C2)"} />
              </label>
            </SectionShell>
          )}
        </div>

        {/* ------------ preview column ------------ */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 border-2 border-ink bg-card px-4 py-3">
            <span className="kicker text-ink-soft">Template</span>
            <div className="flex flex-wrap gap-1.5">
              {TEMPLATES.map((tp) => (
                <button key={tp.id} title={tp.note} onClick={() => { set((r) => ({ ...r, template: tp.id })); track("template_select", { template: tp.id }); }}
                  className={`border px-3 py-1.5 text-xs font-bold transition-all ${resume.template === tp.id ? "border-ink bg-ink text-acid" : "border-ink/25 text-ink-soft hover:border-ink hover:text-ink"}`}>
                  {tp.name}
                </button>
              ))}
            </div>
            <span className="hidden h-5 w-px bg-ink/20 sm:block" />
            <span className="kicker text-ink-soft">Ink</span>
            <div className="flex gap-1.5">
              {ACCENTS.map((a) => (
                <button key={a} onClick={() => set((r) => ({ ...r, accent: a }))} aria-label={`Accent ${a}`} className={`h-6 w-6 border-2 transition-transform hover:scale-110 ${resume.accent === a ? "border-ink" : "border-transparent"}`} style={{ background: a }} />
              ))}
            </div>
            {resume.template === "ledger" && (
              <span className="ml-auto flex items-center gap-1.5 border border-coral bg-card px-2 py-1 font-mono text-[10px] font-bold uppercase text-coral"><Icon name="shield" size={12} /> sidebar = ATS risk</span>
            )}
          </div>

          <div ref={previewWrap} className="border-2 border-ink bg-line/40 p-4 sm:p-6">
            <div className="mx-auto overflow-hidden border border-ink/30 bg-white shadow-[0_18px_50px_-20px_rgba(19,31,26,0.35)]" style={{ width: 794 * scale, height: 1123 * scale }}>
              <div className="origin-top-left" style={{ transform: `scale(${scale})`, width: 794 }}>
                <ResumeDoc data={resume} />
              </div>
            </div>
            <p className="mt-3 text-center font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-soft">Live A4 preview — exports print-exact</p>
          </div>
        </div>
      </div>

      {/* ------------ ATS drawer ------------ */}
      {showAts && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/60 p-0 sm:items-center sm:p-6" onClick={() => setShowAts(false)}>
          <div className="toast-in max-h-[92vh] w-full max-w-3xl overflow-y-auto border-2 border-ink bg-paper hs-acid" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b-2 border-ink bg-ink px-5 py-3.5">
              <p className="font-display text-xl font-black text-paper">ATS report <span className="text-acid">·</span> scored live</p>
              <button onClick={() => setShowAts(false)} className="grid h-8 w-8 place-items-center border border-paper/40 text-paper hover:border-acid hover:text-acid" aria-label="Close"><Icon name="x" size={15} /></button>
            </div>
            <div className="grid gap-8 p-6 sm:grid-cols-[auto_1fr]">
              <div className="flex flex-col items-center gap-3">
                <Gauge value={report.score} size={150} />
                <p className="max-w-[160px] text-center font-mono text-[10.5px] leading-relaxed text-ink-soft">{report.score >= 80 ? "Robot-proof. Ship it." : report.score >= 55 ? "Close — fix the red checks below." : "Early draft. The checklist will get you there."}</p>
              </div>
              <ul className="space-y-2">
                {report.checks.map((c) => (
                  <li key={c.label} className={`flex items-start gap-3 border px-3 py-2.5 ${c.pass ? "border-ink/15 bg-card" : "border-coral/50 bg-card"}`}>
                    <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center border ${c.pass ? "border-pine text-pine" : "border-coral text-coral"}`}><Icon name={c.pass ? "check" : "x"} size={11} /></span>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="text-sm font-bold">{c.label}</p>
                        <span className="font-mono text-[10px] text-ink-soft">+{c.weight}</span>
                      </div>
                      <p className="text-xs text-ink-soft">{c.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t-2 border-ink bg-card p-6">
              <p className="kicker text-pine">Tailor to a job description</p>
              <p className="mt-1 text-sm text-ink-soft">Paste the posting. We extract its keywords, show what's missing, and add them to your skills in one click.</p>
              <textarea value={jd} onChange={(e) => setJd(e.target.value)} rows={5} placeholder="Paste the job description here…" className={`${inputCls} mt-3`} />
              <div className="mt-3 flex flex-wrap gap-3">
                <button onClick={analyze} className="hs-sm border-2 border-ink bg-pine px-4 py-2.5 text-sm font-bold text-paper transition-all hover:-translate-y-0.5"><Icon name="sparkle" size={15} className="mr-1.5 inline" />Analyze keywords</button>
                {jdAnalyzed && jdAnalyzed.some((k) => !k.matched) && (
                  <button onClick={addMissing} className="border-2 border-ink bg-acid px-4 py-2.5 text-sm font-bold transition-all hover:-translate-y-0.5">+ Add missing keywords</button>
                )}
              </div>
              {jdAnalyzed && (
                <div className="mt-4">
                  <p className="font-mono text-[11px] text-ink-soft">Matched {jdAnalyzed.filter((k) => k.matched).length}/{jdAnalyzed.length} keywords · {Math.round((jdAnalyzed.filter((k) => k.matched).length / jdAnalyzed.length) * 100)}%</p>
                  <div className="mt-2 h-2 w-full border border-ink bg-white">
                    <div className="h-full bg-pine transition-all duration-700" style={{ width: `${(jdAnalyzed.filter((k) => k.matched).length / jdAnalyzed.length) * 100}%` }} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {jdAnalyzed.map((k) => (
                      <span key={k.term} className={`border px-2 py-1 font-mono text-[11px] font-semibold ${k.matched ? "border-pine bg-pine text-paper" : "border-coral/60 bg-white text-coral"}`}>
                        {k.matched ? "✓ " : "+ "}{k.term}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* subscription gate */}
      {gate && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/60 p-4" onClick={() => setGate(null)}>
          <div className="toast-in w-full max-w-md border-2 border-ink bg-paper hs-acid" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b-2 border-ink bg-ink px-5 py-3.5">
              <p className="font-display text-lg font-black text-paper">{gate === "signin" ? "One free export — on us" : "That was your free export"}</p>
              <button onClick={() => setGate(null)} className="grid h-8 w-8 place-items-center border border-paper/40 text-paper transition-colors hover:border-acid hover:text-acid"><Icon name="x" size={14} /></button>
            </div>
            <div className="p-6">
              {gate === "signin" ? (
                <>
                  <p className="text-sm leading-relaxed text-ink-soft">
                    Create a free account and your first <strong className="text-ink">PDF, DOCX or TXT export is free</strong> — no card required.
                    Your draft is already autosaved in this browser and will be waiting for you.
                  </p>
                  <ul className="mt-4 space-y-2 border-t border-ink/10 pt-4">
                    {["1 export free with every account", "ATS score and 14-check report", "All 4 templates, 20 role examples"].map((b) => (
                      <li key={b} className="flex items-center gap-2.5 text-sm font-semibold"><Icon name="check" size={15} className="text-pine" /> {b}</li>
                    ))}
                  </ul>
                  <Link to="/auth?next=/builder" className="hs-sm mt-5 flex w-full items-center justify-center gap-2 border-2 border-ink bg-acid px-4 py-3 font-bold transition-all hover:-translate-y-0.5">
                    Create free account <Icon name="arrow" size={15} />
                  </Link>
                  <p className="mt-3 text-center font-mono text-[10.5px] text-ink-soft">
                    Already have one? <Link to="/auth?next=/builder" className="font-bold text-pine underline underline-offset-2">Sign in</Link>
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm leading-relaxed text-ink-soft">
                    Every free account includes <strong className="text-ink">1 export</strong> — and you just used it.
                    Pro removes the limit entirely: unlimited PDF, DOCX and TXT, every time you tweak a bullet.
                  </p>
                  <ul className="mt-4 space-y-2 border-t border-ink/10 pt-4">
                    {["Unlimited exports in every format", "Unlimited job-description tailoring", "Unlimited cover letters + LinkedIn About", "Cloud sync across devices"].map((b) => (
                      <li key={b} className="flex items-center gap-2.5 text-sm font-semibold"><Icon name="zap" size={15} className="text-coral" /> {b}</li>
                    ))}
                  </ul>
                  <Link to="/pricing" className="hs-sm mt-5 flex w-full items-center justify-center gap-2 border-2 border-ink bg-acid px-4 py-3 font-bold transition-all hover:-translate-y-0.5">
                    See Pro — from $7/mo <Icon name="arrow" size={15} />
                  </Link>
                  <p className="mt-3 text-center font-mono text-[10.5px] text-ink-soft">Share links stay free — export one to keep applying while you decide.</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* print-only exact copy for the PDF export (portal: must escape #root, which print CSS hides) */}
      {createPortal(<div id="print-root"><ResumeDoc data={resume} /></div>, document.body)}
    </div>
  );
}
