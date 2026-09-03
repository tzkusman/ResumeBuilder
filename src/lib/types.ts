import type { Profession } from "../data/professions";

export interface Contact {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
}

export interface XpEntry {
  id: string;
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
}

export interface EduEntry {
  id: string;
  degree: string;
  school: string;
  location: string;
  year: string;
}

export type TemplateId = "merit" | "ledger" | "atlas" | "craft";

export interface ResumeData {
  id: string;
  roleSlug: string | null;
  contact: Contact;
  summary: string;
  experience: XpEntry[];
  education: EduEntry[];
  skills: string[];
  languages: string[];
  certifications: string[];
  template: TemplateId;
  accent: string;
}

export const ACCENTS = ["#17594a", "#1f4e9c", "#7c2f3e", "#0e6e6e", "#33383d", "#a84a22"];

export const uid = () => Math.random().toString(36).slice(2, 10);

export const emptyResume = (): ResumeData => ({
  id: uid(),
  roleSlug: null,
  contact: { fullName: "", title: "", email: "", phone: "", location: "", website: "", linkedin: "" },
  summary: "",
  experience: [
    { id: uid(), role: "", company: "", location: "", start: "", end: "", bullets: [""] },
  ],
  education: [{ id: uid(), degree: "", school: "", location: "", year: "" }],
  skills: [],
  languages: [],
  certifications: [],
  template: "merit",
  accent: ACCENTS[0],
});

export function resumeFromProfession(p: Profession): ResumeData {
  return {
    id: uid(),
    roleSlug: p.slug,
    contact: {
      fullName: SAMPLE_NAMES[[...p.slug].reduce((a, c) => a + c.charCodeAt(0), 0) % SAMPLE_NAMES.length],
      title: p.title,
      email: "alex.morgan@email.com",
      phone: "+1 (555) 014-2288",
      location: "United States",
      website: "alexmorgan.dev",
      linkedin: "linkedin.com/in/alex-morgan",
    },
    summary: p.summary,
    experience: p.experience.map((e) => ({ id: uid(), ...e, bullets: [...e.bullets] })),
    education: [{ id: uid(), degree: p.education.degree, school: p.education.school, location: "", year: p.education.year }],
    skills: [...p.skills],
    languages: ["English (Native)"],
    certifications: [...p.certifications],
    template: "merit",
    accent: ACCENTS[0],
  };
}

const SAMPLE_NAMES = [
  "Alex Morgan", "Jordan Reyes", "Sam Okafor", "Priya Sharma", "Daniyal Ahmed",
  "Miguel Santos", "Hannah Kim", "Fatima Noor", "Liam O'Brien", "Aisha Khan",
  "Chen Wei", "Sofia Rossi", "David Osei", "Nadia Petrova", "Omar Haddad",
  "Grace Njoroge", "Tyler Brooks", "Yuki Tanaka", "Isabella Costa", "Marcus Hale",
];
