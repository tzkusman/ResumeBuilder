import React, { useEffect, useState, useRef, useCallback } from "react";
import { Icon } from "./ui";

export interface TourStep {
  id: string;
  targetId: string;
  title: string;
  description: string;
  badge: string;
  tabToOpen?: string;
  tip?: string;
  pointerPlacement?: "top" | "bottom" | "left" | "right";
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: "contact",
    targetId: "tour-contact-section",
    tabToOpen: "contact",
    badge: "Step 1 of 6",
    title: "1. Fill Your Contact Info",
    description: "Start by typing your full name, job title, email, and phone number here. Recruiters and ATS scanners check this first to reach out to you!",
    tip: "💡 Tip: Make sure your email and phone number are accurate so hiring managers can call you.",
    pointerPlacement: "right",
  },
  {
    id: "tabs",
    targetId: "tour-tabs-bar",
    badge: "Step 2 of 6",
    title: "2. Switch Resume Sections",
    description: "Click these tabs to fill in each section: Summary, Work Experience, Skills, Education, and Projects. You can jump between sections anytime!",
    tip: "💡 Tip: Each section automatically saves as you type. Nothing gets lost.",
    pointerPlacement: "bottom",
  },
  {
    id: "jd",
    targetId: "tour-jd-assistant",
    badge: "Step 3 of 6",
    title: "3. Target Job Keyword Assistant",
    description: "Have a job you're applying for? Paste the job description here! Our assistant instantly shows which keywords are in your resume and which ones are missing.",
    tip: "💡 Tip: Matching 70%+ of the job keywords dramatically increases interview callbacks.",
    pointerPlacement: "bottom",
  },
  {
    id: "templates",
    targetId: "tour-templates-bar",
    badge: "Step 4 of 6",
    title: "4. Choose Template & Accent Color",
    description: "Pick from 16 recruiter-approved templates (Standard, Modern, Summit, Nordic, and more) and choose your favorite color with a single click.",
    tip: "💡 Tip: All templates are engineered to be 100% ATS-friendly and pass automated parsers.",
    pointerPlacement: "bottom",
  },
  {
    id: "preview",
    targetId: "tour-preview-doc",
    badge: "Step 5 of 6",
    title: "5. Real-Time Live Preview",
    description: "Watch your resume update live with zero cutoffs! You can even click directly on any text inside the preview to jump straight to that field and edit it.",
    tip: "💡 Tip: Toggle 'Show Print Breaks' above the preview to see how pages will divide when printed.",
    pointerPlacement: "left",
  },
  {
    id: "export",
    targetId: "tour-export-button",
    badge: "Step 6 of 6",
    title: "6. Download Your Resume",
    description: "When you're done, click Export to download your resume in ATS-safe PDF, Word (DOCX), or plain text format ready to send to employers!",
    tip: "💡 Tip: PDF is the gold standard for job portals and email applications.",
    pointerPlacement: "bottom",
  },
];

interface InteractiveMouseTourProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab?: (tab: string) => void;
}

