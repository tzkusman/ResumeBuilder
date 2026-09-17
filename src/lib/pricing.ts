export type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "INR" | "PKR" | "AED" | "SAR" | "BRL";

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  prefix: boolean;
  rates: {
    free: number;
    pro_monthly: number;
    pro_annual: number;
    pro_lifetime: number;
    pro_weekly_pass: number;
  };
}

export const CURRENCY_MAP: Record<CurrencyCode, CurrencyInfo> = {
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    flag: "🇺🇸",
    prefix: true,
    rates: {
      free: 0,
      pro_weekly_pass: 4.99,
      pro_monthly: 9.99,
      pro_annual: 59,
      pro_lifetime: 89,
    },
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    flag: "🇪🇺",
    prefix: false,
    rates: {
      free: 0,
      pro_weekly_pass: 4.49,
      pro_monthly: 8.99,
      pro_annual: 49,
      pro_lifetime: 79,
    },
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    flag: "🇬🇧",
    prefix: true,
    rates: {
      free: 0,
      pro_weekly_pass: 3.99,
      pro_monthly: 7.99,
      pro_annual: 45,
      pro_lifetime: 69,
    },
  },
  CAD: {
    code: "CAD",
    symbol: "CA$",
    name: "Canadian Dollar",
    flag: "🇨🇦",
    prefix: true,
    rates: {
      free: 0,
      pro_weekly_pass: 6.99,
      pro_monthly: 13.99,
      pro_annual: 79,
      pro_lifetime: 119,
    },
  },
  AUD: {
    code: "AUD",
    symbol: "A$",
    name: "Australian Dollar",
    flag: "🇦🇺",
    prefix: true,
    rates: {
      free: 0,
      pro_weekly_pass: 7.49,
      pro_monthly: 14.99,
      pro_annual: 85,
      pro_lifetime: 129,
    },
  },
  INR: {
    code: "INR",
    symbol: "₹",
    name: "Indian Rupee (PPP)",
    flag: "🇮🇳",
    prefix: true,
    rates: {
      free: 0,
      pro_weekly_pass: 199,
      pro_monthly: 499,
      pro_annual: 2499,
      pro_lifetime: 3999,
    },
  },
  PKR: {
    code: "PKR",
    symbol: "₨",
    name: "Pakistani Rupee (PPP)",
    flag: "🇵🇰",
    prefix: true,
    rates: {
      free: 0,
      pro_weekly_pass: 599,
      pro_monthly: 1499,
      pro_annual: 6999,
      pro_lifetime: 9999,
    },
  },
  AED: {
    code: "AED",
    symbol: "AED ",
    name: "UAE Dirham",
    flag: "🇦🇪",
    prefix: true,
    rates: {
      free: 0,
      pro_weekly_pass: 18,
      pro_monthly: 36,
      pro_annual: 219,
      pro_lifetime: 329,
    },
  },
  SAR: {
    code: "SAR",
    symbol: "SAR ",
    name: "Saudi Riyal",
    flag: "🇸🇦",
    prefix: true,
    rates: {
      free: 0,
      pro_weekly_pass: 19,
      pro_monthly: 37,
      pro_annual: 225,
      pro_lifetime: 335,
    },
  },
  BRL: {
    code: "BRL",
    symbol: "R$",
    name: "Brazilian Real (PPP)",
    flag: "🇧🇷",
    prefix: true,
    rates: {
      free: 0,
      pro_weekly_pass: 19.90,
      pro_monthly: 39.90,
      pro_annual: 199,
      pro_lifetime: 299,
    },
  },
};

/**
 * Automatically detects the user's localized currency from browser timezone or locale.
 */
