# seokit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build seokit.yaro-labs.com — a Next.js 15 App Router site with 6 SEO utility tools, a blog, and an about page.

**Architecture:** Next.js 15 App Router with Tailwind CSS v4; tool pages are client components that call `/api/fetch` and `/api/redirects` route handlers for CORS-safe fetching; blog is SSG via gray-matter + marked; no external UI libraries.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, Inter + JetBrains Mono (next/font/google), gray-matter, marked, GA4 via next/script.

---

## File Map

```
app/
  globals.css                    — design tokens + Tailwind v4 @import + prose styles
  layout.tsx                     — root layout: fonts, GA4 script, Navbar
  page.tsx                       — homepage: hero + tools grid
  about/page.tsx                 — about prose page
  blog/
    page.tsx                     — blog index (SSG)
    [slug]/page.tsx              — blog post (SSG + generateStaticParams)
  meta-analyzer/page.tsx         — Meta Analyzer tool (client component)
  sitemap-validator/page.tsx     — Sitemap Validator tool (client component)
  keyword-density/page.tsx       — Keyword Density tool (client component)
  robots-tester/page.tsx         — Robots.txt Tester tool (client component)
  redirect-checker/page.tsx      — Redirect Checker tool (client component)
  schema-validator/page.tsx      — Schema Validator tool (client component)
  api/
    fetch/route.ts               — GET ?url= proxy (avoids CORS)
    redirects/route.ts           — GET ?url= redirect chain tracer
  sitemap.ts                     — Next.js sitemap generator
  robots.ts                      — Next.js robots.txt generator

components/
  Navbar.tsx                     — dark nav, wordmark, links, emerald CTA
  ScoreRing.tsx                  — reusable SVG score ring
  ToolLayout.tsx                 — shared tool page wrapper (header + tabs + results slot)
  StatusBadge.tsx                — pass/warn/fail inline badge

lib/
  blog.ts                        — getAllPosts(), getPostBySlug() — server only
  metaParser.ts                  — parseMeta(html): MetaResult
  sitemapParser.ts               — parseSitemap(xml): SitemapResult
  keywordDensity.ts              — extractKeywords(text), extractVisibleText(html)
  robotsParser.ts                — parseRobots(txt), testPath()
  schemaExtractor.ts             — extractSchemas(html): SchemaResult[]

content/blog/
  seo-meta-tags-guide.md        — sample blog post
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `next.config.ts` (replace generated)
- Create: `app/globals.css` (replace generated)

- [ ] **Step 1: Bootstrap Next.js app**

```bash
cd /Users/a1111/Public/Prog/js/seokit
nvm use 22
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --yes
```

Expected: scaffold created, `node_modules/` present, `app/` directory created.

- [ ] **Step 2: Install extra dependencies**

```bash
cd /Users/a1111/Public/Prog/js/seokit
nvm use 22 && npm install gray-matter marked
```

- [ ] **Step 3: Replace next.config.ts**

Write this exact content to `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
};

export default nextConfig;
```

- [ ] **Step 4: Write app/globals.css**

Replace the generated file with:

```css
@import "tailwindcss";

:root {
  --nav-bg: #0f172a;
  --nav-text: #94a3b8;
  --body-bg: #f8fafc;
  --surface: #ffffff;
  --border: #e2e8f0;
  --border-2: #cbd5e1;
  --fg: #0f172a;
  --muted-fg: #64748b;
  --subtle: #94a3b8;
  --accent: #10b981;
  --accent-hover: #059669;
  --accent-light: #ecfdf5;
  --score-yellow: #f59e0b;
  --score-red: #ef4444;
  --radius: 6px;
}

* { box-sizing: border-box; }
body { background: var(--body-bg); color: var(--fg); }

/* Blog prose */
.prose-content h1, .prose-content h2, .prose-content h3 {
  color: var(--fg);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}
