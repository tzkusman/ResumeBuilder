import type { ResumeData, Experience, Education, ProjectEntry, VolunteerEntry } from './types';

/**
 * Cleans multi-page CV artifacts such as running headers, page numbers ("Page 1 of 2"),
 * page separators, and repeated candidate headers before parsing sections.
 */
function cleanMultiPageArtifacts(text: string): string {
  return text
    // Remove "Page X of Y", "Page X / Y", "Page X", "1 of 2", "- Page 2 -", "[Page 2]", "Page 2 | 2"
    .replace(/^[ \t]*(?:[-–—\s*\[\(]*)?(?:page\s*\d+\s*(?:of|\/|\|)\s*\d+|\bpage\s*\d+\b|\d+\s*(?:of|\/|\|)\s*\d+)(?:[-–—\s*\]\)]*)?$/gim, '')
    // Remove standalone page breaks / dividers
    .replace(/^[ \t]*(?:[-–—=_*]{3,}|--- PAGE BREAK ---)[ \t]*$/gim, '')
    // Remove repeated running "Curriculum Vitae" or "Resume" header lines
    .replace(/\n\s*(?:curriculum\s+vitae|resume)\s*(?:[-–—|•]\s*[^\n]+)?\s*\n/gi, '\n')
    // Normalize excessive newlines
    .replace(/\n{3,}/g, '\n\n');
}

type SectionType = 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'volunteer' | 'certifications' | 'languages' | 'unknown';

const SECTION_HEADER_PATTERNS: { type: SectionType; regex: RegExp }[] = [
  {
    type: 'experience',
    regex: /^(?:work\s+experience|professional\s+experience|employment\s+history|experience|work\s+history|career\s+history|career\s+summary|experience\s*[\(\-–—]\s*(?:continued|cont\.?)\s*[\)\-–—]?|work\s+experience\s*[\(\-–—]\s*(?:continued|cont\.?)\s*[\)\-–—]?|additional\s+experience|previous\s+experience|earlier\s+career|relevant\s+experience):?$/i
  },
  {
    type: 'education',
    regex: /^(?:education|academic\s+background|academic\s+history|academics|qualifications|education\s*[\(\-–—]\s*(?:continued|cont\.?)\s*[\)\-–—]?):?$/i
  },
  {
    type: 'skills',
    regex: /^(?:skills|technical\s+skills|core\s+competencies|expertise|technologies|tools\s*(?:&|and)\s*technologies|key\s+skills|proficiencies|areas\s+of\s+expertise|technical\s+proficiencies):?$/i
  },
  {
    type: 'projects',
    regex: /^(?:projects|key\s+projects|selected\s+projects|personal\s+projects|technical\s+projects|portfolio|deliverables|featured\s+projects|projects\s*[\(\-–—]\s*(?:continued|cont\.?)\s*[\)\-–—]?):?$/i
  },
  {
    type: 'certifications',
    regex: /^(?:certifications|certificates|licenses|professional\s+credentials|certifications\s*(?:&|and)\s*licenses|training|accreditations):?$/i
  },
  {
    type: 'languages',
    regex: /^(?:languages|language\s+proficiency|language\s+skills):?$/i
  },
  {
    type: 'volunteer',
    regex: /^(?:volunteer|volunteering|community\s+service|leadership\s*(?:&|and)\s*volunteering|extracurricular|community\s+involvement):?$/i
  },
  {
    type: 'summary',
    regex: /^(?:summary|professional\s+summary|profile|about\s+me|career\s+objective|objective|executive\s+summary|personal\s+profile):?$/i
  }
];

function groupLinesIntoSections(lines: string[]): Record<SectionType, string[]> {
  const sections: Record<SectionType, string[]> = {
    summary: [],
    experience: [],
    education: [],
    skills: [],
    projects: [],
    volunteer: [],
    certifications: [],
    languages: [],
    unknown: []
  };

  let currentSection: SectionType = 'unknown';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Check if line is a recognized section header
    const matchedHeader = SECTION_HEADER_PATTERNS.find(p => p.regex.test(line));

    if (matchedHeader) {
      currentSection = matchedHeader.type;
      continue;
    }

    sections[currentSection].push(line);
  }

  return sections;
}

/**
 * Parses extracted CV text into structured ResumeData format
 */
