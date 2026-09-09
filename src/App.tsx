import { useEffect } from "react";
import { BrowserRouter, HashRouter, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import { AppProviders } from "./store/AppStore";
import Home from "./pages/Home";
import Builder from "./pages/Builder";
import ATSChecker from "./pages/ATSChecker";
import { ExamplesIndex, ExamplePage } from "./pages/Examples";
import { CountriesIndex, CountryPage } from "./pages/Countries";
import { TemplatesPage, CoverLetterPage, PricingPage, AuthPage, SharedPage, LegalPage, NotFoundPage } from "./pages/Misc";
import { BlogIndex, BlogPostPage } from "./pages/Blog";
import JobMatcherPage from "./pages/JobMatcher";
import ActionVerbsPage from "./pages/ActionVerbs";
import CoverLetterExamplesPage from "./pages/CoverLetterExamples";
import FAQPage from "./pages/FAQ";
import SalaryCalculator from "./pages/SalaryCalculator";
import LinkedInGenerator from "./pages/LinkedInGenerator";
import { trackPageView } from "./lib/analytics";

function RouteEffects() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Seamlessly transition legacy hash URLs (e.g. /#/ats-checker -> /ats-checker)
    if (typeof window !== "undefined" && window.location.hash.startsWith("#/")) {
      const target = window.location.hash.slice(1);
      window.history.replaceState(null, "", target);
      navigate(target, { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    trackPageView(pathname);
  }, [pathname]);
  return null;
}

// Clean SEO URLs on Vercel, Cloud Run, custom domains, and local dev;
// Hash routing is only used when served directly as static file:// protocol.
const isFileProto = typeof window !== "undefined" && window.location.protocol === "file:";
const Router = isFileProto ? HashRouter : BrowserRouter;

// Country-specific routes for programmatic SEO and localized experience
const COUNTRY_CODES = ["us", "gb", "ca", "au", "de", "fr", "nl", "es", "ae", "sa", "pk", "in", "sg", "jp", "za", "br", "it", "mx", "ch", "ie", "nz"];

export default function App() {
  return (
    <AppProviders>
      <Router>
        <RouteEffects />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/builder" element={<Builder />} />
            <Route path="/ats-checker" element={<ATSChecker />} />
            
            {/* Country-specific routes for localized SEO */}
            {COUNTRY_CODES.map((code) => (
              <Route key={code} path={`/${code}`} element={<Navigate to={`/countries/${code}`} replace />} />
            ))}
            {COUNTRY_CODES.map((code) => (
              <Route key={`${code}-cv-resume`} path={`/${code}/cv-resume`} element={<Navigate to={`/countries/${code}`} replace />} />
            ))}
            
            <Route path="/examples" element={<ExamplesIndex />} />
            <Route path="/examples/:slug" element={<ExamplePage />} />
            <Route path="/countries" element={<CountriesIndex />} />
            <Route path="/countries/:code" element={<CountryPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/cover-letter" element={<CoverLetterPage />} />
            <Route path="/cover-letter-examples" element={<CoverLetterExamplesPage />} />
            <Route path="/job-matcher" element={<JobMatcherPage />} />
            <Route path="/salary-calculator" element={<SalaryCalculator />} />
            <Route path="/linkedin-generator" element={<LinkedInGenerator />} />
            <Route path="/action-verbs" element={<ActionVerbsPage />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/shared" element={<SharedPage />} />
            <Route path="/privacy" element={<LegalPage kind="privacy" />} />
            <Route path="/terms" element={<LegalPage kind="terms" />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
    </AppProviders>
  );
}
