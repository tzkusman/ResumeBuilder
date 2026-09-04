import { useEffect } from "react";
import { BrowserRouter, HashRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import { AppProviders } from "./store/AppStore";
import Home from "./pages/Home";
import Builder from "./pages/Builder";
import { ExamplesIndex, ExamplePage } from "./pages/Examples";
import { CountriesIndex, CountryPage } from "./pages/Countries";
import { TemplatesPage, CoverLetterPage, PricingPage, AuthPage, SharedPage, LegalPage, NotFoundPage } from "./pages/Misc";
import { trackPageView } from "./lib/analytics";

function RouteEffects() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    trackPageView(pathname);
  }, [pathname]);
  return null;
}

// Clean SEO URLs on Vercel + local dev; hash routing keeps the app working
// inside static preview sandboxes that serve index.html from a nested path.
const host = typeof window !== "undefined" ? window.location.hostname : "";
const useCleanUrls = host === "localhost" || host === "127.0.0.1" || host.endsWith("vercel.app");
const Router = useCleanUrls ? BrowserRouter : HashRouter;

// Country-specific routes for programmatic SEO and localized experience
const COUNTRY_CODES = ["us", "gb", "ca", "au", "de", "fr", "nl", "es", "ae", "sa", "pk", "in", "sg", "jp", "za", "br"];

export default function App() {
  return (
    <AppProviders>
      <Router>
        <RouteEffects />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/builder" element={<Builder />} />
            
            {/* Country-specific routes for localized SEO */}
            {COUNTRY_CODES.map((code) => (
              <Route key={code} path={`/${code}`} element={<Navigate to={`/countries/${code}`} replace />} />
            ))}
            {COUNTRY_CODES.map((code) => (
              <Route key={code} path={`/${code}/cv-resume`} element={<Navigate to={`/countries/${code}`} replace />} />
            ))}
            
            <Route path="/examples" element={<ExamplesIndex />} />
            <Route path="/examples/:slug" element={<ExamplePage />} />
            <Route path="/countries" element={<CountriesIndex />} />
            <Route path="/countries/:code" element={<CountryPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/cover-letter" element={<CoverLetterPage />} />
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
