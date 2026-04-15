import type { Metadata } from "next";
import SitemapValidatorClient from "./SitemapValidatorClient";

export const metadata: Metadata = {
  title: "Sitemap Validator",
  description:
    "Validate XML sitemaps for errors. Checks format, URL count, lastmod dates, and compliance with the sitemap protocol.",
  keywords: [
    "sitemap validator",
    "XML sitemap checker",
    "validate sitemap",
    "sitemap errors",
    "sitemap.xml tester",
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Sitemap Validator",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "url": "https://seokit.yaro-labs.com/sitemap-validator",
  "description":
    "Validate XML sitemaps for errors. Checks format, URL count, lastmod dates, and compliance with the sitemap protocol.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "author": {
    "@type": "Organization",
    "name": "Yaro Labs",
    "url": "https://yaro-labs.com",
  },
};

export default function SitemapValidatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SitemapValidatorClient />
    </>
  );
}
