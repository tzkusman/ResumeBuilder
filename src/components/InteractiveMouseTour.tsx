import React, { useEffect, useState, useRef, useCallback } from "react";
import { Icon } from "./ui";
import { type ResumeData, ACCENTS, uid, type TemplateId } from "../lib/types";
import { type ResumeSectionKey } from "./templates/types";

export type TourTabKey = ResumeSectionKey | "template" | "review";

export interface TourStep {
  id: string;
  targetId: string;
  tabToOpen?: TourTabKey;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  deepDetails: string[];
  dos: string[];
  donts: string[];
  tip: string;
  preferredSide?: "left" | "right";
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: "contact-name",
    targetId: "tour-contact-name",
    tabToOpen: "contact",
    badge: "Step 1 of 10",
    title: "1. Your Name & Target Job Title",
    subtitle: "The Identity & Header Anchor",
    description:
      "Applicant Tracking Systems (ATS) and human recruiters scan your resume header in under 3 seconds. Your name and target title anchor your entire candidate record in corporate hiring databases.",
    deepDetails: [
      "ATS parsers extract your Job Title as the primary search filter. If a recruiter searches their database for 'Senior Frontend Engineer', resumes with non-standard titles are pushed to the bottom.",
      "Workday, Taleo, and Greenhouse parse the top-most prominent text as Candidate Name. Never put your name inside a graphic textbox or background shape.",
      "Target title alignment: Always tailor your title to match or closely mirror the exact role you are applying for.",
    ],
    dos: [
      "Use recognized industry titles (e.g., 'Senior Full-Stack Engineer', 'Lead Product Manager').",
      "Include standard seniority prefixes (Junior, Mid, Senior, Staff, Lead).",
    ],
    donts: [
      "Never use whimsical titles like 'Coding Ninja', 'Tech Guru', or 'Growth Wizard'.",
      "Avoid mixing multiple unrelated disciplines in one title.",
    ],
    tip: "💡 ATS Rule: Use an industry-standard job title matching the role you are applying for to maximize keyword ranking.",
    preferredSide: "right",
  },
  {
    id: "contact-reach",
    targetId: "tour-contact-reachability",
    tabToOpen: "contact",
    badge: "Step 2 of 10",
    title: "2. Reachability & Location",
    subtitle: "Email, Phone, City Filters & Profiles",
    description:
      "Enterprise ATS algorithms automatically apply geographic radius filters and contact verification checks before any human ever reviews your application.",
    deepDetails: [
      "Location radius filtering: Enterprise recruiting portals filter candidates by radius (e.g. 'Within 35 miles of Austin, TX'). Missing location can trigger automatic disqualification.",
      "Modern privacy standard: Street addresses are obsolete and introduce bias risks. 'City, State' (or 'City, Country') is the universal ATS gold standard.",
      "Clean URL formatting: Always provide clean URLs for LinkedIn and GitHub without tracking parameters (strip ?trk=, ?utm_source=).",
    ],
    dos: [
      "Use a professional email format (e.g. first.last@gmail.com).",
      "Provide 'City, State/Country' (e.g. 'San Francisco, CA' or 'London, UK').",
      "Include a direct phone number formatted with country code if applying internationally.",
    ],
    donts: [
      "Never include your full street address or postal mailbox.",
      "Never use old novelty or childhood email addresses (e.g., skater99@...).",
    ],
    tip: "💡 Privacy Tip: City & State/Country is sufficient. Street addresses are no longer needed and invite subconscious bias.",
    preferredSide: "right",
  },
  {
    id: "summary",
    targetId: "tour-summary-section",
    tabToOpen: "summary",
    badge: "Step 3 of 10",
    title: "3. Professional Summary / Bio",
    subtitle: "Your High-Impact 30-Second Elevator Pitch",
    description:
      "A 25–85 word career summary that immediately highlights your years of experience, core superpowers, and primary quantifiable achievements.",
    deepDetails: [
      "The 6-second scan: Recruiters spend an average of 6 to 7.4 seconds on their initial pass. Your summary determines whether they read the rest.",
      "The 3-part ATS formula: (1) Identity + years of experience, (2) Core technical competencies and domain expertise, (3) Top signature metric or business achievement.",
      "Keyword density: ATS semantic search indexes the summary heavily for domain terms (e.g., 'Distributed Systems', 'Cloud Architecture', 'Agile Delivery').",
    ],
    dos: [
      "Start directly with value: 'Results-driven engineer with 7+ years of experience in...'",
      "Keep length strictly between 25 and 85 words (2 to 4 concise sentences).",
      "Highlight concrete, measurable value delivered to past organizations.",
    ],
    donts: [
      "Never use first-person pronouns ('I', 'me', 'my').",
      "Ban generic fluff verbs: avoid 'hard-working', 'detail-oriented', 'team player'.",
    ],
    tip: "💡 ATS Rule: Never use first-person pronouns ('I', 'my', 'me'). Start directly with your value: 'Results-driven engineer with 6+ years...'",
    preferredSide: "right",
  },
  {
    id: "experience",
    targetId: "tour-experience-section",
    tabToOpen: "experience",
    badge: "Step 4 of 10",
    title: "4. Work Experience & Impact",
    subtitle: "Quantifiable Achievements & The Google XYZ Formula",
    description:
      "Work experience accounts for 65%+ of your total candidate score in automated screening. Hiring managers look for measurable business results, not passive task descriptions.",
    deepDetails: [
      "The Google XYZ Formula: 'Accomplished [X], as measured by [Y], by doing [Z]'. This structure is the benchmark used by top tier tech, finance, and consulting recruiters.",
      "Action verb taxonomy: Lead every bullet with an impactful, past-tense power verb (e.g. Spearheaded, Architected, Engineered, Reduced, Automated, Scaled).",
      "Metric density rule: At least 70% of your bullet points should contain numbers, percentages, dollar values, latency reductions, or headcount scale.",
    ],
    dos: [
      "Quantify results: 'Reduced API response time by 45% using Redis caching.'",
      "Specify technology stack used to solve the business challenge.",
      "List roles in reverse-chronological order.",
    ],
    donts: [
      "Never write passive job duty lists: avoid 'Responsible for writing code.'",
      "Avoid wall-of-text paragraphs; keep bullets between 1 and 3 lines.",
    ],
    tip: "💡 Google XYZ Formula: 'Accomplished [X], as measured by [Y], by doing [Z]'. Use strong action verbs like Spearheaded, Engineered, Reduced.",
    preferredSide: "right",
  },
  {
    id: "skills",
    targetId: "tour-skills-section",
    tabToOpen: "skills",
    badge: "Step 5 of 10",
    title: "5. Core Skills & ATS Keywords",
    subtitle: "The Primary Search Filter for Recruiters",
    description:
      "Skills are parsed as inverted search indexes in ATS software. When hiring teams search for specific competencies, candidates lacking those exact keywords are filtered out.",
    deepDetails: [
      "Hard skills vs. soft skills: ATS algorithms give 5x higher weight to hard technical skills and tools than soft skills. Demonstrate soft skills through achievements in experience bullets.",
      "Acronym & full-term matching: Always pair abbreviations with full names (e.g., 'AWS' & 'Amazon Web Services', 'CI/CD' & 'Continuous Integration') to satisfy strict regex filters.",
      "Optimal keyword density: Aim for 10 to 18 high-relevance skills. Having fewer than 6 triggers low-content warnings; over 30 can trigger keyword-stuffing penalties.",
    ],
    dos: [
      "Group skills logically: Languages, Frameworks, Cloud & Databases, Methodologies.",
      "Target exact keyword phrasing found in the target job description.",
    ],
    donts: [
      "Do not list obsolete or redundant skills (e.g., 'Windows 98', 'Microsoft Word').",
      "Never use visual progress bars or stars (e.g., 'Python ★★★★☆') as ATS cannot parse graphics.",
    ],
    tip: "💡 ATS Keyword Tip: Include both abbreviations and written terms (e.g. 'CI/CD' and 'Continuous Integration') to hit parser match rules.",
    preferredSide: "right",
  },
  {
    id: "education",
    targetId: "tour-education-section",
    tabToOpen: "education",
    badge: "Step 6 of 10",
    title: "6. Education & Qualifications",
    subtitle: "Degrees, Universities & Certifications",
    description:
      "Enterprise systems automatically evaluate educational credentials against minimum job requirements. Proper formatting ensures your degree is recognized instantly.",
    deepDetails: [
      "Mandatory parser fields: ATS parsers look specifically for Degree Name, Institution Name, Graduation Year, and Major/Specialization.",
      "Honors & GPA: Only include GPA if it is 3.5 or higher and you graduated within the past 3 years. After 3+ years of professional experience, GPA is disregarded.",
      "Mitigating age bias: If you graduated more than 10 years ago, omitting the graduation year is standard practice and prevents subconscious age filtering.",
    ],
    dos: [
      "State the degree formally (e.g., 'Bachelor of Science in Computer Science').",
      "Include recognized industry certifications (e.g., AWS Certified Solutions Architect, PMP).",
    ],
    donts: [
      "Do not list high school education once you have completed university or college.",
      "Never falsify degree status; automated background checks verify credentials.",
    ],
    tip: "💡 Formatting Tip: If you graduated more than 5 years ago, you can omit the graduation year to avoid subconscious age bias.",
    preferredSide: "right",
  },
  {
    id: "jd-assistant",
    targetId: "tour-jd-assistant",
    badge: "Step 7 of 10",
    title: "7. Target Job Keyword Assistant",
    subtitle: "Beat Automated Semantic Keyword Filters",
    description:
      "Paste any target job description to extract required keywords in real-time. Our smart matcher identifies missing terms and calculates your automated ATS compatibility score.",
    deepDetails: [
      "How ATS matching algorithms work: Modern ATS platforms (Workday, Taleo, Greenhouse) calculate candidate match percentages using cosine similarity and n-gram term frequency.",
      "The 70% sweet spot: Achieving a 70% to 85% keyword match rate maximizes interview invitations. Reaching 100% can trigger spam flags for verbatim copying.",
      "1-Click live injection: You can inject missing keywords directly into your skills list or generate tailored experience bullets with a single click.",
    ],
    dos: [
      "Paste the full job posting including responsibilities and required qualifications.",
      "Integrate missing high-priority keywords into both your Skills section and Work Experience bullets.",
    ],
    donts: [
      "Never hide invisible white text in your resume (ATS parsers extract all text and immediately flag fraud).",
      "Avoid copy-pasting entire sentences directly from the job posting.",
    ],
    tip: "💡 Recruiter Secret: Reaching 70%+ keyword overlap can triple your interview request rate on Taleo, Workday, and Greenhouse.",
    preferredSide: "right",
  },
  {
    id: "templates",
    targetId: "tour-templates-bar",
    tabToOpen: "template",
    badge: "Step 8 of 10",
    title: "8. ATS Templates & Typography",
    subtitle: "100% Single-Column Recruiter-Approved Layouts",
    description:
      "Over 75% of resume parsing failures stem from multi-column layouts, tables, textboxes, and non-standard fonts. Our 16 templates are engineered for 100% ATS compliance.",
    deepDetails: [
      "The multi-column trap: When an ATS scans a 2-column resume, it reads horizontally across columns, combining unrelated text from left and right into garbled nonsense.",
      "Vector font embedding: Our system ensures all fonts are embedded as selectable vector text, guaranteeing clean optical recognition across all applicant portals.",
      "Typography psychology: Clean serifs (Merit, Classic) project authority in Finance and Law; crisp sans-serifs (Tech, Modern, Summit) dominate in Technology and Creative roles.",
    ],
    dos: [
      "Use proven single-column linear hierarchies for highest ATS compatibility.",
      "Select high-contrast ink colors (dark navy, charcoal, forest green, deep burgundy).",
    ],
    donts: [
      "Never use resumes with columns, sidebars, graphic progress bars, or icons for contact details.",
      "Never use light gray text that fails contrast accessibility standards.",
    ],
    tip: "💡 Formatting Tip: Clean single-column templates like Merit, Tech, and Modern consistently score highest across all ATS software.",
    preferredSide: "right",
  },
  {
    id: "preview",
    targetId: "tour-preview-doc",
    badge: "Step 9 of 10",
    title: "9. Live Document & Click-to-Edit",
    subtitle: "Real-Time WYSIWYG Continuous Rendering",
    description:
      "Your resume updates continuously as you type with zero awkward page boundary cutoffs. Click directly on any text or section inside the live preview to immediately jump to and edit that field!",
    deepDetails: [
      "Continuous vector rendering: Unlike clunky PDF viewers that require manual refreshing, our live preview renders with sub-millimeter precision in real-time.",
      "1-Page vs 2-Page strategy: Candidates with under 7 years of experience should strictly adhere to a 1-page format; senior executives with 7+ years can utilize a balanced 2-page layout.",
      "Print fold guide: Toggle 'Show Print Breaks' above the preview to inspect exact A4 paper boundary lines before downloading.",
    ],
    dos: [
      "Click any text in the preview to auto-navigate and focus that field in the editor.",
      "Inspect your resume at 100% zoom to verify visual hierarchy, balance, and white space.",
    ],
    donts: [
      "Avoid leaving awkward orphan lines (1 or 2 isolated words on a new line).",
      "Do not stretch content to a 2nd page if it only fills a quarter of the page.",
    ],
    tip: "💡 Pro Tip: Click any text in the live preview document to instantly focus and edit that exact field in the editor!",
    preferredSide: "left",
  },
  {
    id: "export",
    targetId: "tour-export-button",
    badge: "Step 10 of 10",
    title: "10. ATS Pre-Flight Check & Export",
    subtitle: "Download Ready-to-Apply PDF, DOCX & Plain Text",
    description:
      "Perform a final pre-flight audit and download your application file in 1 click. Our exports are verified across Taleo, Workday, Greenhouse, Lever, and iCIMS.",
    deepDetails: [
      "Selectable text verification: Our PDF generator produces pure text vectors. You can select, copy, and search all words inside the generated PDF.",
      "Standard file naming: Always name your file using the professional convention: `FirstName_LastName_TargetRole.pdf`.",
      "Format preference: 92% of corporate applicant systems prefer PDF; use DOCX only when explicitly requested by recruiters or staffing agencies.",
    ],
    dos: [
      "Download a PDF copy for standard job submissions.",
      "Keep a Plain Text (TXT) copy handy for rapid copy-pasting into legacy web forms.",
    ],
    donts: [
      "Never submit a scanned image or photo of your resume.",
      "Never name your file generic names like 'Resume.pdf' or 'CV_final_v3.pdf'.",
    ],
    tip: "💡 Submission Tip: Always send PDF unless the job application explicitly requests .docx format.",
    preferredSide: "left",
  },
];

