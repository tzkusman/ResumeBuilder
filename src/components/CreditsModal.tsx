import { useState, useEffect } from "react";
import { Icon } from "./ui";
import {
  loadCreditsState,
  spendCredits,
  STREAK_REWARDS,
  SUBSCRIPTION_CONVERSIONS,
  type VisitCreditsState,
} from "../lib/credits";
import { useAuth, useToast } from "../store/AppStore";
import { apiSyncCredits, apiGetCreditHistory } from "../lib/api";

export function CreditsModal({
  isOpen,
  onClose,
  creditsState,
  onCreditsUpdated,
}: {
  isOpen: boolean;
  onClose: () => void;
  creditsState: VisitCreditsState;
  onCreditsUpdated: (next: VisitCreditsState) => void;
}) {
  const { toast } = useToast();
  const { unlockPro, addFreeExports, user } = useAuth();
  const [activeTab, setActiveTab] = useState<"rewards" | "roadmap" | "history">("rewards");
  const [dbLogs, setDbLogs] = useState<Array<{ id: string; amount: number; reason: string; createdAt: string }>>([]);
  const [loadingDbLogs, setLoadingDbLogs] = useState(false);

  useEffect(() => {
    if (isOpen && activeTab === "history" && user?.email) {
      setLoadingDbLogs(true);
      apiGetCreditHistory(user.email)
        .then((res) => {
          if (res && Array.isArray(res.history)) {
            setDbLogs(res.history);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingDbLogs(false));
    }
  }, [isOpen, activeTab, user?.email]);

  if (!isOpen) return null;

  const handleConvert = (conv: (typeof SUBSCRIPTION_CONVERSIONS)[number]) => {
    if (creditsState.credits < conv.creditsCost) {
      toast(
        `You need ${conv.creditsCost - creditsState.credits} more credits. Visit daily to earn more!`,
        "warn"
      );
      return;
    }

    const res = spendCredits(conv.creditsCost, `Converted: ${conv.title}`);
    if (res.success) {
      const updated = loadCreditsState();
      onCreditsUpdated(updated);
      if (user?.email) {
        void apiSyncCredits({
          email: user.email,
          credits: updated.credits,
          streakDays: updated.streakDays,
          lastClaimDate: updated.lastClaimDate,
          reason: `Converted: ${conv.title}`,
          amount: -conv.creditsCost,
        });
      }

      if (conv.id === "export_pass") {
        addFreeExports(1);
        toast(`Unlocked 1 Free ATS Export Pass! Ready to download.`, "ok");
      } else {
        unlockPro("pro_monthly");
        toast(`🎉 Success! Converted into ${conv.title}. Pro unlocked!`, "ok");
      }
    } else {
      toast("Insufficient credits.", "warn");
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const isClaimedToday = creditsState.lastClaimDate === todayStr;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl border-2 border-ink bg-card p-6 shadow-[8px_8px_0_0_var(--color-ink)]">
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-ink pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xs bg-acid text-ink font-bold">
                🔥
              </span>
              <h2 className="font-display text-2xl font-black">
                Daily Visit Rewards &amp; Credits
              </h2>
            </div>
            <p className="mt-1 font-mono text-xs text-ink-soft">
              Visit our site daily to earn free credits and convert them directly into Pro subscriptions!
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

        {/* Balance & Streak Ribbon */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="border border-ink/30 bg-paper p-3">
            <span className="font-mono text-[10px] uppercase text-ink-soft">Your Balance</span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-display text-3xl font-black text-pine">
                {creditsState.credits}
              </span>
              <span className="font-mono text-xs font-bold text-ink-soft">Credits</span>
            </div>
          </div>
          <div className="border border-ink/30 bg-paper p-3">
            <span className="font-mono text-[10px] uppercase text-ink-soft">Daily Streak</span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-display text-3xl font-black text-coral">
                {creditsState.streakDays}
              </span>
              <span className="font-mono text-xs font-bold text-ink-soft">Days 🔥</span>
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 border border-ink/30 bg-paper p-3">
            <span className="font-mono text-[10px] uppercase text-ink-soft">Today's Check-in</span>
            <div className="mt-1 flex items-center gap-1.5 text-xs font-bold">
              {isClaimedToday ? (
                <span className="inline-flex items-center gap-1 text-pine">
                  <Icon name="check" size={14} /> Claimed today
                </span>
              ) : (
                <span className="text-coral">Ready to claim!</span>
              )}
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="mt-5 flex border-b-2 border-ink">
          <button
            onClick={() => setActiveTab("rewards")}
            className={`px-4 py-2 font-mono text-xs font-bold uppercase transition-colors ${
              activeTab === "rewards" ? "border-b-2 border-pine bg-ink text-acid" : "text-ink-soft hover:text-ink"
            }`}
          >
            Convert to Subscription ({SUBSCRIPTION_CONVERSIONS.length})
          </button>
          <button
            onClick={() => setActiveTab("roadmap")}
            className={`px-4 py-2 font-mono text-xs font-bold uppercase transition-colors ${
              activeTab === "roadmap" ? "border-b-2 border-pine bg-ink text-acid" : "text-ink-soft hover:text-ink"
            }`}
          >
            Streak Roadmap (7 Days)
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 font-mono text-xs font-bold uppercase transition-colors ${
              activeTab === "history" ? "border-b-2 border-pine bg-ink text-acid" : "text-ink-soft hover:text-ink"
            }`}
          >
            Credit History
          </button>
        </div>

        {/* Tab 1: Subscription Conversion */}
        {activeTab === "rewards" && (
          <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {SUBSCRIPTION_CONVERSIONS.map((conv) => {
              const canAfford = creditsState.credits >= conv.creditsCost;
              return (
                <div
                  key={conv.id}
                  className={`flex flex-wrap items-center justify-between gap-3 border-2 p-4 transition-all ${
                    canAfford
                      ? "border-ink bg-white hover:shadow-[4px_4px_0_0_var(--color-ink)]"
                      : "border-ink/20 bg-paper/60 opacity-80"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-display text-base font-bold text-neutral-900">
                        {conv.title}
                      </h4>
                      <span className="border border-ink/30 bg-acid px-2 py-0.5 font-mono text-[9.5px] font-bold uppercase text-ink">
                        {conv.badge}
                      </span>
                    </div>
                    <p className="text-xs text-ink-soft max-w-md">{conv.benefit}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="font-display text-lg font-black text-pine">
                        {conv.creditsCost}
                      </span>
                      <span className="font-mono text-[10px] text-ink-soft block">credits</span>
                    </div>
                    <button
                      onClick={() => handleConvert(conv)}
                      disabled={!canAfford}
                      className={`border-2 px-3.5 py-2 text-xs font-bold transition-transform ${
                        canAfford
                          ? "border-ink bg-ink text-acid hover:-translate-y-0.5 hover:shadow-[2px_2px_0_0_var(--color-acid)]"
                          : "cursor-not-allowed border-ink/30 bg-ink/10 text-ink-soft"
                      }`}
                    >
                      {canAfford ? "Convert Now" : `Need ${conv.creditsCost - creditsState.credits} more`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Streak Roadmap */}
        {activeTab === "roadmap" && (
          <div className="mt-4">
            <p className="mb-3 font-mono text-xs text-ink-soft">
              Every consecutive day you open ResumeBuilder, you earn escalating credits. Reach Day 7 for the massive Champion bonus!
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {STREAK_REWARDS.map((r) => {
                const isCurrent = ((creditsState.streakDays - 1) % 7) + 1 === r.day;
                const isDone = ((creditsState.streakDays - 1) % 7) + 1 > r.day;
                return (
                  <div
                    key={r.day}
                    className={`border-2 p-2.5 text-center transition-all ${
                      isCurrent
                        ? "border-coral bg-coral/10 ring-2 ring-coral"
                        : isDone
                        ? "border-pine bg-pine/10"
                        : "border-ink/20 bg-paper"
                    }`}
                  >
                    <span className="font-mono text-[10px] font-bold text-ink-soft block">
                      Day {r.day}
                    </span>
                    <span className="font-display text-xl font-black text-ink mt-1 block">
                      +{r.credits}
                    </span>
                    <span className="font-mono text-[9px] uppercase font-bold text-pine block mt-1">
                      {isDone ? "✓ Claimed" : isCurrent ? "Active" : "Upcoming"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: History */}
        {activeTab === "history" && (
          <div className="mt-4 max-h-[260px] overflow-y-auto space-y-2 pr-1">
            {user?.email && (
              <div className="mb-2 flex items-center justify-between border-b border-ink/10 pb-1.5 font-mono text-[10px] text-ink-soft">
                <span>Database Sync: {user.email}</span>
                <span className="font-bold text-pine">● PostgreSQL Cloud Verified</span>
              </div>
            )}
            {loadingDbLogs && (
              <p className="p-3 text-center font-mono text-xs text-ink-soft animate-pulse">
                Fetching cloud database transactions…
              </p>
            )}
            {!loadingDbLogs && dbLogs.length > 0 ? (
              dbLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between border border-ink/15 bg-paper px-3 py-2 text-xs"
                >
                  <div>
                    <p className="font-bold text-neutral-800">{log.reason}</p>
                    <span className="font-mono text-[10px] text-ink-soft">
                      {new Date(log.createdAt).toLocaleString()} · Cloud DB
                    </span>
                  </div>
                  <span
                    className={`font-mono font-bold ${
                      log.amount > 0 ? "text-pine" : "text-coral"
                    }`}
                  >
                    {log.amount > 0 ? `+${log.amount}` : log.amount} credits
                  </span>
                </div>
              ))
            ) : !loadingDbLogs && creditsState.history.length > 0 ? (
              creditsState.history.map((h, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border border-ink/15 bg-paper px-3 py-2 text-xs"
                >
                  <div>
                    <p className="font-bold text-neutral-800">{h.reason}</p>
                    <span className="font-mono text-[10px] text-ink-soft">{h.date}</span>
                  </div>
                  <span
                    className={`font-mono font-bold ${
                      h.creditsAdded > 0 ? "text-pine" : "text-coral"
                    }`}
                  >
                    {h.creditsAdded > 0 ? `+${h.creditsAdded}` : h.creditsAdded} credits
                  </span>
                </div>
              ))
            ) : !loadingDbLogs ? (
              <p className="p-4 text-center font-mono text-xs text-ink-soft">No credit activity logged yet.</p>
            ) : null}
          </div>
        )}

        <div className="mt-6 flex justify-end border-t border-ink/15 pt-3">
          <button
            onClick={onClose}
            className="border-2 border-ink bg-paper px-4 py-1.5 font-mono text-xs font-bold text-ink hover:bg-ink hover:text-acid"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
