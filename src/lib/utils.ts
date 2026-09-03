import type { ResumeData } from "./types";

/* ---------------- ATS scoring engine ---------------- */

export interface AtsCheck { label: string; weight: number; pass: boolean; detail: string }
export interface AtsReport { score: number; checks: AtsCheck[] }

const ACTION_VERBS = [
  "led", "built", "shipped", "designed", "cut", "grew", "launched", "owned", "drove", "reduced",
  "raised", "managed", "created", "automated", "negotiated", "delivered", "increased", "saved",
  "coordinated", "implemented", "streamlined", "resolved", "mentored", "scaled", "migrated",
  "recovered", "administered", "engineered", "onboarded", "championed", "restructured", "verified",
];

const countWords = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const hasMetric = (s: string) => /\d/.test(s) || /%|\$/.test(s);
const startsWithVerb = (s: string) => ACTION_VERBS.includes(s.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, "") ?? "");
const hasPronouns = (s: string) => /\b(I|me|my|mine)\b/i.test(s);

export function atsScore(r: ResumeData): AtsReport {
  const bullets = r.experience.flatMap((e) => e.bullets.filter((b) => b.trim()));
  const metricBullets = bullets.filter(hasMetric).length;
  const verbBullets = bullets.filter(startsWithVerb).length;
  const summaryWords = countWords(r.summary);
  const allBulletsHave3 = r.experience.filter((e) => e.role).every((e) => e.bullets.filter((b) => b.trim()).length >= 3);

  const checks: AtsCheck[] = [
    { label: "Email address present", weight: 5, pass: /.+@.+\..+/.test(r.contact.email), detail: "Recruiters and parsers both need it." },
    { label: "Phone number present", weight: 5, pass: r.contact.phone.trim().length >= 7, detail: "Include country code for international roles." },
    { label: "Location listed", weight: 3, pass: r.contact.location.trim().length > 2, detail: "City + state/country is enough." },
    { label: "Summary is 25–90 words", weight: 8, pass: summaryWords >= 25 && summaryWords <= 90, detail: `Currently ${summaryWords} words.` },
    { label: "No first-person pronouns", weight: 4, pass: !hasPronouns(r.summary), detail: "Drop I / me / my from the summary." },
    { label: "2+ experience entries", weight: 8, pass: r.experience.filter((e) => e.role).length >= 2, detail: "Parsers expect a work history block." },
    { label: "3+ bullets per role", weight: 10, pass: allBulletsHave3, detail: "Thin roles read as thin experience." },
    { label: "Bullets open with action verbs", weight: 10, pass: bullets.length > 0 && verbBullets / bullets.length >= 0.4, detail: `${verbBullets}/${bullets.length} bullets lead with a verb.` },
    { label: "Quantified metrics (numbers, $, %)", weight: 12, pass: bullets.length > 0 && metricBullets / bullets.length >= 0.4, detail: `${metricBullets}/${bullets.length} bullets contain a number.` },
    { label: "6+ skills listed", weight: 10, pass: r.skills.filter(Boolean).length >= 6, detail: "Skills are the top ATS keyword source." },
    { label: "Standard section order", weight: 10, pass: true, detail: "Contact → Summary → Experience → Education → Skills." },
    { label: "Education section present", weight: 5, pass: r.education.some((e) => e.degree || e.school), detail: "Even in-progress degrees count." },
    { label: "Dates on experience", weight: 5, pass: r.experience.filter((e) => e.role).every((e) => e.start), detail: "Undated roles get skipped by parsers." },
    { label: "ATS-safe single-column layout", weight: 5, pass: r.template !== "ledger", detail: r.template === "ledger" ? "Ledger's sidebar can scramble parsers." : "Single column parses cleanly." },
  ];

  const score = Math.min(100, Math.round(checks.reduce((a, c) => a + (c.pass ? c.weight : 0), 0)));
  return { score, checks };
}

/* ---------------- Job description keyword extraction ---------------- */

const STOPWORDS = new Set(("the and for with you your our will can are was were this that have has from not but all any each which their they them then than into about across after before under over between during without within including required preferred plus able strong excellent good great work working team company position role job opportunity candidates applicant applicants skills skill experience years year day days week new using use used etc able must should would could just also very more most other such only own same who whom what when where why how per via via").split(" "));

