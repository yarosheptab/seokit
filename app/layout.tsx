import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const siteTitle = "seokit — SEO Tools for Developers";
const siteDescription =
  "SEO analysis tools — Meta Analyzer, Sitemap Validator, Keyword Density, Robots Tester, Redirect Checker, Schema Validator";

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  metadataBase: new URL("https://seokit.yaro-labs.com"),
  keywords: [
    "SEO tools",
    "meta tag analyzer",
    "sitemap validator",
    "keyword density checker",
    "robots.txt tester",
    "redirect checker",
    "schema validator",
    "free SEO tools",
    "website SEO analysis",
  ],
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "https://seokit.yaro-labs.com",
    siteName: "seokit",
    type: "website",
    images: [
      {
        url: "https://seokit.yaro-labs.com/og/home.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["https://seokit.yaro-labs.com/og/home.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const GTM_ID = "GTM-T3SS4DD6";
const gtmScript = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "seokit",
              "url": "https://seokit.yaro-labs.com",
              "description": siteDescription,
              "publisher": {
                "@type": "Organization",
                "name": "Yaro Labs",
                "url": "https://yaro-labs.com",
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://seokit.yaro-labs.com/meta-analyzer?url={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }).replace(/</g, "\\u003c"),
          }}
        />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CookieConsent />
        <Analytics />
        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: gtmScript }}
        />
      </body>
    </html>
  );
}
