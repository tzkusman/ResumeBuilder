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

/* ---------------- i18n (multi-language) ---------------- */
export type Lang = "en" | "hi" | "es" | "fr" | "de" | "pt" | "ar" | "zh" | "ja";
const DICT: Record<string, Record<Lang, string>> = {
  "nav.examples": { en: "Examples", hi: "उदाहरण", es: "Ejemplos", fr: "Exemples", de: "Beispiele", pt: "Exemplos", ar: "أمثلة", zh: "示例", ja: "例" },
  "nav.countries": { en: "Countries", hi: "देश", es: "Países", fr: "Pays", de: "Länder", pt: "Países", ar: "الدول", zh: "国家", ja: "国別ガイド" },
  "nav.templates": { en: "Templates", hi: "टेम्पलेट", es: "Plantillas", fr: "Modèles", de: "Vorlagen", pt: "Modelos", ar: "قوالب", zh: "模板", ja: "テンプレート" },
  "nav.cover": { en: "Cover Letter", hi: "कवर लेटर", es: "Carta", fr: "Lettre", de: "Anschreiben", pt: "Carta", ar: "رسالة تغطية", zh: "求职信", ja: "カバーレター" },
  "nav.pricing": { en: "Pricing", hi: "मूल्य", es: "Precios", fr: "Tarifs", de: "Preise", pt: "Preços", ar: "الأسعار", zh: "定价", ja: "料金" },
  "nav.build": { en: "Build my resume", hi: "अपना रिज़्यूम बनाएं", es: "Crear currículum", fr: "Créer mon CV", de: "Lebenslauf erstellen", pt: "Criar currículo", ar: "أنشئ سيرتي", zh: "创建简历", ja: "履歴書を作成" },
  "nav.signin": { en: "Sign in", hi: "साइन इन", es: "Entrar", fr: "Connexion", de: "Anmelden", pt: "Entrar", ar: "تسجيل الدخول", zh: "登录", ja: "ログイン" },
  "hero.kicker": { en: "Free ATS-proof resume builder", hi: "मुफ्त ATS-प्रूफ रیزیومے بلڈر", es: "Constructor de currículums ATS", fr: "Créateur de CV ATS gratuit", de: "Kostenloser ATS-Lebenslauf", pt: "Construtor de currículo ATS", ar: "منشئ سيرة ذاتية مجاني", zh: "免费 ATS 简历构建器", ja: "無料 ATS 対応履歴書" },
  "hero.title1": { en: "The resume that gets the", hi: "वह रिज़्यूम जो प्राप्त करता है", es: "El currículum que consigue el", fr: "Le CV qui obtient le", de: "Der Lebenslauf, der das bekommt", pt: "O currículo que consegue o", ar: "السيرة الذاتية التي تحصل على", zh: "获得面试的简历", ja: "面接を得る履歴書" },
  "hero.title2": { en: "callback.", hi: "कॉलबैक।", es: "llamada.", fr: "rappel.", de: "Rückruf.", pt: "retorno.", ar: "اتصال.", zh: "回调。", ja: "コールバック。" },
  "hero.sub": { en: "Real examples for 20+ professions, country-by-country CV rules, and an ATS engine that scores every draft before a robot does.", hi: "20+ पेशों के लिए वास्तविक उदाहरण, देश-दर-देश CV नियम, और एक ATS इंजन जो हर मसौदे को स्कोर करता है।", es: "Ejemplos reales para 20+ profesiones, reglas de CV por país y un motor ATS que califica cada borrador.", fr: "De vrais exemples pour 20+ professions, règles de CV par pays et un moteur ATS qui note chaque brouillon.", de: "Echte Beispiele für 20+ Berufe, CV-Regeln pro Land und eine ATS-Engine, die jeden Entwurf bewertet.", pt: "Exemplos reais para 20+ profissões, regras de CV por país e um mecanismo ATS que pontua cada rascunho.", ar: "أمثلة حقيقية لـ 20+ مهنة، قواعد السيرة الذاتية حسب البلد، ومحرك ATS يقيم كل مسودة.", zh: "20+ 职业的真实示例，各国 CV 规则，以及 ATS 引擎在机器人之前评分每个草稿。", ja: "20+ の職業の実例、国別の CV ルール、および各草案を評価する ATS エンジン。" },
  "hero.cta2": { en: "Browse example resumes", hi: "उदाहरण रिज़्यूम देखें", es: "Ver ejemplos de currículums", fr: "Parcourir les exemples de CV", de: "Beispiel-Lebensläufe durchsuchen", pt: "Navegar por exemplos de currículo", ar: "تصفح أمثلة السير الذاتية", zh: "浏览示例简历", ja: "履歴書の例を閲覧" },
  "cta.start": { en: "Start free — no sign-up", hi: "मुफ्त शुरू करें — कोई साइनअप नहीं", es: "Comienza gratis — sin registro", fr: "Commencez gratuitement — sans inscription", de: "Kostenlos starten — keine Anmeldung", pt: "Comece grátis — sem cadastro", ar: "ابدأ مجاناً — بدون تسجيل", zh: "免费开始 - 无需注册", ja: "無料で開始 — サインアップ不要" },
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
