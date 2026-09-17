import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon, Seo } from "../components/ui";
import { COVER_LETTER_EXAMPLES, type CoverLetterExample } from "../data/coverLetters";

export default function CoverLetterExamplesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [selectedExample, setSelectedExample] = useState<CoverLetterExample>(COVER_LETTER_EXAMPLES[0]);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const categories = ["All", "Engineering & Tech", "Product & Design", "Sales & Marketing", "Operations & Finance", "Healthcare & Science"];

  const filteredExamples = useMemo(() => {
    return COVER_LETTER_EXAMPLES.filter((ex) => {
      const matchesCat = activeCategory === "All" || ex.category === activeCategory;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        ex.role.toLowerCase().includes(q) ||
        ex.company.toLowerCase().includes(q) ||
        ex.openingHook.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, search]);

  const handleCopy = (ex: CoverLetterExample) => {
    const fullText = `Dear ${ex.hiringManager},\n\n${ex.openingHook}\n\n${ex.bodyProof}\n\n${ex.closingCta}\n\nSincerely,\n[Your Name]`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleLoadIntoBuilder = (ex: CoverLetterExample) => {
    const params = new URLSearchParams({
      role: ex.role,
      company: ex.company,
      manager: ex.hiringManager,
      why: `${ex.openingHook}\n\n${ex.bodyProof}`
    });
    navigate(`/cover-letter?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-paper pb-24">
      <Seo
        title="12+ Proven Cover Letter Examples by Industry (2026 Guide) | ResumeBuild"
        description="Browse high-converting cover letter examples with proven hooks, quantifiable achievement paragraphs, and executive closings. Copy or customize in 1 click."
        path="/cover-letter-examples"
      />

      {/* Header */}
      <section className="border-b-2 border-ink bg-card py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 border border-ink/20 bg-acid/40 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-pine-deep">
            <Icon name="doc" size={14} /> High-Conversion Letter Library
          </div>
          <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Real <span className="text-pine">Cover Letter Examples</span> That Land Interviews
          </h1>
          <p className="mt-4 max-w-2xl text-base text-ink-soft sm:text-lg">
            No dry templates or generic openings. Each example follows our 3-paragraph value framework: a compelling hook, quantifiable metric proof, and a decisive call to action.
          </p>

          {/* Search & Categories */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-soft">
                <Icon name="search" size={16} />
              </span>
              <input
                type="text"
                placeholder="Search by role, company, or skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border-2 border-ink bg-white py-2.5 pl-10 pr-4 text-sm font-medium transition-colors placeholder:text-ink-soft/60 focus:border-pine focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`border px-3 py-1.5 font-mono text-xs font-bold transition-colors ${
                    activeCategory === cat
                      ? "border-ink bg-ink text-acid shadow-sm"
                      : "border-ink/25 bg-card text-ink-soft hover:border-ink hover:text-ink"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left: Examples List (5 cols) */}
          <div className="space-y-4 lg:col-span-5">
            <div className="flex items-center justify-between border-b border-ink/15 pb-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink-soft">
                Available Templates ({filteredExamples.length})
              </span>
              <span className="font-mono text-[11px] text-pine font-semibold">Select to Preview</span>
            </div>

            <div className="space-y-3">
              {filteredExamples.map((ex) => (
                <div
                  key={ex.id}
                  onClick={() => setSelectedExample(ex)}
                  className={`cursor-pointer border-2 p-4 transition-all ${
                    selectedExample.id === ex.id
                      ? "border-ink bg-acid/20 shadow-[4px_4px_0_0_var(--color-ink)]"
                      : "border-ink/20 bg-card hover:border-ink hover:bg-paper"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold text-pine uppercase tracking-wider">
                      {ex.category}
                    </span>
                    <span className="border border-ink/20 bg-card px-2 py-0.5 font-mono text-[10px] text-ink-soft">
                      {ex.level}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-base font-bold text-ink">{ex.role}</h3>
                  <p className="mt-1 text-xs text-ink-soft line-clamp-2">{ex.openingHook}</p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {ex.keyHighlights.slice(0, 2).map((h, i) => (
                      <span key={i} className="font-mono text-[10px] text-ink-soft/90 bg-white border border-ink/10 px-1.5 py-0.5">
                        • {h}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Full Document Preview (7 cols) */}
          <div className="lg:col-span-7">
            <div className="sticky top-24 border-2 border-ink bg-card p-6 sm:p-10 shadow-[6px_6px_0_0_var(--color-ink)]">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink pb-6">
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-pine">
                    {selectedExample.category} · {selectedExample.level}
                  </span>
                  <h2 className="mt-1 font-display text-2xl font-black text-ink">
                    {selectedExample.role}
                  </h2>
                  <p className="font-mono text-xs text-ink-soft mt-0.5">
                    Target: {selectedExample.company}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(selectedExample)}
                    className="border border-ink bg-white px-3 py-2 font-mono text-xs font-bold text-ink hover:bg-acid transition-colors"
                  >
                    {copied ? "Copied Full Letter! ✓" : "Copy Letter"}
                  </button>
                  <button
                    onClick={() => handleLoadIntoBuilder(selectedExample)}
                    className="border-2 border-ink bg-acid px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-ink hover:-translate-y-0.5 transition-transform"
                  >
                    Customize in Builder →
                  </button>
                </div>
              </div>

              {/* Letter Sheet Display */}
              <div className="mt-8 border border-ink/20 bg-white p-6 sm:p-8 font-serif text-sm leading-relaxed text-ink shadow-sm space-y-5">
                <div className="font-mono text-xs text-ink-soft space-y-0.5 not-italic pb-4 border-b border-ink/10">
                  <p className="font-bold text-ink">Recipient: {selectedExample.hiringManager}</p>
                  <p>{selectedExample.company}</p>
                  <p>Date: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                </div>

                <p className="font-bold">Dear {selectedExample.hiringManager},</p>

                {/* Paragraph 1: The Hook */}
                <div className="relative rounded p-2 transition-colors hover:bg-acid/20">
                  <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-wider text-pine">
                    [Paragraph 1: The Value Hook]
                  </span>
                  <p>{selectedExample.openingHook}</p>
                </div>

                {/* Paragraph 2: The Proof */}
                <div className="relative rounded p-2 transition-colors hover:bg-acid/20">
                  <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-wider text-pine">
                    [Paragraph 2: The Quantified Proof]
                  </span>
                  <p>{selectedExample.bodyProof}</p>
                </div>

                {/* Paragraph 3: The Closing */}
                <div className="relative rounded p-2 transition-colors hover:bg-acid/20">
                  <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-wider text-pine">
                    [Paragraph 3: Decisive Closing & Next Steps]
                  </span>
                  <p>{selectedExample.closingCta}</p>
                </div>

                <div className="pt-4">
                  <p>Sincerely,</p>
                  <p className="font-bold mt-2">[Your Full Name]</p>
                  <p className="font-mono text-xs text-ink-soft">[Your Phone Number] · [Your Email] · [Your LinkedIn]</p>
                </div>
              </div>

              {/* Key Impact Highlights */}
              <div className="mt-6 border border-ink/15 bg-paper p-4">
                <span className="font-mono text-[11px] font-bold uppercase text-pine block mb-2">
                  Key Metrics Demonstrated in this Letter:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedExample.keyHighlights.map((h, i) => (
                    <span key={i} className="border border-ink/20 bg-white px-2.5 py-1 font-mono text-xs font-semibold text-ink">
                      ✓ {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
