import * as mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import stringSimilarity from 'string-similarity';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js';

export interface ATSAnalysis {
  score: number;
  maxScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  issues: ATSIssue[];
  suggestions: string[];
  keywords: KeywordMatch[];
  sections: SectionAnalysis;
  formatting: FormattingAnalysis;
}

export interface ATSIssue {
  type: 'critical' | 'warning' | 'info';
  category: 'structure' | 'keywords' | 'formatting' | 'content' | 'length';
  message: string;
  suggestion: string;
  severity: number;
}

export interface KeywordMatch {
  keyword: string;
  found: boolean;
  count: number;
  importance: 'high' | 'medium' | 'low';
  category: string;
}

export interface SectionAnalysis {
  contact: { exists: boolean; complete: boolean; score: number };
  summary: { exists: boolean; quality: 'good' | 'fair' | 'poor'; score: number };
  experience: { exists: boolean; count: number; hasMetrics: boolean; score: number };
  education: { exists: boolean; complete: boolean; score: number };
  skills: { exists: boolean; count: number; relevant: boolean; score: number };
  missing: string[];
}

export interface FormattingAnalysis {
  fileFormat: 'docx' | 'pdf' | 'txt' | 'unknown';
  isParseable: boolean;
  hasImages: boolean;
  hasTables: boolean;
  hasColumns: boolean;
  fontIssues: boolean;
  readableByATS: boolean;
}

// Common ATS keywords by industry
const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  technology: [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'SQL',
    'AWS', 'Azure', 'Docker', 'Kubernetes', 'Git', 'Agile', 'Scrum',
    'REST API', 'GraphQL', 'CI/CD', 'Microservices', 'Cloud', 'DevOps'
  ],
  healthcare: [
    'Patient Care', 'Clinical', 'HIPAA', 'Medical Records', 'Diagnosis',
    'Treatment Planning', 'Electronic Health Records', 'Healthcare Compliance',
    'Medical Terminology', 'Patient Safety', 'Quality Improvement'
  ],
  finance: [
    'Financial Analysis', 'Budgeting', 'Forecasting', 'Risk Management',
    'Compliance', 'GAAP', 'Financial Modeling', 'Investment Analysis',
    'Audit', 'Tax Preparation', 'Accounting', 'Excel', 'SAP'
  ],
  marketing: [
    'Digital Marketing', 'SEO', 'SEM', 'Social Media Marketing', 'Content Strategy',
    'Brand Management', 'Campaign Management', 'Analytics', 'Google Analytics',
    'Marketing Automation', 'Lead Generation', 'Conversion Optimization'
  ],
  education: [
    'Curriculum Development', 'Student Engagement', 'Assessment', 'Lesson Planning',
    'Classroom Management', 'Educational Technology', 'Differentiated Instruction',
    'Student Assessment', 'Learning Outcomes', 'Pedagogy'
  ],
  engineering: [
    'Project Management', 'CAD', 'Design Review', 'Quality Assurance',
    'Testing', 'Prototyping', 'Technical Documentation', 'Cross-functional',
    'Problem Solving', 'Root Cause Analysis', 'Lean Manufacturing', 'Six Sigma'
  ],
  sales: [
    'Business Development', 'Client Relationship', 'Negotiation', 'Pipeline Management',
    'Sales Strategy', 'Account Management', 'Cold Calling', 'Closing Deals',
    'CRM', 'Salesforce', 'Lead Qualification', 'Revenue Growth'
  ],
  customer_service: [
    'Customer Satisfaction', 'Conflict Resolution', 'Communication Skills',
    'Problem Solving', 'Multi-tasking', 'Phone Support', 'Email Support',
    'Live Chat', 'Customer Retention', 'Service Excellence'
  ]
};

// Required sections for ATS
const REQUIRED_SECTIONS = ['contact', 'summary', 'experience', 'education', 'skills'];

// Action verbs that strengthen resumes
const ACTION_VERBS = [
  'Achieved', 'Accelerated', 'Accomplished', 'Analyzed', 'Built', 'Coordinated',
  'Created', 'Developed', 'Directed', 'Enhanced', 'Executed', 'Generated',
  'Implemented', 'Improved', 'Increased', 'Led', 'Managed', 'Optimized',
  'Organized', 'Oversaw', 'Planned', 'Reduced', 'Streamlined', 'Successfully'
];

