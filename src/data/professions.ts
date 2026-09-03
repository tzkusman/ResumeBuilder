export interface ProfessionXp {
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
}

export interface Profession {
  slug: string;
  title: string;
  category: string;
  salary: string;
  demand: "High" | "Very High" | "Steady";
  blurb: string;
  summary: string;
  skills: string[];
  experience: ProfessionXp[];
  education: { degree: string; school: string; year: string };
  certifications: string[];
  tips: string[];
  keywords: string[];
}

export const PROFESSIONS: Profession[] = [
  {
    slug: "teacher",
    title: "Elementary School Teacher",
    category: "Education",
    salary: "$48,000 – $72,000",
    demand: "Steady",
    blurb: "Schools screen teacher resumes for licensure, grade-level experience and measurable student outcomes. Lead with classroom impact, not duties.",
    summary: "State-licensed Elementary Educator with 6 years of experience raising reading proficiency across Title I classrooms. Skilled in differentiated instruction, IEP collaboration and family engagement that lifted parent-teacher conference participation to 94%.",
    skills: ["Classroom Management", "Differentiated Instruction", "IEP & 504 Plans", "Guided Reading", "Curriculum Mapping", "Google Classroom", "SEL Programs", "Data-Driven Instruction"],
    experience: [
      {
        role: "3rd Grade Teacher", company: "Maplewood Elementary", location: "Columbus, OH", start: "Aug 2021", end: "Present",
        bullets: [
          "Raised cohort reading proficiency from 61% to 83% in two years using guided reading blocks and weekly fluency data.",
          "Managed a 24-student inclusive classroom with 5 IEP students, co-teaching with intervention specialists 3 days per week.",
          "Cut behavioral incidents 40% by implementing a restorative SEL morning routine adopted by 6 other classrooms.",
        ],
      },
      {
        role: "1st Grade Teacher", company: "Brightside Academy", location: "Dayton, OH", start: "Aug 2018", end: "Jun 2021",
        bullets: [
          "Onboarded 120+ early readers; 88% exited the year at or above benchmark on DIBELS.",
          "Built a take-home literacy kit program that grew family reading nights from 12 to 60 attendees.",
          "Mentored 2 student teachers per year, both hired full-time within 6 months of graduation.",
        ],
      },
    ],
    education: { degree: "M.Ed., Elementary Education", school: "Ohio State University", year: "2018" },
    certifications: ["Ohio Resident Educator License (Grades 1–8)", "Orton-Gillingham Level 1 (2022)"],
    tips: [
      "Put your license and grade-band endorsement in the very first line — principals scan for it in 5 seconds.",
      "Quantify student outcomes: proficiency gains, benchmark scores, attendance — 'taught reading' says nothing.",
      "Name the exact programs you run (DIBELS, Fountas & Pinnell, Restorative Practices); districts search these terms in their ATS.",
      "Mention IEP/504 collaboration explicitly — inclusive-classroom experience is a top interview filter.",
    ],
    keywords: ["resume for teachers", "teacher CV example", "elementary teacher resume objectives"],
  },
  {
    slug: "registered-nurse",
    title: "Registered Nurse",
    category: "Healthcare",
    salary: "$72,000 – $98,000",
    demand: "Very High",
    blurb: "Hiring managers and nurse recruiters scan for licensure, unit type, patient ratios and certifications. Structure beats narrative every time.",
    summary: "Med-Surg Registered Nurse with 5 years of acute-care experience across 32-bed telemetry units. CCRN-prepared with strong sepsis-protocol compliance, patient education and precepting record; zero medication errors across 40,000+ administered doses.",
    skills: ["Med-Surg / Telemetry", "IV Therapy & Phlebotomy", "Epic EHR", "Sepsis & Fall Protocols", "Patient Education", "Wound Care", "BLS / ACLS", "Care Coordination"],
    experience: [
      {
        role: "Registered Nurse — Med-Surg", company: "St. Vincent Medical Center", location: "Toledo, OH", start: "Jun 2021", end: "Present",
        bullets: [
          "Deliver direct care for 5–6 patients per shift on a 32-bed telemetry unit with 98% charting accuracy in Epic.",
          "Cut catheter-associated UTIs 28% on the unit by championing a nurse-driven CAUTI bundle over 12 months.",
          "Precept 2 new graduates per cohort; both retained at 18 months versus a 54% unit average.",
        ],
      },
      {
        role: "Registered Nurse — Rehab", company: "ProMedica Home Health", location: "Toledo, OH", start: "Jul 2019", end: "May 2021",
        bullets: [
          "Managed a 9-patient daily caseload with 100% OASIS documentation completed within 24 hours.",
          "Reduced 30-day readmissions for assigned panel by 17% through structured discharge teach-backs.",
          "Earned Employee of the Quarter (Q3 2020) for PPE protocol leadership during surge staffing.",
        ],
      },
    ],
    education: { degree: "B.S.N., Nursing", school: "University of Toledo", year: "2019" },
    certifications: ["RN License — Ohio #RN.412208", "BLS & ACLS (AHA)", "NIH Stroke Scale Certification"],
    tips: [
      "Lead every section with hard credentials: RN license number, BSN, BLS/ACLS — recruiters verify these first.",
      "State unit type, bed count and patient ratio — '5–6 patients on 32-bed telemetry' signals real acuity.",
      "Use compliance language (CAUTI, CLABSI, HCAHPS, OASIS); hospital ATS filters are built around them.",
      "Never list 'responsible for patient care' — replace with volume: meds administered, admissions, discharges per shift.",
    ],
    keywords: ["nurse resume example", "RN resume no experience", "new grad nurse resume"],
  },
  {
    slug: "software-engineer",
    title: "Software Engineer",
    category: "Technology",
    salary: "$95,000 – $150,000",
    demand: "Very High",
    blurb: "Tech resumes get parsed before a human ever reads them. Ship metrics — latency, uptime, users — not technology laundry lists.",
    summary: "Full-stack Software Engineer with 5 years building high-throughput web platforms in React and Go. Shipped a checkout rebuild that lifted conversion 11% and cut p95 latency from 840ms to 210ms; mentors a team of 4 and owns CI/CD for 30+ services.",
    skills: ["TypeScript / React", "Go & Node.js", "PostgreSQL", "AWS (Lambda, ECS, RDS)", "Docker & Terraform", "CI/CD (GitHub Actions)", "System Design", "Observability (Grafana)"],
    experience: [
      {
        role: "Software Engineer II", company: "Northwind Labs", location: "Remote", start: "Mar 2022", end: "Present",
        bullets: [
          "Rebuilt checkout flow in React + Go, lifting conversion 11% and cutting p95 latency from 840ms to 210ms.",
          "Designed an event-driven pricing service processing 2.1M events/day with zero downtime over 14 months.",
          "Introduced trunk-based CI with canary deploys, halving release lead time from 6 days to 3.",
        ],
      },
      {
        role: "Software Engineer", company: "Brightpath Software", location: "Austin, TX", start: "Jul 2019", end: "Feb 2022",
        bullets: [
          "Shipped a customer analytics dashboard used by 4,000+ accounts, driving a 19% drop in support tickets.",
          "Migrated 12 services from EC2 to ECS Fargate, cutting monthly infra spend by $9,400.",
          "Mentored 3 junior engineers through a structured RFC process still in use company-wide.",
        ],
      },
    ],
    education: { degree: "B.S., Computer Science", school: "University of Texas at Austin", year: "2019" },
    certifications: ["AWS Certified Developer – Associate (2023)", "CKA — Certified Kubernetes Administrator (2024)"],
    tips: [
      "Mirror the stack in the job post — recruiters search 'React' or 'Go', they rarely search 'frontend guru'.",
      "Every bullet needs a number: latency, users, dollars, percent. 'Improved performance' is invisible to ATS and humans alike.",
      "Keep it one column, standard headings, no icons or skill bars — parsing engines shred fancy layouts.",
      "Link a live GitHub or project URL; for career-switchers, two solid repos outweigh a thin job history.",
    ],
    keywords: ["software engineer resume example", "developer CV", "backend engineer resume"],
  },
  {
    slug: "accountant",
    title: "Accountant",
    category: "Finance",
    salary: "$62,000 – $88,000",
    demand: "Steady",
    blurb: "Accounting recruiters scan for CPA status, ERP fluency and close-cycle speed. Prove accuracy with volumes and error rates.",
    summary: "CPA-track Staff Accountant with 4 years managing full-cycle AP/AR and month-end close for a $60M manufacturing group. Cut close from 12 to 7 business days and cleared a 3-year reconciliation backlog of 1,400+ items with zero audit adjustments.",
    skills: ["GAAP & Month-End Close", "NetSuite / QuickBooks", "Accounts Payable & Receivable", "Bank & GL Reconciliation", "Excel (Power Query)", "Cost Accounting", "Audit Support", "Sales & Use Tax"],
    experience: [
      {
        role: "Staff Accountant", company: "Ironwood Manufacturing", location: "Grand Rapids, MI", start: "May 2022", end: "Present",
        bullets: [
          "Own month-end close for 3 entities; reduced cycle from 12 to 7 business days via checklist automation.",
          "Reconciled 1,400+ legacy AP/AR items, clearing a 3-year backlog ahead of the 2024 external audit.",
          "Automated bank recs with Excel Power Query, saving 9 hours per close with zero variances over 8 months.",
        ],
      },
      {
        role: "Accounts Payable Specialist", company: "Lakeside Distribution", location: "Grand Rapids, MI", start: "Jun 2020", end: "Apr 2022",
        bullets: [
          "Processed 600+ invoices monthly at 99.4% accuracy; negotiated 2% early-pay terms with 14 vendors.",
          "Cut duplicate payments to zero by instituting a three-way match control across 3 warehouses.",
          "Onboarded NetSuite AP module for 22 users, authoring the SOP manual still in use.",
        ],
      },
    ],
    education: { degree: "B.S., Accounting", school: "Grand Valley State University", year: "2020" },
    certifications: ["CPA Exam — 3 of 4 sections passed", "QuickBooks Online ProAdvisor"],
    tips: [
      "State CPA status precisely — 'CPA', 'CPA candidate, 3/4 sections' — it's the single biggest filter in accounting hiring.",
      "Name your ERPs (NetSuite, SAP, QuickBooks) exactly as spelled in the posting; ATS matches string-for-string.",
      "Quantify close speed and reconciliation volume; 'reduced close by 5 days' outperforms 'assisted with close'.",
      "Mention audit support explicitly — firms staff audit season from candidates who've lived it.",
    ],
    keywords: ["accountant resume example", "staff accountant CV", "CPA resume"],
  },
  {
    slug: "sales-manager",
    title: "Sales Manager",
    category: "Sales",
    salary: "$85,000 – $140,000 + commission",
    demand: "High",
    blurb: "Sales leadership resumes live and die on quota math. Show attainment, ramp time and rep development in plain numbers.",
    summary: "Sales Manager with 7 years in B2B SaaS, currently leading a 9-rep team at 118% of annual quota. Built a ramp program that took new AEs to full quota in 90 days (previously 150) and grew territory revenue from $1.8M to $4.6M in three years.",
    skills: ["Pipeline Management", "Salesforce CRM", "Forecasting & QBRs", "Meddic / Challenger", "Hiring & Ramp", "Negotiation", "Territory Planning", "Gong Conversation Intel"],
    experience: [
      {
        role: "Regional Sales Manager", company: "Cascade Software", location: "Denver, CO", start: "Jan 2022", end: "Present",
        bullets: [
          "Lead a 9-AE team at 118% of $4.2M annual quota; 7 of 9 reps finished 2024 at or above plan.",
          "Grew territory revenue from $1.8M to $4.6M in 3 years by rebuilding vertical-focused prospecting.",
          "Cut new-AE ramp from 150 to 90 days with a structured certification program now used company-wide.",
        ],
      },
      {
        role: "Senior Account Executive", company: "Cascade Software", location: "Denver, CO", start: "Mar 2019", end: "Dec 2021",
        bullets: [
          "Closed $1.9M in new-logo ARR in 2021 at 132% of quota — top AE in a 40-person org.",
          "Landed 3 enterprise accounts ($250K+ ACV) through multi-threaded Meddic deals.",
          "Mentored 4 AEs promoted within 18 months; ran the team's weekly deal-review clinic.",
        ],
      },
    ],
    education: { degree: "B.A., Business Administration", school: "University of Colorado Boulder", year: "2016" },
    certifications: ["Challenger Certified Coach", "Salesforce Administrator Associate"],
    tips: [
      "Lead with attainment: '118% of $4.2M quota' — percentages without dollar context read as spin.",
      "Show rep outcomes, not just personal numbers: promotions, quota attainment distribution, ramp time.",
      "Name your methodology (MEDDIC, Challenger, SPIN) — sales VPs literally grep resumes for these.",
      "Break revenue into new-logo vs. expansion; hiring managers price those skills differently.",
    ],
    keywords: ["sales manager resume", "sales director CV example", "SaaS sales resume"],
  },
  {
    slug: "marketing-manager",
    title: "Marketing Manager",
    category: "Marketing",
    salary: "$75,000 – $115,000",
    demand: "High",
    blurb: "Marketing hires are judged on CAC, pipeline and campaign math. Your resume should read like a growth report, not a mood board.",
    summary: "Growth-minded Marketing Manager with 6 years scaling demand programs across paid, lifecycle and SEO. Owns a $1.4M annual budget that produced 46% of company pipeline in 2024 while cutting blended CAC 31% year over year.",
    skills: ["Demand Generation", "Paid Social & Search", "HubSpot / Marketo", "SEO & Content Strategy", "Marketing Attribution", "GA4 & Looker", "CRO / A-B Testing", "Brand Campaigns"],
    experience: [
      {
        role: "Marketing Manager", company: "Fernwell Health", location: "Chicago, IL", start: "Feb 2022", end: "Present",
        bullets: [
          "Own $1.4M demand budget producing 46% of company pipeline; cut blended CAC 31% YoY via creative testing.",
          "Launched an SEO program that grew organic pipeline from 4% to 19% of total in 18 months.",
          "Rebuilt lifecycle flows in HubSpot, lifting trial-to-paid conversion from 9% to 14%.",
        ],
      },
      {
        role: "Digital Marketing Specialist", company: "Copperline Outfitters", location: "Chicago, IL", start: "Jun 2019", end: "Jan 2022",
        bullets: [
          "Scaled paid social from $20K to $90K monthly spend while holding ROAS above 3.8x.",
          "Ran 40+ A/B tests across PDP pages, lifting site-wide conversion rate from 1.9% to 2.7%.",
          "Grew email list from 30K to 110K with a quiz funnel that converted at 34%.",
        ],
      },
    ],
    education: { degree: "B.S., Marketing", school: "DePaul University", year: "2019" },
    certifications: ["Google Ads Search Certification", "HubSpot Content Marketing Certification"],
    tips: [
      "Put budget size and pipeline contribution in the first bullet — 'owns $1.4M budget, 46% of pipeline' is the whole story.",
      "Report CAC, ROAS, conversion rates — marketing directors audit these numbers in interviews.",
      "Separate channel wins (paid vs. SEO vs. lifecycle); generalist blurbs suggest you owned nothing.",
      "Link one campaign case study; a 2-minute teardown beats a page of adjectives.",
    ],
    keywords: ["marketing manager resume example", "digital marketing CV", "growth manager resume"],
  },
  {
    slug: "data-analyst",
    title: "Data Analyst",
    category: "Technology",
    salary: "$70,000 – $100,000",
    demand: "Very High",
    blurb: "Analyst resumes must show decisions you influenced, not dashboards you made. Pair every tool with the money it moved.",
    summary: "Data Analyst with 4 years turning messy operational data into decisions at a 3PL and a fintech. Built pricing dashboards that recovered $2.3M in under-billed freight and automated a reporting suite that returns 30 analyst-hours per month.",
    skills: ["SQL (PostgreSQL, BigQuery)", "Python (Pandas)", "Tableau / Looker", "dbt & Data Modeling", "A/B Test Analysis", "Excel / Google Sheets", "ETL Pipelines", "Stakeholder Storytelling"],
    experience: [
      {
        role: "Data Analyst", company: "Harbor Freight Logistics", location: "Newark, NJ", start: "Aug 2022", end: "Present",
        bullets: [
          "Built lane-level pricing dashboards in Looker that surfaced $2.3M in under-billed freight, recovered in 2 quarters.",
          "Modeled 40+ dbt tables powering exec scorecards; cut report build time from days to under an hour.",
          "Ran A/B analysis on routing rules, shifting 18% of volume to faster lanes and cutting late fees 22%.",
        ],
      },
      {
        role: "Junior Data Analyst", company: "Meridian Pay", location: "Jersey City, NJ", start: "Jun 2020", end: "Jul 2022",
        bullets: [
          "Automated a 12-report monthly suite in Python, returning 30 analyst-hours per month to ad-hoc work.",
          "Flagged a chargeback-pattern cluster saving an estimated $410K annually in fraud losses.",
          "Taught SQL office hours to 25 non-technical teammates; self-serve queries rose 3x.",
        ],
      },
    ],
    education: { degree: "B.S., Statistics", school: "Rutgers University", year: "2020" },
    certifications: ["Google Data Analytics Professional Certificate", "Tableau Desktop Specialist"],
    tips: [
      "Show the decision, then the tool: 'recovered $2.3M in under-billed freight with lane-level Looker dashboards'.",
      "List SQL first and name the dialect — BigQuery vs. T-SQL matters to hiring managers.",
      "Mention data modeling (dbt, star schema); it separates analysts from spreadsheet users.",
      "Include one experiment you analyzed — A/B test literacy is now table stakes even in ops teams.",
    ],
    keywords: ["data analyst resume example", "entry level data analyst CV", "SQL analyst resume"],
  },
  {
    slug: "customer-service",
    title: "Customer Service Representative",
    category: "Operations",
    salary: "$38,000 – $52,000",
    demand: "High",
    blurb: "Support hiring managers filter on volume, CSAT and de-escalation. Numbers from the queue beat 'great with people' every time.",
    summary: "Customer Service Representative with 4 years across high-volume phone, chat and email queues in telecom and e-commerce. Holds a 96% CSAT across 60+ weekly tickets and a personal first-contact resolution rate of 84% against a 71% team average.",
    skills: ["Zendesk & Intercom", "Phone / Chat / Email Support", "De-escalation", "CRM Data Entry (Salesforce)", "Order & Billing Systems", "Macros & Knowledge Base", "Multitasking Under SLA", "Spanish (Professional)"],
    experience: [
      {
        role: "Senior Customer Service Representative", company: "Voltstream Telecom", location: "Phoenix, AZ", start: "May 2022", end: "Present",
        bullets: [
          "Resolve 60+ tickets weekly across phone and chat with 96% CSAT — top decile of a 45-agent floor.",
          "Hold 84% first-contact resolution vs. 71% team average by building 14 shared macros adopted floor-wide.",
          "De-escalate billing disputes averaging $220, retaining 9 in 10 at-risk accounts in 2024.",
        ],
      },
      {
        role: "Support Associate", company: "Cartly E-Commerce", location: "Remote", start: "Jun 2020", end: "Apr 2022",
        bullets: [
          "Handled 45+ daily chat conversations during peak season with 92% SLA adherence.",
          "Wrote 20 help-center articles that deflected an estimated 800 tickets per month.",
          "Trained 12 new hires on Zendesk workflows; cohort ramp time dropped from 6 to 4 weeks.",
        ],
      },
    ],
    education: { degree: "A.A., Communications", school: "Phoenix College", year: "2020" },
    certifications: ["Zendesk Support Administrator", "HDI Customer Service Representative"],
    tips: [
      "State channel and volume: '60+ tickets weekly across phone and chat' — hiring managers staff by these numbers.",
      "CSAT and first-contact resolution are the two metrics recruiters search for; put them in your summary.",
      "Mention de-escalation with a dollar figure — retained revenue is the quiet superpower of support resumes.",
      "List the exact tools (Zendesk, Salesforce, Intercom); most screens filter on them before a human reads a line.",
    ],
    keywords: ["customer service resume example", "call center resume", "support representative CV"],
  },
  {
    slug: "project-manager",
    title: "Project Manager",
    category: "Operations",
    salary: "$78,000 – $112,000",
    demand: "High",
    blurb: "PM resumes are filtered on delivery: budgets held, timelines hit, stakeholders managed. Certifications open the door; outcomes keep it open.",
    summary: "PMP-certified Project Manager with 6 years delivering software and facilities projects from $150K to $8M. Delivered 14 of 15 programs on time and on budget, including a data-center migration completed 6 weeks early with zero client-facing downtime.",
    skills: ["Agile / Scrum & Waterfall", "Jira & MS Project", "Budget & Forecast Control", "Risk Registers", "Stakeholder Communication", "Vendor Management", "Raid Logs", "Change Control"],
    experience: [
      {
        role: "Project Manager", company: "Atlas Grid Systems", location: "Charlotte, NC", start: "Apr 2021", end: "Present",
        bullets: [
          "Delivered a $8M data-center migration 6 weeks early with zero client-facing downtime across 3 regions.",
          "Run a 6-project portfolio totaling $14M; 5 of 6 tracking at or under budget through Q3 2025.",
          "Introduced a vendor scorecard that cut average procurement cycle from 9 weeks to 4.",
        ],
      },
      {
        role: "Associate Project Manager", company: "Bluepeak Construction", location: "Raleigh, NC", start: "Jul 2018", end: "Mar 2021",
        bullets: [
          "Coordinated 30+ trade contractors across 4 simultaneous builds totaling $22M in contract value.",
          "Cut RFIs response time from 11 days to 4 by restructuring the submittal log workflow.",
          "Maintained a 98% on-time milestone rate across 2020 despite supply-chain disruptions.",
        ],
      },
    ],
    education: { degree: "B.S., Construction Management", school: "NC State University", year: "2018" },
    certifications: ["PMP (PMI, 2021)", "Certified ScrumMaster (CSM)"],
    tips: [
      "Quantify portfolio size: number of concurrent projects and total budget — '6 projects, $14M' signals scale.",
      "Lead outcomes with variance: '6 weeks early', 'under budget by 4%' — on-time alone is baseline.",
      "Name your methodology stack (Jira, MS Project, RAID logs); enterprise PMOs filter on tooling.",
      "PMP/CSM belong in the headline and the certifications section — many ATS screens require one or both.",
    ],
    keywords: ["project manager resume example", "PMP resume", "construction PM CV"],
  },
  {
    slug: "graphic-designer",
    title: "Graphic Designer",
    category: "Creative",
    salary: "$50,000 – $75,000",
    demand: "Steady",
    blurb: "Designers get hired on portfolios, but the resume still gets parsed. Pair every project with the result it shipped.",
    summary: "Brand-focused Graphic Designer with 5 years across agency and in-house teams. Led a rebrand that lifted retail sell-through 23%, shipped 140+ campaign assets per quarter, and built a design system that cut creative turnaround from 9 days to 3.",
    skills: ["Adobe CC (Ps, Ai, Id)", "Figma & Design Systems", "Brand Identity", "Packaging Design", "Motion (After Effects)", "Print Production", "Art Direction", "HTML/CSS Basics"],
    experience: [
      {
        role: "Senior Graphic Designer", company: "Prairie & Pine Studio", location: "Minneapolis, MN", start: "Sep 2021", end: "Present",
        bullets: [
          "Led rebrand for a 60-SKU CPG client; new packaging lifted retail sell-through 23% in the first quarter.",
          "Built a 120-component Figma design system, cutting campaign creative turnaround from 9 days to 3.",
          "Art-direct a 3-person production pod delivering 140+ assets per quarter across 8 accounts.",
        ],
      },
      {
        role: "Graphic Designer", company: "Northgate Agency", location: "St. Paul, MN", start: "Jun 2019", end: "Aug 2021",
        bullets: [
          "Designed 300+ digital and print assets; 96% approved on first or second round of client review.",
          "Introduced motion templates in After Effects, adding a $180K/year service line to the agency.",
          "Managed print vendors end-to-end, holding color consistency across 40 annual print runs.",
        ],
      },
    ],
    education: { degree: "B.F.A., Graphic Design", school: "Minneapolis College of Art & Design", year: "2019" },
    certifications: ["Adobe Certified Professional — Illustrator", "Figma Advanced Components Workshop"],
    tips: [
      "The resume carries one job: get the portfolio clicked. Put the portfolio URL in the header, not buried below.",
      "Attach outcomes to aesthetics: 'rebrand lifted sell-through 23%' beats 'led visual refresh'.",
      "List production reality — print specs, vendor management, asset volume — studios hire for throughput.",
      "Keep the resume itself single-column and black-on-white; a loud resume suggests you can't follow a brand system.",
    ],
    keywords: ["graphic designer resume example", "designer CV no experience", "visual designer resume"],
  },
  {
    slug: "electrician",
    title: "Electrician",
    category: "Skilled Trades",
    salary: "$55,000 – $82,000",
    demand: "Very High",
    blurb: "Trade employers scan for license class, code knowledge and safety record. Certifications up top, voltage and scope in bullets.",
    summary: "Journeyman Electrician with 7 years in commercial and light-industrial work, licensed in Ohio and Michigan. Wired 14 tenant build-outs up to 480V three-phase with zero recordable incidents across 9,000+ job hours and a 100% first-pass inspection rate.",
    skills: ["NEC Code Compliance", "480V Three-Phase Systems", "Conduit Bending & Routing", "Panel Upgrades & Switchgear", "Blueprint Reading", "Motor Controls & VFDs", "OSHA 30 Certified", "Troubleshooting & Test Instruments"],
    experience: [
      {
        role: "Journeyman Electrician", company: "Summit Power & Light", location: "Cleveland, OH", start: "Mar 2021", end: "Present",
        bullets: [
          "Lead wiring on commercial tenant build-outs up to 480V three-phase; 100% first-pass inspection rate in 2024.",
          "Troubleshot and repaired VFD motor-control failures, cutting average downtime from 2 days to 4 hours.",
          "Mentor 3 apprentices through NEC-based weekly code drills; 2 passed journeyman exams on first attempt.",
        ],
      },
      {
        role: "Apprentice Electrician", company: "Garrison Electric", location: "Toledo, OH", start: "Jun 2017", end: "Feb 2021",
        bullets: [
          "Completed 8,000 apprentice hours across 40+ residential and commercial sites with zero recordable incidents.",
          "Bent and installed 15,000+ feet of EMT and rigid conduit from blueprint layouts.",
          "Assisted panel upgrades (200A–800A) including service swaps on occupied buildings.",
        ],
      },
    ],
    education: { degree: "Electrical Apprenticeship — IBEW Local 110", school: "Joint Apprenticeship Training Committee", year: "2021" },
    certifications: ["Ohio Journeyman Electrician License", "OSHA 30 — Construction", "First Aid / CPR / AED"],
    tips: [
      "License class and state go in the first line — contractors filter on this before anything else.",
      "State voltage and scope: '480V three-phase, tenant build-outs' tells a foreman exactly where you fit.",
      "Safety record is currency: hours without an incident, OSHA 30, first-pass inspections.",
      "List test instruments and control systems (VFDs, PLCs) — diagnostic skill separates journeymen from helpers.",
    ],
    keywords: ["electrician resume example", "apprentice electrician CV", "journeyman resume"],
  },
  {
    slug: "pharmacist",
    title: "Pharmacist",
    category: "Healthcare",
    salary: "$115,000 – $145,000",
    demand: "High",
    blurb: "Pharmacy hiring is credential-first: PharmD, license number, immunization certification. Then prove accuracy and clinical interventions.",
    summary: "Licensed Staff Pharmacist (PharmD) with 5 years in high-volume retail and clinical settings. Verified 350+ prescriptions daily at 99.9% accuracy, led an immunization program that administered 4,200 vaccines in two seasons, and documented 300+ clinical interventions.",
    skills: ["Prescription Verification", "Immunization Delivery", "Med Therapy Management", "Epic / Rx30 Pharmacy Systems", "Clinical Interventions", "Inventory & P&L Oversight", "HIPAA & DEA Compliance", "Patient Counseling"],
    experience: [
      {
        role: "Staff Pharmacist", company: "Lakeview Pharmacy Group", location: "Milwaukee, WI", start: "Jul 2021", end: "Present",
        bullets: [
          "Verify 350+ prescriptions daily with 99.9% accuracy; zero dispensing errors reported in 3 years.",
          "Administered 4,200 immunizations across two flu seasons, growing program revenue 38%.",
          "Documented 300+ clinical interventions (dosing, interactions), accepted by prescribers at a 92% rate.",
        ],
      },
      {
        role: "Pharmacy Intern → Staff Pharmacist", company: "Mercy Hospital Outpatient", location: "Milwaukee, WI", start: "Jun 2019", end: "Jun 2021",
        bullets: [
          "Supported anticoagulation clinic managing 180 active warfarin patients at target INR 71% of the time.",
          "Reconciled medications for 40+ admissions weekly, flagging 3–5 clinically significant interactions per week.",
          "Co-built a discharge counseling sheet adopted hospital-wide, cutting callback volume 18%.",
        ],
      },
    ],
    education: { degree: "PharmD", school: "University of Wisconsin–Madison", year: "2019" },
    certifications: ["Wisconsin Pharmacist License #PS40219", "APHA Immunization Delivery Certificate", "BLS (AHA)"],
    tips: [
      "License number and PharmD go above the fold — state boards and recruiters verify both immediately.",
      "Quantify verification volume and accuracy; dispensing error rate is the metric pharmacy managers fear.",
      "Immunization and MTM experience are revenue skills; put vaccine counts and program growth in numbers.",
      "Clinical interventions with acceptance rates show prescriber trust — the soft skill that's actually measurable.",
    ],
    keywords: ["pharmacist resume example", "staff pharmacist CV", "hospital pharmacist resume"],
  },
  {
    slug: "financial-analyst",
    title: "Financial Analyst",
    category: "Finance",
    salary: "$68,000 – $95,000",
    demand: "High",
    blurb: "Analyst screens look for modeling chops and variance ownership. Show the models you built and the decisions they changed.",
    summary: "Financial Analyst with 4 years in corporate FP&A supporting a $400M P&L. Built a driver-based operating model that cut budget cycle time 40%, and a weekly KPI pack that surfaced $1.6M in annualized cost savings within two quarters.",
    skills: ["Financial Modeling (Excel)", "FP&A & Budgeting", "Variance Analysis", "SQL & Tableau", "ERP Systems (Oracle)", "Scenario Planning", "Cash Flow Forecasting", "Board Reporting"],
    experience: [
      {
        role: "Financial Analyst", company: "Granite Foods Corp", location: "Cincinnati, OH", start: "Aug 2022", end: "Present",
        bullets: [
          "Support a $400M P&L with monthly variance commentary; 92% forecast accuracy on opex across 2024.",
          "Built a driver-based operating model that cut the annual budget cycle from 10 weeks to 6.",
          "Created a weekly KPI pack that surfaced $1.6M in annualized freight and packaging savings.",
        ],
      },
      {
        role: "Junior Financial Analyst", company: "Riverbend Logistics", location: "Cincinnati, OH", start: "Jun 2020", end: "Jul 2022",
        bullets: [
          "Automated 8 recurring reports with SQL + Tableau, saving the team 15 hours per month-end.",
          "Modeled lane profitability for 200+ routes, informing a repricing that lifted margin 1.8 points.",
          "Prepared quarterly board decks used by a 7-member board with zero restatements.",
        ],
      },
    ],
    education: { degree: "B.S., Finance", school: "University of Cincinnati", year: "2020" },
    certifications: ["CFA Level II Candidate", "FMVA — Corporate Finance Institute"],
    tips: [
      "Name the P&L you support — '$400M P&L, 92% forecast accuracy' sets seniority instantly.",
      "Show model outcomes: cycle time cut, savings surfaced, margin moved. Models without decisions are toys.",
      "SQL + Tableau now appear in half of analyst postings; list them even if Excel is your daily driver.",
      "CFA progress belongs in certifications — many screens filter on 'CFA Level I/II'.",
    ],
    keywords: ["financial analyst resume example", "FP&A resume", "entry level analyst CV"],
  },
  {
    slug: "hr-specialist",
    title: "HR Specialist",
    category: "Operations",
    salary: "$52,000 – $72,000",
    demand: "Steady",
    blurb: "HR resumes are filtered on HRIS fluency, cycle metrics and compliance scope. Time-to-fill and retention beats 'people person'.",
    summary: "HR Specialist with 5 years across recruiting and employee relations for a 600-employee manufacturing group. Cut time-to-fill from 52 to 31 days, onboarded 220+ hires at 96% 90-day retention, and ran compliance programs across 4 states with zero audit findings.",
    skills: ["Full-Cycle Recruiting", "Workday / BambooHR", "Onboarding Programs", "Employee Relations", "FMLA / ADA Compliance", "HRIS Reporting", "Compensation Benchmarking", "Multi-State Compliance"],
    experience: [
      {
        role: "HR Specialist", company: "Forge Industrial Group", location: "Pittsburgh, PA", start: "May 2022", end: "Present",
        bullets: [
          "Own full-cycle recruiting for 40+ hourly and salaried roles; cut time-to-fill from 52 to 31 days.",
          "Redesigned onboarding with hiring-manager SLAs, lifting 90-day retention from 84% to 96%.",
          "Manage FMLA/ADA caseload (30+ active) with zero compliance findings across 3 internal audits.",
        ],
      },
      {
        role: "HR Coordinator", company: "Allegheny Health Partners", location: "Pittsburgh, PA", start: "Jun 2019", end: "Apr 2022",
        bullets: [
          "Processed 500+ personnel actions annually in BambooHR with 99% data-audit accuracy.",
          "Coordinated benefits open enrollment for 450 employees, cutting ticket volume 30% via FAQ overhaul.",
          "Ran quarterly engagement surveys; action-planning participation grew from 55% to 81%.",
        ],
      },
    ],
    education: { degree: "B.S., Human Resource Management", school: "Penn State University", year: "2019" },
    certifications: ["SHRM-CP", "PHR (in progress, 2026)"],
    tips: [
      "Name your HRIS exactly (Workday, BambooHR, ADP) — it's the most-filtered string in HR job screens.",
      "Recruiting metrics first: time-to-fill, offer-accept rate, 90-day retention — these are your revenue numbers.",
      "Compliance scope matters: states covered, FMLA/ADA caseload, audit results. Zero findings is a brag.",
      "SHRM-CP/PHR in the headline — many coordinator-to-specialist screens require one or the other.",
    ],
    keywords: ["HR specialist resume example", "HR generalist CV", "recruiter resume"],
  },
  {
    slug: "mechanical-engineer",
    title: "Mechanical Engineer",
    category: "Engineering",
    salary: "$75,000 – $105,000",
    demand: "High",
    blurb: "Engineering screens parse for CAD tools, analysis methods and production impact. Tolerance stack-ups and cost-downs speak louder than course lists.",
    summary: "Mechanical Engineer with 5 years in automotive component design, from concept through PPAP. Led a bracket redesign cutting part cost 22% at 500K annual units, and owns GD&T tolerance studies that held 99.2% first-pass yield across 3 production programs.",
    skills: ["SolidWorks & CATIA", "GD&T / ASME Y14.5", "FEA (ANSYS)", "DFM / DFA", "Injection Molding & Casting", "PPAP / APQP", "Root Cause (8D, 5-Why)", "Cost Reduction Engineering"],
    experience: [
      {
        role: "Mechanical Engineer II", company: "Corvin Automotive", location: "Detroit, MI", start: "Jun 2021", end: "Present",
        bullets: [
          "Led a structural bracket redesign cutting part cost 22% at 500K annual units through wall-thickness optimization.",
          "Ran ANSYS fatigue studies that eliminated a field crack mode; warranty claims fell 61% year over year.",
          "Owned GD&T tolerance stacks across 3 programs, holding 99.2% first-pass yield at launch.",
        ],
      },
      {
        role: "Mechanical Engineer", company: "Delta Cooling Systems", location: "Ann Arbor, MI", start: "Jul 2019", end: "May 2021",
        bullets: [
          "Designed cooling manifolds for 2 EV programs from concept through PPAP in under 9 months.",
          "Cut prototype iteration cost 35% by shifting validation from physical builds to CFD pre-screening.",
          "Authored 40+ DFMEAs and led 8D closures on 12 supplier quality escapes.",
        ],
      },
    ],
    education: { degree: "B.S., Mechanical Engineering", school: "University of Michigan", year: "2019" },
    certifications: ["EIT — FE Mechanical (passed)", "Six Sigma Green Belt"],
    tips: [
      "CAD platform first (SolidWorks vs. CATIA vs. NX) — screening tools match the exact string.",
      "Show production scale: units per year, yield, warranty delta. Lab-only experience reads junior.",
      "Speak quality-system language — PPAP, APQP, DFMEA, 8D — automotive and med-device ATS demand it.",
      "FE/EIT status goes in certifications even if PE is years away; it's an explicit filter at many firms.",
    ],
    keywords: ["mechanical engineer resume example", "CAD engineer CV", "entry level engineer resume"],
  },
  {
    slug: "web-developer",
    title: "Web Developer",
    category: "Technology",
    salary: "$65,000 – $98,000",
    demand: "High",
    blurb: "Web developer resumes compete on shipped sites and Core Web Vitals. Link the work, then quantify speed, traffic and conversion.",
    summary: "Front-end Web Developer with 4 years building accessible, high-performance marketing sites and web apps in React and WordPress. Shipped a storefront rebuild that lifted mobile conversion 18% and holds Lighthouse performance above 95 at 2M monthly visits.",
    skills: ["HTML / CSS / JavaScript", "React & Next.js", "WordPress & PHP", "Tailwind CSS", "Web Performance (CWV)", "WCAG 2.1 Accessibility", "REST & GraphQL APIs", "Git & CI Pipelines"],
    experience: [
      {
        role: "Web Developer", company: "Harvest Digital Agency", location: "Portland, OR", start: "Apr 2022", end: "Present",
        bullets: [
          "Rebuilt a 2M-visit storefront in Next.js; mobile conversion up 18%, LCP down from 4.1s to 1.3s.",
          "Delivered 14 client sites to WCAG 2.1 AA, including a university portal serving 30K students.",
          "Created a reusable component library cutting average build time from 6 weeks to 3.",
        ],
      },
      {
        role: "Junior Web Developer", company: "Bluebird Nonprofit Tech", location: "Portland, OR", start: "Jul 2020", end: "Mar 2022",
        bullets: [
          "Maintained 25 WordPress properties; plugin consolidation cut page weight 44% on average.",
          "Built a donation flow A/B test that raised average gift size 12% across 3 campaigns.",
          "Automated image pipelines (WebP + CDN), lifting median Lighthouse scores from 71 to 93.",
        ],
      },
    ],
    education: { degree: "A.S., Web Development", school: "Portland Community College", year: "2020" },
    certifications: ["freeCodeCamp Responsive Web Design", "W3C Accessibility Foundations"],
    tips: [
      "Link 2–3 live URLs in the header; recruiters click before they read, and dead links end interviews.",
      "Core Web Vitals numbers (LCP, CLS) are the modern proof of skill — put them in bullets.",
      "Accessibility (WCAG) experience is increasingly a hard requirement for public-sector and enterprise work.",
      "Show both agency breadth and one deep rebuild — '14 sites + one 2M-visit storefront' is a strong combo.",
    ],
    keywords: ["web developer resume example", "frontend developer CV", "wordpress developer resume"],
  },
  {
    slug: "administrative-assistant",
    title: "Administrative Assistant",
    category: "Operations",
    salary: "$42,000 – $58,000",
    demand: "Steady",
    blurb: "Admin screens filter on executive scope, tooling and calendar complexity. Executives supported, travel volume, systems mastered.",
    summary: "Executive Administrative Assistant with 6 years supporting C-suite leaders in legal and fintech settings. Manage calendars across 4 time zones for 3 executives, coordinate 60+ travel itineraries yearly, and run an e-filing overhaul that cut document retrieval time from 15 minutes to under 1.",
    skills: ["Executive Calendar Management", "Travel & Itinerary Planning", "Microsoft 365 & Outlook", "Expense Reporting (Concur)", "Meeting Minutes & Follow-ups", "Vendor Coordination", "Confidential Record-Keeping", "Event Planning"],
    experience: [
      {
        role: "Executive Assistant", company: "Meridian Law Group", location: "Boston, MA", start: "Feb 2021", end: "Present",
        bullets: [
          "Support 3 partners across 4 time zones; conflict-free scheduling for 1,100+ annual client meetings.",
          "Coordinate 60+ domestic and international itineraries yearly with zero missed connections or filings.",
          "Led an e-filing overhaul cutting document retrieval from 15 minutes to under 1 across 12 staff.",
        ],
      },
      {
        role: "Administrative Assistant", company: "Bayview Capital", location: "Boston, MA", start: "Jun 2018", end: "Jan 2021",
        bullets: [
          "Processed $2M+ in annual executive expenses through Concur with 100% policy compliance.",
          "Planned quarterly board meetings for 9 directors, including travel, materials and minute distribution.",
          "Maintained CRM data for 300+ client relationships; data-quality score rose from 82% to 97%.",
        ],
      },
    ],
    education: { degree: "A.S., Business Administration", school: "Bunker Hill Community College", year: "2018" },
    certifications: ["Microsoft 365 Fundamentals (MS-900)", "Certified Administrative Professional (in progress)"],
    tips: [
      "State who you support and how many: '3 partners, 4 time zones, 1,100 meetings' reads as executive-ready.",
      "Name the systems — Outlook, Concur, Salesforce, DocuSign — admin screens filter heavily on tooling.",
      "Quantify the invisible work: expenses processed, itineraries flown, retrieval time cut.",
      "Discretion is a keyword: mention confidential records, board materials, or privileged filings explicitly.",
    ],
    keywords: ["administrative assistant resume", "executive assistant CV example", "office admin resume"],
  },
  {
    slug: "social-worker",
    title: "Social Worker",
    category: "Healthcare",
    salary: "$50,000 – $68,000",
    demand: "High",
    blurb: "Agencies hire on licensure, caseload capacity and outcomes. Documented placements, assessments and crisis interventions matter most.",
    summary: "LMSW Case Management Social Worker with 5 years in hospital discharge planning and community mental health. Manage a 35-client caseload with 92% 90-day housing stability, completed 400+ biopsychosocial assessments, and coordinate care across 12 partner agencies.",
    skills: ["Case Management", "Crisis Intervention", "Biopsychosocial Assessments", "Motivational Interviewing", "EHR (Epic, Apricot)", "Discharge Planning", "Housing First Model", "Group Facilitation"],
    experience: [
      {
        role: "Medical Social Worker", company: "Riverview Health System", location: "St. Louis, MO", start: "Aug 2021", end: "Present",
        bullets: [
          "Manage discharge planning for a 28-bed unit, cutting average length of stay by 0.8 days in 2024.",
          "Complete 15–20 biopsychosocial assessments weekly with documentation audits at 98% compliance.",
          "Coordinate post-acute placements across 12 SNFs and home-health agencies at 94% acceptance rate.",
        ],
      },
      {
        role: "Case Manager", company: "Gateway Community Services", location: "St. Louis, MO", start: "Jun 2019", end: "Jul 2021",
        bullets: [
          "Carried a 35-client homeless-services caseload; 92% of housed clients stable at 90 days.",
          "Facilitated weekly DBT-informed skills groups with 78% average attendance over 18 months.",
          "Secured $210K in emergency rental assistance across 60 households during 2020–21.",
        ],
      },
    ],
    education: { degree: "M.S.W.", school: "Washington University in St. Louis", year: "2019" },
    certifications: ["LMSW — Missouri", "Mental Health First Aid Instructor", "CPR / First Aid"],
    tips: [
      "Licensure level and state (LMSW, LCSW, LSW) headline the resume — agencies screen on it first.",
      "Caseload size with outcomes: '35 clients, 92% housing stability at 90 days' proves capacity and competence.",
      "Name assessment instruments and models you practice (biopsychosocial, Housing First, MI, DBT-informed).",
      "Quantify systems navigation — placements, agencies coordinated, benefits secured in dollars.",
    ],
    keywords: ["social worker resume example", "case manager CV", "LCSW resume"],
  },
  {
    slug: "chef",
    title: "Chef / Head Cook",
    category: "Hospitality",
    salary: "$45,000 – $70,000",
    demand: "High",
    blurb: "Kitchen hiring reads resumes for volume, food cost and leadership. Covers per night, menu engineering math and team retention.",
    summary: "Head Chef with 8 years across high-volume bistro and hotel kitchens, currently running a 140-cover nightly service with a 4-person line. Engineered a seasonal menu that cut food cost from 34% to 28% while lifting average check 15%, with zero health-code violations across 6 inspections.",
    skills: ["Menu Engineering", "Food Cost Control", "Line Leadership", "French & Mediterranean Cuisine", "HACCP / ServSafe", "Inventory & Ordering", "Butchery & Fabrication", "Private Events (200+)"],
    experience: [
      {
        role: "Head Chef", company: "Copper Table Bistro", location: "Nashville, TN", start: "May 2021", end: "Present",
        bullets: [
          "Run a 140-cover nightly service with a 4-person line; ticket times hold under 18 minutes at peak.",
          "Re-engineered the seasonal menu, cutting food cost from 34% to 28% and lifting average check 15%.",
          "Zero health-code violations across 6 inspections; instituted HACCP logs adopted by the owner's 2nd location.",
        ],
      },
      {
        role: "Sous Chef", company: "The Lenox Hotel", location: "Nashville, TN", start: "Jun 2017", end: "Apr 2021",
        bullets: [
          "Supervised banquet production for events up to 450 guests with on-time service on 100% of bookings.",
          "Trained and retained a 9-cook brigade; line turnover fell from 60% to 20% annually.",
          "Built prep pars and ordering sheets that cut weekly waste from $900 to $350.",
        ],
      },
    ],
    education: { degree: "A.O.S., Culinary Arts", school: "Culinary Institute of America (externship)", year: "2016" },
    certifications: ["ServSafe Manager", "TIPS Alcohol Awareness"],
    tips: [
      "Lead with volume: covers per night, banquet headcounts, ticket times — kitchens staff by throughput.",
      "Food-cost math is your P&L voice: '34% to 28% at same check average' gets owner calls back.",
      "Retention numbers signal leadership; chef turnover is the industry's quiet crisis.",
      "Name the cuisine and stations mastered; 'French & Mediterranean, garde manger through sauté' beats 'versatile'.",
    ],
    keywords: ["chef resume example", "line cook CV", "head chef resume"],
  },
  {
    slug: "truck-driver",
    title: "CDL Truck Driver",
    category: "Logistics",
    salary: "$60,000 – $90,000",
    demand: "Very High",
    blurb: "Carriers filter on CDL class, endorsements, miles and safety record. CSA score, clean MVR and on-time percentage get the call back.",
    summary: "Class A CDL Driver with 6 years of OTR and regional dry-van and reefer experience, 480K+ accident-free miles and a clean MVR. Run 2,800 miles weekly at a 99.1% on-time delivery rate with consistent top-10 fuel economy ranking among 120 drivers.",
    skills: ["Class A CDL (Hazmat & Tanker Endorsed)", "OTR & Regional Routes", "Reefer & Dry Van", "ELD / Hours of Service Compliance", "Pre/Post-Trip Inspections", "Load Securement", "Fuel-Efficient Driving", "Customer Delivery Communication"],
    experience: [
      {
        role: "OTR Truck Driver", company: "Redline Freightways", location: "Kansas City, MO", start: "Mar 2021", end: "Present",
        bullets: [
          "Average 2,800 miles weekly across 44-state OTR routes at a 99.1% on-time delivery rate.",
          "480K+ accident-free miles; zero CSA violations and a clean MVR across 6 years.",
          "Ranked top 10 of 120 drivers for fuel economy in 2024, saving the carrier an estimated $6,800.",
        ],
      },
      {
        role: "Regional Driver", company: "Prairie Carriers", location: "Des Moines, IA", start: "Jun 2019", end: "Feb 2021",
        bullets: [
          "Ran fixed Midwest reefer lanes with 100% temperature-log compliance across 340 loads.",
          "Completed 1,000+ pre/post-trip inspections with only 3 minor defects flagged by DOT spot checks.",
          "Maintained a 4.9/5 receiver rating for dock communication and load securement.",
        ],
      },
    ],
    education: { degree: "CDL Class A Training Program", school: "Iowa Truck Driving School", year: "2019" },
    certifications: ["Class A CDL — Iowa (Hazmat, Tanker)", "DOT Medical Card (current)", "TWIC Card"],
    tips: [
      "CDL class and endorsements go in line one — Hazmat and Tanker immediately widen your lane options.",
      "Safety is the whole interview: accident-free miles, CSA record, MVR status, DOT inspection results.",
      "State the miles: weekly average and lifetime totals. Dispatchers plan around your demonstrated range.",
      "On-time percentage and fuel-economy rankings are the productivity numbers carriers actually track.",
    ],
    keywords: ["truck driver resume example", "CDL driver CV", "OTR driver resume"],
  },
];

export const PROFESSION_CATEGORIES = [...new Set(PROFESSIONS.map((p) => p.category))];

export const getProfession = (slug: string) => PROFESSIONS.find((p) => p.slug === slug);
