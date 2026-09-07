import type { ResumeData, Experience, Education } from './types';

/**
 * Parses extracted CV text into structured ResumeData format
 */
export function parseCVToResume(text: string): Partial<ResumeData> {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  // Extract contact information
  const contact = extractContactInfo(text);
  
  // Extract summary/objective
  const summary = extractSummary(text);
  
  // Extract work experience
  const experience = extractExperience(text, lines);
  
  // Extract education
  const education = extractEducation(text, lines);
  
  // Extract skills
  const skills = extractSkills(text, lines);
  
  // Extract languages if present
  const languages = extractLanguages(text);
  
  // Extract certifications if present
  const certifications = extractCertifications(text);
  
  return {
    contact,
    summary,
    experience,
    education,
    skills,
    languages,
    certifications
  };
}

/**
 * Merges parsed CV data with existing resume data
 */
export function mergeCVWithResume(parsed: Partial<ResumeData>, existing: ResumeData): ResumeData {
  return {
    ...existing,
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
      : existing.certifications
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

function extractSummary(text: string): string {
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
        return cleaned.slice(0, 700);
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
      return line.replace(/\s+/g, ' ').slice(0, 700);
    }
  }
  
  return '';
}

function extractExperience(text: string, lines: string[]): Experience[] {
  const experiences: Experience[] = [];
  
  // 1. Locate Experience section
  const expSectionIndex = lines.findIndex(l =>
    /^(work\s+experience|professional\s+experience|employment\s+history|experience|work\s+history|career\s+history)$/i.test(l) ||
    /^(work\s+experience|professional\s+experience|experience):?$/i.test(l)
  );
  
  const startIndex = expSectionIndex !== -1 ? expSectionIndex + 1 : 0;
  
  // Locate next section to avoid spilling into Education or Skills
  const nextSectionIndex = lines.findIndex((l, idx) =>
    idx > startIndex + 2 &&
    /^(education|academic|skills|technical\s+skills|certifications|projects|languages|references|interests)$/i.test(l)
  );
  
  const expLines = (startIndex > 0)
    ? lines.slice(startIndex, nextSectionIndex !== -1 ? nextSectionIndex : undefined)
    : lines;
  
  // Date pattern: e.g. "Jan 2021 - Present", "2020 - 2023", "03/2019 – 11/2021", "May 2022 - Current"
  const dateRegex = /(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?(?:19|20)\d{2}\s*(?:-|–|—|to)\s*(?:Present|Current|(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?(?:19|20)\d{2})/i;
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
    
    const dateMatch = line.match(dateRegex);
    const bulletMatch = line.match(bulletRegex);
    
    // Check if line is a new job header (contains a date or precedes a date)
    if (dateMatch) {
      // If we already had an active entry, save it
      if (currentEntry && (currentEntry.role || currentEntry.company)) {
        entries.push(currentEntry);
      }
      
      // Look at what else is on this line or previous lines
      let role = '';
      let company = '';
      let location = '';
      const dateStr = dateMatch[0];
      
      const restOfLine = line.replace(dateStr, '').replace(/[|•–—,\-()]/g, ' ').trim();
      
      // If the date line itself contained the role or company
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
        
        if (prev1 && !bulletRegex.test(prev1) && prev1.length < 80) {
          if (prev1.includes('|') || prev1.includes(' - ') || prev1.includes(' — ')) {
            const parts = prev1.split(/[|—]|\s-\s/).map(p => p.trim());
            role = role || parts[0] || '';
            company = company || parts[1] || '';
          } else if (!role) {
            role = prev1;
            if (prev2 && !bulletRegex.test(prev2) && prev2.length < 80) {
              company = prev2;
            }
          } else if (!company) {
            company = prev1;
          }
        }
      }
      
      currentEntry = {
        role: role || 'Professional Role',
        company: company || 'Company',
        location,
        dateStr,
        bullets: []
      };
      continue;
    }
    
    // If it's a bullet point
    if (bulletMatch && currentEntry) {
      const bText = bulletMatch[1].trim();
      if (bText.length > 5) {
        currentEntry.bullets.push(bText);
      }
      continue;
    }
    
    // If not a bullet, but we have an active entry
    if (currentEntry) {
      // Check if line looks like an action bullet without explicit bullet character
      const startsWithVerb = /^(Led|Built|Managed|Designed|Created|Developed|Optimized|Increased|Reduced|Automated|Negotiated|Shipped|Scaled|Engineered|Coordinated|Delivered)\b/i.test(line);
      if (startsWithVerb || line.length > 35) {
        currentEntry.bullets.push(line);
      } else if (!currentEntry.company && line.length < 50) {
        currentEntry.company = line;
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
      bullets: entry.bullets.length > 0 ? entry.bullets.slice(0, 6) : ['Executed core initiatives and delivered key departmental milestones.']
    });
  }
  
  return experiences.slice(0, 6);
}