export async function parseDocxFile(file: File): Promise<{ text: string; rawHtml?: string }> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    // Also extract with HTML for better structure detection
    const htmlResult = await mammoth.convertToHtml({ arrayBuffer });
    
    return {
      text: result.value || '',
      rawHtml: htmlResult.value
    };
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    throw new Error('Failed to parse DOCX file. Please ensure it\'s a valid Word document.');
  }
}

export async function parsePdfFile(file: File): Promise<{ text: string }> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    return { text: fullText };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file. This PDF may be image-based or encrypted.');
  }
}

export function analyzeCV(text: string, jobDescription?: string): ATSAnalysis {
  const normalizedText = text.toLowerCase();
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  
  // Detect industry from keywords
  const detectedIndustry = detectIndustry(normalizedText);
  const relevantKeywords = INDUSTRY_KEYWORDS[detectedIndustry] || INDUSTRY_KEYWORDS.technology;
  
  // Analyze sections
  const sections = analyzeSections(text, normalizedText);
  
  // Analyze formatting (basic detection)
  const formatting = analyzeFormatting(text);
  
  // Keyword analysis
  const keywords = analyzeKeywords(normalizedText, relevantKeywords, jobDescription);
  
  // Content quality analysis
  const contentIssues = analyzeContent(sentences, words, normalizedText);
  
  // Calculate scores
  const sectionScore = calculateSectionScore(sections);
  const keywordScore = calculateKeywordScore(keywords);
  const contentScore = calculateContentScore(contentIssues);
  const formattingScore = formatting.readableByATS ? 100 : 60;
  
  // Overall score (weighted average)
  const overallScore = Math.round(
    (sectionScore * 0.3) + 
    (keywordScore * 0.25) + 
    (contentScore * 0.25) + 
    (formattingScore * 0.2)
  );
  
  // Determine grade
  const grade = determineGrade(overallScore);
  
  // Generate suggestions
  const suggestions = generateSuggestions(sections, keywords, contentIssues, formatting);
  
  // Compile all issues
  const issues = [
    ...generateSectionIssues(sections),
    ...generateKeywordIssues(keywords),
    ...contentIssues,
    ...generateFormattingIssues(formatting)
  ].sort((a, b) => b.severity - a.severity);
  
  return {
    score: Math.min(100, Math.max(0, overallScore)),
    maxScore: 100,
    grade,
    issues,
    suggestions,
    keywords,
    sections,
    formatting
  };
}

function detectIndustry(text: string): string {
  const industryScores: Record<string, number> = {};
  
  Object.entries(INDUSTRY_KEYWORDS).forEach(([industry, keywords]) => {
    const matches = keywords.filter(kw => text.includes(kw.toLowerCase())).length;
    industryScores[industry] = matches;
  });
  
  const bestMatch = Object.entries(industryScores)
    .sort(([, a], [, b]) => b - a)[0];
  
  return bestMatch && bestMatch[1] > 0 ? bestMatch[0] : 'technology';
}

