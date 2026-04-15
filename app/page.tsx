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
                      color: "var(--accent)",
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
                    style={{ color: "var(--accent)" }}
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
