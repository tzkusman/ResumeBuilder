export interface Country {
  code: string;
  name: string;
  docName: string;
  pages: string;
  photo: "Never" | "Optional" | "Expected" | "Required";
  dateFormat: string;
  phoneExample: string;
  paper: string;
  atsNote: string;
  tips: string[];
  dos: string[];
  donts: string[];
  summary: string;
}

export const COUNTRIES: Country[] = [
  {
    code: "us", name: "United States", docName: "Resume", pages: "1 page (<10 yrs) · 2 max", photo: "Never",
    dateFormat: "MM/YYYY or 'Mar 2022'", phoneExample: "+1 (415) 555-0132", paper: "US Letter (8.5 × 11 in)",
    atsNote: "99% of Fortune 500 use ATS. Single column, standard headings, no graphics.",
    tips: [
      "Never include a photo, age, marital status or nationality — it invites bias claims and instant rejection.",
      "One page under 10 years of experience; two pages only for senior roles with relevant depth.",
      "Reverse-chronological wins: recruiters spend 7 seconds before deciding to keep reading.",
      "Spell out state names and zip codes; some ATS parse 'CA' ambiguously.",
    ],
    dos: ["Quantify with $ and %", "Mirror job-post keywords", "Use .pdf unless the posting asks for .docx", "Include city, state — remote roles list 'Remote, USA'"],
    donts: ["Add a headshot", "Write an 'Objective' statement", "Use graphics or skill bars", "List references or 'available on request'"],
    summary: "The US resume is a strict one-to-two page achievement document. No photos, no personal data, heavy quantification, and ATS-first formatting because nearly every mid-size employer screens electronically.",
  },
  {
    code: "gb", name: "United Kingdom", docName: "CV", pages: "2 pages standard", photo: "Never",
    dateFormat: "MM/YYYY", phoneExample: "+44 7911 123456", paper: "A4",
    atsNote: "Most graduate schemes and corporates use ATS; keep headings conventional ('Work Experience').",
    tips: [
      "The UK 'CV' is still 2 pages maximum — three pages signals you can't edit yourself.",
      "Include a short personal statement (3–4 lines) under your name; UK recruiters expect it.",
      "Grades matter early-career: list A-levels and degree classification (e.g. '2:1').",
      "No photo, no date of birth — the Equality Act makes these a liability for employers.",
    ],
    dos: ["Open with a 3-line personal profile", "Note right-to-work status if non-UK", "Use 'CV' not 'resume' in file names", "Put hobbies briefly — culture fit is weighed"],
    donts: ["Exceed two pages", "Add a photo", "Use US spelling throughout", "Omit your degree classification if recent"],
    summary: "The British CV runs two A4 pages with a short personal statement at the top. Photos and personal data are excluded, degree classifications appear early-career, and ATS-friendly structure is expected at corporates.",
  },
  {
    code: "ca", name: "Canada", docName: "Resume", pages: "1–2 pages", photo: "Never",
    dateFormat: "MM/YYYY", phoneExample: "+1 (416) 555-0199", paper: "US Letter",
    atsNote: "Large employers (banks, telcos, public sector) screen with ATS; bilingual keywords matter.",
    tips: [
      "Format mirrors the US, but two pages is more readily accepted even mid-career.",
      "In Quebec and federal roles, a French version may be expected — 'bilingual' is a searchable skill.",
      "Mention work authorization early if you're a newcomer; employers can't ask but do wonder.",
      "References are genuinely requested in Canada more often than in the US — have three ready.",
    ],
    dos: ["State 'Canadian citizen / PR / open work permit' if relevant", "Highlight volunteer work — it's culturally weighted", "Use province abbreviations (ON, BC, QC)", "Tailor to each posting; generic CVs stall"],
    donts: ["Add a photo or SIN number", "Write 'resume' in a French-style layout for English Canada", "Ignore the bilingual angle in Ottawa/Montreal", "Use imperial units only — Canada is metric"],
    summary: "Canadian resumes closely follow the US style with a slightly more generous two-page norm, no photos, and an expectation of community involvement. Bilingual English/French presentation opens federal and Quebec opportunities.",
  },
  {
    code: "au", name: "Australia", docName: "Resume / CV", pages: "2–3 pages accepted", photo: "Never",
    dateFormat: "MM/YYYY", phoneExample: "+61 412 345 678", paper: "A4",
    atsNote: "Government and ASX-listed companies use ATS; address key criteria explicitly for public sector roles.",
    tips: [
      "Longer is fine: 2–3 pages is normal because recruiters expect a fuller career narrative.",
      "Government applications require a 'key selection criteria' response — treat it as part of the resume.",
      "State visa/work rights explicitly; it's the first question for internationally trained candidates.",
      "A casual, confident tone is welcome; Australians distrust over-formal American phrasing.",
    ],
    dos: ["Include a 3–4 line career summary", "List referees or note 'available on request'", "Address selection criteria for gov roles", "Spell with -ise endings (organisation)"],
    donts: ["Add a photo", "Copy US one-page brevity — it reads thin", "Omit visa status as a non-citizen", "Use 'résumé' accents — keep it plain"],
    summary: "Australia accepts a fuller 2–3 page resume with a career summary and often referees. Public-sector roles demand explicit responses to key selection criteria, and work-rights status should be stated upfront.",
  },
  {
    code: "de", name: "Germany", docName: "Lebenslauf", pages: "1–2 pages", photo: "Expected",
    dateFormat: "DD.MM.YYYY", phoneExample: "+49 151 2345678", paper: "A4",
    atsNote: "Corporate roles increasingly use ATS; tabular (tabellarisch) layout still parses well if single-column.",
    tips: [
      "The tabular CV (tabellarischer Lebenslauf) lists dates in the left column — it's the national format.",
      "A professional photo is still expected in most industries, usually top-right, despite AGG anti-discrimination law.",
      "Signature and date at the bottom are traditional; many hiring managers still look for them.",
      "German roles often require a German-language CV unless the posting is in English.",
    ],
    dos: ["Use DD.MM.YYYY throughout", "Attach certificates (Zeugnisse) as a package", "Include nationality and work permit status", "Keep gaps explained — they're scrutinized"],
    donts: ["Skip the photo in conservative industries", "Exceed two pages", "Use a loose narrative CV", "Forget the signature line"],
    summary: "Germany's Lebenslauf is a structured, tabular document that traditionally carries a professional photo, signature and full certificates package. Dates use DD.MM.YYYY and employment gaps are examined closely.",
  },
  {
    code: "fr", name: "France", docName: "CV", pages: "1 page ideal", photo: "Optional",
    dateFormat: "MM/YYYY", phoneExample: "+33 6 12 34 56 78", paper: "A4",
    tips: [
      "One page is a hard norm — even senior candidates compress to one, sometimes at the cost of detail.",
      "A photo is common and rarely penalized, though increasingly optional in multinationals.",
      "A 'Centres d'intérêt' (interests) section is genuinely read; generic hobbies hurt.",
      "Language fluency uses the CEFR scale (B2, C1) — state levels precisely.",
    ],
    dos: ["State language levels as CEFR grades", "Include age or birth date — it's normal", "Name hobbies specifically (trail running > sports)", "Send as PDF named 'CV_Prenom_Nom.pdf'"],
    donts: ["Write two pages — it breaks the norm", "Skip the interests section", "Use vague language levels ('fluent')", "Forget the photo in client-facing roles"],
    atsNote: "Large French corporates (CAC 40) screen via ATS; keep one column and standard section names.",
    summary: "The French CV is a strict one-pager where a photo remains common, personal details like age are normal, and CEFR language grades are expected. Interests are read as seriously as experience.",
  },
  {
    code: "nl", name: "Netherlands", docName: "CV", pages: "1–2 pages", photo: "Optional",
    dateFormat: "MM/YYYY", phoneExample: "+31 6 12345678", paper: "A4",
    atsNote: "Randstad-era corporates use ATS heavily; Dutch or English CV depends on the posting language.",
    tips: [
      "Dutch CVs are sober and factual — modesty is valued; overselling reads as untrustworthy.",
      "Birth date and nationality are commonly included and legally fine.",
      "English CVs are standard at international firms; match the posting's language.",
      "A short personal profile (profiel) of 3 lines is appreciated at the top.",
    ],
    dos: ["Mirror the posting's language", "Keep design minimal and clean", "Include DOB and nationality", "Add a 3-line profile summary"],
    donts: ["Overuse superlatives", "Add flashy graphics", "Exceed two pages", "Ignore the Dutch directness — be specific"],
    summary: "Dutch CVs are concise, factual documents of one to two pages with an understated tone. Personal details like birth date are normal, and the CV's language should mirror the job posting.",
  },
  {
    code: "es", name: "Spain", docName: "Currículum", pages: "1–2 pages", photo: "Expected",
    dateFormat: "MM/YYYY", phoneExample: "+34 612 34 56 78", paper: "A4",
    atsNote: "IBEX companies use ATS; regional language skills (Catalan, Basque) are searchable keywords.",
    tips: [
      "A photo is standard in Spain and omitting one can feel incomplete to traditional employers.",
      "Include DNI/NIE status or work authorization for non-EU candidates.",
      "Regional languages (Català, Euskera, Galego) matter hugely for Catalonia and Basque Country roles.",
      "The Europass format is recognized but a clean custom CV usually performs better.",
    ],
    dos: ["Attach a professional photo", "State regional language levels", "Include nationality and work permit", "Keep to two pages maximum"],
    donts: ["Default to Europass for private sector", "Skip the photo", "Ignore regional language requirements", "Use an overly dense layout"],
    summary: "Spain expects a 1–2 page currículum with a professional photo and clear work-authorization status. Regional languages are a genuine differentiator, especially in Catalonia and the Basque Country.",
  },
  {
    code: "ae", name: "United Arab Emirates", docName: "CV", pages: "2 pages", photo: "Expected",
    dateFormat: "MM/YYYY", phoneExample: "+971 50 123 4567", paper: "A4",
    atsNote: "Multinationals in DIFC/ADGM use ATS; personal details remain common in local firms.",
    tips: [
      "Personal details (nationality, visa status, sometimes marital status) are routinely expected.",
      "State current location and notice period — employers plan around visa transfer timelines.",
      "A professional photo is widely included without stigma.",
      "Driving licence status is asked for field roles; mention it if held.",
    ],
    dos: ["State visa status and notice period", "Include nationality", "Add a photo", "Note UAE driving licence for field roles"],
    donts: ["Hide your current emirate", "Ignore Arabic as an asset — list it", "Use a one-page US style", "Omit LinkedIn — recruiters here live on it"],
    summary: "UAE CVs run two pages and traditionally include a photo, nationality and visa status. Notice period and current emirate are practical must-haves because employers plan around visa transfers.",
  },
  {
    code: "sa", name: "Saudi Arabia", docName: "CV", pages: "2 pages", photo: "Expected",
    dateFormat: "MM/YYYY", phoneExample: "+966 50 123 4567", paper: "A4",
    atsNote: "Vision 2030-era giga-projects (NEOM, Red Sea) use modern ATS; multilingual CVs help.",
    tips: [
      "Include nationality and iqama/visa status; Saudization (Nitaqat) affects who can be hired for which roles.",
      "Arabic fluency is a strong differentiator even where postings are in English.",
      "Giga-project roles expect relocation readiness — state it explicitly.",
      "A photo and personal details remain standard in local companies.",
    ],
    dos: ["State iqama transferability", "List Arabic level honestly", "Mention relocation readiness", "Tailor for project-based timelines"],
    donts: ["Ignore Saudization context", "Omit nationality", "Use Western minimalism only", "Skip LinkedIn — Gulf recruiters use it heavily"],
    summary: "Saudi CVs include personal details and a photo, with iqama and nationality status stated upfront due to Saudization rules. Vision 2030 giga-projects increasingly screen via modern ATS and value relocation-ready, bilingual candidates.",
  },
  {
    code: "pk", name: "Pakistan", docName: "CV / Resume", pages: "1–2 pages", photo: "Optional",
    dateFormat: "DD/MM/YYYY or MM/YYYY", phoneExample: "+92 300 1234567", paper: "A4",
    atsNote: "Multinationals and software houses use ATS (Workable, Lever); local firms still screen manually via email.",
    tips: [
      "For local firms, a 2-page CV with a photo and personal details (CNIC status, domicile) is still common and accepted.",
      "For software houses and multinationals (Jazz, Telenor, Systems Ltd), switch to a US-style one-page, no-photo resume.",
      "List both phone and WhatsApp — recruiters routinely initiate contact on WhatsApp.",
      "Matric/Intermediate board scores are still expected for fresh graduates; drop them after 2–3 years of experience.",
    ],
    dos: ["Match format to employer type", "Include WhatsApp number", "Add domicile/city clearly — local hiring is city-bound", "List FYP/internships prominently as a fresh grad"],
    donts: ["Send a 5-page CV to a software house", "Omit expected salary when asked — it's commonly requested", "Ignore cover-letter norms for government jobs", "Use only a landline number"],
    summary: "Pakistan runs two formats in parallel: traditional 2-page CVs with photos and personal details for local industry, and US-style one-page resumes for tech and multinationals. WhatsApp contact details and city/domicile are practical essentials.",
  },
  {
    code: "in", name: "India", docName: "Resume / Biodata", pages: "1–2 pages", photo: "Optional",
    dateFormat: "MM/YYYY", phoneExample: "+91 98765 43210", paper: "A4",
    atsNote: "Naukri, LinkedIn and iIMJobs dominate; ATS parsing of uploaded resumes is aggressive — keep formatting plain.",
    tips: [
      "Naukri profile completeness drives recruiter calls as much as the resume itself — keep both in sync.",
      "For campus and early roles, 10th/12th board percentages are still expected; phase them out after ~3 years.",
      "Notice period is the most-asked field in Indian hiring — state it (e.g. '60 days, negotiable').",
      "Tech roles: link GitHub and mention exact stacks; service companies keyword-match resumes at scale.",
    ],
    dos: ["State notice period and current/expected CTC when asked", "Sync the Naukri headline with your resume", "List exact tech stack or domain skills", "Add a passport-size photo only for client-facing roles"],
    donts: ["Exceed two pages", "Write 'biodata' for corporate roles — it signals matrimonial format", "Omit graduation year (it's expected)", "Ignore LinkedIn Easy-Apply optimization"],
    summary: "Indian hiring is portal-driven (Naukri, iIMJobs, LinkedIn), so keyword-dense plain formatting wins. Notice period and CTC expectations are standard fields, board marks appear early-career, and the resume must mirror the online profile.",
  },
  {
    code: "sg", name: "Singapore", docName: "Resume", pages: "2 pages", photo: "Optional",
    dateFormat: "MM/YYYY", phoneExample: "+65 8123 4567", paper: "A4",
    atsNote: "MNC-heavy market uses ATS; MOM work-pass requirements shape what employers can offer.",
    tips: [
      "State citizenship/PR/work-pass status explicitly — it determines whether an employer can even interview you.",
      "National Service (for male citizens/PRs) is commonly listed; completion is expected.",
      "Expected salary is often requested in applications; quote a researched range.",
      "Bilingual (English + Mandarin/Malay/Tamil) ability is a genuine differentiator for regional roles.",
    ],
    dos: ["Lead with work-pass status", "Include NS completion for citizens", "Quote expected salary when asked", "Highlight regional (SEA) exposure"],
    donts: ["Hide current pass expiry", "Exceed two pages", "Use elaborate graphics", "Ignore the bilingual angle"],
    summary: "Singapore's two-page resume leads with work-pass and citizenship status because Ministry of Manpower rules constrain hiring. NS completion, expected salary and bilingual skills are standard differentiators in this MNC-dense market.",
  },
  {
    code: "jp", name: "Japan", docName: "Rirekisho / 履歴書", pages: "Fixed template", photo: "Required",
    dateFormat: "YYYY年MM月", phoneExample: "+81 90-1234-5678", paper: "A4 / B5",
    atsNote: "Foreign firms use ATS; traditional Japanese firms still expect the handwritten-style rirekisho plus shokumu-keirekisho.",
    tips: [
      "The rirekisho is a fixed-format document — buy the template at a konbini or download the JIS standard.",
      "A 3×4cm formal photo is mandatory; studio-quality headshots are the norm.",
      "For experienced hires, pair it with a shokumu-keirekisho (職務経歴書) — the free-form work history.",
      "Foreign companies accept Western resumes; gauge by the posting's language.",
    ],
    dos: ["Use the standard rirekisho template", "Attach a studio photo", "Write a shokumu-keirekisho for experience", "State JLPT level for Japanese ability"],
    donts: ["Free-form a rirekisho", "Skip the photo", "Ignore keigo in the self-introduction line", "Omit commute time — it's genuinely asked"],
    summary: "Japan's traditional hiring uses the fixed-format rirekisho with a mandatory photo, paired with a free-form shokumu-keirekisho for experienced candidates. Foreign firms accept Western resumes, so read the posting's language as the cue.",
  },
  {
    code: "za", name: "South Africa", docName: "CV", pages: "2–3 pages", photo: "Never",
    dateFormat: "MM/YYYY", phoneExample: "+27 82 123 4567", paper: "A4",
    atsNote: "Large corporates and banks use ATS; EE/B-BBEE status fields appear in formal applications.",
    tips: [
      "CVs run longer (2–3 pages) and include more personal detail than US resumes — but never a photo.",
      "Employment equity (EE) status is requested on formal applications and is legally standard.",
      "Include ID/work-permit status; employers must verify eligibility.",
      "Drivers' licence and own transport are commonly listed and genuinely matter for many roles.",
    ],
    dos: ["State citizenship or work permit", "Include matric and tertiary results early-career", "List licence code (e.g. Code B/EB)", "Note EE status when the form asks"],
    donts: ["Add a photo — it's not the norm", "Omit references (they're checked early)", "Understate community involvement", "Use one-page brevity"],
    summary: "South African CVs are fuller documents of 2–3 pages with personal status fields (citizenship, EE status, licence) that formal applications require. Photos are not used, and references are checked early in the process.",
  },
  {
    code: "br", name: "Brazil", docName: "Currículo", pages: "1–2 pages", photo: "Optional",
    dateFormat: "MM/YYYY", phoneExample: "+55 11 91234-5678", paper: "A4",
    atsNote: "Large Brazilian firms and multinationals use ATS; Gupy and similar platforms dominate applications.",
    tips: [
      "Applications flow through platforms like Gupy — plain formatting survives their parsers best.",
      "A photo is acceptable and common, especially for commercial roles, but optional in tech.",
      "Include CPF only when the platform asks; it's sensitive personal data.",
      "English fluency levels are prized — state them using the CEFR scale.",
    ],
    dos: ["Optimize for Gupy-style parsers", "State English level (CEFR)", "Include city/state — hiring is regional", "Add a WhatsApp number"],
    donts: ["Send photo-heavy PDFs to tech firms", "Share CPF unprompted", "Exceed two pages", "Skip the pretensão salarial when asked"],
    summary: "Brazilian currículos pass through application platforms like Gupy, so parser-friendly formatting matters. A photo remains optional-but-common, CEFR English levels are valued, and regional location shapes hiring decisions.",
  },
];

export const getCountry = (code: string) => COUNTRIES.find((c) => c.code === code);
