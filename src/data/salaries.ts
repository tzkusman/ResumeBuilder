export interface SalaryBenchmark {
  roleSlug: string;
  title: string;
  category: "Engineering & Tech" | "Product & Design" | "Sales & Marketing" | "Finance & Accounting" | "Healthcare & Clinical" | "Operations & HR";
  description: string;
  nationalMedianUsd: number;
  levels: {
    level: "Entry-Level (0-2 yrs)" | "Mid-Level (3-5 yrs)" | "Senior (5-8 yrs)" | "Staff / Lead (8+ yrs)" | "Director / VP";
    baseP25: number;
    baseMedian: number;
    baseP75: number;
    baseP90: number;
    bonusPercent: number;
    equityAvgUsd: number;
  }[];
  skillPremiums: {
    skill: string;
    premiumPercent: number;
    impactDescription: string;
  }[];
  negotiationTips: string[];
  resumeExampleSlug: string;
}

export interface MetroLocation {
  city: string;
  country: string;
  currency: string;
  currencySymbol: string;
  exchangeRateFromUsd: number;
  costOfLivingIndex: number; // 100 = US national baseline
  salaryMultiplier: number;
  tier: "High-Cost Tech Hub" | "Major Metro" | "Emerging Market" | "International Hub";
}

export const METRO_LOCATIONS: MetroLocation[] = [
  { city: "San Francisco Bay Area", country: "United States", currency: "USD", currencySymbol: "$", exchangeRateFromUsd: 1.0, costOfLivingIndex: 180, salaryMultiplier: 1.25, tier: "High-Cost Tech Hub" },
  { city: "New York City, NY", country: "United States", currency: "USD", currencySymbol: "$", exchangeRateFromUsd: 1.0, costOfLivingIndex: 175, salaryMultiplier: 1.20, tier: "High-Cost Tech Hub" },
  { city: "Seattle, WA", country: "United States", currency: "USD", currencySymbol: "$", exchangeRateFromUsd: 1.0, costOfLivingIndex: 145, salaryMultiplier: 1.15, tier: "High-Cost Tech Hub" },
  { city: "Austin, TX", country: "United States", currency: "USD", currencySymbol: "$", exchangeRateFromUsd: 1.0, costOfLivingIndex: 110, salaryMultiplier: 1.05, tier: "Major Metro" },
  { city: "Boston, MA", country: "United States", currency: "USD", currencySymbol: "$", exchangeRateFromUsd: 1.0, costOfLivingIndex: 140, salaryMultiplier: 1.10, tier: "Major Metro" },
  { city: "Chicago, IL", country: "United States", currency: "USD", currencySymbol: "$", exchangeRateFromUsd: 1.0, costOfLivingIndex: 115, salaryMultiplier: 1.02, tier: "Major Metro" },
  { city: "Los Angeles, CA", country: "United States", currency: "USD", currencySymbol: "$", exchangeRateFromUsd: 1.0, costOfLivingIndex: 150, salaryMultiplier: 1.12, tier: "Major Metro" },
  { city: "Denver / Boulder, CO", country: "United States", currency: "USD", currencySymbol: "$", exchangeRateFromUsd: 1.0, costOfLivingIndex: 120, salaryMultiplier: 1.04, tier: "Major Metro" },
  { city: "US Remote / National Average", country: "United States", currency: "USD", currencySymbol: "$", exchangeRateFromUsd: 1.0, costOfLivingIndex: 100, salaryMultiplier: 1.00, tier: "Major Metro" },
  { city: "London", country: "United Kingdom", currency: "GBP", currencySymbol: "£", exchangeRateFromUsd: 0.78, costOfLivingIndex: 140, salaryMultiplier: 0.82, tier: "International Hub" },
  { city: "Toronto", country: "Canada", currency: "CAD", currencySymbol: "CA$", exchangeRateFromUsd: 1.36, costOfLivingIndex: 125, salaryMultiplier: 0.88, tier: "International Hub" },
  { city: "Vancouver", country: "Canada", currency: "CAD", currencySymbol: "CA$", exchangeRateFromUsd: 1.36, costOfLivingIndex: 130, salaryMultiplier: 0.86, tier: "International Hub" },
  { city: "Berlin", country: "Germany", currency: "EUR", currencySymbol: "€", exchangeRateFromUsd: 0.92, costOfLivingIndex: 115, salaryMultiplier: 0.78, tier: "International Hub" },
  { city: "Sydney", country: "Australia", currency: "AUD", currencySymbol: "A$", exchangeRateFromUsd: 1.52, costOfLivingIndex: 135, salaryMultiplier: 0.85, tier: "International Hub" },
  { city: "Singapore", country: "Singapore", currency: "SGD", currencySymbol: "S$", exchangeRateFromUsd: 1.34, costOfLivingIndex: 145, salaryMultiplier: 0.92, tier: "International Hub" },
  { city: "Dubai", country: "United Arab Emirates", currency: "AED", currencySymbol: "AED ", exchangeRateFromUsd: 3.67, costOfLivingIndex: 130, salaryMultiplier: 0.95, tier: "International Hub" }
];

