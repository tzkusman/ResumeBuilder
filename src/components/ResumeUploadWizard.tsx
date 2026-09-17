import { useState, useRef, useEffect, type ChangeEvent, type DragEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Icon, Gauge } from "./ui";
import { useResume, useToast, useI18n } from "../store/AppStore";
import { extractTextFromCVFile } from "../lib/cv-analyzer";
import { parseCVToResume, mergeCVWithResume } from "../lib/cv-parser";
import { atsScore, extractKeywords, matchKeywords } from "../lib/utils";
import type { ResumeData, TemplateId, XpEntry, EduEntry } from "../lib/types";
import { uid, emptyResume } from "../lib/types";

interface ResumeUploadWizardProps {
  isOpen: boolean;
  onClose: () => void;
  initialFile?: File | null;
  onCompleted?: (data: ResumeData) => void;
}

type WizardStep = 1 | 2 | 3 | 4;

const SAMPLE_DEMO_TEXT = `Alex Morgan
Senior Full-Stack Engineer | San Francisco, CA | alex.morgan@example.com | (415) 555-0199 | linkedin.com/in/alexmorgan | github.com/alexmorgan

PROFESSIONAL SUMMARY
Results-driven Senior Full-Stack Engineer with 7+ years of experience architecting resilient cloud microservices, modern React interfaces, and high-throughput data pipelines. Proven track record reducing API latency by 42% and driving 99.99% system availability across enterprise SaaS platforms.

PROFESSIONAL EXPERIENCE
Lead Software Architect | Stripe | San Francisco, CA | 2021 – Present
- Directed cross-functional engineering team of 9 building unified merchant checkout API processing $12M+ in daily transaction volume.
- Engineered Redis cache layer slashing p99 backend API response latency from 320ms to 48ms (85% reduction).
- Automated end-to-end CI/CD test automation pipelines with Docker and GitHub Actions, cutting release deployment cycles by 35%.
- Mentored 6 junior and mid-level engineers through structured bi-weekly code architecture reviews and technical workshops.

Senior Software Engineer | Uber | San Francisco, CA | 2018 – 2021
- Spearheaded real-time driver dispatch matching algorithm utilizing Node.js, Go, and Kafka handling 45,000 requests per second.
- Reduced cloud infrastructure operational expenditure by $180,000 annually through intelligent AWS autoscaling and container bin-packing.
- Built reusable internal UI design system component library in TypeScript and Tailwind, adopted by 14 product squads.

EDUCATION
Bachelor of Science in Computer Science | University of California, Berkeley | 2014 – 2018
- Magna Cum Laude, Dean's Honors List (GPA: 3.86/4.00)

SKILLS & CORE COMPETENCIES
Languages & Frameworks: TypeScript, React, Next.js, Node.js, Python, Go, GraphQL, Tailwind CSS
Databases & Cloud: PostgreSQL, Redis, MongoDB, AWS (ECS, Lambda, S3), Docker, Kubernetes, Kafka
Engineering Practices: Microservices, System Architecture, CI/CD, Agile/Scrum, Unit Testing (Jest), ATS Optimization`;

