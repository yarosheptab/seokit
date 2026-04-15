import type { Metadata } from "next";
import KeywordDensityClient from "./KeywordDensityClient";

export const metadata: Metadata = {
  title: "Keyword Density Checker",
  description:
    "Analyze keyword frequency and density in any text or web page. Find over-optimization and missing keyword opportunities.",
  keywords: [
    "keyword density",
    "keyword frequency",
    "keyword analyzer",
    "SEO keyword checker",
    "text keyword analysis",
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Keyword Density Checker",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "url": "https://seokit.yaro-labs.com/keyword-density",
  "description":
    "Analyze keyword frequency and density in any text or web page. Find over-optimization and missing keyword opportunities.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "author": {
    "@type": "Organization",
    "name": "Yaro Labs",
    "url": "https://yaro-labs.com",
  },
};

export default function KeywordDensityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <KeywordDensityClient />
    </>
  );
}
