import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { emptyResume, resumeFromProfession, type ResumeData } from "../lib/types";
import { getProfession } from "../data/professions";
import { track } from "../lib/analytics";

/* ---------------- Toasts ---------------- */
interface Toast { id: number; msg: string; kind: "ok" | "warn" }
interface ToastCtx { toast: (msg: string, kind?: "ok" | "warn") => void }
const ToastContext = createContext<ToastCtx>({ toast: () => {} });
export const useToast = () => useContext(ToastContext);

/* ---------------- i18n (English / اردو) ---------------- */
export type Lang = "en" | "ur";
const DICT: Record<string, Record<Lang, string>> = {
  "nav.examples": { en: "Examples", ur: "مثالیں" },
  "nav.countries": { en: "Countries", ur: "ممالک" },
  "nav.templates": { en: "Templates", ur: "ٹیمپلیٹس" },
  "nav.cover": { en: "Cover Letter", ur: "کور لیٹر" },
  "nav.pricing": { en: "Pricing", ur: "قیمتیں" },
  "nav.build": { en: "Build my resume", ur: "میرا ریزیومے بنائیں" },
  "nav.signin": { en: "Sign in", ur: "سائن اِن" },
  "hero.kicker": { en: "Free ATS-proof resume builder", ur: "مفت ATS پروف ریزیومے بلڈر" },
  "hero.title1": { en: "The resume that gets the", ur: "وہ ریزیومے جو حاصل کرے" },
  "hero.title2": { en: "callback.", ur: "کال بیک۔" },
  "hero.sub": { en: "Real examples for 20+ professions, country-by-country CV rules, and an ATS engine that scores every draft before a robot does.", ur: "20 سے زائد پیشوں کی حقیقی مثالیں، ملک بہ ملک CV قوانین، اور ایک ATS انجن جو ہر مسودے کا جائزہ لیتا ہے۔" },
  "hero.cta2": { en: "Browse example resumes", ur: "مثال ریزیومے دیکھیں" },
  "cta.start": { en: "Start free — no sign-up", ur: "مفت شروع کریں" },
};
interface I18nCtx { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string }
const I18nContext = createContext<I18nCtx>({ lang: "en", setLang: () => {}, t: (k) => DICT[k]?.en ?? k });
export const useI18n = () => useContext(I18nContext);

/* ---------------- Auth + subscription ---------------- */
interface User { email: string }

/** Every account starts with this many free exports — the signup hook. */
export const FREE_EXPORTS = 1;

/** Plan catalog shared by the pricing page, builder gate and checkout. */
export const PLANS = {
  free: { name: "Free", price: 0, cadence: "forever" },
  pro_monthly: { name: "Pro Monthly", price: 7, cadence: "/mo" },
  pro_annual: { name: "Pro Annual", price: 49, cadence: "/yr" },
  pro_lifetime: { name: "Pro Lifetime", price: 79, cadence: "once" },
} as const;
export type PlanId = keyof typeof PLANS;

interface PlanState { planId: PlanId; since: number | null; downloadsUsed: number }
interface AuthCtx {
  user: User | null;
  isPro: boolean;
  planName: string;
  planSince: number | null;
  downloadsUsed: number;
  freeExportsLeft: number;
  consumeDownload: () => { allowed: boolean; remaining: number; reason: "guest" | "limit" | "ok" };
  signup: (email: string, password: string) => Promise<string | null>;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  unlockPro: (planId: PlanId) => void;
  cancelPro: () => void;
}
const AuthContext = createContext<AuthCtx>(null as unknown as AuthCtx);
export const useAuth = () => useContext(AuthContext);

/* ---------------- Resume ---------------- */
interface ResumeCtx {
  resume: ResumeData;
  setResume: (fn: (r: ResumeData) => ResumeData) => void;
  replaceResume: (r: ResumeData) => void;
  loadRole: (slug: string) => boolean;
  savedAt: number | null;
  saveToCloud: () => Promise<boolean>;
}
const ResumeContext = createContext<ResumeCtx>(null as unknown as ResumeCtx);
export const useResume = () => useContext(ResumeContext);

