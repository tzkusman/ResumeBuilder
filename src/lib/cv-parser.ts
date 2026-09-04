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
  
  // Email pattern
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    contact.email = emailMatch[0];
  }
  
  // Phone pattern (various formats)
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) {
    contact.phone = phoneMatch[0];
  }
  
  // LinkedIn URL
  const linkedinMatch = text.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  if (linkedinMatch) {
    contact.linkedin = `https://${linkedinMatch[0]}`;
  }
  
  // Website URL (not email or linkedin)
  const websiteMatch = text.match(/https?:\/\/(?!linkedin\.com)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[^\s]*)?/i);
  if (websiteMatch) {
    contact.website = websiteMatch[0];
  }
  
  // Location - look for city, state patterns
  const locationMatch = text.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),?\s*([A-Z]{2})\b/);
  if (locationMatch) {
    contact.location = `${locationMatch[1]}, ${locationMatch[2]}`;
  }
  
  // Name - typically at the top, largest text (first non-empty line that's not contact info)
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  for (const line of lines.slice(0, 5)) {
    if (line !== contact.email && 
        line !== contact.phone && 
        !line.includes('@') && 
        !line.includes('http') &&
        !line.match(/^\d/) &&
        line.length < 50 &&
        line.length > 2) {
      // Check if it looks like a name (capitalized words)
      if (/^[A-Z][a-z]+(\s+[A-Z][a-z]+)+$/.test(line) || /^[A-Z]{2,}\s+[A-Z][a-z]+$/.test(line)) {
        contact.fullName = line;
        break;
      }
    }
  }
  
  // Title - often near name or in summary
  const titlePatterns = [
    /Software\s+Engineer/i,
    /Product\s+Manager/i,
    /Data\s+Scientist/i,
    /Marketing\s+Manager/i,
    /Project\s+Manager/i,
    /Designer/i,
    /Developer/i,
    /Analyst/i,
    /Consultant/i,
    /Director/i,
    /Manager/i,
    /Lead/i
  ];
  
  for (const pattern of titlePatterns) {
    const match = text.match(pattern);
    if (match && match.index && match.index < 500) {
      contact.title = match[0];
      break;
    }
  }
  
  return contact;
}

function extractSummary(text: string): string {
  const summaryPatterns = [
    /Professional\s+Summary[:\s]*([\s\S]*?)(?=Experience|Work|Education|Skills|$)/i,
    /Summary[:\s]*([\s\S]*?)(?=Experience|Work|Education|Skills|$)/i,
    /Objective[:\s]*([\s\S]*?)(?=Experience|Work|Education|Skills|$)/i,
    /About\s+Me[:\s]*([\s\S]*?)(?=Experience|Work|Education|Skills|$)/i,
    /Profile[:\s]*([\s\S]*?)(?=Experience|Work|Education|Skills|$)/i
  ];
  
  for (const pattern of summaryPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim().replace(/\s+/g, ' ').slice(0, 500);
    }
  }
  
  // Fallback: Look for a paragraph after the name/contact section
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  let foundContact = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.length > 50 && line.length < 300 && !foundContact) {
      // Likely a summary paragraph
      if (/[a-zA-Z]/.test(line) && line.split(' ').length > 10) {
        return line.slice(0, 500);
      }
    }
    // Mark contact section as found after seeing email/phone
    if (line.includes('@') || line.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/)) {
      foundContact = true;
    }
  }
  
  return '';
}

function extractExperience(text: string, lines: string[]): Experience[] {
  const experiences: Experience[] = [];
  
  // Look for experience section
  const expSectionStart = lines.findIndex(l => 
    /Experience|Work\s+History|Employment|Professional\s+Experience/i.test(l)
  );
  
  if (expSectionStart === -1) return experiences;
  
  // Find all date ranges (YYYY - YYYY or YYYY - Present)
  const datePattern = /(20\d{2}|19\d{2})\s*[-–]\s*(Present|20\d{2}|19\d{2})/gi;
  const dateMatches = [...text.matchAll(datePattern)];
  
  // Extract company names and roles
  for (let i = 0; i < dateMatches.length; i++) {
    const dateMatch = dateMatches[i];
    const startDate = dateMatch[1];
    const endDate = dateMatch[2];
    
    // Look backwards from date to find role and company
    const textBeforeDate = text.slice(0, dateMatch.index);
    const linesBefore = textBeforeDate.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    let role = '';
    let company = '';
    let location = '';
    let bullets: string[] = [];
    
    // Get last few lines before date
    const recentLines = linesBefore.slice(-5);
    for (const line of recentLines.reverse()) {
      if (!role && line.length < 60 && /[A-Za-z]/.test(line)) {
        role = line.replace(/[-–]\s*(Present|20\d{2}|19\d{2}).*$/, '').trim();
      } else if (!company && role && line.length < 80 && !line.includes('@')) {
        company = line;
        break;
      }
    }
    
    // Get bullet points between this date and next date (or end of section)
    const currentPos = (dateMatch.index || 0) + dateMatch[0].length;
    const nextDatePos = dateMatches[i + 1] ? (dateMatches[i + 1].index || text.length) : text.length;
    const sectionText = text.slice(currentPos, Math.min(nextDatePos, nextDatePos + 2000));
    
    // Extract bullet points
    const bulletPatterns = [
      /^[•●○▪▸→-]\s*(.+)$/gm,
      /^\s*\*\s*(.+)$/gm,
      /^\s*\d+\.\s*(.+)$/gm
    ];
    
    for (const pattern of bulletPatterns) {
      const bulletsMatch = [...sectionText.matchAll(pattern)];
      bullets = bulletsMatch.map(m => m[1].trim()).filter(b => b.length > 10);
      if (bullets.length > 0) break;
    }
    
    if (role || company) {
      experiences.push({
        id: Math.random().toString(36).slice(2, 9),
        company,
        role,
        location,
        start: normalizeDate(startDate),
        end: endDate.toLowerCase() === 'present' ? '' : normalizeDate(endDate),
        bullets: bullets.slice(0, 6)
      });
    }
  }
  
  return experiences.slice(0, 5); // Limit to 5 most recent
}

