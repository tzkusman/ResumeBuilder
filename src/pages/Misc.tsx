import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Icon, Reveal, Seo, Kicker, Chip } from "../components/ui";
import ResumeDoc from "../components/ResumeDoc";
import { useResume, useAuth, useToast, PLANS, FREE_EXPORTS, type PlanId } from "../store/AppStore";
import { ACCENTS, resumeFromProfession, type TemplateId } from "../lib/types";
import { getProfession } from "../data/professions";
import { decodeShare, downloadBlob, resumeToText } from "../lib/utils";
import { track, trackPurchase } from "../lib/analytics";
import { isSupabaseConfigured } from "../lib/supabase";

/* ================= Templates ================= */
const TEMPLATE_META: { id: TemplateId; name: string; tag: string; desc: string }[] = [
  { id: "merit", name: "Merit", tag: "Most popular · ATS-safe", desc: "The recruiter-proof default. Single column, mono section labels, heavy on whitespace and scannable bullets." },
  { id: "atlas", name: "Atlas", tag: "ATS-safe · compact", desc: "A tight, modern sheet with an accent bar and dot-separated skills. Fits 8+ years on one page." },
  { id: "ledger", name: "Ledger", tag: "Visual · sidebar", desc: "A colored sidebar for skills and education. Great for hand-delivered CVs; our ATS engine flags it for online applications." },
  { id: "craft", name: "Craft", tag: "Serif · academic", desc: "Centered serif header for academia, research and traditional firms that still read top-to-bottom." },
];

