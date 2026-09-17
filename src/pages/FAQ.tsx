import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Icon, Seo } from "../components/ui";

interface FaqItem {
  question: string;
  answer: string;
  category: "ATS Systems" | "Resume Length & Formatting" | "International Standards" | "Cover Letters";
}

const FAQS: FaqItem[] = [
  {
    question: "Do modern ATS systems read 2-page resumes?",
    answer: "Yes, absolutely. Modern ATS parsers (such as Workday, Greenhouse, and Lever) read sequential multi-page documents seamlessly as long as standard headings ('Work Experience', 'Education', 'Skills') and single-column or clean semantic structures are used. 2-page resumes are recommended for professionals with 5+ years of relevant experience.",
    category: "Resume Length & Formatting"
  },
  {
    question: "Do ATS scanners read tables and columns?",
    answer: "Complex nested tables, multi-layer floating text boxes, and non-standard layout containers often cause text interleaving where words from the left column are merged into sentences on the right. Simple, semantic columns or structured single-column formats are significantly safer and achieve 99%+ parsing accuracy.",
    category: "ATS Systems"
  },
  {
    question: "Should I include a photo on my resume or CV?",
    answer: "In the United States, United Kingdom, Canada, and Australia: NEVER include a photo. US corporate HR teams routinely reject resumes with photos to avoid anti-bias and EEOC liability. In contrast, in Germany, Austria, Switzerland, and Japan, professional headshots are standard and expected.",
    category: "International Standards"
  },
  {
    question: "What is the best file format: PDF or Word (DOCX)?",
    answer: "A vector-rendered, selectable PDF is the global gold standard because it preserves exact typography, margins, and layout across all operating systems without software version drift. Always ensure your PDF allows text highlighting. DOCX is also widely accepted by older enterprise systems.",
    category: "ATS Systems"
  },
  {
    question: "How long should a professional cover letter be?",
    answer: "Between 250 and 380 words, comfortably fitting onto a single page. Recruiters and hiring managers spend less than 60 seconds scanning a cover letter. A 3-paragraph framework (The Hook, The Quantified Proof, and The Decisive Closing) achieves the highest interview conversion rates.",
    category: "Cover Letters"
  },
  {
    question: "What fonts are considered ATS-friendly?",
    answer: "Standard web-safe and clean humanist sans-serifs and serifs such as Inter, Calibri, Helvetica, Arial, Georgia, and Garamond. Avoid decorative script fonts, custom novelty glyphs, or non-standard icon fonts that ATS OCR engines cannot decode.",
    category: "Resume Length & Formatting"
  },
  {
    question: "What is the Google X-Y-Z formula for resume bullet points?",
    answer: "Codified by Laszlo Bock (former SVP of People Operations at Google), the formula is: 'Accomplished [X] as measured by [Y] by doing [Z]'. It forces you to state the business outcome first, follow with a quantifiable metric (%, $, time saved), and end with the methodology or tools utilized.",
    category: "Resume Length & Formatting"
  },
  {
    question: "Can I use color on an ATS resume?",
    answer: "Yes, color is completely fine. ATS algorithms strip color styling and read the underlying digital text stream. However, avoid ultra-light colored text that violates human visual contrast standards (WCAG AA) when a recruiter prints or views your document on a monitor.",
    category: "ATS Systems"
  },
  {
    question: "Should I list references on my resume?",
    answer: "No. 'References available upon request' is outdated and wastes valuable vertical real estate. Employers will explicitly ask for references during the final offer stage. Use that space for quantified accomplishments and technical skills instead.",
    category: "Resume Length & Formatting"
  },
  {
    question: "What personal contact information is required?",
    answer: "You only need your Full Name, Professional Title, Phone Number, Professional Email, City and State/Country, and a customized LinkedIn or Portfolio URL. Never include full street addresses, Social Security numbers, marital status, or dates of birth on US/UK resumes.",
    category: "International Standards"
  }
];

export default function FAQPage() {
  const [activeCat, setActiveCat] = useState<string>("All");
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const categories = ["All", "ATS Systems", "Resume Length & Formatting", "International Standards", "Cover Letters"];

  const filteredFaqs = useMemo(() => {
    if (activeCat === "All") return FAQS;
    return FAQS.filter((f) => f.category === activeCat);
  }, [activeCat]);

  // Generate structured FAQPage Schema for Google Rich Results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-paper pb-24">
      <Seo
        title="Resume & ATS Frequently Asked Questions (2026 Guide) | ResumeBuild"
        description="Get answers to the most common questions about ATS parsers, 1-page vs 2-page resumes, photo rules, fonts, and cover letter strategies."
        path="/faq"
        jsonLd={faqSchema}
      />

      {/* Header */}
      <section className="border-b-2 border-ink bg-card py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 border border-ink/20 bg-acid/40 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-pine-deep">
            <Icon name="book" size={14} /> Comprehensive Knowledge Base
          </div>
          <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Frequently Asked <span className="text-pine">Resume & ATS</span> Questions
          </h1>
          <p className="mt-4 max-w-2xl text-base text-ink-soft sm:text-lg">
            Direct, verified answers to the most debated questions in modern job applications, verified by recruiters and ATS software architects.
          </p>

          <div className="mt-8 flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCat(cat); setOpenIdx(null); }}
                className={`border px-3.5 py-1.5 font-mono text-xs font-bold transition-colors ${
                  activeCat === cat
                    ? "border-ink bg-ink text-acid shadow-sm"
                    : "border-ink/25 bg-card text-ink-soft hover:border-ink hover:text-ink"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion List */}
      <div className="mx-auto max-w-4xl px-4 pt-12 sm:px-6">
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border-2 border-ink bg-card shadow-[4px_4px_0_0_var(--color-ink)] transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left font-display text-lg font-bold text-ink sm:text-xl"
                >
                  <span>{faq.question}</span>
                  <span className="grid h-7 w-7 shrink-0 place-items-center border border-ink bg-paper font-mono text-sm font-bold">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-ink/15 bg-paper p-5 pt-4 text-sm leading-relaxed text-ink">
                    <p>{faq.answer}</p>
                    <div className="mt-3 flex items-center justify-between border-t border-ink/10 pt-3">
                      <span className="font-mono text-[10px] font-bold uppercase text-pine">
                        {faq.category}
                      </span>
                      <Link to="/builder" className="font-mono text-xs font-bold text-ink hover:underline">
                        Apply in Builder →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <section className="mt-16 border-2 border-ink bg-acid p-8 text-center sm:p-10 shadow-[6px_6px_0_0_var(--color-ink)]">
          <h2 className="font-display text-2xl font-black text-ink">
            Have Your Resume Evaluated Instantly
          </h2>
          <p className="mt-2 text-sm text-ink-soft">
            Scan your existing resume against our 16-point ATS rules engine or build a brand-new, mathematically formatted CV.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/ats-checker"
              className="border-2 border-ink bg-ink px-6 py-2.5 font-mono text-xs font-bold uppercase text-acid"
            >
              Scan CV Now
            </Link>
            <Link
              to="/builder"
              className="border-2 border-ink bg-card px-6 py-2.5 font-mono text-xs font-bold uppercase text-ink"
            >
              Start Free Resume
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
