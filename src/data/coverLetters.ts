export interface CoverLetterExample {
  id: string;
  role: string;
  category: "Engineering & Tech" | "Product & Design" | "Sales & Marketing" | "Operations & Finance" | "Healthcare & Science";
  level: "Entry-Level" | "Mid-Senior" | "Executive / Director";
  hiringManager: string;
  company: string;
  openingHook: string;
  bodyProof: string;
  closingCta: string;
  keyHighlights: string[];
}

export const COVER_LETTER_EXAMPLES: CoverLetterExample[] = [
  {
    id: "software-engineer",
    role: "Senior Full-Stack Software Engineer",
    category: "Engineering & Tech",
    level: "Mid-Senior",
    hiringManager: "Alex Thorne, VP of Engineering",
    company: "CloudScale Technologies",
    openingHook: "When CloudScale announced your expansion into zero-downtime multi-region databases last month, I immediately admired how your engineering team preserved sub-50ms latency across geographic regions. Over the past six years at Veloce Systems, I specialized in distributed cloud architecture—migrating 18 monolithic services to event-driven Kubernetes clusters while reducing infrastructure spend by $140k annually. I would welcome the opportunity to bring that exact operational discipline to CloudScale.",
    bodyProof: "In my recent role as Lead Backend Engineer, I steered a squad of 7 developers in designing our real-time transaction processing pipeline on Node.js, TypeScript, and AWS Aurora. When our daily transaction volume spiked from 500k to 3.2M requests per day during peak holiday promotions, our automated partitioning and caching architecture maintained 99.995% uptime without a single dropped event. Beyond technical delivery, I established automated CI/CD guardrails and peer code review standards that decreased production hotfixes by 44% across the broader engineering division.",
    closingCta: "I would welcome the opportunity to discuss how my background in high-throughput cloud architecture and engineering mentorship can accelerate CloudScale's roadmap for next quarter. Thank you for your time and consideration.",
    keyHighlights: ["$140k AWS spend reduction", "3.2M daily transactions managed", "99.995% uptime SLA"]
  },
  {
    id: "product-manager",
    role: "Staff Product Manager (Growth)",
    category: "Product & Design",
    level: "Mid-Senior",
    hiringManager: "Rachel Lin, Chief Product Officer",
    company: "Apex Global",
    openingHook: "Apex Global's recent launch of self-serve enterprise onboarding caught my attention because it tackled the hardest friction point in B2B SaaS: the gap between product trial and enterprise procurement. At FinPulse, I led the Growth Product squad responsible for our self-service conversion funnel, increasing free-to-paid conversion from 3.2% to 6.8% and adding $3.4M in annualized recurring revenue.",
    bodyProof: "My approach combines rigorous quantitative experimentation with direct customer qualitative discovery. At FinPulse, I conducted 45+ enterprise buyer interviews to map where procurement teams stalled in onboarding. Using these insights, my squad designed a collaborative multi-seat permission workspace with automated SOC-2 compliance export. We validated this through sequential A/B experiments across 120,000 active trial accounts, reducing time-to-value from 14 days to 48 hours and lifting 90-day retention by 28%.",
    closingCta: "I would love to discuss how we can apply these data-driven growth frameworks to expand Apex Global's enterprise market share. I look forward to connecting with your team.",
    keyHighlights: ["Free-to-paid lift from 3.2% to 6.8%", "$3.4M net-new ARR", "Onboarding cycle cut to 48 hours"]
  },
  {
    id: "marketing-director",
    role: "Director of Demand Generation",
    category: "Sales & Marketing",
    level: "Executive / Director",
    hiringManager: "David Sterling, Chief Marketing Officer",
    company: "Nexus Dynamics",
    openingHook: "In B2B software, vanity metrics like impressions and webinar attendees mean very little if they do not convert into qualified sales pipeline. Over the past 8 years leading demand generation teams, I have focused strictly on pipeline velocity, customer acquisition cost (CAC) payback, and closed-won revenue attribution. I am eager to bring this performance-driven methodology to Nexus Dynamics as Director of Demand Generation.",
    bodyProof: "At Veridian Software, I managed a $2.8M multi-channel demand gen budget across paid search, account-based marketing (ABM), programmatic SEO, and co-marketing partnerships. By restructuring our outbound target account lists with predictive intent data and revamping our lead nurturing sequences, our team drove a 165% increase in Sales Qualified Leads (SQLs) while cutting blended CAC by 23%. Additionally, I partnered with Sales Leadership to overhaul our lead routing SLAs, shrinking average lead response time from 4 hours to under 7 minutes.",
    closingCta: "I am confident that my experience building high-velocity demand generation engines will help Nexus Dynamics outpace your revenue targets this fiscal year. I would welcome an introductory conversation.",
    keyHighlights: ["165% lift in Sales Qualified Leads", "23% reduction in blended CAC", "Under 7-minute lead response SLA"]
  },
  {
    id: "data-scientist",
    role: "Senior Machine Learning Engineer",
    category: "Engineering & Tech",
    level: "Mid-Senior",
    hiringManager: "Dr. Elena Rostova, Head of AI & Analytics",
    company: "Cortex Intelligence",
    openingHook: "Bridging the gap between cutting-edge research models and high-throughput production inference is one of the most pressing engineering bottlenecks in AI today. At DataSphere, I led the deployment and serving of our predictive NLP customer service models, scaling inference to 14M daily queries while reducing GPU inference costs by 52%. I am excited to apply for the Senior Machine Learning Engineer position at Cortex Intelligence.",
    bodyProof: "In my recent work, I spearheaded the quantization and deployment of open-source LLMs and transformers using TensorRT-LLM and Triton Inference Server. By implementing dynamic batching and speculative decoding, our team lowered p95 model latency from 320ms to 48ms. Furthermore, I built our automated ML feature store and continuous drift detection pipeline in Feast and MLflow, ensuring our production recommendation models retrained automatically whenever embedding distributions drifted beyond threshold bounds.",
    closingCta: "I would be thrilled to discuss how my expertise in low-latency model inference, distributed training, and ML systems engineering can support Cortex Intelligence's model rollout goals.",
    keyHighlights: ["52% reduction in GPU inference cost", "p95 latency reduced from 320ms to 48ms", "14M daily queries served"]
  },
  {
    id: "financial-analyst",
    role: "Senior FP&A Financial Analyst",
    category: "Operations & Finance",
    level: "Mid-Senior",
    hiringManager: "Marcus Vance, Director of Financial Planning",
    company: "Strata Global Capital",
    openingHook: "Accurate financial modeling is not just about recording historic numbers—it is about providing operating executives with the forward-looking sensitivity analysis needed to make bold capital allocation decisions. At Summit Health Corp, I built dynamic rolling 3-statement forecast models across 14 operating subsidiaries with a 98.2% forecast accuracy rate. I would welcome the chance to bring this analytical precision to Strata Global Capital.",
    bodyProof: "During my tenure at Summit Health, I partnered directly with department VPs to overhaul our annual budgeting and monthly variance reporting cadence. I automated our consolidated financial reporting in PowerBI and SQL, replacing 25 hours of manual spreadsheet compilation per month with automated live executive dashboards. Additionally, I led the financial due diligence and scenario analysis for a $35M strategic acquisition, identifying $3.1M in post-merger synergy savings across supply chain and vendor licensing.",
    closingCta: "I look forward to discussing how my background in financial modeling, variance analysis, and operational forecasting can support Strata Global Capital's strategic investments.",
    keyHighlights: ["98.2% forecast accuracy", "25 hours saved per month via SQL/BI automation", "$3.1M synergy savings identified"]
  },
  {
    id: "nurse-manager",
    role: "Clinical Nurse Manager (ICU / Critical Care)",
    category: "Healthcare & Science",
    level: "Mid-Senior",
    hiringManager: "Patricia Miller, Chief Nursing Officer",
    company: "Mercy General Hospital",
    openingHook: "Delivering exceptional clinical patient outcomes while supporting front-line nursing staff through intense operational demands requires both clinical mastery and empathetic leadership. With over 9 years of critical care experience—including 4 years as Assistant Nurse Manager in a 32-bed Level 1 Trauma Center—I am writing to express my strong commitment to the Clinical Nurse Manager role at Mercy General.",
    bodyProof: "In my current capacity, I manage a staff of 48 RNs, coordinating daily shift assignments, rapid clinical response protocols, and quality assurance audits. By implementing a standardized bedside shift handover protocol and continuous clinical rounding, our unit decreased hospital-acquired infections (CLABSI and CAUTI) by 42% over an 18-month span. To address nursing burnout, I introduced a peer mentorship program that improved first-year nurse retention from 68% to 89% and raised unit patient satisfaction scores into the 94th percentile nationally.",
    closingCta: "I would be honored to discuss how my clinical leadership, nurse retention strategies, and quality improvement focus can support the team at Mercy General Hospital.",
    keyHighlights: ["42% reduction in hospital-acquired infections", "Nurse retention lifted from 68% to 89%", "94th percentile patient satisfaction"]
  }
];