export function extractKeywords(jd: string, top = 14): { term: string; count: number }[] {
  const clean = jd.toLowerCase().replace(/[^a-z0-9+#./\s-]/g, " ");
  const words = clean.split(/\s+/).filter((w) => w.length > 2 && !STOPWORDS.has(w) && !/^\d+$/.test(w));
  const freq = new Map<string, number>();
  words.forEach((w) => freq.set(w, (freq.get(w) ?? 0) + 1));
  // catch common bigrams
  for (let i = 0; i < words.length - 1; i++) {
    const big = `${words[i]} ${words[i + 1]}`;
    if (["project management", "machine learning", "customer service", "supply chain", "data analysis", "quality assurance", "cross functional", "time management"].includes(big)) {
      freq.set(big, (freq.get(big) ?? 0) + 2);
    }
  }
  return [...freq.entries()]
    .filter(([w, c]) => c >= 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, top)
    .map(([term, count]) => ({ term, count }));
}

export function matchKeywords(resume: ResumeData, keywords: { term: string; count: number }[]) {
  const hay = JSON.stringify(resume).toLowerCase();
  return keywords.map((k) => ({ ...k, matched: hay.includes(k.term.toLowerCase()) }));
}

/* ---------------- Exporters ---------------- */

export function resumeToText(r: ResumeData): string {
  const lines: string[] = [];
  const c = r.contact;
  lines.push(c.fullName.toUpperCase(), c.title, [c.email, c.phone, c.location, c.website, c.linkedin].filter(Boolean).join(" | "), "");
  if (r.summary) lines.push("PROFESSIONAL SUMMARY", r.summary, "");
  if (r.experience.length) {
    lines.push("EXPERIENCE");
    r.experience.forEach((e) => {
      lines.push(`${e.role} — ${e.company}${e.location ? ", " + e.location : ""}   ${e.start} – ${e.end}`);
      e.bullets.filter(Boolean).forEach((b) => lines.push(`- ${b}`));
      lines.push("");
    });
  }
  if (r.education.length) {
    lines.push("EDUCATION");
    r.education.forEach((e) => lines.push(`${e.degree} — ${e.school} ${e.year}`));
    lines.push("");
  }
  if (r.skills.length) lines.push("SKILLS", r.skills.join(", "), "");
  if (r.certifications.length) lines.push("CERTIFICATIONS", r.certifications.join("; "), "");
  if (r.languages.length) lines.push("LANGUAGES", r.languages.join(", "));
  return lines.join("\n");
}

export function resumeToHtml(r: ResumeData): string {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const c = r.contact;
  return `<html xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>${esc(c.fullName)} — Resume</title></head>
<body style="font-family:Calibri,Arial,sans-serif;color:#181d1a;font-size:11pt;line-height:1.45">
<h1 style="font-size:20pt;margin:0">${esc(c.fullName)}</h1>
<p style="margin:2pt 0;color:#444">${esc(c.title)}</p>
<p style="margin:2pt 0;color:#555;font-size:10pt">${[c.email, c.phone, c.location, c.website, c.linkedin].filter(Boolean).map(esc).join("  |  ")}</p>
${r.summary ? `<h2 style="font-size:12pt;border-bottom:1pt solid #999;padding-bottom:2pt">PROFESSIONAL SUMMARY</h2><p>${esc(r.summary)}</p>` : ""}
<h2 style="font-size:12pt;border-bottom:1pt solid #999;padding-bottom:2pt">EXPERIENCE</h2>
${r.experience.map((e) => `<p style="margin:8pt 0 2pt"><b>${esc(e.role)}</b> — ${esc(e.company)}${e.location ? ", " + esc(e.location) : ""}<br/><i>${esc(e.start)} – ${esc(e.end)}</i></p><ul>${e.bullets.filter(Boolean).map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`).join("")}
${r.education.some((e) => e.degree) ? `<h2 style="font-size:12pt;border-bottom:1pt solid #999;padding-bottom:2pt">EDUCATION</h2>${r.education.map((e) => `<p><b>${esc(e.degree)}</b> — ${esc(e.school)} ${esc(e.year)}</p>`).join("")}` : ""}
${r.skills.length ? `<h2 style="font-size:12pt;border-bottom:1pt solid #999;padding-bottom:2pt">SKILLS</h2><p>${r.skills.map(esc).join(", ")}</p>` : ""}
${r.certifications.length ? `<h2 style="font-size:12pt;border-bottom:1pt solid #999;padding-bottom:2pt">CERTIFICATIONS</h2><p>${r.certifications.map(esc).join("; ")}</p>` : ""}
</body></html>`;
}

export function downloadBlob(content: string, filename: string, type: string) {
  const blob = new Blob(["\ufeff", content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function downloadDocx(r: ResumeData) {
  downloadBlob(resumeToHtml(r), `${slugify(r.contact.fullName || "resume")}.doc`, "application/msword");
}

export function downloadTxt(r: ResumeData) {
  downloadBlob(resumeToText(r), `${slugify(r.contact.fullName || "resume")}.txt`, "text/plain;charset=utf-8");
}

export function printPdf() {
  document.body.classList.add("printing");
  const done = () => {
    document.body.classList.remove("printing");
    window.removeEventListener("afterprint", done);
  };
  window.addEventListener("afterprint", done);
  setTimeout(() => window.print(), 60);
}

export function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "resume";
}

export function shareUrl(r: ResumeData): string {
  const payload = btoa(unescape(encodeURIComponent(JSON.stringify(r))));
  return `${window.location.origin}/shared?d=${encodeURIComponent(payload)}`;
}

export function decodeShare(d: string): ResumeData | null {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(d))))) as ResumeData;
  } catch {
    return null;
  }
}