function extractEducation(text: string, lines: string[]): Education[] {
  const educations: Education[] = [];
  
  // Look for education section
  const eduSectionStart = lines.findIndex(l => 
    /Education|Degree|University|College/i.test(l)
  );
  
  if (eduSectionStart === -1) return educations;
  
  // Common degree patterns
  const degreePatterns = [
    /(Bachelor\s+(?:of\s+)?[A-Za-z]+(?:\s+in\s+[A-Za-z]+)?)/i,
    /(Master\s+(?:of\s+)?[A-Za-z]+(?:\s+in\s+[A-Za-z]+)?)/i,
    /(Ph\.?D\.?\s+(?:in\s+)?[A-Za-z]+)/i,
    /(M\.?B\.?A\.?)/i,
    /(B\.?S\.?\s+(?:in\s+)?[A-Za-z]+)/i,
    /(M\.?S\.?\s+(?:in\s+)?[A-Za-z]+)/i,
    /(B\.?A\.?\s+(?:in\s+)?[A-Za-z]+)/i,
    /(Associate\s+(?:of\s+)?[A-Za-z]+)/i
  ];
  
  // Find all degree mentions
  for (const pattern of degreePatterns) {
    const matches = [...text.matchAll(pattern)];
    for (const match of matches) {
      const degree = match[1];
      const fieldMatch = text.slice(match.index || 0, (match.index || 0) + 200).match(/in\s+([A-Za-z\s]+?)(?:\s*,|\s*\(|$)/i);
      const field = fieldMatch ? fieldMatch[1].trim() : '';
      
      // Look for university name nearby
      const contextWindow = text.slice(Math.max(0, (match.index || 0) - 100), (match.index || 0) + 300);
      const uniPatterns = [
        /([A-Z][a-z]+\s+University)/i,
        /(University\s+of\s+[A-Z][a-z]+)/i,
        /([A-Z][a-z]+\s+College)/i,
        /([A-Z]{2,})/  // Acronyms like MIT, UCLA
      ];
      
      let institution = '';
      for (const uniPattern of uniPatterns) {
        const uniMatch = contextWindow.match(uniPattern);
        if (uniMatch && !uniMatch[1].includes(degree)) {
          institution = uniMatch[1];
          break;
        }
      }
      
      // Look for graduation year
      const yearMatch = contextWindow.match(/(20\d{2}|19\d{2})/);
      const graduationYear = yearMatch ? yearMatch[1] : '';
      
      if (degree && (institution || field)) {
        educations.push({
          id: Math.random().toString(36).slice(2, 9),
          school: institution,
          degree: `${degree}${field ? ` in ${field}` : ''}`,
          location: '',
          year: graduationYear
        });
      }
    }
  }
  
  return educations.slice(0, 3); // Limit to 3
}

function extractSkills(text: string, lines: string[]): string[] {
  const skills: string[] = [];
  
  // Look for skills section
  const skillsSectionStart = lines.findIndex(l => 
    /Skills|Technical\s+Skills|Core\s+Competencies|Expertise|Technologies/i.test(l)
  );
  
  if (skillsSectionStart !== -1) {
    // Get lines after skills section
    const skillsLines = lines.slice(skillsSectionStart + 1, skillsSectionStart + 15);
    
    for (const line of skillsLines) {
      // Split by common delimiters
      const delimiterPatterns = [/,/, /•/, /●/, /○/, /│/, /;/, /\|/];
      let skillItems: string[] = [];
      
      for (const delimiter of delimiterPatterns) {
        if (delimiter.test(line)) {
          skillItems = line.split(delimiter).map(s => s.trim()).filter(s => s.length > 0 && s.length < 50);
          break;
        }
      }
      
      if (skillItems.length === 0 && line.length > 0 && line.length < 50) {
        skillItems = [line];
      }
      
      skills.push(...skillItems);
    }
  }
  
  // Also look for inline skills throughout the document
  const commonSkills = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'React', 'Angular', 'Vue',
    'Node.js', 'Express', 'Django', 'Flask', 'SQL', 'MongoDB', 'PostgreSQL',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Git', 'CI/CD', 'Agile',
    'Scrum', 'REST API', 'GraphQL', 'HTML', 'CSS', 'Tailwind', 'Bootstrap',
    'Machine Learning', 'Data Analysis', 'TensorFlow', 'PyTorch',
    'Project Management', 'Leadership', 'Communication', 'Problem Solving'
  ];
  
  for (const skill of commonSkills) {
    if (text.includes(skill) && !skills.includes(skill)) {
      skills.push(skill);
    }
  }
  
  // Clean and deduplicate
  return [...new Set(skills)]
    .map(s => s.replace(/^[\u2022\u25CF\u25CB\u25AA\u25B8\u2192\-,;|]+\s*/, '').trim())
    .filter(s => s.length > 1 && s.length < 50)
    .slice(0, 15);
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