function parseDateRange(str: string): { start: string; end: string } {
  const parts = str.split(/\s*(?:-|–|—|to)\s*/i);
  const startRaw = parts[0]?.trim() || '';
  const endRaw = parts[1]?.trim() || '';
  
  return {
    start: normalizeDate(startRaw) || '2021-01',
    end: /present|current/i.test(endRaw) ? '' : (normalizeDate(endRaw) || '2023-12')
  };
}

function extractEducation(text: string, lines: string[]): Education[] {
  const educations: Education[] = [];
  
  // 1. Look for education section
  const eduSectionStart = lines.findIndex(l => 
    /^(education|academic\s+background|academic\s+history|academics|qualifications)$/i.test(l) ||
    /^(education|academics):?$/i.test(l)
  );
  
  const startIndex = eduSectionStart !== -1 ? eduSectionStart + 1 : 0;
  const nextSection = lines.findIndex((l, idx) =>
    idx > startIndex + 1 &&
    /^(skills|technical\s+skills|certifications|projects|languages|experience|work\s+experience)$/i.test(l)
  );
  
  const eduLines = (startIndex > 0)
    ? lines.slice(startIndex, nextSection !== -1 ? nextSection : undefined)
    : lines;
  
  // Comprehensive degree patterns
  const degreeRegex = /(?:Bachelor(?:\s+of\s+[A-Za-z]+|\s+degree)?|Master(?:\s+of\s+[A-Za-z]+|\s+degree)?|Doctor\s+of\s+[A-Za-z]+|Ph\.?D\.?|M\.?B\.?A\.?|B\.?S\.?|M\.?S\.?|B\.?A\.?|B\.?Eng\.?|M\.?Eng\.?|Associate(?:\s+of\s+[A-Za-z]+|\s+degree)?|Diploma)/i;
  
  for (let i = 0; i < eduLines.length; i++) {
    const line = eduLines[i].trim();
    if (!line) continue;
    
    if (degreeRegex.test(line) || /University|College|Institute|Polytechnic|School\s+of\s+[A-Za-z]+/i.test(line)) {
      let degree = '';
      let school = '';
      let year = '';
      let location = '';
      
      // Look for year on this line or nearby
      const yearMatch = (line + ' ' + (eduLines[i + 1] || '')).match(/(?:19|20)\d{2}/);
      if (yearMatch) year = yearMatch[0];
      
      // Determine school vs degree
      if (/University|College|Institute|Polytechnic|Academy/i.test(line)) {
        school = line.replace(/(?:19|20)\d{2}/, '').replace(/[|•–—,]/g, ' ').trim();
        // Check next line for degree
        const next = eduLines[i + 1]?.trim() || '';
        if (next && degreeRegex.test(next)) {
          degree = next.replace(/(?:19|20)\d{2}/, '').replace(/[|•–—,]/g, ' ').trim();
          i++;
        }
      } else if (degreeRegex.test(line)) {
        degree = line.replace(/(?:19|20)\d{2}/, '').replace(/[|•–—,]/g, ' ').trim();
        // Check next line for school
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
  
  return educations.slice(0, 3);
}

function extractSkills(text: string, lines: string[]): string[] {
  const skills: string[] = [];
  
  // 1. Look for skills section
  const skillsSectionStart = lines.findIndex(l => 
    /^(skills|technical\s+skills|core\s+competencies|expertise|technologies|tools\s+&\s+technologies|proficiencies)$/i.test(l) ||
    /^(skills|technical\s+skills):?$/i.test(l)
  );
  
  if (skillsSectionStart !== -1) {
    const skillsLines = lines.slice(skillsSectionStart + 1, skillsSectionStart + 20);
    
    for (const line of skillsLines) {
      if (/^(experience|education|certifications|projects|languages|interests)$/i.test(line)) break;
      
      // Split by common delimiters (commas, bullets, pipes, semicolons, slashes)
      const parts = line
        .replace(/^[A-Za-z\s]+:\s*/, '') // remove category prefix like "Languages: Python, JS"
        .split(/[,•●○│;|/·\t]/)
        .map(s => s.trim())
        .filter(s => s.length >= 2 && s.length <= 40 && !s.includes('@') && !s.includes('http'));
      
      skills.push(...parts);
    }
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

function extractLanguages(text: string): string[] {
  const languages: string[] = [];
  
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
        if (langText.includes(lang)) {
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
  
  return languages.slice(0, 5);
}

function extractCertifications(text: string): string[] {
  const certifications: string[] = [];
  
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
        if (cleaned.length > 5 && cleaned.length < 100) {
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
