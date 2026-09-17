import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { Icon } from "./ui";
import { useAuth, useResume, useToast } from "../store/AppStore";
import {
  apiGetResumes,
  apiDeleteResume,
  apiGetExportHistory,
  type ExportLogItem,
} from "../lib/api";
import { extractTextFromCVFile } from "../lib/cv-analyzer";
import { parseCVToResume, mergeCVWithResume } from "../lib/cv-parser";
import { emptyResume, type ResumeData } from "../lib/types";

interface CloudResumeItem {
  id: string;
  title: string;
  template: string;
  pageCount: number;
  updatedAt: string;
  data: any;
  experiences?: any[];
  educations?: any[];
}

export function CloudResumesModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const { resume, loadCloudResume, createNewResume, saveToCloud, activeResumeId, replaceResume } = useResume();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"resumes" | "exports">("resumes");
  const [resumes, setResumes] = useState<CloudResumeItem[]>([]);
  const [exportsList, setExportsList] = useState<ExportLogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchResumes = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const data = await apiGetResumes(user.email);
      setResumes(data || []);
    } catch {
      toast("Failed to load cloud resumes", "warn");
    } finally {
      setLoading(false);
    }
  };

  const fetchExports = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const data = await apiGetExportHistory(user.email);
      setExportsList(data || []);
    } catch {
      toast("Failed to load export history", "warn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user?.email) {
      if (activeTab === "resumes") {
        fetchResumes();
      } else {
        fetchExports();
      }
    }
  }, [isOpen, activeTab, user?.email]);

  if (!isOpen) return null;

  const handleOpenResume = async (id: string) => {
    setLoading(true);
    const success = await loadCloudResume(id);
    setLoading(false);
    if (success) {
      toast("Resume loaded from database cloud workspace", "ok");
      onClose();
    } else {
      toast("Could not open resume", "warn");
    }
  };

  const handleDeleteResume = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    const success = await apiDeleteResume(id);
    if (success) {
      toast(`Deleted "${title}"`, "ok");
      setResumes((prev) => prev.filter((r) => r.id !== id));
      if (activeResumeId === id) {
        createNewResume();
      }
    } else {
      toast("Failed to delete resume", "warn");
    }
  };

  const handleCreateNew = () => {
    createNewResume();
    toast("Started a brand new draft", "ok");
    onClose();
  };

  const handleFileImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      if (file.name.endsWith(".json")) {
        const text = await file.text();
        const parsed = JSON.parse(text);
        if (parsed && typeof parsed === "object" && parsed.contact) {
          replaceResume(parsed as ResumeData);
          toast("JSON resume imported successfully!", "ok");
          void saveToCloud();
          onClose();
        } else {
          toast("Invalid resume JSON format", "warn");
        }
      } else {
        const extracted = await extractTextFromCVFile(file);
        const parsed = parseCVToResume(extracted.text, extracted.pageCount);
        const base = resume && resume.contact ? resume : emptyResume();
        const merged = mergeCVWithResume(parsed, base);
        merged.pageCount = 1;
        replaceResume(merged);
        toast(`Successfully parsed "${file.name}" in 1-Page ATS format!`, "ok");
        void saveToCloud();
        onClose();
      }
    } catch (err: any) {
      toast(err?.message || "Failed to import file", "warn");
    } finally {
      setIsImporting(false);
      e.target.value = "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col border-2 border-ink bg-card shadow-[8px_8px_0_0_var(--color-ink)]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-ink bg-paper p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center border-2 border-ink bg-acid text-ink">
              <Icon name="cloud" size={20} />
            </span>
            <div>
              <h2 className="font-display text-xl font-black">
                Database Cloud Workspace
              </h2>
              <p className="font-mono text-xs text-ink-soft">
                {user ? `Signed in as ${user.email}` : "Guest Mode · Cloud sync disabled"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center border border-ink/30 bg-card text-ink-soft transition-colors hover:border-ink hover:text-ink"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Guest Warning */}
        {!user && (
          <div className="border-b-2 border-ink bg-acid/40 p-4 text-center">
            <p className="text-sm font-bold text-ink">
              You are using local storage. Sign in free to sync resumes to the database across devices!
            </p>
            <a
              href="/auth?next=/builder"
              className="mt-2 inline-block border-2 border-ink bg-ink px-4 py-1.5 text-xs font-bold text-acid transition-transform hover:-translate-y-0.5"
            >
              Sign in or Create Free Account →
            </a>
          </div>
        )}

        {/* Tab Bar & Action Toolbar */}
        {user && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink bg-paper/50 px-5 py-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("resumes")}
                className={`border-2 px-3 py-1.5 font-mono text-xs font-bold transition-all ${
                  activeTab === "resumes"
                    ? "border-ink bg-ink text-acid"
                    : "border-ink/20 bg-card text-ink-soft hover:border-ink hover:text-ink"
                }`}
              >
                Saved Resumes ({resumes.length})
              </button>
              <button
                onClick={() => setActiveTab("exports")}
                className={`border-2 px-3 py-1.5 font-mono text-xs font-bold transition-all ${
                  activeTab === "exports"
                    ? "border-ink bg-ink text-acid"
                    : "border-ink/20 bg-card text-ink-soft hover:border-ink hover:text-ink"
                }`}
              >
                Export History ({exportsList.length})
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="flex items-center gap-1.5 border border-ink/40 bg-card px-2.5 py-1.5 text-xs font-bold text-ink transition-colors hover:border-ink hover:bg-paper"
              >
                <Icon name="upload" size={13} />
                {isImporting ? "Parsing CV…" : "Import CV / JSON"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt,.json"
                onChange={handleFileImport}
                className="hidden"
              />

              <button
                onClick={handleCreateNew}
                className="flex items-center gap-1.5 border-2 border-ink bg-acid px-3 py-1.5 text-xs font-bold text-ink transition-transform hover:-translate-y-0.5"
              >
                + New Resume
              </button>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-pine border-t-transparent" />
              <p className="mt-3 font-mono text-xs text-ink-soft">Loading from database…</p>
            </div>
          ) : activeTab === "resumes" ? (
            resumes.length === 0 ? (
              <div className="rounded-sm border-2 border-dashed border-ink/20 p-12 text-center">
                <Icon name="doc" size={32} className="mx-auto text-ink-soft/40" />
                <h3 className="mt-3 font-display text-lg font-bold">No saved resumes in cloud yet</h3>
                <p className="mx-auto mt-1 max-w-sm text-xs text-ink-soft">
                  Click "Cloud save" in the builder toolbar to save your current resume into your database cloud account.
                </p>
                <button
                  onClick={async () => {
                    setLoading(true);
                    await saveToCloud();
                    await fetchResumes();
                    setLoading(false);
                    toast("Current resume saved to database!", "ok");
                  }}
                  className="mt-4 border-2 border-ink bg-acid px-4 py-2 text-xs font-bold text-ink"
                >
                  Save Current Draft to Database
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {resumes.map((item) => {
                  const isActive = activeResumeId === item.id;
                  const dateStr = item.updatedAt
                    ? new Date(item.updatedAt).toLocaleString()
                    : "Recently";

                  return (
                    <div
                      key={item.id}
                      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-2 p-4 transition-all ${
                        isActive
                          ? "border-pine bg-acid-soft/40"
                          : "border-ink/20 bg-white hover:border-ink"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="truncate font-display text-base font-bold text-ink">
                            {item.title || "Untitled Resume"}
                          </h4>
                          {isActive && (
                            <span className="border border-pine bg-pine px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-paper">
                              Active Editor
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-[11px] text-ink-soft">
                          <span className="capitalize">Template: {item.template}</span>
                          <span>•</span>
                          <span>{item.pageCount || 1} Page{item.pageCount === 2 ? "s" : ""}</span>
                          <span>•</span>
                          <span>Updated: {dateStr}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleOpenResume(item.id)}
                          className={`border-2 px-3 py-1.5 text-xs font-bold transition-transform hover:-translate-y-0.5 ${
                            isActive
                              ? "border-pine bg-pine text-paper"
                              : "border-ink bg-card hover:bg-paper"
                          }`}
                        >
                          {isActive ? "Currently Open" : "Open in Editor"}
                        </button>
                        <button
                          onClick={() => handleDeleteResume(item.id, item.title)}
                          className="border border-coral/40 p-1.5 text-coral transition-colors hover:border-coral hover:bg-coral/10"
                          title="Delete from database"
                        >
                          <Icon name="trash" size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* Exports Tab */
            exportsList.length === 0 ? (
              <div className="rounded-sm border-2 border-dashed border-ink/20 p-12 text-center">
                <Icon name="download" size={32} className="mx-auto text-ink-soft/40" />
                <h3 className="mt-3 font-display text-lg font-bold">No exports logged yet</h3>
                <p className="mx-auto mt-1 max-w-sm text-xs text-ink-soft">
                  When you download PDF, DOCX, or TXT documents, they will be logged to your database account.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {exportsList.map((exp) => (
                  <div
                    key={exp.id}
                    className="flex items-center justify-between border border-ink/15 bg-white p-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold uppercase text-pine-deep bg-acid-soft px-2 py-0.5 border border-pine/30">
                        {exp.format}
                      </span>
                      <span className="font-semibold text-ink">
                        {exp.resume?.title || "Resume Document"}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-ink-soft">
                      {new Date(exp.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t-2 border-ink bg-paper p-4">
          <div className="flex items-center gap-2 text-xs text-ink-soft font-mono">
            <span className="inline-block h-2 w-2 rounded-full bg-pine" />
            PostgreSQL Prisma Synchronized
          </div>
          <button
            onClick={onClose}
            className="border-2 border-ink bg-card px-4 py-1.5 text-xs font-bold text-ink transition-colors hover:bg-paper"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
