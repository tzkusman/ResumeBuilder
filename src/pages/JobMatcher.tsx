import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Icon, Seo, Gauge } from "../components/ui";
import { useResume } from "../store/AppStore";

export default function JobMatcherPage() {
  const { resume } = useResume();
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Helper to load text from current active resume in store
  const handleLoadFromStore = () => {
    const parts: string[] = [];
    if (resume.contact.fullName) parts.push(resume.contact.fullName);
    if (resume.contact.title) parts.push(resume.contact.title);
    if (resume.summary) parts.push(resume.summary);
    if (resume.skills?.length) parts.push("Skills: " + resume.skills.join(", "));
    if (resume.experience?.length) {
      resume.experience.forEach((e) => {
        parts.push(`${e.role} at ${e.company}`);
        parts.push(...(e.bullets || []));
      });
    }
    if (resume.education?.length) {
      resume.education.forEach((ed) => parts.push(`${ed.degree} - ${ed.school}`));
    }
    if (resume.projects?.length) {
      resume.projects.forEach((p) => {
        parts.push(`${p.title}: ${p.subtitle || ""}`);
        if (p.bullets) parts.push(...p.bullets);
      });
    }
    setResumeText(parts.join("\n"));
  };

  // Sample sample job description for instant demo
  const handleLoadSampleJob = () => {
    setJobDescription(`Senior Full-Stack Engineer
Responsibilities:
- Architect and scale distributed cloud microservices using Node.js, TypeScript, React, and PostgreSQL.
- Lead CI/CD release automation with Docker, Kubernetes, and AWS (ECS, RDS, S3).
- Spearhead performance optimization, lowering API latency and handling high-concurrency traffic.
- Collaborate closely with product managers, UX designers, and data engineers in an Agile environment.
- Champion code quality, unit testing, automated end-to-end test coverage, and security compliance.
Requirements:
- 5+ years of software engineering experience with modern JavaScript / TypeScript.
- Strong proficiency in React, GraphQL, REST APIs, Tailwind CSS, and state management.
- Hands-on experience with cloud architecture on AWS or GCP.
- Demonstrated ability to mentor junior engineers and drive technical roadmaps.`);
  };

  // Analysis engine
  const analysis = useMemo(() => {
    if (!jobDescription.trim() || !resumeText.trim()) return null;

    const jdTokens = jobDescription.toLowerCase();
    const cvTokens = resumeText.toLowerCase();

    // Standard vocabulary lists
    const technicalKeywords = [
      "typescript", "javascript", "react", "node.js", "nodejs", "python", "sql", "postgresql",
      "aws", "gcp", "azure", "docker", "kubernetes", "ci/cd", "microservices", "graphql",
      "rest api", "tailwind", "redis", "mongodb", "git", "linux", "testing", "agile",
      "architecture", "performance", "security", "distributed systems", "database", "analytics"
    ];

    const softSkills = [
      "leadership", "communication", "mentorship", "collaboration", "cross-functional",
      "problem solving", "strategic", "initiative", "stakeholder", "ownership", "agile", "time management"
    ];

    // Find keywords mentioned in job description
    const jdTechFound = technicalKeywords.filter((kw) => jdTokens.includes(kw));
    const jdSoftFound = softSkills.filter((kw) => jdTokens.includes(kw));

    // Check which ones are present in resume
    const matchedTech = jdTechFound.filter((kw) => cvTokens.includes(kw));
    const missingTech = jdTechFound.filter((kw) => !cvTokens.includes(kw));

    const matchedSoft = jdSoftFound.filter((kw) => cvTokens.includes(kw));
    const missingSoft = jdSoftFound.filter((kw) => !cvTokens.includes(kw));

    // Numbers & Metrics check
    const numbersCount = (resumeText.match(/\b\d+(\.\d+)?%?|\$\d+/g) || []).length;
    const hasSufficientMetrics = numbersCount >= 5;

    // Action verbs check
    const commonVerbs = ["spearheaded", "architected", "engineered", "automated", "optimized", "orchestrated", "led", "developed", "reduced", "increased"];
    const verbsFound = commonVerbs.filter((v) => cvTokens.includes(v));

    // Calculate match score
    const totalJdKeywords = jdTechFound.length + jdSoftFound.length;
    const totalMatched = matchedTech.length + matchedSoft.length;

    let matchPercentage = totalJdKeywords > 0 ? Math.round((totalMatched / totalJdKeywords) * 85) : 50;
    if (hasSufficientMetrics) matchPercentage += 10;
    if (verbsFound.length >= 3) matchPercentage += 5;
    matchPercentage = Math.min(Math.max(matchPercentage, 15), 98);

    return {
      matchPercentage,
      matchedTech,
      missingTech,
      matchedSoft,
      missingSoft,
      numbersCount,
      verbsFound,
      totalKeywordsDetected: totalJdKeywords
    };
  }, [jobDescription, resumeText]);

  const copyText = (t: string) => {
    navigator.clipboard.writeText(t);
    setCopiedText(t);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="min-h-screen bg-paper pb-24">
      <Seo
        title="ATS Job Description Keyword Matcher & Resume Scanner | ResumeBuild"
        description="Scan and compare your resume directly against any job description. Uncover missing ATS keywords, calculate your match rate, and get suggested achievement bullets."
        path="/job-matcher"
      />

      {/* Header */}
      <section className="border-b-2 border-ink bg-card py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 border border-ink/20 bg-acid/40 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-pine-deep">
            <Icon name="target" size={14} /> Targeted ATS Keyword Matcher
          </div>
          <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Match Your Resume to Any <span className="text-pine">Job Description</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base text-ink-soft sm:text-lg">
            Paste a job posting from LinkedIn, Indeed, or Greenhouse. Our parser scans keyword frequency, extracts required technical proficiencies, and highlights missing ATS tokens before you hit submit.
          </p>
        </div>
      </section>

      {/* Input Workspace */}
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Job Description Column */}
          <div className="flex flex-col border-2 border-ink bg-card p-6 shadow-[4px_4px_0_0_var(--color-ink)]">
            <div className="flex items-center justify-between pb-3 border-b border-ink/15">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-pine">
                1. Target Job Description
              </span>
              <button
                type="button"
                onClick={handleLoadSampleJob}
                className="font-mono text-[11px] font-semibold text-ink-soft hover:text-ink underline"
              >
                Load Sample Tech Job
              </button>
            </div>
            <p className="mt-2 text-xs text-ink-soft">
              Paste the entire job posting including responsibilities and requirements:
            </p>
            <textarea
              value={jobDescription}
              onChange={(e) => { setJobDescription(e.target.value); setIsAnalyzed(false); }}
              placeholder="Paste job description here (e.g. from LinkedIn, Indeed, Workday)..."
              rows={12}
              className="mt-3 w-full border border-ink/25 bg-white p-3 font-mono text-xs leading-relaxed focus:border-pine focus:outline-none transition-colors"
            />
          </div>

          {/* Resume Text Column */}
          <div className="flex flex-col border-2 border-ink bg-card p-6 shadow-[4px_4px_0_0_var(--color-ink)]">
            <div className="flex items-center justify-between pb-3 border-b border-ink/15">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-pine">
                2. Your Resume Content
              </span>
              <button
                type="button"
                onClick={handleLoadFromStore}
                className="border border-ink/30 bg-acid px-2.5 py-0.5 font-mono text-[11px] font-bold text-ink hover:bg-paper transition-colors"
              >
                + Load Active Builder CV
              </button>
            </div>
            <p className="mt-2 text-xs text-ink-soft">
              Paste your experience, summary, and skills, or import your current resume from the builder:
            </p>
            <textarea
              value={resumeText}
              onChange={(e) => { setResumeText(e.target.value); setIsAnalyzed(false); }}
              placeholder="Paste your resume content or click '+ Load Active Builder CV' above..."
              rows={12}
              className="mt-3 w-full border border-ink/25 bg-white p-3 font-mono text-xs leading-relaxed focus:border-pine focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsAnalyzed(true)}
            disabled={!jobDescription.trim() || !resumeText.trim()}
            className="border-2 border-ink bg-acid px-8 py-3 font-mono text-xs font-bold uppercase tracking-wider text-ink shadow-[4px_4px_0_0_var(--color-ink)] transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
          >
            Calculate ATS Keyword Match Score →
          </button>
        </div>

        {/* Results Section */}
        {isAnalyzed && analysis && (
          <div className="mt-14 space-y-10 border-2 border-ink bg-card p-6 sm:p-10 shadow-[6px_6px_0_0_var(--color-ink)]">
            <div className="flex flex-col items-center justify-between gap-6 border-b-2 border-ink pb-8 md:flex-row">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-pine">
                  Analysis Complete
                </span>
                <h2 className="mt-1 font-display text-3xl font-black text-ink">
                  Job Match Score: {analysis.matchPercentage}%
                </h2>
                <p className="mt-1 text-sm text-ink-soft max-w-lg">
                  {analysis.matchPercentage >= 75
                    ? "Excellent match! Your resume contains high alignment with target keywords and measurable outcomes."
                    : analysis.matchPercentage >= 50
                    ? "Moderate match. Incorporating the missing keywords below will significantly increase recruiter search visibility."
                    : "Low keyword density. Your resume is missing crucial technical and domain phrases found in the posting."}
                </p>
              </div>

              <div className="shrink-0">
                <Gauge value={analysis.matchPercentage} size={140} label="Match Score" />
              </div>
            </div>

            {/* Keyword Comparison Grid */}
            <div className="grid gap-8 md:grid-cols-2">
              {/* Missing Keywords Box */}
              <div className="border border-coral/40 bg-coral-soft/15 p-6">
                <h3 className="flex items-center gap-2 font-display text-lg font-bold text-coral">
                  <span className="text-xl">⚠️</span> Missing Keywords from Job Description
                </h3>
                <p className="mt-1 text-xs text-ink-soft">
                  ATS screeners filter by these terms. Add them to your skills or weave them into your experience bullets:
                </p>

                <div className="mt-4">
                  <span className="font-mono text-[11px] font-bold uppercase text-ink-soft block mb-1.5">
                    Technical Skills ({analysis.missingTech.length}):
                  </span>
                  {analysis.missingTech.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.missingTech.map((kw) => (
                        <button
                          key={kw}
                          onClick={() => copyText(kw)}
                          className="border border-coral/50 bg-white px-2.5 py-1 font-mono text-xs font-semibold text-coral hover:bg-coral-soft transition-colors"
                          title="Click to copy keyword"
                        >
                          + {kw} {copiedText === kw && "✓"}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-pine font-medium">All detected technical requirements are present! ✓</p>
                  )}
                </div>

                <div className="mt-4">
                  <span className="font-mono text-[11px] font-bold uppercase text-ink-soft block mb-1.5">
                    Core Soft Skills ({analysis.missingSoft.length}):
                  </span>
                  {analysis.missingSoft.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.missingSoft.map((kw) => (
                        <button
                          key={kw}
                          onClick={() => copyText(kw)}
                          className="border border-coral/50 bg-white px-2.5 py-1 font-mono text-xs font-semibold text-coral hover:bg-coral-soft transition-colors"
                          title="Click to copy keyword"
                        >
                          + {kw} {copiedText === kw && "✓"}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-pine font-medium">All detected soft competencies are matched! ✓</p>
                  )}
                </div>
              </div>

              {/* Matched Keywords Box */}
              <div className="border border-pine/40 bg-acid/20 p-6">
                <h3 className="flex items-center gap-2 font-display text-lg font-bold text-pine">
                  <span className="text-xl">✓</span> Matched Keywords Found
                </h3>
                <p className="mt-1 text-xs text-ink-soft">
                  These terms from the job posting are successfully identified in your document:
                </p>

                <div className="mt-4">
                  <span className="font-mono text-[11px] font-bold uppercase text-ink-soft block mb-1.5">
                    Matched Competencies ({analysis.matchedTech.length + analysis.matchedSoft.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[...analysis.matchedTech, ...analysis.matchedSoft].map((kw) => (
                      <span
                        key={kw}
                        className="border border-pine/50 bg-white px-2.5 py-1 font-mono text-xs font-semibold text-pine"
                      >
                        ✓ {kw}
                      </span>
                    ))}
                    {analysis.matchedTech.length === 0 && analysis.matchedSoft.length === 0 && (
                      <p className="text-xs text-ink-soft">No direct keyword matches detected.</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 border-t border-ink/10 pt-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-ink-soft">Quantifiable Metrics Count:</span>
                    <span className={`font-bold ${analysis.numbersCount >= 5 ? "text-pine" : "text-coral"}`}>
                      {analysis.numbersCount} numbers found {analysis.numbersCount >= 5 ? "(Strong)" : "(Add more % or $)"}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs font-mono">
                    <span className="text-ink-soft">Decisive Action Verbs:</span>
                    <span className="font-bold text-ink">{analysis.verbsFound.length} power verbs detected</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Suggested Tailored Bullet Points */}
            <div className="border border-ink/20 bg-paper p-6">
              <h3 className="font-display text-lg font-bold text-ink">
                Suggested Achievement Bullets for this Job Description
              </h3>
              <p className="mt-1 text-xs text-ink-soft">
                Copy and personalize these bullet point templates to inject your missing target keywords with measurable metrics:
              </p>

              <div className="mt-4 space-y-3">
                {analysis.missingTech.slice(0, 3).map((kw, i) => {
                  const bullet = `Spearheaded implementation of ${kw.toUpperCase()} within core architecture, reducing cycle latency by 32% and scaling to 500k+ monthly requests.`;
                  return (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-ink/15 bg-white p-3">
                      <p className="font-mono text-xs text-ink leading-relaxed">
                        • {bullet}
                      </p>
                      <button
                        onClick={() => copyText(bullet)}
                        className="shrink-0 border border-ink bg-acid px-3 py-1 font-mono text-[11px] font-bold text-ink hover:bg-paper transition-colors"
                      >
                        {copiedText === bullet ? "Copied! ✓" : "Copy"}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-4">
                <span className="text-xs text-ink-soft font-mono">
                  Ready to apply these keywords to your master resume?
                </span>
                <Link
                  to="/builder"
                  className="inline-flex items-center gap-2 border-2 border-ink bg-ink px-5 py-2 font-mono text-xs font-bold uppercase text-acid hover:-translate-y-0.5 transition-transform"
                >
                  Edit in Resume Builder <Icon name="arrow" size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
