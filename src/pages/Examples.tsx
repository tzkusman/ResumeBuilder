import { useMemo, useRef, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Icon, Reveal, Seo, Kicker, Chip } from "../components/ui";
import ResumeDoc from "../components/ResumeDoc";
import { PROFESSIONS, PROFESSION_CATEGORIES, getProfession } from "../data/professions";
import { resumeFromProfession } from "../lib/types";
import { track } from "../lib/analytics";

export function ExamplesIndex() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const list = useMemo(() => PROFESSIONS.filter((p) =>
    (cat === "All" || p.category === cat) &&
    (p.title.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase()))
  ), [q, cat]);

  return (
    <>
      <Seo
        title="Resume Examples for 20+ Jobs — Free Downloadable Samples | ResumeBuild"
        description="Browse real, ATS-tested resume examples for teachers, nurses, software engineers, accountants, electricians and 15 more professions — each with role-specific writing tips."
        path="/examples"
        jsonLd={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "Resume Examples by Profession", hasPart: PROFESSIONS.map((p) => ({ "@type": "Article", name: `${p.title} Resume Example`, url: `https://resumebuild.vercel.app/examples/${p.slug}` })) }}
      />
      <section className="dotgrid border-b-2 border-ink">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <Reveal><Kicker className="text-pine">The SEO playbook, in the open</Kicker></Reveal>
          <Reveal delay={80}><h1 className="mt-4 max-w-3xl font-display text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">Resume examples for the job you actually have.</h1></Reveal>
          <Reveal delay={160}><p className="mt-5 max-w-2xl text-lg text-ink-soft">Twenty professions, each with a complete ATS-tested resume, salary band, demand signal and 4 role-specific writing tips. Open one, then load it into the builder pre-filled.</p></Reveal>
          <Reveal delay={240}>
            <div className="mt-8 flex max-w-xl items-center gap-3 border-2 border-ink bg-card px-4 hs-sm">
              <Icon name="briefcase" size={18} className="text-ink-soft" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a job title — nurse, electrician, analyst…" className="w-full bg-transparent py-3 text-sm focus:outline-none" />
              {q && <button onClick={() => setQ("")} aria-label="Clear"><Icon name="x" size={15} className="text-ink-soft" /></button>}
            </div>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-5 flex flex-wrap gap-2">
              {["All", ...PROFESSION_CATEGORIES].map((c) => (
                <button key={c} onClick={() => setCat(c)} className={`border px-3 py-1.5 text-xs font-bold transition-colors ${cat === c ? "border-ink bg-ink text-acid" : "border-ink/25 bg-card text-ink-soft hover:border-ink"}`}>{c}</button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <p className="font-mono text-xs text-ink-soft">{list.length} of {PROFESSIONS.length} examples</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 6) * 60}>
              <Link to={`/examples/${p.slug}`} className="group flex h-full flex-col border-2 border-ink bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--color-ink)]">
                <div className="flex items-center justify-between">
                  <Chip className="text-pine-deep">{p.category}</Chip>
                  <span className={`font-mono text-[10px] font-bold uppercase tracking-wider ${p.demand === "Very High" ? "text-coral" : "text-pine"}`}>● {p.demand} demand</span>
                </div>
                <h2 className="mt-4 font-display text-2xl font-black leading-tight group-hover:text-pine">{p.title}</h2>
                <p className="mt-1 font-mono text-xs text-ink-soft">{p.salary}</p>
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-soft">{p.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-pine">Read the example <Icon name="arrow" size={15} className="transition-transform group-hover:translate-x-1" /></span>
              </Link>
            </Reveal>
          ))}
        </div>
        {!list.length && (
          <div className="border-2 border-dashed border-ink/30 py-16 text-center">
            <p className="font-display text-2xl font-black">No matches for "{q}".</p>
            <p className="mt-2 text-ink-soft">Try a broader term — or start from a blank sheet in the builder.</p>
          </div>
        )}
      </section>
    </>
  );
}

