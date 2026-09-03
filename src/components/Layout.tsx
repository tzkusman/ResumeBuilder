import { useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Icon } from "./ui";
import { useAuth, useI18n } from "../store/AppStore";
import { PROFESSIONS } from "../data/professions";
import { COUNTRIES } from "../data/countries";
import { isSupabaseConfigured } from "../lib/supabase";

function Wordmark() {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center border-2 border-ink bg-acid text-ink transition-transform duration-200 group-hover:-rotate-6">
        <Icon name="logo" size={20} />
      </span>
      <span className="font-display text-xl font-black tracking-tight">
        Resume<span className="text-pine">Build</span>
      </span>
    </Link>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { user, logout, isPro } = useAuth();
  const { lang, setLang, t } = useI18n();
  const loc = useLocation();

  const nav = [
    { to: "/examples", label: t("nav.examples") },
    { to: "/countries", label: t("nav.countries") },
    { to: "/templates", label: t("nav.templates") },
    { to: "/cover-letter", label: t("nav.cover") },
    { to: "/pricing", label: t("nav.pricing") },
  ];

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `border-b-2 px-0.5 pb-0.5 text-sm font-semibold transition-colors ${isActive ? "border-pine text-pine-deep" : "border-transparent text-ink-soft hover:text-ink hover:border-line"}`;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b-2 border-ink/90 bg-paper/92 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Wordmark />
          <nav className="hidden items-center gap-6 lg:flex">
            {nav.map((n) => <NavLink key={n.to} to={n.to} className={linkCls}>{n.label}</NavLink>)}
          </nav>
          <div className="flex items-center gap-2.5">
            <div className="hidden items-center border border-ink/25 bg-card sm:flex" role="group" aria-label="Language">
              <button onClick={() => setLang("en")} className={`px-2.5 py-1.5 font-mono text-[11px] font-semibold ${lang === "en" ? "bg-ink text-acid" : "text-ink-soft hover:text-ink"}`}>EN</button>
              <button onClick={() => setLang("ur")} className={`px-2.5 py-1.5 font-mono text-[11px] font-semibold ${lang === "ur" ? "bg-ink text-acid" : "text-ink-soft hover:text-ink"}`}>اردو</button>
            </div>
            {isPro && <span className="hidden border border-acid bg-acid-soft px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-pine-deep md:inline">Pro</span>}
            {user ? (
              <button onClick={() => void logout()} className="hidden border border-ink/25 px-3 py-2 text-sm font-semibold text-ink-soft transition-colors hover:border-ink hover:text-ink sm:block">
                {user.email.split("@")[0]} · Sign out
              </button>
            ) : (
              <Link to="/auth" className="hidden border border-ink/25 px-3 py-2 text-sm font-semibold text-ink-soft transition-colors hover:border-ink hover:text-ink sm:block">{t("nav.signin")}</Link>
            )}
            <Link to="/builder" className="hs-sm hidden border-2 border-ink bg-acid px-4 py-2 text-sm font-bold text-ink transition-all hover:-translate-y-0.5 hover:shadow-[5px_7px_0_0_var(--color-ink)] active:translate-y-0 sm:block">
              {t("nav.build")}
            </Link>
            <button className="grid h-10 w-10 place-items-center border-2 border-ink bg-card lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
              <Icon name={open ? "x" : "menu"} size={20} />
            </button>
          </div>
        </div>
        {open && (
          <div className="border-t-2 border-ink/90 bg-paper px-4 py-4 lg:hidden">
            <div className="flex flex-col gap-3">
              {nav.map((n) => (
                <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="border border-ink/15 bg-card px-3 py-2.5 text-sm font-semibold">{n.label}</Link>
              ))}
              <Link to="/builder" onClick={() => setOpen(false)} className="border-2 border-ink bg-acid px-3 py-2.5 text-center text-sm font-bold">{t("nav.build")}</Link>
              {!user && <Link to="/auth" onClick={() => setOpen(false)} className="border border-ink/15 bg-card px-3 py-2.5 text-center text-sm font-semibold">Sign in</Link>}
            </div>
          </div>
        )}
      </header>

      <main key={loc.pathname}>{children}</main>

      <footer className="mt-24 border-t-2 border-ink bg-ink text-paper">
        <div className="dotgrid-dark mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center border-2 border-acid bg-acid text-ink"><Icon name="logo" size={20} /></span>
                <span className="font-display text-2xl font-black">Resume<span className="text-acid">Build</span></span>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/70">
                ATS-proof resumes with real examples for every profession and CV rules for every market.
                {!isSupabaseConfigured && " Running in local demo mode — connect Supabase credentials for cloud accounts."}
              </p>
              <div className="mt-5 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-widest text-acid">
                <span className="border border-acid/40 px-2 py-1">GDPR-ready</span>
                <span className="border border-acid/40 px-2 py-1">No data sold</span>
                <span className="border border-acid/40 px-2 py-1">EN · اردو</span>
              </div>
            </div>
            <div>
              <h3 className="kicker text-acid">Resume examples</h3>
              <ul className="mt-4 grid grid-cols-1 gap-1.5 text-sm sm:grid-cols-2 lg:grid-cols-1">
                {PROFESSIONS.slice(0, 10).map((p) => (
                  <li key={p.slug}><Link className="text-paper/70 transition-colors hover:text-acid" to={`/examples/${p.slug}`}>{p.title} Resume</Link></li>
                ))}
              </ul>
              <Link to="/examples" className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-acid">All 20 examples <Icon name="arrow" size={14} /></Link>
            </div>
            <div>
              <h3 className="kicker text-acid">More examples</h3>
              <ul className="mt-4 grid grid-cols-1 gap-1.5 text-sm sm:grid-cols-2 lg:grid-cols-1">
                {PROFESSIONS.slice(10).map((p) => (
                  <li key={p.slug}><Link className="text-paper/70 transition-colors hover:text-acid" to={`/examples/${p.slug}`}>{p.title} Resume</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="kicker text-acid">CV rules by country</h3>
              <ul className="mt-4 grid grid-cols-2 gap-1.5 text-sm">
                {COUNTRIES.map((c) => (
                  <li key={c.code}><Link className="text-paper/70 transition-colors hover:text-acid" to={`/countries/${c.code}`}>{c.name}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-paper/15 pt-6 text-xs text-paper/50 sm:flex-row sm:items-center">
            <p>© 2026 ResumeBuild. Built for job seekers in every market.</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <Link to="/builder" className="hover:text-acid">Builder</Link>
              <Link to="/pricing" className="hover:text-acid">Pricing</Link>
              <Link to="/privacy" className="hover:text-acid">Privacy</Link>
              <Link to="/terms" className="hover:text-acid">Terms</Link>
              <a href="/sitemap.xml" className="hover:text-acid">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