const LS_RESUME = "rb_resume_v1";
const LS_USER = "rb_user_v1";
const LS_PLAN = "rb_plan_v2";
const LS_LANG = "rb_lang_v1";

export function AppProviders({ children }: { children: ReactNode }) {
  /* toasts */
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);
  const toast = useCallback((msg: string, kind: "ok" | "warn" = "ok") => {
    const id = ++idRef.current;
    setToasts((t) => [...t.slice(-3), { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400);
  }, []);

  /* i18n */
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem(LS_LANG) as Lang) || "en");
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(LS_LANG, l);
  }, []);
  const t = useCallback((k: string) => DICT[k]?.[lang] ?? DICT[k]?.en ?? k, [lang]);

  /* auth */
  const [user, setUser] = useState<User | null>(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_USER) || "null") as User | null;
    } catch { return null; }
  });
  /* subscription state — persisted locally; mirrored to Supabase profiles when configured */
  const [planState, setPlanState] = useState<PlanState>(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(LS_PLAN) || "null") as PlanState | null;
      if (raw && raw.planId && PLANS[raw.planId]) {
        return { planId: raw.planId, since: raw.since ?? null, downloadsUsed: Math.max(0, raw.downloadsUsed ?? 0) };
      }
    } catch { /* fall through */ }
    return { planId: "free", since: null, downloadsUsed: 0 };
  });
  const isPro = planState.planId !== "free";

  const persistPlan = useCallback((next: PlanState) => {
    setPlanState(next);
    localStorage.setItem(LS_PLAN, JSON.stringify(next));
    const sb = supabase;
    if (isSupabaseConfigured && sb) {
      void sb.auth.getUser().then(({ data }) => {
        if (data.user) {
          void sb.from("profiles").update({
            pro: next.planId !== "free",
            pro_plan: next.planId,
            pro_since: next.since ? new Date(next.since).toISOString() : null,
            downloads_used: next.downloadsUsed,
          }).eq("id", data.user.id);
        }
      });
    }
  }, []);

  useEffect(() => {
    // Adopt an existing Supabase session on boot.
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data }) => {
        const email = data.session?.user?.email;
        if (email) setUser({ email });
      });
      const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
        const email = session?.user?.email;
        setUser(email ? { email } : null);
        if (email) localStorage.setItem(LS_USER, JSON.stringify({ email }));
        else localStorage.removeItem(LS_USER);
      });
      return () => sub.subscription.unsubscribe();
    }
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) return error.message;
    } else {
      localStorage.setItem(LS_USER, JSON.stringify({ email }));
      setUser({ email });
    }
    const method = isSupabaseConfigured ? "supabase" : "demo";
    track("sign_up", { method });
    track("free_download_unlocked", { method });
    return null;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return error.message;
    } else {
      localStorage.setItem(LS_USER, JSON.stringify({ email }));
      setUser({ email });
    }
    track("login", { method: isSupabaseConfigured ? "supabase" : "demo" });
    return null;
  }, []);

  const logout = useCallback(async () => {
    if (isSupabaseConfigured && supabase) await supabase.auth.signOut();
    localStorage.removeItem(LS_USER);
    setUser(null);
  }, []);

  const unlockPro = useCallback((planId: PlanId) => {
    persistPlan({ planId, since: Date.now(), downloadsUsed: planState.downloadsUsed });
    track("plan_change", { to: planId, price: PLANS[planId].price });
  }, [persistPlan, planState.downloadsUsed]);

  const cancelPro = useCallback(() => {
    persistPlan({ planId: "free", since: planState.since, downloadsUsed: planState.downloadsUsed });
    track("plan_change", { to: "free" });
  }, [persistPlan, planState.since, planState.downloadsUsed]);

  /** Gate an export: guests are blocked, free accounts get FREE_EXPORTS, Pro is unlimited. */
  const consumeDownload = useCallback(() => {
    if (!user) return { allowed: false, remaining: 0, reason: "guest" as const };
    if (planState.planId !== "free") return { allowed: true, remaining: Infinity, reason: "ok" as const };
    if (planState.downloadsUsed >= FREE_EXPORTS) return { allowed: false, remaining: 0, reason: "limit" as const };
    const used = planState.downloadsUsed + 1;
    persistPlan({ ...planState, downloadsUsed: used });
    return { allowed: true, remaining: FREE_EXPORTS - used, reason: "ok" as const };
  }, [user, planState, persistPlan]);

  /* resume */
  const [resume, setResumeState] = useState<ResumeData>(() => {
    try {
      const raw = localStorage.getItem(LS_RESUME);
      if (raw) {
        const parsed = JSON.parse(raw) as ResumeData;
        if (parsed && parsed.contact) return parsed;
      }
    } catch { /* fall through to empty */ }
    return emptyResume();
  });
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    localStorage.setItem(LS_RESUME, JSON.stringify(resume));
    setSavedAt(Date.now());
  }, [resume]);

  const setResume = useCallback((fn: (r: ResumeData) => ResumeData) => setResumeState(fn), []);
  const replaceResume = useCallback((r: ResumeData) => setResumeState(r), []);

  const loadRole = useCallback((slug: string) => {
    const p = getProfession(slug);
    if (!p) return false;
    const built = resumeFromProfession(p);
    built.template = resume.template;
    built.accent = resume.accent;
    setResumeState(built);
    track("generate_lead", { profession: slug });
    return true;
  }, [resume.template, resume.accent]);

  const saveToCloud = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return false;
    const { data } = await supabase.auth.getUser();
    if (!data.user) return false;
    const { error } = await supabase.from("resumes").upsert({
      user_id: data.user.id,
      title: `${resume.contact.fullName || "Untitled"} — ${resume.contact.title || "Resume"}`,
      data: resume,
      updated_at: new Date().toISOString(),
    });
    return !error;
  }, [resume]);

  const toastValue = useMemo(() => ({ toast }), [toast]);
  const i18nValue = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  const freeExportsLeft = isPro ? Infinity : Math.max(0, FREE_EXPORTS - planState.downloadsUsed);
  const authValue = useMemo(
    () => ({
      user, isPro,
      planName: PLANS[planState.planId].name,
      planSince: planState.since,
      downloadsUsed: planState.downloadsUsed,
      freeExportsLeft,
      consumeDownload,
      signup, login, logout, unlockPro, cancelPro,
    }),
    [user, isPro, planState, freeExportsLeft, consumeDownload, signup, login, logout, unlockPro, cancelPro]
  );
  const resumeValue = useMemo(() => ({ resume, setResume, replaceResume, loadRole, savedAt, saveToCloud }), [resume, setResume, replaceResume, loadRole, savedAt, saveToCloud]);

  return (
    <ToastContext.Provider value={toastValue}>
      <I18nContext.Provider value={i18nValue}>
        <AuthContext.Provider value={authValue}>
          <ResumeContext.Provider value={resumeValue}>
            {children}
            <div className="fixed bottom-5 right-5 z-[90] flex flex-col gap-2">
              {toasts.map((tt) => (
                <div key={tt.id} className={`toast-in flex items-center gap-2.5 border-2 border-ink bg-card px-4 py-3 text-sm font-semibold hs-sm ${tt.kind === "warn" ? "text-coral" : "text-pine-deep"}`}>
                  <span className={`inline-block h-2 w-2 ${tt.kind === "warn" ? "bg-coral" : "bg-pine"} pulse-dot`} />
                  {tt.msg}
                </div>
              ))}
            </div>
          </ResumeContext.Provider>
        </AuthContext.Provider>
      </I18nContext.Provider>
    </ToastContext.Provider>
  );
}