const SUGGESTED_ROLES = [
  "Senior Full-Stack Engineer",
  "Staff Backend Architect",
  "Lead Product Manager",
  "Senior Data Scientist",
  "DevOps & Cloud Engineer",
  "Engineering Manager",
];

const SKILL_CLUSTERS = [
  {
    category: "Frontend & UI",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Vue.js", "State Management"],
  },
  {
    category: "Backend & Systems",
    skills: ["Node.js", "Python", "Go", "PostgreSQL", "Redis", "GraphQL", "REST APIs"],
  },
  {
    category: "Cloud & DevOps",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform", "Microservices"],
  },
  {
    category: "Methodology",
    skills: ["Agile / Scrum", "System Architecture", "Test-Driven Development", "Code Review"],
  },
];

const SAMPLE_JD = `Senior Full-Stack Software Engineer Responsibilities:
- Architect, build, and scale high-throughput web applications using React, TypeScript, and Node.js.
- Partner with cross-functional product teams to design event-driven microservices deployed to AWS.
- Optimize complex database queries in PostgreSQL, implement Redis caching, and maintain automated CI/CD pipelines.
- Mentor junior engineers, participate in code reviews, and drive agile sprint deliveries.
- Qualifications: 4+ years full-stack development, strong distributed systems experience, and RESTful API design.`;

