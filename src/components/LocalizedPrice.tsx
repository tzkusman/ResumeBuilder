import React, { useEffect, useState, createContext, useContext } from "react";

const ZERO_DECIMAL = new Set(["JPY", "KRW", "VND", "CLP", "ISK", "HUF", "TWD"]);
const CACHE_KEY = "user-currency-v1";
const CACHE_TTL_MS = 1000 * 60 * 60 * 12; // 12h

export interface CurrencyContextType {
  currency: string;
  rate: number;
  countryName?: string;
  countryCode?: string;
  symbol?: string;
  isLoading: boolean;
  setManualCurrency: (currencyCode: string) => void;
  formatPrice: (usdPrice: number) => string;
}

// Fallback rates against USD in case API is blocked or offline
const FALLBACK_RATES: Record<string, { rate: number; country: string; symbol: string }> = {
  USD: { rate: 1, country: "United States", symbol: "$" },
  INR: { rate: 83.5, country: "India", symbol: "₹" },
  JPY: { rate: 155.0, country: "Japan", symbol: "¥" },
  EUR: { rate: 0.92, country: "Eurozone", symbol: "€" },
  GBP: { rate: 0.78, country: "United Kingdom", symbol: "£" },
  CAD: { rate: 1.36, country: "Canada", symbol: "CA$" },
  AUD: { rate: 1.52, country: "Australia", symbol: "A$" },
  SGD: { rate: 1.34, country: "Singapore", symbol: "S$" },
  AED: { rate: 3.67, country: "United Arab Emirates", symbol: "AED" },
  SAR: { rate: 3.75, country: "Saudi Arabia", symbol: "SAR" },
  BRL: { rate: 5.45, country: "Brazil", symbol: "R$" },
  MXN: { rate: 18.2, country: "Mexico", symbol: "MX$" },
  CHF: { rate: 0.89, country: "Switzerland", symbol: "CHF" },
  CNY: { rate: 7.25, country: "China", symbol: "¥" },
  KRW: { rate: 1380, country: "South Korea", symbol: "₩" },
  NZD: { rate: 1.64, country: "New Zealand", symbol: "NZ$" },
  ZAR: { rate: 18.1, country: "South Africa", symbol: "R" },
  TRY: { rate: 32.8, country: "Turkey", symbol: "₺" },
  SEK: { rate: 10.5, country: "Sweden", symbol: "kr" },
  NOK: { rate: 10.6, country: "Norway", symbol: "kr" },
  PLN: { rate: 3.95, country: "Poland", symbol: "zł" },
  PHP: { rate: 58.5, country: "Philippines", symbol: "₱" },
  IDR: { rate: 16200, country: "Indonesia", symbol: "Rp" },
  MYR: { rate: 4.70, country: "Malaysia", symbol: "RM" },
  THB: { rate: 36.6, country: "Thailand", symbol: "฿" },
  VND: { rate: 25400, country: "Vietnam", symbol: "₫" },
  PKR: { rate: 278.0, country: "Pakistan", symbol: "Rs" },
  BDT: { rate: 117.0, country: "Bangladesh", symbol: "৳" },
  NGN: { rate: 1480, country: "Nigeria", symbol: "₦" },
  EGP: { rate: 47.5, country: "Egypt", symbol: "EGP" },
  KES: { rate: 129.0, country: "Kenya", symbol: "KSh" },
};

