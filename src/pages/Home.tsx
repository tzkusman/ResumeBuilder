import { useEffect, useMemo, useState, useRef, type ChangeEvent, type DragEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon, Reveal, Gauge, Seo, Kicker, Chip } from "../components/ui";
import ResumeDoc from "../components/ResumeDoc";
import { PROFESSIONS, PROFESSION_CATEGORIES, getProfession } from "../data/professions";
import { COUNTRIES } from "../data/countries";
import { resumeFromProfession, emptyResume } from "../lib/types";
import { useI18n, useResume, useToast } from "../store/AppStore";
import { track } from "../lib/analytics";
import { extractTextFromCVFile, analyzeCV, type ATSAnalysis } from "../lib/cv-analyzer";
import { parseCVToResume, mergeCVWithResume } from "../lib/cv-parser";
import { atsScore, type AtsCheck, type AtsReport, extractKeywords } from "../lib/utils";
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

function Hero({ importSuccess = false }: { importSuccess?: boolean }) {
  const { t, getRoleTitle } = useI18n();
  const rotatingTitles = useMemo(
    () => [
      getRoleTitle("registered-nurse", "Registered Nurse"),
      getRoleTitle("software-engineer", "Software Engineer"),
      getRoleTitle("sales-manager", "Sales Manager"),
      getRoleTitle("electrician", "Electrician"),
      getRoleTitle("data-analyst", "Data Analyst"),
      getRoleTitle("elementary-teacher", "Elementary Teacher"),
    ],
    [getRoleTitle]
  );
  const typed = useTypewriter(rotatingTitles);
  const sample = useMemo(() => resumeFromProfession(getProfession("software-engineer")!), []);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
              <a
                href="#ats-engine"
                className="hs-sm inline-flex items-center gap-2 border-2 border-ink bg-card px-5 py-3.5 text-base font-bold text-ink transition-all hover:-translate-y-0.5 hover:border-pine hover:text-pine"
              >
                <Icon name="upload" size={18} />
                {t("cta.score", "Score & Import CV")}
              </a>
              <Link to="/examples" className="group inline-flex items-center gap-2 border-b-2 border-ink px-1 pb-1 text-base font-bold transition-colors hover:text-pine hover:border-pine">
                {t("hero.cta2")} <Icon name="arrow" size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={340}>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs text-ink-soft">
              <span><strong className="text-ink">94%</strong> {t("hero.stat1", "average ATS pass")}</span>
              <span><strong className="text-ink">20</strong> {t("hero.stat2", "profession examples")}</span>
              <span><strong className="text-ink">16</strong> {t("hero.stat3", "country CV guides")}</span>
              <span><strong className="text-ink">~90 sec</strong> {t("hero.stat4", "to a first draft")}</span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200} className="relative">
          <div className="relative mx-auto max-w-[520px]">
            <div className="absolute -inset-3 rotate-2 border-2 border-ink/15 bg-card" />
            <div className="relative overflow-hidden border-2 border-ink bg-white hs-acid">
              <div className="flex items-center justify-between border-b-2 border-ink bg-acid px-4 py-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">{t("hero.livePreview", "Live preview · A4")}</span>
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
                <span className="text-acid">▸ {t("hero.tailoring", "tailoring:")}</span> {typed}<span className="caret text-acid">▌</span>
              </div>
            </div>
            <div className="floaty absolute -right-4 -top-6 border-2 border-ink bg-card px-4 py-3 hs-sm sm:-right-10">
              <Gauge value={92} size={104} label="ATS pass" />
            </div>
            <div className="floaty-slow absolute -bottom-6 -left-3 flex items-center gap-2 border-2 border-ink bg-pine px-3.5 py-2.5 text-paper hs-sm sm:-left-8">
              <Icon name="shield" size={18} className="text-acid" />
              <span className="text-xs font-bold">{t("hero.checksPassing", "12/14 checks passing")}</span>
            </div>
          </div>
        </Reveal>
      </div>
      {/* Import Success Toast */}
      {importSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in z-50">
          <Icon name="check" size={24} />
          <div>
            <p className="font-semibold">{t("import.toast.title", "Resume imported successfully!")}</p>
            <p className="text-sm text-green-100">{t("import.toast.redirect", "Redirecting to builder...")}</p>
          </div>
        </div>
      )}
    </section>
  );
}

