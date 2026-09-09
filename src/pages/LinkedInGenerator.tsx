import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Icon, Reveal, Seo, Kicker, Chip } from "../components/ui";
import { useToast } from "../store/AppStore";

type Tone = "executive" | "tech" | "growth" | "human";

interface GeneratedHeadline {
  style: string;
  headline: string;
  charCount: number;
}

export default function LinkedInGenerator() {
  const { toast } = useToast();

  const [role, setRole] = useState("Senior Full-Stack Engineer");
  const [industry, setIndustry] = useState("B2B SaaS & Cloud Infrastructure");
  const [yearsXp, setYearsXp] = useState("7");
  const [skills, setSkills] = useState("React, TypeScript, Node.js, AWS, Kubernetes, Distributed Systems");
  const [metric, setMetric] = useState("Cut p95 API latency by 45% & scaled microservices to 3M+ DAU");
  const [tone, setTone] = useState<Tone>("tech");

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (text: string, key: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedKey(key);
    toast("Copied to clipboard!", "ok");
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Generate dynamic headlines
  const headlines: GeneratedHeadline[] = useMemo(() => {
    const primarySkills = skills.split(",").map((s) => s.trim()).filter(Boolean);
    const topSkills = primarySkills.slice(0, 3).join(" | ");

    const list: { style: string; headline: string }[] = [
      {
        style: "Recruiter Search Formula (High SEO CTR)",
        headline: `${role} | ${topSkills} | Scaling ${industry}`.slice(0, 220)
      },
      {
        style: "Metric & Value Proposition Driven",
        headline: `${role} @ High-Growth Tech | Ex-Scale | ${metric} | ${primarySkills[0] || "Architecture"}`.slice(0, 220)
      },
      {
        style: "Senior Executive & Domain Authority",
        headline: `${role} specializing in ${industry} | Building resilient systems that drive revenue & scale`.slice(0, 220)
      },
      {
        style: "Modern Builder & Agency",
        headline: `${role} | Solving high-throughput problems with ${primarySkills.slice(0, 2).join(" & ")} | ${yearsXp}+ yrs scaling products`.slice(0, 220)
      },
      {
        style: "Problem-Solver Hook",
        headline: `Helping teams scale: ${role} | ${topSkills} | Passionate about developer velocity & clean architecture`.slice(0, 220)
      }
    ];

    return list.map((h) => ({
      ...h,
      charCount: h.headline.length
    }));
  }, [role, industry, yearsXp, skills, metric]);

  const [selectedHeadlineIdx, setSelectedHeadlineIdx] = useState(0);
  const activeHeadline = headlines[selectedHeadlineIdx]?.headline || headlines[0]?.headline;

  // Generate 3 About Summaries
  const summaries = useMemo(() => {
    const skillList = skills.split(",").map((s) => s.trim()).filter(Boolean);

    return [
      {
        id: "narrative",
        title: "The Narrative Hook & Impact Story",
        desc: "Best for engaging recruiters who read top-to-bottom; personal, authentic, and high-context.",
        text: `I build software where milliseconds and high concurrency matter.

Over the past ${yearsXp}+ years working in ${industry}, I've focused on taking complex backend bottlenecks and transforming them into resilient, high-throughput engines. My core driver is simple: build clean, maintainable architecture that accelerates team velocity and keeps customer trust.

Key career highlights:
• ${metric}
• Architected and shipped products leveraging ${skillList.slice(0, 4).join(", ")}
• Mentored cross-functional engineering squads and introduced rigorous automated testing and CI/CD pipelines

Core competencies:
${skillList.map((s) => `• ${s}`).join("\n")}

Always excited to connect with engineering leaders, startup founders, and teams solving ambitious technical problems. Feel free to reach out directly here or send an InMail.`
      },
      {
        id: "executive",
        title: "The Executive & Quantified Results Summary",
        desc: "Best for Directors, Staff/Lead engineers, and competitive corporate roles looking for business impact.",
        text: `${role} with ${yearsXp}+ years of hands-on experience guiding product and architectural execution across ${industry}.

Known for bridging executive business objectives with technical engineering delivery. Consistent track record of driving operational efficiency, cutting cloud infrastructure overhead, and scaling reliable systems.

MEASURABLE IMPACT:
✓ ${metric}
✓ Led end-to-end architecture across distributed systems and modern cloud environments
✓ Partnered directly with Product, Design, and GTM leaders to consistently ship roadmap milestones ahead of schedule

CORE SPECIALTIES:
${skillList.slice(0, 8).join(" · ")}

If you are scaling a technical organization or looking for senior engineering leadership, let's start a conversation.`
      },
      {
        id: "modern",
        title: "The Clean Bulleted Highlight Summary",
        desc: "Skimmable format designed for mobile viewers and rapid 5-second recruiter scans.",
        text: `TL;DR: ${role} with ${yearsXp}+ years of experience building scalable systems in ${industry}.

What I bring to the table:
▸ Deep technical domain expertise across ${skillList.slice(0, 3).join(", ")}
▸ Proven track record: ${metric}
▸ Strong ownership mindset from architecture design docs to production telemetry and on-call resilience

Technical Stack & Toolkit:
${skillList.map((s) => `[ ${s} ]`).join("  ")}

Currently open to exciting conversations around senior roles and technical leadership. Send a message to connect.`
      }
    ];
  }, [role, industry, yearsXp, skills, metric]);

  const [activeSummaryTab, setActiveSummaryTab] = useState(0);

  // Suggested LinkedIn Skills for algorithm
  const suggestedSkills = useMemo(() => {
    const raw = skills.split(",").map((s) => s.trim()).filter(Boolean);
    const standard = ["System Architecture", "Cross-Functional Leadership", "Agile Methodologies", "Performance Optimization"];
    return Array.from(new Set([...raw, ...standard]));
  }, [skills]);

  return (
    <>
      <Seo
        title="LinkedIn Headline & Summary Generator (2026) | ResumeBuild"
        description="Free LinkedIn Profile Optimizer: Generate high-CTR recruiter headlines under 220 characters and 3 tailored 'About' summaries with proven keyword density."
        path="/linkedin-generator"
      />

      {/* Hero */}
      <section className="dotgrid border-b-2 border-ink">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <Reveal>
            <Kicker className="text-pine">Recruiter Search Optimization · Free Tool</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-black leading-[1.06] tracking-tight sm:text-6xl">
              Turn your LinkedIn profile into an <em className="text-pine">inbound interview magnet</em>.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-5 max-w-2xl text-lg text-ink-soft">
              Recruiters use LinkedIn search filters every day. Generate keyword-rich, high-CTR headlines under the 220-character limit
              and compelling "About" summaries with one click.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Main Tool Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          {/* Input Panel */}
          <div className="space-y-5">
            <div className="border-2 border-ink bg-card p-6">
              <h2 className="font-display text-xl font-black text-ink">Your Profile Details</h2>
              <p className="mt-1 text-xs text-ink-soft">Enter your target details to customize headlines and summaries:</p>

              <div className="mt-4 space-y-3.5">
                <label className="block">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-soft">Target Job Title</span>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-1 w-full border border-ink/25 bg-white px-3 py-2 text-sm font-semibold focus:border-pine focus:outline-none"
                    placeholder="e.g. Senior Product Manager"
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-soft">Years of Experience</span>
                    <input
                      type="text"
                      value={yearsXp}
                      onChange={(e) => setYearsXp(e.target.value)}
                      className="mt-1 w-full border border-ink/25 bg-white px-3 py-2 text-sm font-semibold focus:border-pine focus:outline-none"
                      placeholder="e.g. 6"
                    />
                  </label>

                  <label className="block">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-soft">Industry / Niche</span>
                    <input
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="mt-1 w-full border border-ink/25 bg-white px-3 py-2 text-sm font-semibold focus:border-pine focus:outline-none"
                      placeholder="e.g. Fintech / B2B SaaS"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-soft">Core Hard Skills (comma-separated)</span>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="mt-1 w-full border border-ink/25 bg-white px-3 py-2 text-sm font-semibold focus:border-pine focus:outline-none"
                    placeholder="e.g. Python, SQL, Tableau, Predictive Modeling"
                  />
                </label>

                <label className="block">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-soft">Top Quantified Metric / Win</span>
                  <textarea
                    rows={2}
                    value={metric}
                    onChange={(e) => setMetric(e.target.value)}
                    className="mt-1 w-full border border-ink/25 bg-white px-3 py-2 text-sm font-semibold focus:border-pine focus:outline-none resize-none"
                    placeholder="e.g. Grew active customer accounts 140% and generated $2.4M ARR"
                  />
                </label>

                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-soft">Voice & Tone</span>
                  <div className="mt-1.5 grid grid-cols-2 gap-2">
                    {[
                      { id: "tech", label: "Modern & Builder" },
                      { id: "executive", label: "Executive Leadership" },
                      { id: "growth", label: "Revenue & Growth" },
                      { id: "human", label: "Story & Approachable" }
                    ].map((tOption) => (
                      <button
                        key={tOption.id}
                        type="button"
                        onClick={() => setTone(tOption.id as Tone)}
                        className={`border px-2.5 py-1.5 text-xs font-bold transition-colors ${
                          tone === tOption.id
                            ? "border-2 border-ink bg-ink text-acid"
                            : "border-ink/20 bg-white text-ink-soft hover:border-ink hover:text-ink"
                        }`}
                      >
                        {tOption.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* LinkedIn SEO Tips */}
            <div className="border-2 border-ink bg-acid-soft p-5">
              <div className="flex items-center gap-2">
                <Icon name="sparkle" size={16} className="text-pine" />
                <h3 className="font-display text-base font-black text-ink">LinkedIn Algorithm Rules</h3>
              </div>
              <ul className="mt-2.5 space-y-1.5 text-xs text-ink-soft">
                <li>• Keep headlines under 220 chars (ideal mobile cutoff is 180 chars).</li>
                <li>• Use pipe delimiters (|) or bullets (•) to separate skills for clean readability.</li>
                <li>• Put your primary role in the first 40 characters so mobile search previews show it.</li>
                <li>• Avoid vague buzzwords like "ninja", "rockstar", or "guru" that parsers discard.</li>
              </ul>
            </div>
          </div>

          {/* Results Column */}
          <div className="space-y-6">
            {/* Live Mockup Preview Card */}
            <div className="border-2 border-ink bg-white overflow-hidden shadow-[4px_6px_0_0_var(--color-ink)]">
              {/* LinkedIn Cover Banner Mockup */}
              <div className="h-24 bg-gradient-to-r from-ink via-pine-deep to-pine p-4 relative flex items-end justify-end">
                <span className="font-mono text-[10px] uppercase tracking-widest text-acid/80 bg-ink/70 px-2 py-0.5">
                  Live LinkedIn Profile Preview
                </span>
              </div>

              {/* Profile Card Body */}
              <div className="p-6 pt-0 relative">
                {/* Avatar Placeholder */}
                <div className="-mt-12 mb-3 flex items-end justify-between">
                  <div className="h-24 w-24 rounded-full border-4 border-white bg-line flex items-center justify-center font-display text-2xl font-black text-ink shadow-sm">
                    {role.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex gap-2">
                    <span className="border border-pine/30 bg-acid-soft px-3 py-1 font-mono text-[10.5px] font-bold text-pine-deep">
                      Open to Work
                    </span>
                  </div>
                </div>

                <h3 className="font-display text-xl font-black text-ink">Your Full Name</h3>
                <p className="mt-1 text-sm font-semibold text-ink leading-snug">
                  {activeHeadline}
                </p>
                <p className="mt-1 font-mono text-xs text-ink-soft">
                  United States · <span className="text-pine font-bold hover:underline cursor-pointer">500+ connections</span>
                </p>

                <div className="mt-4 flex gap-2 border-t border-ink/10 pt-3">
                  <button
                    onClick={() => copyText(activeHeadline, "preview-head")}
                    className="flex items-center gap-1.5 border-2 border-ink bg-acid px-3 py-1.5 text-xs font-bold text-ink hover:-translate-y-0.5 transition-transform"
                  >
                    <Icon name="copy" size={13} />
                    {copiedKey === "preview-head" ? "Copied!" : "Copy Active Headline"}
                  </button>
                  <Link
                    to="/builder"
                    className="flex items-center gap-1.5 border border-ink/25 bg-paper px-3 py-1.5 text-xs font-semibold text-ink hover:border-ink"
                  >
                    Sync with Resume Builder →
                  </Link>
                </div>
              </div>
            </div>

            {/* Generated Headlines List */}
            <div className="border-2 border-ink bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl font-black text-ink">5 High-CTR Recruiter Headlines</h3>
                  <p className="text-xs text-ink-soft">Click any headline to preview above or copy directly:</p>
                </div>
                <Chip className="text-pine-deep">&lt;220 Chars Safe</Chip>
              </div>

              <div className="mt-4 space-y-3">
                {headlines.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedHeadlineIdx(idx)}
                    className={`cursor-pointer border p-4 transition-all ${
                      selectedHeadlineIdx === idx
                        ? "border-2 border-ink bg-paper hs-acid"
                        : "border-ink/20 bg-white hover:border-ink"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-pine">
                        {item.style}
                      </span>
                      <span className="font-mono text-[10px] text-ink-soft">
                        {item.charCount} / 220 chars
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold text-ink leading-snug">{item.headline}</p>

                    <div className="mt-3 flex items-center justify-between border-t border-ink/10 pt-2">
                      <span className="text-[11px] font-bold text-ink-soft">
                        {selectedHeadlineIdx === idx ? "✓ Selected for Preview" : "Click to select"}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyText(item.headline, `head-${idx}`);
                        }}
                        className="flex items-center gap-1 border border-ink/25 bg-paper px-2 py-1 font-mono text-[10px] font-bold uppercase text-ink hover:border-ink"
                      >
                        <Icon name="copy" size={11} />
                        {copiedKey === `head-${idx}` ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LinkedIn 'About' Summaries */}
            <div className="border-2 border-ink bg-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl font-black text-ink">LinkedIn 'About' Summaries</h3>
                  <p className="text-xs text-ink-soft">Complete multi-paragraph summaries ready to paste:</p>
                </div>
                <div className="flex gap-1.5">
                  {summaries.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveSummaryTab(idx)}
                      className={`px-3 py-1.5 text-xs font-bold transition-colors ${
                        activeSummaryTab === idx
                          ? "border-2 border-ink bg-ink text-acid"
                          : "border border-ink/20 bg-white text-ink-soft hover:border-ink hover:text-ink"
                      }`}
                    >
                      Style {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Summary Container */}
              <div className="mt-4 border border-ink/20 bg-white p-5">
                <div className="flex items-start justify-between gap-3 border-b border-ink/10 pb-3">
                  <div>
                    <h4 className="font-display text-base font-bold text-ink">
                      {summaries[activeSummaryTab].title}
                    </h4>
                    <p className="text-xs text-ink-soft">{summaries[activeSummaryTab].desc}</p>
                  </div>
                  <button
                    onClick={() => copyText(summaries[activeSummaryTab].text, `sum-${activeSummaryTab}`)}
                    className="flex items-center gap-1.5 border-2 border-ink bg-acid px-3 py-1.5 text-xs font-bold text-ink hover:-translate-y-0.5 transition-transform"
                  >
                    <Icon name="copy" size={13} />
                    {copiedKey === `sum-${activeSummaryTab}` ? "Copied!" : "Copy Summary"}
                  </button>
                </div>

                <div className="mt-4 whitespace-pre-line text-xs font-sans leading-relaxed text-ink/90 bg-paper/50 p-4 border border-ink/10 font-medium">
                  {summaries[activeSummaryTab].text}
                </div>
              </div>
            </div>

            {/* High-Value Skills Checklist */}
            <div className="border-2 border-ink bg-card p-5">
              <h4 className="font-display text-base font-black text-ink">
                Recommended LinkedIn Skill Endorsement Keywords
              </h4>
              <p className="text-xs text-ink-soft mt-0.5">
                Add these exact terms to your LinkedIn Skills section so recruiters filtering by skill tags find you:
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {suggestedSkills.map((sk) => (
                  <span
                    key={sk}
                    onClick={() => copyText(sk, `sk-${sk}`)}
                    title="Click to copy"
                    className="cursor-pointer border border-ink/25 bg-white px-2.5 py-1 font-mono text-[11px] font-semibold text-ink hover:border-pine hover:bg-acid-soft transition-colors"
                  >
                    {copiedKey === `sk-${sk}` ? "Copied ✓" : `+ ${sk}`}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
