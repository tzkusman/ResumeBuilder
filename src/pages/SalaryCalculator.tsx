import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Icon, Reveal, Seo, Kicker, Chip } from "../components/ui";
import { SALARY_BENCHMARKS, METRO_LOCATIONS } from "../data/salaries";

export default function SalaryCalculator() {
  const [selectedRoleSlug, setSelectedRoleSlug] = useState<string>("software-engineer");
  const [selectedCity, setSelectedCity] = useState<string>("San Francisco Bay Area");
  const [selectedLevelIdx, setSelectedLevelIdx] = useState<number>(2); // Default to Senior
  const [activeTab, setActiveTab] = useState<"All" | string>("All");

  const benchmark = useMemo(() => {
    return SALARY_BENCHMARKS.find((b) => b.roleSlug === selectedRoleSlug) || SALARY_BENCHMARKS[0];
  }, [selectedRoleSlug]);

  const metro = useMemo(() => {
    return METRO_LOCATIONS.find((m) => m.city === selectedCity) || METRO_LOCATIONS[0];
  }, [selectedCity]);

  const level = benchmark.levels[selectedLevelIdx] || benchmark.levels[0];

  // Calculate adjusted numbers for chosen city
  const factor = metro.salaryMultiplier;
  const curr = metro.currencySymbol;

  const adjBaseP25 = Math.round((level.baseP25 * factor) / 1000) * 1000;
  const adjBaseMedian = Math.round((level.baseMedian * factor) / 1000) * 1000;
  const adjBaseP75 = Math.round((level.baseP75 * factor) / 1000) * 1000;
  const adjBaseP90 = Math.round((level.baseP90 * factor) / 1000) * 1000;

  const bonusAmount = Math.round((adjBaseMedian * (level.bonusPercent / 100)) / 500) * 500;
  const adjEquity = Math.round((level.equityAvgUsd * factor) / 1000) * 1000;
  const totalMedianComp = adjBaseMedian + bonusAmount + adjEquity;

  const categories = useMemo(() => {
    const set = new Set(SALARY_BENCHMARKS.map((b) => b.category));
    return ["All", ...Array.from(set)];
  }, []);

  const filteredRoles = useMemo(() => {
    if (activeTab === "All") return SALARY_BENCHMARKS;
    return SALARY_BENCHMARKS.filter((b) => b.category === activeTab);
  }, [activeTab]);

  return (
    <>
      <Seo
        title="2026 Salary Insights & Compensation Calculator | ResumeBuild"
        description="Calculate verified salary benchmarks, percentiles (25th, 50th, 75th, 90th), bonus and equity by role, city and seniority. Match your resume to top-tier compensation bands."
        path="/salary-calculator"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Occupation",
          name: benchmark.title,
          description: benchmark.description,
          estimatedSalary: [
            {
              "@type": "MonetaryAmountDistribution",
              name: "base",
              currency: metro.currency,
              median: adjBaseMedian,
              percentile25: adjBaseP25,
              percentile75: adjBaseP75,
              percentile90: adjBaseP90
            }
          ]
        }}
      />

      {/* Hero */}
      <section className="dotgrid border-b-2 border-ink">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <Reveal>
            <Kicker className="text-pine">Market Intelligence · Real Pay Bands</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-black leading-[1.06] tracking-tight sm:text-6xl">
              Know your exact market value <em className="text-pine">before</em> you apply.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-5 max-w-2xl text-lg text-ink-soft">
              Explore verified compensation percentiles across top metro hubs, seniority levels, and skill premiums.
              Pair your target numbers directly with recruiter-tested resume examples.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Main Interactive Tool */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          {/* Controls Column */}
          <div className="space-y-6">
            <div className="border-2 border-ink bg-card p-5">
              <h2 className="font-display text-xl font-black text-ink">Select Target Role</h2>
              <p className="mt-1 text-xs text-ink-soft">Filter by industry discipline and position:</p>

              {/* Category Filter */}
              <div className="mt-3 flex flex-wrap gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    className={`px-2 py-1 font-mono text-[10.5px] uppercase transition-colors ${
                      activeTab === cat
                        ? "border border-ink bg-ink text-acid"
                        : "border border-ink/20 bg-paper text-ink-soft hover:border-ink hover:text-ink"
                    }`}
                  >
                    {cat.split(" ")[0]}
                  </button>
                ))}
              </div>

              {/* Roles List */}
              <div className="mt-3 max-h-56 space-y-1.5 overflow-y-auto pr-1">
                {filteredRoles.map((role) => (
                  <button
                    key={role.roleSlug}
                    onClick={() => setSelectedRoleSlug(role.roleSlug)}
                    className={`flex w-full items-center justify-between border px-3 py-2 text-left text-xs font-bold transition-colors ${
                      selectedRoleSlug === role.roleSlug
                        ? "border-ink bg-acid-soft text-pine-deep"
                        : "border-ink/15 bg-white text-ink hover:border-ink"
                    }`}
                  >
                    <span>{role.title}</span>
                    <span className="font-mono text-[10px] text-ink-soft">${Math.round(role.nationalMedianUsd / 1000)}k</span>
                  </button>
                ))}
              </div>
            </div>

            {/* City & Metro Location */}
            <div className="border-2 border-ink bg-card p-5">
              <label className="block">
                <span className="font-display text-lg font-black text-ink">Location & Metro Area</span>
                <span className="mt-1 block text-xs text-ink-soft">Calibrated with cost of living indices and currency rates:</span>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="mt-3 w-full border-2 border-ink bg-white px-3 py-2.5 text-sm font-semibold text-ink focus:border-pine focus:outline-none"
                >
                  {METRO_LOCATIONS.map((loc) => (
                    <option key={loc.city} value={loc.city}>
                      {loc.city} ({loc.country}) · {loc.currency}
                    </option>
                  ))}
                </select>
              </label>

              <div className="mt-3 flex items-center justify-between border border-ink/15 bg-paper p-2.5 font-mono text-[11px]">
                <span className="text-ink-soft">COL Index:</span>
                <span className="font-bold text-ink">{metro.costOfLivingIndex} (Base 100)</span>
                <span className="text-ink-soft">Multiplier:</span>
                <span className="font-bold text-pine">{(metro.salaryMultiplier * 100).toFixed(0)}%</span>
              </div>
            </div>

            {/* Seniority Tier Selector */}
            <div className="border-2 border-ink bg-card p-5">
              <span className="font-display text-lg font-black text-ink">Experience & Seniority</span>
              <div className="mt-3 space-y-1.5">
                {benchmark.levels.map((lvl, idx) => (
                  <button
                    key={lvl.level}
                    onClick={() => setSelectedLevelIdx(idx)}
                    className={`flex w-full items-center justify-between border px-3 py-2 text-left text-xs font-bold transition-colors ${
                      selectedLevelIdx === idx
                        ? "border-2 border-ink bg-ink text-acid"
                        : "border-ink/20 bg-white text-ink-soft hover:border-ink hover:text-ink"
                    }`}
                  >
                    <span>{lvl.level}</span>
                    <span className="font-mono text-[11px]">
                      {curr}
                      {Math.round((lvl.baseMedian * factor) / 1000)}k
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="space-y-6">
            {/* Top Stat Card */}
            <div className="border-2 border-ink bg-paper p-6 hs-acid sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/15 pb-4">
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-pine">
                    {benchmark.category} · {metro.city}
                  </span>
                  <h2 className="mt-1 font-display text-2xl font-black text-ink sm:text-3xl">
                    {benchmark.title}
                  </h2>
                  <p className="mt-1 text-xs text-ink-soft">{level.level}</p>
                </div>
                <div className="text-right">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-ink-soft">Estimated Total Comp</span>
                  <span className="font-display text-3xl font-black text-pine sm:text-4xl">
                    {curr}
                    {totalMedianComp.toLocaleString()}
                  </span>
                  <span className="block font-mono text-[10.5px] text-ink-soft">per year</span>
                </div>
              </div>

              {/* Percentile Grid */}
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                    Base Salary Percentiles ({metro.currency})
                  </span>
                  <span className="font-mono text-[11px] text-pine font-bold">
                    Median: {curr}{adjBaseMedian.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="border border-ink/20 bg-white p-3 text-center">
                    <span className="block font-mono text-[10px] uppercase text-ink-soft">25th Percentile</span>
                    <span className="mt-1 block font-display text-xl font-bold text-ink">
                      {curr}{adjBaseP25.toLocaleString()}
                    </span>
                    <span className="mt-1 block text-[10px] text-ink-soft">Entry to Mid tier</span>
                  </div>
                  <div className="border-2 border-pine bg-acid-soft p-3 text-center">
                    <span className="block font-mono text-[10px] font-bold uppercase text-pine-deep">50th (Median)</span>
                    <span className="mt-1 block font-display text-xl font-black text-ink">
                      {curr}{adjBaseMedian.toLocaleString()}
                    </span>
                    <span className="mt-1 block text-[10px] font-bold text-pine">Target Baseline</span>
                  </div>
                  <div className="border border-ink/20 bg-white p-3 text-center">
                    <span className="block font-mono text-[10px] uppercase text-ink-soft">75th Percentile</span>
                    <span className="mt-1 block font-display text-xl font-bold text-ink">
                      {curr}{adjBaseP75.toLocaleString()}
                    </span>
                    <span className="mt-1 block text-[10px] text-ink-soft">Top Quartile</span>
                  </div>
                  <div className="border-2 border-ink bg-ink p-3 text-center text-paper">
                    <span className="block font-mono text-[10px] font-bold uppercase text-acid">90th Percentile</span>
                    <span className="mt-1 block font-display text-xl font-black text-paper">
                      {curr}{adjBaseP90.toLocaleString()}
                    </span>
                    <span className="mt-1 block text-[10px] text-acid">High Performers</span>
                  </div>
                </div>

                {/* Visual Bar Indicator */}
                <div className="mt-4 border border-ink bg-white p-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-ink-soft mb-1">
                    <span>{curr}{adjBaseP25.toLocaleString()}</span>
                    <span className="font-bold text-ink">50th: {curr}{adjBaseMedian.toLocaleString()}</span>
                    <span>{curr}{adjBaseP90.toLocaleString()}</span>
                  </div>
                  <div className="h-3 w-full border border-ink bg-line/50 overflow-hidden flex">
                    <div className="h-full bg-paper border-r border-ink" style={{ width: "25%" }} />
                    <div className="h-full bg-acid-soft border-r border-ink" style={{ width: "35%" }} />
                    <div className="h-full bg-pine border-r border-ink" style={{ width: "25%" }} />
                    <div className="h-full bg-ink" style={{ width: "15%" }} />
                  </div>
                </div>
              </div>

              {/* Compensation Breakdown */}
              <div className="mt-6 grid gap-4 border-t border-ink/15 pt-5 sm:grid-cols-3">
                <div className="flex items-start gap-3 border border-ink/15 bg-white p-3.5">
                  <span className="grid h-7 w-7 shrink-0 place-items-center border border-ink bg-acid text-ink">
                    <Icon name="check" size={14} />
                  </span>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">Base Salary</span>
                    <p className="font-display text-lg font-black text-ink">{curr}{adjBaseMedian.toLocaleString()}</p>
                    <p className="text-[10.5px] text-ink-soft">Guaranteed annual pay</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border border-ink/15 bg-white p-3.5">
                  <span className="grid h-7 w-7 shrink-0 place-items-center border border-ink bg-acid text-ink">
                    <Icon name="sparkle" size={14} />
                  </span>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">Target Annual Bonus</span>
                    <p className="font-display text-lg font-black text-ink">{curr}{bonusAmount.toLocaleString()}</p>
                    <p className="text-[10.5px] text-ink-soft">~{level.bonusPercent}% of base pay</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border border-ink/15 bg-white p-3.5">
                  <span className="grid h-7 w-7 shrink-0 place-items-center border border-ink bg-acid text-ink">
                    <Icon name="shield" size={14} />
                  </span>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">Equity / Stock Grant</span>
                    <p className="font-display text-lg font-black text-ink">{curr}{adjEquity.toLocaleString()}</p>
                    <p className="text-[10.5px] text-ink-soft">Estimated annual vest</p>
                  </div>
                </div>
              </div>
            </div>

            {/* High-Impact Skill Premiums */}
            <div className="border-2 border-ink bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl font-black text-ink">High-Impact Skill Premiums</h3>
                  <p className="text-xs text-ink-soft">Skills that elevate offers from median to the 75th/90th percentile:</p>
                </div>
                <Chip className="text-pine-deep">+10% to +25% Pay Bump</Chip>
              </div>

              <div className="mt-4 space-y-3">
                {benchmark.skillPremiums.map((sp) => (
                  <div key={sp.skill} className="flex items-start justify-between gap-4 border border-ink/15 bg-white p-3.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-ink">{sp.skill}</span>
                        <span className="border border-pine/30 bg-acid-soft px-1.5 py-0.5 font-mono text-[10px] font-bold text-pine-deep">
                          +{sp.premiumPercent}% Value
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-ink-soft leading-relaxed">{sp.impactDescription}</p>
                    </div>
                    <span className="shrink-0 font-mono text-xs font-bold text-pine">
                      +{curr}{Math.round((adjBaseMedian * (sp.premiumPercent / 100)) / 1000)}k/yr
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Negotiation Tips & Matching Resume CTA */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="border-2 border-ink bg-card p-5">
                <h4 className="font-display text-lg font-black text-ink">Resume Negotiation Playbook</h4>
                <ul className="mt-3 space-y-2 text-xs leading-relaxed text-ink-soft">
                  {benchmark.negotiationTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 bg-pine" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-2 border-ink bg-ink p-5 text-paper hs-acid flex flex-col justify-between">
                <div>
                  <span className="kicker text-acid">Target This Compensation Band</span>
                  <h4 className="mt-2 font-display text-xl font-black">
                    Write a resume that commands {curr}{adjBaseP75.toLocaleString()}+
                  </h4>
                  <p className="mt-2 text-xs text-paper/70 leading-relaxed">
                    Recruiters filter out generic resumes in seconds. Use our tailored {benchmark.title} format with quantified bullets.
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    to={`/examples/${benchmark.resumeExampleSlug}`}
                    className="border border-acid/50 bg-paper/10 px-3 py-2 text-xs font-bold text-acid hover:bg-paper/20"
                  >
                    View Resume Example →
                  </Link>
                  <Link
                    to={`/builder?role=${benchmark.resumeExampleSlug}`}
                    className="border-2 border-acid bg-acid px-3.5 py-2 text-xs font-bold text-ink hover:-translate-y-0.5 transition-transform"
                  >
                    Load into Builder
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