function Ticker() {
  const { getRoleTitle } = useI18n();
  return (
    <div className="overflow-hidden border-b-2 border-ink bg-ink py-3" aria-label="Profession examples">
      <div className="marquee-track flex items-center gap-3">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0 items-center gap-3">
            {PROFESSIONS.map((p) => {
              const translatedTitle = getRoleTitle(p.slug, p.title);
              return (
                <Link key={`${dup}-${p.slug}`} to={`/examples/${p.slug}`} className="group flex items-center gap-3 border border-paper/25 px-3.5 py-1.5 text-sm font-semibold text-paper/85 transition-colors hover:border-acid hover:text-acid">
                  {translatedTitle} <span className="text-acid transition-transform group-hover:translate-x-0.5">→</span>
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
  const navigate = useNavigate();
  const { replaceResume } = useResume();
  const { toast } = useToast();
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"checks" | "extracted" | "matcher">("checks");
  const [jobDescription, setJobDescription] = useState("");

  // Scan result state
  const [scanResult, setScanResult] = useState<{
    fileName: string;
    fileFormat: string;
    fileSize: string;
    resume: ResumeData;
    report: AtsReport;
    analysis: ATSAnalysis;
    rawText: string;
  } | null>(null);

  const sampleResume = useMemo(() => resumeFromProfession(getProfession("software-engineer")!), []);

  // Process uploaded file
  const processCVFile = async (file: File) => {
    const validExtensions = [".pdf", ".docx", ".doc", ".txt"];
    const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!hasValidExt && file.type && !file.type.includes("pdf") && !file.type.includes("word") && !file.type.includes("text")) {
      setError("Please upload a PDF (.pdf) or Word document (.docx, .doc).");
      return;
    }

    setError(null);
    setIsScanning(true);
    setScanStep("Reading document binary structure...");

    try {
      // Step 1: In-depth text extraction
      await new Promise((r) => setTimeout(r, 200));
      const extracted = await extractTextFromCVFile(file);

      if (!extracted.text || extracted.text.trim().length < 40) {
        throw new Error(
          "We could not extract readable text from this document. It may be a scanned image-only PDF without OCR, or protected. Try exporting as standard text PDF or DOCX."
        );
      }

      // Step 2: In-depth resume parsing
      setScanStep("Extracting contact info, career timeline, education & skills...");
      await new Promise((r) => setTimeout(r, 250));
      const parsedPartial = parseCVToResume(extracted.text, extracted.pageCount);

      // Merge with empty resume structure to guarantee 100% compliant ResumeData
      const completeResume = mergeCVWithResume(parsedPartial, emptyResume());

      // Step 3: Run 14 ATS scoring checks
      setScanStep("Auditing 14 ATS engine parameters & quantified metrics...");
      await new Promise((r) => setTimeout(r, 250));
      const report = atsScore(completeResume);
      const analysis = analyzeCV(extracted.text, jobDescription || undefined);

      const sizeKb = (file.size / 1024).toFixed(0);
      setScanResult({
        fileName: file.name,
        fileFormat: extracted.format.toUpperCase(),
        fileSize: `${sizeKb} KB`,
        resume: completeResume,
        report,
        analysis,
        rawText: extracted.text,
      });
    } catch (err: any) {
      console.error("ATS Scan error:", err);
      setError(err?.message || "Failed to parse document. Please check file format and try again.");
    } finally {
      setIsScanning(false);
      setScanStep("");
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processCVFile(file);
    }
    // reset input value so re-selecting same file works
    e.target.value = "";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processCVFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // Load sample resume for instant benchmark
  const loadSampleBenchmark = () => {
    const sampleText = `${sampleResume.contact.fullName}
${sampleResume.contact.title}
${sampleResume.contact.email} | ${sampleResume.contact.phone} | ${sampleResume.contact.location}

Summary
${sampleResume.summary}

Experience
${sampleResume.experience.map((e) => `${e.role} at ${e.company} (${e.start} - ${e.end})\n${e.bullets.map((b) => `• ${b}`).join("\n")}`).join("\n\n")}

Education
${sampleResume.education.map((e) => `${e.degree} - ${e.school} (${e.year})`).join("\n")}

Skills
${sampleResume.skills.join(", ")}`;

    const report = atsScore(sampleResume);
    const analysis = analyzeCV(sampleText, jobDescription || undefined);

    setScanResult({
      fileName: "Software_Engineer_Sample.pdf",
      fileFormat: "PDF",
      fileSize: "84 KB",
      resume: sampleResume,
      report,
      analysis,
      rawText: sampleText,
    });
    setError(null);
  };

  // Import into Resume Builder
  const handleImportToBuilder = () => {
    if (!scanResult) return;

    // Load existing resume from storage to keep any preferred styling/accent
    const existingStr = localStorage.getItem("rb_resume_v1");
    const existing = existingStr ? (JSON.parse(existingStr) as ResumeData) : emptyResume();

    const merged = mergeCVWithResume(scanResult.resume, existing);

    // Save to AppStore context & localStorage
    replaceResume(merged);
    localStorage.setItem("rb_resume_v1", JSON.stringify(merged));

    toast("Resume imported into builder with parsed data!", "ok");
    navigate("/builder");
  };

  // Recalculate keyword matches if job description changes
  const jobKeywords = useMemo(() => {
    if (!jobDescription.trim() || !scanResult) return [];
    return extractKeywords(jobDescription, 12);
  }, [jobDescription, scanResult]);

  const matchedKeywords = useMemo(() => {
    if (!scanResult || jobKeywords.length === 0) return [];
    const textLower = scanResult.rawText.toLowerCase();
    return jobKeywords.map((k) => ({
      term: k.term,
      present: textLower.includes(k.term.toLowerCase()),
    }));
  }, [scanResult, jobKeywords]);

  const matchPercentage = useMemo(() => {
    if (matchedKeywords.length === 0) return null;
    const found = matchedKeywords.filter((k) => k.present).length;
    return Math.round((found / matchedKeywords.length) * 100);
  }, [matchedKeywords]);

  return (
    <section id="ats-engine" className="border-b-2 border-ink bg-pine-deep text-paper scroll-mt-14">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.doc,.txt"
        onChange={handleFileInputChange}
        className="hidden"
      />

      <div className="dotgrid-dark mx-auto grid max-w-7xl items-start gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_1.25fr] lg:py-24">
        {/* Left Column: Explainer & Triggers */}
        <div>
          <Reveal>
            <Kicker className="text-acid">{t("ats.kicker", "In-Depth ATS Engine & CV Parser")}</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-4 font-display text-4xl font-black leading-tight sm:text-5xl">
              {t("ats.title", "75% of resumes are rejected by robots. Score & import yours live.")}
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-5 max-w-lg leading-relaxed text-paper/75">
              {t("ats.desc", "Upload your existing PDF or DOCX Word document. Our dual-stream parsing engine extracts your career history, metrics, and skills with high accuracy, tests 14 ATS compliance algorithms, and imports directly into the visual builder.")}
            </p>
          </Reveal>

          <Reveal delay={240}>
            <ul className="mt-8 space-y-4">
              {[
                [t("ats.step1.title", "Dual-Engine Parser"), t("ats.step1.desc", "Native PDF token decoding and DOCX XML reconstruction preserve structure and bullets.")],
                [t("ats.step2.title", "14 ATS Algorithmic Checks"), t("ats.step2.desc", "Contact completeness, quantified metrics ($, %, #), action verbs, and date formats.")],
                [t("ats.step3.title", "Direct 1-Click Builder Import"), t("ats.step3.desc", "Converts parsed CV into structured, editable fields ready for instant export.")],
              ].map(([h, b], i) => (
                <li key={i} className="flex gap-4 border-l-2 border-acid/50 pl-4">
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
            <div className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isScanning}
                className="hs-sm inline-flex items-center gap-2.5 border-2 border-acid bg-acid px-5 py-3 text-base font-bold text-ink transition-all hover:-translate-y-0.5 disabled:opacity-50"
              >
                <Icon name="upload" size={18} />
                {isScanning ? t("ats.btn.scanning", "Scanning Document...") : t("ats.btn.score", "Score & Import Resume")}
              </button>

              <button
                onClick={loadSampleBenchmark}
                disabled={isScanning}
                className="hs-sm inline-flex items-center gap-2 border-2 border-paper/40 bg-ink/50 px-4 py-3 text-sm font-semibold text-paper transition-all hover:border-acid hover:text-acid"
              >
                <Icon name="sparkle" size={15} />
                {t("ats.btn.benchmark", "Try Sample Benchmark (88/100)")}
              </button>
            </div>
          </Reveal>
        </div>

        {/* Right Column: Live ATS Interactive Card / Scanner */}
        <Reveal delay={200}>
          <div className="relative mx-auto w-full max-w-2xl border-2 border-acid/60 bg-ink p-5 sm:p-7 shadow-[8px_8px_0_0_rgba(0,0,0,0.4)]">
            {/* Header Tag */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-paper/15 pb-4">
              <div className="flex items-center gap-2">
                <span className="border border-acid bg-acid/15 px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider text-acid">
                  {scanResult ? `Live ATS Audit · ${scanResult.fileFormat}` : "Live ATS Scanner"}
                </span>
                {scanResult && (
                  <span className="max-w-[200px] truncate font-mono text-xs text-paper/60">
                    {scanResult.fileName}
                  </span>
                )}
              </div>

              {scanResult && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-acid hover:underline"
                >
                  <Icon name="upload" size={13} />
                  Scan Another File
                </button>
              )}
            </div>

            {/* ERROR NOTIFICATION */}
            {error && (
              <div className="mt-4 flex items-start gap-3 border border-coral/60 bg-coral/10 p-3.5 text-sm text-coral">
                <Icon name="x" size={18} className="mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-bold">Parsing Note</p>
                  <p className="text-xs text-paper/80">{error}</p>
                </div>
                <button onClick={() => setError(null)} className="text-xs text-paper/60 hover:text-paper">
                  Dismiss
                </button>
              </div>
            )}

            {/* SCANNING STATE */}
            {isScanning ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="relative mb-6 h-16 w-16">
                  <div className="absolute inset-0 animate-ping rounded-full bg-acid/20" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-acid bg-ink">
                    <div className="h-7 w-7 animate-spin rounded-full border-2 border-acid border-t-transparent" />
                  </div>
                </div>
                <p className="font-display text-xl font-bold text-acid">{scanStep || "Analyzing resume..."}</p>
                <p className="mt-2 max-w-sm text-xs text-paper/70">
                  Extracting text tokens, contact headers, employment dates, quantified results and skills list...
                </p>
              </div>
            ) : scanResult ? (
              /* RESULTS DASHBOARD */
              <div className="mt-5 space-y-5">
                {/* Score & Candidate Overview Banner */}
                <div className="grid items-center gap-5 sm:grid-cols-[auto_1fr] border-b border-paper/15 pb-5">
                  <div className="flex justify-center">
                    <Gauge value={scanResult.report.score} size={135} label="ATS Score" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 font-mono text-xs font-bold uppercase tracking-wide ${
                          scanResult.report.score >= 80
                            ? "bg-acid text-ink"
                            : scanResult.report.score >= 60
                            ? "bg-amber-400 text-ink"
                            : "bg-coral text-paper"
                        }`}
                      >
                        {scanResult.report.score >= 80
                          ? "Grade A · ATS Optimized"
                          : scanResult.report.score >= 60
                          ? "Grade B · Moderate Pass"
                          : "Grade C · High Filter Risk"}
                      </span>
                      <span className="font-mono text-xs text-paper/60">{scanResult.fileSize}</span>
                    </div>

                    <h3 className="mt-2 font-display text-xl font-black">
                      {scanResult.resume.contact.fullName || "Candidate Resume"}
                    </h3>
                    <p className="font-mono text-xs text-acid">
                      {scanResult.resume.contact.title || "Target Professional Role"}
                    </p>

                    {/* Quick Stats */}
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-paper/70">
                      <span>
                        <strong className="text-paper">{scanResult.resume.experience.length}</strong> Roles
                      </span>
                      <span>·</span>
                      <span>
                        <strong className="text-paper">{scanResult.resume.skills.length}</strong> Skills
                      </span>
                      <span>·</span>
                      <span>
                        <strong className="text-paper">
                          {scanResult.resume.experience.flatMap((e) => e.bullets).filter((b) => /\d|%|\$/.test(b)).length}
                        </strong>{" "}
                        Metrics
                      </span>
                      <span>·</span>
                      <span>
                        <strong className="text-paper">{scanResult.report.checks.filter((c) => c.pass).length}/14</strong>{" "}
                        Checks Pass
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-paper/15 text-xs font-bold">
                  <button
                    onClick={() => setActiveTab("checks")}
                    className={`border-b-2 px-3 py-2 transition-colors ${
                      activeTab === "checks" ? "border-acid text-acid" : "border-transparent text-paper/60 hover:text-paper"
                    }`}
                  >
                    14 ATS Checks ({scanResult.report.checks.filter((c) => c.pass).length}/14)
                  </button>
                  <button
                    onClick={() => setActiveTab("extracted")}
                    className={`border-b-2 px-3 py-2 transition-colors ${
                      activeTab === "extracted" ? "border-acid text-acid" : "border-transparent text-paper/60 hover:text-paper"
                    }`}
                  >
                    Extracted Data Preview
                  </button>
                  <button
                    onClick={() => setActiveTab("matcher")}
                    className={`border-b-2 px-3 py-2 transition-colors ${
                      activeTab === "matcher" ? "border-acid text-acid" : "border-transparent text-paper/60 hover:text-paper"
                    }`}
                  >
                    Job Keyword Matcher {matchPercentage !== null && `(${matchPercentage}%)`}
                  </button>
                </div>

                {/* Tab 1: 14 ATS Checks */}
                {activeTab === "checks" && (
                  <div className="max-h-64 space-y-2.5 overflow-y-auto pr-1">
                    {scanResult.report.checks.map((c) => (
                      <div
                        key={c.label}
                        className="flex items-start justify-between gap-3 border-b border-paper/10 pb-2 text-xs"
                      >
                        <div className="flex items-start gap-2.5">
                          <span
                            className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center border ${
                              c.pass ? "border-acid text-acid" : "border-coral text-coral"
                            }`}
                          >
                            <Icon name={c.pass ? "check" : "x"} size={10} />
                          </span>
                          <div>
                            <p className="font-bold text-paper">{c.label}</p>
                            <p className="text-[11px] text-paper/60">{c.detail}</p>
                          </div>
                        </div>
                        <span className="font-mono text-[10px] text-paper/40">+{c.weight}pts</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab 2: Extracted Data */}
                {activeTab === "extracted" && (
                  <div className="max-h-64 space-y-3 overflow-y-auto pr-1 text-xs">
                    <div className="border border-paper/10 bg-paper/5 p-2.5">
                      <p className="font-mono text-[10px] uppercase text-acid">Contact Details</p>
                      <p className="font-semibold text-paper mt-0.5">
                        {scanResult.resume.contact.email || "No email detected"} ·{" "}
                        {scanResult.resume.contact.phone || "No phone detected"} ·{" "}
                        {scanResult.resume.contact.location || "No location detected"}
                      </p>
                    </div>

                    {scanResult.resume.summary && (
                      <div className="border border-paper/10 bg-paper/5 p-2.5">
                        <p className="font-mono text-[10px] uppercase text-acid">Summary</p>
                        <p className="mt-1 line-clamp-3 text-paper/80">{scanResult.resume.summary}</p>
                      </div>
                    )}

                    <div className="border border-paper/10 bg-paper/5 p-2.5">
                      <p className="font-mono text-[10px] uppercase text-acid">
                        Work Experience ({scanResult.resume.experience.length} roles)
                      </p>
                      <div className="mt-1.5 space-y-2">
                        {scanResult.resume.experience.map((exp, idx) => (
                          <div key={idx} className="border-b border-paper/10 pb-1.5 last:border-0">
                            <p className="font-bold text-paper">
                              {exp.role || "Role"} · <span className="font-normal text-paper/70">{exp.company}</span>{" "}
                              <span className="font-mono text-[10px] text-acid">
                                ({exp.start || "?"} – {exp.end || "Present"})
                              </span>
                            </p>
                            <p className="text-[11px] text-paper/60">
                              {exp.bullets.length} bullets ({exp.bullets.filter((b) => /\d|%|\$/.test(b)).length} with
                              metrics)
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {scanResult.resume.skills.length > 0 && (
                      <div className="border border-paper/10 bg-paper/5 p-2.5">
                        <p className="font-mono text-[10px] uppercase text-acid">
                          Skills Identified ({scanResult.resume.skills.length})
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {scanResult.resume.skills.map((s, idx) => (
                            <span
                              key={idx}
                              className="border border-paper/20 bg-paper/10 px-2 py-0.5 font-mono text-[10.5px] text-paper"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 3: Keyword Matcher */}
                {activeTab === "matcher" && (
                  <div className="space-y-3 text-xs">
                    <p className="text-[11px] text-paper/70">
                      Paste the target job description to match against your resume's vocabulary:
                    </p>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste target job posting here (e.g., 'Looking for a Senior Software Engineer with experience in React, TypeScript, Cloud Run, CI/CD, Agile leadership...')..."
                      rows={3}
                      className="w-full border border-paper/30 bg-paper/5 p-2 font-mono text-xs text-paper placeholder:text-paper/40 focus:border-acid focus:outline-none"
                    />

                    {jobKeywords.length > 0 ? (
                      <div>
                        <div className="flex items-center justify-between font-mono text-[11px]">
                          <span>Keyword Match Rate</span>
                          <span className="font-bold text-acid">{matchPercentage}% Match</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {matchedKeywords.map((k) => (
                            <span
                              key={k.term}
                              className={`flex items-center gap-1 border px-2 py-0.5 font-mono text-[10.5px] ${
                                k.present
                                  ? "border-acid bg-acid/20 text-acid font-bold"
                                  : "border-coral/50 bg-coral/10 text-coral line-through"
                              }`}
                            >
                              <Icon name={k.present ? "check" : "x"} size={10} />
                              {k.term}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="font-mono text-[11px] text-paper/50">
                        Paste 2+ sentences of a job posting above to compute real-time keyword coverage.
                      </p>
                    )}
                  </div>
                )}

                {/* Primary Action Buttons */}
                <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-paper/15 pt-4">
                  <button
                    onClick={handleImportToBuilder}
                    className="hs-sm flex-1 inline-flex items-center justify-center gap-2 border-2 border-acid bg-acid px-5 py-3 text-sm font-bold text-ink transition-all hover:-translate-y-0.5 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]"
                  >
                    <span>Import & Edit in Builder</span>
                    <Icon name="arrow" size={16} />
                  </button>

                  <Link
                    to="/ats-checker"
                    className="hs-sm inline-flex items-center gap-1.5 border border-paper/30 bg-paper/5 px-4 py-3 text-xs font-bold text-paper transition-colors hover:border-paper"
                  >
                    <span>Full ATS Suite</span>
                    <Icon name="arrow" size={13} />
                  </Link>
                </div>
              </div>
            ) : (
              /* DEFAULT DROPZONE & BENCHMARK */
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`mt-4 flex cursor-pointer flex-col items-center justify-center border-2 border-dashed p-8 text-center transition-all ${
                  isDragging
                    ? "border-acid bg-acid/10 scale-[1.01]"
                    : "border-paper/30 hover:border-acid hover:bg-paper/5"
                }`}
              >
                <div className="grid h-14 w-14 place-items-center border-2 border-acid/80 bg-acid/10 text-acid">
                  <Icon name="upload" size={26} />
                </div>
                <h4 className="mt-4 font-display text-lg font-bold text-paper">
                  Drop your resume here (PDF or DOCX)
                </h4>
                <p className="mt-1.5 max-w-sm text-xs text-paper/70">
                  Supports <strong>.pdf</strong>, <strong>.docx</strong>, <strong>.doc</strong>, and <strong>.txt</strong>.
                  Dual extraction parses all career experience, metrics, and skills into ATS format.
                </p>

                <div className="mt-4 inline-flex items-center gap-2 border border-acid bg-acid px-4 py-2 text-xs font-bold text-ink">
                  <Icon name="sparkle" size={14} />
                  <span>Click to Browse Files</span>
                </div>

                <div className="mt-6 flex items-center gap-3 border-t border-paper/15 pt-4 text-[11px] font-mono text-paper/60">
                  <span className="flex items-center gap-1">
                    <Icon name="shield" size={12} className="text-acid" /> 100% Client-Side Privacy
                  </span>
                  <span>·</span>
                  <span>Instant 14-Rule Scoring</span>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ExamplesIndex() {
  const { t, getRoleTitle, getCategory, getDemand } = useI18n();
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Reveal><Kicker className="text-pine">{t("examples.kicker", "Programmatic, not generic")}</Kicker></Reveal>
          <Reveal delay={80}><h2 className="mt-3 font-display text-4xl font-black tracking-tight sm:text-5xl">{t("examples.title", "Real examples for real jobs.")}</h2></Reveal>
        </div>
        <Reveal delay={160}>
          <Link to="/examples" className="group inline-flex items-center gap-2 border-b-2 border-ink pb-1 font-bold hover:border-pine hover:text-pine">
            {t("examples.browseAll", "Browse all 20 examples")} <Icon name="arrow" size={16} className="transition-transform group-hover:translate-x-1" />
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
                  <p className="font-display text-lg font-bold leading-tight transition-colors group-hover:text-pine">
                    {getRoleTitle(p.slug, p.title)} <span className="font-body text-sm font-semibold text-ink-soft">{t("examples.exampleTag", "Resume Example")}</span>
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-ink-soft">
                    {getCategory(p.category)} · {p.salary} · {t("demand.label", "demand:")} {getDemand(p.demand)}
                  </p>
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
  const { t, getCountryName } = useI18n();
  return (
    <section className="border-y-2 border-ink bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Reveal><Kicker className="text-pine">{t("countries.kicker", "Localized experience")}</Kicker></Reveal>
            <Reveal delay={80}><h2 className="mt-3 font-display text-3xl font-black sm:text-4xl">{t("countries.title", "CV rules change at every border.")}</h2></Reveal>
          </div>
          <Reveal delay={160}>
            <Chip className="text-pine-deep"><Icon name="globe" size={13} /> {t("countries.guidesCount", "16 country guides · photos, pages, dates, ATS")}</Chip>
          </Reveal>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {COUNTRIES.slice(0, 8).map((c, i) => (
            <Reveal key={c.code} delay={i * 60}>
              <Link to={`/countries/${c.code}`} className="group flex h-full items-center justify-between border-2 border-ink/15 bg-paper px-4 py-4 transition-all hover:-translate-y-1 hover:border-ink hover:shadow-[4px_4px_0_0_var(--color-ink)]">
                <div>
                  <p className="font-display text-lg font-bold leading-tight group-hover:text-pine">{getCountryName(c.code, c.name)}</p>
                  <p className="mt-1 font-mono text-[10.5px] uppercase tracking-wider text-ink-soft">
                    {c.docName} · {t("countries.photo", "photo")}: <span className={c.photo === "Never" ? "text-coral font-bold" : "text-pine font-bold"}>{c.photo.toLowerCase()}</span>
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
              <Link key={c.code} to={`/countries/${c.code}`} className="border border-ink/20 bg-paper px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:border-ink hover:text-ink">{getCountryName(c.code, c.name)}</Link>
            ))}
            <Link to="/countries" className="border border-ink bg-ink px-3 py-1.5 text-xs font-bold text-acid transition-transform hover:-translate-y-0.5">{t("countries.allLink", "All countries →")}</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function HowItWorks() {
  const { t } = useI18n();
  const steps = [
    [t("how.step1.title", "Pick your role"), t("how.step1.desc", "Start from a pre-filled example for your exact profession — nurse, accountant, electrician — or a blank A4 sheet."), "/examples"],
    [t("how.step2.title", "Tailor to the posting"), t("how.step2.desc", "Paste the job description. The engine matches keywords and rewrites your skills list in one click."), "/builder"],
    [t("how.step3.title", "Export everywhere"), t("how.step3.desc", "ATS-safe PDF, editable DOCX, plain text, or a shareable link. One click each, all free."), "/pricing"],
  ] as const;
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <Reveal><Kicker className="text-pine">{t("how.kicker", "How it works")}</Kicker></Reveal>
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
  const { t } = useI18n();
  const [open, setOpen] = useState(0);
  const faqs = [
    [t("faq.q1"), t("faq.a1")],
    [t("faq.q2"), t("faq.a2")],
    [t("faq.q3"), t("faq.a3")],
    [t("faq.q4"), t("faq.a4")],
    [t("faq.q5"), t("faq.a5")],
  ];
  return (
    <section id="faq" className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
      <Reveal><Kicker className="text-center text-pine">{t("faq.kicker")}</Kicker></Reveal>
      <Reveal delay={80}><h2 className="mt-3 text-center font-display text-4xl font-black">{t("faq.title")}</h2></Reveal>
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