export const SALARY_BENCHMARKS: SalaryBenchmark[] = [
  {
    roleSlug: "software-engineer",
    title: "Software Engineer / Full-Stack Developer",
    category: "Engineering & Tech",
    description: "Designs, codes, and maintains scalable backend services, web applications, and distributed systems.",
    nationalMedianUsd: 142000,
    levels: [
      { level: "Entry-Level (0-2 yrs)", baseP25: 85000, baseMedian: 98000, baseP75: 115000, baseP90: 128000, bonusPercent: 7, equityAvgUsd: 12000 },
      { level: "Mid-Level (3-5 yrs)", baseP25: 118000, baseMedian: 135000, baseP75: 155000, baseP90: 172000, bonusPercent: 10, equityAvgUsd: 28000 },
      { level: "Senior (5-8 yrs)", baseP25: 152000, baseMedian: 174000, baseP75: 202000, baseP90: 228000, bonusPercent: 15, equityAvgUsd: 65000 },
      { level: "Staff / Lead (8+ yrs)", baseP25: 195000, baseMedian: 225000, baseP75: 265000, baseP90: 310000, bonusPercent: 20, equityAvgUsd: 125000 },
      { level: "Director / VP", baseP25: 240000, baseMedian: 285000, baseP75: 340000, baseP90: 410000, bonusPercent: 30, equityAvgUsd: 220000 }
    ],
    skillPremiums: [
      { skill: "Distributed Systems & High Concurrency", premiumPercent: 18, impactDescription: "Engineers managing microservices and high TPS command higher tier bands." },
      { skill: "AWS / Cloud Infrastructure & Kubernetes", premiumPercent: 14, impactDescription: "DevOps/SRE cross-functional competencies eliminate dedicated cloud hires." },
      { skill: "TypeScript & React Modern Ecosystem", premiumPercent: 10, impactDescription: "Full-stack versatility reduces team coordination overhead." },
      { skill: "AI Model Serving & Inference Pipelines", premiumPercent: 22, impactDescription: "Deploying production LLMs and low-latency inference carries a premium." }
    ],
    negotiationTips: [
      "Quantify scale in your resume bullets (e.g., 'scaled from 500k to 4M daily transactions') to anchor in the top 75th percentile.",
      "Ask for total compensation (base + bonus + refresh equity grants) rather than negotiating base salary alone.",
      "Leverage competing offers or proven cloud cost reduction metrics to negotiate signing bonuses."
    ],
    resumeExampleSlug: "software-engineer"
  },
  {
    roleSlug: "product-manager",
    title: "Product Manager / Group PM",
    category: "Product & Design",
    description: "Drives product strategy, customer discovery, roadmap prioritization, and cross-functional execution.",
    nationalMedianUsd: 138000,
    levels: [
      { level: "Entry-Level (0-2 yrs)", baseP25: 82000, baseMedian: 95000, baseP75: 110000, baseP90: 122000, bonusPercent: 8, equityAvgUsd: 10000 },
      { level: "Mid-Level (3-5 yrs)", baseP25: 115000, baseMedian: 132000, baseP75: 150000, baseP90: 168000, bonusPercent: 12, equityAvgUsd: 26000 },
      { level: "Senior (5-8 yrs)", baseP25: 148000, baseMedian: 168000, baseP75: 195000, baseP90: 220000, bonusPercent: 16, equityAvgUsd: 58000 },
      { level: "Staff / Lead (8+ yrs)", baseP25: 185000, baseMedian: 215000, baseP75: 250000, baseP90: 290000, bonusPercent: 22, equityAvgUsd: 110000 },
      { level: "Director / VP", baseP25: 230000, baseMedian: 275000, baseP75: 330000, baseP90: 395000, bonusPercent: 32, equityAvgUsd: 195000 }
    ],
    skillPremiums: [
      { skill: "B2B SaaS Growth & PLG Funnels", premiumPercent: 16, impactDescription: "Direct proof of trial-to-paid conversion lift commands immediate top-quartile offers." },
      { skill: "Data Analytics & SQL / Experimentation", premiumPercent: 12, impactDescription: "PMs who run their own statistical queries and A/B evaluations save BI time." },
      { skill: "Enterprise Security / SOC-2 Workflows", premiumPercent: 14, impactDescription: "Unlocking enterprise deals drives measurable expansion revenue." }
    ],
    negotiationTips: [
      "Frame past accomplishments in ARR lift and retention gains rather than feature delivery.",
      "Inquire whether product equity vests on standard 4-year schedules or incorporates performance milestones.",
      "Highlight multi-seat monetization experience to justify Director-level placement."
    ],
    resumeExampleSlug: "product-manager"
  },
  {
    roleSlug: "data-scientist",
    title: "Data Scientist / Machine Learning Engineer",
    category: "Engineering & Tech",
    description: "Extracts predictive insights from massive datasets, builds predictive algorithms, and trains ML models.",
    nationalMedianUsd: 146000,
    levels: [
      { level: "Entry-Level (0-2 yrs)", baseP25: 90000, baseMedian: 104000, baseP75: 120000, baseP90: 135000, bonusPercent: 8, equityAvgUsd: 15000 },
      { level: "Mid-Level (3-5 yrs)", baseP25: 122000, baseMedian: 140000, baseP75: 162000, baseP90: 180000, bonusPercent: 12, equityAvgUsd: 32000 },
      { level: "Senior (5-8 yrs)", baseP25: 156000, baseMedian: 180000, baseP75: 210000, baseP90: 240000, bonusPercent: 18, equityAvgUsd: 72000 },
      { level: "Staff / Lead (8+ yrs)", baseP25: 200000, baseMedian: 235000, baseP75: 275000, baseP90: 325000, bonusPercent: 24, equityAvgUsd: 135000 },
      { level: "Director / VP", baseP25: 250000, baseMedian: 295000, baseP75: 355000, baseP90: 430000, bonusPercent: 35, equityAvgUsd: 230000 }
    ],
    skillPremiums: [
      { skill: "LLM Fine-Tuning & Quantization", premiumPercent: 24, impactDescription: "High-demand AI specialty with severe talent scarcity in 2026." },
      { skill: "Production MLOps (Kubeflow, MLflow)", premiumPercent: 16, impactDescription: "Bridging Jupyter notebooks to real-time production APIs." },
      { skill: "PyTorch & Distributed Model Training", premiumPercent: 15, impactDescription: "Optimizing multi-GPU training clusters and cutting cloud spend." }
    ],
    negotiationTips: [
      "Demonstrate GPU cost reduction percentages in your resume to validate high base compensation.",
      "Emphasize deployment to live production over pure academic experimentation."
    ],
    resumeExampleSlug: "data-scientist"
  },
  {
    roleSlug: "marketing-manager",
    title: "Marketing Manager / Growth Marketer",
    category: "Sales & Marketing",
    description: "Owns lead acquisition, paid media budgets, brand positioning, and demand generation funnels.",
    nationalMedianUsd: 118000,
    levels: [
      { level: "Entry-Level (0-2 yrs)", baseP25: 65000, baseMedian: 76000, baseP75: 88000, baseP90: 98000, bonusPercent: 8, equityAvgUsd: 6000 },
      { level: "Mid-Level (3-5 yrs)", baseP25: 92000, baseMedian: 108000, baseP75: 124000, baseP90: 138000, bonusPercent: 12, equityAvgUsd: 18000 },
      { level: "Senior (5-8 yrs)", baseP25: 125000, baseMedian: 144000, baseP75: 165000, baseP90: 188000, bonusPercent: 16, equityAvgUsd: 42000 },
      { level: "Staff / Lead (8+ yrs)", baseP25: 155000, baseMedian: 182000, baseP75: 212000, baseP90: 245000, bonusPercent: 22, equityAvgUsd: 85000 },
      { level: "Director / VP", baseP25: 195000, baseMedian: 235000, baseP75: 285000, baseP90: 345000, bonusPercent: 30, equityAvgUsd: 160000 }
    ],
    skillPremiums: [
      { skill: "Account-Based Marketing (ABM) for Enterprise", premiumPercent: 16, impactDescription: "Aligns marketing directly with $100k+ ACV enterprise sales deals." },
      { skill: "Multi-Touch Revenue Attribution & SQL", premiumPercent: 14, impactDescription: "Eliminates vanity metrics by proving CAC payback and pipeline velocity." },
      { skill: "Paid Search & Meta Optimization at Scale", premiumPercent: 12, impactDescription: "Experience managing $250k+/mo ad spend efficiently." }
    ],
    negotiationTips: [
      "Always quote CAC reduction and pipeline generated in your resume highlights.",
      "Ask for performance-linked bonus bonuses tied directly to qualified pipeline targets."
    ],
    resumeExampleSlug: "marketing-manager"
  },
  {
    roleSlug: "financial-analyst",
    title: "Financial Analyst / FP&A Manager",
    category: "Finance & Accounting",
    description: "Builds financial forecast models, evaluates investment ROI, and conducts monthly budget variance analysis.",
    nationalMedianUsd: 112000,
    levels: [
      { level: "Entry-Level (0-2 yrs)", baseP25: 68000, baseMedian: 78000, baseP75: 90000, baseP90: 100000, bonusPercent: 10, equityAvgUsd: 5000 },
      { level: "Mid-Level (3-5 yrs)", baseP25: 95000, baseMedian: 110000, baseP75: 126000, baseP90: 142000, bonusPercent: 15, equityAvgUsd: 16000 },
      { level: "Senior (5-8 yrs)", baseP25: 128000, baseMedian: 146000, baseP75: 168000, baseP90: 190000, bonusPercent: 20, equityAvgUsd: 40000 },
      { level: "Staff / Lead (8+ yrs)", baseP25: 160000, baseMedian: 185000, baseP75: 218000, baseP90: 250000, bonusPercent: 25, equityAvgUsd: 80000 },
      { level: "Director / VP", baseP25: 205000, baseMedian: 245000, baseP75: 295000, baseP90: 360000, bonusPercent: 35, equityAvgUsd: 165000 }
    ],
    skillPremiums: [
      { skill: "M&A Due Diligence & Strategic Valuation", premiumPercent: 18, impactDescription: "High-stakes deal structuring experience commands top banking/corp dev rates." },
      { skill: "PowerBI, SQL & Automated Reporting", premiumPercent: 12, impactDescription: "Replacing manual Excel reporting with live executive BI dashboards." },
      { skill: "CFA / CPA Charterholder", premiumPercent: 15, impactDescription: "Signals rigorous institutional compliance and auditing mastery." }
    ],
    negotiationTips: [
      "Emphasize cost savings or synergy savings identified during past budget cycles.",
      "In corporate finance, bonuses often make up 15-30% of total comp; ensure target bonuses are guaranteed in writing."
    ],
    resumeExampleSlug: "financial-analyst"
  },
  {
    roleSlug: "registered-nurse",
    title: "Registered Nurse / Clinical Specialist",
    category: "Healthcare & Clinical",
    description: "Delivers direct clinical patient care, administers treatment plans, and coordinates multidisciplinary triage.",
    nationalMedianUsd: 92000,
    levels: [
      { level: "Entry-Level (0-2 yrs)", baseP25: 64000, baseMedian: 74000, baseP75: 84000, baseP90: 94000, bonusPercent: 4, equityAvgUsd: 0 },
      { level: "Mid-Level (3-5 yrs)", baseP25: 80000, baseMedian: 92000, baseP75: 104000, baseP90: 116000, bonusPercent: 6, equityAvgUsd: 0 },
      { level: "Senior (5-8 yrs)", baseP25: 98000, baseMedian: 112000, baseP75: 126000, baseP90: 140000, bonusPercent: 8, equityAvgUsd: 0 },
      { level: "Staff / Lead (8+ yrs)", baseP25: 115000, baseMedian: 130000, baseP75: 148000, baseP90: 165000, bonusPercent: 10, equityAvgUsd: 0 },
      { level: "Director / VP", baseP25: 140000, baseMedian: 165000, baseP75: 195000, baseP90: 225000, bonusPercent: 15, equityAvgUsd: 0 }
    ],
    skillPremiums: [
      { skill: "ICU / Trauma / Critical Care Certification (CCRN)", premiumPercent: 18, impactDescription: "High-acuity clinical credentials command significant hospital shift differentials." },
      { skill: "Epic Systems / Cerner Super-User", premiumPercent: 8, impactDescription: "Faster clinical documentation and onboarding." },
      { skill: "Charge Nurse & Preceptorship Leadership", premiumPercent: 12, impactDescription: "Unit leadership and retention mentorship reduces nurse turnover." }
    ],
    negotiationTips: [
      "Negotiate clinical shift differentials (night shifts, weekend rotations, on-call rates) which can add 15-25% to base earnings.",
      "Ask for sign-on retention bonuses and hospital continuing education tuition reimbursement."
    ],
    resumeExampleSlug: "registered-nurse"
  }
];
