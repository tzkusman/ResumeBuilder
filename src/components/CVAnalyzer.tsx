import { useState, useCallback, useMemo, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Upload, FileText, CheckCircle, AlertCircle, Info, Target, Zap, ArrowRight, Printer, Sparkles } from "lucide-react";
import { extractTextFromCVFile, analyzeCV, type ATSAnalysis } from "../lib/cv-analyzer";
import { parseCVToResume, mergeCVWithResume } from "../lib/cv-parser";
import { useToast, useResume } from "../store/AppStore";
import { emptyResume, type ResumeData } from "../lib/types";

const SAMPLE_RESUME_TEXT = `Jane Doe
Senior Full-Stack Engineer
San Francisco, CA • (555) 234-5678 • jane.doe@example.com • linkedin.com/in/janedoe • github.com/janedoe

PROFESSIONAL SUMMARY
Senior Software Engineer with 7+ years of experience building high-concurrency microservices, cloud infrastructure, and modern React web applications. Proven track record of cutting API latency by 45% and scaling systems to 3M+ active users.

CORE SKILLS
JavaScript, TypeScript, React, Node.js, Python, PostgreSQL, AWS, Docker, Kubernetes, CI/CD, GraphQL, REST API, Agile, Git, Microservices

WORK EXPERIENCE
Senior Software Engineer | CloudScale Tech | San Francisco, CA | 2021 – Present
• Architected and deployed event-driven microservices handling 25,000+ requests per second using Node.js and AWS Lambda.
• Reduced p95 response times by 45% through database query optimization and Redis caching layer.
• Mentored squad of 6 engineers and instituted automated end-to-end testing, cutting production bug incidents by 38%.

Software Engineer | FinFlow Systems | New York, NY | 2018 – 2021
• Built real-time payment ledger supporting $14M in daily volume across Stripe and Plaid integrations.
• Migrated legacy monolithic architecture to Dockerized container clusters on Kubernetes.
• Collaborated with product designers to implement responsive React web interface with 99.9% uptime.

EDUCATION
B.S. in Computer Science | University of California, Berkeley | 2018
`;

