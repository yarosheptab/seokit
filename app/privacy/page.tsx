import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy — seokit",
  description: "How seokit collects, uses, and protects your data.",
}

const S = {
  heading: { fontSize: "14px", fontWeight: 600, color: "var(--fg)", marginBottom: "8px" } as React.CSSProperties,
  body: { fontSize: "13px", color: "var(--muted-fg)", lineHeight: 1.8, margin: 0 } as React.CSSProperties,
  divider: { border: "none", borderTop: "1px solid var(--border)", margin: "24px 0" } as React.CSSProperties,
}

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 80px" }}>
      <Link href="/" style={{ fontSize: "13px", color: "var(--muted-fg)", textDecoration: "none" }}>
        ← Back to home
      </Link>
      <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--fg)", letterSpacing: "-0.03em", margin: "24px 0 4px" }}>
        Privacy Policy
      </h1>
      <p style={{ fontSize: "12px", color: "var(--subtle, #94a3b8)", marginBottom: "32px" }}>
        Last updated: 16 April 2026
      </p>

      <div>
        <h2 style={S.heading}>1. Introduction</h2>
        <p style={S.body}>
          seokit (available at seokit.yaro-labs.com) is an SEO analysis tool operated by Yaro Labs. We provide
          free, browser-based utilities for analyzing meta tags, sitemaps, keyword density, robots.txt files,
          redirects, and schema markup. URL analysis runs in your browser where possible; for external URL
          fetching (e.g. meta analyzer, redirect checker), requests are relayed through a lightweight server-side
          proxy to avoid CORS restrictions. We do not store the URLs you analyze.
        </p>

        <hr style={S.divider} />

        <h2 style={S.heading}>2. Information We Collect</h2>
        <p style={S.body}>
          <strong style={{ color: "var(--fg)" }}>URLs you analyze</strong> — processed transiently server-side
          for external fetch operations and not stored or logged beyond the immediate request.
        </p>
        <p style={{ ...S.body, marginTop: "10px" }}>
          <strong style={{ color: "var(--fg)" }}>Analytics</strong> — we use Google Analytics 4 (GA4) to collect
          anonymized usage data (pages visited, tool interactions, session duration). GA4 may set cookies in your
          browser.
        </p>
        <p style={{ ...S.body, marginTop: "10px" }}>
          <strong style={{ color: "var(--fg)" }}>Cookie consent</strong> — your Accept/Decline choice is stored
          in <code style={{ fontFamily: "monospace", fontSize: "12px" }}>localStorage</code> under the key{" "}
          <code style={{ fontFamily: "monospace", fontSize: "12px" }}>seokit-cookie-consent</code>. This value
          never leaves your device.
        </p>

        <hr style={S.divider} />

        <h2 style={S.heading}>3. How We Use Your Information</h2>
        <p style={S.body}>
          Analytics data is used solely to understand which tools are most useful, detect errors, and improve the
          service. We do not use it for advertising or sell it to third parties.
        </p>

        <hr style={S.divider} />

        <h2 style={S.heading}>4. Sharing</h2>
        <p style={S.body}>
          We share data only with our analytics provider (Google LLC via GA4). No other third-party processors
          receive your data. GA4 data may be processed in the United States; Google's privacy policy applies.
        </p>

        <hr style={S.divider} />

        <h2 style={S.heading}>5. Your Rights</h2>
        <p style={S.body}>
          You may decline analytics cookies via the cookie banner at any time. Because we do not collect
          personally identifiable information, there is no personal data to access, rectify, or delete on our
          servers. To opt out of GA4 tracking globally, you can use the{" "}
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
            Google Analytics Opt-out Browser Add-on
          </a>.
        </p>

        <hr style={S.divider} />

        <h2 style={S.heading}>6. Changes to This Policy</h2>
        <p style={S.body}>
          We may update this policy from time to time. The "Last updated" date at the top will reflect any
          changes. Continued use of seokit after changes constitutes acceptance of the revised policy.
        </p>

        <hr style={S.divider} />

        <h2 style={S.heading}>7. Contact</h2>
        <p style={S.body}>
          Questions? Email us at{" "}
          <a href="mailto:hello@yaro-labs.com" style={{ color: "var(--accent)" }}>
            hello@yaro-labs.com
          </a>.
        </p>
      </div>
    </main>
  )
}