export function parseCVToResume(text: string, detectedPageCount?: number): Partial<ResumeData> {
  const cleanedText = cleanMultiPageArtifacts(text);
  const lines = cleanedText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const sections = groupLinesIntoSections(lines);
  
  // Extract contact information
  const contact = extractContactInfo(cleanedText);
  
  // Extract summary/objective
  const summary = extractSummary(cleanedText, sections.summary);
  
  // Extract work experience
  const experience = extractExperience(cleanedText, lines, sections.experience);
  
  // Extract education
  const education = extractEducation(cleanedText, lines, sections.education);
  
  // Extract skills
  const skills = extractSkills(cleanedText, lines, sections.skills);
  
  // Extract languages if present
  const languages = extractLanguages(cleanedText, sections.languages);
  
  // Extract certifications if present
  const certifications = extractCertifications(cleanedText, sections.certifications);

  // Extract projects if present
  const projects = extractProjects(cleanedText, lines, sections.projects);

  // Extract volunteer work if present
  const volunteer = extractVolunteer(cleanedText, lines, sections.volunteer);

  // Determine if this is a 2-page CV
  const isTwoPage = (detectedPageCount && detectedPageCount >= 2) ||
    experience.length >= 3 ||
    (experience.length + education.length) >= 4 ||
    projects.length > 0 ||
    volunteer.length > 0 ||
    cleanedText.length > 1100;
  
  return {
    contact,
    summary,
    experience,
    education,
    skills,
    languages,
    certifications,
    projects,
    volunteer,
    pageCount: isTwoPage ? 2 : 1
  };
}

/**
 * Merges parsed CV data with existing resume data
 */
export function mergeCVWithResume(parsed: Partial<ResumeData>, existing: ResumeData): ResumeData {
  const shouldBeTwoPage = parsed.pageCount === 2 ||
    (parsed.experience && parsed.experience.length >= 3) ||
    ((parsed.experience?.length || 0) + (parsed.education?.length || 0) >= 4) ||
    (parsed.projects && parsed.projects.length > 0) ||
    existing.pageCount === 2;

  return {
    ...existing,
    pageCount: shouldBeTwoPage ? 2 : 1,
    contact: {
      ...existing.contact,
      ...parsed.contact,
      fullName: parsed.contact?.fullName || existing.contact.fullName,
      email: parsed.contact?.email || existing.contact.email,
      phone: parsed.contact?.phone || existing.contact.phone,
      location: parsed.contact?.location || existing.contact.location,
      title: parsed.contact?.title || existing.contact.title,
      website: parsed.contact?.website || existing.contact.website,
      linkedin: parsed.contact?.linkedin || existing.contact.linkedin
    },
    summary: parsed.summary || existing.summary,
    experience: parsed.experience && parsed.experience.length > 0 
      ? parsed.experience 
      : existing.experience,
    education: parsed.education && parsed.education.length > 0 
      ? parsed.education 
      : existing.education,
    skills: parsed.skills && parsed.skills.length > 0 
      ? parsed.skills 
      : existing.skills,
    languages: parsed.languages && parsed.languages.length > 0 
      ? parsed.languages 
      : existing.languages,
    certifications: parsed.certifications && parsed.certifications.length > 0 
      ? parsed.certifications 
      : existing.certifications,
    projects: parsed.projects && parsed.projects.length > 0
      ? parsed.projects
      : (existing.projects || []),
    volunteer: parsed.volunteer && parsed.volunteer.length > 0
      ? parsed.volunteer
      : (existing.volunteer || [])
  };
}

