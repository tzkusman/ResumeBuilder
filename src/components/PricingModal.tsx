import { useState } from "react";
import {
  detectLocalCurrency,
  CURRENCY_MAP,
  formatPrice,
  PRICING_STRATEGY_RECOMMENDATIONS,
  type CurrencyCode,
} from "../lib/pricing";
import { Icon } from "./ui";

export function PricingModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(() =>
    detectLocalCurrency()
  );

  if (!isOpen) return null;

  const currencyInfo = CURRENCY_MAP[selectedCurrency] || CURRENCY_MAP.USD;
  const rates = currencyInfo.rates;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl border-2 border-ink bg-card p-6 shadow-[8px_8px_0_0_var(--color-ink)] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-ink pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xs bg-acid text-ink font-bold">
                💳
              </span>
              <h2 className="font-display text-2xl font-black">
                Pricing Strategy &amp; Local Currency Engine
              </h2>
            </div>
            <p className="mt-1 font-mono text-xs text-ink-soft">
              Recommended pricing tiers based on user country, local purchasing power parity (PPP), and industry standards.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center border-2 border-ink bg-paper text-ink transition-transform hover:scale-105"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Currency Selector */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border border-ink/30 bg-paper p-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{currencyInfo.flag}</span>
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-ink-soft block">
                Detected Customer Country &amp; Currency
              </span>
              <span className="text-sm font-bold text-neutral-900">
                {currencyInfo.name} ({currencyInfo.code})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-ink-soft">Switch Currency:</span>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value as CurrencyCode)}
              className="border-2 border-ink bg-white px-2.5 py-1 font-mono text-xs font-bold cursor-pointer"
            >
              {(Object.keys(CURRENCY_MAP) as CurrencyCode[]).map((code) => (
                <option key={code} value={code}>
                  {CURRENCY_MAP[code].flag} {code} — {CURRENCY_MAP[code].name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing Cards in Selected Currency */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {/* Tier 1: 7-Day Sprint */}
          <div className="border-2 border-ink bg-white p-4">
            <span className="border border-ink/30 bg-neutral-100 px-2 py-0.5 font-mono text-[9px] font-bold uppercase text-ink-soft">
              Impulse Trial
            </span>
            <h3 className="font-display text-lg font-black mt-2">7-Day Sprint Pass</h3>
            <p className="text-xs text-ink-soft mt-1">
              For job seekers with upcoming interviews this week.
            </p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-3xl font-black text-pine">
                {formatPrice(rates.pro_weekly_pass, selectedCurrency)}
              </span>
              <span className="font-mono text-xs text-ink-soft">/ 7 days</span>
            </div>
            <ul className="mt-4 space-y-1.5 border-t border-dashed border-ink/20 pt-3 text-xs text-neutral-700">
              <li className="flex items-center gap-1.5">
                <Icon name="check" size={13} className="text-pine" /> Unlimited ATS PDF/DOCX
              </li>
              <li className="flex items-center gap-1.5">
                <Icon name="check" size={13} className="text-pine" /> All 20 Templates
              </li>
              <li className="flex items-center gap-1.5">
                <Icon name="check" size={13} className="text-pine" /> Real-time JD matching
              </li>
            </ul>
          </div>

          {/* Tier 2: Pro Monthly */}
          <div className="relative border-2 border-ink bg-acid-soft p-4 ring-2 ring-pine">
            <span className="absolute -top-2.5 right-3 border border-ink bg-acid px-2 py-0.5 font-mono text-[9px] font-bold uppercase text-ink">
              Recommended (Highest MRR)
            </span>
            <h3 className="font-display text-lg font-black mt-2">Pro Monthly</h3>
            <p className="text-xs text-ink-soft mt-1">
              For active job seekers submitting 10–30 applications/mo.
            </p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-3xl font-black text-pine">
                {formatPrice(rates.pro_monthly, selectedCurrency)}
              </span>
              <span className="font-mono text-xs text-ink-soft">/ month</span>
            </div>
            <ul className="mt-4 space-y-1.5 border-t border-dashed border-ink/20 pt-3 text-xs text-neutral-700">
              <li className="flex items-center gap-1.5">
                <Icon name="check" size={13} className="text-pine" /> Everything in Sprint Pass
              </li>
              <li className="flex items-center gap-1.5">
                <Icon name="check" size={13} className="text-pine" /> Cover letter matching engine
              </li>
              <li className="flex items-center gap-1.5">
                <Icon name="check" size={13} className="text-pine" /> Cloud sync across devices
              </li>
            </ul>
          </div>

          {/* Tier 3: Annual / Lifetime */}
          <div className="border-2 border-ink bg-white p-4">
            <span className="border border-ink/30 bg-neutral-100 px-2 py-0.5 font-mono text-[9px] font-bold uppercase text-ink-soft">
              Upfront Cashflow
            </span>
            <h3 className="font-display text-lg font-black mt-2">Annual Pass</h3>
            <p className="text-xs text-ink-soft mt-1">
              Complete career maintenance and annual review updates.
            </p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-3xl font-black text-pine">
                {formatPrice(rates.pro_annual, selectedCurrency)}
              </span>
              <span className="font-mono text-xs text-ink-soft">/ year</span>
            </div>
            <ul className="mt-4 space-y-1.5 border-t border-dashed border-ink/20 pt-3 text-xs text-neutral-700">
              <li className="flex items-center gap-1.5">
                <Icon name="check" size={13} className="text-pine" /> 45% discount vs monthly
              </li>
              <li className="flex items-center gap-1.5">
                <Icon name="check" size={13} className="text-pine" /> Lifetime priority support
              </li>
              <li className="flex items-center gap-1.5">
                <Icon name="check" size={13} className="text-pine" /> All future templates
              </li>
            </ul>
          </div>
        </div>

        {/* Strategic Guidance Box */}
        <div className="mt-6 border border-ink/20 bg-paper p-4 text-xs text-neutral-800 space-y-2">
          <p className="font-bold text-sm text-neutral-900">
            💡 How much should we charge customers? (Industry Benchmark Guidance)
          </p>
          <p>
            {PRICING_STRATEGY_RECOMMENDATIONS.summary}
          </p>
          <p className="font-mono text-[11px] text-pine-deep font-semibold">
            {PRICING_STRATEGY_RECOMMENDATIONS.pppDiscountRule}
          </p>
        </div>

        <div className="mt-6 flex justify-end border-t border-ink/15 pt-3">
          <button
            onClick={onClose}
            className="border-2 border-ink bg-paper px-4 py-1.5 font-mono text-xs font-bold text-ink hover:bg-ink hover:text-acid"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