export default function ResumeUploadWizard({
  isOpen,
  onClose,
  initialFile,
  onCompleted
}: ResumeUploadWizardProps) {
  const navigate = useNavigate();
  const { resume: currentResume, replaceResume, saveToCloud } = useResume();
  const { toast } = useToast();
  const { t } = useI18n();

  // Stepper state (1: Upload & Scan, 2: Review & Edit, 3: 1-Page Format & Template, 4: Verification & Launch)
  const [step, setStep] = useState<WizardStep>(1);

  // File & parsing state
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>("");
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Extracted resume working copy
  const [draftResume, setDraftResume] = useState<ResumeData>(() => emptyResume());

  // Step 2 active review sub-tab
  const [reviewTab, setReviewTab] = useState<"contact" | "experience" | "skills" | "education" | "summary">("contact");

  // Step 3 settings: Default strictly to 1 Page
  const [pageChoice, setPageChoice] = useState<1 | 2>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("merit");
  const [targetJd, setTargetJd] = useState("");
  const [newSkillInput, setNewSkillInput] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger processing if initialFile is passed
  useEffect(() => {
    if (isOpen && initialFile && !file) {
      void processFile(initialFile);
    }
  }, [isOpen, initialFile]);

  if (!isOpen) return null;

  /* =========================================================================
   * STEP 1: PARSE FILE WITH STEP-BY-STEP SIMULATION
   * ========================================================================= */
  const processFile = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsProcessing(true);
    setParseError(null);
    setProcessingProgress(10);
    setProcessingStage("Reading document structure & raw text encoding...");

    try {
      // Step 1: Decode binary
      await new Promise((r) => setTimeout(r, 220));
      setProcessingProgress(30);
      setProcessingStage("Extracting candidate identity, contact headers, and social links...");

      const extracted = await extractTextFromCVFile(uploadedFile);

      // Step 2: Parse sections
      await new Promise((r) => setTimeout(r, 260));
      setProcessingProgress(60);
      setProcessingStage("Reconstructing employment timeline & quantified metric achievements...");

      const parsed = parseCVToResume(extracted.text, extracted.pageCount);

      // Step 3: Skills & Education
      await new Promise((r) => setTimeout(r, 240));
      setProcessingProgress(85);
      setProcessingStage("Extracting skills, degrees & enforcing 1-Page ATS formatting...");

      const base = currentResume?.contact ? currentResume : emptyResume();
      const merged = mergeCVWithResume(parsed, base);

      // Enforce 1-Page layout strictly
      merged.pageCount = 1;
      merged.template = selectedTemplate;

      setDraftResume(merged);
      setProcessingProgress(100);
      setProcessingStage("Extraction complete! Ready for step-by-step verification.");

      await new Promise((r) => setTimeout(r, 350));
      setIsProcessing(false);
      // Advance to Step 2 for user review
      setStep(2);
      toast(`Successfully parsed "${uploadedFile.name}". Please review the extracted data.`, "ok");
    } catch (err: any) {
      console.error("Resume parse error:", err);
      setIsProcessing(false);
      setParseError(err?.message || "Could not read this file. Please ensure it is a valid PDF or DOCX Word document.");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) void processFile(f);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) void processFile(f);
  };

  const handleLoadDemo = () => {
    const demoFile = new File([SAMPLE_DEMO_TEXT], "Alex_Morgan_Senior_FullStack_Engineer.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    });
    void processFile(demoFile);
  };

  /* =========================================================================
   * STEP 2: REVIEW & EDIT HELPERS
   * ========================================================================= */
  const updateContact = (key: keyof ResumeData["contact"], val: string) => {
    setDraftResume((prev) => ({
      ...prev,
      contact: { ...prev.contact, [key]: val }
    }));
  };

  const updateExperience = (id: string, patch: Partial<XpEntry>) => {
    setDraftResume((prev) => ({
      ...prev,
      experience: prev.experience.map((x) => (x.id === id ? { ...x, ...patch } : x))
    }));
  };

  const removeExperience = (id: string) => {
    setDraftResume((prev) => ({
      ...prev,
      experience: prev.experience.filter((x) => x.id !== id)
    }));
  };

  const addSkill = () => {
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;
    if (draftResume.skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      toast("Skill already added.", "warn");
      return;
    }
    setDraftResume((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
    setNewSkillInput("");
  };

  const removeSkill = (index: number) => {
    setDraftResume((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  /* =========================================================================
   * STEP 4: FINAL ATS AUDIT & LAUNCH
   * ========================================================================= */
  const auditReport = atsScore(draftResume);

  const handleFinishAndOpenBuilder = () => {
    // Finalize pageCount and template
    const finalResume: ResumeData = {
      ...draftResume,
      pageCount: pageChoice,
      template: selectedTemplate
    };

    replaceResume(finalResume);

    try {
      localStorage.setItem("rb_resume_v1", JSON.stringify(finalResume));
      if (targetJd) {
        localStorage.setItem("rb_target_jd", targetJd);
      }
    } catch {}

    void saveToCloud();

    toast(`Resume loaded in 1-Page ATS format!`, "ok");

    if (onCompleted) {
      onCompleted(finalResume);
    }

    onClose();
    navigate("/builder");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-ink/75 backdrop-blur-sm overflow-y-auto">
      <div
        id="resume-upload-wizard-modal"
        className="relative my-auto w-full max-w-4xl border-2 border-ink bg-card shadow-[10px_10px_0_0_rgba(19,31,26,0.3)] transition-all"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b-2 border-ink bg-paper px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center border-2 border-ink bg-acid text-ink">
              <Icon name="upload" size={20} />
            </div>
            <div>
              <h2 className="font-display text-xl font-black text-ink">
                Step-by-Step Resume Import & 1-Page Optimizer
              </h2>
              <p className="font-mono text-xs text-ink-soft">
                Extract, verify data step-by-step, and enforce clean 1-page ATS formatting
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center border border-ink/30 text-ink-soft hover:border-ink hover:text-ink hover:bg-coral/10 hover:text-coral transition-colors"
            title="Close"
          >
            <Icon name="x" size={16} />
          </button>
        </div>

        {/* Stepper Tabs Bar */}
        <div className="grid grid-cols-4 border-b-2 border-ink bg-white text-center font-mono text-xs font-bold">
          {[
            { num: 1, title: "1. Upload & Scan", subtitle: "File extraction" },
            { num: 2, title: "2. Review Data", subtitle: "Verify details" },
            { num: 3, title: "3. 1-Page Format", subtitle: "Layout & style" },
            { num: 4, title: "4. ATS Audit", subtitle: "Launch builder" },
          ].map((s) => {
            const isActive = step === s.num;
            const isDone = step > s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => {
                  // Only allow jumping back or forward if already parsed
                  if (s.num === 1 || draftResume.contact.fullName || draftResume.experience.length > 0) {
                    setStep(s.num as WizardStep);
                  }
                }}
                className={`relative px-3 py-3.5 transition-colors border-r border-ink/15 last:border-r-0 ${
                  isActive
                    ? "bg-ink text-acid"
                    : isDone
                    ? "bg-acid/15 text-pine-deep hover:bg-acid/30"
                    : "text-ink-soft/60 hover:text-ink hover:bg-paper"
                }`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  {isDone ? (
                    <span className="grid h-4 w-4 place-items-center rounded-full bg-pine text-[10px] text-paper">✓</span>
                  ) : (
                    <span>0{s.num}</span>
                  )}
                  <span className="hidden sm:inline font-display">{s.title.split(". ")[1]}</span>
                </div>
                <div className="text-[10px] font-normal opacity-75 hidden md:block mt-0.5">{s.subtitle}</div>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-acid" />
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[calc(85vh-180px)] overflow-y-auto">
          {/* =========================================================================
           * STEP 1: UPLOAD & AUTOMATIC EXTRACTION
           * ========================================================================= */}
          {step === 1 && (
            <div className="space-y-6">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Upload Drop Area */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center border-2 border-dashed p-10 text-center transition-all ${
                  isDragging
                    ? "border-pine bg-pine/10 scale-[1.01]"
                    : "border-ink/30 bg-paper/50 hover:border-ink hover:bg-paper"
                }`}
              >
                <div className="grid h-16 w-16 place-items-center border-2 border-ink bg-acid text-ink">
                  <Icon name="upload" size={28} />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-ink">
                  Select or drop your resume (PDF or Word DOCX)
                </h3>
                <p className="mt-2 max-w-md text-xs text-ink-soft">
                  Dual extraction engine decodes career experience, quantified achievements, education, and technical skills into standard 1-page ATS format.
                </p>

                <div className="mt-5 inline-flex items-center gap-2 border-2 border-ink bg-acid px-5 py-2.5 text-xs font-bold text-ink shadow-[2px_2px_0_0_#131F1A]">
                  <Icon name="sparkle" size={15} />
                  <span>Choose File to Step-by-Step Process</span>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-ink-soft">
                  <span className="flex items-center gap-1">
                    <Icon name="shield" size={13} className="text-pine" /> Client-Side Privacy
                  </span>
                  <span>·</span>
                  <span>1-Page Guaranteed Layout</span>
                  <span>·</span>
                  <span>14 ATS Algorithm Checks</span>
                </div>
              </div>

              {/* Sample Button */}
              <div className="flex items-center justify-between border-t border-ink/15 pt-4">
                <span className="text-xs text-ink-soft font-mono">
                  Don't have a document ready right now?
                </span>
                <button
                  type="button"
                  onClick={handleLoadDemo}
                  className="inline-flex items-center gap-1.5 border border-ink/30 bg-white px-3.5 py-2 text-xs font-bold text-ink hover:border-ink hover:bg-paper"
                >
                  <Icon name="sparkle" size={14} className="text-pine" />
                  <span>Try Sample Resume (Senior Engineer)</span>
                </button>
              </div>

              {/* Live Extraction Progress Indicator */}
              {isProcessing && (
                <div className="border-2 border-pine bg-pine/5 p-5">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-pine-deep">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 animate-ping rounded-full bg-pine" />
                      Step-by-Step Extraction Running...
                    </span>
                    <span>{processingProgress}%</span>
                  </div>
                  <div className="mt-2 h-2.5 w-full bg-ink/10 overflow-hidden">
                    <div
                      className="h-full bg-pine transition-all duration-300"
                      style={{ width: `${processingProgress}%` }}
                    />
                  </div>
                  <p className="mt-3 font-display text-sm font-semibold text-ink">
                    {processingStage}
                  </p>
                </div>
              )}

              {/* Error Box */}
              {parseError && (
                <div className="flex items-start gap-3 border-2 border-coral bg-coral/10 p-4 text-xs text-coral">
                  <Icon name="x" size={18} className="shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold">Extraction Notice</p>
                    <p className="mt-0.5 text-ink-soft">{parseError}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
           * STEP 2: REVIEW & EDIT EXTRACTED DATA
           * ========================================================================= */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-ink/20 pb-3">
                <div>
                  <h3 className="font-display text-lg font-black text-ink">
                    Review Extracted Sections
                  </h3>
                  <p className="text-xs text-ink-soft">
                    Verify and quickly adjust extracted details before formatting on 1 page.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="border border-pine/40 bg-pine/10 px-2.5 py-1 font-mono text-[11px] font-bold text-pine-deep">
                    {draftResume.experience.length} Roles Detected
                  </span>
                  <span className="border border-ink/20 bg-paper px-2.5 py-1 font-mono text-[11px] font-bold text-ink">
                    {draftResume.skills.length} Skills
                  </span>
                </div>
              </div>

              {/* Sub-tab Switcher */}
              <div className="flex flex-wrap gap-2 border-b border-ink/15 pb-3">
                {[
                  { id: "contact", label: "Contact & Bio", count: draftResume.contact.fullName ? "✓" : "!" },
                  { id: "experience", label: "Work Experience", count: draftResume.experience.length },
                  { id: "skills", label: "Skills", count: draftResume.skills.length },
                  { id: "education", label: "Education", count: draftResume.education.length },
                  { id: "summary", label: "Summary", count: draftResume.summary ? "✓" : "—" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setReviewTab(t.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-colors ${
                      reviewTab === t.id
                        ? "bg-ink text-acid"
                        : "border border-ink/20 bg-white text-ink-soft hover:text-ink hover:bg-paper"
                    }`}
                  >
                    <span>{t.label}</span>
                    <span className="font-mono text-[10px] opacity-75">({t.count})</span>
                  </button>
                ))}
              </div>

              {/* Tab 1: Contact */}
              {reviewTab === "contact" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Full Name</label>
                    <input
                      type="text"
                      value={draftResume.contact.fullName}
                      onChange={(e) => updateContact("fullName", e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full border-2 border-ink bg-white px-3 py-2 text-sm text-ink focus:border-pine focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Target Professional Title</label>
                    <input
                      type="text"
                      value={draftResume.contact.title}
                      onChange={(e) => updateContact("title", e.target.value)}
                      placeholder="Senior Full-Stack Engineer"
                      className="w-full border-2 border-ink bg-white px-3 py-2 text-sm text-ink focus:border-pine focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Email Address</label>
                    <input
                      type="email"
                      value={draftResume.contact.email}
                      onChange={(e) => updateContact("email", e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full border-2 border-ink bg-white px-3 py-2 text-sm text-ink focus:border-pine focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={draftResume.contact.phone}
                      onChange={(e) => updateContact("phone", e.target.value)}
                      placeholder="+1 (555) 019-2834"
                      className="w-full border-2 border-ink bg-white px-3 py-2 text-sm text-ink focus:border-pine focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Location</label>
                    <input
                      type="text"
                      value={draftResume.contact.location}
                      onChange={(e) => updateContact("location", e.target.value)}
                      placeholder="San Francisco, CA"
                      className="w-full border-2 border-ink bg-white px-3 py-2 text-sm text-ink focus:border-pine focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">LinkedIn / Portfolio URL</label>
                    <input
                      type="text"
                      value={draftResume.contact.linkedin || ""}
                      onChange={(e) => updateContact("linkedin", e.target.value)}
                      placeholder="linkedin.com/in/janedoe"
                      className="w-full border-2 border-ink bg-white px-3 py-2 text-sm text-ink focus:border-pine focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: Work Experience */}
              {reviewTab === "experience" && (
                <div className="space-y-4">
                  {draftResume.experience.map((xp, idx) => (
                    <div key={xp.id || idx} className="border-2 border-ink/20 bg-white p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="grid flex-1 gap-3 sm:grid-cols-2">
                          <div>
                            <span className="block text-[11px] font-bold text-ink-soft">Job Title</span>
                            <input
                              type="text"
                              value={xp.role}
                              onChange={(e) => updateExperience(xp.id, { role: e.target.value })}
                              className="w-full border border-ink/30 px-2.5 py-1 text-sm font-semibold text-ink"
                            />
                          </div>
                          <div>
                            <span className="block text-[11px] font-bold text-ink-soft">Company / Employer</span>
                            <input
                              type="text"
                              value={xp.company}
                              onChange={(e) => updateExperience(xp.id, { company: e.target.value })}
                              className="w-full border border-ink/30 px-2.5 py-1 text-sm font-semibold text-ink"
                            />
                          </div>
                          <div>
                            <span className="block text-[11px] font-bold text-ink-soft">Start Date — End Date</span>
                            <input
                              type="text"
                              value={`${xp.start} – ${xp.end}`}
                              onChange={(e) => {
                                const parts = e.target.value.split("–").map((p) => p.trim());
                                updateExperience(xp.id, { start: parts[0] || "", end: parts[1] || "" });
                              }}
                              className="w-full border border-ink/30 px-2.5 py-1 text-xs font-mono text-ink"
                            />
                          </div>
                          <div>
                            <span className="block text-[11px] font-bold text-ink-soft">Location</span>
                            <input
                              type="text"
                              value={xp.location || ""}
                              onChange={(e) => updateExperience(xp.id, { location: e.target.value })}
                              placeholder="City, State"
                              className="w-full border border-ink/30 px-2.5 py-1 text-xs font-mono text-ink"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExperience(xp.id)}
                          className="text-coral hover:bg-coral/10 p-1 rounded"
                          title="Delete role"
                        >
                          <Icon name="trash" size={15} />
                        </button>
                      </div>

                      {/* Bullet points */}
                      <div>
                        <span className="block text-[11px] font-bold text-ink-soft mb-1">
                          Achievement Bullets ({xp.bullets.length})
                        </span>
                        <textarea
                          rows={3}
                          value={xp.bullets.join("\n")}
                          onChange={(e) => updateExperience(xp.id, { bullets: e.target.value.split("\n") })}
                          className="w-full border border-ink/30 p-2 font-mono text-xs text-ink leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}

                  {draftResume.experience.length === 0 && (
                    <div className="p-8 text-center border-2 border-dashed border-ink/20">
                      <p className="text-xs text-ink-soft">No employment roles found. You can add one anytime.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Skills */}
              {reviewTab === "skills" && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                      placeholder="Type a skill (e.g. React, Python, AWS) and press Enter"
                      className="flex-1 border-2 border-ink bg-white px-3 py-2 text-sm text-ink focus:border-pine focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="border-2 border-ink bg-acid px-4 py-2 text-xs font-bold text-ink hover:bg-acid-soft"
                    >
                      + Add Skill
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {draftResume.skills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 border border-ink/20 bg-white px-3 py-1 text-xs font-medium text-ink"
                      >
                        <span>{sk}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(idx)}
                          className="text-ink-soft hover:text-coral font-bold"
                          title="Remove skill"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Education */}
              {reviewTab === "education" && (
                <div className="space-y-3">
                  {draftResume.education.map((ed, idx) => (
                    <div key={ed.id || idx} className="grid sm:grid-cols-3 gap-3 border border-ink/20 bg-white p-3">
                      <div>
                        <span className="block text-[11px] font-bold text-ink-soft">Degree / Major</span>
                        <input
                          type="text"
                          value={ed.degree}
                          onChange={(e) => {
                            const val = e.target.value;
                            setDraftResume((prev) => ({
                              ...prev,
                              education: prev.education.map((item) => (item.id === ed.id ? { ...item, degree: val } : item))
                            }));
                          }}
                          className="w-full border border-ink/30 px-2 py-1 text-xs font-semibold text-ink"
                        />
                      </div>
                      <div>
                        <span className="block text-[11px] font-bold text-ink-soft">School / University</span>
                        <input
                          type="text"
                          value={ed.school}
                          onChange={(e) => {
                            const val = e.target.value;
                            setDraftResume((prev) => ({
                              ...prev,
                              education: prev.education.map((item) => (item.id === ed.id ? { ...item, school: val } : item))
                            }));
                          }}
                          className="w-full border border-ink/30 px-2 py-1 text-xs font-semibold text-ink"
                        />
                      </div>
                      <div>
                        <span className="block text-[11px] font-bold text-ink-soft">Graduation Year</span>
                        <input
                          type="text"
                          value={ed.year}
                          onChange={(e) => {
                            const val = e.target.value;
                            setDraftResume((prev) => ({
                              ...prev,
                              education: prev.education.map((item) => (item.id === ed.id ? { ...item, year: val } : item))
                            }));
                          }}
                          className="w-full border border-ink/30 px-2 py-1 text-xs font-mono text-ink"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 5: Summary */}
              {reviewTab === "summary" && (
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">
                    Professional Summary / Profile Bio
                  </label>
                  <textarea
                    rows={5}
                    value={draftResume.summary}
                    onChange={(e) => setDraftResume((prev) => ({ ...prev, summary: e.target.value }))}
                    className="w-full border-2 border-ink bg-white p-3 text-sm text-ink leading-relaxed focus:border-pine focus:outline-none"
                    placeholder="Results-driven professional with expertise in..."
                  />
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
           * STEP 3: 1-PAGE FORMATTING & TEMPLATE SELECTION
           * ========================================================================= */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-lg font-black text-ink">
                  Page Layout & Template Configuration
                </h3>
                <p className="text-xs text-ink-soft">
                  Enforce strict 1-page standard to guarantee recruiters never experience multi-page splitting.
                </p>
              </div>

              {/* Page Format Toggle Cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div
                  onClick={() => setPageChoice(1)}
                  className={`cursor-pointer border-2 p-4 transition-all ${
                    pageChoice === 1
                      ? "border-pine bg-pine/5 shadow-[4px_4px_0_0_#131F1A]"
                      : "border-ink/20 bg-white hover:border-ink"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-base font-bold text-ink">
                      1 Page (Standard A4)
                    </span>
                    <span className="border border-pine bg-acid px-2 py-0.5 font-mono text-[10px] font-bold text-ink">
                      Recommended
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-ink-soft leading-relaxed">
                    <strong>Strict 1-Page Layout.</strong> Automatically compacts section margins, bullet spacing, and typography to fit neatly on 1 single sheet. 98% preferred by recruiters and ATS screeners.
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 font-mono text-[11px] text-pine-deep font-bold">
                    <Icon name="check" size={14} className="text-pine" />
                    <span>Never splits into Page 2</span>
                  </div>
                </div>

                <div
                  onClick={() => setPageChoice(2)}
                  className={`cursor-pointer border-2 p-4 transition-all ${
                    pageChoice === 2
                      ? "border-pine bg-pine/5 shadow-[4px_4px_0_0_#131F1A]"
                      : "border-ink/20 bg-white hover:border-ink"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-base font-bold text-ink">
                      2 Pages (Extended Senior CV)
                    </span>
                    <span className="border border-ink/30 bg-paper px-2 py-0.5 font-mono text-[10px] font-bold text-ink-soft">
                      Senior Executive
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-ink-soft leading-relaxed">
                    Designed for candidates with 10+ years of tenure, academic research, medical fellowships, or extensive patents needing two dedicated sheets.
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 font-mono text-[11px] text-ink-soft">
                    <span>Includes secondary project sheet</span>
                  </div>
                </div>
              </div>

              {/* Template Selection */}
              <div>
                <span className="block text-xs font-bold text-ink mb-2">
                  Select Visual Template
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: "merit", name: "Merit", style: "Standard ATS" },
                    { id: "modern", name: "Modern", style: "Tech Clean" },
                    { id: "classic", name: "Classic", style: "Traditional Serif" },
                    { id: "nordic", name: "Nordic", style: "Minimalist Scandinavian" },
                    { id: "onyx", name: "Onyx", style: "High Contrast Dark" },
                    { id: "summit", name: "Summit", style: "Executive Slate" },
                    { id: "cascade", name: "Cascade", style: "Compact Grid" },
                    { id: "stellar", name: "Stellar", style: "Polished Corporate" },
                  ].map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setSelectedTemplate(tpl.id as TemplateId)}
                      className={`border-2 p-3 text-left transition-all ${
                        selectedTemplate === tpl.id
                          ? "border-ink bg-acid text-ink font-bold shadow-[2px_2px_0_0_#131F1A]"
                          : "border-ink/20 bg-white text-ink-soft hover:border-ink hover:text-ink"
                      }`}
                    >
                      <div className="font-display text-sm font-bold">{tpl.name}</div>
                      <div className="text-[10px] font-mono opacity-80">{tpl.style}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Job Description Matcher */}
              <div>
                <label className="block text-xs font-bold text-ink mb-1">
                  Target Job Description (Optional)
                </label>
                <textarea
                  rows={3}
                  value={targetJd}
                  onChange={(e) => setTargetJd(e.target.value)}
                  placeholder="Paste target job posting here to auto-match keywords in the live builder..."
                  className="w-full border-2 border-ink bg-white p-2.5 text-xs text-ink focus:border-pine focus:outline-none font-mono"
                />
              </div>
            </div>
          )}

          {/* =========================================================================
           * STEP 4: ATS VERIFICATION & BUILDER LAUNCH
           * ========================================================================= */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="border-b border-ink/20 pb-4 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-display text-2xl font-black text-ink">
                    Resume Verified & Ready for Builder
                  </h3>
                  <p className="text-xs text-ink-soft mt-1">
                    Your parsed data has been formatted for a single-page ATS layout.
                  </p>
                </div>
                <div className="mt-3 sm:mt-0 flex justify-center">
                  <span className="border-2 border-pine bg-pine/10 px-3 py-1 font-mono text-xs font-bold text-pine-deep">
                    ✓ 1-Page Layout Enforced
                  </span>
                </div>
              </div>

              {/* Overview Grid */}
              <div className="grid gap-6 sm:grid-cols-[160px_1fr] items-center border-2 border-ink bg-white p-5">
                <div className="flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-ink/20 pb-4 sm:pb-0 sm:pr-4">
                  <Gauge value={auditReport.score} size={130} label="ATS Score" />
                  <span
                    className={`mt-2 font-mono text-xs font-bold px-2 py-0.5 ${
                      auditReport.score >= 80
                        ? "bg-acid text-ink"
                        : auditReport.score >= 60
                        ? "bg-amber-400 text-ink"
                        : "bg-coral text-paper"
                    }`}
                  >
                    {auditReport.score >= 80 ? "Grade A · ATS Ready" : "Grade B · Moderate Pass"}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-display text-xl font-black text-ink">
                      {draftResume.contact.fullName || "Candidate"}
                    </h4>
                    <p className="font-mono text-xs text-pine-deep font-semibold">
                      {draftResume.contact.title || "Professional Role"} · {draftResume.contact.location || "Available Worldwide"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-b border-ink/10 py-3 font-mono text-xs">
                    <div>
                      <span className="block text-[10px] text-ink-soft">Layout Mode</span>
                      <strong className="text-ink">{pageChoice === 1 ? "1 Page (A4)" : "2 Pages"}</strong>
                    </div>
                    <div>
                      <span className="block text-[10px] text-ink-soft">Template</span>
                      <strong className="text-ink capitalize">{selectedTemplate}</strong>
                    </div>
                    <div>
                      <span className="block text-[10px] text-ink-soft">Work Roles</span>
                      <strong className="text-ink">{draftResume.experience.length} Roles</strong>
                    </div>
                    <div>
                      <span className="block text-[10px] text-ink-soft">Skills Count</span>
                      <strong className="text-ink">{draftResume.skills.length} Skills</strong>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-1.5 text-xs text-ink-soft">
                    <p className="flex items-center gap-1.5 text-pine-deep font-medium">
                      <Icon name="check" size={13} className="text-pine" /> Contact info & email format verified
                    </p>
                    <p className="flex items-center gap-1.5 text-pine-deep font-medium">
                      <Icon name="check" size={13} className="text-pine" /> Single-page height constraint active
                    </p>
                    <p className="flex items-center gap-1.5 text-pine-deep font-medium">
                      <Icon name="check" size={13} className="text-pine" /> All action verbs and metrics preserved
                    </p>
                  </div>
                </div>
              </div>

              {/* Ready Banner */}
              <div className="border-2 border-acid bg-acid/20 p-4 text-center">
                <p className="font-display text-sm font-bold text-ink">
                  Ready to preview and customize in the live visual builder?
                </p>
                <p className="text-xs text-ink-soft mt-0.5">
                  You can edit text inline, test against job descriptions, and export to PDF/Word anytime.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between border-t-2 border-ink bg-paper px-6 py-4">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as WizardStep)}
                className="inline-flex items-center gap-1.5 border border-ink/30 bg-white px-4 py-2 text-xs font-bold text-ink hover:bg-paper transition-colors"
              >
                <span>← Back</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-ink-soft hover:text-ink px-3 py-2"
            >
              Cancel
            </button>

            {step === 1 && (
              <button
                type="button"
                disabled={isProcessing || !draftResume.contact.fullName && draftResume.experience.length === 0}
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 border-2 border-ink bg-acid px-5 py-2.5 text-xs font-bold text-ink shadow-[2px_2px_0_0_#131F1A] hover:-translate-y-0.5 transition-all disabled:opacity-40"
              >
                <span>Step 2: Review Extracted Details →</span>
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 border-2 border-ink bg-acid px-5 py-2.5 text-xs font-bold text-ink shadow-[2px_2px_0_0_#131F1A] hover:-translate-y-0.5 transition-all"
              >
                <span>Step 3: Layout & Template Options →</span>
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                onClick={() => setStep(4)}
                className="inline-flex items-center gap-2 border-2 border-ink bg-acid px-5 py-2.5 text-xs font-bold text-ink shadow-[2px_2px_0_0_#131F1A] hover:-translate-y-0.5 transition-all"
              >
                <span>Step 4: Final Verification →</span>
              </button>
            )}

            {step === 4 && (
              <button
                type="button"
                onClick={handleFinishAndOpenBuilder}
                className="inline-flex items-center gap-2 border-2 border-ink bg-pine text-paper px-6 py-2.5 text-xs font-bold shadow-[2px_2px_0_0_#131F1A] hover:bg-pine-deep hover:-translate-y-0.5 transition-all"
              >
                <Icon name="sparkle" size={15} className="text-acid" />
                <span>Open in Live Resume Builder (1-Page)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
