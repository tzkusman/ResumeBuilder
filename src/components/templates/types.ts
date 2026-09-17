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
 * Calculates whether the resume content fits in 1 A4 page or requires 2 pages.
 * By default, industry-standard ATS resumes strictly fit on 1 single page.
 * A 2nd page is ONLY activated if the user explicitly chose 2 pages (data.pageCount === 2).
 */
export function calculateAutoPageCount(data: ResumeData): 1 | 2 {
  // STRICT 1-PAGE DEFAULT:
  // Industry-standard ATS resumes must strictly fit on 1 single page.
  // Unless the user explicitly chooses 2 pages (pageCount === 2), force 1 page.
  if (data.pageCount !== 2) return 1;

  // If user explicitly chose 2 pages, verify they have enough content to distribute across 2 sheets
  const xp = data.experience?.filter((e) => e.role || e.company) || [];
  const edu = data.education?.filter((e) => e.degree || e.school) || [];
  const projects = data.projects?.filter((p) => p.title) || [];
  const certs = data.certifications || [];
  const hasEnoughForTwo = xp.length >= 2 || projects.length >= 2 || (xp.length + projects.length + edu.length + certs.length) >= 4;

  return hasEnoughForTwo ? 2 : 1;
}

export function splitResumeData(data: ResumeData) {
  const effectivePageCount = calculateAutoPageCount(data);
  const isTwoPage = effectivePageCount === 2;

  const xp = data.experience.filter((e) => e.role || e.company);
  const edu = data.education.filter((e) => e.degree || e.school);
  const projects = data.projects?.filter((p) => p.title) || [];
  const volunteer = data.volunteer?.filter((v) => v.role || v.org) || [];
  const certs = data.certifications || [];
  const langs = data.languages || [];
  const skills = data.skills || [];

  if (!isTwoPage) {
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

  // =========================================================================
  // TWO-PAGE DYNAMIC OVERFLOW ("WITH CONTINUE"):
  // Page 1 is filled to physical capacity first (~840 points).
  // Older experience and extended sections cleanly continue onto Page 2.
  // Neither page is left sparse or empty.
  // =========================================================================
  const headerPoints = ((data.contact.photoUrl && data.contact.showPhoto !== false) ? 110 : 70) +
    (data.summary ? 25 + Math.min(80, data.summary.length * 0.2) : 0);
  const skillsPoints = skills.length ? 20 + Math.ceil(skills.length / 5) * 14 : 0;

  const maxP1Points = 840;
  let usedP1 = headerPoints + skillsPoints;

  const xpPage1: XpEntry[] = [];
  const xpPage2: XpEntry[] = [];

  const hasOtherPage2Content = projects.length > 0 || volunteer.length > 0;

  for (let i = 0; i < xp.length; i++) {
    const item = xp[i];
    const itemPoints = 35 + (item.bullets.filter(Boolean).length * 15);
    const isLastJob = i === xp.length - 1;

    // If this is the last job, and there are no projects or volunteer,
    // put at least 1 job on Page 2 if Page 1 already has 2+ jobs
    if (isLastJob && !hasOtherPage2Content && xpPage1.length >= 2 && edu.length === 0) {
      xpPage2.push(item);
    } else if (usedP1 + itemPoints <= maxP1Points) {
      xpPage1.push(item);
      usedP1 += itemPoints;
    } else {
      xpPage2.push(item);
    }
  }

  // Ensure at least 1 job on page 1 if experience exists
  if (xp.length > 0 && xpPage1.length === 0) {
    const first = xpPage2.shift();
    if (first) xpPage1.push(first);
  }

  // Education:
  const eduPage1: EduEntry[] = [];
  const eduPage2: EduEntry[] = [];
  const eduPoints = edu.length > 0 ? 25 + edu.length * 20 : 0;

  if (edu.length > 0) {
    if (usedP1 + eduPoints <= maxP1Points && (xpPage2.length === 0 || projects.length > 0 || volunteer.length > 0 || xpPage2.length >= 2)) {
      eduPage1.push(...edu);
      usedP1 += eduPoints;
    } else {
      eduPage2.push(...edu);
    }
  }

  // Certifications:
  const certsPage1: string[] = [];
  const certsPage2: string[] = [];
  const certPoints = certs.length > 0 ? 15 + certs.length * 10 : 0;

  if (certs.length > 0) {
    if (usedP1 + certPoints <= maxP1Points && eduPage2.length === 0 && xpPage2.length === 0) {
      certsPage1.push(...certs);
      usedP1 += certPoints;
    } else {
      certsPage2.push(...certs);
    }
  }

  // Languages:
  const languagesPage1: string[] = [];
  const languagesPage2: string[] = [];
  const langPoints = langs.length > 0 ? 15 : 0;

  if (langs.length > 0) {
    if (usedP1 + langPoints <= maxP1Points && certsPage2.length === 0 && eduPage2.length === 0) {
      languagesPage1.push(...langs);
      usedP1 += langPoints;
    } else {
      languagesPage2.push(...langs);
    }
  }

  // Projects:
  const projectsPage1: ProjectEntry[] = [];
  const projectsPage2: ProjectEntry[] = [];
  for (const p of projects) {
    const pCost = 45 + (p.bullets?.filter(Boolean).length || 0) * 16;
    if (usedP1 + pCost <= maxP1Points && xpPage2.length === 0) {
      projectsPage1.push(p);
      usedP1 += pCost;
    } else {
      projectsPage2.push(p);
    }
  }

  // Volunteer:
  const volunteerPage1: VolunteerEntry[] = [];
  const volunteerPage2: VolunteerEntry[] = [];
  for (const v of volunteer) {
    const vCost = 25;
    if (usedP1 + vCost <= maxP1Points && xpPage2.length === 0 && projectsPage2.length === 0) {
      volunteerPage1.push(v);
      usedP1 += vCost;
    } else {
      volunteerPage2.push(v);
    }
  }

  // Guarantee: Page 2 must have at least something if isTwoPage is true
  const hasPage2 =
    xpPage2.length > 0 ||
    projectsPage2.length > 0 ||
    eduPage2.length > 0 ||
    certsPage2.length > 0 ||
    languagesPage2.length > 0 ||
    volunteerPage2.length > 0;

  if (!hasPage2) {
    if (projectsPage1.length > 0) {
      projectsPage2.push(...projectsPage1.splice(0, projectsPage1.length));
    } else if (volunteerPage1.length > 0) {
      volunteerPage2.push(...volunteerPage1.splice(0, volunteerPage1.length));
    } else if (certsPage1.length > 0) {
      certsPage2.push(...certsPage1.splice(0, certsPage1.length));
    } else if (languagesPage1.length > 0) {
      languagesPage2.push(...languagesPage1.splice(0, languagesPage1.length));
    } else if (eduPage1.length > 0) {
      eduPage2.push(...eduPage1.splice(0, eduPage1.length));
    } else if (xpPage1.length >= 2) {
      const moved = xpPage1.pop();
      if (moved) xpPage2.unshift(moved);
    }
  }

  return {
    isTwoPage: true,
    effectivePageCount: 2 as const,
    xp,
    edu,
    projects,
    volunteer,
    xpPage1,
    xpPage2,
    eduPage1,
    eduPage2,
    projectsPage1,
    projectsPage2,
    volunteerPage1,
    volunteerPage2,
    certsPage1,
    certsPage2,
    languagesPage1,
    languagesPage2,
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