.prose-content h2 { font-size: 1.25rem; }
.prose-content h3 { font-size: 1.05rem; }
.prose-content p { margin-bottom: 1.25rem; color: var(--muted-fg); }
.prose-content ul, .prose-content ol { padding-left: 1.5rem; margin-bottom: 1.25rem; color: var(--muted-fg); }
.prose-content li { margin-bottom: 0.4rem; }
.prose-content code { font-family: var(--font-mono, monospace); font-size: 0.85em; background: var(--body-bg); padding: 0.1em 0.4em; border-radius: 3px; color: var(--accent); }
.prose-content pre { background: var(--fg); color: #e2e8f0; padding: 1.25rem; border-radius: var(--radius); overflow-x: auto; margin-bottom: 1.25rem; font-family: var(--font-mono, monospace); font-size: 0.85rem; line-height: 1.6; }
.prose-content pre code { background: none; color: inherit; padding: 0; }
.prose-content a { color: var(--accent); text-decoration: underline; }
.prose-content strong { color: var(--fg); font-weight: 700; }
```

- [ ] **Step 5: Verify build compiles**

```bash
nvm use 22 && npm run build 2>&1 | tail -20
```

Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
cd /Users/a1111/Public/Prog/js/seokit
git add -A
git commit -m "feat: task 1 - project scaffold"
```

---

## Task 2: Navbar Component

**Files:**
- Create: `components/Navbar.tsx`

- [ ] **Step 1: Create components/Navbar.tsx**

```tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Tools" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      style={{ background: "var(--nav-bg)", height: 60 }}
      className="flex items-center justify-between px-6 w-full sticky top-0 z-50"
    >
      <Link
        href="/"
        className="text-white font-semibold text-base tracking-tight"
      >
        seo<span style={{ color: "var(--accent)" }}>kit</span>
      </Link>

      <div className="flex gap-1">
        {links.map((l) => {
          const active =
            l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1 rounded text-sm transition-colors duration-150"
              style={{ color: active ? "#ffffff" : "var(--nav-text)" }}
            >
              {l.label}
            </Link>
          );
        })}
      </div>

      <Link
        href="/#tools"
        className="text-white text-sm font-semibold px-4 py-2 rounded transition-colors duration-150 hover:opacity-90"
        style={{ background: "var(--accent)", borderRadius: "var(--radius)" }}
      >
        Try a tool →
      </Link>
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/a1111/Public/Prog/js/seokit
git add components/Navbar.tsx
git commit -m "feat: task 2 - navbar component"
```

---

## Task 3: Root Layout + Homepage

**Files:**
- Modify: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `components/ScoreRing.tsx`

- [ ] **Step 1: Write components/ScoreRing.tsx**

```tsx
interface ScoreRingProps {
  score: number;
  label: string;
  size?: number;
  strokeWidth?: number;
}

function scoreColor(score: number): string {
  if (score >= 80) return "#10b981";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

export default function ScoreRing({
  score,
  label,
  size = 80,
  strokeWidth = 6,
}: ScoreRingProps) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = scoreColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            transform: "rotate(90deg)",
            transformOrigin: `${size / 2}px ${size / 2}px`,
            fontFamily: "var(--font-mono, monospace)",
            fontSize: size * 0.22,
            fontWeight: 700,
            fill: color,
          }}
        >
          {score}
        </text>
      </svg>
      <span className="text-xs font-medium" style={{ color: "var(--muted-fg)" }}>
        {label}
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Write app/layout.tsx**

```tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "seokit — SEO Tools for Developers",
  description:
    "Six free SEO tools: meta analyzer, sitemap validator, keyword density, robots tester, redirect checker, schema validator.",
  metadataBase: new URL("https://seokit.yaro-labs.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}>
        <Navbar />
        <main>{children}</main>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PLACEHOLDER"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-PLACEHOLDER');`}
        </Script>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Write app/page.tsx**

```tsx
import Link from "next/link";
import ScoreRing from "@/components/ScoreRing";

const tools = [
  {
    num: "01",
    name: "Meta Analyzer",
    slug: "/meta-analyzer",
    desc: "Analyze title, description, OG tags, Twitter cards, and canonical URLs from any page URL or pasted HTML.",
  },
  {
    num: "02",
    name: "Sitemap Validator",
    slug: "/sitemap-validator",
    desc: "Validate XML sitemaps — check structure, URL count, lastmod dates, and common errors.",
  },
  {
    num: "03",
    name: "Keyword Density",
    slug: "/keyword-density",
    desc: "Measure keyword frequency and density from any URL or text. Find over-optimized or missing terms.",
  },
  {
    num: "04",
    name: "Robots.txt Tester",
    slug: "/robots-tester",
    desc: "Fetch and parse robots.txt files. Test which paths are allowed or blocked for any user-agent.",
  },
  {
    num: "05",
    name: "Redirect Checker",
    slug: "/redirect-checker",
    desc: "Trace redirect chains from any URL — see each hop, status code, and final destination.",
  },
  {
    num: "06",
    name: "Schema Validator",
    slug: "/schema-validator",
    desc: "Extract and validate structured data (JSON-LD, Microdata) from any page URL or raw HTML.",
  },
];

const rings = [
  { score: 94, label: "Performance" },
  { score: 78, label: "SEO" },
  { score: 41, label: "Accessibility" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section
        style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}
        className="py-24 px-6"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h1
              className="text-4xl font-extrabold leading-tight mb-4"
              style={{ letterSpacing: "-0.03em", color: "var(--fg)" }}
            >
              Rank smarter.{" "}
              <span style={{ color: "var(--accent)" }}>Ship faster.</span>
            </h1>
            <p
              className="text-base mb-8 leading-relaxed"
              style={{ color: "var(--muted-fg)", maxWidth: 400 }}
            >
              Six SEO tools for auditing, previewing, and fixing your pages. No
              account, no crawl credits, no waiting.
            </p>
            <Link
              href="#tools"
              className="inline-block text-white font-semibold text-sm px-5 py-3 rounded transition-colors duration-150 hover:opacity-90"
              style={{ background: "var(--accent)", borderRadius: "var(--radius)" }}
            >
              Browse tools
            </Link>
          </div>

          {/* Score rings panel */}
          <div
            className="rounded-lg overflow-hidden"
            style={{
              border: "1px solid var(--border-2)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div
              className="px-4 py-3 text-xs font-medium uppercase tracking-widest"
              style={{
                fontFamily: "var(--font-mono, monospace)",
                color: "var(--subtle)",
                background: "var(--body-bg)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              Example audit results
            </div>
            <div className="flex justify-around py-8 px-4 bg-white">
              {rings.map((r) => (
                <ScoreRing key={r.label} score={r.score} label={r.label} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section
        id="tools"
        className="py-12 px-6"
        style={{ background: "var(--body-bg)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div
            className="flex items-baseline justify-between mb-4 pb-3"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--subtle)" }}
            >
              SEO TOOLS
            </span>
            <span
              className="text-xs"
              style={{
                fontFamily: "var(--font-mono, monospace)",
                color: "var(--subtle)",
              }}
            >
              6 tools
            </span>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 rounded-lg overflow-hidden"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border-2)",
            }}
          >
            {tools.map((tool, i) => {
              const isRightCol = i % 2 === 1;
              const isLastRow = i >= tools.length - 2;
              return (
                <Link
                  key={tool.slug}
                  href={tool.slug}
                  className="block p-6 relative transition-colors duration-150 hover:bg-[var(--accent-light)]"
                  style={{
                    borderRight: isRightCol
                      ? "none"
                      : "1px solid var(--border)",
                    borderBottom: isLastRow
                      ? "none"
                      : "1px solid var(--border)",
                  }}
                >
                  <div
                    className="text-sm font-semibold mb-3"
                    style={{
                      fontFamily: "var(--font-mono, monospace)",
                      color: "var(--border-2)",
                    }}
                  >
                    {tool.num}
                  </div>
                  <div
                    className="text-base font-semibold mb-2"
                    style={{ color: "var(--fg)" }}
                  >
                    {tool.name}
                  </div>
                  <div
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--muted-fg)" }}
                  >
                    {tool.desc}
                  </div>
                  <span
                    className="absolute bottom-4 right-5 text-base"
                    style={{ color: "var(--border-2)" }}
                  >
                    →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 4: Verify build**

```bash
cd /Users/a1111/Public/Prog/js/seokit && nvm use 22 && npm run build 2>&1 | tail -20
```

Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
cd /Users/a1111/Public/Prog/js/seokit
git add -A
git commit -m "feat: task 3 - root layout and homepage"
```

---

## Task 4: API Route Handlers

**Files:**
- Create: `app/api/fetch/route.ts`
- Create: `app/api/redirects/route.ts`

- [ ] **Step 1: Write app/api/fetch/route.ts**

```ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get("url");
  if (!rawUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return NextResponse.json({ error: "Only http/https allowed" }, { status: 400 });
  }

  try {
    const res = await fetch(parsed.toString(), {
      headers: { "User-Agent": "seokit-bot/1.0" },
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Fetch failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
```

- [ ] **Step 2: Write app/api/redirects/route.ts**

```ts
import { NextRequest, NextResponse } from "next/server";

interface Hop {
  url: string;
  status: number;
  ms: number;
}

export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get("url");
  if (!rawUrl) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  let current: string;
  try {
    current = new URL(rawUrl).toString();
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const hops: Hop[] = [];
  const MAX_HOPS = 10;

  while (hops.length < MAX_HOPS) {
    const t0 = Date.now();
    let res: Response;
    try {
      res = await fetch(current, {
        method: "HEAD",
        redirect: "manual",
        headers: { "User-Agent": "seokit-bot/1.0" },
        signal: AbortSignal.timeout(8_000),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Fetch failed";
      return NextResponse.json({ error: msg, hops }, { status: 502 });
    }
    const ms = Date.now() - t0;
    hops.push({ url: current, status: res.status, ms });

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      if (!location) break;
      try {
        current = new URL(location, current).toString();
      } catch {
        break;
      }
    } else {
      break;
    }
  }

  return NextResponse.json({ hops });
}
```

- [ ] **Step 3: Commit**

```bash
cd /Users/a1111/Public/Prog/js/seokit
git add app/api/
git commit -m "feat: task 4 - API route handlers"
```

---

## Task 5: Shared Components + Lib Parsers

**Files:**
- Create: `components/StatusBadge.tsx`
- Create: `components/ToolLayout.tsx`
- Create: `lib/metaParser.ts`
- Create: `lib/sitemapParser.ts`
- Create: `lib/keywordDensity.ts`
- Create: `lib/robotsParser.ts`
- Create: `lib/schemaExtractor.ts`

- [ ] **Step 1: Write components/StatusBadge.tsx**

```tsx
type Status = "pass" | "warn" | "fail";

interface StatusBadgeProps {
  status: Status;
  label?: string;
}

const config: Record<Status, { icon: string; bg: string; color: string }> = {
  pass: { icon: "✓", bg: "#ecfdf5", color: "#10b981" },
  warn: { icon: "⚠", bg: "#fffbeb", color: "#d97706" },
  fail: { icon: "✗", bg: "#fef2f2", color: "#ef4444" },
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const c = config[status];
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded whitespace-nowrap"
      style={{
        background: c.bg,
        color: c.color,
        fontFamily: "var(--font-mono, monospace)",
      }}
    >
      {c.icon} {label ?? status}
    </span>
  );
}
```

- [ ] **Step 2: Write components/ToolLayout.tsx**

```tsx
"use client";

interface Tab {
  key: string;
  label: string;
}

interface ToolLayoutProps {
  title: string;
  description: string;
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
  inputArea: React.ReactNode;
  resultsArea: React.ReactNode;
}

export default function ToolLayout({
  title,
  description,
  tabs,
  activeTab,
  onTabChange,
  inputArea,
  resultsArea,
}: ToolLayoutProps) {
  return (
    <div
      style={{
        background: "var(--body-bg)",
        minHeight: "calc(100vh - 60px)",
      }}
    >
      {/* Tool header */}
      <div
        className="px-6 py-5"
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border-2)",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--fg)", letterSpacing: "-0.03em" }}
          >
            {title}
          </h1>
          <p className="text-sm" style={{ color: "var(--muted-fg)" }}>
            {description}
          </p>
        </div>
      </div>

      {/* Input tabs */}
      <div
        className="px-6 py-5"
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border-2)",
        }}
      >
        <div className="max-w-3xl mx-auto">
          {tabs.length > 1 && (
            <div className="flex gap-1 mb-5">
              {tabs.map((t) => {
                const active = t.key === activeTab;
                return (
                  <button
                    key={t.key}
                    onClick={() => onTabChange(t.key)}
                    className="text-sm px-3 py-1.5 rounded transition-colors duration-150"
                    style={{
                      background: active ? "var(--accent-light)" : "transparent",
                      color: active ? "var(--accent)" : "var(--subtle)",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: active ? 600 : 500,
                    }}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          )}
          {inputArea}
        </div>
      </div>

      {/* Results */}
      {resultsArea && (
        <div className="px-6 py-6">
          <div className="max-w-3xl mx-auto">{resultsArea}</div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Write lib/metaParser.ts**

```ts
export interface MetaTag {
  key: string;
  value: string;
  status: "pass" | "warn" | "fail";
  note: string;
}

export interface MetaResult {
  score: number;
  titleLength: number;
  descLength: number;
  tags: MetaTag[];
}

export function parseMeta(html: string): MetaResult {
  const get = (pattern: RegExp) => {
    const m = html.match(pattern);
    return m ? m[1].replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim() : "";
  };

  const title = get(/<title[^>]*>([^<]*)<\/title>/i);
  const desc =
    get(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ||
    get(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  const ogTitle =
    get(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i) ||
    get(/<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:title["']/i);
  const ogDesc =
    get(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i) ||
    get(/<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:description["']/i);
  const ogImage =
    get(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i) ||
    get(/<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:image["']/i);
  const twCard =
    get(/<meta[^>]+name=["']twitter:card["'][^>]+content=["']([^"']*)["']/i) ||
    get(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']twitter:card["']/i);
  const canonical =
    get(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i) ||
    get(/<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i);

  const tLen = title.length;
  const dLen = desc.length;

  const tags: MetaTag[] = [
    {
      key: "title",
      value: title || "—",
      status: !title ? "fail" : tLen >= 50 && tLen <= 60 ? "pass" : "warn",
      note: !title
        ? "Missing"
        : tLen < 50
        ? "Too short (<50 chars)"
        : tLen > 60
        ? "Too long (>60 chars)"
        : "Good length",
    },
    {
      key: "description",
      value: desc ? desc.slice(0, 80) + (desc.length > 80 ? "…" : "") : "—",
      status: !desc ? "fail" : dLen >= 120 && dLen <= 160 ? "pass" : "warn",
      note: !desc
        ? "Missing"
        : dLen < 120
        ? "Too short (<120 chars)"
        : dLen > 160
        ? "Too long (>160 chars)"
        : "Good length",
    },
    {
      key: "og:title",
      value: ogTitle || "—",
      status: ogTitle ? "pass" : "fail",
      note: ogTitle ? "Present" : "Missing",
    },
    {
      key: "og:description",
      value: ogDesc
        ? ogDesc.slice(0, 80) + (ogDesc.length > 80 ? "…" : "")
        : "—",
      status: ogDesc ? "pass" : "fail",
      note: ogDesc ? "Present" : "Missing",
    },
    {
      key: "og:image",
      value: ogImage || "—",
      status: ogImage ? "pass" : "warn",
      note: ogImage ? "Present" : "Missing (recommended)",
    },
    {
      key: "twitter:card",
      value: twCard || "—",
      status: twCard ? "pass" : "warn",
      note: twCard ? "Present" : "Missing (recommended)",
    },
    {
      key: "canonical",
      value: canonical || "—",
      status: canonical ? "pass" : "warn",
      note: canonical ? "Present" : "Not set",
    },
  ];

  const passes = tags.filter((t) => t.status === "pass").length;
  const score = Math.round((passes / tags.length) * 100);

  return { score, titleLength: tLen, descLength: dLen, tags };
}
```

- [ ] **Step 4: Write lib/sitemapParser.ts**

```ts
export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

export interface SitemapResult {
  valid: boolean;
  urlCount: number;
  hasUrlset: boolean;
  hasLastmod: boolean;
  issues: string[];
  urls: SitemapUrl[];
}

const VALID_CHANGEFREQ = [
  "always","hourly","daily","weekly","monthly","yearly","never",
];

export function parseSitemap(xml: string): SitemapResult {
  const issues: string[] = [];
  const hasUrlset = /<urlset/i.test(xml);
  if (!hasUrlset) issues.push("Missing <urlset> root element");

  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((m) =>
    m[1].trim()
  );
  const lastmods = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/gi)].map(
    (m) => m[1].trim()
  );
  const changefreqs = [
    ...xml.matchAll(/<changefreq>([^<]+)<\/changefreq>/gi),
  ].map((m) => m[1].trim());
  const priorities = [
    ...xml.matchAll(/<priority>([^<]+)<\/priority>/gi),
  ].map((m) => m[1].trim());

  const hasLastmod = lastmods.length > 0;

  changefreqs.forEach((cf) => {
    if (!VALID_CHANGEFREQ.includes(cf.toLowerCase())) {
      issues.push(`Invalid changefreq value: "${cf}"`);
    }
  });

  if (locs.length === 0) issues.push("No <url> entries found");

  const urls: SitemapUrl[] = locs.map((loc, i) => ({
    loc,
    lastmod: lastmods[i],
    changefreq: changefreqs[i],
    priority: priorities[i],
  }));

  return { valid: issues.length === 0, urlCount: locs.length, hasUrlset, hasLastmod, issues, urls };
}
```

- [ ] **Step 5: Write lib/keywordDensity.ts**

```ts
export interface KeywordRow {
  word: string;
  count: number;
  density: string;
}

const STOP_WORDS = new Set([
  "a","an","the","and","or","but","in","on","at","to","for","of","with",
  "by","from","is","are","was","were","be","been","being","have","has",
  "had","do","does","did","will","would","could","should","may","might",
  "it","its","this","that","these","those","i","we","you","he","she","they",
  "my","our","your","his","her","their","not","no","as","so","if","then",
  "than","more","also","about","up","out","into","over","after","before",
  "which","who","what","when","where","how","all","one","two","three",
]);

export function extractVisibleText(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractKeywords(text: string, topN = 20): KeywordRow[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  const freq: Record<string, number> = {};
  for (const w of words) {
    freq[w] = (freq[w] ?? 0) + 1;
  }

  const total = words.length || 1;
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word, count]) => ({
      word,
      count,
      density: ((count / total) * 100).toFixed(2) + "%",
    }));
}
```

- [ ] **Step 6: Write lib/robotsParser.ts**

```ts
export interface RobotsRule {
  userAgent: string;
  allowed: string[];
  disallowed: string[];
}

export interface RobotsResult {
  rules: RobotsRule[];
  sitemaps: string[];
  raw: string;
}

export function parseRobots(txt: string): RobotsResult {
  const lines = txt.split(/\r?\n/);
  const rules: RobotsRule[] = [];
  const sitemaps: string[] = [];
  let current: RobotsRule | null = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim().toLowerCase();
    const value = line.slice(colonIdx + 1).trim();

    if (key === "user-agent") {
      if (!current || current.allowed.length || current.disallowed.length) {
        current = { userAgent: value, allowed: [], disallowed: [] };
        rules.push(current);
      } else {
        current.userAgent = value;
      }
    } else if (key === "allow" && current) {
      current.allowed.push(value);
    } else if (key === "disallow" && current) {
      if (value) current.disallowed.push(value);
    } else if (key === "sitemap") {
      sitemaps.push(value);
    }
  }

  return { rules, sitemaps, raw: txt };
}

export function testPath(
  result: RobotsResult,
  userAgent: string,
  path: string
): "allowed" | "blocked" {
  const ua = userAgent.toLowerCase();
  const specific = result.rules.find(
    (r) => r.userAgent.toLowerCase() === ua
  );
  const wildcard = result.rules.find((r) => r.userAgent === "*");
  const rule = specific ?? wildcard;
  if (!rule) return "allowed";

  const matchesPattern = (pattern: string) => {
    if (!pattern) return false;
    const escaped = pattern
      .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
      .replace(/\*/g, ".*");
    return new RegExp("^" + escaped).test(path);
  };

  const isAllowed = rule.allowed.some(matchesPattern);
  const isDisallowed = rule.disallowed.some(matchesPattern);

  if (isAllowed) return "allowed";
  if (isDisallowed) return "blocked";
  return "allowed";
}
```

- [ ] **Step 7: Write lib/schemaExtractor.ts**

```ts
export interface SchemaResult {
  type: "json-ld" | "microdata";
  schemaType: string;
  data: unknown;
  issues: string[];
}

function extractJsonLd(html: string): SchemaResult[] {
  const results: SchemaResult[] = [];
  const matches = [
    ...html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
    ),
  ];
  for (const m of matches) {
    try {
      const data = JSON.parse(m[1].trim());
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        const schemaType = item["@type"] ?? "Unknown";
        const issues: string[] = [];
        if (!item["@context"]) issues.push("Missing @context");
        if (!item["@type"]) issues.push("Missing @type");
        results.push({ type: "json-ld", schemaType, data: item, issues });
      }
    } catch {
      results.push({
        type: "json-ld",
        schemaType: "Invalid JSON",
        data: null,
        issues: ["JSON parse error — invalid JSON-LD block"],
      });
    }
  }
  return results;
}

function extractMicrodata(html: string): SchemaResult[] {
  const results: SchemaResult[] = [];
  const matches = [...html.matchAll(/itemtype=["']([^"']*)["']/gi)];
  for (const m of matches) {
    const schemaType = m[1].split("/").pop() ?? "Unknown";
    results.push({
      type: "microdata",
      schemaType,
      data: { itemtype: m[1] },
      issues: [],
    });
  }
  return results;
}

export function extractSchemas(html: string): SchemaResult[] {
  return [...extractJsonLd(html), ...extractMicrodata(html)];
}
```

- [ ] **Step 8: Commit**

```bash
cd /Users/a1111/Public/Prog/js/seokit
git add components/ lib/
git commit -m "feat: task 5 - shared components and lib parsers"
```

---

## Task 6: Meta Analyzer Tool Page

**Files:**
- Create: `app/meta-analyzer/page.tsx`

- [ ] **Step 1: Write app/meta-analyzer/page.tsx**

```tsx
"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import StatusBadge from "@/components/StatusBadge";
import { parseMeta, MetaResult } from "@/lib/metaParser";
import { extractVisibleText } from "@/lib/keywordDensity";

const TABS = [
  { key: "url", label: "Enter URL" },
  { key: "html", label: "Paste HTML" },
];

export default function MetaAnalyzerPage() {
  const [tab, setTab] = useState("url");
  const [url, setUrl] = useState("");
  const [html, setHtml] = useState("");
  const [result, setResult] = useState<MetaResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchAndAnalyze() {
    if (!url) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch(`/api/fetch?url=${encodeURIComponent(url)}`);
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error ?? "Fetch failed");
        return;
      }
      const text = await res.text();
      setResult(parseMeta(text));
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  const inputArea = (
    <>
      {tab === "url" ? (
        <div className="flex overflow-hidden rounded" style={{ border: "1px solid var(--border-2)" }}>
          <input
            type="url" value={url} onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchAndAnalyze()}
            placeholder="https://example.com/page"
            className="flex-1 px-4 py-3 text-sm outline-none bg-transparent"
            style={{ fontFamily: "var(--font-mono)", color: "var(--fg)", minWidth: 0 }}
          />
          <button onClick={fetchAndAnalyze} disabled={loading}
            className="px-5 py-3 text-sm font-semibold text-white"
            style={{ background: "var(--accent)", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
            {loading ? "Fetching…" : "Fetch & Analyze →"}
          </button>
        </div>
      ) : (
        <div>
          <textarea value={html} onChange={(e) => setHtml(e.target.value)}
            placeholder="Paste full HTML or just <head> meta tags…" rows={6}
            className="w-full rounded px-4 py-3 text-sm outline-none resize-y"
            style={{ fontFamily: "var(--font-mono)", background: "var(--body-bg)", border: "1px solid var(--border-2)", color: "var(--fg)" }}
          />
          <div className="flex gap-2 mt-2">
            <button onClick={() => { setError(""); setResult(parseMeta(html)); }}
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold text-white rounded"
              style={{ background: "var(--accent)", border: "none", cursor: "pointer" }}>
              Analyze HTML →
            </button>
            <button onClick={() => { setHtml(""); setResult(null); }}
              className="px-4 py-2 text-sm rounded"
              style={{ border: "1px solid var(--border-2)", background: "transparent", color: "var(--muted-fg)", cursor: "pointer" }}>
              Clear
            </button>
          </div>
        </div>
      )}
      {error && (
        <p className="mt-3 text-sm" style={{ color: "var(--score-red)" }}>{error}</p>
      )}
    </>
  );

  const resultsArea = result ? (
    <div>
      <p className="text-xs font-medium uppercase tracking-widest mb-4"
        style={{ fontFamily: "var(--font-mono)", color: "var(--subtle)" }}>
        Results
      </p>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          {
            label: "Overall score",
            value: `${result.score} / 100`,
            color: result.score >= 80 ? "var(--accent)" : result.score >= 50 ? "var(--score-yellow)" : "var(--score-red)",
          },
          {
            label: "Title length",
            value: `${result.titleLength} chars`,
            color: result.titleLength >= 50 && result.titleLength <= 60 ? "var(--accent)" : "var(--score-yellow)",
            sub: "Ideal: 50–60",
          },
          {
            label: "Description length",
            value: `${result.descLength} chars`,
            color: result.descLength >= 120 && result.descLength <= 160 ? "var(--accent)" : "var(--score-yellow)",
            sub: "Ideal: 120–160",
          },
        ].map((c) => (
          <div key={c.label} className="rounded p-4"
            style={{ background: "var(--surface)", border: "1px solid var(--border-2)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--subtle)" }}>{c.label}</p>
            <p className="text-lg font-bold" style={{ color: c.color }}>{c.value}</p>
            {c.sub && <p className="text-xs mt-0.5" style={{ color: "var(--subtle)" }}>{c.sub}</p>}
          </div>
        ))}
      </div>
      <div className="rounded overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border-2)" }}>
        {result.tags.map((tag, i) => (
          <div key={tag.key} className="grid items-center gap-3 px-4 py-3"
            style={{
              gridTemplateColumns: "120px 1fr auto",
              borderBottom: i < result.tags.length - 1 ? "1px solid var(--border)" : "none",
            }}>
            <span className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--subtle)" }}>{tag.key}</span>
            <span className="text-sm font-medium truncate" style={{ color: "var(--fg)" }}>{tag.value}</span>
            <StatusBadge status={tag.status} label={tag.note} />
          </div>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <ToolLayout
      title="Meta Analyzer"
      description="Audit title, description, OG tags, Twitter cards, and canonical URLs from any page URL or pasted HTML."
      tabs={TABS} activeTab={tab} onTabChange={setTab}
      inputArea={inputArea} resultsArea={resultsArea}
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/a1111/Public/Prog/js/seokit
git add app/meta-analyzer/
git commit -m "feat: task 6 - meta analyzer tool page"
```

---

## Task 7: Sitemap Validator Tool Page

**Files:**
- Create: `app/sitemap-validator/page.tsx`

- [ ] **Step 1: Write app/sitemap-validator/page.tsx**

```tsx
"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { parseSitemap, SitemapResult } from "@/lib/sitemapParser";

const TABS = [
  { key: "url", label: "Enter URL" },
  { key: "xml", label: "Paste XML" },
];

export default function SitemapValidatorPage() {
  const [tab, setTab] = useState("url");
  const [url, setUrl] = useState("");
  const [xml, setXml] = useState("");
  const [result, setResult] = useState<SitemapResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchAndParse() {
    if (!url) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch(`/api/fetch?url=${encodeURIComponent(url)}`);
      if (!res.ok) { setError("Fetch failed"); return; }
      const text = await res.text();
      setResult(parseSitemap(text));
    } catch { setError("Network error"); }
    finally { setLoading(false); }
  }

  const inputArea = (
    <>
      {tab === "url" ? (
        <div className="flex overflow-hidden rounded" style={{ border: "1px solid var(--border-2)" }}>
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchAndParse()}
            placeholder="https://example.com/sitemap.xml"
            className="flex-1 px-4 py-3 text-sm outline-none bg-transparent"
            style={{ fontFamily: "var(--font-mono)", color: "var(--fg)", minWidth: 0 }}
          />
          <button onClick={fetchAndParse} disabled={loading}
            className="px-5 py-3 text-sm font-semibold text-white"
            style={{ background: "var(--accent)", border: "none", cursor: "pointer" }}>
            {loading ? "Fetching…" : "Validate →"}
          </button>
        </div>
      ) : (
        <div>
          <textarea value={xml} onChange={(e) => setXml(e.target.value)}
            placeholder="Paste sitemap XML here…" rows={8}
            className="w-full rounded px-4 py-3 text-sm outline-none resize-y"
            style={{ fontFamily: "var(--font-mono)", background: "var(--body-bg)", border: "1px solid var(--border-2)", color: "var(--fg)" }}
          />
          <div className="flex gap-2 mt-2">
            <button onClick={() => { setError(""); setResult(parseSitemap(xml)); }}
              className="px-4 py-2 text-sm font-semibold text-white rounded"
              style={{ background: "var(--accent)", border: "none", cursor: "pointer" }}>
              Validate XML →
            </button>
          </div>
        </div>
      )}
      {error && <p className="mt-3 text-sm" style={{ color: "var(--score-red)" }}>{error}</p>}
    </>
  );

  const resultsArea = result ? (
    <div>
      <p className="text-xs font-medium uppercase tracking-widest mb-4"
        style={{ fontFamily: "var(--font-mono)", color: "var(--subtle)" }}>Results</p>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Valid", value: result.valid ? "Yes" : "No", color: result.valid ? "var(--accent)" : "var(--score-red)" },
          { label: "URL Count", value: String(result.urlCount), color: result.urlCount > 0 ? "var(--accent)" : "var(--score-red)" },
          { label: "Has Lastmod", value: result.hasLastmod ? "Yes" : "No", color: result.hasLastmod ? "var(--accent)" : "var(--score-yellow)" },
        ].map((c) => (
          <div key={c.label} className="rounded p-4" style={{ background: "var(--surface)", border: "1px solid var(--border-2)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--subtle)" }}>{c.label}</p>
            <p className="text-lg font-bold" style={{ color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>
      {result.issues.length > 0 && (
        <div className="mb-4 rounded p-4" style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
          <p className="text-sm font-semibold mb-2" style={{ color: "var(--score-red)" }}>Issues found</p>
          <ul className="list-disc list-inside text-sm" style={{ color: "var(--score-red)" }}>
            {result.issues.map((iss, i) => <li key={i}>{iss}</li>)}
          </ul>
        </div>
      )}
      <div className="rounded overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border-2)" }}>
        <div className="grid px-4 py-2 text-xs font-semibold uppercase tracking-widest"
          style={{ gridTemplateColumns: "1fr 120px 100px 70px", color: "var(--subtle)", borderBottom: "1px solid var(--border)", fontFamily: "var(--font-mono)" }}>
          <span>URL</span><span>Lastmod</span><span>Changefreq</span><span>Priority</span>
        </div>
        {result.urls.slice(0, 50).map((u, i) => (
          <div key={i} className="grid px-4 py-2.5 text-xs"
            style={{ gridTemplateColumns: "1fr 120px 100px 70px", borderBottom: i < Math.min(result.urls.length, 50) - 1 ? "1px solid var(--border)" : "none", color: "var(--fg)" }}>
            <span className="truncate pr-4" style={{ fontFamily: "var(--font-mono)" }}>{u.loc}</span>
            <span style={{ color: "var(--muted-fg)" }}>{u.lastmod ?? "—"}</span>
            <span style={{ color: "var(--muted-fg)" }}>{u.changefreq ?? "—"}</span>
            <span style={{ color: "var(--muted-fg)" }}>{u.priority ?? "—"}</span>
          </div>
        ))}
        {result.urls.length > 50 && (
          <div className="px-4 py-2 text-xs" style={{ color: "var(--subtle)", borderTop: "1px solid var(--border)" }}>
            …and {result.urls.length - 50} more URLs
          </div>
        )}
      </div>
    </div>
  ) : null;

  return (
    <ToolLayout
      title="Sitemap Validator"
      description="Validate XML sitemaps — check structure, URL count, lastmod dates, and common errors."
      tabs={TABS} activeTab={tab} onTabChange={setTab}
      inputArea={inputArea} resultsArea={resultsArea}
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/a1111/Public/Prog/js/seokit
git add app/sitemap-validator/
git commit -m "feat: task 7 - sitemap validator tool page"
```

---

## Task 8: Keyword Density Tool Page

**Files:**
- Create: `app/keyword-density/page.tsx`

- [ ] **Step 1: Write app/keyword-density/page.tsx**

```tsx
"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { extractKeywords, extractVisibleText, KeywordRow } from "@/lib/keywordDensity";

const TABS = [
  { key: "url", label: "Enter URL" },
  { key: "text", label: "Paste Text" },
];

export default function KeywordDensityPage() {
  const [tab, setTab] = useState("url");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [rows, setRows] = useState<KeywordRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchAndAnalyze() {
    if (!url) return;
    setLoading(true); setError(""); setRows([]);
    try {
      const res = await fetch(`/api/fetch?url=${encodeURIComponent(url)}`);
      if (!res.ok) { setError("Fetch failed"); return; }
      const html = await res.text();
      setRows(extractKeywords(extractVisibleText(html)));
    } catch { setError("Network error"); }
    finally { setLoading(false); }
  }

  const inputArea = (
    <>
      {tab === "url" ? (
        <div className="flex overflow-hidden rounded" style={{ border: "1px solid var(--border-2)" }}>
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchAndAnalyze()}
            placeholder="https://example.com/page"
            className="flex-1 px-4 py-3 text-sm outline-none bg-transparent"
            style={{ fontFamily: "var(--font-mono)", color: "var(--fg)", minWidth: 0 }}
          />
          <button onClick={fetchAndAnalyze} disabled={loading}
            className="px-5 py-3 text-sm font-semibold text-white"
            style={{ background: "var(--accent)", border: "none", cursor: "pointer" }}>
            {loading ? "Analyzing…" : "Analyze →"}
          </button>
        </div>
      ) : (
        <div>
          <textarea value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Paste text or HTML to analyze keyword density…" rows={6}
            className="w-full rounded px-4 py-3 text-sm outline-none resize-y"
            style={{ fontFamily: "var(--font-mono)", background: "var(--body-bg)", border: "1px solid var(--border-2)", color: "var(--fg)" }}
          />
          <div className="flex gap-2 mt-2">
            <button onClick={() => { setError(""); setRows(extractKeywords(extractVisibleText(text))); }}
              className="px-4 py-2 text-sm font-semibold text-white rounded"
              style={{ background: "var(--accent)", border: "none", cursor: "pointer" }}>
              Analyze Text →
            </button>
          </div>
        </div>
      )}
      {error && <p className="mt-3 text-sm" style={{ color: "var(--score-red)" }}>{error}</p>}
    </>
  );

  const resultsArea = rows.length > 0 ? (
    <div>
      <p className="text-xs font-medium uppercase tracking-widest mb-4"
        style={{ fontFamily: "var(--font-mono)", color: "var(--subtle)" }}>Top Keywords</p>
      <div className="rounded overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border-2)" }}>
        <div className="grid px-4 py-2 text-xs font-semibold uppercase tracking-widest"
          style={{ gridTemplateColumns: "1fr 80px 80px", color: "var(--subtle)", borderBottom: "1px solid var(--border)", fontFamily: "var(--font-mono)" }}>
          <span>Keyword</span><span>Count</span><span>Density</span>
        </div>
        {rows.map((r, i) => (
          <div key={r.word} className="grid px-4 py-2.5 text-sm items-center"
            style={{ gridTemplateColumns: "1fr 80px 80px", borderBottom: i < rows.length - 1 ? "1px solid var(--border)" : "none" }}>
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--fg)" }}>{r.word}</span>
            <span style={{ color: "var(--muted-fg)" }}>{r.count}</span>
            <span style={{ color: "var(--accent)", fontWeight: 600 }}>{r.density}</span>
          </div>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <ToolLayout
      title="Keyword Density"
      description="Measure keyword frequency and density from any URL or text. Find over-optimized or missing terms."
      tabs={TABS} activeTab={tab} onTabChange={setTab}
      inputArea={inputArea} resultsArea={resultsArea}
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/a1111/Public/Prog/js/seokit
git add app/keyword-density/
git commit -m "feat: task 8 - keyword density tool page"
```

---

## Task 9: Robots.txt Tester Tool Page

**Files:**
- Create: `app/robots-tester/page.tsx`

- [ ] **Step 1: Write app/robots-tester/page.tsx**

```tsx
"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { parseRobots, testPath, RobotsResult } from "@/lib/robotsParser";

const TABS = [{ key: "url", label: "Enter URL" }];

export default function RobotsTesterPage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<RobotsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [testUa, setTestUa] = useState("Googlebot");
  const [testPathInput, setTestPathInput] = useState("/");
  const [pathResult, setPathResult] = useState<"allowed" | "blocked" | null>(null);

  async function fetchAndParse() {
    if (!url) return;
    setLoading(true); setError(""); setResult(null); setPathResult(null);
    try {
      let target = url;
      if (!url.includes("robots.txt")) {
        const u = new URL(url.startsWith("http") ? url : "https://" + url);
        target = u.origin + "/robots.txt";
      }
      const res = await fetch(`/api/fetch?url=${encodeURIComponent(target)}`);
      if (!res.ok) { setError("Fetch failed"); return; }
      const text = await res.text();
      setResult(parseRobots(text));
    } catch { setError("Network error"); }
    finally { setLoading(false); }
  }

  const inputArea = (
    <>
      <div className="flex overflow-hidden rounded" style={{ border: "1px solid var(--border-2)" }}>
        <input type="url" value={url} onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchAndParse()}
          placeholder="https://example.com"
          className="flex-1 px-4 py-3 text-sm outline-none bg-transparent"
          style={{ fontFamily: "var(--font-mono)", color: "var(--fg)", minWidth: 0 }}
        />
        <button onClick={fetchAndParse} disabled={loading}
          className="px-5 py-3 text-sm font-semibold text-white"
          style={{ background: "var(--accent)", border: "none", cursor: "pointer" }}>
          {loading ? "Fetching…" : "Fetch Robots.txt →"}
        </button>
      </div>
      {error && <p className="mt-3 text-sm" style={{ color: "var(--score-red)" }}>{error}</p>}
    </>
  );

  const resultsArea = result ? (
    <div>
      <p className="text-xs font-medium uppercase tracking-widest mb-4"
        style={{ fontFamily: "var(--font-mono)", color: "var(--subtle)" }}>Parsed Rules</p>
      <div className="rounded overflow-hidden mb-6"
        style={{ background: "var(--surface)", border: "1px solid var(--border-2)" }}>
        {result.rules.length === 0 && (
          <p className="px-4 py-3 text-sm" style={{ color: "var(--muted-fg)" }}>No rules found.</p>
        )}
        {result.rules.map((rule, i) => (
          <div key={i} className="px-4 py-3"
            style={{ borderBottom: i < result.rules.length - 1 ? "1px solid var(--border)" : "none" }}>
            <p className="text-xs font-semibold mb-1.5"
              style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}>
              User-agent: {rule.userAgent}
            </p>
            {rule.disallowed.map((d, j) => (
              <p key={j} className="text-xs" style={{ color: "var(--score-red)", fontFamily: "var(--font-mono)" }}>
                Disallow: {d}
              </p>
            ))}
            {rule.allowed.map((a, j) => (
              <p key={j} className="text-xs" style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
                Allow: {a}
              </p>
            ))}
          </div>
        ))}
        {result.sitemaps.map((s, i) => (
          <div key={i} className="px-4 py-2" style={{ borderTop: "1px solid var(--border)" }}>
            <p className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--muted-fg)" }}>
              Sitemap: {s}
            </p>
          </div>
        ))}
      </div>

      <p className="text-xs font-medium uppercase tracking-widest mb-3"
        style={{ fontFamily: "var(--font-mono)", color: "var(--subtle)" }}>Test a Path</p>
      <div className="flex gap-3 mb-3 flex-wrap">
        <input value={testUa} onChange={(e) => setTestUa(e.target.value)}
          placeholder="User-agent (e.g. Googlebot)"
          className="rounded px-3 py-2 text-sm outline-none"
          style={{ border: "1px solid var(--border-2)", fontFamily: "var(--font-mono)", color: "var(--fg)", background: "var(--surface)", flex: "0 0 200px" }}
        />
        <input value={testPathInput} onChange={(e) => setTestPathInput(e.target.value)}
          placeholder="/path/to/test"
          className="rounded px-3 py-2 text-sm outline-none flex-1"
          style={{ border: "1px solid var(--border-2)", fontFamily: "var(--font-mono)", color: "var(--fg)", background: "var(--surface)", minWidth: 120 }}
        />
        <button onClick={() => setPathResult(testPath(result, testUa, testPathInput))}
          className="px-4 py-2 text-sm font-semibold text-white rounded"
          style={{ background: "var(--accent)", border: "none", cursor: "pointer" }}>
          Test
        </button>
      </div>
      {pathResult && (
        <div className="rounded p-4"
          style={{
            background: pathResult === "allowed" ? "var(--accent-light)" : "#fef2f2",
            border: `1px solid ${pathResult === "allowed" ? "#a7f3d0" : "#fecaca"}`,
          }}>
          <p className="text-sm font-semibold"
            style={{ color: pathResult === "allowed" ? "var(--accent)" : "var(--score-red)" }}>
            {pathResult === "allowed" ? "✓ Allowed" : "✗ Blocked"} — {testUa} is {pathResult} on {testPathInput}
          </p>
        </div>
      )}
    </div>
  ) : null;

  return (
    <ToolLayout
      title="Robots.txt Tester"
      description="Fetch and parse robots.txt files. Test which paths are allowed or blocked for any user-agent."
      tabs={TABS} activeTab="url" onTabChange={() => {}}
      inputArea={inputArea} resultsArea={resultsArea}
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/a1111/Public/Prog/js/seokit
git add app/robots-tester/
git commit -m "feat: task 9 - robots.txt tester tool page"
```

---

## Task 10: Redirect Checker Tool Page

**Files:**
- Create: `app/redirect-checker/page.tsx`

- [ ] **Step 1: Write app/redirect-checker/page.tsx**

```tsx
"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

interface Hop { url: string; status: number; ms: number; }

const TABS = [{ key: "url", label: "Enter URL" }];

function statusColor(s: number): string {
  if (s >= 200 && s < 300) return "var(--accent)";
  if (s >= 300 && s < 400) return "var(--score-yellow)";
  return "var(--score-red)";
}

export default function RedirectCheckerPage() {
  const [url, setUrl] = useState("");
  const [hops, setHops] = useState<Hop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function check() {
    if (!url) return;
    setLoading(true); setError(""); setHops([]);
    try {
      const res = await fetch(`/api/redirects?url=${encodeURIComponent(url)}`);
      const j = await res.json();
      if (j.error) { setError(j.error); return; }
      setHops(j.hops ?? []);
    } catch { setError("Network error"); }
    finally { setLoading(false); }
  }

  const inputArea = (
    <>
      <div className="flex overflow-hidden rounded" style={{ border: "1px solid var(--border-2)" }}>
        <input type="url" value={url} onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && check()}
          placeholder="https://example.com/redirect-me"
          className="flex-1 px-4 py-3 text-sm outline-none bg-transparent"
          style={{ fontFamily: "var(--font-mono)", color: "var(--fg)", minWidth: 0 }}
        />
        <button onClick={check} disabled={loading}
          className="px-5 py-3 text-sm font-semibold text-white"
          style={{ background: "var(--accent)", border: "none", cursor: "pointer" }}>
          {loading ? "Tracing…" : "Trace Redirects →"}
        </button>
      </div>
      {error && <p className="mt-3 text-sm" style={{ color: "var(--score-red)" }}>{error}</p>}
    </>
  );

  const resultsArea = hops.length > 0 ? (
    <div>
      <p className="text-xs font-medium uppercase tracking-widest mb-4"
        style={{ fontFamily: "var(--font-mono)", color: "var(--subtle)" }}>
        Redirect Chain — {hops.length} hop{hops.length !== 1 ? "s" : ""}
      </p>
      <div className="rounded overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border-2)" }}>
        {hops.map((hop, i) => {
          const isFinal = i === hops.length - 1;
          return (
            <div key={i} className="flex items-start gap-4 px-4 py-3"
              style={{
                borderBottom: !isFinal ? "1px solid var(--border)" : "none",
                background: isFinal ? "var(--accent-light)" : "transparent",
              }}>
              <span className="text-xs font-semibold min-w-[2rem] mt-0.5"
                style={{ fontFamily: "var(--font-mono)", color: "var(--subtle)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-bold min-w-[3.5rem]"
                style={{ color: statusColor(hop.status), fontFamily: "var(--font-mono)" }}>
                {hop.status}
              </span>
              <span className="flex-1 text-sm break-all"
                style={{ color: "var(--fg)", fontFamily: "var(--font-mono)" }}>
                {hop.url}
                {isFinal && (
                  <span className="ml-2 text-xs font-semibold" style={{ color: "var(--accent)" }}>
                    ← final
                  </span>
                )}
              </span>
              <span className="text-xs ml-2 whitespace-nowrap"
                style={{ color: "var(--subtle)" }}>{hop.ms}ms</span>
            </div>
          );
        })}
      </div>
    </div>
  ) : null;

  return (
    <ToolLayout
      title="Redirect Checker"
      description="Trace redirect chains from any URL — see each hop, status code, and final destination."
      tabs={TABS} activeTab="url" onTabChange={() => {}}
      inputArea={inputArea} resultsArea={resultsArea}
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/a1111/Public/Prog/js/seokit
git add app/redirect-checker/
git commit -m "feat: task 10 - redirect checker tool page"
```

---

## Task 11: Schema Validator Tool Page

**Files:**
- Create: `app/schema-validator/page.tsx`

- [ ] **Step 1: Write app/schema-validator/page.tsx**

```tsx
"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import StatusBadge from "@/components/StatusBadge";
import { extractSchemas, SchemaResult } from "@/lib/schemaExtractor";

const TABS = [
  { key: "url", label: "Enter URL" },
  { key: "html", label: "Paste HTML" },
];

export default function SchemaValidatorPage() {
  const [tab, setTab] = useState("url");
  const [url, setUrl] = useState("");
  const [html, setHtml] = useState("");
  const [schemas, setSchemas] = useState<SchemaResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analyzed, setAnalyzed] = useState(false);

  async function fetchAndExtract() {
    if (!url) return;
    setLoading(true); setError(""); setSchemas([]); setAnalyzed(false);
    try {
      const res = await fetch(`/api/fetch?url=${encodeURIComponent(url)}`);
      if (!res.ok) { setError("Fetch failed"); return; }
      const text = await res.text();
      setSchemas(extractSchemas(text));
      setAnalyzed(true);
    } catch { setError("Network error"); }
    finally { setLoading(false); }
  }

  const inputArea = (
    <>
      {tab === "url" ? (
        <div className="flex overflow-hidden rounded" style={{ border: "1px solid var(--border-2)" }}>
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchAndExtract()}
            placeholder="https://example.com/page"
            className="flex-1 px-4 py-3 text-sm outline-none bg-transparent"
            style={{ fontFamily: "var(--font-mono)", color: "var(--fg)", minWidth: 0 }}
          />
          <button onClick={fetchAndExtract} disabled={loading}
            className="px-5 py-3 text-sm font-semibold text-white"
            style={{ background: "var(--accent)", border: "none", cursor: "pointer" }}>
            {loading ? "Extracting…" : "Extract Schema →"}
          </button>
        </div>
      ) : (
        <div>
          <textarea value={html} onChange={(e) => setHtml(e.target.value)}
            placeholder="Paste full page HTML…" rows={6}
            className="w-full rounded px-4 py-3 text-sm outline-none resize-y"
            style={{ fontFamily: "var(--font-mono)", background: "var(--body-bg)", border: "1px solid var(--border-2)", color: "var(--fg)" }}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => { setError(""); setSchemas(extractSchemas(html)); setAnalyzed(true); }}
              className="px-4 py-2 text-sm font-semibold text-white rounded"
              style={{ background: "var(--accent)", border: "none", cursor: "pointer" }}>
              Extract Schema →
            </button>
          </div>
        </div>
      )}
      {error && <p className="mt-3 text-sm" style={{ color: "var(--score-red)" }}>{error}</p>}
    </>
  );

  const resultsArea = analyzed ? (
    <div>
      <p className="text-xs font-medium uppercase tracking-widest mb-4"
        style={{ fontFamily: "var(--font-mono)", color: "var(--subtle)" }}>
        Found {schemas.length} schema{schemas.length !== 1 ? "s" : ""}
      </p>
      {schemas.length === 0 ? (
        <div className="rounded p-6 text-center"
          style={{ background: "var(--surface)", border: "1px solid var(--border-2)" }}>
          <p className="text-sm" style={{ color: "var(--muted-fg)" }}>
            No structured data (JSON-LD or Microdata) found on this page.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {schemas.map((s, i) => (
            <div key={i} className="rounded overflow-hidden"
              style={{ background: "var(--surface)", border: "1px solid var(--border-2)" }}>
              <div className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: "1px solid var(--border)", background: "var(--body-bg)" }}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold" style={{ color: "var(--fg)" }}>{s.schemaType}</span>
                  <span className="text-xs px-2 py-0.5 rounded"
                    style={{ background: "var(--accent-light)", color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
                    {s.type}
                  </span>
                </div>
                <StatusBadge
                  status={s.issues.length === 0 ? "pass" : "warn"}
                  label={s.issues.length === 0 ? "valid" : `${s.issues.length} issue${s.issues.length > 1 ? "s" : ""}`}
                />
              </div>
              {s.issues.length > 0 && (
                <div className="px-4 py-2" style={{ borderBottom: "1px solid var(--border)" }}>
                  {s.issues.map((iss, j) => (
                    <p key={j} className="text-xs" style={{ color: "var(--score-red)" }}>⚠ {iss}</p>
                  ))}
                </div>
              )}
              <pre className="px-4 py-3 text-xs overflow-auto"
                style={{ fontFamily: "var(--font-mono)", color: "var(--muted-fg)", maxHeight: 200, margin: 0 }}>
                {JSON.stringify(s.data, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  ) : null;

  return (
    <ToolLayout
      title="Schema Validator"
      description="Extract and validate structured data (JSON-LD, Microdata) from any page URL or raw HTML."
      tabs={TABS} activeTab={tab} onTabChange={setTab}
      inputArea={inputArea} resultsArea={resultsArea}
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/a1111/Public/Prog/js/seokit
git add app/schema-validator/
git commit -m "feat: task 11 - schema validator tool page"
```

---

## Task 12: Blog

**Files:**
- Create: `lib/blog.ts`
- Create: `app/blog/page.tsx`
- Create: `app/blog/[slug]/page.tsx`
- Create: `content/blog/seo-meta-tags-guide.md`

- [ ] **Step 1: Create content/blog/seo-meta-tags-guide.md**

```markdown
---
title: "The Complete Guide to SEO Meta Tags in 2026"
date: "2026-04-15"
excerpt: "Meta tags remain one of the highest-leverage on-page SEO improvements you can make. Here is what actually matters."
---

# The Complete Guide to SEO Meta Tags in 2026

Meta tags sit in the head of your HTML and tell search engines and social platforms what your page is about. Getting them right is one of the highest-leverage on-page SEO improvements you can make.

## Title Tag

The title tag is the most important meta element. It appears in search results as the clickable headline and in browser tabs.

**Optimal length:** 50-60 characters. Google truncates titles beyond approximately 60 characters in SERPs.

Best practices:

- Include your primary keyword near the front
- Include your brand name, usually at the end
- Write for humans first — click-through rate matters

## Meta Description

The meta description does not directly affect rankings, but it influences click-through rate significantly.

**Optimal length:** 120-160 characters.

## Open Graph Tags

OG tags control how your page appears when shared on social platforms. The og:image should be at least 1200x630px for best results across platforms.

## Canonical Tag

The canonical tag prevents duplicate content issues by telling search engines which URL is the true version of a page.

Use seokit's Meta Analyzer to audit all of these tags on any page in seconds.
```

- [ ] **Step 2: Write lib/blog.ts**

```ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const CONTENT_DIR = path.join(process.cwd(), "content/blog");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

export interface Post extends PostMeta {
  html: string;
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf-8");
      const { data } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? "",
        excerpt: data.excerpt ?? "",
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const filepath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filepath)) return null;
  const raw = fs.readFileSync(filepath, "utf-8");
  const { data, content } = matter(raw);
  const html = await marked(content);
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "",
    excerpt: data.excerpt ?? "",
    html,
  };
}
```

- [ ] **Step 3: Write app/blog/page.tsx**

```tsx
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const revalidate = false;

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div style={{ background: "var(--body-bg)", minHeight: "calc(100vh - 60px)" }}>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1
          className="text-2xl font-bold mb-8"
          style={{ color: "var(--fg)", letterSpacing: "-0.03em" }}
        >
          Blog
        </h1>
        {posts.length === 0 ? (
          <p style={{ color: "var(--muted-fg)" }}>No posts yet.</p>
        ) : (
          <div>
            {posts.map((post, i) => (
              <div key={post.slug}>
                {i > 0 && (
                  <div style={{ borderTop: "1px solid var(--border)" }} />
                )}
                <Link href={`/blog/${post.slug}`} className="block py-5">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span
                      className="text-xs"
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: "var(--subtle)",
                      }}
                    >
                      {post.date}
                    </span>
                  </div>
                  <h2
                    className="text-base font-semibold mb-1"
                    style={{ color: "var(--fg)" }}
                  >
                    {post.title}
                  </h2>
                  <p className="text-sm" style={{ color: "var(--muted-fg)" }}>
                    {post.excerpt}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Write app/blog/[slug]/page.tsx**

Note: `dangerouslySetInnerHTML` is used here with HTML generated from trusted local markdown files only via `marked`. There is no user-supplied content involved.

```tsx
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div style={{ background: "var(--body-bg)", minHeight: "calc(100vh - 60px)" }}>
      <article className="max-w-2xl mx-auto px-6 py-12">
        <p
          className="text-xs mb-3"
          style={{ fontFamily: "var(--font-mono)", color: "var(--subtle)" }}
        >
          {post.date}
        </p>
        <h1
          className="text-3xl font-bold mb-8"
          style={{ color: "var(--fg)", letterSpacing: "-0.03em" }}
        >
          {post.title}
        </h1>
        <div
          className="prose-content"
          style={{ color: "var(--fg)", lineHeight: 1.75 }}
          // Content is generated from local markdown files only — not user input
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
cd /Users/a1111/Public/Prog/js/seokit
git add lib/blog.ts app/blog/ content/
git commit -m "feat: task 12 - blog with SSG"
```

---

## Task 13: About Page

**Files:**
- Create: `app/about/page.tsx`

- [ ] **Step 1: Write app/about/page.tsx**

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — seokit",
  description:
    "seokit is a free set of SEO utilities built for developers and content creators.",
};

export default function AboutPage() {
  return (
    <div
      style={{
        background: "var(--body-bg)",
        minHeight: "calc(100vh - 60px)",
      }}
    >
      <div
        className="mx-auto px-6 py-12"
        style={{ maxWidth: 680 }}
      >
        <h1
          className="text-2xl font-bold mb-6"
          style={{ color: "var(--fg)", letterSpacing: "-0.03em" }}
        >
          About seokit
        </h1>
        <div
          className="flex flex-col gap-4 text-base"
          style={{ color: "var(--muted-fg)", lineHeight: 1.75 }}
        >
          <p>
            seokit is a free collection of SEO utilities built for developers,
            content creators, and marketers who need to audit, preview, and fix
            pages for search engines — without signing up for an account or
            burning crawl credits.
          </p>
          <p>
            Every tool runs in your browser or calls a lightweight server proxy
            to avoid CORS restrictions. No data is stored. No tracking beyond
            standard analytics.
          </p>
          <p>
            seokit is one of five tool-kit sub-sites under{" "}
            <a href="https://yaro-labs.com" style={{ color: "var(--accent)" }}>
              yaro-labs.com
            </a>
            . Each site focuses on a different developer workflow: devkit,
            csskit, jskit, seokit, and apikit.
          </p>
          <p>
            Tools included:{" "}
            <strong style={{ color: "var(--fg)" }}>Meta Analyzer</strong>,{" "}
            <strong style={{ color: "var(--fg)" }}>Sitemap Validator</strong>,{" "}
            <strong style={{ color: "var(--fg)" }}>Keyword Density</strong>,{" "}
            <strong style={{ color: "var(--fg)" }}>Robots.txt Tester</strong>,{" "}
            <strong style={{ color: "var(--fg)" }}>Redirect Checker</strong>,
            and{" "}
            <strong style={{ color: "var(--fg)" }}>Schema Validator</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/a1111/Public/Prog/js/seokit
git add app/about/
git commit -m "feat: task 13 - about page"
```

---

## Task 14: Sitemap + Robots

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

- [ ] **Step 1: Write app/sitemap.ts**

```ts
import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

const BASE = "https://seokit.yaro-labs.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/meta-analyzer`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/sitemap-validator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/keyword-density`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/robots-tester`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/redirect-checker`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/schema-validator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    ...posts,
  ];
}
```

- [ ] **Step 2: Write app/robots.ts**

```ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: "https://seokit.yaro-labs.com/sitemap.xml",
  };
}
```

- [ ] **Step 3: Commit**

```bash
cd /Users/a1111/Public/Prog/js/seokit
git add app/sitemap.ts app/robots.ts
git commit -m "feat: task 14 - sitemap and robots"
```

---

## Task 15: Production Build Verification

- [ ] **Step 1: Run production build**

```bash
cd /Users/a1111/Public/Prog/js/seokit && nvm use 22 && npm run build 2>&1
```

Expected: `Compiled successfully` with all routes listed. Zero errors.

- [ ] **Step 2: Fix common build issues**

If TypeScript errors appear:
- `params` in Next.js 15 must be awaited in async server components: `const { slug } = await params`
- `fs` and `path` imports are only valid in server components (files without `"use client"`)
- `lib/blog.ts` must NOT have `"use client"` — it uses `fs`

If Tailwind v4 `@import "tailwindcss"` causes issues, check that `tailwindcss` package is present and version is v4+:
```bash
cd /Users/a1111/Public/Prog/js/seokit && nvm use 22 && npm ls tailwindcss
```

- [ ] **Step 3: Final commit**

```bash
cd /Users/a1111/Public/Prog/js/seokit
git add -A
git commit -m "feat: seokit complete"
```

---

## Spec Coverage Checklist

- [x] Task 1: Scaffold, Tailwind v4, all design tokens in globals.css, Inter + JetBrains Mono via next/font
- [x] Task 2: Navbar — dark #0f172a bg, 60px, wordmark with emerald accent, nav links, emerald CTA
- [x] Task 3: Homepage hero (two-column, no pill/badge, "Browse tools" CTA, SVG score rings panel) + tools grid (numbered 01-06, borderless, full prose descriptions, hover arrow)
- [x] Task 4: `/api/fetch` GET proxy handler + `/api/redirects` hop tracer
- [x] Task 5: ToolLayout, StatusBadge (pass/warn/fail), ScoreRing (SVG, color-coded) + all lib parsers
- [x] Task 6: Meta Analyzer — URL + paste HTML tabs, score cards (title/desc length), detail table with StatusBadge
- [x] Task 7: Sitemap Validator — URL + paste XML tabs, valid/urlCount/lastmod cards, issues list, URL table
- [x] Task 8: Keyword Density — URL + paste text tabs, top 20 keywords with count and density %
- [x] Task 9: Robots.txt Tester — fetch + parse rules + path test UI
- [x] Task 10: Redirect Checker — hop chain via `/api/redirects`, status colors, final destination highlighted
- [x] Task 11: Schema Validator — JSON-LD + Microdata extraction, issues per schema
- [x] Task 12: Blog — SSG index + post pages with generateStaticParams + sample post in content/blog/
- [x] Task 13: About page (max-width 680px prose)
- [x] Task 14: app/sitemap.ts + app/robots.ts
- [x] Task 15: `npm run build` passes 0 errors
