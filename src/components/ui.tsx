import { useEffect, useRef, useState, type ReactNode } from "react";

/* ---------------- Inline SVG icon set ---------------- */
const PATHS: Record<string, ReactNode> = {
  logo: <><rect x="3" y="2" width="18" height="21" rx="2" fill="currentColor" opacity="0.15" /><rect x="3" y="2" width="18" height="21" rx="2" /><path d="M7.5 8h9M7.5 12h9M7.5 16h5" strokeLinecap="round" /></>,
  arrow: <path d="M4 12h15m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />,
  check: <path d="m4.5 12.5 5 5 10-11" strokeLinecap="round" strokeLinejoin="round" />,
  x: <path d="M5 5l14 14M19 5 5 19" strokeLinecap="round" />,
  download: <path d="M12 3v12m0 0 4.5-4.5M12 15 7.5 10.5M4 19h16" strokeLinecap="round" strokeLinejoin="round" />,
  link: <><path d="M10 14a4 4 0 0 0 6 .4l3-3a4 4 0 1 0-5.7-5.6L11.6 7.4" strokeLinecap="round" /><path d="M14 10a4 4 0 0 0-6-.4l-3 3a4 4 0 1 0 5.7 5.6l1.7-1.6" strokeLinecap="round" /></>,
  doc: <><path d="M6 2h8l4 4v16H6z" strokeLinejoin="round" /><path d="M14 2v4h4M9 12h6M9 16h6" strokeLinecap="round" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.7 2.6 4 5.7 4 9s-1.3 6.4-4 9c-2.7-2.6-4-5.7-4-9s1.3-6.4 4-9Z" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18" /></>,
  zap: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" strokeLinejoin="round" />,
  shield: <path d="M12 2 4.5 5v6c0 5 3.2 8.8 7.5 10.5C16.3 19.8 19.5 16 19.5 11V5L12 2Zm-3 10 2.2 2.2L15.5 10" strokeLinecap="round" strokeLinejoin="round" />,
  chev: <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" strokeLinecap="round" /></>,
  cloud: <path d="M6.5 18a4 4 0 0 1-.4-8A6 6 0 0 1 17.8 8.5 4.5 4.5 0 0 1 17 18H6.5Z" strokeLinejoin="round" />,
  star: <path d="m12 3 2.7 5.6 6.3.8-4.6 4.3 1.2 6.1L12 16.9 6.4 19.8l1.2-6.1L3 9.4l6.3-.8L12 3Z" strokeLinejoin="round" />,
  edit: <path d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17v3Zm9.5-12 3 3" strokeLinecap="round" strokeLinejoin="round" />,
  trash: <path d="M4 7h16M9 7V4h6v3m-9 0 1 13h10l1-13M10 11v6m4-6v6" strokeLinecap="round" strokeLinejoin="round" />,
  plus: <path d="M12 5v14M5 12h14" strokeLinecap="round" />,
  copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" /></>,
  sparkle: <path d="M12 3c.6 3.8 2.2 5.4 6 6-3.8.6-5.4 2.2-6 6-.6-3.8-2.2-5.4-6-6 3.8-.6 5.4-2.2 6-6ZM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" strokeLinejoin="round" />,
  gauge: <><path d="M4 18a9 9 0 1 1 16 0" strokeLinecap="round" /><path d="M12 18 16 11" strokeLinecap="round" /></>,
  flag: <path d="M5 21V4m0 1h13l-3 4 3 4H5" strokeLinecap="round" strokeLinejoin="round" />,
  external: <path d="M9 5H5v14h14v-4M14 4h6v6M20 4 11 13" strokeLinecap="round" strokeLinejoin="round" />,
  upload: <path d="M12 16V4m0 0-4 4m4-4 4 4M4 20h16" strokeLinecap="round" strokeLinejoin="round" />,
};

export function Icon({ name, size = 18, className = "" }: { name: keyof typeof PATHS | string; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={`shrink-0 ${className}`} aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}

/* ---------------- Scroll reveal ---------------- */
export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } }),
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`rv ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

/* ---------------- Score gauge ---------------- */
export function Gauge({ value, size = 132, label = "ATS score" }: { value: number; size?: number; label?: string }) {
  const [shown, setShown] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { setTimeout(() => setShown(value), 150); io.disconnect(); } });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  useEffect(() => { setShown(0); const t = setTimeout(() => setShown(value), 200); return () => clearTimeout(t); }, [value]);

  const r = 52;
  const circ = 2 * Math.PI * r;
  const arc = circ * 0.75;
  const color = shown >= 80 ? "var(--color-pine)" : shown >= 55 ? "#a8821a" : "var(--color-coral)";
  return (
    <div ref={ref} className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 128 128" width={size} height={size} style={{ transform: "rotate(135deg)" }}>
        <circle cx="64" cy="64" r={r} fill="none" stroke="var(--color-line)" strokeWidth="10" strokeDasharray={`${arc} ${circ}`} strokeLinecap="round" />
        <circle cx="64" cy="64" r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" className="gauge-arc" strokeDasharray={`${(arc * Math.max(shown, 0)) / 100} ${circ}`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-black leading-none" style={{ color }}>{Math.round(shown)}</span>
        <span className="kicker mt-1.5 text-ink-soft">{label}</span>
      </div>
    </div>
  );
}

/* ---------------- SEO helper (document head per route) ---------------- */
export function Seo({ title, description, path, jsonLd }: { title: string; description: string; path?: string; jsonLd?: object }) {
  useEffect(() => {
    document.title = title;
    const ensure = (sel: string, create: () => HTMLElement) => {
      let el = document.head.querySelector(sel) as HTMLElement | null;
      if (!el) { el = create(); document.head.appendChild(el); }
      return el;
    };
    ensure('meta[name="description"]', () => { const m = document.createElement("meta"); m.setAttribute("name", "description"); return m; })
      .setAttribute("content", description);
    ensure('meta[property="og:title"]', () => { const m = document.createElement("meta"); m.setAttribute("property", "og:title"); return m; })
      .setAttribute("content", title);
    ensure('meta[property="og:description"]', () => { const m = document.createElement("meta"); m.setAttribute("property", "og:description"); return m; })
      .setAttribute("content", description);
    ensure('meta[property="og:type"]', () => { const m = document.createElement("meta"); m.setAttribute("property", "og:type"); return m; })
      .setAttribute("content", "website");
    if (path) {
      const origin = window.location.origin;
      ensure('link[rel="canonical"]', () => { const l = document.createElement("link"); l.setAttribute("rel", "canonical"); return l; })
        .setAttribute("href", origin + path);
      ensure('meta[property="og:url"]', () => { const m = document.createElement("meta"); m.setAttribute("property", "og:url"); return m; })
        .setAttribute("content", origin + path);
    }
    let script = document.getElementById("page-jsonld") as HTMLScriptElement | null;
    if (jsonLd) {
      if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        script.id = "page-jsonld";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    } else if (script) {
      script.remove();
    }
  }, [title, description, path, jsonLd]);
  return null;
}

/* ---------------- Small atoms ---------------- */
export function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`kicker ${className}`}>{children}</p>;
}

export function Chip({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`inline-flex items-center gap-1.5 border border-ink/20 bg-card px-2.5 py-1 font-mono text-[11px] font-medium ${className}`}>{children}</span>;
}
