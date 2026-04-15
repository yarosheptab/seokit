import type { Metadata } from "next";
import RobotsTesterClient from "./RobotsTesterClient";

export const metadata: Metadata = {
  title: "Robots.txt Tester",
  description:
    "Test any URL against a robots.txt file to see if search engines can crawl it. Supports all common directives.",
  keywords: [
    "robots.txt tester",
    "robots.txt checker",
    "test robots.txt",
    "crawl permission checker",
    "googlebot tester",
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Robots.txt Tester",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "url": "https://seokit.yaro-labs.com/robots-tester",
  "description":
    "Test any URL against a robots.txt file to see if search engines can crawl it. Supports all common directives.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "author": {
    "@type": "Organization",
    "name": "Yaro Labs",
    "url": "https://yaro-labs.com",
  },
};

export default function RobotsTesterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <RobotsTesterClient />
    </>
  );
}