function analyzeSections(text: string, normalizedText: string): SectionAnalysis {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  // Contact information analysis
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/.test(text);
  const hasLocation = /\b[A-Z][a-z]+,\s*[A-Z]{2}\b/.test(text) || /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/.test(text);
  const hasLinkedIn = /linkedin\.com/i.test(text);
  
  const contactInfo = {
    exists: hasEmail || hasPhone,
    complete: hasEmail && hasPhone && hasLocation,
    score: (hasEmail ? 25 : 0) + (hasPhone ? 25 : 0) + (hasLocation ? 25 : 0) + (hasLinkedIn ? 25 : 0)
  };
  
  // Summary/Objective analysis
  const summaryPatterns = ['objective', 'summary', 'profile', 'about me', 'professional summary'];
  const hasSummary = summaryPatterns.some(p => normalizedText.includes(p));
  const summaryLength = hasSummary ? text.split(/[.!?]+/).find(s => 
    summaryPatterns.some(p => s.toLowerCase().includes(p))
  )?.length || 0 : 0;
  
  const summaryInfo = {
    exists: hasSummary,
    quality: summaryLength > 200 ? 'good' : summaryLength > 100 ? 'fair' : 'poor',
    score: hasSummary ? (summaryLength > 200 ? 100 : summaryLength > 100 ? 70 : 40) : 0
  };
  
  // Experience analysis
  const experiencePatterns = ['experience', 'work history', 'employment', 'professional experience'];
  const hasExperience = experiencePatterns.some(p => normalizedText.includes(p));
  const experienceEntries = (text.match(/\b(20\d{2}|19\d{2})\s*[-–]\s*(Present|20\d{2}|19\d{2})\b/gi) || []).length;
  const hasMetrics = /\d+%|\$\d+|\d+x|increased|decreased|reduced|improved/i.test(text);
  
  const experienceInfo = {
    exists: hasExperience,
    count: Math.max(experienceEntries, hasExperience ? 1 : 0),
    hasMetrics,
    score: hasExperience ? (experienceEntries >= 2 ? 80 : 60) + (hasMetrics ? 20 : 0) : 0
  };
  
  // Education analysis
  const educationPatterns = ['education', 'degree', 'university', 'college', 'bachelor', 'master', 'phd'];
  const hasEducation = educationPatterns.some(p => normalizedText.includes(p));
  const hasDegreeDetails = /(Bachelor|Master|PhD|B\.?S\.?|M\.?S\.?|B\.?A\.?|M\.?A\.?)/i.test(text);
  
  const educationInfo = {
    exists: hasEducation,
    complete: hasEducation && hasDegreeDetails,
    score: hasEducation ? (hasDegreeDetails ? 100 : 60) : 0
  };
  
  // Skills analysis
  const skillsPatterns = ['skills', 'technical skills', 'core competencies', 'expertise'];
  const hasSkills = skillsPatterns.some(p => normalizedText.includes(p));
  const skillCount = (text.match(/[,•●○▪▸→]\s*[A-Za-z]/g) || []).length;
  
  const skillsInfo = {
    exists: hasSkills,
    count: Math.max(skillCount, hasSkills ? 3 : 0),
    relevant: skillCount >= 5,
    score: hasSkills ? (skillCount >= 8 ? 100 : skillCount >= 5 ? 80 : 50) : 0
  };
  
  // Missing sections
  const missing: string[] = [];
  if (!contactInfo.exists) missing.push('Contact Information');
  if (!summaryInfo.exists) missing.push('Professional Summary');
  if (!experienceInfo.exists) missing.push('Work Experience');
  if (!educationInfo.exists) missing.push('Education');
  if (!skillsInfo.exists) missing.push('Skills');
  
  return {
    contact: contactInfo,
    summary: summaryInfo,
    experience: experienceInfo,
    education: educationInfo,
    skills: skillsInfo,
    missing
  };
}

function analyzeFormatting(text: string): FormattingAnalysis {
  const hasSpecialChars = /[•●○▪▸→│├└─]/.test(text);
  const hasTables = /\|.*\|/.test(text);
  const hasMultipleColumns = text.split('\n').some(line => line.length > 150);
  
  return {
    fileFormat: 'docx', // Will be set by caller
    isParseable: text.length > 100,
    hasImages: false, // Can't detect from text
    hasTables,
    hasColumns: hasMultipleColumns,
    fontIssues: false, // Can't detect from text
    readableByATS: !hasMultipleColumns && !hasTables
  };
}

function analyzeKeywords(text: string, industryKeywords: string[], jobDescription?: string): KeywordMatch[] {
  const customKeywords = jobDescription ? extractKeywords(jobDescription) : [];
  const allKeywords = [...new Set([...industryKeywords, ...customKeywords])];
  
  return allKeywords.map(keyword => {
    const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = text.match(regex);
    const count = matches ? matches.length : 0;
    
    // Determine importance
    let importance: 'high' | 'medium' | 'low' = 'medium';
    if (customKeywords.includes(keyword)) {
      importance = 'high';
    } else if (['JavaScript', 'Python', 'React', 'SQL'].includes(keyword)) {
      importance = 'high';
    }
    
    // Categorize
    let category = 'Technical';
    if (['Communication', 'Leadership', 'Teamwork'].includes(keyword)) {
      category = 'Soft Skills';
    } else if (['Project Management', 'Agile', 'Scrum'].includes(keyword)) {
      category = 'Methodologies';
    }
    
    return {
      keyword,
      found: count > 0,
      count,
      importance,
      category
    };
  });
}

