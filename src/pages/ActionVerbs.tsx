import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Icon, Seo } from "../components/ui";
import { ACTION_VERBS_DATA } from "../data/actionVerbs";

export default function ActionVerbsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [copiedVerb, setCopiedVerb] = useState<string | null>(null);

  const categories = ["All", ...ACTION_VERBS_DATA.map((c) => c.category)];

  const filteredGroups = useMemo(() => {
    return ACTION_VERBS_DATA.map((group) => {
      const matchesCategory = activeCategory === "All" || group.category === activeCategory;
      if (!matchesCategory) return { ...group, verbs: [] };

      const q = search.toLowerCase().trim();
      if (!q) return group;

      const filtered = group.verbs.filter(
        (v) =>
          v.verb.toLowerCase().includes(q) ||
          v.definition.toLowerCase().includes(q) ||
          v.strongExample.toLowerCase().includes(q) ||
          v.keywords.some((k) => k.toLowerCase().includes(q))
      );

      return { ...group, verbs: filtered };
    }).filter((group) => group.verbs.length > 0);
  }, [search, activeCategory]);

  const copyToClipboard = (text: string, verb: string) => {
    navigator.clipboard.writeText(text);
    setCopiedVerb(verb);
    setTimeout(() => setCopiedVerb(null), 2500);
  };

  const totalVerbsCount = filteredGroups.reduce((acc, g) => acc + g.verbs.length, 0);

  return (
    <div className="min-h-screen bg-paper pb-24">
      <Seo
        title="250+ Powerful Resume Action Verbs by Category (2026 Guide)"
        description="Replace weak passive verbs with high-impact power words. Browse categorized action verbs for leadership, engineering, sales, and operations with before/after bullet examples."
        path="/action-verbs"
      />

      {/* Header */}
      <section className="border-b-2 border-ink bg-card py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 border border-ink/20 bg-acid/40 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-pine-deep">
            <Icon name="sparkle" size={14} /> Resume Power Words Directory
          </div>
          <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-ink sm:text-5xl lg:text-6xl">
            250+ High-Impact <span className="text-pine">Action Verbs</span> for Your Resume
          </h1>
          <p className="mt-4 max-w-2xl text-base text-ink-soft sm:text-lg">
            Stop saying "responsible for" or "helped with". Elevate your CV bullet points with decisive action verbs paired with quantifiable metric formulas.
          </p>

          {/* Search & Category Filter */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-soft">
                <Icon name="search" size={16} />
              </span>
              <input
                type="text"
                placeholder="Search verbs, keywords, or examples..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border-2 border-ink bg-white py-2.5 pl-10 pr-4 text-sm font-medium transition-colors placeholder:text-ink-soft/60 focus:border-pine focus:outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute inset-y-0 right-3 flex items-center text-xs font-bold text-ink-soft hover:text-ink"
                >
                  ✕
                </button>
              )}
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

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <p className="font-mono text-xs font-bold uppercase text-ink-soft">
            Showing <span className="text-pine font-black">{totalVerbsCount}</span> Action Verbs
          </p>
          <Link
            to="/builder"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-pine hover:underline"
          >
            Apply to your resume in Builder →
          </Link>
        </div>

        {filteredGroups.length === 0 ? (
          <div className="border-2 border-dashed border-ink/30 bg-card p-12 text-center">
            <Icon name="search" size={32} className="mx-auto text-ink-soft/60" />
            <p className="mt-4 font-display text-lg font-bold text-ink">No action verbs found</p>
            <p className="mt-1 text-sm text-ink-soft">Try searching for a different keyword or resetting filters.</p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("All"); }}
              className="mt-4 border-2 border-ink bg-acid px-4 py-2 font-mono text-xs font-bold text-ink"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredGroups.map((group) => (
              <section key={group.category} className="space-y-4">
                <div className="border-b-2 border-ink pb-2">
                  <h2 className="font-display text-2xl font-black text-ink">{group.category}</h2>
                  <p className="text-xs text-ink-soft font-mono mt-0.5">{group.description}</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {group.verbs.map((item) => (
                    <div
                      key={item.verb}
                      className="border-2 border-ink bg-card p-6 shadow-[4px_4px_0_0_var(--color-ink)] transition-all hover:shadow-[6px_6px_0_0_var(--color-ink)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="font-display text-2xl font-black text-pine">{item.verb}</span>
                          <p className="mt-1 text-xs text-ink font-medium leading-relaxed">{item.definition}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(item.strongExample, item.verb)}
                          className="shrink-0 border border-ink bg-paper px-2.5 py-1 font-mono text-[11px] font-bold text-ink hover:bg-acid transition-colors"
                          title="Copy metric bullet formula"
                        >
                          {copiedVerb === item.verb ? "Copied! ✓" : "Copy Bullet"}
                        </button>
                      </div>

                      {/* Weak vs Strong comparison */}
                      <div className="mt-4 space-y-2.5">
                        <div className="border border-coral/30 bg-coral-soft/20 p-2.5 text-xs">
                          <span className="font-mono text-[10px] font-bold uppercase text-coral block mb-0.5">
                            ✗ Passive / Weak:
                          </span>
                          <p className="text-ink-soft italic">"{item.weakExample}"</p>
                        </div>

                        <div className="border border-pine/40 bg-acid/20 p-2.5 text-xs">
                          <span className="font-mono text-[10px] font-bold uppercase text-pine block mb-0.5">
                            ✓ High-Impact / Quantified:
                          </span>
                          <p className="text-ink font-medium">"{item.strongExample}"</p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-1.5 border-t border-ink/10 pt-3">
                        {item.keywords.map((k) => (
                          <span key={k} className="border border-ink/15 bg-paper px-2 py-0.5 font-mono text-[10px] text-ink-soft">
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Builder Hook Section */}
        <section className="mt-16 border-2 border-ink bg-acid p-8 text-center sm:p-12 shadow-[6px_6px_0_0_var(--color-ink)]">
          <h2 className="font-display text-2xl font-black text-ink sm:text-3xl">
            Auto-Inject Action Verbs Directly into Your Work History
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft">
            In ResumeBuild, you can click any "+Verb" quick tag in the experience editor to instantly prepend strong action words with dynamic rotating formulas.
          </p>
          <div className="mt-6">
            <Link
              to="/builder"
              className="inline-flex items-center gap-2 border-2 border-ink bg-ink px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-acid shadow-md transition-transform hover:-translate-y-0.5"
            >
              Open Builder with Action Formulas <Icon name="arrow" size={14} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
