import { Link, useParams } from "react-router-dom";
import { Icon, Reveal, Seo, Kicker, Chip } from "../components/ui";
import { COUNTRIES, getCountry } from "../data/countries";

const photoTone = (p: string) => (p === "Never" ? "text-coral" : p === "Required" || p === "Expected" ? "text-pine" : "text-ink-soft");

export function CountriesIndex() {
  return (
    <>
      <Seo
        title="CV & Resume Rules by Country — 16 Country Guides | ResumeBuild"
        description="Country-by-country resume and CV rules: photos, page limits, date formats, ATS usage and local tips for the US, UK, Germany, Pakistan, India, UAE and 10 more markets."
        path="/countries"
        jsonLd={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "CV Rules by Country", hasPart: COUNTRIES.map((c) => ({ "@type": "Article", name: `${c.name} CV Guide`, url: `https://resumebuild.vercel.app/countries/${c.code}` })) }}
      />
      <section className="dotgrid border-b-2 border-ink">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <Reveal><Kicker className="text-pine">One planet, sixteen formats</Kicker></Reveal>
          <Reveal delay={80}><h1 className="mt-4 max-w-3xl font-display text-4xl font-black leading-[1.05] sm:text-6xl">Your resume changes at every border.</h1></Reveal>
          <Reveal delay={160}><p className="mt-5 max-w-2xl text-lg text-ink-soft">A photo gets you hired in Germany and rejected in the US. Two pages is thin in Australia and bloated in France. Pick your market; we'll give you the rules.</p></Reveal>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COUNTRIES.map((c, i) => (
            <Reveal key={c.code} delay={(i % 8) * 50}>
              <Link to={`/countries/${c.code}`} className="group flex h-full flex-col border-2 border-ink bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--color-ink)]">
                <div className="flex items-center justify-between">
                  <span className="font-display text-3xl font-black text-line transition-colors group-hover:text-acid">{c.code.toUpperCase()}</span>
                  <Icon name="globe" size={17} className="text-ink-soft group-hover:text-pine" />
                </div>
                <h2 className="mt-2 font-display text-xl font-black group-hover:text-pine">{c.name}</h2>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-ink-soft">{c.docName} · {c.pages}</p>
                <p className={`mt-3 text-xs font-bold ${photoTone(c.photo)}`}>Photo: {c.photo.toLowerCase()}</p>
                <span className="mt-auto pt-3 text-sm font-bold text-pine">Read the guide →</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

export function CountryPage() {
  const { code } = useParams();
  const c = getCountry(code ?? "");
  if (!c) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <Seo title="Country guide not found | ResumeBuild" description="That country guide doesn't exist yet." path="/countries" />
        <h1 className="font-display text-4xl font-black">No guide for that market yet.</h1>
        <Link to="/countries" className="mt-6 inline-block border-2 border-ink bg-acid px-5 py-3 font-bold">All countries</Link>
      </div>
    );
  }
  const facts: [string, string][] = [
    ["Document name", c.docName],
    ["Length", c.pages],
    ["Photo", c.photo],
    ["Date format", c.dateFormat],
    ["Phone format", c.phoneExample],
    ["Paper size", c.paper],
  ];
  const others = COUNTRIES.filter((x) => x.code !== c.code).slice(0, 6);

  return (
    <>
      <Seo
        title={`${c.name} ${c.docName} Format & Rules (2026) — Photo, Pages, ATS | ResumeBuild`}
        description={`How to write a ${c.docName.toLowerCase()} for ${c.name}: ${c.pages}, photo ${c.photo.toLowerCase()}, ${c.dateFormat} dates, local ATS notes and insider tips.`}
        path={`/countries/${c.code}`}
        jsonLd={{ "@context": "https://schema.org", "@type": "Article", headline: `${c.name} ${c.docName} format and rules`, about: { "@type": "Country", name: c.name }, description: c.summary }}
      />
      <section className="dotgrid border-b-2 border-ink">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <nav className="font-mono text-xs text-ink-soft">
            <Link to="/countries" className="hover:text-pine">Countries</Link> <span className="mx-1">/</span> <span className="text-ink">{c.name}</span>
          </nav>
          <Reveal><h1 className="mt-5 font-display text-5xl font-black leading-none tracking-tight sm:text-7xl">{c.name} <em className="text-pine">{c.docName}</em></h1></Reveal>
          <Reveal delay={100}><p className="mt-5 max-w-2xl text-lg text-ink-soft">{c.summary}</p></Reveal>
          <Reveal delay={180}>
            <div className="mt-6 flex flex-wrap gap-2">
              <Chip>{c.pages}</Chip>
              <Chip className={photoTone(c.photo)}>photo: {c.photo.toLowerCase()}</Chip>
              <Chip>{c.dateFormat}</Chip>
              <Chip>{c.paper}</Chip>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-10">
            <Reveal>
              <div className="border-2 border-ink bg-card">
                <div className="border-b-2 border-ink bg-ink px-5 py-3"><p className="kicker text-acid">The fact sheet</p></div>
                <dl className="grid sm:grid-cols-2">
                  {facts.map(([k, v], i) => (
                    <div key={k} className={`flex items-center justify-between gap-4 px-5 py-4 ${i < facts.length - 2 ? "border-b border-ink/10" : ""} ${i % 2 === 0 ? "sm:border-r sm:border-ink/10" : ""}`}>
                      <dt className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">{k}</dt>
                      <dd className="text-right text-sm font-bold">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>

            <div>
              <Reveal><h2 className="font-display text-3xl font-black">How to get it right</h2></Reveal>
              <div className="mt-5 space-y-3">
                {c.tips.map((tip, i) => (
                  <Reveal key={i} delay={i * 70}>
                    <div className="flex gap-4 border-2 border-ink bg-card px-5 py-4">
                      <span className="font-display text-2xl font-black text-acid" style={{ WebkitTextStroke: "1.5px var(--color-ink)" }}>{i + 1}</span>
                      <p className="leading-relaxed">{tip}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Reveal>
                <div className="h-full border-2 border-pine bg-card p-5">
                  <p className="kicker flex items-center gap-2 text-pine"><Icon name="check" size={14} /> Do</p>
                  <ul className="mt-3 space-y-2.5">
                    {c.dos.map((d) => <li key={d} className="flex gap-2.5 text-sm leading-relaxed"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-pine" />{d}</li>)}
                  </ul>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <div className="h-full border-2 border-coral bg-card p-5">
                  <p className="kicker flex items-center gap-2 text-coral"><Icon name="x" size={14} /> Don't</p>
                  <ul className="mt-3 space-y-2.5">
                    {c.donts.map((d) => <li key={d} className="flex gap-2.5 text-sm leading-relaxed"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-coral" />{d}</li>)}
                  </ul>
                </div>
              </Reveal>
            </div>

            <Reveal>
              <div className="flex items-start gap-4 border-2 border-ink bg-acid-soft p-5">
                <Icon name="shield" size={22} className="shrink-0 text-pine" />
                <div>
                  <p className="font-display text-lg font-black">ATS reality in {c.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{c.atsNote}</p>
                </div>
              </div>
            </Reveal>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-36 lg:self-start">
            <Reveal delay={120}>
              <div className="border-2 border-ink bg-ink p-6 text-paper hs-acid">
                <p className="kicker text-acid">Ready when you are</p>
                <h3 className="mt-2 font-display text-2xl font-black">Build a {c.docName.toLowerCase()} that fits {c.name}.</h3>
                <p className="mt-2 text-sm text-paper/70">Correct date fields, phone format hints, and ATS-safe templates from the first keystroke.</p>
                <Link to="/builder" className="mt-5 flex items-center justify-center gap-2 border-2 border-acid bg-acid px-4 py-3 font-bold text-ink transition-all hover:-translate-y-0.5">
                  Open the builder <Icon name="arrow" size={16} />
                </Link>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="border-2 border-ink bg-card p-6">
                <p className="kicker text-pine">Other markets</p>
                <ul className="mt-3 space-y-2">
                  {others.map((o) => (
                    <li key={o.code}>
                      <Link to={`/countries/${o.code}`} className="group flex items-center justify-between border border-ink/15 px-3 py-2.5 text-sm font-bold transition-colors hover:border-ink hover:bg-acid-soft">
                        {o.name} · {o.docName} <Icon name="arrow" size={14} className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  );
}
