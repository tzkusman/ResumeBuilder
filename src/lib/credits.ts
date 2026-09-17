import { apiClaimDailyReward, apiSyncCredits, apiGetCreditHistory, type CreditLogItem } from "./api";

export interface VisitCreditsState {
  credits: number;
  streakDays: number;
  lastVisitDate: string; // YYYY-MM-DD
  totalDaysVisited: number;
  lastClaimDate: string; // YYYY-MM-DD
  history: { date: string; creditsAdded: number; reason: string }[];
}

const STORAGE_KEY = "rb_visit_credits_v2";

export function getActiveUserEmail(): string | null {
  try {
    const raw = localStorage.getItem("rb_user_v1");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.email && typeof parsed.email === "string") {
        return parsed.email.trim().toLowerCase();
      }
    }
  } catch {
    // fallback
  }
  return null;
}

export const STREAK_REWARDS = [
  { day: 1, credits: 15, label: "Day 1 Kickoff" },
  { day: 2, credits: 20, label: "Day 2 Momentum" },
  { day: 3, credits: 25, label: "Day 3 Consistency" },
  { day: 4, credits: 25, label: "Day 4 Dedication" },
  { day: 5, credits: 35, label: "Day 5 High Roller" },
  { day: 6, credits: 40, label: "Day 6 Champion" },
  { day: 7, credits: 60, label: "Day 7 Master (+Bonus!)" },
];

export const SUBSCRIPTION_CONVERSIONS = [
  {
    id: "export_pass",
    title: "1 Free ATS Export Pass",
    creditsCost: 50,
    benefit: "Unlock 1 Full ATS PDF/DOCX Download immediately without paying.",
    badge: "Fast Unlock",
  },
  {
    id: "pro_7day",
    title: "7-Day Pro Access Pass",
    creditsCost: 100,
    benefit: "7 days of unlimited exports, all 20 templates, and real-time ATS keyword matching.",
    badge: "Most Popular",
  },
  {
    id: "pro_30day",
    title: "30-Day Pro Subscription",
    creditsCost: 200,
    benefit: "Full 1-Month Pro Membership converted 100% free from your daily visits.",
    badge: "Ultimate Value",
  },
];

function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function loadCreditsState(): VisitCreditsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed.credits === "number") return parsed;
    }
  } catch {
    // fallback
  }

  // Initial state for brand new user: 25 starter credits!
  return {
    credits: 25,
    streakDays: 1,
    lastVisitDate: getTodayString(),
    totalDaysVisited: 1,
    lastClaimDate: getTodayString(),
    history: [
      {
        date: getTodayString(),
        creditsAdded: 25,
        reason: "Welcome Starter Bonus",
      },
    ],
  };
}

export function saveCreditsState(state: VisitCreditsState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export interface VisitCheckResult {
  state: VisitCreditsState;
  alreadyClaimedToday: boolean;
  awardedCredits: number;
  currentStreak: number;
  streakBroke: boolean;
}

/**
 * Checks the user's daily visit, computes streak, and automatically awards daily credits.
 * Persists to localStorage and syncs with PostgreSQL database.
 */
export function recordDailyVisit(userEmail?: string): VisitCheckResult {
  const current = loadCreditsState();
  const today = getTodayString();
  const yesterday = getYesterdayString();
  const email = userEmail || getActiveUserEmail();

  if (current.lastClaimDate === today) {
    // If user is logged in, ensure server is also notified
    if (email) {
      apiSyncCredits({
        email,
        credits: current.credits,
        streakDays: current.streakDays,
        lastClaimDate: today,
      }).catch(() => {});
    }

    return {
      state: current,
      alreadyClaimedToday: true,
      awardedCredits: 0,
      currentStreak: current.streakDays,
      streakBroke: false,
    };
  }

  let newStreak = current.streakDays;
  let streakBroke = false;

  if (current.lastVisitDate === yesterday) {
    // Continuous streak!
    newStreak = current.streakDays + 1;
  } else if (current.lastVisitDate !== today) {
    // Missed at least 1 day -> reset streak to 1
    newStreak = 1;
    streakBroke = current.streakDays > 1;
  }

  // Find reward for current streak (cycles every 7 days)
  const dayIndex = ((newStreak - 1) % 7);
  const rewardConfig = STREAK_REWARDS[dayIndex] || STREAK_REWARDS[0];
  const awardedCredits = rewardConfig.credits;
  const reason = `${rewardConfig.label} (Day ${newStreak})`;

  const nextState: VisitCreditsState = {
    ...current,
    credits: current.credits + awardedCredits,
    streakDays: newStreak,
    lastVisitDate: today,
    lastClaimDate: today,
    totalDaysVisited: current.totalDaysVisited + 1,
    history: [
      {
        date: today,
        creditsAdded: awardedCredits,
        reason,
      },
      ...current.history.slice(0, 19),
    ],
  };

  saveCreditsState(nextState);

  // Sync to PostgreSQL DB
  if (email) {
    apiSyncCredits({
      email,
      credits: nextState.credits,
      streakDays: newStreak,
      lastClaimDate: today,
      reason,
      amount: awardedCredits,
    }).catch(() => {});
  }

  return {
    state: nextState,
    alreadyClaimedToday: false,
    awardedCredits,
    currentStreak: newStreak,
    streakBroke,
  };
}

/**
 * Deducts credits to convert into a subscription or export pass.
 * Automatically persists to both localStorage and PostgreSQL CreditLog.
 */
export function spendCredits(amount: number, reason: string, userEmail?: string): { success: boolean; remainingCredits: number } {
  const current = loadCreditsState();
  if (current.credits < amount) {
    return { success: false, remainingCredits: current.credits };
  }

  const nextState: VisitCreditsState = {
    ...current,
    credits: current.credits - amount,
    history: [
      {
        date: getTodayString(),
        creditsAdded: -amount,
        reason,
      },
      ...current.history.slice(0, 19),
    ],
  };

  saveCreditsState(nextState);

  // Sync to PostgreSQL DB CreditLog
  const email = userEmail || getActiveUserEmail();
  if (email) {
    apiSyncCredits({
      email,
      credits: nextState.credits,
      streakDays: nextState.streakDays,
      reason,
      amount: -amount,
    }).catch(() => {});
  }

  return { success: true, remainingCredits: nextState.credits };
}

/**
 * Loads latest authoritative credits and transaction logs from PostgreSQL database
 * and merges into local application state.
 */
export async function syncCreditsWithDb(email: string): Promise<VisitCreditsState> {
  const current = loadCreditsState();
  try {
    const data = await apiGetCreditHistory(email);
    if (typeof data.credits === "number") {
      const dbHistory = (data.history || []).map((item) => ({
        date: item.createdAt ? item.createdAt.split("T")[0] : getTodayString(),
        creditsAdded: item.amount,
        reason: item.reason,
      }));

      const mergedState: VisitCreditsState = {
        ...current,
        credits: data.credits,
        streakDays: data.streakDays || current.streakDays,
        history: dbHistory.length > 0 ? dbHistory : current.history,
      };

      saveCreditsState(mergedState);
      return mergedState;
    }
  } catch (err) {
    console.error("Failed to sync credits with DB:", err);
  }
  return current;
}