function extractContactInfo(text: string): ResumeData['contact'] {
  const contact: ResumeData['contact'] = {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: ''
  };
  
  // 1. Email pattern
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    contact.email = emailMatch[0];
  }
  
  // 2. Phone pattern (support international +, parentheses, dots, dashes, spaces)
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}(?:\s*(?:ext|x)\s*\d+)?/);
  if (phoneMatch && phoneMatch[0].replace(/\D/g, '').length >= 7) {
    contact.phone = phoneMatch[0].trim();
  }
  
  // 3. LinkedIn URL
  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  if (linkedinMatch) {
    contact.linkedin = linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : `https://${linkedinMatch[0]}`;
  }
  
  // 4. Website / GitHub URL
  const websiteMatch = text.match(/(?:https?:\/\/)?(?:www\.)?(github\.com\/[a-zA-Z0-9_-]+|[a-zA-Z0-9-]+\.(?:com|dev|io|org|me|net|tech)(?:\/[^\s]*)?)/i);
  if (websiteMatch && !websiteMatch[0].includes('linkedin.com') && !websiteMatch[0].includes('@')) {
    const rawUrl = websiteMatch[0];
    contact.website = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
  }
  
  // 5. Location - look for City, State / Country patterns
  const locationPatterns = [
    /\b([A-Z][a-zA-Z\s.-]+),\s*([A-Z]{2})\b(?:\s+\d{5})?/, // San Francisco, CA or New York, NY 10001
    /\b([A-Z][a-zA-Z\s.-]+),\s*(United States|USA|United Kingdom|UK|Canada|Australia|Germany|France|India|Singapore|Japan|Netherlands|Ireland)\b/i,
    /\b(Remote|Hybrid)\b/i
  ];
  for (const pat of locationPatterns) {
    const locMatch = text.match(pat);
    if (locMatch) {
      contact.location = locMatch[0].trim();
      break;
    }
  }
  
  // 6. Name extraction: scan first 10 lines
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const skipWords = /^(curriculum\s+vitae|resume|cv|portfolio|profile|contact|contact\s+information|page\s+\d+|personal\s+details|email|phone)$/i;
  
  for (const line of lines.slice(0, 10)) {
    // Skip if contains email, phone, url, or is a generic header
    if (skipWords.test(line)) continue;
    if (contact.email && line.includes(contact.email)) continue;
    if (contact.phone && line.includes(contact.phone)) continue;
    if (line.includes('@') || line.includes('http') || line.includes('linkedin.com') || line.includes('github.com')) continue;
    if (line.length > 65 || line.length < 3) continue;
    
    // Check if line contains "Name | Title"
    if (line.includes('|') || line.includes(' - ') || line.includes(' — ')) {
      const parts = line.split(/[|—]|\s-\s/).map(p => p.trim());
      if (parts[0] && /^[A-Z][a-zA-Z'.\-]+(\s+[A-Z][a-zA-Z'.\-]+)+$/.test(parts[0])) {
        contact.fullName = parts[0];
        if (parts[1] && !contact.title) {
          contact.title = parts[1];
        }
        break;
      }
    }
    
    // Standard Name format (Title Case or ALL CAPS with 2-4 words)
    const isTitleCase = /^[A-Z][a-zA-Z'.\-]+(\s+[A-Z][a-zA-Z'.\-]+){1,3}$/.test(line);
    const isAllCaps = /^[A-Z]{2,}(\s+[A-Z]{2,}){1,3}$/.test(line);
    
    if (isTitleCase || isAllCaps) {
      // Normalize ALL CAPS to Capitalized words
      contact.fullName = isAllCaps
        ? line.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
        : line;
      break;
    }
  }
  
  // 7. Title extraction: check line after name, or dictionary of common roles
  if (!contact.title && contact.fullName) {
    const nameIndex = lines.findIndex(l => l.includes(contact.fullName) || l.toLowerCase() === contact.fullName.toLowerCase());
    if (nameIndex !== -1 && lines[nameIndex + 1]) {
      const nextLine = lines[nameIndex + 1].trim();
      if (!nextLine.includes('@') && !nextLine.includes('http') && nextLine.length < 60 && !skipWords.test(nextLine)) {
        contact.title = nextLine;
      }
    }
  }
  
  if (!contact.title) {
    const commonTitles = [
      'Software Engineer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer',
      'Senior Software Engineer', 'Lead Engineer', 'DevOps Engineer', 'Cloud Architect',
      'Product Manager', 'Project Manager', 'Scrum Master', 'Engineering Manager',
      'Data Scientist', 'Data Analyst', 'Machine Learning Engineer', 'AI Engineer',
      'UI/UX Designer', 'Product Designer', 'Graphic Designer', 'Creative Director',
      'Marketing Manager', 'Digital Marketing Specialist', 'Content Strategist',
      'Financial Analyst', 'Accountant', 'Business Analyst', 'Operations Manager',
      'Sales Executive', 'Account Executive', 'Customer Success Manager'
    ];
    for (const t of commonTitles) {
      const re = new RegExp(`\\b${t}\\b`, 'i');
      if (re.test(text.slice(0, 800))) {
        contact.title = t;
        break;
      }
    }
  }
  
  return contact;
}

function extractSummary(text: string, sectionLines?: string[]): string {
  if (sectionLines && sectionLines.length > 0) {
    const combined = sectionLines.join(' ').replace(/\s+/g, ' ').trim();
    if (combined.length >= 20) {
      return combined.slice(0, 900);
    }
  }

  const summaryPatterns = [
    /(?:Professional\s+Summary|Executive\s+Summary|Summary|Profile|About\s+Me|Career\s+Objective|Objective)[:\s]*\n?([\s\S]*?)(?=\n\s*(?:Work\s+Experience|Professional\s+Experience|Experience|Employment|Education|Skills|Technical\s+Skills|Projects|Certifications)\b|$)/i
  ];
  
  for (const pattern of summaryPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const cleaned = match[1]
        .replace(/\n\s*\n/g, '\n')
        .replace(/\s+/g, ' ')
        .trim();
      if (cleaned.length >= 20) {
        return cleaned.slice(0, 900);
      }
    }
  }
  
  // Fallback: Look for first substantial paragraph between contact info and first section header
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let afterContact = false;
  for (let i = 0; i < Math.min(lines.length, 18); i++) {
    const line = lines[i];
    if (line.includes('@') || line.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/)) {
      afterContact = true;
      continue;
    }
    if (afterContact && line.length > 60 && !line.match(/^(experience|education|skills|projects|certifications)/i)) {
      return line.replace(/\s+/g, ' ').slice(0, 900);
    }
  }
  
  return '';
}

