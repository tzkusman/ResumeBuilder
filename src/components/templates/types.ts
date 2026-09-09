import type { ResumeData } from "../../lib/types";

export interface TemplateProps {
  data: ResumeData;
  pageNumber?: 1 | 2;
}

export function splitResumeData(data: ResumeData) {
  const isTwoPage = data.pageCount === 2;
  const xp = data.experience.filter((e) => e.role || e.company);
  const edu = data.education.filter((e) => e.degree || e.school);
  
  // Balance experience between page 1 and page 2
  const p1Count = xp.length > 3 ? Math.min(3, Math.ceil(xp.length / 2)) : Math.min(2, xp.length);
  const xpPage1 = isTwoPage ? xp.slice(0, p1Count) : xp;
  const xpPage2 = isTwoPage ? xp.slice(p1Count) : [];

  const projects = data.projects?.filter((p) => p.title) || [];
  const volunteer = data.volunteer?.filter((v) => v.role || v.org) || [];

  return {
    isTwoPage,
    xp,
    edu,
    xpPage1,
    xpPage2,
    projects,
    volunteer,
    contact: data.contact,
    accent: data.accent,
  };
}