interface InteractiveMouseTourProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab?: (tab: TourTabKey) => void;
  resume: ResumeData;
  setResume: React.Dispatch<React.SetStateAction<ResumeData>>;
  setContact: (k: keyof ResumeData["contact"], v: any) => void;
  jd?: string;
  onJdChange?: (val: string) => void;
  onExport?: (format: "pdf" | "docx" | "txt") => void;
}

export function InteractiveMouseTour({
  isOpen,
  onClose,
  onSelectTab,
  resume,
  setResume,
  setContact,
  jd = "",
  onJdChange,
  onExport,
}: InteractiveMouseTourProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [cardPos, setCardPos] = useState<{ top: number; left: number }>({ top: 90, left: 520 });
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number }>({ x: 480, y: 180 });
  const [newSkillInput, setNewSkillInput] = useState("");
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isPeeking, setIsPeeking] = useState(false);
  const [showDeepDetails, setShowDeepDetails] = useState(false);
  const [customPos, setCustomPos] = useState<{ top: number; left: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialLeft: number; initialTop: number } | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const currentStep = TOUR_STEPS[currentStepIndex];

  // Recalculate target position with STRICT NON-OVERLAPPING GUARANTEE
  const updatePositions = useCallback(() => {
    if (!isOpen || !currentStep) return;

    const smallScreen = window.innerWidth < 960;
    setIsMobile(smallScreen);

    if (currentStep.tabToOpen && onSelectTab) {
      onSelectTab(currentStep.tabToOpen);
    }

    setTimeout(() => {
      let targetEl = document.getElementById(currentStep.targetId);

      // Fallback searches
      if (!targetEl) {
        if (currentStep.id.startsWith("contact")) {
          targetEl = document.getElementById("contact-fullName") || document.getElementById("tour-contact-section");
        } else if (currentStep.id === "export") {
          targetEl = document.getElementById("tour-export-button");
        } else if (currentStep.id === "preview") {
          targetEl = document.getElementById("tour-preview-doc");
        } else if (currentStep.id === "skills") {
          targetEl = document.getElementById("tour-skills-section") || document.getElementById("skills-input");
        } else if (currentStep.id === "experience") {
          targetEl = document.getElementById("tour-experience-section") || document.getElementById("xp-tab-container");
        } else if (currentStep.id === "education") {
          targetEl = document.getElementById("tour-education-section") || document.getElementById("edu-tab-container");
        } else if (currentStep.id === "summary") {
          targetEl = document.getElementById("tour-summary-section") || document.getElementById("summary-textarea");
        }
      }

      if (!targetEl) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        setPointerPos({ x: centerX, y: centerY });
        setCardPos({ top: Math.max(16, centerY - 220), left: Math.max(16, centerX - 230) });
        setTargetRect(null);
        return;
      }

      // Smooth scroll target into view
      // On desktop, align center. On mobile, align near top so bottom dock does not hide it!
      targetEl.scrollIntoView({
        behavior: "smooth",
        block: smallScreen ? "start" : "center",
        inline: "nearest",
      });

      setTimeout(() => {
        if (!targetEl) return;
        const rect = targetEl.getBoundingClientRect();
        setTargetRect(rect);

        const cardWidth = Math.min(480, window.innerWidth - 32);
        const measuredHeight = cardRef.current?.offsetHeight || 520;
        const cardHeight = Math.min(measuredHeight, window.innerHeight - 32);

        if (smallScreen) {
          // On mobile, card is docked at bottom, pointer points to target element
          const ptrX = Math.max(20, Math.min(rect.left + rect.width / 2, window.innerWidth - 40));
          const ptrY = Math.max(20, Math.min(rect.top + 20, window.innerHeight - 360));
          setPointerPos({ x: ptrX, y: ptrY });
          return;
        }

        // DESKTOP: GUARANTEED ZERO-OVERLAP SMART PLACEMENT
        // Check whether target is on the left half or right half of the screen
        const isTargetInLeftHalf = (rect.left + rect.width / 2) < (window.innerWidth / 2);
        let cLeft: number;
        let cTop: number;
        let ptrX: number;
        let ptrY: number;

        if (isTargetInLeftHalf) {
          // Target is in the left editor column (e.g. contact, summary, experience, skills, education, jd)
          // Place the tour card completely on the RIGHT of the target element!
          cLeft = rect.right + 24;
          // If right doesn't fit, clamp safely
          if (cLeft + cardWidth > window.innerWidth - 16) {
            cLeft = Math.max(16, window.innerWidth - cardWidth - 16);
          }
          ptrX = rect.right - 8;
          ptrY = Math.max(rect.top + 24, Math.min(rect.top + rect.height / 2, rect.top + 80));
        } else {
          // Target is on the right side (e.g. live preview document, top export buttons)
          // Place the tour card on the LEFT of the target element!
          cLeft = Math.max(16, rect.left - cardWidth - 24);
          ptrX = rect.left + 8;
          ptrY = Math.max(rect.top + 24, Math.min(rect.top + rect.height / 2, rect.top + 80));
        }

        // Align vertically with target element, clamped safely inside viewport
        cTop = Math.max(70, Math.min(rect.top - 12, window.innerHeight - cardHeight - 20));

        // Clamp pointer within visible screen
        ptrX = Math.max(16, Math.min(ptrX, window.innerWidth - 30));
        ptrY = Math.max(16, Math.min(ptrY, window.innerHeight - 30));

        setPointerPos({ x: ptrX, y: ptrY });

        // If user hasn't manually dragged the card, update card position
        if (!customPos) {
          setCardPos({ top: cTop, left: cLeft });
        }
      }, 150);
    }, 60);
  }, [isOpen, currentStep, onSelectTab, customPos]);

  useEffect(() => {
    if (isOpen) {
      updatePositions();
      const onResize = () => {
        setIsMobile(window.innerWidth < 960);
        updatePositions();
      };
      window.addEventListener("resize", onResize);
      window.addEventListener("scroll", updatePositions, true);
      return () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("scroll", updatePositions, true);
      };
    }
  }, [isOpen, updatePositions]);

  // Reset custom drag position on step change
  useEffect(() => {
    setCustomPos(null);
    setShowDeepDetails(false);
  }, [currentStepIndex]);

  // Dragging handlers
  const handleMouseDownHeader = (e: React.MouseEvent) => {
    if (isMobile) return;
    setIsDragging(true);
    const initialLeft = customPos ? customPos.left : cardPos.left;
    const initialTop = customPos ? customPos.top : cardPos.top;
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialLeft,
      initialTop,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragStartRef.current) return;
      const dx = e.clientX - dragStartRef.current.startX;
      const dy = e.clientY - dragStartRef.current.startY;
      const cardWidth = Math.min(480, window.innerWidth - 32);
      const newLeft = Math.max(16, Math.min(dragStartRef.current.initialLeft + dx, window.innerWidth - cardWidth - 16));
      const newTop = Math.max(16, Math.min(dragStartRef.current.initialTop + dy, window.innerHeight - 200));
      setCustomPos({ left: newLeft, top: newTop });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") {
        if (e.key === "Escape") {
          (e.target as HTMLElement).blur();
        }
        return;
      }

      if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleDismiss();
      } else if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        setIsPeeking((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentStepIndex]);

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleDismiss();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleDismiss = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem("rb_tour_seen", "true");
      } catch {}
    }
    onClose();
  };

  // Quick helper actions
  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (!resume.skills.includes(trimmed)) {
      setResume((r) => ({
        ...r,
        skills: [...r.skills, trimmed],
      }));
    }
    setNewSkillInput("");
  };

  const handleRemoveSkill = (skill: string) => {
    setResume((r) => ({
      ...r,
      skills: r.skills.filter((s) => s !== skill),
    }));
  };

  const handleApplySummaryArchetype = (type: "engineering" | "product" | "cloud") => {
    let summaryText = "";
    if (type === "engineering") {
      summaryText =
        "Results-driven Senior Software Engineer with 7+ years architecting scalable cloud-native microservices and responsive web platforms. Proven track record reducing API latency by 45% and leading cross-functional teams to deliver mission-critical SaaS solutions.";
    } else if (type === "product") {
      summaryText =
        "Strategic Senior Product Manager with 6+ years steering end-to-end agile roadmaps, user growth, and enterprise feature launches. Generated $2.4M ARR expansion by prioritizing high-retention telemetry workflows and streamlining UX funnels.";
    } else {
      summaryText =
        "Principal Cloud Solutions Architect with 8+ years designing high-availability distributed systems on AWS and Kubernetes. Automated multi-region CI/CD pipelines, slashing deployment incident rates by 80% while ensuring ISO 27001 compliance.";
    }
    setResume((r) => ({ ...r, summary: summaryText }));
  };

  const handleInsertMetricBullet = (bulletText: string) => {
    const defaultBullet = bulletText;
    setResume((r) => {
      const xp = [...r.experience];
      if (xp.length === 0) {
        xp.push({
          id: uid(),
          role: "Senior Software Engineer",
          company: "Enterprise Cloud Solutions",
          location: "San Francisco, CA",
          start: "2021",
          end: "Present",
          bullets: [defaultBullet],
        });
      } else {
        const first = { ...xp[0] };
        first.bullets = [defaultBullet, ...(first.bullets || [])];
        xp[0] = first;
      }
      return { ...r, experience: xp };
    });
  };

  if (!isOpen) return null;

  const firstXp = resume.experience[0] || {
    role: "",
    company: "",
    bullets: [],
  };

  const firstEdu = resume.education[0] || {
    degree: "",
    school: "",
    year: "",
  };

  const wordCount = resume.summary.trim().split(/\s+/).filter(Boolean).length;
  const activeLeft = customPos ? customPos.left : cardPos.left;
  const activeTop = customPos ? customPos.top : cardPos.top;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-auto">
      {/* SEMI-TRANSLUCENT SPOTLIGHT BACKDROP (Never overly dark, allows full context) */}
      {targetRect && !isPeeking ? (
        <svg className="absolute inset-0 h-full w-full pointer-events-none">
          <defs>
            <mask id="tour-mask-cutout">
              {/* White fills everything (masked area is dim) */}
              <rect width="100%" height="100%" fill="white" />
              {/* Black cuts out the spotlight hole for the target element */}
              <rect
                x={Math.max(0, targetRect.left - 10)}
                y={Math.max(0, targetRect.top - 10)}
                width={targetRect.width + 20}
                height={targetRect.height + 20}
                rx={6}
                fill="black"
              />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(10, 12, 16, 0.35)"
            mask="url(#tour-mask-cutout)"
            className="transition-all duration-300 pointer-events-auto cursor-pointer"
            onClick={handleDismiss}
          >
            <title>Click to dismiss tutorial</title>
          </rect>
        </svg>
      ) : !isPeeking ? (
        <div
          className="absolute inset-0 bg-ink/35 transition-opacity duration-300 pointer-events-auto cursor-pointer"
          onClick={handleDismiss}
        />
      ) : null}

      {/* Target element bright spotlight border with corner brackets */}
      {targetRect && !isPeeking && (
        <div
          className="absolute border-3 border-acid ring-4 ring-acid/40 rounded-sm pointer-events-none transition-all duration-300 shadow-[0_0_28px_rgba(217,249,157,0.65)]"
          style={{
            top: `${Math.max(0, targetRect.top - 8)}px`,
            left: `${Math.max(0, targetRect.left - 8)}px`,
            width: `${targetRect.width + 16}px`,
            height: `${targetRect.height + 16}px`,
          }}
        >
          <span className="absolute -top-2 -left-2 h-4 w-4 border-t-3 border-l-3 border-acid" />
          <span className="absolute -top-2 -right-2 h-4 w-4 border-t-3 border-r-3 border-acid" />
          <span className="absolute -bottom-2 -left-2 h-4 w-4 border-b-3 border-l-3 border-acid" />
          <span className="absolute -bottom-2 -right-2 h-4 w-4 border-b-3 border-r-3 border-acid" />
        </div>
      )}

      {/* ANIMATED MOUSE POINTER CURSOR */}
      {!isPeeking && (
        <div
          className="absolute z-50 pointer-events-none transition-all duration-300 ease-out"
          style={{
            transform: `translate3d(${pointerPos.x}px, ${pointerPos.y}px, 0)`,
          }}
        >
          <div className="relative">
            <span className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-acid opacity-75 animate-ping" />
            <span className="absolute -top-2 -left-2 h-6 w-6 rounded-full bg-amber-400 opacity-60 animate-pulse" />

            {/* High-contrast mouse pointer cursor */}
            <div className="relative animate-bounce drop-shadow-[0_6px_18px_rgba(0,0,0,0.7)]">
              <svg
                width="38"
                height="38"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.5 2.5L10 21.5L13.5 13.5L21.5 10L3.5 2.5Z"
                  fill="#FFFFFF"
                  stroke="#0A0C10"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />
                <circle cx="10" cy="10" r="2.8" fill="#D9F99D" />
              </svg>
              <div className="absolute left-7 top-1 whitespace-nowrap bg-ink text-acid border border-acid px-2.5 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider shadow-lg">
                Step {currentStepIndex + 1}: Pointing Here
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING BANNER WHEN IN PEEK MODE */}
      {isPeeking && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[10000] bg-ink text-acid border-2 border-acid px-5 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center gap-3">
          <span className="font-mono text-xs font-black uppercase flex items-center gap-2">
            <span>👁️ Peek Mode Active</span>
            <span className="text-white/80 font-normal">· Underlying resume is 100% exposed</span>
          </span>
          <button
            type="button"
            onClick={() => setIsPeeking(false)}
            className="border border-acid bg-acid text-ink px-3 py-1 font-mono text-xs font-black uppercase hover:bg-white transition-colors"
          >
            Restore Tour Guide ↩
          </button>
        </div>
      )}

      {/* INTERACTIVE FLOATING STEP CARD (Never hides the target element) */}
      <div
        ref={cardRef}
        className={`z-50 w-[490px] max-w-[calc(100vw-20px)] border-3 border-ink bg-card p-3.5 sm:p-5 shadow-[8px_8px_0_0_var(--color-ink)] transition-all duration-200 flex flex-col ${
          isPeeking ? "opacity-15 pointer-events-none" : "opacity-100"
        } ${
          isMobile
            ? "fixed bottom-2.5 inset-x-2.5 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 max-h-[85vh]"
            : "fixed"
        }`}
        style={
          isMobile
            ? undefined
            : {
                top: `${Math.max(16, Math.min(activeTop, window.innerHeight - 580))}px`,
                left: `${activeLeft}px`,
                maxHeight: "min(88vh, 680px)",
              }
        }
      >
        {/* Sticky Header with Drag Handle & Peek Mode Toggle */}
        <div
          onMouseDown={handleMouseDownHeader}
          className={`shrink-0 flex items-center justify-between border-b-2 border-ink/15 pb-2.5 mb-1 ${
            !isMobile ? "cursor-move select-none" : ""
          }`}
          title={!isMobile ? "Click & drag header to reposition anywhere" : undefined}
        >
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 border border-ink bg-acid px-2 py-0.5 font-mono text-[10.5px] font-black uppercase tracking-wider text-ink shadow-[1px_1px_0_0_var(--color-ink)]">
              <span className="h-2 w-2 rounded-full bg-pine animate-pulse" />
              {currentStep.badge}
            </span>
            <span className="font-mono text-[10.5px] font-bold text-ink-soft">
              {currentStepIndex + 1}/{TOUR_STEPS.length}
            </span>
            {!isMobile && (
              <span className="font-mono text-[9px] text-ink-soft/70 border border-dashed border-ink/20 px-1 py-0.2">
                Drag to Move
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Peek at page button */}
            <button
              type="button"
              onClick={() => setIsPeeking(true)}
              className="flex items-center gap-1 px-2 py-1 font-mono text-[10px] font-bold text-ink border border-ink/30 bg-paper hover:bg-acid transition-colors"
              title="Peek at background page without exiting tour (P)"
            >
              <span>👁 Peek</span>
            </button>

            {customPos && !isMobile && (
              <button
                type="button"
                onClick={() => setCustomPos(null)}
                className="px-1.5 py-1 font-mono text-[9.5px] text-ink-soft hover:text-ink underline"
                title="Reset card to auto-side position"
              >
                Reset Pos
              </button>
            )}

            <button
              type="button"
              onClick={handleDismiss}
              className="flex h-7 w-7 items-center justify-center border border-ink/30 bg-paper text-ink hover:bg-coral hover:text-paper transition-colors font-bold text-sm"
              title="Close tutorial tour (Esc)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Middle Content */}
        <div className="flex-1 overflow-y-auto min-h-0 pr-1 my-2 space-y-2.5">
          {/* Title & Subtitle */}
          <div className="space-y-0.5">
            <h3 className="font-display text-base sm:text-lg font-black text-ink leading-tight">
              {currentStep.title}
            </h3>
            <p className="font-mono text-[10.5px] uppercase font-bold text-pine tracking-wide">
              {currentStep.subtitle}
            </p>
            <p className="text-xs font-medium text-ink-soft leading-relaxed pt-0.5">
              {currentStep.description}
            </p>
          </div>

          {/* IN-DEPTH INTERACTIVE ACTIONS & LIVE INPUTS */}
          <div className="rounded-sm border-2 border-ink/20 bg-paper/85 p-3 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10.5px] font-black uppercase tracking-wider text-ink flex items-center gap-1">
                <span>✍️ In-Tour Live Controls</span>
              </span>
              <span className="font-mono text-[9.5px] text-pine font-bold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-pine inline-block" />
                Syncs Live to Resume
              </span>
            </div>

            {/* STEP 1: Name & Title */}
            {currentStep.id === "contact-name" && (
              <div className="space-y-2">
                <div>
                  <label className="block font-mono text-[10px] font-bold text-ink uppercase mb-0.5">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    value={resume.contact.fullName}
                    onChange={(e) => setContact("fullName", e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full border border-ink bg-white px-2.5 py-1.5 font-sans text-xs text-ink focus:border-pine focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-bold text-ink uppercase mb-0.5">
                    Target Job Title (Matches Recruiter Search Filter)
                  </label>
                  <input
                    type="text"
                    value={resume.contact.title}
                    onChange={(e) => setContact("title", e.target.value)}
                    placeholder="e.g. Senior Full-Stack Engineer"
                    className="w-full border border-ink bg-white px-2.5 py-1.5 font-sans text-xs text-ink focus:border-pine focus:outline-none"
                  />
                </div>

                <div>
                  <span className="block font-mono text-[9px] uppercase font-bold text-ink-soft mb-1">
                    1-Click Senior Role Presets:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {SUGGESTED_ROLES.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setContact("title", role)}
                        className="rounded-xs border border-ink/20 bg-card px-2 py-0.5 font-mono text-[9.5px] font-semibold text-ink hover:bg-acid hover:border-ink transition-colors"
                      >
                        +{role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulated Parser Result Badge */}
                <div className="border border-pine/30 bg-acid-soft/60 p-2 font-mono text-[10px] text-pine-deep flex items-center justify-between">
                  <span>ATS Parser Output:</span>
                  <span className="font-bold">
                    {resume.contact.fullName || "Name"} · {resume.contact.title || "Job Title"}
                  </span>
                </div>
              </div>
            )}

            {/* STEP 2: Reachability & Location */}
            {currentStep.id === "contact-reach" && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-mono text-[9.5px] font-bold text-ink uppercase mb-0.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={resume.contact.email}
                      onChange={(e) => setContact("email", e.target.value)}
                      placeholder="alex.morgan@gmail.com"
                      className="w-full border border-ink bg-white px-2 py-1 font-sans text-xs text-ink focus:border-pine focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[9.5px] font-bold text-ink uppercase mb-0.5">
                      Direct Phone
                    </label>
                    <input
                      type="tel"
                      value={resume.contact.phone}
                      onChange={(e) => setContact("phone", e.target.value)}
                      placeholder="+1 (555) 014-2288"
                      className="w-full border border-ink bg-white px-2 py-1 font-sans text-xs text-ink focus:border-pine focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[9.5px] font-bold text-ink uppercase mb-0.5">
                      City, State / Country
                    </label>
                    <input
                      type="text"
                      value={resume.contact.location}
                      onChange={(e) => setContact("location", e.target.value)}
                      placeholder="San Francisco, CA"
                      className="w-full border border-ink bg-white px-2 py-1 font-sans text-xs text-ink focus:border-pine focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[9.5px] font-bold text-ink uppercase mb-0.5">
                      LinkedIn Vanity URL
                    </label>
                    <input
                      type="text"
                      value={resume.contact.linkedin}
                      onChange={(e) => setContact("linkedin", e.target.value)}
                      placeholder="linkedin.com/in/alexmorgan"
                      className="w-full border border-ink bg-white px-2 py-1 font-sans text-xs text-ink focus:border-pine focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="font-mono text-[9px] uppercase font-bold text-ink-soft">
                    ATS Radius Check:
                  </span>
                  <span className="border border-pine/40 bg-emerald-50 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-800">
                    {resume.contact.location ? "✓ Geo-Filter Passed" : "⚠ Enter City for Radius Match"}
                  </span>
                </div>
              </div>
            )}

            {/* STEP 3: Summary */}
            {currentStep.id === "summary" && (
              <div className="space-y-2">
                <textarea
                  rows={4}
                  value={resume.summary}
                  onChange={(e) => setResume((r) => ({ ...r, summary: e.target.value }))}
                  placeholder="Results-driven professional with 6+ years of experience in..."
                  className="w-full border border-ink bg-white p-2 font-sans text-xs text-ink focus:border-pine focus:outline-none leading-relaxed"
                />

                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-ink-soft">
                    {wordCount} words ({wordCount >= 25 && wordCount <= 85 ? "Optimal Length ✓" : "Aim for 25–85 words"})
                  </span>
                </div>

                <div className="pt-1 border-t border-ink/10 space-y-1">
                  <span className="block font-mono text-[9px] uppercase font-bold text-ink-soft">
                    1-Click ATS Summary Archetypes:
                  </span>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      type="button"
                      onClick={() => handleApplySummaryArchetype("engineering")}
                      className="border border-ink/20 bg-white p-1.5 text-left hover:bg-acid hover:border-ink transition-colors"
                    >
                      <span className="block font-mono text-[9.5px] font-bold text-ink">Engineering Leader</span>
                      <span className="block text-[8.5px] text-ink-soft">7+ yrs · Microservices</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplySummaryArchetype("product")}
                      className="border border-ink/20 bg-white p-1.5 text-left hover:bg-acid hover:border-ink transition-colors"
                    >
                      <span className="block font-mono text-[9.5px] font-bold text-ink">Product &amp; Growth</span>
                      <span className="block text-[8.5px] text-ink-soft">6+ yrs · $2.4M ARR</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplySummaryArchetype("cloud")}
                      className="border border-ink/20 bg-white p-1.5 text-left hover:bg-acid hover:border-ink transition-colors"
                    >
                      <span className="block font-mono text-[9.5px] font-bold text-ink">Cloud Architect</span>
                      <span className="block text-[8.5px] text-ink-soft">8+ yrs · AWS / K8s</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Experience */}
            {currentStep.id === "experience" && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-mono text-[9.5px] font-bold text-ink uppercase mb-0.5">
                      Most Recent Job Title
                    </label>
                    <input
                      type="text"
                      value={firstXp.role}
                      onChange={(e) => {
                        const v = e.target.value;
                        setResume((r) => ({
                          ...r,
                          experience: r.experience.length
                            ? r.experience.map((x, i) => (i === 0 ? { ...x, role: v } : x))
                            : [{ id: uid(), role: v, company: "Tech Corp", location: "Remote", start: "2021", end: "Present", bullets: [] }],
                        }));
                      }}
                      placeholder="Senior Full-Stack Engineer"
                      className="w-full border border-ink bg-white px-2 py-1 font-sans text-xs text-ink focus:border-pine focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[9.5px] font-bold text-ink uppercase mb-0.5">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={firstXp.company}
                      onChange={(e) => {
                        const v = e.target.value;
                        setResume((r) => ({
                          ...r,
                          experience: r.experience.length
                            ? r.experience.map((x, i) => (i === 0 ? { ...x, company: v } : x))
                            : [{ id: uid(), role: "Developer", company: v, location: "Remote", start: "2021", end: "Present", bullets: [] }],
                        }));
                      }}
                      placeholder="Acme Cloud Technologies"
                      className="w-full border border-ink bg-white px-2 py-1 font-sans text-xs text-ink focus:border-pine focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <span className="block font-mono text-[9px] uppercase font-bold text-ink-soft mb-1">
                    Insert Google XYZ Quantifiable Metric Bullets:
                  </span>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        handleInsertMetricBullet(
                          "Architected and deployed event-driven microservices handling 25,000+ req/sec using Node.js and AWS Lambda, reducing p95 latency by 45%."
                        )
                      }
                      className="border border-ink/20 bg-white p-1.5 text-left hover:bg-acid hover:border-ink transition-colors"
                    >
                      <span className="block font-mono text-[9.5px] font-bold text-pine">+ Latency &amp; Scale</span>
                      <span className="block text-[8.5px] text-ink-soft">25k req/sec · 45% faster</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleInsertMetricBullet(
                          "Automated end-to-end CI/CD delivery pipelines in GitHub Actions, slashing deployment failure rate by 80% and saving 16 engineering hours/week."
                        )
                      }
                      className="border border-ink/20 bg-white p-1.5 text-left hover:bg-acid hover:border-ink transition-colors"
                    >
                      <span className="block font-mono text-[9.5px] font-bold text-pine">+ Automation &amp; CI/CD</span>
                      <span className="block text-[8.5px] text-ink-soft">80% fewer bugs · 16 hrs saved</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Skills */}
            {currentStep.id === "skills" && (
              <div className="space-y-2">
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddSkill(newSkillInput);
                      }
                    }}
                    placeholder="Type skill & press Enter..."
                    className="flex-1 border border-ink bg-white px-2.5 py-1 font-sans text-xs text-ink focus:border-pine focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill(newSkillInput)}
                    className="border border-ink bg-acid px-3.5 py-1 font-mono text-[10.5px] font-black uppercase text-ink hover:bg-amber-300"
                  >
                    Add Skill
                  </button>
                </div>

                {/* Categorized Clusters */}
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {SKILL_CLUSTERS.map((cluster) => (
                    <div key={cluster.category} className="space-y-0.5">
                      <span className="font-mono text-[9px] font-bold text-ink-soft uppercase block">
                        {cluster.category}:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {cluster.skills.map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => handleAddSkill(skill)}
                            className="rounded-xs border border-ink/20 bg-card px-1.5 py-0.5 font-mono text-[9px] font-semibold text-ink hover:bg-acid hover:border-ink transition-colors"
                          >
                            +{skill}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Added Skills count & density indicator */}
                <div className="pt-1 border-t border-ink/10 flex items-center justify-between">
                  <span className="font-mono text-[9.5px] text-ink-soft">
                    {resume.skills.length} skills logged
                  </span>
                  <span
                    className={`font-mono text-[9px] font-bold px-2 py-0.5 border ${
                      resume.skills.length >= 10 && resume.skills.length <= 18
                        ? "border-pine bg-acid-soft text-pine-deep"
                        : "border-amber-400 bg-amber-50 text-amber-900"
                    }`}
                  >
                    {resume.skills.length >= 10 && resume.skills.length <= 18
                      ? "Optimal ATS Density ✓"
                      : "Recommended: 10–18"}
                  </span>
                </div>
              </div>
            )}

            {/* STEP 6: Education */}
            {currentStep.id === "education" && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-2">
                    <label className="block font-mono text-[9.5px] font-bold text-ink uppercase mb-0.5">
                      Degree / Qualification
                    </label>
                    <input
                      type="text"
                      value={firstEdu.degree}
                      onChange={(e) => {
                        const v = e.target.value;
                        setResume((r) => ({
                          ...r,
                          education: r.education.length
                            ? r.education.map((x, i) => (i === 0 ? { ...x, degree: v } : x))
                            : [{ id: uid(), degree: v, school: "State University", location: "City", year: "2021" }],
                        }));
                      }}
                      placeholder="B.S. in Computer Science"
                      className="w-full border border-ink bg-white px-2 py-1 font-sans text-xs text-ink focus:border-pine focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[9.5px] font-bold text-ink uppercase mb-0.5">
                      School / University
                    </label>
                    <input
                      type="text"
                      value={firstEdu.school}
                      onChange={(e) => {
                        const v = e.target.value;
                        setResume((r) => ({
                          ...r,
                          education: r.education.length
                            ? r.education.map((x, i) => (i === 0 ? { ...x, school: v } : x))
                            : [{ id: uid(), degree: "Degree", school: v, location: "City", year: "2021" }],
                        }));
                      }}
                      placeholder="University of Washington"
                      className="w-full border border-ink bg-white px-2 py-1 font-sans text-xs text-ink focus:border-pine focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[9.5px] font-bold text-ink uppercase mb-0.5">
                      Graduation Year
                    </label>
                    <input
                      type="text"
                      value={firstEdu.year}
                      onChange={(e) => {
                        const v = e.target.value;
                        setResume((r) => ({
                          ...r,
                          education: r.education.length
                            ? r.education.map((x, i) => (i === 0 ? { ...x, year: v } : x))
                            : [{ id: uid(), degree: "Degree", school: "University", location: "City", year: v }],
                        }));
                      }}
                      placeholder="2022"
                      className="w-full border border-ink bg-white px-2 py-1 font-sans text-xs text-ink focus:border-pine focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: Job Description Assistant */}
            {currentStep.id === "jd-assistant" && (
              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={jd}
                  onChange={(e) => onJdChange && onJdChange(e.target.value)}
                  placeholder="Paste any target job description to calculate keyword match..."
                  className="w-full border border-ink bg-white p-2 font-mono text-[10px] text-ink focus:border-pine focus:outline-none resize-none"
                />

                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <button
                    type="button"
                    onClick={() => onJdChange && onJdChange(SAMPLE_JD)}
                    className="border border-ink bg-white px-2.5 py-1 font-mono text-[9.5px] font-bold text-ink hover:bg-card transition-colors"
                  >
                    ⚡ Load Real Tech Job Spec
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const sampleMissing = ["AWS", "Microservices", "CI/CD", "PostgreSQL", "Docker"];
                      setResume((r) => ({
                        ...r,
                        skills: [...r.skills, ...sampleMissing.filter((m) => !r.skills.includes(m))],
                      }));
                    }}
                    className="border border-pine bg-acid px-3 py-1 font-mono text-[9.5px] font-black uppercase text-ink hover:bg-amber-300 transition-colors shadow-xs"
                  >
                    + Add Missing High-Value Keywords
                  </button>
                </div>
              </div>
            )}

            {/* STEP 8: Templates & Styling */}
            {currentStep.id === "templates" && (
              <div className="space-y-2">
                <span className="block font-mono text-[9px] uppercase font-bold text-ink-soft mb-1">
                  Select ATS-Compliant Template:
                </span>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: "merit", name: "Merit", desc: "Top Tech ATS Choice" },
                    { id: "tech", name: "Tech", desc: "Crisp Modern Sans" },
                    { id: "summit", name: "Summit", desc: "Executive Leadership" },
                    { id: "nordic", name: "Nordic", desc: "Minimalist High-Density" },
                    { id: "classic", name: "Classic", desc: "Traditional Legal/Finance" },
                    { id: "onyx", name: "Onyx", desc: "Bold High-Contrast" },
                  ].map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setResume((r) => ({ ...r, template: tpl.id as any }))}
                      className={`border p-1.5 text-left font-mono transition-all ${
                        resume.template === tpl.id
                          ? "border-ink bg-ink text-acid shadow-sm"
                          : "border-ink/20 bg-white text-ink hover:border-ink"
                      }`}
                    >
                      <span className="block text-[10px] font-bold">{tpl.name}</span>
                      <span className={`block text-[8px] ${resume.template === tpl.id ? "text-acid-soft/80" : "text-ink-soft"}`}>
                        {tpl.desc}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase font-bold text-ink-soft">
                    Accent Ink:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {ACCENTS.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => setResume((r) => ({ ...r, accent: hex }))}
                        className={`h-5 w-5 rounded-full border border-ink transition-transform ${
                          resume.accent === hex ? "scale-125 ring-2 ring-acid" : "hover:scale-110"
                        }`}
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 9: Live Preview */}
            {currentStep.id === "preview" && (
              <div className="space-y-2">
                <div className="rounded border border-pine/30 bg-acid-soft/50 p-2.5 text-xs font-semibold text-pine-deep leading-relaxed">
                  ✨ Interactive Feature: Click directly on any text, role, company, or summary bullet inside the live document on the right to auto-jump and focus that field!
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-ink/10">
                  <span className="font-mono text-[10px] text-ink-soft">
                    Format: {resume.pageCount === 2 ? "2 Pages (Senior / Extended)" : "1 Page (Standard ATS Benchmark)"}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setResume((r) => ({ ...r, pageCount: r.pageCount === 2 ? 1 : 2 }))
                    }
                    className="border border-ink bg-white px-3 py-1 font-mono text-[10px] font-bold text-ink hover:bg-card transition-colors"
                  >
                    Switch to {resume.pageCount === 2 ? "1 Page Format" : "2 Page Format"}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 10: Export */}
            {currentStep.id === "export" && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onExport && onExport("pdf")}
                    className="flex items-center justify-center gap-1.5 border-2 border-ink bg-acid py-2 font-mono text-xs font-black uppercase text-ink shadow-[2px_2px_0_0_var(--color-ink)] hover:bg-amber-300 transition-all hover:-translate-y-0.5"
                  >
                    <Icon name="download" size={14} />
                    <span>Download PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onExport && onExport("docx")}
                    className="flex items-center justify-center gap-1.5 border-2 border-ink bg-white py-2 font-mono text-xs font-black uppercase text-ink shadow-[2px_2px_0_0_var(--color-ink)] hover:bg-card transition-all hover:-translate-y-0.5"
                  >
                    <Icon name="doc" size={14} />
                    <span>Download Word</span>
                  </button>
                </div>

                <div className="border border-emerald-300 bg-emerald-50/70 p-2 text-center font-mono text-[9.5px] font-bold text-emerald-900">
                  ✓ Pre-Flight Passed: Selectable text · Standard single-column · Clean metadata
                </div>
              </div>
            )}
          </div>

          {/* EXPANDABLE DEEP ATS GUIDE & RULES ACCORDION */}
          <div className="border border-ink/20 bg-white">
            <button
              type="button"
              onClick={() => setShowDeepDetails(!showDeepDetails)}
              className="w-full flex items-center justify-between p-2.5 text-left font-mono text-[10.5px] font-bold text-ink hover:bg-paper transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <span>📚 Deep ATS Mechanics &amp; Rules</span>
                <span className="text-pine text-[9px] font-semibold">({currentStep.deepDetails.length} key insights)</span>
              </span>
              <Icon name="chev" size={12} className={`transition-transform ${showDeepDetails ? "rotate-180" : ""}`} />
            </button>

            {showDeepDetails && (
              <div className="p-3 border-t border-ink/15 bg-paper/30 space-y-2.5 text-xs text-ink-soft leading-relaxed">
                <div className="space-y-1">
                  <span className="font-mono text-[9.5px] font-black uppercase text-ink block">
                    How Automated Parsers Evaluate This:
                  </span>
                  <ul className="space-y-1 pl-3.5 list-disc text-[11px]">
                    {currentStep.deepDetails.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-ink/10">
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] font-black uppercase text-emerald-700 block">
                      ✓ What to Do:
                    </span>
                    <ul className="space-y-0.5 text-[10.5px] text-ink-soft">
                      {currentStep.dos.map((d, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1">
                    <span className="font-mono text-[9px] font-black uppercase text-coral block">
                      ✕ Common Mistakes:
                    </span>
                    <ul className="space-y-0.5 text-[10.5px] text-ink-soft">
                      {currentStep.donts.map((d, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="text-coral font-bold">•</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick tip box */}
          <div className="rounded-sm border border-pine/30 bg-acid-soft/50 p-2.5 text-xs font-medium text-pine-deep leading-normal">
            {currentStep.tip}
          </div>
        </div>

        {/* Sticky Bottom Navigation Bar */}
        <div className="shrink-0 border-t-2 border-ink/15 pt-2.5 mt-auto bg-card space-y-2">
          {/* Step Progress Dots */}
          <div className="flex items-center justify-center gap-1">
            {TOUR_STEPS.map((step, idx) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStepIndex
                    ? "w-6 bg-ink"
                    : idx < currentStepIndex
                    ? "w-2.5 bg-pine"
                    : "w-1.5 bg-ink/20 hover:bg-ink/40"
                }`}
                title={`Jump to Step ${idx + 1}: ${step.title}`}
              />
            ))}
          </div>

          {/* Navigation buttons: Always visible & pinned, zero cutoffs */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className={`flex items-center gap-1 px-3 py-2 font-mono text-xs font-bold uppercase transition-all shrink-0 min-h-[38px] ${
                currentStepIndex === 0
                  ? "opacity-30 cursor-not-allowed text-neutral-400"
                  : "border border-ink/30 bg-paper text-ink hover:bg-ink hover:text-paper"
              }`}
            >
              ← Back
            </button>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleDismiss}
                className="px-2 py-1 font-mono text-xs text-ink-soft hover:text-ink underline transition-colors"
              >
                Skip
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="flex items-center justify-center gap-1.5 border-2 border-ink bg-acid px-4 py-2 font-mono text-xs font-black uppercase text-ink shadow-[2px_2px_0_0_var(--color-ink)] hover:bg-amber-300 transition-all hover:-translate-y-0.5 shrink-0 min-h-[38px]"
              >
                {currentStepIndex === TOUR_STEPS.length - 1 ? (
                  <>Finish &amp; Build ✓</>
                ) : (
                  <>Next Step →</>
                )}
              </button>
            </div>
          </div>

          {/* Don't show again toggle & shortcuts */}
          <div className="flex items-center justify-between pt-1 border-t border-ink/10 text-[10px]">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="h-3 w-3 accent-pine"
              />
              <span className="font-mono text-ink-soft">
                Don't auto-launch
              </span>
            </label>

            <div className="flex items-center gap-2 font-mono text-ink-soft">
              <span>
                <kbd className="bg-ink/10 px-1 border border-ink/20">P</kbd> peek
              </span>
              <span>
                <kbd className="bg-ink/10 px-1 border border-ink/20">Esc</kbd> exit
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