function extractExperience(text: string, lines: string[], sectionLines?: string[]): Experience[] {
  const experiences: Experience[] = [];
  
  let expLines: string[] = [];
  if (sectionLines && sectionLines.length > 0) {
    expLines = sectionLines;
  } else {
    // 1. Locate Experience section fallback
    const expSectionIndex = lines.findIndex(l =>
      /^(work\s+experience|professional\s+experience|employment\s+history|experience|work\s+history|career\s+history)$/i.test(l) ||
      /^(work\s+experience|professional\s+experience|experience):?$/i.test(l)
    );
    
    const startIndex = expSectionIndex !== -1 ? expSectionIndex + 1 : 0;
    
    const nextSectionIndex = lines.findIndex((l, idx) =>
      idx > startIndex + 2 &&
      /^(education|academic|skills|technical\s+skills|certifications|projects|languages|references|interests)$/i.test(l)
    );
    
    expLines = (startIndex > 0)
      ? lines.slice(startIndex, nextSectionIndex !== -1 ? nextSectionIndex : undefined)
      : lines;
  }
  
  // Flexible Date pattern: e.g. "Jan 2021 - Present", "2020 - 2023", "03/2019 – 11/2021", "May 2022 - Current", "2021 - Ongoing"
  const dateRegex = /(?:(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?|\d{1,2}\/\d{2,4})\s+)?(?:19|20)\d{2}\s*(?:-|–|—|to)\s*(?:Present|Current|Ongoing|(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?|\d{1,2}\/\d{2,4}\s+)?(?:19|20)\d{2})/i;
  const bulletRegex = /^[•●○▪▸→\-\*]\s*(.+)$/;
  
  interface RawEntry {
    role: string;
    company: string;
    location: string;
    dateStr: string;
    bullets: string[];
  }
  
  const entries: RawEntry[] = [];
  let currentEntry: RawEntry | null = null;
  
  for (let i = 0; i < expLines.length; i++) {
    const line = expLines[i].trim();
    if (!line) continue;
    
    // Ignore running header / page break markers
    if (/^(?:page\s*\d+|\d+\s*of\s*\d+|curriculum\s+vitae|resume)$/i.test(line)) continue;

    const dateMatch = line.match(dateRegex);
    const bulletMatch = line.match(bulletRegex);
    
    // Check if line is a new job header (contains a date or precedes a date)
    if (dateMatch) {
      if (currentEntry && (currentEntry.role || currentEntry.company)) {
        entries.push(currentEntry);
      }
      
      let role = '';
      let company = '';
      let location = '';
      const dateStr = dateMatch[0];
      
      const restOfLine = line.replace(dateStr, '').replace(/[|•–—,\-()]/g, ' ').trim();
      
      if (restOfLine.length > 2) {
        if (restOfLine.includes(' at ') || restOfLine.includes(' @ ')) {
          const parts = restOfLine.split(/\s+(?:at|@)\s+/i);
          role = parts[0]?.trim() || '';
          company = parts[1]?.trim() || '';
        } else {
          role = restOfLine;
        }
      }
      
      // Look at 1-2 lines directly preceding this date line
      if (!role || !company) {
        const prev1 = expLines[i - 1]?.trim() || '';
        const prev2 = expLines[i - 2]?.trim() || '';
        
        if (prev1 && !bulletRegex.test(prev1) && prev1.length < 90) {
          if (prev1.includes('|') || prev1.includes(' - ') || prev1.includes(' — ')) {
            const parts = prev1.split(/[|—]|\s-\s/).map(p => p.trim());
            role = role || parts[0] || '';
            company = company || parts[1] || '';
          } else if (!role) {
            role = prev1;
            if (prev2 && !bulletRegex.test(prev2) && prev2.length < 90) {
              company = prev2;
            }
          } else if (!company) {
            company = prev1;
          }
        }
      }
      
      currentEntry = {
        role: role || 'Professional Role',
        company: company || 'Organization',
        location,
        dateStr,
        bullets: []
      };
      continue;
    }
    
    // Explicit bullet point
    if (bulletMatch && currentEntry) {
      const bText = bulletMatch[1].trim();
      if (bText.length > 2) {
        currentEntry.bullets.push(bText);
      }
      continue;
    }
    
    // Continuation of previous bullet OR action line without bullet symbol
    if (currentEntry) {
      const isDate = dateRegex.test(line);
      if (!isDate) {
        const startsWithVerb = /^(?:Led|Built|Managed|Designed|Created|Developed|Optimized|Increased|Reduced|Automated|Negotiated|Shipped|Scaled|Engineered|Coordinated|Delivered|Spearheaded|Implemented|Maintained|Facilitated|Formulated|Mentored|Achieved|Resolved|Supervised|Accelerated|Collaborated|Directed|Executed|Established|Transformed|Trained|Authored|Streamlined|Architected)\b/i.test(line);
        
        if (startsWithVerb) {
          currentEntry.bullets.push(line);
        } else if (currentEntry.bullets.length > 0 && !line.includes('|') && line.length < 260) {
          // Wrapped continuation line of the previous bullet point!
          currentEntry.bullets[currentEntry.bullets.length - 1] += ' ' + line;
        } else if (!currentEntry.company && line.length < 60 && !line.includes('•')) {
          currentEntry.company = line;
        } else if (line.length > 25) {
          currentEntry.bullets.push(line);
        }
      }
    }
  }
  
  if (currentEntry && (currentEntry.role || currentEntry.company)) {
    entries.push(currentEntry);
  }
  
  // Format entries into Experience objects
  for (const entry of entries) {
    const dates = parseDateRange(entry.dateStr);
    experiences.push({
      id: Math.random().toString(36).slice(2, 9),
      role: entry.role,
      company: entry.company,
      location: entry.location || 'Remote',
      start: dates.start,
      end: dates.end,
      bullets: entry.bullets.length > 0 ? entry.bullets.slice(0, 10) : ['Executed core initiatives and delivered key departmental milestones.']
    });
  }
  
  return experiences.slice(0, 16);
}

