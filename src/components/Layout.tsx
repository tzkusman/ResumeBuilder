import { useState, useRef, useEffect, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Icon } from "./ui";
import { useAuth, useI18n } from "../store/AppStore";
import { PROFESSIONS } from "../data/professions";
import { COUNTRIES } from "../data/countries";
import { isSupabaseConfigured } from "../lib/supabase";
import { LANGUAGE_NAMES, type LanguageCode } from "../lib/i18n";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const { user, logout, isPro } = useAuth();
  const { lang, setLang, t, getRoleTitle, getCountryName } = useI18n();
  const loc = useLocation();
  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on location change or click outside
  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    setLangMenuOpen(false);
  }, [loc.pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
        setLangMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages: LanguageCode[] = ["en", "hi", "es", "fr", "de", "pt", "ar", "zh", "ja"];

  const toggleDropdown = (name: string) => {
    setActiveDropdown((cur) => (cur === name ? null : name));
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b-2 border-ink/90 bg-paper/92 backdrop-blur-md">
        <div ref={navRef} className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Wordmark />

          {/* Desktop Navigation with Dropdowns */}
          <nav className="hidden items-center gap-1 xl:gap-2 lg:flex">
            {/* Templates & Examples Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("templates")}
                className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold transition-colors rounded-none ${
                  activeDropdown === "templates" || loc.pathname.startsWith("/templates") || loc.pathname.startsWith("/examples")
                    ? "border-b-2 border-pine text-pine-deep font-bold"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                <span>Templates & Examples</span>
                <Icon name="chev" size={13} className={`transition-transform duration-200 ${activeDropdown === "templates" ? "rotate-180" : ""}`} />
              </button>

              {activeDropdown === "templates" && (
                <div className="absolute left-0 top-full z-50 mt-1 w-[560px] border-2 border-ink bg-card p-5 shadow-[6px_6px_0_0_var(--color-ink)] grid grid-cols-2 gap-6">
                  {/* Templates Column */}
                  <div>
                    <div className="flex items-center justify-between border-b border-ink/15 pb-2">
                      <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-pine">
                        Resume Templates
                      </span>
                      <Link to="/templates" className="text-[11px] font-bold text-ink hover:underline">
                        All 20 →
                      </Link>
                    </div>
                    <ul className="mt-3 space-y-1.5 text-xs">
                      <li>
                        <Link to="/templates" className="block p-1.5 font-semibold text-ink hover:bg-acid-soft">
                          <span className="font-bold">Browse All Templates</span>
                          <span className="block text-[10.5px] text-ink-soft font-normal">20 ATS-safe formats for all seniority levels</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/templates?country=us" className="block p-1.5 font-semibold text-ink hover:bg-acid-soft">
                          <span className="font-bold">US 1-Page ATS Standard</span>
                          <span className="block text-[10.5px] text-ink-soft font-normal">Merit & Atlas single-column parser proof</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/templates?country=gb" className="block p-1.5 font-semibold text-ink hover:bg-acid-soft">
                          <span className="font-bold">UK 2-Page British CV</span>
                          <span className="block text-[10.5px] text-ink-soft font-normal">Classic & Corporate with personal statement</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/templates?country=de" className="block p-1.5 font-semibold text-ink hover:bg-acid-soft">
                          <span className="font-bold">Germany / DACH Lebenslauf</span>
                          <span className="block text-[10.5px] text-ink-soft font-normal">Structured tabular milestones format</span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Examples Column */}
                  <div className="border-l border-ink/10 pl-5">
                    <div className="flex items-center justify-between border-b border-ink/15 pb-2">
                      <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-pine">
                        Role Examples
                      </span>
                      <Link to="/examples" className="text-[11px] font-bold text-ink hover:underline">
                        View All →
                      </Link>
                    </div>
                    <ul className="mt-3 space-y-1 text-xs">
                      {PROFESSIONS.slice(0, 6).map((p) => (
                        <li key={p.slug}>
                          <Link
                            to={`/examples/${p.slug}`}
                            className="block px-2 py-1 font-semibold text-ink hover:bg-acid-soft transition-colors"
                          >
                            {getRoleTitle(p.slug, p.title)}
                          </Link>
                        </li>
                      ))}
                      <li className="pt-2 border-t border-ink/10">
                        <Link
                          to="/cover-letter-examples"
                          className="block px-2 py-1 font-bold text-pine hover:bg-acid-soft"
                        >
                          Cover Letter Examples Library →
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Countries Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("countries")}
                className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold transition-colors ${
                  activeDropdown === "countries" || loc.pathname.startsWith("/countries")
                    ? "border-b-2 border-pine text-pine-deep font-bold"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                <span>Countries</span>
                <Icon name="chev" size={13} className={`transition-transform duration-200 ${activeDropdown === "countries" ? "rotate-180" : ""}`} />
              </button>

              {activeDropdown === "countries" && (
                <div className="absolute left-0 top-full z-50 mt-1 w-[480px] border-2 border-ink bg-card p-5 shadow-[6px_6px_0_0_var(--color-ink)]">
                  <div className="flex items-center justify-between border-b border-ink/15 pb-2">
                    <div>
                      <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-pine">
                        Country-Specific Hiring Standards
                      </span>
                      <p className="text-[11px] text-ink-soft">Choose country to select compliant templates & advice</p>
                    </div>
                    <Link to="/countries" className="text-xs font-bold text-ink hover:underline">
                      All 21 Countries →
                    </Link>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    {[
                      { code: "us", label: "United States (US Resume)", desc: "1-Page ATS · No photo" },
                      { code: "gb", label: "United Kingdom (UK CV)", desc: "2-Page · Personal statement" },
                      { code: "ca", label: "Canada (Canadian Resume)", desc: "Bilingual · Chronological" },
                      { code: "de", label: "Germany (Lebenslauf)", desc: "Structured · Photo standard" },
                      { code: "au", label: "Australia (Australian CV)", desc: "Comprehensive · Work rights" },
                      { code: "fr", label: "France (CV Français)", desc: "Compact 1-Page · CEFR levels" },
                      { code: "ae", label: "UAE & Gulf (Middle East)", desc: "Executive · Visa capabilities" },
                      { code: "in", label: "India (Indian Resume)", desc: "Tech degrees · Certifications" }
                    ].map((item) => (
                      <Link
                        key={item.code}
                        to={`/templates?country=${item.code}`}
                        className="p-2 border border-ink/10 bg-white hover:border-ink hover:bg-acid-soft transition-colors"
                      >
                        <div className="font-bold text-ink">{item.label}</div>
                        <div className="text-[10px] text-ink-soft">{item.desc}</div>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-3 border-t border-ink/10 pt-2 flex items-center justify-between text-xs font-semibold">
                    <Link to="/countries" className="text-pine hover:underline">
                      Explore detailed country hiring guides & visa rules →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Tools & ATS Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("tools")}
                className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold transition-colors ${
                  activeDropdown === "tools" ||
                  loc.pathname.startsWith("/ats-checker") ||
                  loc.pathname.startsWith("/job-matcher") ||
                  loc.pathname.startsWith("/salary-calculator") ||
                  loc.pathname.startsWith("/linkedin-generator")
                    ? "border-b-2 border-pine text-pine-deep font-bold"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                <span>Tools & ATS</span>
                <Icon name="chev" size={13} className={`transition-transform duration-200 ${activeDropdown === "tools" ? "rotate-180" : ""}`} />
              </button>

              {activeDropdown === "tools" && (
                <div className="absolute left-0 top-full z-50 mt-1 w-[420px] border-2 border-ink bg-card p-4 shadow-[6px_6px_0_0_var(--color-ink)] space-y-1.5">
                  <Link
                    to="/ats-checker"
                    className="block p-2.5 border border-ink/10 bg-white hover:border-ink hover:bg-acid-soft transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-ink">ATS Resume Scanner</span>
                      <span className="font-mono text-[9.5px] bg-acid px-1.5 py-0.5 uppercase font-bold text-ink">Audit</span>
                    </div>
                    <p className="text-xs text-ink-soft mt-0.5">30+ criteria scan, table risk detection, and parse score</p>
                  </Link>

                  <Link
                    to="/job-matcher"
                    className="block p-2.5 border border-ink/10 bg-white hover:border-ink hover:bg-acid-soft transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-ink">Job Description Keyword Matcher</span>
                      <span className="font-mono text-[9.5px] bg-pine text-paper px-1.5 py-0.5 uppercase font-bold">SEO</span>
                    </div>
                    <p className="text-xs text-ink-soft mt-0.5">Compare resume against job posting keywords & requirements</p>
                  </Link>

                  <Link
                    to="/salary-calculator"
                    className="block p-2.5 border border-ink/10 bg-white hover:border-ink hover:bg-acid-soft transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-ink">Salary Insights & Benchmark Calculator</span>
                      <span className="font-mono text-[9.5px] bg-acid-soft text-pine-deep px-1.5 py-0.5 uppercase font-bold">New</span>
                    </div>
                    <p className="text-xs text-ink-soft mt-0.5">Real-time compensation bands by role, seniority, and metro city</p>
                  </Link>

                  <Link
                    to="/linkedin-generator"
                    className="block p-2.5 border border-ink/10 bg-white hover:border-ink hover:bg-acid-soft transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-ink">LinkedIn Headline & Summary Generator</span>
                      <span className="font-mono text-[9.5px] bg-acid-soft text-pine-deep px-1.5 py-0.5 uppercase font-bold">New</span>
                    </div>
                    <p className="text-xs text-ink-soft mt-0.5">Recruiter search-optimized headlines under 220 chars & About summaries</p>
                  </Link>

                  <Link
                    to="/cover-letter"
                    className="block p-2.5 border border-ink/10 bg-white hover:border-ink hover:bg-acid-soft transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-ink">Cover Letter Builder</span>
                      <span className="font-mono text-[9.5px] text-ink-soft">DOCX/PDF</span>
                    </div>
                    <p className="text-xs text-ink-soft mt-0.5">Instant matching cover letter crafted with the same design system</p>
                  </Link>

                  <Link
                    to="/action-verbs"
                    className="block p-2.5 border border-ink/10 bg-white hover:border-ink hover:bg-acid-soft transition-colors"
                  >
                    <span className="font-bold text-sm text-ink">Power Action Verbs Directory</span>
                    <p className="text-xs text-ink-soft mt-0.5">250+ categorized executive action verbs with Google X-Y-Z formula</p>
                  </Link>
                </div>
              )}
            </div>

            {/* Direct Links */}
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-semibold transition-colors ${
                  isActive ? "border-b-2 border-pine text-pine-deep font-bold" : "text-ink-soft hover:text-ink"
                }`
              }
            >
              Blog
            </NavLink>

            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-semibold transition-colors ${
                  isActive ? "border-b-2 border-pine text-pine-deep font-bold" : "text-ink-soft hover:text-ink"
                }`
              }
            >
              Pricing
            </NavLink>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 border border-ink/25 bg-card px-2.5 py-1.5 font-mono text-[11px] font-semibold text-ink-soft transition-colors hover:border-ink hover:text-ink"
                aria-label="Select Language"
              >
                <Icon name="globe" size={13} />
                {LANGUAGE_NAMES[lang as LanguageCode]?.split(" ")[0] || "EN"}
                <Icon name="chev" size={12} />
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-1.5 max-h-80 w-48 overflow-y-auto border-2 border-ink bg-card shadow-lg">
                  {languages.map((code) => (
                    <button
                      key={code}
                      onClick={() => {
                        setLang(code);
                        setLangMenuOpen(false);
                      }}
                      className={`block w-full px-3 py-2 text-left text-xs font-semibold transition-colors hover:bg-acid-soft ${
                        lang === code ? "bg-ink text-acid" : "text-ink-soft"
                      }`}
                    >
                      {LANGUAGE_NAMES[code]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isPro && (
              <span className="hidden border border-acid bg-acid-soft px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-pine-deep md:inline">
                Pro
              </span>
            )}

            {user ? (
              <button
                onClick={() => void logout()}
                className="hidden border border-ink/25 px-3 py-2 text-sm font-semibold text-ink-soft transition-colors hover:border-ink hover:text-ink sm:block"
              >
                {user.email.split("@")[0]} · {t("nav.signout")}
              </button>
            ) : (
              <Link
                to="/auth"
                className="hidden border border-ink/25 px-3 py-2 text-sm font-semibold text-ink-soft transition-colors hover:border-ink hover:text-ink sm:block"
              >
                {t("nav.signin")}
              </Link>
            )}

            <Link
              to="/builder"
              className="hs-sm hidden border-2 border-ink bg-acid px-4 py-2 text-sm font-bold text-ink transition-all hover:-translate-y-0.5 hover:shadow-[5px_7px_0_0_var(--color-ink)] active:translate-y-0 sm:block"
            >
              {t("nav.build")}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="grid h-10 w-10 place-items-center border-2 border-ink bg-card lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <Icon name={mobileMenuOpen ? "x" : "menu"} size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="border-t-2 border-ink/90 bg-paper px-4 py-5 lg:hidden max-h-[85vh] overflow-y-auto space-y-4">
            <Link
              to="/builder"
              onClick={() => setMobileMenuOpen(false)}
              className="block border-2 border-ink bg-acid px-4 py-3 text-center text-sm font-bold text-ink shadow-[4px_4px_0_0_var(--color-ink)]"
            >
              {t("nav.build")} →
            </Link>

            {/* Section: Templates & Examples */}
            <div className="border border-ink/20 bg-card p-3.5 space-y-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-pine block">
                Templates & Examples
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link to="/templates" onClick={() => setMobileMenuOpen(false)} className="p-2 border border-ink/15 bg-white font-bold">
                  All 20 Templates
                </Link>
                <Link to="/examples" onClick={() => setMobileMenuOpen(false)} className="p-2 border border-ink/15 bg-white font-bold">
                  Role Examples
                </Link>
                <Link to="/cover-letter" onClick={() => setMobileMenuOpen(false)} className="p-2 border border-ink/15 bg-white font-bold">
                  Cover Letter Builder
                </Link>
                <Link to="/cover-letter-examples" onClick={() => setMobileMenuOpen(false)} className="p-2 border border-ink/15 bg-white font-bold">
                  Cover Letter Library
                </Link>
              </div>
            </div>

            {/* Section: Countries */}
            <div className="border border-ink/20 bg-card p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-pine">
                  Country Formats
                </span>
                <Link to="/countries" onClick={() => setMobileMenuOpen(false)} className="text-[11px] font-bold text-ink underline">
                  All 21
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <Link to="/templates?country=us" onClick={() => setMobileMenuOpen(false)} className="p-1.5 border border-ink/10 bg-white">
                  🇺🇸 United States
                </Link>
                <Link to="/templates?country=gb" onClick={() => setMobileMenuOpen(false)} className="p-1.5 border border-ink/10 bg-white">
                  🇬🇧 United Kingdom
                </Link>
                <Link to="/templates?country=ca" onClick={() => setMobileMenuOpen(false)} className="p-1.5 border border-ink/10 bg-white">
                  🇨🇦 Canada
                </Link>
                <Link to="/templates?country=de" onClick={() => setMobileMenuOpen(false)} className="p-1.5 border border-ink/10 bg-white">
                  🇩🇪 Germany
                </Link>
                <Link to="/templates?country=au" onClick={() => setMobileMenuOpen(false)} className="p-1.5 border border-ink/10 bg-white">
                  🇦🇺 Australia
                </Link>
                <Link to="/templates?country=fr" onClick={() => setMobileMenuOpen(false)} className="p-1.5 border border-ink/10 bg-white">
                  🇫🇷 France
                </Link>
              </div>
            </div>

            {/* Section: Tools */}
            <div className="border border-ink/20 bg-card p-3.5 space-y-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-pine block">
                ATS & Career Tools
              </span>
              <div className="space-y-1.5 text-xs">
                <Link to="/ats-checker" onClick={() => setMobileMenuOpen(false)} className="block p-2 border border-ink/15 bg-white font-bold">
                  ATS Resume Scanner & Score Checker
                </Link>
                <Link to="/job-matcher" onClick={() => setMobileMenuOpen(false)} className="block p-2 border border-ink/15 bg-white font-bold">
                  Job Description Keyword Matcher
                </Link>
                <Link to="/salary-calculator" onClick={() => setMobileMenuOpen(false)} className="block p-2 border border-ink/15 bg-white font-bold">
                  Salary Benchmark Calculator <span className="text-pine font-mono text-[9px]">NEW</span>
                </Link>
                <Link to="/linkedin-generator" onClick={() => setMobileMenuOpen(false)} className="block p-2 border border-ink/15 bg-white font-bold">
                  LinkedIn Headline & Summary Generator <span className="text-pine font-mono text-[9px]">NEW</span>
                </Link>
                <Link to="/action-verbs" onClick={() => setMobileMenuOpen(false)} className="block p-2 border border-ink/15 bg-white font-bold">
                  Action Verbs Directory (250+)
                </Link>
              </div>
            </div>

            {/* Direct Links */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="p-2 border border-ink/20 bg-card text-center font-bold">
                Career Blog
              </Link>
              <Link to="/faq" onClick={() => setMobileMenuOpen(false)} className="p-2 border border-ink/20 bg-card text-center font-bold">
                ATS FAQ
              </Link>
              <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="p-2 border border-ink/20 bg-card text-center font-bold">
                Pricing
              </Link>
              {!user && (
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="p-2 border border-ink/20 bg-card text-center font-bold">
                  {t("nav.signin")}
                </Link>
              )}
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
                <span className="grid h-9 w-9 place-items-center border-2 border-acid bg-acid text-ink">
                  <Icon name="logo" size={20} />
                </span>
                <span className="font-display text-2xl font-black">
                  Resume<span className="text-acid">Build</span>
                </span>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/70">
                {t("footer.tagline")}
                {!isSupabaseConfigured && " Local preview mode."}
              </p>
              <div className="mt-5 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-widest text-acid">
                <span className="border border-acid/40 px-2 py-1">GDPR-ready</span>
                <span className="border border-acid/40 px-2 py-1">No data sold</span>
                <span className="border border-acid/40 px-2 py-1">{LANGUAGE_NAMES[lang as LanguageCode]}</span>
              </div>
            </div>
            <div>
              <h3 className="kicker text-acid">{t("nav.examples")}</h3>
              <ul className="mt-4 grid grid-cols-1 gap-1.5 text-sm sm:grid-cols-2 lg:grid-cols-1">
                {PROFESSIONS.slice(0, 8).map((p) => (
                  <li key={p.slug}>
                    <Link className="text-paper/70 transition-colors hover:text-acid" to={`/examples/${p.slug}`}>
                      {getRoleTitle(p.slug, p.title)}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link to="/examples" className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-acid">
                {t("examples.browse")} <Icon name="arrow" size={14} />
              </Link>
            </div>
            <div>
              <h3 className="kicker text-acid">{t("footer.product")}</h3>
              <ul className="mt-4 grid grid-cols-1 gap-1.5 text-sm sm:grid-cols-2 lg:grid-cols-1">
                <li><Link className="text-paper/70 transition-colors hover:text-acid" to="/builder">{t("nav.build")}</Link></li>
                <li><Link className="text-paper/70 transition-colors hover:text-acid" to="/ats-checker">{t("nav.ats")}</Link></li>
                <li><Link className="text-paper/70 transition-colors hover:text-acid" to="/job-matcher">{t("nav.jobMatch")}</Link></li>
                <li><Link className="text-paper/70 transition-colors hover:text-acid" to="/salary-calculator">Salary Calculator</Link></li>
                <li><Link className="text-paper/70 transition-colors hover:text-acid" to="/linkedin-generator">LinkedIn Generator</Link></li>
                <li><Link className="text-paper/70 transition-colors hover:text-acid" to="/templates">{t("nav.templates")}</Link></li>
                <li><Link className="text-paper/70 transition-colors hover:text-acid" to="/cover-letter">{t("nav.cover")}</Link></li>
                <li><Link className="text-paper/70 transition-colors hover:text-acid" to="/cover-letter-examples">Cover Letter Examples</Link></li>
                <li><Link className="text-paper/70 transition-colors hover:text-acid" to="/action-verbs">{t("nav.actionVerbs")}</Link></li>
                <li><Link className="text-paper/70 transition-colors hover:text-acid" to="/blog">{t("nav.blog")}</Link></li>
                <li><Link className="text-paper/70 transition-colors hover:text-acid" to="/faq">{t("nav.faq")}</Link></li>
                <li><Link className="text-paper/70 transition-colors hover:text-acid" to="/pricing">{t("nav.pricing")}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="kicker text-acid">{t("nav.countries")}</h3>
              <ul className="mt-4 grid grid-cols-2 gap-1.5 text-sm">
                {COUNTRIES.slice(0, 10).map((c) => (
                  <li key={c.code}>
                    <Link className="text-paper/70 transition-colors hover:text-acid" to={`/countries/${c.code}`}>
                      {getCountryName(c.code, c.name)}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link to="/countries" className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-acid">
                All 21 Countries →
              </Link>
            </div>
          </div>
          <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-paper/15 pt-6 text-xs text-paper/50 sm:flex-row sm:items-center">
            <p>{t("footer.copyright")}</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <Link to="/builder" className="hover:text-acid">{t("builder.tab.contact")}</Link>
              <Link to="/blog" className="hover:text-acid">{t("nav.blog")}</Link>
              <Link to="/faq" className="hover:text-acid">{t("nav.faq")}</Link>
              <Link to="/pricing" className="hover:text-acid">{t("nav.pricing")}</Link>
              <Link to="/privacy" className="hover:text-acid">{t("footer.privacy")}</Link>
              <Link to="/terms" className="hover:text-acid">{t("footer.terms")}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
