import { useEffect, useMemo, useRef, useState, type ReactNode, type ChangeEvent } from "react";
import { createPortal } from "react-dom";
import { Link, useSearchParams } from "react-router-dom";
import { Icon, Seo, Gauge } from "../components/ui";
import ResumeDoc from "../components/ResumeDoc";
import { useResume, useToast, useAuth, useI18n } from "../store/AppStore";
import { ACCENTS, uid, type ResumeData, type TemplateId, type XpEntry } from "../lib/types";
import { atsScore, extractKeywords, matchKeywords, downloadDocx, downloadTxt, printPdf, shareUrl } from "../lib/utils";
import { track, trackDownload } from "../lib/analytics";
import { isSupabaseConfigured } from "../lib/supabase";
import { getProfession, PROFESSIONS } from "../data/professions";

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
  { id: "nordic", name: "Nordic", note: "Minimalist · Scandinavian" },
  { id: "cascade", name: "Cascade", note: "Tiered · dynamic accents" },
  { id: "summit", name: "Summit", note: "Executive · leadership" },
  { id: "onyx", name: "Onyx", note: "High-contrast · precision" },
  { id: "stellar", name: "Stellar", note: "Dual-tone · telemetry" },
];

const METRIC_TEMPLATES = [
  {
    category: "Cost & Efficiency",
    template: "Reduced operational costs by [X]% ($[Y]k/year) by automating and optimizing [process/workflow]."
  },
  {
    category: "Revenue & Growth",
    template: "Increased quarterly revenue by [X]% ($[Y]M) by spearheading the launch and adoption of [initiative]."
  },
  {
    category: "Speed & Performance",
    template: "Optimized core system performance, cutting p95 response latency by [X]% from [A]ms to [B]ms."
  },
  {
    category: "Scale & Reliability",
    template: "Scaled cloud infrastructure to support [X]M+ daily active users while maintaining 99.99% uptime."
  },
  {
    category: "Process Automation",
    template: "Automated manual data and reporting pipelines, saving [X] team hours per week and eliminating errors."
  },
  {
    category: "Leadership & Delivery",
    template: "Led cross-functional squad of [X] engineers and designers to deliver [product] [Y] weeks ahead of schedule."
  },
  {
    category: "Quality & Testing",
    template: "Decreased production incidents by [X]% through implementing automated CI/CD and end-to-end test suites."
  },
  {
    category: "Conversion & Retention",
    template: "Improved user conversion rate by [X]% and customer retention by [Y]% via data-driven A/B experiments."
  }
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

function SectionShell({ title, hint, children, open, onToggle }: { title: string; hint: string; children: ReactNode; open: boolean; onToggle: () => void; key?: any }) {
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
  const { t, getRoleTitle } = useI18n();
  const [gate, setGate] = useState<null | "signin" | "upgrade">(null);
  const [params, setParams] = useSearchParams();
  const [tab, setTab] = useState("contact");
  const [previewPage, setPreviewPage] = useState<"all" | 1 | 2>("all");
  const [showAts, setShowAts] = useState(false);
  const [jd, setJd] = useState("");
  const [jdOpen, setJdOpen] = useState(false);
  const [jdAnalyzed, setJdAnalyzed] = useState<ReturnType<typeof matchKeywords> | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const previewWrap = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const bootRef = useRef(false);

  // Restore saved target job description if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem("rb_target_jd");
      if (saved && !jd) {
        setJd(saved);
      }
    } catch {}
  }, []);

  const handleJdChange = (newJd: string) => {
    setJd(newJd);
    try {
      localStorage.setItem("rb_target_jd", newJd);
    } catch {}
  };

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

  // Dynamic real-time keyword analysis that recalculates as user edits resume
  const liveKeywords = useMemo(() => {
    if (!jd || jd.trim().length < 25) return null;
    const kws = extractKeywords(jd, 16);
    return matchKeywords(resume, kws);
  }, [jd, resume]);

  const insertKeywordToSkills = (term: string) => {
    const formatted = term.replace(/\b\w/g, (c) => c.toUpperCase());
    if (resume.skills.some((s) => s.toLowerCase() === term.toLowerCase())) {
      toast(`"${formatted}" is already in your skills.`, "ok");
      return;
    }
    set((r) => ({ ...r, skills: [...r.skills, formatted] }));
    toast(`Inserted "${formatted}" into Skills!`, "ok");
  };

  const insertKeywordToExperienceBullet = (term: string) => {
    if (!resume.experience.length) {
      toast("Please add an experience entry first.", "warn");
      return;
    }
    const formatted = term.replace(/\b\w/g, (c) => c.toUpperCase());
    const targetXp = resume.experience[0];
    const newBullet = `Leveraged ${formatted} to streamline operational execution and accelerate team roadmap deliverables by 25%.`;
    setXp(targetXp.id, {
      bullets: [...targetXp.bullets.filter(Boolean), newBullet]
    });
    toast(`Added achievement bullet featuring "${formatted}" to ${targetXp.role || "Experience"}!`, "ok");
  };

  const autoInsertAllMissingSkills = () => {
    if (!liveKeywords) return;
    const missing = liveKeywords
      .filter((k) => !k.matched)
      .map((k) => k.term.replace(/\b\w/g, (c) => c.toUpperCase()));
    if (!missing.length) {
      toast("All target keywords already matched!", "ok");
      return;
    }
    const toAdd = missing.filter((m) => !resume.skills.some((s) => s.toLowerCase() === m.toLowerCase()));
    set((r) => ({ ...r, skills: [...r.skills, ...toAdd] }));
    toast(`Inserted ${toAdd.length} missing keywords into Skills!`, "ok");
  };

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

  const [manualZoom, setManualZoom] = useState<number | null>(null);
  const effectiveScale = manualZoom ?? scale;
  const [openMetricMenuId, setOpenMetricMenuId] = useState<string | null>(null);

  const insertMetricTemplate = (id: string, currentBullets: string[], specificIndex?: number) => {
    const existing = currentBullets.map((b) => b.trim());
    let chosen = METRIC_TEMPLATES[0];

    if (typeof specificIndex === "number" && METRIC_TEMPLATES[specificIndex]) {
      chosen = METRIC_TEMPLATES[specificIndex];
    } else {
      // Find the first template that hasn't already been inserted
      const unused = METRIC_TEMPLATES.find((m) => !existing.includes(m.template));
      if (unused) {
        chosen = unused;
      } else {
        // If all are used, cycle to next
        chosen = METRIC_TEMPLATES[existing.length % METRIC_TEMPLATES.length];
      }
    }

    const cleaned = currentBullets.filter((b) => b.trim().length > 0);
    setXp(id, { bullets: [...cleaned, chosen.template] });
    toast(`Added ${chosen.category} metric formula: "${chosen.template.slice(0, 36)}…"`, "ok");
    setOpenMetricMenuId(null);
  };

  const sections = [
    { id: "contact", label: t("builder.tab.contact", "Contact") },
    { id: "summary", label: t("builder.tab.summary", "Summary") },
    { id: "experience", label: t("builder.tab.experience", "Experience") },
    { id: "education", label: t("builder.tab.education", "Education") },
    { id: "skills", label: t("builder.tab.skills", "Skills") },
    { id: "extras", label: t("builder.tab.extras", "Extras") },
    { id: "projects", label: t("builder.tab.projects", "Projects & Details") },
  ];

  return (
    <div className="min-h-screen bg-paper">
      <Seo title="Resume Builder — Free ATS-Proof Resume Maker | ResumeBuild" description="Build your resume with a live A4 preview, ATS score, job-description keyword matching and free PDF, DOCX and TXT export." path="/builder" />

      {/* toolbar */}
      <div className="sticky top-16 z-40 border-b-2 border-ink bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-3 px-4 py-3">
          <Link to="/" className="group flex items-center gap-2 text-sm font-bold text-ink-soft hover:text-ink"><Icon name="arrow" size={15} className="rotate-180 transition-transform group-hover:-translate-x-0.5" /> {t("builder.home", "Home")}</Link>
          <span className="hidden h-5 w-px bg-ink/20 sm:block" />
          <button onClick={() => setShowAts(!showAts)} className={`flex items-center gap-2 border-2 px-3 py-1.5 text-sm font-bold transition-colors ${report.score >= 80 ? "border-pine bg-pine text-paper" : report.score >= 55 ? "border-ink bg-acid-soft" : "border-coral bg-card text-coral"}`}>
            <Icon name="gauge" size={15} /> ATS {report.score}
          </button>
          <span className="hidden font-mono text-[10.5px] text-ink-soft md:block">
            {savedAt ? `autosaved ${new Date(savedAt).toLocaleTimeString()}` : "autosave on"} · stored in your browser
          </span>
          <div className="hidden items-center gap-1.5 lg:flex">
            <span className="font-mono text-[10px] uppercase text-ink-soft">{t("builder.sample", "Sample:")}</span>
            <select
              onChange={(e) => {
                const val = e.target.value;
                if (val) {
                  if (loadRole(val)) toast(`Loaded ${getRoleTitle(val, getProfession(val)?.title)} sample.`, "ok");
                  e.target.value = "";
                }
              }}
              defaultValue=""
              className="border border-ink/25 bg-card px-2 py-1 font-mono text-[11px] font-semibold text-ink-soft hover:border-ink hover:text-ink cursor-pointer"
            >
              <option value="" disabled>{t("builder.loadSample", "Load role sample…")}</option>
              {PROFESSIONS.map((p) => (
                <option key={p.slug} value={p.slug}>{getRoleTitle(p.slug, p.title)}</option>
              ))}
            </select>
          </div>
          <div className="ml-auto flex items-center gap-2.5">
            {user && isPro && (
              <span className="hidden items-center gap-1.5 border-2 border-ink bg-ink px-2.5 py-1.5 font-mono text-[10.5px] font-bold uppercase tracking-wider text-acid lg:flex"><Icon name="zap" size={13} /> {t("builder.proUnlimited", "Pro · unlimited")}</span>
            )}
            {user && !isPro && freeExportsLeft > 0 && (
              <span className="hidden items-center gap-1.5 border border-pine/50 bg-acid-soft px-2.5 py-1.5 font-mono text-[10.5px] font-bold text-pine-deep lg:flex"><Icon name="star" size={13} /> {freeExportsLeft} {t("builder.freeLeft", "free export left")}</span>
            )}
            {!user && (
              <Link to="/auth?next=/builder" className="hidden items-center gap-1.5 border border-dashed border-ink/40 px-2.5 py-1.5 font-mono text-[10.5px] font-bold text-ink-soft transition-colors hover:border-ink hover:text-ink lg:flex"><Icon name="user" size={13} /> {t("builder.signInOneFree", "Sign in → 1 free export")}</Link>
            )}
            <button onClick={() => void cloudSave()} disabled={saving} className="hidden items-center gap-2 border border-ink/30 px-3 py-2 text-sm font-semibold text-ink-soft transition-colors hover:border-ink hover:text-ink sm:flex">
              <Icon name="cloud" size={15} /> {saving ? t("builder.saving", "Saving…") : t("builder.btn.cloudSave", "Cloud save")}
            </button>
            <div className="relative">
              <button onClick={() => setExportOpen(!exportOpen)} className="hs-sm flex items-center gap-2 border-2 border-ink bg-acid px-4 py-2 text-sm font-bold transition-all hover:-translate-y-0.5">
                <Icon name="download" size={16} /> {t("builder.export", "Export")} <Icon name="chev" size={13} />
              </button>
              {exportOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-60 border-2 border-ink bg-card hs-sm">
                  {([["pdf", t("builder.exportPdf", "PDF — ATS-safe print"), "doc"], ["docx", t("builder.exportDocx", "DOCX — editable in Word"), "edit"], ["txt", t("builder.exportTxt", "Plain text — portal paste"), "copy"], ["share", t("builder.exportShare", "Shareable link — always free"), "link"]] as const).map(([k, l, ic]) => (
                    <button key={k} onClick={() => onExport(k as any)} className="flex w-full items-center gap-3 border-b border-ink/10 px-4 py-3 text-left text-sm font-semibold transition-colors last:border-0 hover:bg-acid-soft">
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
          {/* Target Job & Real-Time Automated Keyword Insertion Assistant */}
          <div className="border-2 border-ink bg-card shadow-[4px_4px_0_0_var(--color-ink)]">
            <div className="flex items-center justify-between p-3 border-b border-ink/15 bg-paper/60">
              <div className="flex items-center gap-2">
                <Icon name="check" size={15} className="text-pine" />
                <span className="font-display text-xs font-black text-ink uppercase tracking-wider">Target Job Keyword Assistant</span>
                {liveKeywords && (
                  <span className={`font-mono text-[10px] font-bold px-1.5 py-0.2 border ${
                    liveKeywords.filter(k => k.matched).length / (liveKeywords.length || 1) >= 0.7
                      ? "border-pine bg-acid-soft text-pine-deep"
                      : "border-coral bg-coral/10 text-coral"
                  }`}>
                    {Math.round((liveKeywords.filter(k => k.matched).length / (liveKeywords.length || 1)) * 100)}% Match
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setJdOpen(!jdOpen)}
                className="font-mono text-[10.5px] font-bold text-pine hover:underline flex items-center gap-1"
              >
                {jdOpen ? "Hide" : jd ? "Edit Target JD" : "+ Add Job Description"}
                <Icon name="chev" size={11} className={`transition-transform ${jdOpen ? "rotate-180" : ""}`} />
              </button>
            </div>

            {/* Input Form when opened */}
            {jdOpen && (
              <div className="p-3 border-b border-ink/15 bg-white space-y-2">
                <textarea
                  value={jd}
                  onChange={(e) => handleJdChange(e.target.value)}
                  rows={3}
                  className="w-full border border-ink/25 bg-white p-2 text-xs font-sans focus:border-pine focus:outline-none resize-none placeholder:text-ink-soft/60"
                  placeholder="Paste target job posting text to extract keywords and trigger real-time ATS optimization..."
                />
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex flex-wrap gap-1">
                    <span className="font-mono text-[9px] uppercase text-ink-soft self-center">Presets:</span>
                    <button
                      type="button"
                      onClick={() => handleJdChange("Looking for a Senior Software Engineer with expertise in React, TypeScript, Node.js, AWS, Kubernetes, Docker, PostgreSQL, REST APIs, Microservices, and Agile CI/CD delivery.")}
                      className="border border-ink/20 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-ink-soft hover:border-ink hover:text-ink"
                    >
                      Tech Role
                    </button>
                    <button
                      type="button"
                      onClick={() => handleJdChange("Seeking a Senior Product Manager to lead product discovery, roadmaps, cross-functional engineering execution, user research, OKRs, KPI metrics, SQL data analytics, and A/B testing.")}
                      className="border border-ink/20 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-ink-soft hover:border-ink hover:text-ink"
                    >
                      Product Lead
                    </button>
                  </div>
                  {jd && (
                    <button
                      type="button"
                      onClick={() => handleJdChange("")}
                      className="font-mono text-[9.5px] text-coral hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Live Keyword Insertion Dashboard */}
            {liveKeywords && (
              <div className="p-3 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[10.5px] font-bold text-ink-soft">
                    {liveKeywords.filter(k => k.matched).length} matched · {liveKeywords.filter(k => !k.matched).length} missing
                  </span>
                  {liveKeywords.some(k => !k.matched) && (
                    <button
                      type="button"
                      onClick={autoInsertAllMissingSkills}
                      className="border border-pine bg-acid px-2 py-0.5 font-mono text-[10px] font-bold text-ink hover:bg-acid-soft transition-colors"
                    >
                      ⚡ Auto-Insert Missing to Skills
                    </button>
                  )}
                </div>

                {/* Missing Keywords with 1-Click Insertion */}
                {liveKeywords.filter(k => !k.matched).length > 0 && (
                  <div>
                    <span className="font-mono text-[9px] uppercase font-bold text-coral block mb-1">
                      Missing Keywords (Click to Insert):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {liveKeywords.filter(k => !k.matched).map((kw) => (
                        <div
                          key={kw.term}
                          className="inline-flex items-center border border-coral/30 bg-coral/5 px-1.5 py-0.5 text-xs gap-1"
                        >
                          <span className="font-semibold text-coral text-[11px]">{kw.term}</span>
                          <button
                            type="button"
                            onClick={() => insertKeywordToSkills(kw.term)}
                            title="Insert into Skills section"
                            className="border border-coral/40 bg-white px-1 font-mono text-[9px] font-bold text-ink hover:bg-acid hover:border-ink"
                          >
                            +Skill
                          </button>
                          <button
                            type="button"
                            onClick={() => insertKeywordToExperienceBullet(kw.term)}
                            title="Insert as quantifiable achievement bullet in Experience"
                            className="border border-coral/40 bg-white px-1 font-mono text-[9px] font-bold text-ink hover:bg-acid hover:border-ink"
                          >
                            +Bullet
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matched Keywords */}
                {liveKeywords.filter(k => k.matched).length > 0 && (
                  <div>
                    <span className="font-mono text-[9px] uppercase font-bold text-pine block mb-1">
                      Matched in Live Resume:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {liveKeywords.filter(k => k.matched).map((kw) => (
                        <span
                          key={kw.term}
                          className="border border-pine/30 bg-acid-soft px-1.5 py-0.5 font-mono text-[9.5px] font-bold text-pine-deep"
                        >
                          ✓ {kw.term}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 border-2 border-ink bg-ink p-1.5">
            {sections.map((s) => (
              <button key={s.id} onClick={() => setTab(s.id)} className={`px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors ${tab === s.id ? "bg-acid text-ink" : "text-paper/70 hover:text-paper"}`}>{s.label}</button>
            ))}
          </div>

          {tab === "contact" && (
            <SectionShell title={t("builder.contactTitle", "Contact details")} hint={t("builder.contactHint", "Parsers read these first")} open onToggle={() => {}}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label={t("builder.fullName", "Full name")} value={resume.contact.fullName} onChange={(v) => setContact("fullName", v)} placeholder="Alex Morgan" />
                <Field label={t("builder.jobTitle", "Job title")} value={resume.contact.title} onChange={(v) => setContact("title", v)} placeholder="Registered Nurse" />
                <Field label={t("builder.email", "Email")} type="email" value={resume.contact.email} onChange={(v) => setContact("email", v)} placeholder="alex@email.com" />
                <Field label={t("builder.phone", "Phone")} value={resume.contact.phone} onChange={(v) => setContact("phone", v)} placeholder="+1 (555) 014-2288" />
                <Field label={t("builder.location", "Location")} value={resume.contact.location} onChange={(v) => setContact("location", v)} placeholder="City, Country" />
                <Field label={t("builder.website", "Website / portfolio")} value={resume.contact.website} onChange={(v) => setContact("website", v)} placeholder="yoursite.com" />
                <div className="sm:col-span-2"><Field label={t("builder.linkedin", "LinkedIn")} value={resume.contact.linkedin} onChange={(v) => setContact("linkedin", v)} placeholder="linkedin.com/in/you" /></div>
              </div>
            </SectionShell>
          )}

          {tab === "summary" && (
            <SectionShell title={t("builder.summaryTitle", "Professional summary")} hint={t("builder.summaryHint", "25–90 words · no 'I' or 'my'")} open onToggle={() => {}}>
              <textarea value={resume.summary} onChange={(e) => set((r) => ({ ...r, summary: e.target.value }))} rows={6} className={inputCls} placeholder="Licensed professional with 6 years of…" />
              <p className="mt-2 font-mono text-[10.5px] text-ink-soft">{resume.summary.trim().split(/\s+/).filter(Boolean).length} words — aim for 25–90.</p>
            </SectionShell>
          )}

          {tab === "experience" && (
            <div className="space-y-4">
              {resume.experience.map((e, idx) => (
                <SectionShell key={e.id} title={e.role ? `${t("builder.role", "Role")} ${idx + 1} — ${e.role}` : `${t("builder.role", "Role")} ${idx + 1}`} hint={t("builder.xpHint", "3+ metric-rich bullets")} open onToggle={() => {}}>
                  <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label={t("builder.jobTitle", "Job title")} value={e.role} onChange={(v) => setXp(e.id, { role: v })} placeholder="Software Engineer II" />
                      <Field label={t("builder.company", "Company")} value={e.company} onChange={(v) => setXp(e.id, { company: v })} placeholder="Northwind Labs" />
                      <Field label={t("builder.start", "Start")} value={e.start} onChange={(v) => setXp(e.id, { start: v })} placeholder="Mar 2022" />
                      <Field label={t("builder.end", "End")} value={e.end} onChange={(v) => setXp(e.id, { end: v })} placeholder="Present" />
                    </div>
                    <Field label={t("builder.location", "Location")} value={e.location} onChange={(v) => setXp(e.id, { location: v })} placeholder="Remote" />
                    <label className="block">
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                        <span className={labelCls}>{t("builder.achievements", "Achievements — one per line, start with a verb, add a number")}</span>
                      </div>
                      <div className="mb-2 flex flex-wrap items-center gap-1">
                        <span className="font-mono text-[10px] uppercase text-ink-soft">{t("builder.actionVerbs", "Action verbs:")}</span>
                        {["Spearheaded", "Engineered", "Accelerated", "Reduced", "Architected", "Automated", "Optimized", "Delivered"].map((verb) => (
                          <button
                            key={verb}
                            type="button"
                            onClick={() => {
                              const last = e.bullets[e.bullets.length - 1] || "";
                              const updated = [...e.bullets];
                              if (!last.trim()) {
                                updated[updated.length - 1] = `${verb} `;
                              } else {
                                updated.push(`${verb} `);
                              }
                              setXp(e.id, { bullets: updated });
                            }}
                            className="border border-ink/20 bg-card px-1.5 py-0.5 font-mono text-[10px] font-semibold text-pine hover:border-pine hover:bg-acid-soft"
                          >
                            +{verb}
                          </button>
                        ))}
                        <div className="relative ml-auto inline-flex items-center">
                          <button
                            type="button"
                            onClick={() => insertMetricTemplate(e.id, e.bullets)}
                            className="border border-pine/40 bg-acid px-2 py-0.5 font-mono text-[10px] font-bold text-ink hover:border-ink hover:bg-acid-soft transition-colors"
                            title="Add quantifiable achievement formula (cycles through 8 varied metric types)"
                          >
                            + Metric Template
                          </button>
                          <button
                            type="button"
                            onClick={() => setOpenMetricMenuId(openMetricMenuId === e.id ? null : e.id)}
                            className="border-y border-r border-pine/40 bg-acid px-1.5 py-0.5 font-mono text-[10px] font-bold text-ink hover:bg-paper transition-colors"
                            title="Choose specific metric formula"
                            aria-label="Choose metric formula"
                          >
                            ▾
                          </button>
                          {openMetricMenuId === e.id && (
                            <div className="absolute right-0 top-full z-30 mt-1 w-72 border-2 border-ink bg-card p-1.5 shadow-md">
                              <div className="mb-1 border-b border-ink/10 pb-1 font-mono text-[9.5px] font-bold uppercase text-ink-soft">
                                Select Quantifiable Metric:
                              </div>
                              <div className="max-h-56 space-y-1 overflow-y-auto">
                                {METRIC_TEMPLATES.map((m, mIdx) => (
                                  <button
                                    key={mIdx}
                                    type="button"
                                    onClick={() => insertMetricTemplate(e.id, e.bullets, mIdx)}
                                    className="w-full text-left rounded p-1.5 font-mono text-[10px] hover:bg-acid-soft transition-colors"
                                  >
                                    <span className="font-bold text-pine block">{m.category}</span>
                                    <span className="text-ink-soft line-clamp-2">{m.template}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <textarea
                        value={e.bullets.join("\n")}
                        onChange={(ev) => setXp(e.id, { bullets: ev.target.value.split("\n") })}
                        rows={5}
                        className={`${inputCls} font-mono text-[12.5px]`}
                        placeholder={"Cut p95 latency from 840ms to 210ms\nLed a team of 4 through 3 launches"}
                      />
                    </label>
                    <button onClick={() => set((r) => ({ ...r, experience: r.experience.filter((x) => x.id !== e.id) }))} className="flex items-center gap-2 text-xs font-bold text-coral hover:underline">
                      <Icon name="trash" size={13} /> {t("builder.removeRole", "Remove role")}
                    </button>
                  </div>
                </SectionShell>
              ))}
              <button onClick={() => set((r) => ({ ...r, experience: [...r.experience, { id: uid(), role: "", company: "", location: "", start: "", end: "", bullets: [""] }] }))} className="flex w-full items-center justify-center gap-2 border-2 border-dashed border-ink/40 py-3.5 text-sm font-bold text-ink-soft transition-colors hover:border-ink hover:text-ink">
                <Icon name="plus" size={16} /> {t("builder.addRole", "Add another role")}
              </button>
            </div>
          )}

          {tab === "education" && (
            <div className="space-y-4">
              {resume.education.map((e, idx) => (
                <SectionShell key={e.id} title={e.degree ? e.degree : `Entry ${idx + 1}`} hint={t("builder.degree", "Degree, school, year")} open onToggle={() => {}}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label={t("builder.degree", "Degree / program")} value={e.degree} onChange={(v) => set((r) => ({ ...r, education: r.education.map((x) => x.id === e.id ? { ...x, degree: v } : x) }))} placeholder="B.S., Computer Science" />
                    <Field label={t("builder.school", "School")} value={e.school} onChange={(v) => set((r) => ({ ...r, education: r.education.map((x) => x.id === e.id ? { ...x, school: v } : x) }))} placeholder="University of Texas" />
                    <Field label={t("builder.location", "Location")} value={e.location} onChange={(v) => set((r) => ({ ...r, education: r.education.map((x) => x.id === e.id ? { ...x, location: v } : x) }))} placeholder="Austin, TX" />
                    <Field label={t("builder.year", "Year")} value={e.year} onChange={(v) => set((r) => ({ ...r, education: r.education.map((x) => x.id === e.id ? { ...x, year: v } : x) }))} placeholder="2019" />
                  </div>
                  <button onClick={() => set((r) => ({ ...r, education: r.education.filter((x) => x.id !== e.id) }))} className="mt-3 flex items-center gap-2 text-xs font-bold text-coral hover:underline"><Icon name="trash" size={13} /> {t("builder.remove", "Remove")}</button>
                </SectionShell>
              ))}
              <button onClick={() => set((r) => ({ ...r, education: [...r.education, { id: uid(), degree: "", school: "", location: "", year: "" }] }))} className="flex w-full items-center justify-center gap-2 border-2 border-dashed border-ink/40 py-3.5 text-sm font-bold text-ink-soft transition-colors hover:border-ink hover:text-ink">
                <Icon name="plus" size={16} /> {t("builder.addEducation", "Add education")}
              </button>
            </div>
          )}

          {tab === "skills" && (
            <SectionShell title={t("builder.skillsTitle", "Skills")} hint={t("builder.skillsHint", "The #1 ATS keyword source — aim for 6+")} open onToggle={() => {}}>
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
                placeholder={t("builder.typeSkill", "Type a skill and press Enter")}
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
            <SectionShell title={t("builder.extrasTitle", "Certifications & languages")} hint={t("builder.extrasHint", "License numbers, CEFR levels")} open onToggle={() => {}}>
              <label className="block"><span className={labelCls}>{t("builder.certifications", "Certifications — one per line")}</span>
                <textarea value={resume.certifications.join("\n")} onChange={(e) => set((r) => ({ ...r, certifications: e.target.value.split("\n") }))} rows={4} className={`${inputCls} font-mono text-[12.5px]`} placeholder={"PMP (PMI, 2021)\nOSHA 30"} />
              </label>
              <label className="mt-3 block"><span className={labelCls}>{t("builder.languages", "Languages — one per line")}</span>
                <textarea value={resume.languages.join("\n")} onChange={(e) => set((r) => ({ ...r, languages: e.target.value.split("\n") }))} rows={3} className={`${inputCls} font-mono text-[12.5px]`} placeholder={"English (Native)\nUrdu (C2)"} />
              </label>
            </SectionShell>
          )}

          {tab === "projects" && (
            <div className="space-y-4">
              {/* Page count selector card */}
              <div className="border-2 border-ink bg-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-base font-bold text-ink">Resume Format & Pages</p>
                    <p className="font-mono text-[10.5px] text-ink-soft">1-page standard ATS or 2-page extended CV</p>
                  </div>
                  <div className="inline-flex border-2 border-ink bg-white p-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        set((r) => ({ ...r, pageCount: 1 }));
                        toast("Set to 1-Page Resume format.", "ok");
                      }}
                      className={`px-3 py-1.5 font-mono text-[11px] font-bold ${resume.pageCount !== 2 ? "bg-ink text-acid" : "text-ink-soft hover:text-ink"}`}
                    >
                      1 Page (A4)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        set((r) => ({ ...r, pageCount: 2 }));
                        toast("Set to 2-Page Resume format. Extended projects and details enabled.", "ok");
                      }}
                      className={`px-3 py-1.5 font-mono text-[11px] font-bold ${resume.pageCount === 2 ? "bg-ink text-acid" : "text-ink-soft hover:text-ink"}`}
                    >
                      2 Pages (Extended)
                    </button>
                  </div>
                </div>
              </div>

              {/* Projects List */}
              <SectionShell title="Key Projects & Systems" hint="Deliverables, systems, or case studies (ideal for Page 2)" open onToggle={() => {}}>
                <div className="space-y-4">
                  {(resume.projects || []).map((p, idx) => (
                    <div key={p.id || idx} className="border border-ink/20 bg-white p-3 space-y-2">
                      <div className="grid gap-2 sm:grid-cols-2">
                        <Field label="Project Title" value={p.title} onChange={(v) => set((r) => ({ ...r, projects: (r.projects || []).map((x) => x.id === p.id ? { ...x, title: v } : x) }))} placeholder="Enterprise Data Migration" />
                        <Field label="Tech Stack / Role" value={p.subtitle || ""} onChange={(v) => set((r) => ({ ...r, projects: (r.projects || []).map((x) => x.id === p.id ? { ...x, subtitle: v } : x) }))} placeholder="React, Node.js, AWS" />
                      </div>
                      <Field label="Timeline / Date" value={p.date || ""} onChange={(v) => set((r) => ({ ...r, projects: (r.projects || []).map((x) => x.id === p.id ? { ...x, date: v } : x) }))} placeholder="2023 – 2024" />
                      <label className="block">
                        <span className={labelCls}>Bullet points (one per line)</span>
                        <textarea
                          value={(p.bullets || []).join("\n")}
                          onChange={(ev) => set((r) => ({ ...r, projects: (r.projects || []).map((x) => x.id === p.id ? { ...x, bullets: ev.target.value.split("\n") } : x) }))}
                          rows={3}
                          className={`${inputCls} font-mono text-[12px]`}
                          placeholder={"Architected microservices reducing latency by 35%\nAutomated CI/CD pipeline cutting deploy time in half"}
                        />
                      </label>
                      <button onClick={() => set((r) => ({ ...r, projects: (r.projects || []).filter((x) => x.id !== p.id) }))} className="flex items-center gap-1.5 text-xs font-bold text-coral hover:underline">
                        <Icon name="trash" size={12} /> Remove project
                      </button>
                    </div>
                  ))}
                  <button onClick={() => set((r) => ({ ...r, projects: [...(r.projects || []), { id: uid(), title: "", subtitle: "", date: "", bullets: [""] }] }))} className="flex w-full items-center justify-center gap-2 border-2 border-dashed border-ink/40 py-2.5 text-xs font-bold text-ink-soft hover:border-ink hover:text-ink">
                    <Icon name="plus" size={14} /> + Add Project
                  </button>
                </div>
              </SectionShell>

              {/* Volunteer Roles */}
              <SectionShell title="Volunteering & Leadership" hint="Community leadership, mentoring, non-profit or civic work" open onToggle={() => {}}>
                <div className="space-y-3">
                  {(resume.volunteer || []).map((v, idx) => (
                    <div key={v.id || idx} className="border border-ink/20 bg-white p-3 space-y-2">
                      <div className="grid gap-2 sm:grid-cols-3">
                        <Field label="Role" value={v.role} onChange={(val) => set((r) => ({ ...r, volunteer: (r.volunteer || []).map((x) => x.id === v.id ? { ...x, role: val } : x) }))} placeholder="Senior Mentor" />
                        <Field label="Organization" value={v.org} onChange={(val) => set((r) => ({ ...r, volunteer: (r.volunteer || []).map((x) => x.id === v.id ? { ...x, org: val } : x) }))} placeholder="Code For All" />
                        <Field label="Timeline" value={v.year || ""} onChange={(val) => set((r) => ({ ...r, volunteer: (r.volunteer || []).map((x) => x.id === v.id ? { ...x, year: val } : x) }))} placeholder="2022 – Present" />
                      </div>
                      <button onClick={() => set((r) => ({ ...r, volunteer: (r.volunteer || []).filter((x) => x.id !== v.id) }))} className="flex items-center gap-1.5 text-xs font-bold text-coral hover:underline">
                        <Icon name="trash" size={12} /> Remove role
                      </button>
                    </div>
                  ))}
                  <button onClick={() => set((r) => ({ ...r, volunteer: [...(r.volunteer || []), { id: uid(), role: "", org: "", year: "", bullets: [] }] }))} className="flex w-full items-center justify-center gap-2 border-2 border-dashed border-ink/40 py-2.5 text-xs font-bold text-ink-soft hover:border-ink hover:text-ink">
                    <Icon name="plus" size={14} /> + Add Volunteer Role
                  </button>
                </div>
              </SectionShell>
            </div>
          )}
        </div>

        {/* ------------ preview column ------------ */}
        <div className="space-y-4">
          {/* Page Length & Add/Delete Page 2 Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-ink bg-card px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="kicker text-ink-soft">Pages</span>
              <div className="inline-flex border-2 border-ink bg-white p-0.5">
                <button
                  type="button"
                  onClick={() => {
                    set((r) => ({ ...r, pageCount: 1 }));
                    toast("Switched to 1-Page Resume format.", "ok");
                  }}
                  className={`px-3 py-1 text-xs font-bold transition-colors ${resume.pageCount !== 2 ? "bg-ink text-acid" : "text-ink-soft hover:text-ink"}`}
                >
                  1 Page
                </button>
                <button
                  type="button"
                  onClick={() => {
                    set((r) => ({ ...r, pageCount: 2 }));
                    toast("Enabled 2-Page Resume format. Extended projects and details enabled.", "ok");
                  }}
                  className={`px-3 py-1 text-xs font-bold transition-colors ${resume.pageCount === 2 ? "bg-ink text-acid" : "text-ink-soft hover:text-ink"}`}
                >
                  2 Pages
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {resume.pageCount === 2 ? (
                <>
                  <div className="flex items-center gap-1 font-mono text-[10px] text-ink-soft mr-2">
                    <span>View:</span>
                    <button type="button" onClick={() => setPreviewPage("all")} className={`px-2 py-0.5 border ${previewPage === "all" ? "bg-ink text-paper border-ink" : "bg-white border-ink/20"}`}>Both</button>
                    <button type="button" onClick={() => setPreviewPage(1)} className={`px-2 py-0.5 border ${previewPage === 1 ? "bg-ink text-paper border-ink" : "bg-white border-ink/20"}`}>P1</button>
                    <button type="button" onClick={() => setPreviewPage(2)} className={`px-2 py-0.5 border ${previewPage === 2 ? "bg-ink text-paper border-ink" : "bg-white border-ink/20"}`}>P2</button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      set((r) => ({ ...r, pageCount: 1 }));
                      toast("Deleted Page 2. Reverted to 1-page format.", "ok");
                    }}
                    className="flex items-center gap-1.5 border border-coral/50 bg-coral/10 px-2.5 py-1 text-xs font-bold text-coral hover:bg-coral/20"
                    title="Switch to 1-page format"
                  >
                    <Icon name="trash" size={13} /> Delete Page 2
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    set((r) => ({ ...r, pageCount: 2 }));
                    toast("Added Page 2 to resume. You can now add extended experience & projects.", "ok");
                  }}
                  className="flex items-center gap-1.5 border border-pine/60 bg-acid px-3 py-1 text-xs font-bold text-ink hover:bg-acid-soft"
                >
                  <Icon name="plus" size={14} /> + Add Page 2
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-2 border-ink bg-card px-4 py-3">
            <span className="kicker text-ink-soft">{t("builder.template", "Template")}</span>
            <div className="flex flex-wrap gap-1.5">
              {TEMPLATES.map((tp) => (
                <button key={tp.id} title={tp.note} onClick={() => { set((r) => ({ ...r, template: tp.id })); track("template_select", { template: tp.id }); }}
                  className={`border px-3 py-1.5 text-xs font-bold transition-all ${resume.template === tp.id ? "border-ink bg-ink text-acid" : "border-ink/25 text-ink-soft hover:border-ink hover:text-ink"}`}>
                  {tp.name}
                </button>
              ))}
            </div>
            <span className="hidden h-5 w-px bg-ink/20 sm:block" />
            <span className="kicker text-ink-soft">{t("builder.ink", "Ink")}</span>
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
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-1">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-soft">{t("builder.livePreview", "Live A4 preview")} ({Math.round(effectiveScale * 100)}%)</span>
              <div className="flex items-center gap-1 border border-ink/30 bg-card px-2 py-1">
                <button type="button" onClick={() => setManualZoom((z) => Math.max(0.25, (z ?? scale) - 0.1))} className="px-1.5 py-0.5 text-xs font-bold hover:bg-line text-ink" title="Zoom out">-</button>
                <span className="w-10 text-center font-mono text-[10.5px] font-bold text-ink-soft">{Math.round(effectiveScale * 100)}%</span>
                <button type="button" onClick={() => setManualZoom((z) => Math.min(1.5, (z ?? scale) + 0.1))} className="px-1.5 py-0.5 text-xs font-bold hover:bg-line text-ink" title="Zoom in">+</button>
                <button type="button" onClick={() => setManualZoom(null)} className="ml-1 border-l border-ink/20 pl-1.5 font-mono text-[10px] uppercase text-ink-soft hover:text-ink">Fit</button>
                <button type="button" onClick={() => setManualZoom(1)} className="font-mono text-[10px] uppercase text-ink-soft hover:text-ink">100%</button>
              </div>
            </div>

            {resume.pageCount === 2 && previewPage === "all" ? (
              <div className="space-y-6">
                <div>
                  <div className="mb-2 flex items-center justify-between px-1">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-soft">Sheet 1 · Core Profile & Experience</span>
                    <span className="border border-ink/20 bg-card px-2 py-0.5 font-mono text-[10px] text-ink-soft">Page 1 of 2</span>
                  </div>
                  <div className="mx-auto overflow-hidden border border-ink/30 bg-white shadow-[0_18px_50px_-20px_rgba(19,31,26,0.35)]" style={{ width: 794 * effectiveScale, height: 1123 * effectiveScale }}>
                    <div className="origin-top-left" style={{ transform: `scale(${effectiveScale})`, width: 794 }}>
                      <ResumeDoc data={resume} pageNumber={1} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <div className="h-px flex-1 bg-ink/20" />
                  <span className="border border-ink/30 bg-card px-3 py-1 font-mono text-[10.5px] font-bold uppercase tracking-wider text-ink-soft">
                    A4 Page Break · Sheet 2
                  </span>
                  <div className="h-px flex-1 bg-ink/20" />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between px-1">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-soft">Sheet 2 · Extended Experience, Projects & Credentials</span>
                    <span className="border border-ink/20 bg-card px-2 py-0.5 font-mono text-[10px] text-ink-soft">Page 2 of 2</span>
                  </div>
                  <div className="mx-auto overflow-hidden border border-ink/30 bg-white shadow-[0_18px_50px_-20px_rgba(19,31,26,0.35)]" style={{ width: 794 * effectiveScale, height: 1123 * effectiveScale }}>
                    <div className="origin-top-left" style={{ transform: `scale(${effectiveScale})`, width: 794 }}>
                      <ResumeDoc data={resume} pageNumber={2} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mx-auto overflow-hidden border border-ink/30 bg-white shadow-[0_18px_50px_-20px_rgba(19,31,26,0.35)]" style={{ width: 794 * effectiveScale, height: 1123 * effectiveScale }}>
                <div className="origin-top-left" style={{ transform: `scale(${effectiveScale})`, width: 794 }}>
                  <ResumeDoc data={resume} pageNumber={resume.pageCount === 2 && previewPage !== "all" ? previewPage : undefined} />
                </div>
              </div>
            )}

            <p className="mt-3 text-center font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-soft">{t("builder.previewSub", "Live A4 preview — exports print-exact")}</p>
          </div>
        </div>
      </div>

      {/* ------------ ATS drawer ------------ */}
      {showAts && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/60 p-0 sm:items-center sm:p-6" onClick={() => setShowAts(false)}>
          <div className="toast-in max-h-[92vh] w-full max-w-3xl overflow-y-auto border-2 border-ink bg-paper hs-acid" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b-2 border-ink bg-ink px-5 py-3.5">
              <p className="font-display text-xl font-black text-paper">{t("builder.atsReportTitle", "ATS report · scored live")}</p>
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
              <p className="kicker text-pine">{t("builder.tailorTitle", "Tailor to a job description")}</p>
              <p className="mt-1 text-sm text-ink-soft">{t("builder.tailorSub", "Paste the posting. We extract its keywords, show what's missing, and add them to your skills in one click.")}</p>
              <textarea value={jd} onChange={(e) => setJd(e.target.value)} rows={5} placeholder={t("builder.pasteJd", "Paste the job description here…")} className={`${inputCls} mt-3`} />
              <div className="mt-3 flex flex-wrap gap-3">
                <button onClick={analyze} className="hs-sm border-2 border-ink bg-pine px-4 py-2.5 text-sm font-bold text-paper transition-all hover:-translate-y-0.5"><Icon name="sparkle" size={15} className="mr-1.5 inline" />{t("builder.analyzeKeywords", "Analyze keywords")}</button>
                {jdAnalyzed && jdAnalyzed.some((k) => !k.matched) && (
                  <button onClick={addMissing} className="border-2 border-ink bg-acid px-4 py-2.5 text-sm font-bold transition-all hover:-translate-y-0.5">{t("builder.addMissingKeywords", "+ Add missing keywords")}</button>
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
              <p className="font-display text-lg font-black text-paper">{gate === "signin" ? t("builder.gate.title", "One free export — on us") : t("builder.gate.proTitle", "That was your free export")}</p>
              <button onClick={() => setGate(null)} className="grid h-8 w-8 place-items-center border border-paper/40 text-paper transition-colors hover:border-acid hover:text-acid"><Icon name="x" size={14} /></button>
            </div>
            <div className="p-6">
              {gate === "signin" ? (
                <>
                  <p className="text-sm leading-relaxed text-ink-soft">
                    {t("builder.gate.desc", "Create a free account and your first export is free — no card required.")}
                  </p>
                  <ul className="mt-4 space-y-2 border-t border-ink/10 pt-4">
                    {["1 export free with every account", "ATS score and 14-check report", "All 4 templates, 20 role examples"].map((b) => (
                      <li key={b} className="flex items-center gap-2.5 text-sm font-semibold"><Icon name="check" size={15} className="text-pine" /> {b}</li>
                    ))}
                  </ul>
                  <Link to="/auth?next=/builder" className="hs-sm mt-5 flex w-full items-center justify-center gap-2 border-2 border-ink bg-acid px-4 py-3 font-bold transition-all hover:-translate-y-0.5">
                    {t("builder.gate.createAccount", "Create free account")} <Icon name="arrow" size={15} />
                  </Link>
                  <p className="mt-3 text-center font-mono text-[10.5px] text-ink-soft">
                    {t("builder.gate.haveAccount", "Already have one?")} <Link to="/auth?next=/builder" className="font-bold text-pine underline underline-offset-2">{t("builder.gate.signIn", "Sign in")}</Link>
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm leading-relaxed text-ink-soft">
                    {t("builder.gate.proDesc", "Every free account includes 1 export — and you just used it. Pro removes the limit entirely.")}
                  </p>
                  <ul className="mt-4 space-y-2 border-t border-ink/10 pt-4">
                    {["Unlimited exports in every format", "Unlimited job-description tailoring", "Unlimited cover letters + LinkedIn About", "Cloud sync across devices"].map((b) => (
                      <li key={b} className="flex items-center gap-2.5 text-sm font-semibold"><Icon name="zap" size={15} className="text-coral" /> {b}</li>
                    ))}
                  </ul>
                  <Link to="/pricing" className="hs-sm mt-5 flex w-full items-center justify-center gap-2 border-2 border-ink bg-acid px-4 py-3 font-bold transition-all hover:-translate-y-0.5">
                    {t("builder.gate.seePro", "See Pro — from $7/mo")} <Icon name="arrow" size={15} />
                  </Link>
                  <p className="mt-3 text-center font-mono text-[10.5px] text-ink-soft">{t("builder.gate.shareFree", "Share links stay free — export one to keep applying while you decide.")}</p>
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