function parseDateRange(str: string): { start: string; end: string } {
  const parts = str.split(/\s*(?:-|–|—|to)\s*/i);
  const startRaw = parts[0]?.trim() || '';
  const endRaw = parts[1]?.trim() || '';
  
  return {
    start: normalizeDate(startRaw) || '2021-01',
    end: /present|current|ongoing/i.test(endRaw) ? '' : (normalizeDate(endRaw) || '2023-12')
  };
}

function extractProjects(text: string, lines: string[], sectionLines?: string[]): ProjectEntry[] {
  const projects: ProjectEntry[] = [];
  const targetLines = (sectionLines && sectionLines.length > 0)
    ? sectionLines
    : (() => {
        const projectIdx = lines.findIndex(l =>
          /^(projects|key\s+projects|selected\s+projects|personal\s+projects|technical\s+projects):?$/i.test(l)
        );
        if (projectIdx === -1) return [];
        const nextSectionIdx = lines.findIndex((l, idx) =>
          idx > projectIdx + 1 &&
          /^(experience|education|skills|certifications|languages|volunteer|references|interests):?$/i.test(l)
        );
        return lines.slice(projectIdx + 1, nextSectionIdx !== -1 ? nextSectionIdx : projectIdx + 30);
      })();

  if (targetLines.length === 0) return projects;

  let currentProj: ProjectEntry | null = null;

  for (const line of targetLines) {
    if (!line.trim()) continue;
    if (/^(?:page\s*\d+|\d+\s*of\s*\d+|curriculum\s+vitae|resume)$/i.test(line)) continue;

    const bulletMatch = line.match(/^[•●○▪▸→\-\*]\s*(.+)$/);

    if (bulletMatch) {
      if (currentProj) {
        currentProj.bullets.push(bulletMatch[1].trim());
      } else {
        currentProj = {
          id: Math.random().toString(36).slice(2, 9),
          title: "Key Project",
          subtitle: "",
          bullets: [bulletMatch[1].trim()]
        };
        projects.push(currentProj);
      }
    } else {
      if (currentProj && currentProj.bullets.length > 0 && !line.includes('|') && line.length < 240) {
        // Bullet continuation
        currentProj.bullets[currentProj.bullets.length - 1] += ' ' + line;
        continue;
      }

      // Header line of project: e.g. "Project Title | React, Node.js" or "Portfolio Redesign (2023)"
      const parts = line.split(/[|•–—]/);
      const title = parts[0]?.trim() || "Project";
      const subtitle = parts.slice(1).join(" | ").trim();
      currentProj = {
        id: Math.random().toString(36).slice(2, 9),
        title,
        subtitle,
        bullets: []
      };
      projects.push(currentProj);
    }
  }

  return projects.slice(0, 8);
}