// Quick timezone to currency heuristics for zero-delay or blocked-IP environments
function detectCurrencyFromTimezone(): { currency: string; country: string } {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz.includes("Calcutta") || tz.includes("Kolkata") || tz.includes("India")) return { currency: "INR", country: "India" };
    if (tz.includes("Tokyo") || tz.includes("Japan")) return { currency: "JPY", country: "Japan" };
    if (tz.includes("London")) return { currency: "GBP", country: "United Kingdom" };
    if (tz.includes("Paris") || tz.includes("Berlin") || tz.includes("Rome") || tz.includes("Madrid") || tz.includes("Amsterdam") || tz.includes("Brussels") || tz.includes("Vienna")) return { currency: "EUR", country: "Europe" };
    if (tz.includes("Toronto") || tz.includes("Vancouver") || tz.includes("Montreal")) return { currency: "CAD", country: "Canada" };
    if (tz.includes("Sydney") || tz.includes("Melbourne") || tz.includes("Brisbane") || tz.includes("Perth")) return { currency: "AUD", country: "Australia" };
    if (tz.includes("Singapore")) return { currency: "SGD", country: "Singapore" };
    if (tz.includes("Dubai")) return { currency: "AED", country: "United Arab Emirates" };
    if (tz.includes("Riyadh")) return { currency: "SAR", country: "Saudi Arabia" };
    if (tz.includes("Sao_Paulo")) return { currency: "BRL", country: "Brazil" };
    if (tz.includes("Mexico_City")) return { currency: "MXN", country: "Mexico" };
    if (tz.includes("Seoul")) return { currency: "KRW", country: "South Korea" };
    if (tz.includes("Karachi")) return { currency: "PKR", country: "Pakistan" };
    if (tz.includes("Dhaka")) return { currency: "BDT", country: "Bangladesh" };
    if (tz.includes("Bangkok")) return { currency: "THB", country: "Thailand" };
    if (tz.includes("Jakarta")) return { currency: "IDR", country: "Indonesia" };
    if (tz.includes("Kuala_Lumpur")) return { currency: "MYR", country: "Malaysia" };
    if (tz.includes("Manila")) return { currency: "PHP", country: "Philippines" };
  } catch {
    // ignore
  }
  return { currency: "USD", country: "United States" };
}

export function formatCurrencyAmount(usdPrice: number, currency: string, rate: number): string {
  if (usdPrice === 0) {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(0);
    } catch {
      return "$0";
    }
  }

  if (currency === "USD" || rate <= 0) {
    return `$${usdPrice}`;
  }

  const converted = usdPrice * rate;
  let rounded: number;

  if (ZERO_DECIMAL.has(currency)) {
    // JPY, KRW, VND: e.g. $7 * 155 = 1085 -> ~1,090 or ~1,100
    if (converted > 5000) {
      rounded = Math.round(converted / 100) * 100;
    } else {
      rounded = Math.round(converted / 10) * 10;
    }
  } else if (converted > 500) {
    // INR, BRL, MXN, etc.: friendly 9-ending or 0-ending e.g. 599, 499, 6499
    rounded = Math.ceil(converted / 10) * 10 - 1;
    if (rounded < 0) rounded = Math.round(converted);
  } else if (converted < 20) {
    rounded = Math.ceil(converted);
  } else {
    rounded = Math.ceil(converted / 5) * 5 - 1;
    if (rounded < 0) rounded = Math.round(converted);
  }

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(rounded);
  } catch {
    return `${currency} ${rounded.toLocaleString()}`;
  }
}

