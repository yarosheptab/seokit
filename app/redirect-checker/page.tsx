import type { Metadata } from "next";
import RedirectCheckerClient from "./RedirectCheckerClient";

export const metadata: Metadata = {
  title: "Redirect Checker — Trace URL Redirects",
  description:
    "Trace redirect chains for any URL. See each hop, status code, and final destination. Detect redirect loops and misconfigured 301s.",
  keywords: [
    "redirect checker",
    "URL redirect tracer",
    "301 redirect checker",
    "redirect chain",
    "HTTP redirect checker",
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Redirect Checker",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "url": "https://seokit.yaro-labs.com/redirect-checker",
  "description":
    "Trace redirect chains for any URL. See each hop, status code, and final destination. Detect redirect loops and misconfigured 301s.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "author": {
    "@type": "Organization",
    "name": "Yaro Labs",
    "url": "https://yaro-labs.com",
  },
};

export default function RedirectCheckerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <RedirectCheckerClient />
    </>
  );
}
