import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Cookie Policy — seokit",
  description: "How seokit uses cookies and local storage.",
}

const S = {
  heading: { fontSize: "14px", fontWeight: 600, color: "var(--fg)", marginBottom: "8px" } as React.CSSProperties,
  body: { fontSize: "13px", color: "var(--muted-fg)", lineHeight: 1.8, margin: 0 } as React.CSSProperties,
  divider: { border: "none", borderTop: "1px solid var(--border)", margin: "24px 0" } as React.CSSProperties,
  table: { width: "100%", borderCollapse: "collapse" as const, fontSize: "12px", color: "var(--muted-fg)" },
  th: { textAlign: "left" as const, padding: "8px 10px", background: "var(--body-bg)", color: "var(--fg)", fontWeight: 600, borderBottom: "1px solid var(--border)" },
  td: { padding: "8px 10px", borderBottom: "1px solid var(--border)", verticalAlign: "top" as const },
}

export default function CookiesPage() {
  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 80px" }}>
      <Link href="/" style={{ fontSize: "13px", color: "var(--muted-fg)", textDecoration: "none" }}>
        ← Back to home
      </Link>
      <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--fg)", letterSpacing: "-0.03em", margin: "24px 0 4px" }}>
        Cookie Policy
      </h1>
      <p style={{ fontSize: "12px", color: "var(--subtle, #94a3b8)", marginBottom: "32px" }}>
        Last updated: 16 April 2026
      </p>

      <div>
        <h2 style={S.heading}>What Are Cookies?</h2>
        <p style={S.body}>
          Cookies are small text files stored by your browser when you visit a website. seokit uses a minimal
          set of cookies and browser storage — only what is necessary to operate the service and understand
          aggregate usage patterns.
        </p>

        <hr style={S.divider} />

        <h2 style={S.heading}>Cookies and Storage We Use</h2>
        <div style={{ overflowX: "auto", marginTop: "4px" }}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Name</th>
                <th style={S.th}>Type</th>
                <th style={S.th}>Purpose</th>
                <th style={S.th}>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={S.td}><code style={{ fontFamily: "monospace" }}>seokit-cookie-consent</code></td>
                <td style={S.td}>localStorage</td>
                <td style={S.td}>Remembers your Accept/Decline choice on the cookie banner</td>
                <td style={S.td}>Persistent (until cleared)</td>
              </tr>
              <tr>
                <td style={S.td}><code style={{ fontFamily: "monospace" }}>_ga</code></td>
                <td style={S.td}>Cookie</td>
                <td style={S.td}>Google Analytics 4 — distinguishes unique visitors</td>
                <td style={S.td}>2 years</td>
              </tr>
              <tr>
                <td style={S.td}><code style={{ fontFamily: "monospace" }}>_ga_*</code></td>
                <td style={S.td}>Cookie</td>
                <td style={S.td}>Google Analytics 4 — maintains session state</td>
                <td style={S.td}>2 years</td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr style={S.divider} />

        <h2 style={S.heading}>Google Analytics 4 (GA4)</h2>
        <p style={S.body}>
          We use GA4 to collect anonymized, aggregated statistics about how visitors interact with seokit —
          which tools are used, how long sessions last, and where errors occur. This data helps us improve the
          service. GA4 does not receive the URLs you analyze. Google's{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
            Privacy Policy
          </a>{" "}
          governs how Google processes this data.
        </p>

        <hr style={S.divider} />

        <h2 style={S.heading}>How to Manage Cookies</h2>
        <p style={S.body}>
          You can manage your consent at any time:
        </p>
        <ul style={{ ...S.body, paddingLeft: "20px", marginTop: "10px" }}>
          <li style={{ marginBottom: "6px" }}>
            <strong style={{ color: "var(--fg)" }}>Cookie banner</strong> — click "Decline" to opt out of GA4
            cookies. Clear your <code style={{ fontFamily: "monospace", fontSize: "12px" }}>localStorage</code>{" "}
            (DevTools → Application → Local Storage) to reset your choice and see the banner again.
          </li>
          <li style={{ marginBottom: "6px" }}>
            <strong style={{ color: "var(--fg)" }}>Browser settings</strong> — all modern browsers let you
            block or delete cookies via their privacy settings.
          </li>
          <li style={{ marginBottom: "6px" }}>
            <strong style={{ color: "var(--fg)" }}>GA4 opt-out</strong> — install the{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
              Google Analytics Opt-out Browser Add-on
            </a>{" "}
            to block GA4 across all sites globally.
          </li>
        </ul>

        <hr style={S.divider} />

        <h2 style={S.heading}>Contact</h2>
        <p style={S.body}>
          Questions about our cookie usage? Email{" "}
          <a href="mailto:hello@yaro-labs.com" style={{ color: "var(--accent)" }}>
            hello@yaro-labs.com
          </a>.
        </p>
      </div>
    </main>
  )
}
