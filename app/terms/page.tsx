import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service — seokit",
  description: "Terms governing your use of seokit SEO tools.",
}

const S = {
  heading: { fontSize: "14px", fontWeight: 600, color: "var(--fg)", marginBottom: "8px" } as React.CSSProperties,
  body: { fontSize: "13px", color: "var(--muted-fg)", lineHeight: 1.8, margin: 0 } as React.CSSProperties,
  divider: { border: "none", borderTop: "1px solid var(--border)", margin: "24px 0" } as React.CSSProperties,
}

export default function TermsPage() {
  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 80px" }}>
      <Link href="/" style={{ fontSize: "13px", color: "var(--muted-fg)", textDecoration: "none" }}>
        ← Back to home
      </Link>
      <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--fg)", letterSpacing: "-0.03em", margin: "24px 0 4px" }}>
        Terms of Service
      </h1>
      <p style={{ fontSize: "12px", color: "var(--subtle, #94a3b8)", marginBottom: "32px" }}>
        Last updated: 16 April 2026
      </p>

      <div>
        <h2 style={S.heading}>1. Acceptance of Terms</h2>
        <p style={S.body}>
          By accessing or using seokit (seokit.yaro-labs.com), operated by Yaro Labs, you agree to be bound by
          these Terms of Service. If you do not agree, please discontinue use immediately.
        </p>

        <hr style={S.divider} />

        <h2 style={S.heading}>2. Description of Service</h2>
        <p style={S.body}>
          seokit provides free SEO analysis utilities including a meta tag analyzer, sitemap validator, keyword
          density checker, robots.txt tester, redirect checker, and schema validator. All tools are designed for
          analyzing publicly accessible URLs. You are responsible for ensuring you have permission to analyze any
          URL you submit.
        </p>

        <hr style={S.divider} />

        <h2 style={S.heading}>3. Informational Use Only</h2>
        <p style={S.body}>
          Results produced by seokit are for informational purposes only. They do not constitute professional SEO
          advice. Yaro Labs makes no guarantee that acting on these results will improve your search engine
          rankings or website performance.
        </p>

        <hr style={S.divider} />

        <h2 style={S.heading}>4. Acceptable Use</h2>
        <p style={S.body}>
          You agree not to use seokit to: (a) analyze URLs you do not own or have authorization to audit;
          (b) send automated or high-volume requests that place unreasonable load on our servers; (c) attempt to
          reverse-engineer or exploit the service; or (d) use the service for any unlawful purpose.
        </p>

        <hr style={S.divider} />

        <h2 style={S.heading}>5. Disclaimer of Warranties</h2>
        <p style={S.body}>
          THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
          LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. Yaro
          Labs does not warrant that the service will be uninterrupted, error-free, or accurate at all times.
        </p>

        <hr style={S.divider} />

        <h2 style={S.heading}>6. Limitation of Liability</h2>
        <p style={S.body}>
          To the maximum extent permitted by law, Yaro Labs shall not be liable for any indirect, incidental,
          special, or consequential damages arising from your use of or inability to use seokit, even if advised
          of the possibility of such damages.
        </p>

        <hr style={S.divider} />

        <h2 style={S.heading}>7. Changes to Terms</h2>
        <p style={S.body}>
          We reserve the right to update these Terms at any time. The "Last updated" date will reflect changes.
          Continued use after changes constitutes your acceptance of the revised Terms.
        </p>

        <hr style={S.divider} />

        <h2 style={S.heading}>8. Contact</h2>
        <p style={S.body}>
          Questions about these Terms? Contact us at{" "}
          <a href="mailto:hello@yaro-labs.com" style={{ color: "var(--accent)" }}>
            hello@yaro-labs.com
          </a>.
        </p>
      </div>
    </main>
  )
}