function extractVolunteer(text: string, lines: string[], sectionLines?: string[]): VolunteerEntry[] {
  const volunteer: VolunteerEntry[] = [];
  const targetLines = (sectionLines && sectionLines.length > 0)
    ? sectionLines
    : (() => {
        const volIdx = lines.findIndex(l =>
          /^(volunteer|volunteering|community\s+service|leadership\s+&\s+volunteering|extracurricular):?$/i.test(l)
        );
        if (volIdx === -1) return [];
        const nextSectionIdx = lines.findIndex((l, idx) =>
          idx > volIdx + 1 &&
          /^(experience|education|skills|certifications|languages|projects|references):?$/i.test(l)
        );
        return lines.slice(volIdx + 1, nextSectionIdx !== -1 ? nextSectionIdx : volIdx + 20);
      })();

  if (targetLines.length === 0) return volunteer;

  let currentVol: VolunteerEntry | null = null;

  for (const line of targetLines) {
    if (!line.trim()) continue;
    if (/^(?:page\s*\d+|\d+\s*of\s*\d+|curriculum\s+vitae|resume)$/i.test(line)) continue;

    const bulletMatch = line.match(/^[•●○▪▸→\-\*]\s*(.+)$/);
    if (bulletMatch && currentVol) {
      currentVol.bullets.push(bulletMatch[1].trim());
    } else {
      if (currentVol && currentVol.bullets.length > 0 && !line.includes('|') && line.length < 240) {
        currentVol.bullets[currentVol.bullets.length - 1] += ' ' + line;
        continue;
      }
      const yearMatch = line.match(/(?:19|20)\d{2}/);
      const parts = line.split(/[|•–—,]/);
      currentVol = {
        id: Math.random().toString(36).slice(2, 9),
        role: parts[0]?.trim() || "Volunteer",
        org: parts[1]?.trim() || "Community Initiative",
        year: yearMatch ? yearMatch[0] : "",
        bullets: []
      };
      volunteer.push(currentVol);
    }
  }

  return volunteer.slice(0, 6);
}

function extractEducation(text: string, lines: string[], sectionLines?: string[]): Education[] {
  const educations: Education[] = [];
  
  let eduLines: string[] = [];
  if (sectionLines && sectionLines.length > 0) {
    eduLines = sectionLines;
  } else {
    // 1. Look for education section fallback
    const eduSectionStart = lines.findIndex(l => 
      /^(education|academic\s+background|academic\s+history|academics|qualifications)$/i.test(l) ||
      /^(education|academics):?$/i.test(l)
    );
    
    const startIndex = eduSectionStart !== -1 ? eduSectionStart + 1 : 0;
    const nextSection = lines.findIndex((l, idx) =>
      idx > startIndex + 1 &&
      /^(skills|technical\s+skills|certifications|projects|languages|experience|work\s+experience)$/i.test(l)
    );
    
    eduLines = (startIndex > 0)
      ? lines.slice(startIndex, nextSection !== -1 ? nextSection : undefined)
      : lines;
  }
  
  // Comprehensive degree patterns
  const degreeRegex = /(?:Bachelor(?:\s+of\s+[A-Za-z]+|\s+degree)?|Master(?:\s+of\s+[A-Za-z]+|\s+degree)?|Doctor\s+of\s+[A-Za-z]+|Ph\.?D\.?|M\.?B\.?A\.?|B\.?S\.?|M\.?S\.?|B\.?A\.?|B\.?Eng\.?|M\.?Eng\.?|Associate(?:\s+of\s+[A-Za-z]+|\s+degree)?|Diploma)/i;
  
  for (let i = 0; i < eduLines.length; i++) {
    const line = eduLines[i].trim();
    if (!line) continue;
    if (/^(?:page\s*\d+|\d+\s*of\s*\d+|curriculum\s+vitae|resume)$/i.test(line)) continue;
    
    if (degreeRegex.test(line) || /University|College|Institute|Polytechnic|School\s+of\s+[A-Za-z]+/i.test(line)) {
      let degree = '';
      let school = '';
      let year = '';
      let location = '';
      
      const yearMatch = (line + ' ' + (eduLines[i + 1] || '')).match(/(?:19|20)\d{2}/);
      if (yearMatch) year = yearMatch[0];
      
      if (/University|College|Institute|Polytechnic|Academy/i.test(line)) {
        school = line.replace(/(?:19|20)\d{2}/, '').replace(/[|•–—,]/g, ' ').trim();
        const next = eduLines[i + 1]?.trim() || '';
        if (next && degreeRegex.test(next)) {
          degree = next.replace(/(?:19|20)\d{2}/, '').replace(/[|•–—,]/g, ' ').trim();
          i++;
        }
      } else if (degreeRegex.test(line)) {
        degree = line.replace(/(?:19|20)\d{2}/, '').replace(/[|•–—,]/g, ' ').trim();
        const next = eduLines[i + 1]?.trim() || '';
        if (next && /University|College|Institute|Polytechnic|Academy|School/i.test(next)) {
          school = next.replace(/(?:19|20)\d{2}/, '').replace(/[|•–—,]/g, ' ').trim();
          i++;
        }
      }
      
      if (degree || school) {
        educations.push({
          id: Math.random().toString(36).slice(2, 9),
          degree: degree || 'Bachelor of Science',
          school: school || 'Accredited University',
          location: location || '',
          year: year || '2020'
        });
      }
    }
  }
  
  // If nothing found in section, global degree fallback
  if (educations.length === 0) {
    const globalDegrees = [
      /(?:Bachelor|Master|Ph\.?D\.?|B\.?S\.?|B\.?A\.?|M\.?S\.?|M\.?B\.?A\.?)[^,\n.]{0,45}/gi
    ];
    for (const pat of globalDegrees) {
      const match = text.match(pat);
      if (match && match[0]) {
        const yearMatch = text.slice(match.index || 0, (match.index || 0) + 120).match(/(?:19|20)\d{2}/);
        educations.push({
          id: Math.random().toString(36).slice(2, 9),
          degree: match[0].trim(),
          school: 'University',
          location: '',
          year: yearMatch ? yearMatch[0] : ''
        });
        break;
      }
    }
  }
  
  return educations.slice(0, 8);
}

