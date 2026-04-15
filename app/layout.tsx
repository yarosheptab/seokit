import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
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

export const metadata: Metadata = {
  title: "seokit — SEO Tools for Developers",
  description:
    "Six free SEO tools: meta analyzer, sitemap validator, keyword density, robots tester, redirect checker, schema validator.",
  metadataBase: new URL("https://seokit.yaro-labs.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CookieConsent />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PLACEHOLDER"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-PLACEHOLDER');`}
        </Script>
      </body>
    </html>
  );
}