export function TemplatesPage() {
  const { resume, setResume } = useResume();
  const { toast } = useToast();
  const sample = useMemo(() => {
    const s = resumeFromProfession(getProfession("marketing-manager")!);
    s.contact.fullName = resume.contact.fullName || s.contact.fullName;
    return s;
  }, [resume.contact.fullName]);

  const pick = (id: TemplateId) => {
    setResume((r) => ({ ...r, template: id }));
    track("template_select", { template: id });
    toast(`${TEMPLATE_META.find((t) => t.id === id)?.name} applied to your resume.`, "ok");
  };

  return (
    <>
      <Seo title="ATS-Safe Resume Templates — 4 Free Formats | ResumeBuild" description="Four resume templates engineered for parsing: Merit, Atlas, Ledger and Craft. Apply any template to your draft in one click and export free." path="/templates" />
      <section className="dotgrid border-b-2 border-ink">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <Reveal><Kicker className="text-pine">Form follows parsing</Kicker></Reveal>
          <Reveal delay={80}><h1 className="mt-4 max-w-3xl font-display text-4xl font-black sm:text-6xl">Templates that survive the robots.</h1></Reveal>
          <Reveal delay={160}><p className="mt-5 max-w-2xl text-lg text-ink-soft">Every template below uses standard headings and real text — no tables, text boxes or icons where parsers choke. Apply one to your live draft instantly.</p></Reveal>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2">
          {TEMPLATE_META.map((t, i) => (
            <Reveal key={t.id} delay={(i % 2) * 100}>
              <div className={`group flex h-full flex-col border-2 border-ink bg-card transition-all hover:-translate-y-1 ${resume.template === t.id ? "hs-acid" : "hover:shadow-[6px_6px_0_0_var(--color-ink)]"}`}>
                <div className="overflow-hidden border-b-2 border-ink bg-line/40 p-4">
                  <div className="mx-auto overflow-hidden border border-ink/25 bg-white transition-transform duration-300 group-hover:scale-[1.02]" style={{ width: 794 * 0.48, height: 1123 * 0.42 }}>
                    <div className="origin-top-left" style={{ transform: "scale(0.48)", width: 794 }}>
                      <div style={{ height: 1123 * 0.88 }}><ResumeDoc data={{ ...sample, template: t.id, accent: ACCENTS[i % ACCENTS.length] }} /></div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-display text-2xl font-black">{t.name}</h2>
                    <Chip className={t.tag.includes("ATS-safe") || t.tag.includes("popular") ? "text-pine-deep" : "text-coral"}>{t.tag}</Chip>
                  </div>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{t.desc}</p>
                  <button onClick={() => pick(t.id)} className={`mt-4 inline-flex items-center justify-center gap-2 border-2 px-4 py-2.5 text-sm font-bold transition-all hover:-translate-y-0.5 ${resume.template === t.id ? "border-ink bg-ink text-acid" : "border-ink bg-acid text-ink"}`}>
                    {resume.template === t.id ? "Applied to your draft" : "Use this template"} <Icon name={resume.template === t.id ? "check" : "arrow"} size={15} />
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

/* ================= Cover Letter ================= */
export function CoverLetterPage() {
  const { resume } = useResume();
  const { toast } = useToast();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState(resume.contact.title);
  const [manager, setManager] = useState("Hiring Manager");
  const [why, setWhy] = useState("");
  const firstXp = resume.experience.find((e) => e.role);

  const letter = useMemo(() => {
    const name = resume.contact.fullName || "Your Name";
    const top = firstXp ? `${firstXp.role} at ${firstXp.company}` : "a motivated professional";
    return `${name}
${[resume.contact.email, resume.contact.phone, resume.contact.location].filter(Boolean).join(" · ")}

${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}

Dear ${manager || "Hiring Manager"},

I'm writing to apply for the ${role || "open position"} role at ${company || "your company"}. Working as ${top}, I've learned that the difference between a good hire and a great one is measurable impact — and I bring the receipts: ${firstXp?.bullets.find((b) => /\d/.test(b)) || "consistent, quantified results across every role I've held"}.

${why ? why + "\n\n" : ""}What draws me to ${company || "your team"} specifically is the chance to apply this experience where it compounds. I'd welcome the chance to discuss how my background maps to your next quarter's goals.

Thank you for your time — I look forward to hearing from you.

Sincerely,
${name}`;
  }, [resume, company, role, manager, why, firstXp]);

  const [mode, setMode] = useState<"letter" | "about">("letter");
  const about = useMemo(() => {
    const roleLine = resume.contact.title || "professional";
    const skills = resume.skills.slice(0, 6).join(", ");
    const win = firstXp?.bullets.find((b) => /\d/.test(b));
    return `I'm a ${roleLine} who believes the best work is measurable. ${resume.summary || `I bring hands-on experience across ${skills || "my field"}, with a track record of shipping results that show up in the numbers.`}

Most recently, ${firstXp ? `as ${firstXp.role} at ${firstXp.company}, I ${win ? win.charAt(0).toLowerCase() + win.slice(1).replace(/\.$/, "") : "led work I'm genuinely proud of"}.` : "I'm building my portfolio and looking for the right team to grow with."}

Core toolkit: ${skills || "ask me"}.

What I'm looking for: ${company ? `roles like ${role || "my next challenge"} at teams like ${company}.` : "a role where impact is measured and mentorship flows both ways."} Open to conversations — the fastest way to reach me is ${resume.contact.email || "the message button"}.`;
  }, [resume, firstXp, company, role]);

  const content = mode === "letter" ? letter : about;
  const inp = "w-full border border-ink/25 bg-white px-3 py-2.5 text-sm focus:border-pine focus:outline-none";

  return (
    <>
      <Seo title="Free Cover Letter & LinkedIn About Generator | ResumeBuild" description="Generate a tailored cover letter and a LinkedIn About section from the same profile data as your resume. One click to copy or download." path="/cover-letter" />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <Reveal><Kicker className="text-pine">Same data, two more documents</Kicker></Reveal>
        <Reveal delay={80}>
          <div className="flex flex-wrap items-end justify-between gap-5">
            <h1 className="mt-3 font-display text-4xl font-black sm:text-5xl">Cover letter &amp; LinkedIn, written off your resume.</h1>
            <div className="flex border-2 border-ink">
              <button onClick={() => setMode("letter")} className={`px-4 py-2 font-display text-sm font-black transition-colors ${mode === "letter" ? "bg-ink text-acid" : "text-ink-soft hover:text-ink"}`}>Cover letter</button>
              <button onClick={() => setMode("about")} className={`px-4 py-2 font-display text-sm font-black transition-colors ${mode === "about" ? "bg-ink text-acid" : "text-ink-soft hover:text-ink"}`}>LinkedIn About</button>
            </div>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <Reveal delay={120}>
            <div className="space-y-4 border-2 border-ink bg-card p-6">
              {mode === "letter" && (<>
              <label className="block"><span className="mb-1 block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">Company</span>
                <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Northwind Labs" className={inp} /></label>
              <label className="block"><span className="mb-1 block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">Role you're applying for</span>
                <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Senior Software Engineer" className={inp} /></label>
              <label className="block"><span className="mb-1 block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">Address it to</span>
                <input value={manager} onChange={(e) => setManager(e.target.value)} placeholder="Hiring Manager" className={inp} /></label>
              <label className="block"><span className="mb-1 block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">Why this company? (optional paragraph)</span>
                <textarea value={why} onChange={(e) => setWhy(e.target.value)} rows={3} placeholder="Your product's approach to developer experience matches how I think about…" className={inp} /></label>
              </>)}
              {mode === "about" && (
                <div className="border border-pine/40 bg-acid-soft/60 px-4 py-3 text-sm leading-relaxed text-ink-soft">
                  <strong className="text-pine-deep">Generated from your live resume data</strong> — first-person voice, your strongest metric, and your top 6 skills. Edit your resume in the builder and this updates instantly.
                </div>
              )}
              <div className="flex flex-wrap gap-3 pt-1">
                <button onClick={() => { navigator.clipboard?.writeText(content).catch(() => {}); track("cta_click", { label: `${mode}_copy` }); toast(`${mode === "letter" ? "Cover letter" : "LinkedIn About"} copied to clipboard.`, "ok"); }} className="hs-sm border-2 border-ink bg-acid px-4 py-2.5 text-sm font-bold transition-all hover:-translate-y-0.5">Copy {mode === "letter" ? "letter" : "About"}</button>
                <button onClick={() => { downloadBlobTxt(); }} className="border-2 border-ink px-4 py-2.5 text-sm font-bold transition-all hover:-translate-y-0.5 hover:bg-ink hover:text-acid"><Icon name="download" size={15} className="mr-1.5 inline" />Download .txt</button>
              </div>
              <p className="font-mono text-[10.5px] text-ink-soft">Pulls your name, contact line and strongest quantified bullet automatically.</p>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="h-full border-2 border-ink bg-white p-8 shadow-[0_18px_50px_-22px_rgba(19,31,26,0.35)]">
              <p className="mb-4 flex items-center justify-between border-b border-ink/15 pb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                {mode === "letter" ? "Cover letter · ready to paste" : "LinkedIn About · 1st person"}
                <span className="text-pine">{content.split(/\s+/).length} words</span>
              </p>
              <pre className="whitespace-pre-wrap font-body text-[13.5px] leading-relaxed">{content}</pre>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );

  function downloadBlobTxt() {
    downloadBlob(content, `${mode === "letter" ? "cover-letter" : "linkedin-about"}.txt`, "text/plain;charset=utf-8");
    track("resume_download", { format: "txt" });
  }
}

/* ================= Pricing ================= */
export function PricingPage() {
  const { user, isPro, planName, planSince, downloadsUsed, freeExportsLeft, unlockPro, cancelPro } = useAuth();
  const { toast } = useToast();
  const [cycle, setCycle] = useState<"monthly" | "annual">("monthly");
  const [checkout, setCheckout] = useState<PlanId | null>(null);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const proPlan: PlanId = cycle === "monthly" ? "pro_monthly" : "pro_annual";
  const rows: [string, string, string][] = [
    ["Exports (PDF / DOCX / TXT)", `${FREE_EXPORTS} total after sign-up`, "Unlimited"],
    ["ATS score + 14-check report", "Included", "Included"],
    ["All 4 ATS templates + accent inks", "Included", "Included"],
    ["20 profession examples + prefill", "Included", "Included"],
    ["Country CV guides (16 markets)", "Included", "Included"],
    ["Shareable resume link", "Included", "Included"],
    ["JD keyword tailoring", "3 passes / day", "Unlimited"],
    ["Cover letter + LinkedIn About", "1 / month", "Unlimited"],
    ["Cloud sync (Supabase workspace)", "—", "Included"],
    ["Priority email support", "—", "Included"],
  ];

  const startCheckout = (plan: PlanId) => {
    setPaid(false);
    setCheckout(plan);
    track("checkout_start", { plan, value: PLANS[plan].price });
  };

  const pay = (e: FormEvent) => {
    e.preventDefault();
    if (!checkout) return;
    setPaying(true);
    // NOTE: replace with Stripe Checkout / Payment Links in production (README §6).
    setTimeout(() => {
      setPaying(false);
      setPaid(true);
      unlockPro(checkout);
      trackPurchase(PLANS[checkout].name, PLANS[checkout].price);
    }, 1400);
  };

  const planCards: { plan: PlanId; badge?: string; features: string[]; cta: string; onCta: () => void; current?: boolean }[] = [
    {
      plan: "free",
      features: [
        `${FREE_EXPORTS} free export after sign-up`,
        "ATS score + full 14-check report",
        "All 4 templates + 20 role examples",
        "Shareable link (always free)",
        "3 JD keyword passes / day",
      ],
      cta: user ? (isPro ? "Included in Pro" : `${freeExportsLeft} export${freeExportsLeft === 1 ? "" : "s"} left`) : "Claim your free export",
      onCta: () => {},
      current: !!user && !isPro,
    },
    {
      plan: proPlan,
      badge: "Best value",
      features: [
        "Unlimited PDF / DOCX / TXT exports",
        "Unlimited JD keyword tailoring",
        "Unlimited cover letters + LinkedIn About",
        "Cloud sync across devices",
        "Priority email support",
      ],
      cta: isPro && planName === PLANS[proPlan].name ? "Current plan" : `Go Pro — $${PLANS[proPlan].price}${PLANS[proPlan].cadence}`,
      onCta: () => startCheckout(proPlan),
      current: isPro && planName === PLANS[proPlan].name,
    },
    {
      plan: "pro_lifetime",
      badge: "Pay once",
      features: [
        "Everything in Pro, forever",
        "No monthly bill, ever",
        "All future templates included",
        "Price locked at today's rate",
        "Lifetime priority support",
      ],
      cta: isPro && planName === PLANS.pro_lifetime.name ? "Current plan" : "Unlock lifetime — $79",
      onCta: () => startCheckout("pro_lifetime"),
      current: isPro && planName === PLANS.pro_lifetime.name,
    },
  ];

  return (
    <>
      <Seo title="Pricing — 1 Free Export, Pro from $7/mo | ResumeBuild" description="Every account gets 1 free resume export. Pro unlocks unlimited PDF/DOCX/TXT downloads, unlimited JD tailoring and cloud sync for $7/mo, $49/yr or $79 lifetime." path="/pricing" />
      <section className="dotgrid border-b-2 border-ink">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <Reveal><Kicker className="text-pine">Pricing</Kicker></Reveal>
          <Reveal delay={80}><h1 className="mt-4 max-w-3xl font-display text-4xl font-black leading-[1.05] sm:text-6xl">Every account starts with <em className="text-pine">one free export.</em></h1></Reveal>
          <Reveal delay={160}><p className="mt-5 max-w-2xl text-lg text-ink-soft">Sign up, download your resume, done — no card. Pro is for people applying seriously: unlimited exports, unlimited tailoring, synced everywhere.</p></Reveal>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <Reveal>
          <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink-soft">Pro billing:</span>
            <div className="flex border-2 border-ink">
              <button onClick={() => setCycle("monthly")} className={`px-4 py-2 text-sm font-bold transition-colors ${cycle === "monthly" ? "bg-ink text-acid" : "text-ink-soft hover:text-ink"}`}>Monthly</button>
              <button onClick={() => setCycle("annual")} className={`px-4 py-2 text-sm font-bold transition-colors ${cycle === "annual" ? "bg-ink text-acid" : "text-ink-soft hover:text-ink"}`}>Annual <span className="ml-1 bg-acid px-1.5 py-0.5 font-mono text-[9px] text-ink">−42%</span></button>
            </div>
          </div>
        </Reveal>
        <div className="grid gap-5 lg:grid-cols-3">
          {planCards.map((card, i) => {
            const meta = PLANS[card.plan];
            const featured = card.plan !== "free";
            return (
              <Reveal key={card.plan} delay={i * 100}>
                <div className={`relative flex h-full flex-col border-2 p-6 transition-all hover:-translate-y-1 ${card.current ? "border-pine bg-acid-soft" : featured ? "border-ink bg-card hover:shadow-[6px_6px_0_0_var(--color-ink)]" : "border-ink bg-card hover:shadow-[6px_6px_0_0_var(--color-ink)]"}`}>
                  {card.badge && <span className="absolute -top-3 right-5 border-2 border-ink bg-acid px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest">{card.badge}</span>}
                  {card.current && <span className="absolute -top-3 left-5 border-2 border-ink bg-pine px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-acid">Current plan</span>}
                  <p className="kicker text-pine">{meta.name}</p>
                  <p className="mt-3 flex items-baseline gap-1">
                    <span className="font-display text-5xl font-black">${meta.price}</span>
                    <span className="font-mono text-xs text-ink-soft">{meta.cadence}</span>
                  </p>
                  <ul className="mt-5 flex-1 space-y-2.5 border-t-2 border-dashed border-ink/20 pt-5">
                    {card.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm leading-snug">
                        <Icon name={card.plan === "free" ? "check" : "zap"} size={15} className={`mt-0.5 shrink-0 ${card.plan === "free" ? "text-pine" : "text-coral"}`} /> {f}
                      </li>
                    ))}
                  </ul>
                  {card.plan === "free" ? (
                    <Link to={user ? "/builder" : "/auth?next=/pricing"} className={`mt-6 block border-2 px-4 py-3 text-center text-sm font-bold transition-all hover:-translate-y-0.5 ${isPro ? "border-ink/20 text-ink-soft" : "border-ink bg-acid hover:shadow-[4px_4px_0_0_var(--color-ink)]"}`}>{card.cta}</Link>
                  ) : (
                    <button onClick={card.onCta} disabled={card.current} className={`mt-6 border-2 px-4 py-3 text-center text-sm font-bold transition-all ${card.current ? "cursor-default border-ink/20 text-ink-soft" : "border-ink bg-ink text-acid hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--color-acid)]"}`}>{card.cta}</button>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        {isPro && (
          <Reveal>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-2 border-pine bg-card px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center border-2 border-ink bg-ink text-acid"><Icon name="zap" size={18} /></span>
                <div>
                  <p className="font-display text-lg font-black">{planName} · active{planSince ? ` since ${new Date(planSince).toLocaleDateString()}` : ""}</p>
                  <p className="font-mono text-[11px] text-ink-soft">{downloadsUsed} exports used · unlimited on Pro</p>
                </div>
              </div>
              <button onClick={() => { cancelPro(); toast("Back on the free plan — your 1 free export stays used.", "warn"); }} className="border-2 border-ink px-4 py-2 text-sm font-bold transition-all hover:bg-ink hover:text-acid">Cancel Pro</button>
            </div>
          </Reveal>
        )}

        <Reveal delay={120}>
          <div className="mt-12 grid grid-cols-[1fr_110px_110px] border-2 border-ink bg-card sm:grid-cols-[1fr_170px_190px]">
            <div className="border-b-2 border-r-2 border-ink bg-paper px-5 py-5"><p className="kicker text-ink-soft">Full comparison</p></div>
            <div className="border-b-2 border-r-2 border-ink bg-paper px-4 py-5 text-center">
              <p className="font-display text-xl font-black">Free</p>
              <p className="font-mono text-[11px] text-ink-soft">$0 · {FREE_EXPORTS} export</p>
            </div>
            <div className="border-b-2 border-ink bg-ink px-4 py-5 text-center text-paper">
              <p className="font-display text-xl font-black text-acid">Pro</p>
              <p className="font-mono text-[11px] text-paper/70">${PLANS[proPlan].price}{PLANS[proPlan].cadence}</p>
            </div>
            {rows.map(([f, free, pro]) => (
              <div key={f} style={{ display: "contents" }}>
                <div className="border-b border-r border-ink/10 px-5 py-3.5 text-sm font-semibold">{f}</div>
                <div className="border-b border-r border-ink/10 px-4 py-3.5 text-center text-sm text-ink-soft">{free === "Included" ? <Icon name="check" size={16} className="mx-auto text-pine" /> : free}</div>
                <div className="border-b border-ink/10 bg-ink/5 px-4 py-3.5 text-center text-sm font-bold text-pine-deep">{pro === "Included" ? <Icon name="check" size={16} className="mx-auto text-pine" /> : pro}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-6 flex flex-wrap items-center gap-4 border-2 border-dashed border-ink/30 px-5 py-4">
            <Icon name="shield" size={20} className="text-pine" />
            <p className="text-sm text-ink-soft"><strong className="text-ink">No card to start.</strong> The free export unlocks the moment you create an account. Upgrade only when you're exporting every tweak — that's what Pro is for. Cancel anytime; exports you already made stay yours.</p>
          </div>
        </Reveal>
      </section>

      {checkout && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/60 p-4" onClick={() => !paying && setCheckout(null)}>
          <div className="toast-in w-full max-w-md border-2 border-ink bg-paper hs-acid" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b-2 border-ink bg-ink px-5 py-3.5">
              <p className="font-display text-lg font-black text-paper">{paid ? "You're Pro. Welcome." : checkout ? `${PLANS[checkout].name} — $${PLANS[checkout].price}${PLANS[checkout].cadence === "once" ? "" : PLANS[checkout].cadence}` : ""}</p>
              {!paying && <button onClick={() => setCheckout(null)} className="grid h-8 w-8 place-items-center border border-paper/40 text-paper hover:border-acid hover:text-acid"><Icon name="x" size={14} /></button>}
            </div>
            {paid ? (
              <div className="p-8 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center border-2 border-pine bg-pine text-acid"><Icon name="check" size={28} /></span>
                <p className="mt-4 font-display text-2xl font-black">Payment recorded.</p>
                <p className="mt-2 text-sm text-ink-soft">Unlimited exports are unlocked on this account. A receipt was queued to your email.</p>
                <Link to="/builder" onClick={() => setCheckout(null)} className="mt-5 inline-block border-2 border-ink bg-acid px-5 py-2.5 font-bold">Back to the builder</Link>
              </div>
            ) : !user ? (
              <div className="p-6">
                <p className="text-sm leading-relaxed text-ink-soft">
                  Checkouts attach to an account so your Pro status and export history follow you across devices.
                  <strong className="text-ink"> Create your free account first</strong> — your {FREE_EXPORTS} free export is included, then come straight back here.
                </p>
                <ul className="mt-4 space-y-2 border-t border-ink/10 pt-4">
                  {["Takes 20 seconds — email + password", `${FREE_EXPORTS} free export included`, "Resume drafts stay saved in your browser"].map((b) => (
                    <li key={b} className="flex items-center gap-2.5 text-sm font-semibold"><Icon name="check" size={15} className="text-pine" /> {b}</li>
                  ))}
                </ul>
                <Link to="/auth?next=/pricing" className="hs-sm mt-5 flex w-full items-center justify-center gap-2 border-2 border-ink bg-acid px-4 py-3 font-bold transition-all hover:-translate-y-0.5">
                  Create free account <Icon name="arrow" size={15} />
                </Link>
              </div>
            ) : (
              <form onSubmit={pay} className="space-y-4 p-6">
                <p className="border border-coral/50 bg-card px-3 py-2 font-mono text-[10.5px] leading-relaxed text-ink-soft">Demo checkout — wire Stripe Checkout here in production (README §6). purchase conversion fires on completion.</p>
                <label className="block"><span className="mb-1 block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">Name on card</span>
                  <input required placeholder="Alex Morgan" className="w-full border border-ink/25 bg-white px-3 py-2.5 text-sm focus:border-pine focus:outline-none" /></label>
                <label className="block"><span className="mb-1 block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">Card number</span>
                  <input required inputMode="numeric" placeholder="4242 4242 4242 4242" className="w-full border border-ink/25 bg-white px-3 py-2.5 font-mono text-sm focus:border-pine focus:outline-none" /></label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block"><span className="mb-1 block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">Expiry</span>
                    <input required placeholder="12/28" className="w-full border border-ink/25 bg-white px-3 py-2.5 font-mono text-sm focus:border-pine focus:outline-none" /></label>
                  <label className="block"><span className="mb-1 block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">CVC</span>
                    <input required placeholder="123" className="w-full border border-ink/25 bg-white px-3 py-2.5 font-mono text-sm focus:border-pine focus:outline-none" /></label>
                </div>
                <button disabled={paying} className="hs-sm flex w-full items-center justify-center gap-2 border-2 border-ink bg-acid px-4 py-3 font-bold transition-all hover:-translate-y-0.5 disabled:opacity-60">
                  {paying ? <><span className="spin inline-block h-4 w-4 rounded-full border-2 border-ink border-t-transparent" /> Processing…</> : `Pay $${checkout ? PLANS[checkout].price : 0} securely`}
                </button>
                {checkout && checkout !== "pro_lifetime" && (
                  <button type="button" onClick={() => setCheckout("pro_lifetime")} className="w-full text-center text-xs font-bold text-pine underline-offset-2 hover:underline">or switch to Lifetime — $79 once, never billed again</button>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ================= Auth ================= */
export function AuthPage() {
  const { user, isPro, planName, downloadsUsed, freeExportsLeft, signup, login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/builder";
  const [mode, setMode] = useState<"in" | "up">("up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const err = mode === "up" ? await signup(email, password) : await login(email, password);
    setBusy(false);
    if (err) { setError(err); return; }
    toast(mode === "up" ? `Account created — your ${FREE_EXPORTS} free export is unlocked.` : "Welcome back.", "ok");
    navigate(next);
  };

  if (user) {
    return (
      <section className="mx-auto max-w-lg px-4 py-24 text-center">
        <Seo title="Your account | ResumeBuild" description="Manage your ResumeBuild account." path="/auth" />
        <span className="mx-auto grid h-16 w-16 place-items-center border-2 border-pine bg-pine text-acid"><Icon name="user" size={30} /></span>
        <h1 className="mt-5 font-display text-4xl font-black">Signed in as {user.email}</h1>
        <p className="mt-3 text-ink-soft">{isSupabaseConfigured ? "Connected to your Supabase workspace — cloud sync is active." : "Running in local demo mode. Add Supabase credentials to enable real accounts (see README)."}</p>
        <div className="mt-6 border-2 border-ink bg-card p-5 text-left">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="kicker text-pine">Your plan</p>
              <p className="mt-1 font-display text-xl font-black">{planName}</p>
            </div>
            <span className={`border-2 px-3 py-1.5 font-mono text-[10.5px] font-bold uppercase tracking-wider ${isPro ? "border-ink bg-ink text-acid" : "border-pine bg-acid-soft text-pine-deep"}`}>
              {isPro ? "Unlimited exports" : `${freeExportsLeft} of ${FREE_EXPORTS} free export${FREE_EXPORTS === 1 ? "" : "s"} left`}
            </span>
          </div>
          <p className="mt-3 border-t border-ink/10 pt-3 font-mono text-[10.5px] text-ink-soft">{downloadsUsed} export{downloadsUsed === 1 ? "" : "s"} used on this account.</p>
          {!isPro && <Link to="/pricing" className="mt-3 inline-block text-sm font-bold text-pine underline-offset-2 hover:underline">Upgrade to Pro for unlimited downloads →</Link>}
        </div>
        <Link to="/builder" className="mt-6 inline-block border-2 border-ink bg-acid px-6 py-3 font-bold">Continue building</Link>
      </section>
    );
  }

  return (
    <section className="dotgrid mx-auto max-w-lg px-4 py-16 sm:px-6">
      <Seo title={mode === "up" ? "Create your free account — 1 Free Export | ResumeBuild" : "Sign in | ResumeBuild"} description="Create a free ResumeBuild account: 1 free resume export included, ATS scoring and all templates. No card required." path="/auth" />
      <Reveal>
        <div className="mb-4 flex items-center gap-3 border-2 border-ink bg-acid px-4 py-3 hs-sm">
          <Icon name="star" size={18} className="shrink-0" />
          <p className="text-sm font-bold">Every new account unlocks {FREE_EXPORTS} free resume export — no card needed.</p>
        </div>
      </Reveal>
      <Reveal delay={80}>
        <div className="border-2 border-ink bg-card hs-sm">
          <div className="grid grid-cols-2 border-b-2 border-ink">
            <button onClick={() => setMode("up")} className={`py-3.5 font-display text-lg font-black transition-colors ${mode === "up" ? "bg-ink text-acid" : "text-ink-soft hover:text-ink"}`}>Create account</button>
            <button onClick={() => setMode("in")} className={`py-3.5 font-display text-lg font-black transition-colors ${mode === "in" ? "bg-ink text-acid" : "text-ink-soft hover:text-ink"}`}>Sign in</button>
          </div>
          <form onSubmit={submit} className="space-y-4 p-6">
            <label className="block"><span className="mb-1 block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">Email</span>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="w-full border border-ink/25 bg-white px-3 py-2.5 text-sm focus:border-pine focus:outline-none" /></label>
            <label className="block"><span className="mb-1 block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">Password</span>
              <input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full border border-ink/25 bg-white px-3 py-2.5 text-sm focus:border-pine focus:outline-none" /></label>
            {error && <p className="shake border border-coral bg-card px-3 py-2 text-sm font-semibold text-coral">{error}</p>}
            <button disabled={busy} className="hs-sm w-full border-2 border-ink bg-acid px-4 py-3 font-bold transition-all hover:-translate-y-0.5 disabled:opacity-60">
              {busy ? "Working…" : mode === "up" ? "Sign up free" : "Sign in"}
            </button>
            <p className="font-mono text-[10.5px] leading-relaxed text-ink-soft">
              {isSupabaseConfigured ? "Secured by Supabase Auth · sign_up conversion event fires on success." : "Demo mode: accounts are stored locally until Supabase credentials are added."}
            </p>
          </form>
        </div>
      </Reveal>
    </section>
  );
}

/* ================= Shared link viewer ================= */
export function SharedPage() {
  const [params] = useSearchParams();
  const data = useMemo(() => {
    const d = params.get("d");
    return d ? decodeShare(d) : null;
  }, [params]);

  if (!data) {
    return (
      <section className="mx-auto max-w-lg px-4 py-24 text-center">
        <Seo title="Shared resume link invalid | ResumeBuild" description="This share link is invalid or expired." />
        <h1 className="font-display text-4xl font-black">This link doesn't decode.</h1>
        <p className="mt-3 text-ink-soft">The resume data in the URL looks corrupted. Ask for a fresh share link.</p>
        <Link to="/builder" className="mt-6 inline-block border-2 border-ink bg-acid px-5 py-3 font-bold">Build your own</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Seo title={`${data.contact.fullName || "Shared"} — Resume | ResumeBuild`} description="A resume shared from ResumeBuild." />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Kicker className="text-pine">Shared resume · read-only</Kicker>
          <h1 className="mt-2 font-display text-3xl font-black sm:text-4xl">{data.contact.fullName || "Untitled resume"}</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { navigator.clipboard?.writeText(resumeToText(data)).catch(() => {}); }} className="border-2 border-ink px-4 py-2.5 text-sm font-bold transition-all hover:-translate-y-0.5 hover:bg-ink hover:text-acid">Copy text</button>
          <Link to="/builder" className="border-2 border-ink bg-acid px-4 py-2.5 text-sm font-bold transition-all hover:-translate-y-0.5">Remix in builder</Link>
        </div>
      </div>
      <div className="mt-8 flex justify-center overflow-x-auto border-2 border-ink bg-line/40 p-4">
        <div className="shrink-0 border border-ink/25 bg-white shadow-[0_18px_50px_-22px_rgba(19,31,26,0.35)]">
          <ResumeDoc data={data} />
        </div>
      </div>
    </section>
  );
}

/* ================= Legal ================= */
export function LegalPage({ kind }: { kind: "privacy" | "terms" }) {
  const privacy = kind === "privacy";
  const body = privacy
    ? [
        ["What we store", "By default your resume lives entirely in your browser's local storage — nothing leaves your device. If you create an account and enable cloud sync, your resume data is stored in a Supabase workspace protected by row-level security, visible only to you."],
        ["What we never do", "We never sell personal data, never use resume content to train AI models, and never share documents with third parties except the analytics processors listed below."],
        ["Analytics", "We use Google Analytics 4 with IP anonymization to understand aggregate usage (pages visited, exports completed). Conversion events like sign-up and download are recorded without document contents."],
        ["Your rights", "You can export everything you've created at any time (PDF/DOCX/TXT), and clearing your browser storage or deleting your account permanently removes your data."],
        ["Contact", "Privacy questions: privacy@resumebuild.app."],
      ]
    : [
        ["The short version", "ResumeBuild is provided as-is for personal job-seeking use. The free tier is free forever; Pro features activate after a completed payment and renew only as described at checkout."],
        ["Your content", "You own everything you create. Pre-filled examples are provided as writing references; you're responsible for the accuracy of the final document you submit to employers."],
        ["Refunds", "Pro Lifetime purchases are refundable within 14 days, no questions asked. Monthly plans can be cancelled anytime and remain active until the period ends."],
        ["Acceptable use", "Don't use the service to misrepresent credentials to employers or to scrape example content at scale for a competing product."],
        ["Changes", "We'll announce material terms changes on this page at least 14 days before they take effect."],
      ];
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Seo title={privacy ? "Privacy Policy | ResumeBuild" : "Terms of Service | ResumeBuild"} description={privacy ? "How ResumeBuild handles your resume data — browser-first storage, Supabase cloud sync, GA4 analytics." : "The terms of using ResumeBuild — ownership, refunds, acceptable use."} path={`/${kind === "privacy" ? "privacy" : "terms"}`} />
      <Kicker className="text-pine">{privacy ? "Privacy policy" : "Terms of service"}</Kicker>
      <h1 className="mt-3 font-display text-4xl font-black sm:text-5xl">{privacy ? "Your data stays yours." : "Fair terms, in plain words."}</h1>
      <p className="mt-3 font-mono text-xs text-ink-soft">Last updated: January 2026</p>
      <div className="mt-10 space-y-8">
        {body.map(([h, b], i) => (
          <Reveal key={h} delay={i * 60}>
            <div className="border-l-4 border-acid bg-card p-6">
              <h2 className="font-display text-xl font-black">{h}</h2>
              <p className="mt-2 leading-relaxed text-ink-soft">{b}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ================= 404 ================= */
export function NotFoundPage() {
  return (
    <section className="dotgrid mx-auto max-w-3xl px-4 py-28 text-center sm:px-6">
      <Seo title="Page not found | ResumeBuild" description="That page doesn't exist — but 20 resume examples and 16 country guides do." />
      <p className="kicker text-coral">Error 404</p>
      <h1 className="mt-4 font-display text-5xl font-black sm:text-7xl">This page didn't make the shortlist.</h1>
      <p className="mx-auto mt-4 max-w-md text-ink-soft">The URL doesn't match anything we've published. Your resume, however, is safe.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link to="/" className="border-2 border-ink bg-acid px-5 py-3 font-bold transition-all hover:-translate-y-0.5">Go home</Link>
        <Link to="/examples" className="border-2 border-ink px-5 py-3 font-bold transition-all hover:-translate-y-0.5 hover:bg-ink hover:text-acid">Resume examples</Link>
      </div>
    </section>
  );
}
