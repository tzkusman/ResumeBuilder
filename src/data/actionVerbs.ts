export interface VerbGroup {
  category: string;
  description: string;
  verbs: {
    verb: string;
    definition: string;
    weakExample: string;
    strongExample: string;
    keywords: string[];
  }[];
}

export const ACTION_VERBS_DATA: VerbGroup[] = [
  {
    category: "Leadership & Strategy",
    description: "Use when demonstrating ownership, team direction, organizational transformation, and high-level vision.",
    verbs: [
      {
        verb: "Spearheaded",
        definition: "Initiated and drove an enterprise program from conception to execution.",
        weakExample: "Responsible for starting a new developer onboarding program.",
        strongExample: "Spearheaded engineering onboarding overhaul across 4 offices, cutting ramp time from 45 to 14 days for 60+ new hires.",
        keywords: ["Initiative", "Management", "Direction"]
      },
      {
        verb: "Orchestrated",
        definition: "Coordinated complex moving parts across diverse teams and stakeholders.",
        weakExample: "Worked with marketing and product teams on the new release.",
        strongExample: "Orchestrated cross-functional launch of v2.0 mobile app across 6 teams, securing 120k day-one downloads and a 4.8★ app store rating.",
        keywords: ["Cross-functional", "Coordination", "Launch"]
      },
      {
        verb: "Mobilized",
        definition: "Rallied resources, budget, and personnel to solve an urgent business challenge.",
        weakExample: "Gathered staff to work on customer retention during a crisis.",
        strongExample: "Mobilized emergency tiger team of 8 senior architects during outage, reducing MTTR by 64% and recovering $320k in pending transactions.",
        keywords: ["Crisis Management", "Agility", "Resource Allocation"]
      },
      {
        verb: "Championed",
        definition: "Advocated for, justified, and secured executive buy-in for a pivotal initiative.",
        weakExample: "Wanted the company to adopt modern testing frameworks.",
        strongExample: "Championed adoption of automated end-to-end testing across 12 product squads, driving code coverage from 42% to 88%.",
        keywords: ["Advocacy", "Executive Buy-in", "Culture"]
      },
      {
        verb: "Steered",
        definition: "Guided strategic direction, budget, and governance through critical transitions.",
        weakExample: "Managed the division during organizational restructuring.",
        strongExample: "Steered $4.2M departmental budget through corporate merger, consolidating 18 vendor contracts to save $750k annually.",
        keywords: ["Governance", "Budget Management", "Mergers"]
      }
    ]
  },
  {
    category: "Technical & Engineering",
    description: "Use when detailing system architecture, software development, cloud infrastructure, and technical execution.",
    verbs: [
      {
        verb: "Architected",
        definition: "Designed the high-level structural blueprint of software, networks, or cloud infrastructure.",
        weakExample: "Helped build a new microservices backend system.",
        strongExample: "Architected distributed event-driven microservices processing 45k events/sec on AWS Kafka and ECS with 99.99% SLA.",
        keywords: ["Microservices", "Scalability", "System Design"]
      },
      {
        verb: "Engineered",
        definition: "Applied rigorous technical principles to build robust, fault-tolerant solutions.",
        weakExample: "Wrote backend APIs for web and mobile clients.",
        strongExample: "Engineered resilient REST & GraphQL gateway serving 8M daily requests with sub-40ms p95 latency.",
        keywords: ["APIs", "Performance", "Full-Stack"]
      },
      {
        verb: "Automated",
        definition: "Replaced manual, error-prone tasks with resilient algorithmic workflows.",
        weakExample: "Created deployment scripts to save developer time.",
        strongExample: "Automated CI/CD release pipeline using GitHub Actions and Terraform, shrinking build-and-deploy cycles from 3 hours to 8 minutes.",
        keywords: ["CI/CD", "DevOps", "Infrastructure as Code"]
      },
      {
        verb: "Refactored",
        definition: "Restructured existing code to improve maintainability and performance without altering behavior.",
        weakExample: "Cleaned up old legacy code in the database layer.",
        strongExample: "Refactored legacy monolith database queries, eliminating 140+ N+1 query patterns and reducing database CPU utilization by 42%.",
        keywords: ["Optimization", "Clean Code", "Technical Debt"]
      },
      {
        verb: "Provisioned",
        definition: "Set up and configured cloud resources, servers, and multi-tenant environments.",
        weakExample: "Set up new Kubernetes clusters for development.",
        strongExample: "Provisioned multi-region Kubernetes clusters on GCP with automated horizontal pod autoscaling and zero-trust VPC peering.",
        keywords: ["Cloud Infrastructure", "Kubernetes", "Security"]
      }
    ]
  },
  {
    category: "Revenue & Sales",
    description: "Use when proving direct contributions to top-line revenue, conversion rates, and business development.",
    verbs: [
      {
        verb: "Accelerated",
        definition: "Significantly sped up pipeline velocity, sales cycles, or revenue milestones.",
        weakExample: "Helped improve sales numbers in the West region.",
        strongExample: "Accelerated enterprise sales velocity by 31%, shortening average deal cycles from 90 days to 62 days.",
        keywords: ["Sales Cycle", "Pipeline", "ARR"]
      },
      {
        verb: "Outperformed",
        definition: "Exceeded established quotas, benchmarks, or competitor baselines.",
        weakExample: "Hit quota every quarter as an account executive.",
        strongExample: "Outperformed annual quota by 142%, generating $2.1M in net-new ARR and closing the company's largest single enterprise contract ($480k).",
        keywords: ["Quota", "Quota Attainment", "Enterprise Deals"]
      },
      {
        verb: "Monetized",
        definition: "Turned an existing asset, feature, or user traffic into recurring revenue streams.",
        weakExample: "Added paid features to our free software.",
        strongExample: "Monetized premium API tier, converting 8.5% of free developers into recurring monthly subscribers ($68k MRR within 90 days).",
        keywords: ["SaaS", "Monetization", "Conversion"]
      },
      {
        verb: "Negotiated",
        definition: "Conducted high-stakes commercial discussions to secure favorable terms.",
        weakExample: "Talked with suppliers to get discounts.",
        strongExample: "Negotiated multi-year supplier master service agreements with 7 tier-1 vendors, yielding 18% margin improvement.",
        keywords: ["Negotiation", "Procurement", "Contract Terms"]
      }
    ]
  },
  {
    category: "Process & Efficiency",
    description: "Use when highlighting operational excellence, cost reduction, waste elimination, and workflow optimization.",
    verbs: [
      {
        verb: "Streamlined",
        definition: "Removed friction and redundancies to speed up organizational output.",
        weakExample: "Made the monthly financial reporting process faster.",
        strongExample: "Streamlined month-end financial close workflow, eliminating 3 days of reconciliation effort across 5 regional entities.",
        keywords: ["Operations", "Efficiency", "Workflows"]
      },
      {
        verb: "Consolidated",
        definition: "Combined fragmented tools, teams, or databases into a unified structure.",
        weakExample: "Put all customer data into one CRM.",
        strongExample: "Consolidated 4 legacy CRM databases into a unified HubSpot instance, eliminating $85k in duplicate software licenses.",
        keywords: ["Consolidation", "Tech Stack", "Cost Savings"]
      },
      {
        verb: "Slashed",
        definition: "Achieved dramatic, decisive reductions in cost, latency, or waste.",
        weakExample: "Cut down server hosting expenses.",
        strongExample: "Slashed AWS cloud spend by $120k annually by auditing reserved instances and terminating unattached EBS volumes.",
        keywords: ["Cloud Spend", "FinOps", "Cost Reduction"]
      },
      {
        verb: "Standardized",
        definition: "Instituted uniform quality standards, templates, and SOPs across an organization.",
        weakExample: "Wrote documentation for team procedures.",
        strongExample: "Standardized customer escalation SOPs across 4 global support hubs, improving first-contact resolution from 61% to 84%.",
        keywords: ["SOPs", "Quality Assurance", "Scale"]
      }
    ]
  },
  {
    category: "Research & Analysis",
    description: "Use when demonstrating data-driven decision making, market research, forecasting, and analytical depth.",
    verbs: [
      {
        verb: "Synthesized",
        definition: "Extracted actionable insights from massive, complex datasets or user interviews.",
        weakExample: "Looked at user survey responses.",
        strongExample: "Synthesized feedback from 180+ enterprise customer interviews into a prioritized 12-month product feature matrix.",
        keywords: ["Customer Discovery", "Data Synthesis", "Product Roadmap"]
      },
      {
        verb: "Forecasted",
        definition: "Predicted market trends, inventory demands, or financial metrics using statistical models.",
        weakExample: "Predicted product sales for upcoming quarters.",
        strongExample: "Forecasted Q3/Q4 inventory demand using predictive ARIMA time-series models, reducing stockouts by 47%.",
        keywords: ["Forecasting", "Time Series", "Data Science"]
      },
      {
        verb: "Audited",
        definition: "Conducted systematic evaluations of security, compliance, code, or finances.",
        weakExample: "Checked our applications for security vulnerabilities.",
        strongExample: "Audited 34 external vendor APIs against SOC-2 and GDPR compliance standards, remediating 9 critical data leak vectors.",
        keywords: ["Compliance", "SOC-2", "Security Audit"]
      }
    ]
  }
];