function extractKeywords(text: string): string[] {
  // Simple keyword extraction - nouns and technical terms
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3);
  
  // Count frequency
  const freq: Record<string, number> = {};
  words.forEach(w => {
    freq[w] = (freq[w] || 0) + 1;
  });
  
  // Return top frequent words that might be keywords
  return Object.entries(freq)
    .filter(([_, count]) => count >= 2)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15)
    .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));
}

function analyzeContent(sentences: string[], words: string[], text: string): ATSIssue[] {
  const issues: ATSIssue[] = [];
  
  // Check for action verbs
  const hasActionVerbs = ACTION_VERBS.some(verb => 
    sentences.some(s => s.trim().startsWith(verb))
  );
  
  if (!hasActionVerbs) {
    issues.push({
      type: 'warning',
      category: 'content',
      message: 'Limited use of strong action verbs',
      suggestion: 'Start bullet points with action verbs like "Achieved", "Developed", "Managed"',
      severity: 60
    });
  }
  
  // Check sentence length
  const avgSentenceLength = words.length / Math.max(1, sentences.length);
  if (avgSentenceLength > 30) {
    issues.push({
      type: 'info',
      category: 'content',
      message: 'Sentences may be too long',
      suggestion: 'Keep sentences concise (15-25 words) for better readability',
      severity: 40
    });
  }
  
  // Check for first person pronouns (should minimize in modern resumes)
  const firstPersonCount = (text.match(/\b(I|me|my|mine)\b/gi) || []).length;
  if (firstPersonCount > 5) {
    issues.push({
      type: 'info',
      category: 'content',
      message: 'Excessive use of first-person pronouns',
      suggestion: 'Remove "I", "me", "my" - let your achievements speak for themselves',
      severity: 30
    });
  }
  
  // Check for quantifiable achievements
  const hasNumbers = /\d+%|\$\d+|\d+x|\d+\s+(people|team|clients|customers)/i.test(text);
  if (!hasNumbers) {
    issues.push({
      type: 'warning',
      category: 'content',
      message: 'No quantifiable achievements detected',
      suggestion: 'Add numbers, percentages, or metrics to demonstrate impact',
      severity: 70
    });
  }
  
  // Check resume length (word count)
  if (words.length < 400) {
    issues.push({
      type: 'critical',
      category: 'length',
      message: 'Resume may be too short',
      suggestion: 'Aim for 400-800 words for a comprehensive resume',
      severity: 80
    });
  } else if (words.length > 1200) {
    issues.push({
      type: 'warning',
      category: 'length',
      message: 'Resume may be too long',
      suggestion: 'Keep it concise - aim for 1-2 pages maximum',
      severity: 50
    });
  }
  
  return issues;
}

function calculateSectionScore(sections: SectionAnalysis): number {
  const weights = {
    contact: 0.15,
    summary: 0.15,
    experience: 0.30,
    education: 0.20,
    skills: 0.20
  };
  
  return Math.round(
    sections.contact.score * weights.contact +
    sections.summary.score * weights.summary +
    sections.experience.score * weights.experience +
    sections.education.score * weights.education +
    sections.skills.score * weights.skills
  );
}

function calculateKeywordScore(keywords: KeywordMatch[]): number {
  const highImportance = keywords.filter(k => k.importance === 'high');
  const mediumImportance = keywords.filter(k => k.importance === 'medium');
  
  const highMatchRate = highImportance.filter(k => k.found).length / Math.max(1, highImportance.length);
  const mediumMatchRate = mediumImportance.filter(k => k.found).length / Math.max(1, mediumImportance.length);
  
  return Math.round((highMatchRate * 70) + (mediumMatchRate * 30));
}