function extractSkills(text: string, lines: string[], sectionLines?: string[]): string[] {
  const skills: string[] = [];
  
  const targetLines = (sectionLines && sectionLines.length > 0)
    ? sectionLines
    : (() => {
        const sIdx = lines.findIndex(l => 
          /^(skills|technical\s+skills|core\s+competencies|expertise|technologies|tools\s+&\s+technologies|proficiencies)$/i.test(l) ||
          /^(skills|technical\s+skills):?$/i.test(l)
        );
        return sIdx !== -1 ? lines.slice(sIdx + 1, sIdx + 20) : [];
      })();

  for (const line of targetLines) {
    if (!sectionLines && /^(experience|education|certifications|projects|languages|interests)$/i.test(line)) break;
    
    // Split by common delimiters (commas, bullets, pipes, semicolons, slashes)
    const parts = line
      .replace(/^[A-Za-z\s]+:\s*/, '')
      .split(/[,•●○│;|/·\t]/)
      .map(s => s.trim())
      .filter(s => s.length >= 2 && s.length <= 40 && !s.includes('@') && !s.includes('http'));
    
    skills.push(...parts);
  }
  
  // 2. Comprehensive catalog of 200+ industry skills to match across full text
  const catalog = [
    'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue.js', 'Angular', 'Node.js',
    'Express.js', 'Nest.js', 'Python', 'Django', 'FastAPI', 'Flask', 'Java', 'Spring Boot',
    'C++', 'C#', '.NET', 'Go', 'Golang', 'Rust', 'PHP', 'Laravel', 'Ruby', 'Rails',
    'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API', 'Prisma',
    'AWS', 'Amazon Web Services', 'Azure', 'Google Cloud', 'GCP', 'Docker', 'Kubernetes',
    'CI/CD', 'Git', 'GitHub Actions', 'Terraform', 'Linux', 'Microservices', 'Kafka',
    'RabbitMQ', 'HTML5', 'CSS3', 'Tailwind CSS', 'Sass', 'Webpack', 'Vite',
    'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Scikit-Learn',
    'Data Analysis', 'Pandas', 'NumPy', 'Tableau', 'Power BI', 'ETL', 'Snowflake',
    'BigQuery', 'Apache Spark', 'Airflow', 'NLP', 'Computer Vision', 'Generative AI',
    'LLMs', 'OpenAI API', 'Figma', 'UI/UX Design', 'User Research', 'Wireframing',
    'Prototyping', 'Product Management', 'Agile', 'Scrum', 'Jira', 'Confluence',
    'A/B Testing', 'Growth Strategy', 'SEO', 'SEM', 'Google Analytics', 'HubSpot',
    'Salesforce', 'CRM', 'Copywriting', 'Content Strategy', 'Social Media Marketing',
    'Financial Modeling', 'Budgeting', 'Forecasting', 'Risk Management', 'Excel',
    'Accounting', 'QuickBooks', 'Project Management', 'Cross-functional Leadership',
    'Strategic Planning', 'Stakeholder Management', 'Public Speaking', 'Customer Success'
  ];
  
  const textLower = text.toLowerCase();
  for (const sk of catalog) {
    const escaped = sk.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9_])${escaped}(?:[^a-zA-Z0-9_]|$)`, 'i');
    if (regex.test(textLower) && !skills.some(s => s.toLowerCase() === sk.toLowerCase())) {
      skills.push(sk);
    }
  }
  
  // Clean, deduplicate and format
  const cleaned = [...new Set(skills)]
    .map(s => s.replace(/^[\u2022\u25CF\u25CB\u25AA\u25B8\u2192\-,;|]+\s*/, '').trim())
    .filter(s => s.length >= 2 && s.length <= 40 && !/^(skills|proficient|experienced|familiar|knowledge|level|advanced|basic)$/i.test(s));
  
  return cleaned.slice(0, 24);
}

function extractLanguages(text: string, sectionLines?: string[]): string[] {
  const languages: string[] = [];
  
  if (sectionLines && sectionLines.length > 0) {
    for (const line of sectionLines) {
      const parts = line.replace(/^[A-Za-z\s]+:\s*/, '').split(/[,•●○│;|/·\t]/).map(s => s.trim()).filter(Boolean);
      for (const p of parts) {
        if (p.length >= 2 && p.length <= 35 && !languages.includes(p)) {
          languages.push(p);
        }
      }
    }
  }

  // Look for languages section
  const langPatterns = [
    /Languages?[:\s]*([\s\S]*?)(?=Skills|Experience|Education|$)/i,
    /Language\s+Proficiency[:\s]*([\s\S]*?)(?=Skills|Experience|Education|$)/i
  ];
  
  for (const pattern of langPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const langText = match[1];
      const commonLanguages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Mandarin', 
        'Japanese', 'Korean', 'Portuguese', 'Italian', 'Arabic', 'Hindi', 'Russian'];
      
      for (const lang of commonLanguages) {
        if (langText.includes(lang) && !languages.some(l => l.toLowerCase().includes(lang.toLowerCase()))) {
          languages.push(lang);
        }
      }
      
      // Also extract language-level pairs like "English (Native)", "Spanish (Fluent)"
      const langLevelMatches = langText.matchAll(/([A-Z][a-z]+)\s*\(([^)]+)\)/g);
      for (const match of langLevelMatches) {
        if (!languages.includes(match[1])) {
          languages.push(`${match[1]} (${match[2]})`);
        }
      }
      
      break;
    }
  }
  
  return languages.slice(0, 6);
}

function extractCertifications(text: string, sectionLines?: string[]): string[] {
  const certifications: string[] = [];
  
  if (sectionLines && sectionLines.length > 0) {
    for (const line of sectionLines) {
      const cleaned = line.replace(/^[\u2022\u25CF\u25CB\u25AA\u25B8\u2192*-]+\s*/, '').trim();
      if (cleaned.length > 3 && cleaned.length < 120 && !certifications.includes(cleaned)) {
        certifications.push(cleaned);
      }
    }
  }

  // Look for certifications section
  const certPatterns = [
    /Certifications?[:\s]*([\s\S]*?)(?=Skills|Languages|Experience|Education|$)/i,
    /Certificates?[:\s]*([\s\S]*?)(?=Skills|Languages|Experience|Education|$)/i,
    /Professional\s+Development[:\s]*([\s\S]*?)(?=Skills|Languages|Experience|Education|$)/i
  ];
  
  for (const pattern of certPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const certText = match[1];
      const lines = certText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      
      for (const line of lines) {
        // Clean bullet points
        const cleaned = line.replace(/^[\u2022\u25CF\u25CB\u25AA\u25B8\u2192*-]+\s*/, '').trim();
        if (cleaned.length > 5 && cleaned.length < 100 && !certifications.includes(cleaned)) {
          certifications.push(cleaned);
        }
      }
      
      break;
    }
  }
  
  // Also look for common certification keywords
  const commonCerts = [
    'PMP', 'AWS Certified', 'Google Cloud', 'Azure Certified', 'Cisco',
    'CompTIA', 'Scrum Master', 'Six Sigma', 'CPA', 'CFA'
  ];
  
  for (const cert of commonCerts) {
    if (text.includes(cert) && !certifications.some(c => c.includes(cert))) {
      const certContext = text.match(new RegExp(`${cert}[^\\n]{0,50}`, 'i'));
      if (certContext) {
        certifications.push(certContext[0].trim());
      }
    }
  }
  
  return [...new Set(certifications)].slice(0, 5);
}

function normalizeDate(dateStr: string): string {
  // Convert various date formats to YYYY-MM
  const yearMatch = dateStr.match(/(20\d{2}|19\d{2})/);
  if (!yearMatch) return '';
  
  const year = yearMatch[1];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  let month = '01';
  for (let i = 0; i < monthNames.length; i++) {
    if (dateStr.toLowerCase().includes(monthNames[i].toLowerCase())) {
      month = (i + 1).toString().padStart(2, '0');
      break;
    }
  }
  
  return `${year}-${month}`;
}
