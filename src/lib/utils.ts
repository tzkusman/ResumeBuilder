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

export function resumeToHtml(r: ResumeData, forDocx = false): string {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const c = r.contact;
  const contactLine = [c.email, c.phone, c.location, c.website, c.linkedin].filter(Boolean).map(esc).join("  |  ");
  
  // Template-specific styles
  const templateStyles: Record<string, string> = {
    merit: `
      h1 { font-family: 'Georgia', serif; font-size: 24pt; margin: 0; color: #181d1a; }
      h2 { font-family: 'Courier New', monospace; font-size: 10pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.24em; color: ${r.accent}; border-bottom: 2px solid ${r.accent}; padding-bottom: 4pt; margin-top: 18pt; }
      .title { color: ${r.accent}; font-weight: 600; }
      .contact { font-size: 9pt; color: #555; }
      li { margin-left: 12pt; }
    `,
    atlas: `
      h1 { font-family: 'Arial Black', sans-serif; font-size: 22pt; margin: 0; text-transform: uppercase; letter-spacing: -0.02em; }
      h2 { font-family: 'Courier New', monospace; font-size: 9.5pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.26em; border-bottom: 1px solid #d0d0d0; padding-bottom: 3pt; }
      .title { color: ${r.accent}; font-weight: 600; font-size: 11pt; }
      .contact { font-size: 9pt; color: #555; gap: 12pt; }
      .top-bar { height: 12pt; background: ${r.accent}; margin-bottom: 18pt; }
      li { margin-left: 0; }
    `,
    craft: `
      h1 { font-family: 'Georgia', serif; font-size: 28pt; margin: 0; text-align: center; }
      h2 { font-family: 'Georgia', serif; font-size: 14pt; font-weight: bold; text-align: center; border-bottom: 2px solid ${r.accent}; padding-bottom: 4pt; margin: 18pt auto; max-width: 400px; }
      .title { color: ${r.accent}; font-weight: 600; font-size: 11pt; text-align: center; margin-top: 8pt; }
      .contact { font-size: 9pt; color: #555; justify-content: center; }
      li { margin-left: 18pt; }
      .section-content { max-width: 450pt; margin: 0 auto; text-align: left; }
    `,
    ledger: `
      .container { display: flex; }
      .sidebar { width: 180pt; background: ${r.accent}; color: white; padding: 30pt 18pt; }
      .main { flex: 1; padding: 30pt 24pt; }
      h1 { font-family: 'Arial Black', sans-serif; font-size: 22pt; margin: 0; line-height: 1.1; color: white; }
      .sidebar h2 { font-family: 'Courier New', monospace; font-size: 9pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.22em; opacity: 0.8; margin-top: 27pt; color: white; border-bottom: none; }
      .sidebar p { font-size: 9.5pt; line-height: 1.6; }
      .main h2 { font-family: 'Courier New', monospace; font-size: 10pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.24em; color: ${r.accent}; border-bottom: none; }
      .title { color: white; font-weight: 600; font-size: 11pt; opacity: 0.95; }
      .contact { font-size: 9pt; opacity: 0.95; line-height: 1.6; }
      .role { font-size: 11.5pt; font-weight: bold; }
      .company { color: ${r.accent}; font-weight: 600; }
      li { margin-left: 0; font-size: 10.5pt; }
    `
  };
  
  const isLedger = r.template === "ledger";
  const isCraft = r.template === "craft";
  const isAtlas = r.template === "atlas";
  
  if (forDocx) {
    // Enhanced DOCX format with full styling
    return `<html xmlns:w="urn:schemas-microsoft-com:office:word">
<head>
<meta charset="utf-8">
<title>${esc(c.fullName)} — Resume</title>
<style>
body { font-family: Calibri, Arial, sans-serif; color: #181d1a; font-size: 11pt; line-height: 1.45; max-width: 650pt; margin: 0 auto; }
${templateStyles[r.template]}
.contact { display: flex; flex-wrap: wrap; }
.role-line { display: flex; justify-content: space-between; align-items: baseline; margin: 14pt 0 4pt; }
.date { font-family: 'Courier New', monospace; font-size: 9pt; color: #666; }
.bullet-list { list-style: none; padding: 0; }
.bullet-list li { position: relative; padding-left: 14pt; margin: 3pt 0; }
.bullet-list li::before { content: "•"; position: absolute; left: 0; color: ${r.accent}; font-weight: bold; }
</style>
</head>
<body>
${isAtlas ? `<div class="top-bar"></div>` : ""}
${isLedger ? `
<div class="container">
<div class="sidebar">
<p style="font-family:'Courier New',monospace;font-size:9pt;text-transform:uppercase;letter-spacing:0.2em;opacity:0.8;margin:0">Curriculum Vitae</p>
<h1>${esc(c.fullName)}</h1>
<p class="title">${esc(c.title)}</p>
<p class="contact" style="display:block;margin-top:24pt">${[c.email, c.phone, c.location, c.website, c.linkedin].filter(Boolean).map(esc).join("<br/>")}</p>
${r.skills.length ? `<h2>Skills</h2><p>${r.skills.map(esc).join("<br/>")}</p>` : ""}
${r.education.some(e => e.degree) ? `<h2>Education</h2>${r.education.map(e => `<p><b>${esc(e.degree)}</b><br/>${esc(e.school)} ${esc(e.year)}</p>`).join("")}` : ""}
${r.certifications.length ? `<h2>Certifications</h2><p>${r.certifications.map(esc).join("<br/>")}</p>` : ""}
</div>
<div class="main">
` : ""}

${!isLedger && !isCraft ? `<h1>${esc(c.fullName)}</h1>` : ""}
${!isLedger ? `<p class="title">${esc(c.title)}</p>` : ""}
${!isLedger ? `<p class="contact">${contactLine}</p>` : ""}

${r.summary ? (!isLedger ? `<h2>Professional Summary</h2><p>${esc(r.summary)}</p>` : `<h2>Profile</h2><p>${esc(r.summary)}</p>`) : ""}

<h2>Experience</h2>
${r.experience.filter(e => e.role).map((e) => `
<div class="role-block" style="margin-bottom:18pt">
<div class="role-line">
<span class="role"><b>${esc(e.role)}</b>${e.company ? `<span class="company"> — ${esc(e.company)}</span>` : ""}${e.location ? `<span style="color:#666;font-weight:normal"> · ${esc(e.location)}</span>` : ""}</span>
${!isCraft ? `<span class="date">${esc(e.start)} – ${esc(e.end)}</span>` : ""}
</div>
${isCraft && (e.start || e.end) ? `<p style="text-align:center;font-family:'Courier New',monospace;font-size:9pt;color:#666">${esc(e.start)} – ${esc(e.end)}</p>` : ""}
<ul class="bullet-list">
${e.bullets.filter(Boolean).map((b) => `<li>${esc(b)}</li>`).join("")}
</ul>
</div>
`).join("")}

${r.education.some(e => e.degree) && !isLedger ? `<h2>Education</h2>${r.education.map((e) => `<p style="display:flex;justify-content:space-between;margin:6pt 0"><span><b>${esc(e.degree)}</b> — ${esc(e.school)}${e.location ? `, ${esc(e.location)}` : ""}</span><span style="font-family:'Courier New',monospace;font-size:9pt;color:#666">${esc(e.year)}</span></p>`).join("")}` : ""}

${r.skills.length && !isLedger ? `<h2>Skills</h2><p>${isAtlas ? r.skills.map(esc).join("  ·  ") : r.skills.map(esc).join(", ")}</p>` : ""}

${r.certifications.length && !isLedger ? `<h2>Certifications</h2><p>${r.certifications.map(esc).join("; ")}</p>` : ""}

${r.languages.length ? `<h2>Languages</h2><p>${r.languages.map(esc).join(", ")}</p>` : ""}

${isLedger ? `</div></div>` : ""}
</body></html>`;
  }
  
  // Original simple HTML for fallback
  return `<html xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>${esc(c.fullName)} — Resume</title></head>
<body style="font-family:Calibri,Arial,sans-serif;color:#181d1a;font-size:11pt;line-height:1.45">
<h1 style="font-size:20pt;margin:0">${esc(c.fullName)}</h1>
<p style="margin:2pt 0;color:#444">${esc(c.title)}</p>
<p style="margin:2pt 0;color:#555;font-size:10pt">${contactLine}</p>
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
  downloadBlob(resumeToHtml(r, true), `${slugify(r.contact.fullName || "resume")}.doc`, "application/msword");
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
