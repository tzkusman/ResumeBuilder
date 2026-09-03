import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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

export default function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <RouteEffects />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/builder" element={<Builder />} />
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
      </BrowserRouter>
    </AppProviders>
  );
}