export function ExamplePage() {
  const { slug } = useParams();
  const p = getProfession(slug ?? "");
  const wrap = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.55);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(Math.min(0.85, el.clientWidth / 794)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [p]);

  if (!p) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <Seo title="Example not found | ResumeBuild" description="That resume example doesn't exist yet." path="/examples" />
        <h1 className="font-display text-4xl font-black">That example hasn't been written yet.</h1>
        <p className="mt-3 text-ink-soft">Browse the 20 we've published, or build from scratch.</p>
        <Link to="/examples" className="mt-6 inline-block border-2 border-ink bg-acid px-5 py-3 font-bold">All examples</Link>
      </div>
    );
  }

  const sample = resumeFromProfession(p);
  const related = PROFESSIONS.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 3);
  const fallback = PROFESSIONS.filter((x) => x.slug !== p.slug && !related.includes(x)).slice(0, 3 - related.length);

  return (
    <>
      <Seo
        title={`${p.title} Resume Example (2026) — Free Sample & Tips | ResumeBuild`}
        description={`Free ${p.title.toLowerCase()} resume example with real experience bullets, ${p.salary} salary band, ATS-tested formatting and 4 writing tips. Load it into the builder pre-filled.`}
        path={`/examples/${p.slug}`}
        jsonLd={{ "@context": "https://schema.org", "@type": "Article", headline: `${p.title} Resume Example`, description: p.blurb, about: { "@type": "Occupation", name: p.title }, keywords: p.keywords.join(", ") }}
      />
      <section className="dotgrid border-b-2 border-ink">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <nav className="font-mono text-xs text-ink-soft">
            <Link to="/examples" className="hover:text-pine">Examples</Link> <span className="mx-1">/</span> {p.category} <span className="mx-1">/</span> <span className="text-ink">{p.title}</span>
          </nav>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
            <div>
              <Reveal><h1 className="font-display text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">{p.title} <em className="text-pine">Resume Example</em></h1></Reveal>
              <Reveal delay={100}><p className="mt-4 max-w-2xl text-lg text-ink-soft">{p.blurb}</p></Reveal>
            </div>
            <Reveal delay={180}>
              <div className="flex flex-wrap gap-2">
                <Chip className="bg-acid-soft text-pine-deep">{p.salary}</Chip>
                <Chip className={p.demand === "Very High" ? "text-coral" : "text-pine"}>● {p.demand} demand</Chip>
                <Chip>{p.category}</Chip>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_380px]">
        <div>
          <Reveal>
            <div className="flex items-center justify-between">
              <Kicker className="text-pine">The full example — ATS-tested</Kicker>
              <span className="font-mono text-[10.5px] text-ink-soft">A4 · single column · Merit template</span>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div ref={wrap} className="mt-4 overflow-hidden border-2 border-ink bg-line/40 p-3 sm:p-5">
              <div className="mx-auto overflow-hidden border border-ink/25 bg-white shadow-[0_16px_44px_-18px_rgba(19,31,26,0.3)]" style={{ width: 794 * scale, height: 1123 * scale }}>
                <div className="origin-top-left" style={{ transform: `scale(${scale})`, width: 794 }}>
                  <ResumeDoc data={sample} />
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="mt-6 border-2 border-ink bg-card p-6">
              <h2 className="font-display text-2xl font-black">Why this resume works</h2>
              <ul className="mt-4 space-y-3">
                {p.tips.map((tip, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center border-2 border-pine bg-pine font-mono text-[11px] font-bold text-acid">{i + 1}</span>
                    <p className="leading-relaxed text-ink-soft">{tip}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-36 lg:self-start">
          <Reveal delay={120}>
            <div className="border-2 border-ink bg-ink p-6 text-paper hs-acid">
              <p className="kicker text-acid">Skip the typing</p>
              <h3 className="mt-2 font-display text-2xl font-black">Load this exact resume into the builder.</h3>
              <p className="mt-2 text-sm text-paper/70">Pre-filled with this experience, skills and summary — you just swap in your numbers.</p>
              <Link to={`/builder?role=${p.slug}`} onClick={() => track("cta_click", { label: `example_${p.slug}` })} className="mt-5 flex items-center justify-center gap-2 border-2 border-acid bg-acid px-4 py-3 font-bold text-ink transition-all hover:-translate-y-0.5">
                Use this example free <Icon name="arrow" size={16} />
              </Link>
              <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-paper/50">No sign-up · exports included</p>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="border-2 border-ink bg-card p-6">
              <p className="kicker text-pine">Keywords this page targets</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.keywords.map((k) => <Chip key={k}>{k}</Chip>)}
                {p.skills.slice(0, 5).map((s) => <Chip key={s} className="border-pine/40 text-pine-deep">{s}</Chip>)}
              </div>
            </div>
          </Reveal>
          <Reveal delay={260}>
            <div className="border-2 border-ink bg-card p-6">
              <p className="kicker text-pine">Related examples</p>
              <ul className="mt-3 space-y-2">
                {[...related, ...fallback].slice(0, 3).map((r) => (
                  <li key={r.slug}>
                    <Link to={`/examples/${r.slug}`} className="group flex items-center justify-between border border-ink/15 px-3 py-2.5 text-sm font-bold transition-colors hover:border-ink hover:bg-acid-soft">
                      {r.title} <Icon name="arrow" size={14} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </aside>
      </section>
    </>
  );
}
