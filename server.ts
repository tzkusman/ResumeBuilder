import "dotenv/config";
import express from "express";
import path from "path";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

function hashPassword(pass: string): string {
  return crypto.createHash("sha256").update(pass).digest("hex");
}

declare global {
  var __prismaClient: PrismaClient | undefined;
}

function getDb(): PrismaClient {
  if (globalThis.__prismaClient) {
    return globalThis.__prismaClient;
  }
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set. Please configure DATABASE_URL in your environment.");
  }
  const client = new PrismaClient();
  globalThis.__prismaClient = client;
  return client;
}

export function createApp() {
  const app = express();

  // Safe body parsing: If Vercel or upstream serverless runtime already parsed the body,
  // skip stream consumption to prevent 30s timeouts.
  app.use((req, res, next) => {
    if (req.body && typeof req.body === "object") {
      return next();
    }
    express.json({ limit: "25mb" })(req, res, next);
  });

  // Root /api endpoint for discovery and ping
  app.get(["/api", "/api/"], (_req, res) => {
    res.json({
      status: "ok",
      name: "ResumeBuild API",
      version: "1.0.0",
      endpoints: {
        health: "/api/health",
        resumes: "/api/resumes",
        auth: "/api/auth",
        sync: "/api/sync",
      },
      timestamp: new Date().toISOString(),
    });
  });

  // Health check & DB statistics
  app.get("/api/health", async (_req, res) => {
    try {
      if (!process.env.DATABASE_URL) {
        return res.json({
          status: "ok",
          database: "not_configured",
          message: "DATABASE_URL is not set. Local client-side storage is active.",
          timestamp: new Date().toISOString(),
        });
      }
      const db = getDb();
      await db.$queryRaw`SELECT 1`;
      const [userCount, resumeCount, xpCount, eduCount] = await Promise.all([
        db.user.count(),
        db.resume.count(),
        db.experience.count(),
        db.education.count(),
      ]);
      res.json({
        status: "ok",
        database: "prisma_postgres",
        tables: {
          users: userCount,
          resumes: resumeCount,
          experiences: xpCount,
          educations: eduCount,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      res.status(200).json({ status: "degraded", database: "disconnected", message: err?.message || "DB error" });
    }
  });

  // Auth: signup or auto-register user
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, name } = req.body;
      if (!email || typeof email !== "string") {
        return res.status(400).json({ error: "Valid email is required" });
      }
      const db = getDb();
      const normalizedEmail = email.trim().toLowerCase();

      let user = await db.user.findUnique({
        where: { email: normalizedEmail },
        include: { settings: true, creditLogs: { orderBy: { createdAt: "desc" }, take: 10 } },
      });

      if (user) {
        if (user.passwordHash && password) {
          if (user.passwordHash !== hashPassword(password)) {
            return res.status(400).json({ error: "An account with this email already exists. Please sign in." });
          }
        } else if (password) {
          user = await db.user.update({
            where: { id: user.id },
            data: { passwordHash: hashPassword(password) },
            include: { settings: true, creditLogs: { orderBy: { createdAt: "desc" }, take: 10 } },
          });
        }
      } else {
        const today = new Date().toISOString().split("T")[0];
        user = await db.user.create({
          data: {
            email: normalizedEmail,
            name: name || normalizedEmail.split("@")[0],
            passwordHash: password ? hashPassword(password) : null,
            plan: "free",
            credits: 25,
            streakDays: 1,
            lastClaimDate: today,
            settings: {
              create: {
                theme: "system",
                autoSave: true,
              },
            },
            creditLogs: {
              create: {
                reason: "Welcome Signup Bonus",
                amount: 25,
                balanceAfter: 25,
              },
            },
          },
          include: {
            settings: true,
            creditLogs: { orderBy: { createdAt: "desc" }, take: 10 },
          },
        });
      }

      res.json({ user });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Failed to sign up" });
    }
  });

  // Auth: login / get user
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || typeof email !== "string") {
        return res.status(400).json({ error: "Valid email is required" });
      }
      const db = getDb();
      const normalizedEmail = email.trim().toLowerCase();

      let user = await db.user.findUnique({
        where: { email: normalizedEmail },
        include: {
          resumes: {
            orderBy: { updatedAt: "desc" },
            take: 20,
          },
          settings: true,
          creditLogs: {
            orderBy: { createdAt: "desc" },
            take: 15,
          },
          exportLogs: {
            orderBy: { createdAt: "desc" },
            take: 10,
          },
        },
      });

      if (!user) {
        // Auto-create on login if account didn't exist yet
        const today = new Date().toISOString().split("T")[0];
        user = await db.user.create({
          data: {
            email: normalizedEmail,
            passwordHash: password ? hashPassword(password) : null,
            plan: "free",
            credits: 25,
            streakDays: 1,
            lastClaimDate: today,
            settings: {
              create: {
                theme: "system",
                autoSave: true,
              },
            },
            creditLogs: {
              create: {
                reason: "Welcome Starter Bonus",
                amount: 25,
                balanceAfter: 25,
              },
            },
          },
          include: {
            resumes: true,
            settings: true,
            creditLogs: true,
            exportLogs: true,
          },
        });
      } else if (password && user.passwordHash) {
        // Verify password
        if (user.passwordHash !== hashPassword(password)) {
          return res.status(401).json({ error: "Incorrect password. Please try again." });
        }
      } else if (password && !user.passwordHash) {
        // Set password for existing OAuth or demo account
        user = await db.user.update({
          where: { id: user.id },
          data: { passwordHash: hashPassword(password) },
          include: {
            resumes: { orderBy: { updatedAt: "desc" }, take: 20 },
            settings: true,
            creditLogs: { orderBy: { createdAt: "desc" }, take: 15 },
            exportLogs: { orderBy: { createdAt: "desc" }, take: 10 },
          },
        });
      }

      res.json({ user });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Failed to log in" });
    }
  });

  // Get current user profile & cloud sync
  app.get("/api/user/profile", async (req, res) => {
    try {
      const email = req.query.email as string;
      if (!email) return res.status(400).json({ error: "Email required" });
      const db = getDb();
      const user = await db.user.findUnique({
        where: { email: email.trim().toLowerCase() },
        include: {
          resumes: { orderBy: { updatedAt: "desc" } },
          coverLetters: { orderBy: { updatedAt: "desc" } },
          jobTargets: { orderBy: { createdAt: "desc" }, take: 5 },
          creditLogs: { orderBy: { createdAt: "desc" }, take: 20 },
          exportLogs: { orderBy: { createdAt: "desc" }, take: 10 },
          settings: true,
        },
      });
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json({ user });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Failed to fetch profile" });
    }
  });

  // Update user subscription plan
  app.post("/api/user/plan", async (req, res) => {
    try {
      const { email, planId, downloadsUsed, freeExportsBonus } = req.body;
      if (!email) return res.status(400).json({ error: "Email required" });
      const db = getDb();
      const normalizedEmail = email.trim().toLowerCase();

      const user = await db.user.upsert({
        where: { email: normalizedEmail },
        update: {
          plan: planId || "free",
          downloadsUsed: typeof downloadsUsed === "number" ? downloadsUsed : undefined,
          freeExportsBonus: typeof freeExportsBonus === "number" ? freeExportsBonus : undefined,
          proSince: planId !== "free" ? new Date() : null,
        },
        create: {
          email: normalizedEmail,
          plan: planId || "free",
          downloadsUsed: downloadsUsed || 0,
          freeExportsBonus: freeExportsBonus || 0,
          proSince: planId !== "free" ? new Date() : null,
        },
      });

      res.json({ user });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Failed to update plan" });
    }
  });

  // Sync user visit credits
  app.post("/api/credits/sync", async (req, res) => {
    try {
      const { email, credits, streakDays, lastClaimDate, reason, amount } = req.body;
      if (!email) return res.status(400).json({ error: "Email required" });
      const db = getDb();
      const normalizedEmail = email.trim().toLowerCase();

      const user = await db.user.upsert({
        where: { email: normalizedEmail },
        update: {
          credits: typeof credits === "number" ? credits : undefined,
          streakDays: typeof streakDays === "number" ? streakDays : undefined,
          lastClaimDate: lastClaimDate || undefined,
        },
        create: {
          email: normalizedEmail,
          credits: credits ?? 25,
          streakDays: streakDays ?? 1,
          lastClaimDate: lastClaimDate || new Date().toISOString().split("T")[0],
        },
      });

      if (reason && typeof amount === "number") {
        await db.creditLog.create({
          data: {
            userId: user.id,
            reason,
            amount,
            balanceAfter: user.credits,
          },
        });
      }

      res.json({ user });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Failed to sync credits" });
    }
  });

  // Daily Login Reward: Server-authoritative daily visit check-in and streak evaluation
  app.post("/api/credits/claim-daily", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || typeof email !== "string") {
        return res.status(400).json({ error: "Email required" });
      }
      const db = getDb();
      const normalizedEmail = email.trim().toLowerCase();

      let user = await db.user.findUnique({ where: { email: normalizedEmail } });
      const today = new Date().toISOString().split("T")[0];

      if (!user) {
        user = await db.user.create({
          data: {
            email: normalizedEmail,
            credits: 25,
            streakDays: 1,
            lastClaimDate: today,
            creditLogs: {
              create: {
                reason: "Welcome Starter Bonus",
                amount: 25,
                balanceAfter: 25,
              },
            },
          },
        });
        return res.json({
          alreadyClaimed: false,
          awardedCredits: 25,
          credits: 25,
          streakDays: 1,
          user,
        });
      }

      if (user.lastClaimDate === today) {
        return res.json({
          alreadyClaimed: true,
          awardedCredits: 0,
          credits: user.credits,
          streakDays: user.streakDays,
          user,
        });
      }

      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterday = yesterdayDate.toISOString().split("T")[0];

      let nextStreak = 1;
      if (user.lastClaimDate === yesterday) {
        nextStreak = user.streakDays + 1;
      }

      const REWARDS = [15, 20, 25, 25, 35, 40, 60];
      const dayIndex = (nextStreak - 1) % 7;
      const awarded = REWARDS[dayIndex] || 15;
      const nextCredits = user.credits + awarded;

      const updatedUser = await db.user.update({
        where: { id: user.id },
        data: {
          credits: nextCredits,
          streakDays: nextStreak,
          lastClaimDate: today,
        },
      });

      await db.creditLog.create({
        data: {
          userId: user.id,
          reason: `Daily Visit Streak Reward (Day ${nextStreak})`,
          amount: awarded,
          balanceAfter: nextCredits,
        },
      });

      res.json({
        alreadyClaimed: false,
        awardedCredits: awarded,
        credits: nextCredits,
        streakDays: nextStreak,
        user: updatedUser,
      });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Failed to claim daily reward" });
    }
  });

  // Credit history: get all transaction logs for user
  app.get("/api/credits/history", async (req, res) => {
    try {
      const email = req.query.email as string;
      if (!email) return res.status(400).json({ error: "Email required" });
      const db = getDb();
      const user = await db.user.findUnique({ where: { email: email.trim().toLowerCase() } });
      if (!user) return res.json({ history: [], credits: 0, streakDays: 1 });

      const logs = await db.creditLog.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 50,
      });

      res.json({
        history: logs,
        credits: user.credits,
        streakDays: user.streakDays,
        lastClaimDate: user.lastClaimDate,
      });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Failed to fetch credit history" });
    }
  });

  // Resumes: Save / Upsert resume with full relational breakdown
  app.post("/api/resumes", async (req, res) => {
    try {
      const { id, email, title, data, template, pageCount, accent } = req.body;
      if (!data) return res.status(400).json({ error: "Resume data required" });

      const db = getDb();
      let userId: string | null = null;

      if (email) {
        const user = await db.user.findUnique({
          where: { email: email.trim().toLowerCase() },
        });
        if (user) userId = user.id;
      }

      const c = data.contact || {};
      const resumePayload = {
        title: title || `${c.fullName || "Untitled"} — ${c.title || "Resume"}`,
        fullName: c.fullName || null,
        jobTitle: c.title || null,
        email: c.email || null,
        phone: c.phone || null,
        location: c.location || null,
        website: c.website || null,
        linkedin: c.linkedin || null,
        photoUrl: c.photoUrl || null,
        photoStyle: c.photoStyle || null,
        summary: data.summary || null,
        template: template || data.template || "merit",
        pageCount: pageCount || data.pageCount || 1,
        accent: accent || data.accent || "#18634B",
        data,
      };

      let resume;
      if (id) {
        resume = await db.resume.upsert({
          where: { id },
          update: {
            ...resumePayload,
            userId: userId || undefined,
          },
          create: {
            id,
            userId,
            ...resumePayload,
          },
        });
      } else {
        resume = await db.resume.create({
          data: {
            userId,
            ...resumePayload,
          },
        });
      }

      // Relational sync of normalized sub-tables for queries, searches & metrics
      const resumeId = resume.id;
      await db.$transaction(async (tx) => {
        // 1. Experiences
        await tx.experience.deleteMany({ where: { resumeId } });
        if (Array.isArray(data.experience) && data.experience.length > 0) {
          await tx.experience.createMany({
            data: data.experience.map((e: any, idx: number) => ({
              id: e.id || undefined,
              resumeId,
              role: e.role || "Role",
              company: e.company || "Company",
              location: e.location || null,
              start: e.start || null,
              end: e.end || null,
              current: (e.end || "").toLowerCase().includes("present"),
              bullets: e.bullets || [],
              sortOrder: idx,
            })),
          });
        }

        // 2. Educations
        await tx.education.deleteMany({ where: { resumeId } });
        if (Array.isArray(data.education) && data.education.length > 0) {
          await tx.education.createMany({
            data: data.education.map((e: any, idx: number) => ({
              id: e.id || undefined,
              resumeId,
              school: e.school || "School",
              degree: e.degree || "Degree",
              year: e.year || null,
              location: e.location || null,
              sortOrder: idx,
            })),
          });
        }

        // 3. Skills
        await tx.skill.deleteMany({ where: { resumeId } });
        if (Array.isArray(data.skills) && data.skills.length > 0) {
          await tx.skill.createMany({
            data: data.skills.filter(Boolean).map((s: string, idx: number) => ({
              resumeId,
              name: s.trim(),
              sortOrder: idx,
            })),
          });
        }

        // 4. Certifications
        await tx.certification.deleteMany({ where: { resumeId } });
        if (Array.isArray(data.certifications) && data.certifications.length > 0) {
          await tx.certification.createMany({
            data: data.certifications.filter(Boolean).map((s: string, idx: number) => ({
              resumeId,
              name: s.trim(),
              sortOrder: idx,
            })),
          });
        }

        // 5. Languages
        await tx.language.deleteMany({ where: { resumeId } });
        if (Array.isArray(data.languages) && data.languages.length > 0) {
          await tx.language.createMany({
            data: data.languages.filter(Boolean).map((s: string, idx: number) => {
              const match = s.match(/^(.*?)\s*\((.*?)\)$/);
              return {
                resumeId,
                name: match ? match[1].trim() : s.trim(),
                proficiency: match ? match[2].trim() : null,
                sortOrder: idx,
              };
            }),
          });
        }

        // 6. Projects
        await tx.project.deleteMany({ where: { resumeId } });
        if (Array.isArray(data.projects) && data.projects.length > 0) {
          await tx.project.createMany({
            data: data.projects.map((p: any, idx: number) => ({
              id: p.id || undefined,
              resumeId,
              title: p.title || "Project",
              subtitle: p.subtitle || null,
              date: p.date || null,
              bullets: p.bullets || [],
              sortOrder: idx,
            })),
          });
        }

        // 7. Volunteers
        await tx.volunteer.deleteMany({ where: { resumeId } });
        if (Array.isArray(data.volunteer) && data.volunteer.length > 0) {
          await tx.volunteer.createMany({
            data: data.volunteer.map((v: any, idx: number) => ({
              id: v.id || undefined,
              resumeId,
              role: v.role || "Volunteer",
              org: v.org || "Organization",
              year: v.year || null,
              bullets: v.bullets || [],
              sortOrder: idx,
            })),
          });
        }
      });

      const fullResume = await db.resume.findUnique({
        where: { id: resume.id },
        include: {
          experiences: { orderBy: { sortOrder: "asc" } },
          educations: { orderBy: { sortOrder: "asc" } },
          skills: { orderBy: { sortOrder: "asc" } },
          certifications: { orderBy: { sortOrder: "asc" } },
          languages: { orderBy: { sortOrder: "asc" } },
          projects: { orderBy: { sortOrder: "asc" } },
        },
      });

      res.json({ resume: fullResume });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Failed to save resume" });
    }
  });

  // Resumes: List resumes for user
  app.get("/api/resumes", async (req, res) => {
    try {
      const email = req.query.email as string;
      if (!email) return res.status(400).json({ error: "Email query param required" });
      const db = getDb();
      const user = await db.user.findUnique({
        where: { email: email.trim().toLowerCase() },
      });
      if (!user) return res.json({ resumes: [] });

      const resumes = await db.resume.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: "desc" },
        include: {
          experiences: { take: 2, orderBy: { sortOrder: "asc" } },
          educations: { take: 1, orderBy: { sortOrder: "asc" } },
        },
      });

      res.json({ resumes });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Failed to fetch resumes" });
    }
  });

  // Resumes: Get single resume with all relational tables
  app.get("/api/resumes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const db = getDb();
      const resume = await db.resume.findUnique({
        where: { id },
        include: {
          experiences: { orderBy: { sortOrder: "asc" } },
          educations: { orderBy: { sortOrder: "asc" } },
          skills: { orderBy: { sortOrder: "asc" } },
          certifications: { orderBy: { sortOrder: "asc" } },
          languages: { orderBy: { sortOrder: "asc" } },
          projects: { orderBy: { sortOrder: "asc" } },
          volunteers: { orderBy: { sortOrder: "asc" } },
        },
      });
      if (!resume) return res.status(404).json({ error: "Resume not found" });
      res.json({ resume });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Failed to fetch resume" });
    }
  });

  // Resumes: Delete resume
  app.delete("/api/resumes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const db = getDb();
      await db.resume.delete({ where: { id } });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Failed to delete resume" });
    }
  });

  // Target Job Description Analysis: Save scan/analysis
  app.post("/api/jobs/targets", async (req, res) => {
    try {
      const { email, resumeId, jobTitle, company, jobDescription, matchScore, matchedKeywords, missingKeywords } = req.body;
      if (!jobDescription) return res.status(400).json({ error: "Job description is required" });
      const db = getDb();

      let userId: string | null = null;
      if (email) {
        const user = await db.user.findUnique({ where: { email: email.trim().toLowerCase() } });
        if (user) userId = user.id;
      }

      const jobTarget = await db.jobTarget.create({
        data: {
          userId,
          resumeId: resumeId || null,
          jobTitle: jobTitle || null,
          company: company || null,
          jobDescription,
          matchScore: typeof matchScore === "number" ? matchScore : null,
          matchedKeywords: matchedKeywords || [],
          missingKeywords: missingKeywords || [],
        },
      });

      res.json({ jobTarget });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Failed to save job target" });
    }
  });

  // ATS Scans: Save ATS score scan
  app.post("/api/ats/scans", async (req, res) => {
    try {
      const { email, resumeId, score, formattingScore, contentScore, impactScore, issues, recommendations } = req.body;
      const db = getDb();
      let userId: string | null = null;
      if (email) {
        const user = await db.user.findUnique({ where: { email: email.trim().toLowerCase() } });
        if (user) userId = user.id;
      }

      const scan = await db.atsScan.create({
        data: {
          userId,
          resumeId: resumeId || null,
          score: score ?? 0,
          formattingScore: formattingScore ?? null,
          contentScore: contentScore ?? null,
          impactScore: impactScore ?? null,
          issues: issues || [],
          recommendations: recommendations || [],
        },
      });

      res.json({ scan });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Failed to save scan" });
    }
  });

  // Export Log: Record document export and increment user downloads count
  app.post("/api/exports/log", async (req, res) => {
    try {
      const { email, resumeId, format } = req.body;
      const db = getDb();
      let userId: string | null = null;
      let downloadsUsed = 0;

      if (email) {
        const user = await db.user.findUnique({ where: { email: email.trim().toLowerCase() } });
        if (user) {
          userId = user.id;
          const updated = await db.user.update({
            where: { id: user.id },
            data: { downloadsUsed: { increment: 1 } },
          });
          downloadsUsed = updated.downloadsUsed;
        }
      }

      const log = await db.exportLog.create({
        data: {
          userId,
          resumeId: resumeId || null,
          format: format || "pdf",
          userAgent: req.headers["user-agent"] || null,
        },
      });

      res.json({ success: true, logId: log.id, downloadsUsed });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Failed to log export" });
    }
  });

  // Export History: Get user's exports from database
  app.get("/api/exports/history", async (req, res) => {
    try {
      const email = req.query.email as string;
      if (!email) return res.status(400).json({ error: "Email required" });
      const db = getDb();
      const user = await db.user.findUnique({ where: { email: email.trim().toLowerCase() } });
      if (!user) return res.json({ exports: [] });

      const exports = await db.exportLog.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 30,
        include: {
          resume: { select: { title: true, template: true } },
        },
      });

      res.json({ exports });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Failed to fetch export history" });
    }
  });

  return app;
}

export async function startServer() {
  const app = createApp();
  const PORT = 3000;

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
  return app;
}

// Standalone entry point (local dev & container environments, skipped on Vercel)
const isVercelServerless = Boolean(
  process.env.VERCEL === "1" ||
  process.env.VERCEL === "true" ||
  process.env.VERCEL_ENV ||
  process.env.NOW_REGION
);

const isMainModule = Boolean(
  process.argv[1] && (
    process.argv[1].endsWith("server.ts") ||
    process.argv[1].endsWith("server.cjs") ||
    process.argv[1].endsWith("server.js")
  )
);

if (isMainModule && !isVercelServerless && process.env.NODE_ENV !== "test") {
  startServer();
}
