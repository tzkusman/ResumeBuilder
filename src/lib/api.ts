import type { ResumeData } from "./types";

export interface CreditLogItem {
  id: string;
  reason: string;
  amount: number;
  balanceAfter: number;
  createdAt: string;
}

export interface ExportLogItem {
  id: string;
  format: string;
  createdAt: string;
  resume?: {
    title?: string;
    template?: string;
  };
}

export interface ApiUser {
  id: string;
  email: string;
  name?: string | null;
  plan: string;
  downloadsUsed: number;
  freeExportsBonus?: number;
  credits: number;
  streakDays: number;
  lastClaimDate?: string | null;
  creditLogs?: CreditLogItem[];
  exportLogs?: ExportLogItem[];
  resumes?: Array<{
    id: string;
    title: string;
    template: string;
    pageCount: number;
    updatedAt: string;
    data: any;
    experiences?: any[];
    educations?: any[];
  }>;
  settings?: {
    theme: string;
    autoSave: boolean;
  };
}

export async function apiSignup(email: string, password?: string, name?: string): Promise<{ user: ApiUser } | { error: string }> {
  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || "Failed to sign up" };
    return data;
  } catch (err: any) {
    return { error: err.message || "Network error" };
  }
}

export async function apiLogin(email: string, password?: string): Promise<{ user: ApiUser } | { error: string }> {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || "Failed to log in" };
    return data;
  } catch (err: any) {
    return { error: err.message || "Network error" };
  }
}

export async function apiGetProfile(email: string): Promise<{ user?: ApiUser; error?: string }> {
  try {
    const res = await fetch(`/api/user/profile?email=${encodeURIComponent(email)}`);
    if (!res.ok) return { error: "Profile not found" };
    return await res.json();
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function apiUpdatePlan(email: string, planId: string, downloadsUsed: number, freeExportsBonus?: number): Promise<boolean> {
  try {
    const res = await fetch("/api/user/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, planId, downloadsUsed, freeExportsBonus }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiSyncCredits(params: {
  email: string;
  credits: number;
  streakDays: number;
  lastClaimDate?: string;
  reason?: string;
  amount?: number;
}): Promise<boolean> {
  try {
    const res = await fetch("/api/credits/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiSaveResume(params: {
  id?: string;
  email?: string;
  title: string;
  data: ResumeData;
  template?: string;
  pageCount?: number;
  accent?: string;
}): Promise<{ resume?: any; error?: string }> {
  try {
    const res = await fetch("/api/resumes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || "Save failed" };
    return data;
  } catch (err: any) {
    return { error: err.message || "Network error" };
  }
}

export async function apiGetResumes(email: string): Promise<any[]> {
  try {
    const res = await fetch(`/api/resumes?email=${encodeURIComponent(email)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.resumes || [];
  } catch {
    return [];
  }
}

export async function apiGetResumeById(id: string): Promise<{ resume?: any; error?: string }> {
  try {
    const res = await fetch(`/api/resumes/${id}`);
    if (!res.ok) return { error: "Resume not found" };
    return await res.json();
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function apiDeleteResume(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/resumes/${id}`, { method: "DELETE" });
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiLogExport(params: {
  email?: string;
  resumeId?: string;
  format: "pdf" | "docx" | "txt" | "share";
  template?: string;
}): Promise<boolean> {
  try {
    const res = await fetch("/api/exports/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiSaveJobTarget(params: {
  email?: string;
  resumeId?: string;
  jobTitle?: string;
  company?: string;
  jobDescription: string;
  matchScore?: number;
  matchedKeywords?: any;
  missingKeywords?: any;
}): Promise<boolean> {
  try {
    const res = await fetch("/api/jobs/targets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiSaveAtsScan(params: {
  email?: string;
  resumeId?: string;
  score: number;
  formattingScore?: number;
  contentScore?: number;
  impactScore?: number;
  issues?: any;
  recommendations?: any;
}): Promise<boolean> {
  try {
    const res = await fetch("/api/ats/scans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiClaimDailyReward(email: string): Promise<{
  alreadyClaimed: boolean;
  awardedCredits: number;
  credits: number;
  streakDays: number;
  error?: string;
}> {
  try {
    const res = await fetch("/api/credits/claim-daily", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  } catch (err: any) {
    return { alreadyClaimed: true, awardedCredits: 0, credits: 0, streakDays: 1, error: err.message };
  }
}

export async function apiGetCreditHistory(email: string): Promise<{
  history: CreditLogItem[];
  credits: number;
  streakDays: number;
}> {
  try {
    const res = await fetch(`/api/credits/history?email=${encodeURIComponent(email)}`);
    if (!res.ok) return { history: [], credits: 0, streakDays: 1 };
    return await res.json();
  } catch {
    return { history: [], credits: 0, streakDays: 1 };
  }
}

export async function apiGetExportHistory(email: string): Promise<ExportLogItem[]> {
  try {
    const res = await fetch(`/api/exports/history?email=${encodeURIComponent(email)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.exports || [];
  } catch {
    return [];
  }
}
