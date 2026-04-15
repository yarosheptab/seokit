import type { Metadata } from "next";
import MetaAnalyzerClient from "./MetaAnalyzerClient";

export const metadata: Metadata = {
  title: "Meta Tag Analyzer",
  description:
    "Analyze any URL's title, description, Open Graph, and Twitter Card tags. Get an SEO score and preview how it looks in search results.",
  keywords: [
    "meta tag analyzer",
    "SEO meta tags",
    "Open Graph checker",
    "Twitter Card checker",
    "meta description checker",
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Meta Tag Analyzer",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "url": "https://seokit.yaro-labs.com/meta-analyzer",
  "description":
    "Analyze any URL's title, description, Open Graph, and Twitter Card tags. Get an SEO score and preview how it looks in search results.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "author": {
    "@type": "Organization",
    "name": "Yaro Labs",
    "url": "https://yaro-labs.com",
  },
};

export default function MetaAnalyzerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <MetaAnalyzerClient />
    </>
  );
}
