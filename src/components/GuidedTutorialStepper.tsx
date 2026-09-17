import React from "react";
import { Icon } from "./ui";
import type { ResumeData } from "../lib/types";

export interface GuidedStep {
  id: string;
  tab: string;
  stepNumber: number;
  title: string;
  shortLabel: string;
  coachTip: string;
  tipTitle: string;
  isComplete: (r: ResumeData) => boolean;
  actionHint: string;
}

export const GUIDED_STEPS: GuidedStep[] = [
  {
    id: "step-contact",
    tab: "contact",
    stepNumber: 1,
    title: "Contact Details & Bio",
    shortLabel: "Contact",
    tipTitle: "Recruiter Rule #1: Instant Reachability",
    coachTip: "ATS parsers scan this section first. Provide an active email, direct phone number, and city/country. Photos are optional for US/UK/Canada, but recommended in EU & Middle East.",
    isComplete: (r) => Boolean(r.contact.fullName?.trim() && (r.contact.email?.trim() || r.contact.phone?.trim())),
    actionHint: "Enter your full name, job title, email, and location.",
  },
  {
    id: "step-summary",
    tab: "summary",
    stepNumber: 2,
    title: "Professional Summary",
    shortLabel: "Summary",
    tipTitle: "The 6-Second Elevator Pitch",
    coachTip: "Write 3–4 concise sentences showcasing your years of experience, core technical specialties, and top 1–2 quantifiable career achievements. Avoid generic adjectives like 'hardworking'.",
    isComplete: (r) => (r.summary?.trim().length || 0) >= 30,
    actionHint: "Summarize your career focus, key strengths, and highest value.",
  },
  {
    id: "step-experience",
    tab: "experience",
    stepNumber: 3,
    title: "Work Experience & Achievements",
    shortLabel: "Experience",
    tipTitle: "Action Verb + Context + Measurable Result",
    coachTip: "Every bullet should quantify impact: use percentages (%), dollar amounts ($), or team scale. Click '⚡ Metric Formulas' to insert proven, high-scoring achievement formulas.",
    isComplete: (r) => r.experience.some((e) => (e.role?.trim() || e.company?.trim()) && e.bullets.some((b) => b?.trim().length > 0)),
    actionHint: "Add your previous roles with clear metrics and quantifiable bullets.",
  },
  {
    id: "step-skills",
    tab: "skills",
    stepNumber: 4,
    title: "Skills & Keywords",
    shortLabel: "Skills",
    tipTitle: "Beat the ATS Screening Algorithm",
    coachTip: "ATS algorithms match exact keyword matches from the job posting. Add 8–15 relevant skills. Use the 'Target Job Assistant' to compare against the employer's job description.",
    isComplete: (r) => r.skills.filter(Boolean).length >= 4,
    actionHint: "List your top technical skills, frameworks, tools, and competencies.",
  },
  {
    id: "step-education",
    tab: "education",
    stepNumber: 5,
    title: "Education & Credentials",
    shortLabel: "Education",
    tipTitle: "Degrees, Certifications & Licenses",
    coachTip: "List degrees in reverse chronological order. Include certifications (AWS, PMP, Scrum) and spoken languages to give recruiters a decisive reason to interview you.",
    isComplete: (r) => r.education.some((e) => e.school?.trim() || e.degree?.trim()) || (r.certifications?.length || 0) > 0,
    actionHint: "Add your university, degrees, certifications, or specialized licenses.",
  },
  {
    id: "step-template",
    tab: "template",
    stepNumber: 6,
    title: "Template & Visual Styling",
    shortLabel: "Template",
    tipTitle: "Seniority-Matched Visual Layout",
    coachTip: "Choose an ATS-tested template: Merit (recruiter standard), Modern (sleek), Classic (traditional), or Nordic (minimal). Pick a professional accent color that matches your personal brand.",
    isComplete: (r) => Boolean(r.template),
    actionHint: "Select from 15+ ATS templates and customize accent color & typography.",
  },
  {
    id: "step-review",
    tab: "review",
    stepNumber: 7,
    title: "Final Audit & 1-Click Export",
    shortLabel: "Export",
    tipTitle: "Review Full Document & Export",
    coachTip: "Verify your live continuous preview without cutoff. When you export or print, our engine auto-paginates cleanly to 1 or 2 pages. Download in PDF, Word (DOCX), or TXT format.",
    isComplete: () => true,
    actionHint: "Inspect your full resume preview, audit ATS score, and export.",
  },
];

interface GuidedTutorialStepperProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  resume: ResumeData;
  tutorialMode: boolean;
  onToggleTutorialMode: (enabled: boolean) => void;
  onOpenExport?: () => void;
  onOpenAts?: () => void;
  onPrint?: () => void;
}

