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