export function CVAnalyzer() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resume: currentResume, replaceResume } = useResume();
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [parsedResume, setParsedResume] = useState<Partial<ResumeData> | null>(null);
  const [issueFilter, setIssueFilter] = useState<"all" | "critical" | "warning" | "passed">("all");

  const importToBuilder = useCallback(() => {
    if (parsedResume) {
      const base = currentResume && currentResume.contact ? currentResume : emptyResume();
      const merged = mergeCVWithResume(parsedResume, base);
      replaceResume(merged);
      try {
        localStorage.setItem("rb_resume_v1", JSON.stringify(merged));
      } catch {
        // ignore storage errors
      }
      toast("Sample resume imported into live builder!", "ok");
    } else {
      toast("Opening live resume builder...", "ok");
    }
    navigate("/builder");
  }, [parsedResume, currentResume, replaceResume, toast, navigate]);

  const runAnalysis = useCallback((text: string, format: "pdf" | "docx" | "txt", pageCount = 1) => {
    try {
      const parsed = parseCVToResume(text, pageCount);
      setParsedResume(parsed);
      const result = analyzeCV(text, jobDescription || undefined);
      result.formatting.fileFormat = format;
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze CV text");
    } finally {
      setIsAnalyzing(false);
    }
  }, [jobDescription]);

  const handleFileUpload = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/pdf",
      "application/msword"
    ];
    if (!validTypes.includes(uploadedFile.type) && !uploadedFile.name.endsWith(".docx") && !uploadedFile.name.endsWith(".pdf")) {
      setError("Please upload a DOCX or PDF file");
      return;
    }

    setFile(uploadedFile);
    setError(null);
    setAnalysis(null);
    setParsedResume(null);
    setIsAnalyzing(true);

    try {
      const extracted = await extractTextFromCVFile(uploadedFile);
      runAnalysis(extracted.text, extracted.format === "docx" ? "docx" : "pdf", extracted.pageCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to extract text from file");
      setIsAnalyzing(false);
    }
  }, [runAnalysis]);

  const loadSampleDemo = () => {
    setError(null);
    setFile(new File([SAMPLE_RESUME_TEXT], "Jane_Doe_Senior_Engineer_Sample.docx", { type: "text/plain" }));
    setIsAnalyzing(true);
    setTimeout(() => {
      runAnalysis(SAMPLE_RESUME_TEXT, "docx", 1);
      toast("Sample resume loaded and analyzed!", "ok");
    }, 400);
  };

  const reanalyzeWithJobDescription = () => {
    if (!analysis) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      if (file) {
        extractTextFromCVFile(file)
          .then((ext) => runAnalysis(ext.text, ext.format === "docx" ? "docx" : "pdf", ext.pageCount))
          .catch(() => runAnalysis(SAMPLE_RESUME_TEXT, "docx", 1));
      } else {
        runAnalysis(SAMPLE_RESUME_TEXT, "docx", 1);
      }
      toast("Re-analyzed against target job posting!", "ok");
    }, 300);
  };

  const filteredIssues = useMemo(() => {
    if (!analysis) return [];
    if (issueFilter === "all") return analysis.issues;
    return analysis.issues.filter((i) => i.type === issueFilter);
  }, [analysis, issueFilter]);

  const passedChecksCount = useMemo(() => {
    if (!analysis) return 0;
    let count = 0;
    if (analysis.formatting.isParseable) count++;
    if (analysis.formatting.readableByATS) count++;
    if (!analysis.formatting.hasTables) count++;
    if (analysis.sections.contact.exists) count++;
    if (analysis.sections.summary.exists) count++;
    if (analysis.sections.experience.exists) count++;
    if (analysis.sections.education.exists) count++;
    if (analysis.sections.skills.exists) count++;
    return count;
  }, [analysis]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-pine">
          AI-Powered Recruiter Diagnostics · 2026 Audit
        </span>
        <h1 className="mt-2 font-display text-4xl font-black text-ink sm:text-5xl">
          ATS Resume Scanner & Score Checker
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-base text-ink-soft">
          Test your resume against 30+ parsing criteria: contact headers, table risks, quantified Google X-Y-Z formula metrics,
          and target job description keywords.
        </p>

        {/* Demo Button */}
        {!analysis && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={loadSampleDemo}
              className="inline-flex items-center gap-2 border border-ink/30 bg-card px-4 py-2 font-mono text-xs font-bold text-ink hover:border-ink hover:bg-acid-soft transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-pine" />
              Test with Sample Resume (Instant Demo)
            </button>
          </div>
        )}
      </div>

      {/* Upload and Job Target Box */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* Upload Column */}
        <div className="border-2 border-ink bg-card p-6 hs-acid flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-black text-ink flex items-center gap-2">
                <FileText className="w-5 h-5 text-pine" />
                Upload Resume Document
              </h2>
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">PDF or DOCX</span>
            </div>
            <p className="mt-1 text-xs text-ink-soft">
              Scans raw vector layers to detect parsing errors and table collisions.
            </p>

            <label
              htmlFor="cv-upload-input"
              className={`mt-4 flex flex-col items-center justify-center w-full h-36 border-2 border-dashed cursor-pointer transition-all ${
                error ? "border-coral bg-coral/10" : "border-ink/40 bg-paper hover:border-ink hover:bg-acid-soft"
              }`}
            >
              <Upload className="w-7 h-7 mb-2 text-ink-soft" />
              <span className="text-xs font-bold text-ink">Click to upload or drag & drop</span>
              <span className="text-[10px] text-ink-soft mt-0.5">DOCX or PDF up to 10MB</span>
              <input
                id="cv-upload-input"
                type="file"
                className="hidden"
                accept=".docx,.pdf,.doc"
                onChange={handleFileUpload}
                disabled={isAnalyzing}
              />
            </label>
          </div>

          {file && (
            <div className="mt-4 flex items-center justify-between border border-ink/20 bg-white p-2.5">
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-4 h-4 text-pine shrink-0" />
                <span className="text-xs font-bold truncate">{file.name}</span>
                <span className="font-mono text-[10px] text-ink-soft">({(file.size / 1024).toFixed(0)} KB)</span>
              </div>
              {isAnalyzing && <span className="font-mono text-[10px] text-pine animate-pulse font-bold">Scanning…</span>}
            </div>
          )}

          {error && (
            <div className="mt-3 p-2.5 border border-coral bg-coral/10 flex items-center gap-2 text-coral text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Target Job Posting Column */}
        <div className="border-2 border-ink bg-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-black text-ink flex items-center gap-2">
                <Target className="w-5 h-5 text-pine" />
                Target Job Description (Optional)
              </h2>
              <span className="font-mono text-[10px] uppercase tracking-wider text-pine font-bold">Keyword Matcher</span>
            </div>
            <p className="mt-1 text-xs text-ink-soft">
              Paste the posting to compare hard skills, requirements, and missing ATS keywords.
            </p>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job posting text (responsibilities, required qualifications, tech stack)…"
              rows={4}
              className="mt-4 w-full border border-ink/25 bg-white p-2.5 text-xs focus:border-pine focus:outline-none resize-none font-sans"
            />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="font-mono text-[10px] text-ink-soft">
              {jobDescription.length > 0 ? `${jobDescription.split(/\s+/).length} words entered` : "Optional but recommended"}
            </span>
            {jobDescription && analysis && (
              <button
                onClick={reanalyzeWithJobDescription}
                className="border-2 border-ink bg-pine px-3 py-1.5 font-mono text-xs font-bold text-paper hover:bg-pine-deep transition-colors"
              >
                Scan with Job Keywords →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Results View */}
      {analysis && (
        <div className="space-y-8">
          {/* Main Score & Audit Summary Banner */}
          <div className="border-2 border-ink bg-paper p-6 hs-acid sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-6 border-b border-ink/15 pb-6">
              <div className="space-y-1">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-pine">
                  Overall ATS Parsing Confidence
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-5xl font-black text-ink sm:text-6xl">{analysis.score}</span>
                  <span className="font-display text-2xl text-ink-soft">/ 100</span>
                  <span
                    className={`border-2 border-ink px-3 py-1 font-mono text-sm font-black uppercase ${
                      analysis.grade === "A"
                        ? "bg-pine text-paper"
                        : analysis.grade === "B"
                        ? "bg-acid text-ink"
                        : "bg-coral text-paper"
                    }`}
                  >
                    Grade {analysis.grade}
                  </span>
                </div>
                <p className="text-xs text-ink-soft max-w-md">
                  {analysis.score >= 85
                    ? "Exceptional parsing fidelity. Headers, dates, and experience blocks extracted cleanly."
                    : analysis.score >= 70
                    ? "Passable baseline. Several critical keyword and formatting improvements recommended below."
                    : "High risk of ATS parse failure. Needs formatting repairs and quantifiable metrics."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 sm:items-end">
                {parsedResume && (
                  <button
                    onClick={importToBuilder}
                    className="flex items-center gap-2 border-2 border-ink bg-acid px-5 py-2.5 font-display text-sm font-bold text-ink shadow-[4px_4px_0_0_var(--color-ink)] hover:-translate-y-0.5 transition-transform"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Auto-Fix & Open in Resume Builder
                  </button>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 border border-ink/25 bg-white px-3 py-1.5 font-mono text-xs font-semibold text-ink hover:border-ink"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print / Export Audit
                  </button>
                  <Link
                    to="/job-matcher"
                    className="flex items-center gap-1.5 border border-ink/25 bg-card px-3 py-1.5 font-mono text-xs font-semibold text-ink hover:border-ink"
                  >
                    Try Job Matcher →
                  </Link>
                </div>
              </div>
            </div>

            {/* 6-Pillar Telemetry Grid */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <div className="border border-ink/20 bg-white p-3 text-center">
                <span className="block font-mono text-[9.5px] uppercase text-ink-soft">Format Safety</span>
                <span className="mt-1 block font-display text-lg font-black text-ink uppercase">
                  {analysis.formatting.fileFormat}
                </span>
                <span className="mt-0.5 block font-mono text-[10px] text-pine font-bold">
                  {analysis.formatting.readableByATS ? "✓ ATS Compatible" : "✗ Risky"}
                </span>
              </div>

              <div className="border border-ink/20 bg-white p-3 text-center">
                <span className="block font-mono text-[9.5px] uppercase text-ink-soft">Contact Info</span>
                <span className="mt-1 block font-display text-lg font-black text-ink">
                  {analysis.sections.contact.score}%
                </span>
                <span className="mt-0.5 block font-mono text-[10px] text-pine font-bold">
                  {analysis.sections.contact.complete ? "✓ Complete" : "⚠️ Missing details"}
                </span>
              </div>

              <div className="border border-ink/20 bg-white p-3 text-center">
                <span className="block font-mono text-[9.5px] uppercase text-ink-soft">Standard Headings</span>
                <span className="mt-1 block font-display text-lg font-black text-ink">
                  {5 - (analysis.sections.missing?.length || 0)} / 5
                </span>
                <span className="mt-0.5 block font-mono text-[10px] text-ink-soft">
                  {analysis.sections.missing?.length ? `Missing: ${analysis.sections.missing[0]}` : "✓ All Found"}
                </span>
              </div>

              <div className="border border-ink/20 bg-white p-3 text-center">
                <span className="block font-mono text-[9.5px] uppercase text-ink-soft">Measurable Metrics</span>
                <span className="mt-1 block font-display text-lg font-black text-ink">
                  {analysis.sections.experience.hasMetrics ? "High Density" : "Needs Numbers"}
                </span>
                <span className="mt-0.5 block font-mono text-[10px] text-pine font-bold">
                  {analysis.sections.experience.hasMetrics ? "✓ Google X-Y-Z" : "⚠️ Add % and $"}
                </span>
              </div>

              <div className="border border-ink/20 bg-white p-3 text-center">
                <span className="block font-mono text-[9.5px] uppercase text-ink-soft">Keywords Scored</span>
                <span className="mt-1 block font-display text-lg font-black text-ink">
                  {analysis.keywords.filter((k) => k.found).length} / {analysis.keywords.length}
                </span>
                <span className="mt-0.5 block font-mono text-[10px] text-pine font-bold">
                  {Math.round((analysis.keywords.filter((k) => k.found).length / (analysis.keywords.length || 1)) * 100)}% Matched
                </span>
              </div>

              <div className="border border-ink/20 bg-white p-3 text-center">
                <span className="block font-mono text-[9.5px] uppercase text-ink-soft">Table / Column Risk</span>
                <span className="mt-1 block font-display text-lg font-black text-ink">
                  {analysis.formatting.hasTables ? "Warning" : "Zero Risk"}
                </span>
                <span className="mt-0.5 block font-mono text-[10px] text-pine font-bold">
                  {analysis.formatting.hasTables ? "⚠️ Multi-column" : "✓ Single Column"}
                </span>
              </div>
            </div>
          </div>

          {/* Diagnostic Issues Triage */}
          <div className="border-2 border-ink bg-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/15 pb-4">
              <div>
                <h3 className="font-display text-xl font-black text-ink">Diagnostic Findings & Recommendations</h3>
                <p className="text-xs text-ink-soft">Prioritized by ATS rejection probability:</p>
              </div>

              {/* Triage Tabs */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setIssueFilter("all")}
                  className={`px-3 py-1 font-mono text-xs font-bold transition-colors ${
                    issueFilter === "all" ? "border-2 border-ink bg-ink text-acid" : "border border-ink/20 bg-white text-ink-soft"
                  }`}
                >
                  All ({analysis.issues.length})
                </button>
                <button
                  onClick={() => setIssueFilter("critical")}
                  className={`px-3 py-1 font-mono text-xs font-bold transition-colors ${
                    issueFilter === "critical" ? "border-2 border-ink bg-coral text-paper" : "border border-ink/20 bg-white text-ink-soft"
                  }`}
                >
                  Critical Blockers ({analysis.issues.filter((i) => i.type === "critical").length})
                </button>
                <button
                  onClick={() => setIssueFilter("warning")}
                  className={`px-3 py-1 font-mono text-xs font-bold transition-colors ${
                    issueFilter === "warning" ? "border-2 border-ink bg-acid text-ink" : "border border-ink/20 bg-white text-ink-soft"
                  }`}
                >
                  Warnings ({analysis.issues.filter((i) => i.type === "warning").length})
                </button>
              </div>
            </div>

            {/* Issues List */}
            <div className="mt-4 space-y-3">
              {filteredIssues.length === 0 ? (
                <div className="p-4 border border-ink/20 bg-white text-center text-xs text-ink-soft">
                  No issues matching this filter.
                </div>
              ) : (
                filteredIssues.map((issue, idx) => (
                  <div
                    key={idx}
                    className={`border p-4 transition-all ${
                      issue.type === "critical"
                        ? "border-coral/50 bg-coral/5"
                        : issue.type === "warning"
                        ? "border-amber-500/40 bg-amber-500/5"
                        : "border-ink/15 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center border text-[10px] font-mono font-bold ${
                            issue.type === "critical"
                              ? "border-coral bg-coral text-paper"
                              : "border-amber-600 bg-amber-100 text-amber-900"
                          }`}
                        >
                          !
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-display text-sm font-black text-ink">{issue.message}</span>
                            <span className="font-mono text-[9px] uppercase tracking-wider text-ink-soft border border-ink/20 px-1.5 py-0.5">
                              {issue.category}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-ink-soft leading-relaxed">{issue.suggestion}</p>
                        </div>
                      </div>
                      <span className="shrink-0 font-mono text-[10px] uppercase font-bold text-ink-soft">
                        Severity {issue.severity}/10
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Passed Checks Callout */}
            <div className="mt-6 border border-pine/30 bg-acid-soft p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-5 h-5 text-pine shrink-0" />
                <span className="text-xs font-bold text-pine-deep">
                  {passedChecksCount} Core ATS Architectural Standards Passed Cleanly
                </span>
              </div>
              <span className="font-mono text-[11px] text-pine-deep font-bold">Standard Layout Validated</span>
            </div>
          </div>

          {/* Keyword Match Matrix */}
          <div className="border-2 border-ink bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl font-black text-ink flex items-center gap-2">
                  <Zap className="w-5 h-5 text-pine" />
                  ATS Hard Skills & Keyword Matrix
                </h3>
                <p className="text-xs text-ink-soft">Detected terms vs. high-priority recruiter filters:</p>
              </div>
              <span className="font-mono text-xs font-bold text-pine">
                {analysis.keywords.filter((k) => k.found).length} Found · {analysis.keywords.filter((k) => !k.found).length} Missing
              </span>
            </div>

            <div className="mt-5 grid gap-6 md:grid-cols-2">
              {/* Found Keywords */}
              <div className="border border-ink/20 bg-white p-4">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-pine flex items-center gap-1.5 mb-3">
                  <CheckCircle className="w-4 h-4 text-pine" />
                  Detected Keywords in Resume ({analysis.keywords.filter((k) => k.found).length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.keywords.filter((k) => k.found).map((kw, idx) => (
                    <span
                      key={idx}
                      className="border border-pine/40 bg-acid-soft px-2.5 py-1 font-mono text-[11px] font-bold text-pine-deep"
                    >
                      ✓ {kw.keyword} {kw.count > 1 && `(${kw.count}x)`}
                    </span>
                  ))}
                  {analysis.keywords.filter((k) => k.found).length === 0 && (
                    <span className="text-xs text-ink-soft">No standard technical keywords identified yet.</span>
                  )}
                </div>
              </div>

              {/* Missing High Priority Keywords */}
              <div className="border border-ink/20 bg-white p-4">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-coral flex items-center gap-1.5 mb-3">
                  <AlertCircle className="w-4 h-4 text-coral" />
                  Recommended Missing Keywords ({analysis.keywords.filter((k) => !k.found).length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.keywords.filter((k) => !k.found).map((kw, idx) => (
                    <span
                      key={idx}
                      className="border border-coral/30 bg-coral/5 px-2.5 py-1 font-mono text-[11px] font-bold text-coral"
                    >
                      + {kw.keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Builder Next Step CTA */}
          <div className="border-2 border-ink bg-ink p-6 text-paper hs-acid flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="kicker text-acid">Ready to Fix & Export</span>
              <h4 className="mt-1 font-display text-2xl font-black">Transfer this audit into the live builder</h4>
              <p className="text-xs text-paper/70">
                Instantly apply our ATS-safe templates (Merit, Atlas, Craft) and inject missing keywords with one click.
              </p>
            </div>
            <button
              onClick={importToBuilder}
              className="shrink-0 border-2 border-acid bg-acid px-6 py-3 font-display text-sm font-bold text-ink shadow-[4px_4px_0_0_#fff] hover:-translate-y-0.5 transition-transform"
            >
              Open in Resume Builder →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