function calculateContentScore(issues: ATSIssue[]): number {
  const criticalIssues = issues.filter(i => i.type === 'critical').length;
  const warningIssues = issues.filter(i => i.type === 'warning').length;
  
  let score = 100;
  score -= criticalIssues * 20;
  score -= warningIssues * 10;
  
  return Math.max(0, score);
}

function determineGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

function generateSuggestions(
  sections: SectionAnalysis,
  keywords: KeywordMatch[],
  issues: ATSIssue[],
  formatting: FormattingAnalysis
): string[] {
  const suggestions: string[] = [];
  
  // Section-specific suggestions
  sections.missing.forEach(section => {
    suggestions.push(`Add a "${section}" section to your resume`);
  });
  
  if (!sections.summary.exists) {
    suggestions.push('Write a compelling 2-3 sentence professional summary highlighting your key achievements');
  }
  
  if (!sections.experience.hasMetrics) {
    suggestions.push('Quantify your achievements with numbers, percentages, or dollar amounts');
  }
  
  // Keyword suggestions
  const missingHighPriority = keywords.filter(k => k.importance === 'high' && !k.found);
  if (missingHighPriority.length > 0) {
    suggestions.push(`Include these important keywords: ${missingHighPriority.slice(0, 3).map(k => k.keyword).join(', ')}`);
  }
  
  // Formatting suggestions
  if (!formatting.readableByATS) {
    suggestions.push('Simplify formatting - avoid tables, columns, and complex layouts for better ATS compatibility');
  }
  
  // Top issues
  issues.slice(0, 3).forEach(issue => {
    if (!suggestions.includes(issue.suggestion)) {
      suggestions.push(issue.suggestion);
    }
  });
  
  return suggestions.slice(0, 5);
}

function generateSectionIssues(sections: SectionAnalysis): ATSIssue[] {
  const issues: ATSIssue[] = [];
  
  if (!sections.contact.exists) {
    issues.push({
      type: 'critical',
      category: 'structure',
      message: 'Missing contact information',
      suggestion: 'Add your email address and phone number at the top of your resume',
      severity: 95
    });
  } else if (!sections.contact.complete) {
    issues.push({
      type: 'warning',
      category: 'structure',
      message: 'Incomplete contact information',
      suggestion: 'Consider adding your location and LinkedIn profile URL',
      severity: 50
    });
  }
  
  if (!sections.experience.exists) {
    issues.push({
      type: 'critical',
      category: 'structure',
      message: 'No work experience section found',
      suggestion: 'Add detailed work experience with company names, dates, and achievements',
      severity: 90
    });
  }
  
  if (!sections.education.exists) {
    issues.push({
      type: 'warning',
      category: 'structure',
      message: 'No education section found',
      suggestion: 'Add your educational background including degree, institution, and graduation year',
      severity: 70
    });
  }
  
  if (!sections.skills.exists) {
    issues.push({
      type: 'warning',
      category: 'structure',
      message: 'No skills section found',
      suggestion: 'Add a dedicated skills section listing your technical and soft skills',
      severity: 65
    });
  }
  
  return issues;
}

function generateKeywordIssues(keywords: KeywordMatch[]): ATSIssue[] {
  const issues: ATSIssue[] = [];
  
  const missingHigh = keywords.filter(k => k.importance === 'high' && !k.found);
  if (missingHigh.length > 3) {
    issues.push({
      type: 'warning',
      category: 'keywords',
      message: `Missing ${missingHigh.length} high-priority industry keywords`,
      suggestion: 'Review job descriptions in your field and incorporate relevant keywords naturally',
      severity: 75
    });
  }
  
  return issues;
}

function generateFormattingIssues(formatting: FormattingAnalysis): ATSIssue[] {
  const issues: ATSIssue[] = [];
  
  if (!formatting.readableByATS) {
    issues.push({
      type: 'critical',
      category: 'formatting',
      message: 'Complex formatting detected that may confuse ATS systems',
      suggestion: 'Use a simple, single-column layout without tables or text boxes',
      severity: 85
    });
  }
  
  if (formatting.hasTables) {
    issues.push({
      type: 'warning',
      category: 'formatting',
      message: 'Tables detected in resume',
      suggestion: 'Replace tables with simple text formatting for better ATS parsing',
      severity: 70
    });
  }
  
  return issues;
}
