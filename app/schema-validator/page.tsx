import type { Metadata } from "next";
import SchemaValidatorClient from "./SchemaValidatorClient";

export const metadata: Metadata = {
  title: "JSON-LD Schema Validator",
  description:
    "Validate JSON-LD structured data for errors and completeness. Supports Schema.org types for SEO-friendly rich results.",
  keywords: [
    "schema validator",
    "JSON-LD validator",
    "structured data checker",
    "schema.org validator",
    "rich results validator",
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "JSON-LD Schema Validator",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "url": "https://seokit.yaro-labs.com/schema-validator",
  "description":
    "Validate JSON-LD structured data for errors and completeness. Supports Schema.org types for SEO-friendly rich results.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "author": {
    "@type": "Organization",
    "name": "Yaro Labs",
    "url": "https://yaro-labs.com",
  },
};

export default function SchemaValidatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SchemaValidatorClient />
    </>
  );
}
