import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { emptyResume, resumeFromProfession, type ResumeData } from "../lib/types";
import { getProfession } from "../data/professions";
import { track } from "../lib/analytics";
import { apiSignup, apiLogin, apiGetProfile, apiUpdatePlan, apiSaveResume, apiGetResumeById } from "../lib/api";
import { syncCreditsWithDb, recordDailyVisit } from "../lib/credits";

/* ---------------- Toasts ---------------- */
interface Toast { id: number; msg: string; kind: "ok" | "warn" }
interface ToastCtx { toast: (msg: string, kind?: "ok" | "warn") => void }
const ToastContext = createContext<ToastCtx>({ toast: () => {} });
export const useToast = () => useContext(ToastContext);

import { DICT, type LanguageCode, getProfessionTitle, getCategoryName, getDemandText, getCountryDisplayName } from "../lib/i18n";

/* ---------------- i18n (multi-language) ---------------- */
export type Lang = LanguageCode;
export interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: string, defaultVal?: string) => string;
  getRoleTitle: (slug: string, defaultTitle?: string) => string;
  getCategory: (category: string) => string;
  getDemand: (demand: string) => string;
  getCountryName: (code: string, defaultName?: string) => string;
}
const I18nContext = createContext<I18nCtx>({
  lang: "en",
  setLang: () => {},
  t: (k, defaultVal) => DICT[k]?.en ?? defaultVal ?? k,
  getRoleTitle: (slug, defaultTitle) => defaultTitle ?? slug,
  getCategory: (cat) => cat,
  getDemand: (d) => d,
  getCountryName: (c, def) => def ?? c,
});
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
  addFreeExports: (count: number) => void;
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
  sessionChanges: number;
  resetSessionChanges: () => void;
  saveToCloud: () => Promise<boolean>;
  activeResumeId: string | null;
  setActiveResumeId: (id: string | null) => void;
  loadCloudResume: (id: string) => Promise<boolean>;
  createNewResume: () => void;
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
    try {
      document.documentElement.lang = l;
      document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    } catch {
      /* ignore */
    }
  }, [lang]);

  const t = useCallback((k: string, defaultVal?: string) => DICT[k]?.[lang] ?? DICT[k]?.en ?? defaultVal ?? k, [lang]);
  const getRoleTitle = useCallback((slug: string, defaultTitle?: string) => getProfessionTitle(slug, lang, defaultTitle), [lang]);
  const getCategory = useCallback((category: string) => getCategoryName(category, lang), [lang]);
  const getDemand = useCallback((demand: string) => getDemandText(demand, lang), [lang]);
  const getCountryName = useCallback((code: string, defaultName?: string) => getCountryDisplayName(code, lang, defaultName), [lang]);

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
    if (user?.email) {
      void apiUpdatePlan(user.email, next.planId, next.downloadsUsed);
    }
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
  }, [user]);

  useEffect(() => {
    // Adopt user profile from Prisma on boot if logged in
    const cachedUser = localStorage.getItem(LS_USER);
    if (cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser) as User;
        if (parsed?.email) {
          apiGetProfile(parsed.email).then((res) => {
            if (res.user) {
              setPlanState((prev) => ({
                planId: (res.user?.plan as any) || prev.planId,
                since: prev.since,
                downloadsUsed: res.user?.downloadsUsed ?? prev.downloadsUsed,
              }));
              // Check daily reward & streak on boot
              recordDailyVisit(parsed.email);
              syncCreditsWithDb(parsed.email).catch(() => {});
            }
          });
        }
      } catch {
        /* ignore */
      }
    } else {
      // Guest daily visit tracking
      recordDailyVisit();
    }

    // Adopt an existing Supabase session on boot if configured.
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
    // Primary: Sync with Prisma PostgreSQL DB
    const prismaRes = await apiSignup(email, password);
    if ("error" in prismaRes) {
      return prismaRes.error;
    }

    if ("user" in prismaRes && prismaRes.user) {
      if (prismaRes.user.plan && prismaRes.user.plan !== "free") {
        setPlanState({
          planId: prismaRes.user.plan as any,
          since: Date.now(),
          downloadsUsed: prismaRes.user.downloadsUsed ?? 0,
        });
      }
      await syncCreditsWithDb(email);
    }

    localStorage.setItem(LS_USER, JSON.stringify({ email }));
    setUser({ email });

    // Optional Supabase mirroring if configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signUp({ email, password });
      } catch {
        // secondary mirror
      }
    }

    const method = "prisma_postgres";
    track("sign_up", { method });
    track("free_download_unlocked", { method });
    return null;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // Primary: Sync with Prisma PostgreSQL DB
    const prismaRes = await apiLogin(email, password);
    if ("error" in prismaRes) {
      return prismaRes.error;
    }

    if ("user" in prismaRes && prismaRes.user) {
      setPlanState({
        planId: (prismaRes.user.plan as any) || "free",
        since: Date.now(),
        downloadsUsed: prismaRes.user.downloadsUsed ?? 0,
      });
      // Check and award daily visit reward & sync logs
      recordDailyVisit(email);
      await syncCreditsWithDb(email);
    }

    localStorage.setItem(LS_USER, JSON.stringify({ email }));
    setUser({ email });

    // Optional Supabase mirroring if configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signInWithPassword({ email, password });
      } catch {
        // secondary mirror
      }
    }

    track("login", { method: "prisma_postgres" });
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

  const addFreeExports = useCallback((count: number) => {
    persistPlan({
      ...planState,
      downloadsUsed: Math.max(0, planState.downloadsUsed - count),
    });
  }, [planState, persistPlan]);

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
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);
  const [resume, setResumeState] = useState<ResumeData>(() => {
    try {
      const sessionDraft = sessionStorage.getItem("rb_session_draft_v1");
      if (sessionDraft) {
        const parsed = JSON.parse(sessionDraft) as ResumeData;
        if (parsed && parsed.contact) return parsed;
      }
      const raw = localStorage.getItem(LS_RESUME);
      if (raw) {
        const parsed = JSON.parse(raw) as ResumeData;
        if (parsed && parsed.contact) return parsed;
      }
    } catch { /* fall through to empty */ }
    return emptyResume();
  });
  const [savedAt, setSavedAt] = useState<number | null>(Date.now());
  const [sessionChanges, setSessionChanges] = useState<number>(0);
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    try {
      localStorage.setItem(LS_RESUME, JSON.stringify(resume));
      sessionStorage.setItem("rb_session_draft_v1", JSON.stringify(resume));
    } catch {
      // Storage quota safety
    }
    setSavedAt(Date.now());
    setSessionChanges((prev) => prev + 1);
  }, [resume]);

  const resetSessionChanges = useCallback(() => setSessionChanges(0), []);

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

  const createNewResume = useCallback(() => {
    setActiveResumeId(null);
    setResumeState(emptyResume());
  }, []);

  const loadCloudResume = useCallback(async (id: string): Promise<boolean> => {
    try {
      const res = await apiGetResumeById(id);
      if (res.resume && res.resume.data) {
        setResumeState(res.resume.data);
        setActiveResumeId(res.resume.id);
        return true;
      }
    } catch (err) {
      console.error("Failed to load cloud resume:", err);
    }
    return false;
  }, []);

  const saveToCloud = useCallback(async () => {
    const title = `${resume.contact.fullName || "Untitled"} — ${resume.contact.title || "Resume"}`;
    // 1. Primary: Save to Prisma PostgreSQL database with ID linking
    const prismaSave = await apiSaveResume({
      id: activeResumeId || undefined,
      email: user?.email,
      title,
      data: resume,
      template: resume.template,
      pageCount: resume.pageCount,
      accent: resume.accent,
    });

    if (!prismaSave.error && prismaSave.resume) {
      setActiveResumeId(prismaSave.resume.id);
      return true;
    }

    // 2. Secondary fallback if Supabase is configured
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        const { error } = await supabase.from("resumes").upsert({
          user_id: data.user.id,
          title,
          data: resume,
          updated_at: new Date().toISOString(),
        });
        return !error;
      }
    }

    return !prismaSave.error;
  }, [resume, user, activeResumeId]);

  const toastValue = useMemo(() => ({ toast }), [toast]);
  const i18nValue = useMemo(
    () => ({ lang, setLang, t, getRoleTitle, getCategory, getDemand, getCountryName }),
    [lang, setLang, t, getRoleTitle, getCategory, getDemand, getCountryName]
  );
  const freeExportsLeft = isPro ? Infinity : Math.max(0, FREE_EXPORTS - planState.downloadsUsed);
  const authValue = useMemo(
    () => ({
      user, isPro,
      planName: PLANS[planState.planId].name,
      planSince: planState.since,
      downloadsUsed: planState.downloadsUsed,
      freeExportsLeft,
      consumeDownload,
      signup, login, logout, unlockPro, cancelPro, addFreeExports,
    }),
    [user, isPro, planState, freeExportsLeft, consumeDownload, signup, login, logout, unlockPro, cancelPro, addFreeExports]
  );
  const resumeValue = useMemo(() => ({
    resume,
    setResume,
    replaceResume,
    loadRole,
    savedAt,
    sessionChanges,
    resetSessionChanges,
    saveToCloud,
    activeResumeId,
    setActiveResumeId,
    loadCloudResume,
    createNewResume,
  }), [resume, setResume, replaceResume, loadRole, savedAt, sessionChanges, resetSessionChanges, saveToCloud, activeResumeId, loadCloudResume, createNewResume]);

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