export function InteractiveMouseTour({
  isOpen,
  onClose,
  onSelectTab,
}: InteractiveMouseTourProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [cardPos, setCardPos] = useState<{ top: number; left: number }>({ top: 100, left: 100 });
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number }>({ x: 100, y: 100 });
  const cardRef = useRef<HTMLDivElement>(null);

  const currentStep = TOUR_STEPS[currentStepIndex];

  // Recalculate target position
  const updatePositions = useCallback(() => {
    if (!isOpen || !currentStep) return;

    // Switch tab if step requests it
    if (currentStep.tabToOpen && onSelectTab) {
      onSelectTab(currentStep.tabToOpen);
    }

    // Small delay to allow DOM/tab switch to render
    setTimeout(() => {
      let targetEl = document.getElementById(currentStep.targetId);

      // Fallback if target element not found
      if (!targetEl) {
        if (currentStep.id === "contact") {
          targetEl = document.getElementById("contact-fullName") || document.querySelector("input");
        } else if (currentStep.id === "export") {
          targetEl = document.getElementById("tour-export-button");
        }
      }

      if (!targetEl) {
        // Center fallback
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        setPointerPos({ x: centerX, y: centerY });
        setCardPos({ top: centerY - 100, left: centerX - 180 });
        setTargetRect(null);
        return;
      }

      // Scroll into view if out of sight
      targetEl.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });

      // Measure coordinates
      setTimeout(() => {
        if (!targetEl) return;
        const rect = targetEl.getBoundingClientRect();
        setTargetRect(rect);

        const margin = 16;
        const cardWidth = Math.min(380, window.innerWidth - 32);
        const cardHeight = 240;

        let ptrX = rect.left + rect.width / 2;
        let ptrY = rect.top + rect.height / 2;
        let cTop = rect.bottom + margin;
        let cLeft = rect.left;

        // Custom pointer and tooltip placement per step
        if (currentStep.pointerPlacement === "right") {
          ptrX = rect.right - 24;
          ptrY = rect.top + Math.min(80, rect.height / 2);
          cTop = Math.max(16, rect.top);
          cLeft = rect.right + margin;
          if (cLeft + cardWidth > window.innerWidth) {
            cLeft = Math.max(16, rect.left - cardWidth - margin);
          }
        } else if (currentStep.pointerPlacement === "left") {
          ptrX = rect.left + 30;
          ptrY = rect.top + Math.min(100, rect.height / 3);
          cTop = Math.max(70, rect.top);
          cLeft = Math.max(16, rect.left - cardWidth - margin);
          if (cLeft < 16) {
            cLeft = rect.left + 20;
            cTop = rect.bottom + margin;
          }
        } else {
          // Bottom / Top
          ptrX = rect.left + Math.min(120, rect.width / 2);
          ptrY = rect.bottom - 10;
          cTop = rect.bottom + margin;
          cLeft = Math.max(16, rect.left);
          if (cLeft + cardWidth > window.innerWidth) {
            cLeft = window.innerWidth - cardWidth - 20;
          }
          if (cTop + cardHeight > window.innerHeight) {
            cTop = Math.max(16, rect.top - cardHeight - margin);
            ptrY = rect.top + 10;
          }
        }

        // Clamp inside window
        cLeft = Math.max(12, Math.min(cLeft, window.innerWidth - cardWidth - 12));
        cTop = Math.max(12, Math.min(cTop, window.innerHeight - cardHeight - 12));

        setPointerPos({ x: ptrX, y: ptrY });
        setCardPos({ top: cTop, left: cLeft });
      }, 150);
    }, 50);
  }, [isOpen, currentStep, onSelectTab]);

  useEffect(() => {
    if (isOpen) {
      updatePositions();
      window.addEventListener("resize", updatePositions);
      window.addEventListener("scroll", updatePositions, true);
      return () => {
        window.removeEventListener("resize", updatePositions);
        window.removeEventListener("scroll", updatePositions, true);
      };
    }
  }, [isOpen, updatePositions]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentStepIndex]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-auto overflow-hidden font-sans select-none">
      {/* Dark overlay backdrop */}
      <div
        className="absolute inset-0 bg-ink/65 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Target element spotlight frame */}
      {targetRect && (
        <div
          className="absolute border-3 border-acid ring-4 ring-acid/40 rounded-sm pointer-events-none transition-all duration-300 shadow-[0_0_0_9999px_rgba(10,12,16,0.65)]"
          style={{
            top: `${Math.max(0, targetRect.top - 6)}px`,
            left: `${Math.max(0, targetRect.left - 6)}px`,
            width: `${targetRect.width + 12}px`,
            height: `${targetRect.height + 12}px`,
          }}
        >
          {/* Animated corner accents */}
          <span className="absolute -top-2 -left-2 h-4 w-4 border-t-3 border-l-3 border-acid" />
          <span className="absolute -top-2 -right-2 h-4 w-4 border-t-3 border-r-3 border-acid" />
          <span className="absolute -bottom-2 -left-2 h-4 w-4 border-b-3 border-l-3 border-acid" />
          <span className="absolute -bottom-2 -right-2 h-4 w-4 border-b-3 border-r-3 border-acid" />
        </div>
      )}

      {/* ANIMATED MOUSE POINTER CURSOR */}
      <div
        className="absolute z-50 pointer-events-none transition-all duration-300 ease-out"
        style={{
          transform: `translate3d(${pointerPos.x}px, ${pointerPos.y}px, 0)`,
        }}
      >
        {/* Pulsing radar click waves */}
        <div className="relative">
          <span className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-acid opacity-75 animate-ping" />
          <span className="absolute -top-2 -left-2 h-6 w-6 rounded-full bg-amber-400 opacity-60 animate-pulse" />

          {/* Mouse pointer graphic (sleek SVG cursor with black outline & white fill) */}
          <div className="relative animate-bounce drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              {/* Outer stroke */}
              <path
                d="M3.5 2.5L10 21.5L13.5 13.5L21.5 10L3.5 2.5Z"
                fill="#FFFFFF"
                stroke="#0A0C10"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              {/* Internal decorative accent */}
              <circle cx="10" cy="10" r="2" fill="#D9F99D" />
            </svg>
            <div className="absolute left-7 top-1 whitespace-nowrap bg-ink text-acid border border-acid px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider shadow-md">
              Point here
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING STEP CARD */}
      <div
        ref={cardRef}
        className="absolute z-50 w-[360px] max-w-[calc(100vw-24px)] border-3 border-ink bg-card p-5 shadow-[8px_8px_0_0_var(--color-ink)] transition-all duration-300"
        style={{
          top: `${cardPos.top}px`,
          left: `${cardPos.left}px`,
        }}
      >
        {/* Header with step number & close */}
        <div className="flex items-center justify-between border-b-2 border-ink/15 pb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 border border-ink bg-acid px-2.5 py-0.5 font-mono text-xs font-black uppercase text-ink">
              <span className="inline-block h-2 w-2 rounded-full bg-ink animate-pulse" />
              {currentStep.badge}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center border border-ink/30 bg-paper text-ink hover:bg-coral hover:text-paper transition-colors font-bold text-sm"
            title="Close tutorial tour (Esc)"
          >
            ✕
          </button>
        </div>

        {/* Content body */}
        <div className="mt-3.5 space-y-2.5">
          <h3 className="font-display text-base font-black text-ink leading-tight">
            {currentStep.title}
          </h3>
          <p className="text-sm font-medium text-ink-soft leading-relaxed">
            {currentStep.description}
          </p>

          {currentStep.tip && (
            <div className="rounded-sm border border-pine/30 bg-acid-soft/60 p-2 text-xs font-semibold text-pine-deep">
              {currentStep.tip}
            </div>
          )}
        </div>

        {/* Step Progress Dots */}
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {TOUR_STEPS.map((step, idx) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setCurrentStepIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentStepIndex
                  ? "w-6 bg-ink"
                  : idx < currentStepIndex
                  ? "w-2 bg-pine"
                  : "w-2 bg-ink/20 hover:bg-ink/40"
              }`}
              title={`Jump to ${step.title}`}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-ink/15">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className={`flex items-center gap-1 px-3 py-1.5 font-mono text-xs font-bold uppercase transition-all ${
              currentStepIndex === 0
                ? "opacity-30 cursor-not-allowed text-neutral-400"
                : "border border-ink/30 bg-paper text-ink hover:bg-ink hover:text-paper"
            }`}
          >
            ← Back
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1.5 font-mono text-xs text-ink-soft hover:text-ink underline transition-colors"
            >
              Skip
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 border-2 border-ink bg-acid px-4 py-1.5 font-mono text-xs font-black uppercase text-ink shadow-[2px_2px_0_0_var(--color-ink)] hover:bg-amber-300 transition-all hover:-translate-y-0.5"
            >
              {currentStepIndex === TOUR_STEPS.length - 1 ? (
                <>Finish &amp; Start Building ✓</>
              ) : (
                <>Next Step →</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