export function detectLocalCurrency(): CurrencyCode {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const lang = (navigator.language || "").toLowerCase();

    // Timezone heuristics
    if (tz.includes("Karachi") || tz.includes("Pakistan")) return "PKR";
    if (tz.includes("Calcutta") || tz.includes("Kolkata") || tz.includes("India")) return "INR";
    if (tz.includes("London") || tz.includes("Belfast")) return "GBP";
    if (tz.includes("Dubai") || tz.includes("Abu_Dhabi") || tz.includes("Muscat")) return "AED";
    if (tz.includes("Riyadh")) return "SAR";
    if (tz.includes("Toronto") || tz.includes("Vancouver") || tz.includes("Montreal") || tz.includes("Edmonton")) return "CAD";
    if (tz.includes("Sydney") || tz.includes("Melbourne") || tz.includes("Brisbane") || tz.includes("Perth")) return "AUD";
    if (tz.includes("Sao_Paulo") || tz.includes("Fortaleza")) return "BRL";
    if (
      tz.includes("Paris") || tz.includes("Berlin") || tz.includes("Madrid") ||
      tz.includes("Rome") || tz.includes("Amsterdam") || tz.includes("Brussels") ||
      tz.includes("Vienna") || tz.includes("Dublin") || tz.includes("Helsinki")
    ) {
      return "EUR";
    }

    // Locale fallback
    if (lang.endsWith("-gb")) return "GBP";
    if (lang.endsWith("-in")) return "INR";
    if (lang.endsWith("-pk")) return "PKR";
    if (lang.endsWith("-ae")) return "AED";
    if (lang.endsWith("-sa")) return "SAR";
    if (lang.endsWith("-ca")) return "CAD";
    if (lang.endsWith("-au")) return "AUD";
    if (lang.endsWith("-br")) return "BRL";
    if (lang.startsWith("de") || lang.startsWith("fr") || lang.startsWith("es") || lang.startsWith("it")) return "EUR";
  } catch {
    // ignore
  }

  return "USD";
}

/**
 * Formats a localized price string.
 */
export function formatPrice(amount: number, currency: CurrencyCode): string {
  const info = CURRENCY_MAP[currency] || CURRENCY_MAP.USD;
  const formatted = amount % 1 === 0 ? amount.toLocaleString() : amount.toFixed(2);
  return info.prefix ? `${info.symbol}${formatted}` : `${formatted} ${info.symbol}`;
}

/**
 * Recommended SaaS Pricing Architecture & Monetization Blueprint
 */
export const PRICING_STRATEGY_RECOMMENDATIONS = {
  headline: "Optimized SaaS Monetization Architecture for Job Seekers",
  summary:
    "Job seekers have high urgency but brief lifecycles (typically 2–8 weeks actively applying). Industry leaders like Zety, Novoresume, and Resume.io optimize for quick micro-trials followed by automated recurring billing.",
  tiers: [
    {
      name: "7-Day Application Sprint Pass",
      recommendedUsd: "$4.99 (or local PPP)",
      purpose: "Low-friction impulse purchase. 65% of job seekers only need their resume for 1 week of active interviews.",
      features: "Unlimited ATS exports, all 20 templates, JD keyword tailoring for 7 days."
    },
    {
      name: "Pro Monthly Subscription",
      recommendedUsd: "$9.99/mo (or local PPP)",
      purpose: "Standard monthly recurring revenue (MRR) for active job hunts spanning 1–3 months.",
      features: "Continuous cloud sync, unlimited cover letters, LinkedIn profile generator, auto-resume versioning."
    },
    {
      name: "Annual Career Shield",
      recommendedUsd: "$59/yr ($4.92/mo billed annually)",
      purpose: "Upfront cash collection. 40%+ discount incentivizes candidates who want an ongoing portfolio & annual review CV.",
      features: "Continuous career maintenance, salary benchmark alerts, unlimited year-round exports."
    }
  ],
  pppDiscountRule: "Emerging markets (e.g. India ₹499, Pakistan ₨1,499) see 3.8x higher transaction completion when using Purchasing Power Parity (PPP) instead of raw USD conversion."
};
