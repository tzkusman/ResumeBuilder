/**
 * Analytics & conversion tracking.
 * GA4 is loaded in index.html — replace G-XXXXXXXXXX with your Measurement ID.
 * All conversion events funnel through track() so they fire consistently
 * whether or not GA4 is configured (they also queue to window.dataLayer).
 *
 * Conversion events wired in this app:
 *  - sign_up            → account created (Supabase Auth)
 *  - login              → returning user
 *  - resume_download    → PDF / DOCX / TXT export (params: format)
 *  - purchase           → payment completed (params: value, plan)
 *  - generate_lead      → pre-filled builder CTA from an SEO example page
 *  - ats_score          → ATS report generated (params: score)
 *  - template_select    → template chosen (params: template)
 *  - share              → shareable link created
 *  - cta_click          → generic CTA (params: label)
 */

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type ConversionEvent =
  | "sign_up" | "login" | "resume_download" | "purchase" | "generate_lead"
  | "ats_score" | "template_select" | "share" | "cta_click" | "page_view";

export function track(event: ConversionEvent, params: Record<string, string | number | boolean> = {}) {
  const payload = { ...params, ts: Date.now() };
  try {
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag === "function") {
      window.gtag("event", event, payload);
    } else {
      window.dataLayer.push({ event, ...payload });
    }
  } catch {
    /* analytics must never break the app */
  }
  if (import.meta.env.DEV) console.debug("[analytics]", event, payload);
}

export const trackDownload = (format: "pdf" | "docx" | "txt") => track("resume_download", { format });
export const trackPurchase = (plan: string, value: number) => track("purchase", { plan, value, currency: "USD" });
export const trackPageView = (path: string) => track("page_view", { page_path: path });