export default function GuidedTutorialStepper({
  currentTab,
  onSelectTab,
  resume,
  tutorialMode,
  onToggleTutorialMode,
  onOpenExport,
  onOpenAts,
  onPrint,
}: GuidedTutorialStepperProps) {
  // Map current tab to a step index
  const activeStepIndex = Math.max(
    0,
    GUIDED_STEPS.findIndex((s) => s.tab === currentTab || (currentTab === "extras" && s.tab === "education") || (currentTab === "projects" && s.tab === "experience"))
  );

  const currentStep = GUIDED_STEPS[activeStepIndex] || GUIDED_STEPS[0];
  const completedCount = GUIDED_STEPS.filter((s) => s.isComplete(resume)).length;
  const progressPercent = Math.round((completedCount / GUIDED_STEPS.length) * 100);

  const handleNext = () => {
    if (activeStepIndex < GUIDED_STEPS.length - 1) {
      const nextStep = GUIDED_STEPS[activeStepIndex + 1];
      onSelectTab(nextStep.tab);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      if (onOpenExport) onOpenExport();
      else if (onPrint) onPrint();
    }
  };

  const handlePrev = () => {
    if (activeStepIndex > 0) {
      const prevStep = GUIDED_STEPS[activeStepIndex - 1];
      onSelectTab(prevStep.tab);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="mb-4 border-2 border-ink bg-card shadow-[4px_4px_0_0_var(--color-ink)]">
      {/* Top Bar: Mode Toggle & Overall Progress */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink bg-paper px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-acid font-mono text-xs font-black text-ink shadow-xs">
            {currentStep.stepNumber}
          </span>
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-soft">
              Step-by-Step Guide · Step {currentStep.stepNumber} of 7
            </span>
            <p className="font-display text-sm font-bold text-ink leading-tight">
              {currentStep.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Progress badge */}
          <div className="hidden sm:flex items-center gap-2 border border-ink/25 bg-card px-2 py-1">
            <div className="h-2 w-16 bg-neutral-200 overflow-hidden rounded-full">
              <div
                className="h-full bg-pine transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-mono text-[10px] font-bold text-pine-deep">
              {progressPercent}% Complete
            </span>
          </div>

          {/* Tutorial Mode Toggle */}
          <button
            type="button"
            onClick={() => onToggleTutorialMode(!tutorialMode)}
            className={`flex items-center gap-1.5 border px-2 py-1 font-mono text-[10.5px] font-bold uppercase transition-colors ${
              tutorialMode
                ? "border-pine bg-pine text-white"
                : "border-ink/30 bg-card text-ink-soft hover:text-ink"
            }`}
            title="Switch between Guided Tutorial Mode and All Sections Free-Edit"
          >
            <Icon name="zap" size={12} className={tutorialMode ? "text-acid" : ""} />
            <span>{tutorialMode ? "Guided: ON" : "Guided: OFF"}</span>
          </button>
        </div>
      </div>

      {/* Stepper Progress Pipeline (Clickable tabs) */}
      <div className="grid grid-cols-7 border-b-2 border-ink/20 bg-paper/60 divide-x divide-ink/15 text-center overflow-x-auto">
        {GUIDED_STEPS.map((step, idx) => {
          const isActive = idx === activeStepIndex;
          const isDone = step.isComplete(resume);

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onSelectTab(step.tab)}
              className={`group flex flex-col items-center justify-center p-1.5 text-center transition-all ${
                isActive
                  ? "bg-acid/30 text-ink font-bold shadow-inner"
                  : isDone
                  ? "bg-paper hover:bg-pine/5 text-pine-deep font-medium"
                  : "bg-paper/40 hover:bg-neutral-100 text-ink-soft"
              }`}
              title={`Jump to Step ${step.stepNumber}: ${step.title}`}
            >
              <div className="flex items-center gap-1">
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-mono font-bold ${
                    isActive
                      ? "bg-ink text-acid"
                      : isDone
                      ? "bg-pine text-white"
                      : "bg-neutral-300 text-neutral-700"
                  }`}
                >
                  {isDone && !isActive ? "✓" : step.stepNumber}
                </span>
                <span className="hidden md:inline font-mono text-[10px] uppercase tracking-wide truncate max-w-[70px]">
                  {step.shortLabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Recruiter Coach Tip Banner */}
      {tutorialMode && (
        <div className="bg-gradient-to-r from-pine/10 via-acid/10 to-transparent p-3 border-b border-ink/15">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pine text-white text-[11px] font-bold">
              💡
            </span>
            <div className="flex-1 text-xs">
              <span className="font-bold text-neutral-900">{currentStep.tipTitle}: </span>
              <span className="text-neutral-700 leading-relaxed">{currentStep.coachTip}</span>
            </div>
          </div>
        </div>
      )}

      {/* Next / Prev Step Navigation Controls */}
      <div className="flex items-center justify-between gap-2 p-2.5 bg-card">
        <button
          type="button"
          onClick={handlePrev}
          disabled={activeStepIndex === 0}
          className={`flex items-center gap-1 border px-2.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider transition-all ${
            activeStepIndex === 0
              ? "border-neutral-200 text-neutral-300 cursor-not-allowed"
              : "border-ink bg-paper text-ink hover:bg-line shadow-xs"
          }`}
        >
          <Icon name="chev" size={12} className="rotate-90" />
          <span className="hidden sm:inline">Back:</span>{" "}
          {activeStepIndex > 0 ? GUIDED_STEPS[activeStepIndex - 1].shortLabel : "Start"}
        </button>

        <div className="flex items-center gap-2">
          {activeStepIndex === 6 ? (
            <div className="flex items-center gap-2">
              {onOpenAts && (
                <button
                  type="button"
                  onClick={onOpenAts}
                  className="flex items-center gap-1 border-2 border-pine bg-pine/10 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-pine-deep hover:bg-pine/20"
                >
                  <Icon name="zap" size={13} />
                  <span>Check ATS Score</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 border-2 border-ink bg-acid px-3.5 py-1.5 font-mono text-[11px] font-black uppercase tracking-wider text-ink shadow-[2px_2px_0_0_var(--color-ink)] hover:bg-acid-hover"
              >
                <Icon name="download" size={13} />
                <span>Export Resume</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 border-2 border-ink bg-acid px-4 py-1.5 font-mono text-[11px] font-black uppercase tracking-wider text-ink shadow-[2px_2px_0_0_var(--color-ink)] hover:bg-acid-hover active:translate-x-[1px] active:translate-y-[1px]"
            >
              <span>Next: {GUIDED_STEPS[activeStepIndex + 1]?.shortLabel || "Review"}</span>
              <Icon name="chev" size={12} className="-rotate-90" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
