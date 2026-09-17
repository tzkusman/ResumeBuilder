import { useState, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Icon, Chip, Seo } from "../components/ui";
import { BLOG_POSTS, type BlogPost } from "../data/blogPosts";
import { useI18n } from "../store/AppStore";

export function BlogIndex() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const { t } = useI18n();

  const categories = ["All", "ATS Strategy", "Resume Formats", "Metrics & Bullets", "Cover Letters", "Global Hiring"];

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCat = activeCategory === "All" || post.category === activeCategory;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [search, activeCategory]);

  const featured = BLOG_POSTS[0];

  return (
    <div className="min-h-screen bg-paper pb-24">
      <Seo
        title="Resume & Career Advice Blog | ATS Strategy & Resume Writing Guides"
        description="Expert guides on beating ATS algorithms, 1-page vs 2-page formatting, Google X-Y-Z bullet formulas, and international CV standards."
        path="/blog"
      />

      {/* Hero section */}
      <section className="border-b-2 border-ink bg-card py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 border border-ink/20 bg-acid/40 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-pine-deep">
            <Icon name="book" size={14} /> Career & Resume Engineering Hub
          </div>
          <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Insights on Beating <span className="text-pine">ATS Scanners</span> & Landing Top Roles
          </h1>
          <p className="mt-4 max-w-2xl text-base text-ink-soft sm:text-lg">
            Tactical, recruiter-tested playbooks on resume architecture, quantifiable bullet formulas, cover letter hooks, and international hiring standards.
          </p>

          {/* Search & Category Filter */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-soft">
                <Icon name="search" size={16} />
              </span>
              <input
                type="text"
                placeholder="Search articles by keyword, ATS, verbs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border-2 border-ink bg-white py-2.5 pl-10 pr-4 text-sm font-medium transition-colors placeholder:text-ink-soft/60 focus:border-pine focus:outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute inset-y-0 right-3 flex items-center text-xs font-bold text-ink-soft hover:text-ink"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`border px-3 py-1.5 font-mono text-xs font-bold transition-colors ${
                    activeCategory === cat
                      ? "border-ink bg-ink text-acid shadow-sm"
                      : "border-ink/25 bg-card text-ink-soft hover:border-ink hover:text-ink"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6">
        {/* Featured Post Banner (when no search active) */}
        {!search && activeCategory === "All" && featured && (
          <div className="mb-14 border-2 border-ink bg-card p-6 shadow-[6px_6px_0_0_var(--color-ink)] transition-all sm:p-10">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <div className="flex items-center gap-3">
                  <span className="border border-pine bg-pine text-paper px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider">
                    Featured Guide
                  </span>
                  <span className="font-mono text-xs text-ink-soft">{featured.category}</span>
                  <span className="font-mono text-xs text-ink-soft">· {featured.readTime}</span>
                </div>
                <h2 className="mt-4 font-display text-2xl font-black tracking-tight text-ink sm:text-3xl lg:text-4xl">
                  <Link to={`/blog/${featured.slug}`} className="hover:text-pine transition-colors">
                    {featured.title}
                  </Link>
                </h2>
                <p className="mt-3 text-base text-ink-soft leading-relaxed">
                  {featured.excerpt}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Link
                    to={`/blog/${featured.slug}`}
                    className="inline-flex items-center gap-2 border-2 border-ink bg-acid px-5 py-2.5 font-mono text-xs font-bold text-ink transition-transform hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_var(--color-ink)]"
                  >
                    Read Full Blueprint <Icon name="arrow" size={14} />
                  </Link>
                  <span className="font-mono text-xs text-ink-soft">
                    By {featured.author.name} ({featured.author.role})
                  </span>
                </div>
              </div>

              <div className="border border-ink/20 bg-paper p-6 lg:col-span-5">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-pine">
                  Key Strategic Takeaways
                </h3>
                <ul className="mt-3 space-y-2.5 text-xs text-ink leading-relaxed">
                  {featured.keyTakeaways.slice(0, 3).map((k, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-0.5 text-pine font-bold">✓</span>
                      <span>{k}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
            {activeCategory === "All" ? "All Career & Technical Guides" : `${activeCategory} Articles`}
            <span className="ml-2 font-mono text-sm font-normal text-ink-soft">({filteredPosts.length})</span>
          </h2>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="border-2 border-dashed border-ink/30 bg-card p-12 text-center">
            <Icon name="search" size={32} className="mx-auto text-ink-soft/60" />
            <p className="mt-4 font-display text-lg font-bold text-ink">No articles matched your criteria</p>
            <p className="mt-1 text-sm text-ink-soft">Try searching for different terms or reset your filters.</p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("All"); }}
              className="mt-4 border-2 border-ink bg-acid px-4 py-2 font-mono text-xs font-bold text-ink"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <article
                key={post.slug}
                className="group flex flex-col justify-between border-2 border-ink bg-card p-6 shadow-[4px_4px_0_0_var(--color-ink)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--color-ink)]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-ink/10 pb-3">
                    <span className="font-mono text-[11px] font-bold text-pine uppercase tracking-wider">
                      {post.category}
                    </span>
                    <span className="font-mono text-[11px] text-ink-soft">{post.readTime}</span>
                  </div>

                  <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-ink group-hover:text-pine transition-colors">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="mt-2.5 text-xs text-ink-soft line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 3).map((t) => (
                      <span key={t} className="border border-ink/15 bg-paper px-2 py-0.5 font-mono text-[10px] text-ink-soft">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-ink/10 pt-4 flex items-center justify-between">
                  <div className="text-[11px] text-ink-soft font-mono">
                    {post.author.name}
                  </div>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 font-mono text-xs font-bold text-pine group-hover:underline"
                  >
                    Read <Icon name="arrow" size={12} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Global Call to Action */}
        <section className="mt-16 border-2 border-ink bg-acid p-8 text-center sm:p-12 shadow-[6px_6px_0_0_var(--color-ink)]">
          <h2 className="font-display text-2xl font-black text-ink sm:text-3xl">
            Test Your Resume Against Top ATS Algorithms Now
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft">
            Scan your CV with our real-time ATS checker or start fresh with 20 battle-tested, single or dual-page templates.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/builder"
              className="border-2 border-ink bg-ink px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-acid shadow-md transition-transform hover:-translate-y-0.5"
            >
              Open Resume Builder
            </Link>
            <Link
              to="/ats-checker"
              className="border-2 border-ink bg-card px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:bg-paper"
            >
              Scan Existing CV
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const post = useMemo(() => {
    return BLOG_POSTS.find((p) => p.slug === slug);
  }, [slug]);

  if (!post) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Article Not Found</h1>
        <p className="mt-3 text-sm text-ink-soft">The requested guide could not be located.</p>
        <Link to="/blog" className="mt-6 inline-block border-2 border-ink bg-acid px-4 py-2 font-mono text-xs font-bold">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-paper pb-24">
      <Seo
        title={`${post.metaTitle} | ResumeBuild Guide`}
        description={post.metaDesc}
        path={`/blog/${post.slug}`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          author: {
            "@type": "Person",
            name: post.author.name,
            jobTitle: post.author.role
          },
          datePublished: post.publishedAt,
          keywords: post.tags.join(", ")
        }}
      />

      {/* Article Header */}
      <header className="border-b-2 border-ink bg-card py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Link to="/blog" className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-ink-soft hover:text-ink">
            ← Back to All Guides
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="border border-pine bg-pine text-paper px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider">
              {post.category}
            </span>
            <span className="font-mono text-xs text-ink-soft">· {post.readTime}</span>
            <span className="font-mono text-xs text-ink-soft">· Updated {post.publishedAt}</span>
          </div>

          <h1 className="mt-4 font-display text-3xl font-black tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <p className="mt-4 text-base text-ink-soft sm:text-lg leading-relaxed">
            {post.excerpt}
          </p>

          <div className="mt-6 flex items-center gap-3 border-t border-ink/15 pt-6">
            <div className="grid h-10 w-10 place-items-center border border-ink bg-acid font-display font-black text-ink">
              {post.author.name[0]}
            </div>
            <div>
              <p className="text-sm font-bold text-ink">{post.author.name}</p>
              <p className="font-mono text-xs text-ink-soft">{post.author.role}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 pt-12 sm:px-6">
        {/* Key Takeaways Box */}
        <div className="mb-12 border-2 border-ink bg-card p-6 sm:p-8 shadow-[5px_5px_0_0_var(--color-ink)]">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-pine">
            <Icon name="check" size={16} /> Executive Summary & Key Takeaways
          </div>
          <ul className="mt-4 grid gap-2.5 text-sm text-ink sm:grid-cols-2">
            {post.keyTakeaways.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="mt-0.5 text-pine font-bold">✓</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Content Body */}
        <article className="prose prose-ink max-w-none space-y-10">
          {post.content.map((sec, idx) => (
            <section key={idx} className="space-y-4">
              <h2 className="font-display text-2xl font-black tracking-tight text-ink sm:text-3xl border-b border-ink/15 pb-2">
                {sec.heading}
              </h2>

              {sec.paragraphs.map((para, pIdx) => (
                <p key={pIdx} className="text-base text-ink leading-relaxed">
                  {para}
                </p>
              ))}

              {sec.callout && (
                <div
                  className={`my-6 border-2 p-5 ${
                    sec.callout.type === "warn"
                      ? "border-coral bg-coral-soft/40"
                      : sec.callout.type === "formula"
                      ? "border-ink bg-acid font-mono text-xs text-ink"
                      : "border-pine bg-pine-soft/40"
                  }`}
                >
                  <p className="font-mono text-xs font-bold uppercase tracking-wider text-ink mb-1">
                    {sec.callout.title}
                  </p>
                  <p className="text-sm text-ink leading-normal font-medium">
                    {sec.callout.text}
                  </p>
                </div>
              )}

              {sec.callouts && sec.callouts.map((co, cIdx) => (
                <div
                  key={cIdx}
                  className={`my-4 border-2 p-5 ${
                    co.type === "warn"
                      ? "border-coral bg-coral-soft/40"
                      : co.type === "formula"
                      ? "border-ink bg-acid font-mono text-xs text-ink"
                      : "border-pine bg-pine-soft/40"
                  }`}
                >
                  <p className="font-mono text-xs font-bold uppercase tracking-wider text-ink mb-1">
                    {co.title}
                  </p>
                  <p className="text-sm text-ink leading-normal font-medium">
                    {co.text}
                  </p>
                </div>
              ))}

              {sec.list && (
                <ul className="my-4 space-y-2 pl-4">
                  {sec.list.map((item, lIdx) => (
                    <li key={lIdx} className="list-disc text-sm text-ink leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>

        {/* Recommended Template Action Card */}
        <div className="my-16 border-2 border-ink bg-card p-8 shadow-[6px_6px_0_0_var(--color-ink)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-pine">
                Recommended Template for this Blueprint
              </span>
              <h3 className="mt-1 font-display text-xl font-bold text-ink">
                Build this resume format directly in ResumeBuild
              </h3>
              <p className="mt-1 text-xs text-ink-soft max-w-lg">
                Pre-configured with optimal font scaling, margin density, and ATS-compliant semantic sections discussed in this article.
              </p>
            </div>
            <Link
              to={`/builder?template=${post.recommendedTemplate}`}
              className="inline-flex shrink-0 items-center gap-2 border-2 border-ink bg-acid px-6 py-3 font-mono text-xs font-bold uppercase text-ink hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--color-ink)] transition-transform"
            >
              Use {post.recommendedTemplate.toUpperCase()} Template <Icon name="arrow" size={14} />
            </Link>
          </div>
        </div>

        {/* Related Guides */}
        <div className="mt-16 border-t-2 border-ink pt-10">
          <h2 className="font-display text-xl font-bold text-ink">Recommended Reading</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {related.map((rel) => (
              <div key={rel.slug} className="border border-ink/20 bg-card p-4 hover:border-ink transition-colors">
                <span className="font-mono text-[10px] font-bold text-pine uppercase">{rel.category}</span>
                <h4 className="mt-2 font-display text-sm font-bold text-ink">
                  <Link to={`/blog/${rel.slug}`} className="hover:underline">
                    {rel.title}
                  </Link>
                </h4>
                <span className="mt-3 block font-mono text-[10px] text-ink-soft">{rel.readTime}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
