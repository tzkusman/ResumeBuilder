import React from "react";
import { Icon, Gauge } from "./ui";
import { atsScore } from "../lib/utils";
import type { ResumeData } from "../lib/types";

interface ReviewExportSectionProps {
  resume: ResumeData;
  onPrint: () => void;
  onDownloadDocx: () => void;
  onDownloadTxt: () => void;
  onCloudSave: () => void;
  onShare: () => void;
  onOpenJd: () => void;
  onPrev: () => void;
  freeExportsLeft?: number;
}

export default function ReviewExportSection({
  resume,
  onPrint,
  onDownloadDocx,
  onDownloadTxt,
  onCloudSave,
  onShare,
  onOpenJd,
  onPrev,
  freeExportsLeft,
}: ReviewExportSectionProps) {
  const report = atsScore(resume);
  const score = report.score;
  const passedChecks = report.checks.filter((c) => c.pass);
  const failedChecks = report.checks.filter((c) => !c.pass);

  const scoreBadge =
    score >= 80
      ? { text: "ATS Ready (Excellent)", color: "bg-pine text-white border-pine" }
      : score >= 60
      ? { text: "Good (Minor Polishing)", color: "bg-amber-500 text-white border-amber-600" }
      : { text: "Needs Attention", color: "bg-coral text-white border-coral" };

  return (
    <div className="space-y-6">
      {/* ATS Score Overview Card */}
      <div className="border-2 border-ink bg-card p-4 sm:p-5 shadow-[4px_4px_0_0_var(--color-ink)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-ink/15 pb-4">
          <div className="flex items-center gap-3.5">
            <Gauge value={score} size={76} label="ATS" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-display text-2xl font-black text-ink leading-none">{score}/100</span>
                <span className={`border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${scoreBadge.color}`}>
                  {scoreBadge.text}
                </span>
              </div>
              <p className="mt-1 text-xs text-neutral-600 leading-snug">
                Automated ATS resume scan based on recruiter parsers &amp; ranking heuristics.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenJd}
            className="self-start sm:self-auto flex items-center gap-1.5 border-2 border-pine bg-pine/10 px-3 py-1.5 font-mono text-xs font-bold text-pine-deep hover:bg-pine/20 transition-colors"
          >
            <Icon name="zap" size={13} />
            <span>Target Job Match</span>
          </button>
        </div>

        {/* Breakdown Items */}
        <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          <div className="border border-ink/20 bg-paper p-3 flex flex-col justify-between">
            <div className="flex items-baseline justify-between gap-1.5">
              <span className="font-mono text-[10px] uppercase font-bold text-ink-soft leading-tight">Passed Checks</span>
              <span className="font-mono text-xs font-black text-pine shrink-0">{passedChecks.length}/{report.checks.length}</span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-neutral-200 overflow-hidden rounded-full">
              <div
                className="h-full bg-pine transition-all duration-300"
                style={{ width: `${Math.round((passedChecks.length / (report.checks.length || 1)) * 100)}%` }}
              />
            </div>
          </div>

          <div className="border border-ink/20 bg-paper p-3 flex flex-col justify-between">
            <div className="flex items-baseline justify-between gap-1.5">
              <span className="font-mono text-[10px] uppercase font-bold text-ink-soft leading-tight">Layout Check</span>
              <span className="font-mono text-xs font-black text-ink shrink-0">{resume.template !== "ledger" ? "100%" : "50%"}</span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-neutral-200 overflow-hidden rounded-full">
              <div
                className="h-full bg-pine transition-all duration-300"
                style={{ width: resume.template !== "ledger" ? "100%" : "50%" }}
              />
            </div>
          </div>

          <div className="border border-ink/20 bg-paper p-3 flex flex-col justify-between">
            <div className="flex items-baseline justify-between gap-1.5">
              <span className="font-mono text-[10px] uppercase font-bold text-ink-soft leading-tight">Keywords &amp; Skills</span>
              <span className="font-mono text-xs font-black text-ink shrink-0">{resume.skills.length >= 6 ? "100%" : `${Math.round((resume.skills.length / 6) * 100)}%`}</span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-neutral-200 overflow-hidden rounded-full">
              <div
                className="h-full bg-pine transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((resume.skills.length / 6) * 100))}%` }}
              />
            </div>
          </div>

          <div className="border border-ink/20 bg-paper p-3 flex flex-col justify-between">
            <div className="flex items-baseline justify-between gap-1.5">
              <span className="font-mono text-[10px] uppercase font-bold text-ink-soft leading-tight">Experience Bullets</span>
              <span className="font-mono text-xs font-black text-ink shrink-0">{resume.experience.length > 0 ? "Pass" : "0"}</span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-neutral-200 overflow-hidden rounded-full">
              <div
                className="h-full bg-pine transition-all duration-300"
                style={{ width: resume.experience.length > 0 ? "100%" : "20%" }}
              />
            </div>
          </div>
        </div>

        {/* Recommendations if any */}
        {failedChecks.length > 0 && (
          <div className="mt-4 border border-ink/20 bg-amber-50/60 p-3">
            <p className="font-mono text-[10.5px] font-bold uppercase text-amber-900 mb-1">
              Top Improvement Recommendations:
            </p>
            <ul className="space-y-1 text-xs text-amber-950">
              {failedChecks.slice(0, 3).map((check, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-700 font-bold">•</span>
                  <span><strong>{check.label}</strong>: {check.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Auto-Pagination & Full Preview Guarantee Banner */}
      <div className="border-2 border-pine/40 bg-emerald-50/80 p-4">
        <div className="flex items-start gap-2.5">
          <span className="text-xl">✅</span>
          <div className="text-xs text-neutral-800 space-y-1">
            <p className="font-bold text-pine-deep text-sm">
              Continuous Live Preview &amp; Clean Print Auto-Adjustment
            </p>
            <p className="leading-relaxed">
              Your preview to the right renders your entire CV continuously without any artificial boundary cutting or hidden text. When you download as PDF or Print, our layout engine automatically separates it cleanly into 1 or 2 pages without cutting sentences or bullet points in half.
            </p>
          </div>
        </div>
      </div>

      {/* 1-Click Export Actions */}
      <div className="border-2 border-ink bg-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-ink">Download &amp; Export</h3>
          {typeof freeExportsLeft === "number" && (
            <span className="border border-pine bg-pine/10 px-2 py-0.5 font-mono text-[10px] font-bold text-pine-deep">
              {freeExportsLeft} Free Downloads Remaining
            </span>
          )}
        </div>

        {/* Primary Download PDF Button */}
        <button
          type="button"
          onClick={onPrint}
          className="flex w-full items-center justify-between border-2 border-ink bg-acid px-5 py-3.5 font-mono text-sm font-black uppercase tracking-wider text-ink shadow-[4px_4px_0_0_var(--color-ink)] hover:bg-acid-hover active:translate-x-[2px] active:translate-y-[2px] transition-all"
        >
          <div className="flex items-center gap-2.5">
            <Icon name="download" size={18} />
            <span>1-Click Download PDF (Auto-Adjusted)</span>
          </div>
          <span className="text-xs font-normal border border-ink/30 px-2 py-0.5 bg-white/70">
            Print Ready
          </span>
        </button>

        {/* Secondary Download Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={onDownloadDocx}
            className="flex items-center justify-center gap-2 border-2 border-ink bg-paper px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-ink hover:bg-line transition-colors"
          >
            <Icon name="fileText" size={14} />
            <span>Microsoft Word (.doc)</span>
          </button>

          <button
            type="button"
            onClick={onDownloadTxt}
            className="flex items-center justify-center gap-2 border-2 border-ink bg-paper px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-ink hover:bg-line transition-colors"
          >
            <Icon name="fileText" size={14} />
            <span>Plain Text (.txt ATS)</span>
          </button>
        </div>

        {/* Cloud & Share Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={onCloudSave}
            className="flex items-center justify-center gap-2 border border-ink/30 bg-card px-3.5 py-2 font-mono text-xs font-semibold text-ink-soft hover:text-ink hover:border-ink"
          >
            <Icon name="cloud" size={14} />
            <span>Sync to Cloud Storage</span>
          </button>

          <button
            type="button"
            onClick={onShare}
            className="flex items-center justify-center gap-2 border border-ink/30 bg-card px-3.5 py-2 font-mono text-xs font-semibold text-ink-soft hover:text-ink hover:border-ink"
          >
            <Icon name="share" size={14} />
            <span>Copy Shareable URL</span>
          </button>
        </div>
      </div>

      {/* Nav Back Button */}
      <div className="flex items-center justify-between border-t-2 border-ink/20 pt-4 bg-card p-3 border-2 border-ink">
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center gap-1 border border-ink bg-paper px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider hover:bg-line"
        >
          <Icon name="chev" size={12} className="rotate-90" />
          <span>Back: Template & Styling</span>
        </button>

        <button
          type="button"
          onClick={onPrint}
          className="flex items-center gap-1.5 border-2 border-ink bg-acid px-4 py-1.5 font-mono text-[11px] font-black uppercase tracking-wider text-ink shadow-[2px_2px_0_0_var(--color-ink)] hover:bg-acid-hover active:translate-x-[1px] active:translate-y-[1px]"
        >
          <Icon name="download" size={13} />
          <span>Download PDF Now</span>
        </button>
      </div>
    </div>
  );
}
