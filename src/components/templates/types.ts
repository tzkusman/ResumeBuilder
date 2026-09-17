import type { ResumeData, XpEntry, EduEntry, ProjectEntry, VolunteerEntry } from "../../lib/types";

export type ResumeSectionKey = "contact" | "summary" | "experience" | "education" | "skills" | "projects" | "extras";

export type OnSelectSectionFn = (
  section: ResumeSectionKey,
  subfield?: string,
  itemId?: string
) => void;

export interface TemplateProps {
  data: ResumeData;
  pageNumber?: 1 | 2;
  onSelectSection?: OnSelectSectionFn;
  onUpdateText?: (path: string, value: any) => void;
  editableInline?: boolean;
}

/**
 * Single-Page Dynamic Architecture:
 * Resumes strictly remain on a single continuous page in the interactive preview.
 * If more detail is added or a large CV is uploaded, the page dynamically expands its height
 * to fit all content without splitting or cutting off.
 */
export function calculateAutoPageCount(_data: ResumeData): 1 {
  return 1;
}

export function splitResumeData(data: ResumeData) {
  const xp = data.experience.filter((e) => e.role || e.company);
  const edu = data.education.filter((e) => e.degree || e.school);
  const projects = data.projects?.filter((p) => p.title) || [];
  const volunteer = data.volunteer?.filter((v) => v.role || v.org) || [];
  const certs = data.certifications || [];
  const langs = data.languages || [];
  const skills = data.skills || [];

  return {
    isTwoPage: false,
    effectivePageCount: 1 as const,
    xp,
    edu,
    projects,
    volunteer,
    xpPage1: xp,
    xpPage2: [] as XpEntry[],
    eduPage1: edu,
    eduPage2: [] as EduEntry[],
    projectsPage1: projects,
    projectsPage2: [] as ProjectEntry[],
    volunteerPage1: volunteer,
    volunteerPage2: [] as VolunteerEntry[],
    certsPage1: certs,
    certsPage2: [] as string[],
    languagesPage1: langs,
    languagesPage2: [] as string[],
    skillsPage1: skills,
    skillsPage2: [] as string[],
    contact: data.contact,
    accent: data.accent,
  };
}

/**
 * Generates interactive section navigation data attributes and click handler.
 * Preserves all layout styles and prevents browser tooltip popups.
 */
export function getSectionProps(
  section: ResumeSectionKey,
  onSelectSection?: OnSelectSectionFn
) {
  if (!onSelectSection) return {};

  return {
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelectSection(section);
    },
    "data-section": section,
  };
}

/**
 * Generates item-level interactive props for clicking specific fields and rows.
 * Preserves all layout styles and prevents browser tooltip popups.
 */
export function getItemProps(
  section: ResumeSectionKey,
  subfield?: string,
  itemId?: string,
  onSelectSection?: OnSelectSectionFn
) {
  if (!onSelectSection) return {};

  return {
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelectSection(section, subfield, itemId);
    },
    "data-section": section,
    "data-subfield": subfield,
    "data-item-id": itemId,
  };
}