export const CurrencyContext = createContext<CurrencyContextType>({
  currency: "USD",
  rate: 1,
  countryName: "United States",
  isLoading: false,
  setManualCurrency: () => {},
  formatPrice: (p) => `$${p}`,
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<string>("USD");
  const [rate, setRate] = useState<number>(1);
  const [countryName, setCountryName] = useState<string>("United States");
  const [countryCode, setCountryCode] = useState<string>("US");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    async function resolveCurrency() {
      // 1. Check session storage cache
      try {
        const cachedRaw = sessionStorage.getItem(CACHE_KEY);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          if (Date.now() - cached.ts < CACHE_TTL_MS && cached.currency && cached.rate) {
            if (!cancelled) {
              setCurrency(cached.currency);
              setRate(cached.rate);
              setCountryName(cached.countryName || cached.currency);
              setCountryCode(cached.countryCode || "");
              setIsLoading(false);
            }
            return;
          }
        }
      } catch {
        // ignore storage errors
      }

      // 2. Pre-seed with timezone heuristics for zero-latency UI
      const tzFallback = detectCurrencyFromTimezone();
      let detectedCurrency = tzFallback.currency;
      let detectedCountry = tzFallback.country;
      let detectedCountryCode = "";

      try {
        // IP Geolocation detection
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3500);

        const geoRes = await fetch("https://ipapi.co/json/", { signal: controller.signal });
        clearTimeout(timeout);

        if (geoRes.ok) {
          const geo = await geoRes.json();
          if (geo.currency && typeof geo.currency === "string") {
            detectedCurrency = geo.currency.toUpperCase();
          }
          if (geo.country_name) detectedCountry = geo.country_name;
          if (geo.country_code) detectedCountryCode = geo.country_code;
        }
      } catch {
        // Fallback to second geo provider if ipapi is rate-limited or blocked
        try {
          const controller2 = new AbortController();
          const timeout2 = setTimeout(() => controller2.abort(), 3000);
          const res2 = await fetch("https://ipwho.is/", { signal: controller2.signal });
          clearTimeout(timeout2);
          if (res2.ok) {
            const data2 = await res2.json();
            if (data2.currency?.code) {
              detectedCurrency = data2.currency.code.toUpperCase();
            }
            if (data2.country) detectedCountry = data2.country;
            if (data2.country_code) detectedCountryCode = data2.country_code;
          }
        } catch {
          // keep timezone fallback
        }
      }

      // If currency is USD
      if (detectedCurrency === "USD") {
        if (!cancelled) {
          setCurrency("USD");
          setRate(1);
          setCountryName(detectedCountry);
          setCountryCode(detectedCountryCode || "US");
          setIsLoading(false);
        }
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ currency: "USD", rate: 1, countryName: detectedCountry, countryCode: detectedCountryCode, ts: Date.now() }));
        } catch {}
        return;
      }

      // 3. Fetch live conversion rate for detected currency
      let resolvedRate = FALLBACK_RATES[detectedCurrency]?.rate || 1;

      try {
        const rateController = new AbortController();
        const rateTimeout = setTimeout(() => rateController.abort(), 3500);
        const rateRes = await fetch("https://open.er-api.com/v6/latest/USD", { signal: rateController.signal });
        clearTimeout(rateTimeout);

        if (rateRes.ok) {
          const rateData = await rateRes.json();
          if (rateData.rates && rateData.rates[detectedCurrency]) {
            resolvedRate = Number(rateData.rates[detectedCurrency]);
          }
        }
      } catch {
        // Use fallback rates table
        if (FALLBACK_RATES[detectedCurrency]) {
          resolvedRate = FALLBACK_RATES[detectedCurrency].rate;
        }
      }

      if (!cancelled) {
        setCurrency(detectedCurrency);
        setRate(resolvedRate);
        setCountryName(detectedCountry);
        setCountryCode(detectedCountryCode);
        setIsLoading(false);
      }

      try {
        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            currency: detectedCurrency,
            rate: resolvedRate,
            countryName: detectedCountry,
            countryCode: detectedCountryCode,
            ts: Date.now(),
          })
        );
      } catch {}
    }

    resolveCurrency();
    return () => {
      cancelled = true;
    };
  }, []);

  const setManualCurrency = async (newCurrency: string) => {
    const code = newCurrency.toUpperCase();
    let newRate = FALLBACK_RATES[code]?.rate || 1;
    const country = FALLBACK_RATES[code]?.country || code;

    setIsLoading(true);
    try {
      const rateRes = await fetch("https://open.er-api.com/v6/latest/USD");
      if (rateRes.ok) {
        const data = await rateRes.json();
        if (data.rates && data.rates[code]) {
          newRate = Number(data.rates[code]);
        }
      }
    } catch {
      // fallback
    }

    setCurrency(code);
    setRate(newRate);
    setCountryName(country);
    setIsLoading(false);

    try {
      sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          currency: code,
          rate: newRate,
          countryName: country,
          countryCode: "",
          ts: Date.now(),
        })
      );
    } catch {}
  };

  const formatPrice = (usdPrice: number) => {
    return formatCurrencyAmount(usdPrice, currency, rate);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        rate,
        countryName,
        countryCode,
        isLoading,
        setManualCurrency,
        formatPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

export interface LocalizedPriceProps {
  usdPrice: number;
  className?: string;
}

export default function LocalizedPrice({ usdPrice, className }: LocalizedPriceProps) {
  const { formatPrice } = useCurrency();
  return <span className={className}>{formatPrice(usdPrice)}</span>;
}
