# ResumeBuild — Production Deployment Guide

ATS-proof resume builder with programmatic SEO (20 "[Job Title] Resume Example" pages,
16 country CV guides), GA4 conversion tracking, Supabase auth/cloud sync, Electron
desktop releases and Vercel hosting.

Repo: **Resumebuild** · Web: **https://resumebuild.vercel.app**

---

## 0. Push this workspace to GitHub (once)

```bash
git init -b main
git add .
git commit -m "ResumeBuild v1.0.0 - ATS resume builder with SEO pages"
git remote add origin https://github.com/tzkusman/Resumebuild.git
git push -u origin main
```

Or run the ready-made helper: `scripts/push-to-github.bat` (Windows) /
`scripts/push-to-github.sh` (macOS/Linux). Then tag to trigger the desktop
release pipeline: `git tag v1.0.0 && git push origin v1.0.0`
(see section 5 — the Windows `.exe` lands in Releases automatically).

---

## 1. Analytics & conversion tracking (do this before launch)

1. Create a GA4 property → Admin → Data Streams → copy the `G-XXXXXXXXXX` ID.
2. Replace the ID in two places in `index.html` (the `<script src>` and `gtag('config', …)` lines).
3. In GA4 → Admin → Events, mark these existing events as **conversions**:
   `sign_up`, `resume_download`, `purchase`, `generate_lead`.
4. Google Search Console: verify the domain, copy the verification token into the
   `google-site-verification` meta tag in `index.html`, then submit
   `https://resumebuild.vercel.app/sitemap.xml` under Sitemaps.

All events funnel through `src/lib/analytics.ts` — they queue to `dataLayer` even
before the GA4 ID is set, so nothing is lost.

## 2. Supabase (auth + cloud resume sync)

1. New project at supabase.com → SQL Editor → paste and run `supabase/schema.sql`
   (creates `profiles`, `resumes`, `cover_letters`, `events` + RLS policies +
   auto-profile trigger).
2. Authentication → Providers → enable **Email** (disable "confirm email" while testing).
3. Copy Project Settings → API:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Add both as environment variables on Vercel (Settings → Environment Variables)
   and in a local `.env`. Redeploy.

The app runs in **local demo mode** until these are set — nothing breaks, accounts
are stored in the browser, and the footer labels the mode.

## 3. Deploy to Vercel

1. Vercel → Add New Project → import the **Resumebuild** GitHub repo.
2. Framework preset: **Vite** (build `npm run build`, output `dist`) — `vercel.json`
   already carries SPA rewrites + security headers, so defaults are fine.
3. Add the Supabase env vars from step 2, then Deploy.
4. After the first deploy: point your custom domain at Vercel, then update the
   `resumebuild.vercel.app` base URL in `public/sitemap.xml`, `public/robots.txt`
   and the canonical origin used by `Seo` (it reads `window.location.origin`
   automatically — only the static files need editing).

## 4. Payments (Pro plan)

The checkout flow (`src/pages/Misc.tsx → PricingPage`) fires `purchase` with plan +
value and currently simulates the charge. To go live: create a Stripe Checkout
session in the `pay()` handler (or use Stripe Payment Links), set your keys as
`VITE_STRIPE_PUBLISHABLE_KEY` / server-side secret, and keep the same event calls.

## 5. Desktop app (Electron → GitHub Releases)

`electron/main.cjs` opens a native window on the production site
(`https://resume-builder-pd3c.vercel.app/`) — login, subscriptions and exports
work exactly like the web app, and every Vercel deploy instantly updates every
installed app. Includes a branded splash, an offline/reconnect screen, a
single-instance lock, and external links opening in the system browser.

The app icon lives at `icon.png` (repo root, 256×256 or larger; the master
artwork is `public/icon.svg`). electron-builder converts it to `.ico`/`.icns`
for the installer, taskbar and window chrome.

Packaging config lives in `electron-builder.yml` (publishes to the GitHub
Releases of `tzkusman/Resumebuild`).

**Release flow:** `git tag v1.0.0 && git push origin v1.0.0` — the workflow in
`.github/workflows/release.yml` builds the Windows NSIS installer
(`ResumeBuild-Setup-x.y.z-windows.exe`), the macOS DMG and the Linux AppImage,
then publishes all three to the repo's **GitHub Releases** page automatically
(~6 min, no signing certificates required). Test locally first with
`npx electron .` after `npm i -D electron electron-builder`.

## 6. Payments & subscription model

Monetization is wired end-to-end with a demo checkout (no real charges yet):

- **Free** — every account unlocks **1 free export** on signup (`free_download_unlocked`
  GA4 event). Guests are prompted to sign up from the builder's export gate.
- **Pro** — $7/mo or $49/yr, unlimited PDF/DOCX/TXT exports, unlimited JD tailoring
  and cover letters, cloud sync. **Lifetime** — $79 once.
- Plan state lives in `AppStore` (`src/store/AppStore.tsx` → `PLANS`, `consumeDownload`)
  and mirrors to `profiles.pro / pro_plan / downloads_used` when Supabase is configured.
- Conversion events: `checkout_start`, `purchase`, `plan_change`, `upgrade_view`.

**To accept real money:** create Stripe Price IDs for the three plans, then swap the
`pay()` handler in `src/pages/Misc.tsx` (PricingPage) for a redirect to Stripe Checkout,
and add a webhook Edge Function that upserts `public.subscriptions` (schema in
`supabase/schema.sql`) + flips `profiles.pro`. Gate the same way `consumeDownload` does.

## 7. Growing the SEO engine (the ongoing job)

The long-tail playbook lives in `src/data/professions.ts`. To publish a new
"[Job Title] Resume Example" page:

1. Append one entry to `PROFESSIONS` (slug, salary, 2 jobs × 3 quantified bullets,
   4 tips, target keywords).
2. Add its URL to `public/sitemap.xml`.
3. Deploy — the page, footer links, home-page index and builder pre-fill
   (`/builder?role=<slug>`) all appear automatically.

Same pattern for `src/data/countries.ts` → `/countries/<code>` pages.
Aim for the next batch: dental hygienist, real estate agent, business analyst,
retail associate, welder, paralegal, flight attendant, physical therapist.

## 7. Local development

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production bundle → dist/
```

Stack: React 18 · TypeScript · Vite 6 · Tailwind v4 · react-router-dom ·
@supabase/supabase-js · Electron (desktop) · Vercel (hosting).
