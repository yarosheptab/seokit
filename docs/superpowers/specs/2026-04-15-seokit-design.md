# seokit.yaro-labs.com — Design Specification

**Date:** 2026-04-15  
**Status:** Approved  
**Scope:** Homepage, tool pages, blog, about — full site design for seokit.yaro-labs.com

---

## Overview

seokit is an SEO utilities site with a dark top navigation — the fourth of five tool-kit sub-sites under yaro-labs.com. It targets developers, content creators, and marketers who need to audit, preview, and fix pages for search engines.

**Design philosophy:** Professional, data-forward. Dark navbar conveys authority. Emerald accent signals "go / healthy / score". Numbered tool cells feel like a structured report, not a toy. No hero pill/badge — headline is direct.

---

## Visual Design

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| Nav background | `#0f172a` | Top navbar (dark slate) |
| Nav text | `#94a3b8` | Inactive nav links |
| Nav active | `#ffffff` | Active nav link |
| Body background | `#f8fafc` | Page background |
| Surface | `#ffffff` | Cards, panels, tool areas |
| Border | `#e2e8f0` | Default borders |
| Border muted | `#cbd5e1` | Dividers |
| Foreground | `#0f172a` | Primary text |
| Muted foreground | `#64748b` | Descriptions, labels |
| Subtle | `#94a3b8` | Placeholders, inactive |
| Accent | `#10b981` | Emerald — CTAs, score rings, highlights |
| Accent hover | `#059669` | Hover on emerald elements |
| Accent light | `#ecfdf5` | Score ring backgrounds, badge bg |
| Score yellow | `#f59e0b` | Medium score (50–79) |
| Score red | `#ef4444` | Low score (0–49) |
| Status pass | `#10b981` | ✓ check badge |
| Status warn | `#f59e0b` | ⚠ warning badge |
| Status fail | `#ef4444` | ✗ fail badge |

### Typography

- **All UI:** Inter (sans-serif) — headings, body, buttons, labels
- **Code / mono labels:** JetBrains Mono — tool numbers, score labels, kbd shortcuts
- **Border radius:** 6px

### Motion

Transitions: 150ms ease on border-color, background, and color. Score ring → number transition on hover: scale 1.02. Tool row → arrow slides in on hover.

---

## Layout System

seokit uses a top-nav layout (no sidebar):

```
┌──────────────────────────────────────────────────┐
│  Navbar (60px, dark #0f172a)                     │
├──────────────────────────────────────────────────┤
│  Page content (full-width, bg #f8fafc)           │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Navbar (60px, full-width)
- Dark background `#0f172a`
- Left: "seokit" wordmark in Inter 600, white
- Center: nav links — Tools, Blog, About (slate text, white on hover/active)
- Right: "Try a tool →" CTA button (emerald bg, white text, 6px radius)

---

## Layout: Homepage

### Hero Section
- Full-width, white background, generous vertical padding (96px top/bottom)
- **Left column (text):**
  - Bold 40px/800 headline, no badge/pill: "Rank smarter. **Ship faster.**"
  - 16px body copy: "Six SEO tools for auditing, previewing, and fixing your pages. No account, no crawl credits, no waiting."
  - Single CTA: "Browse tools" (emerald primary button)
- **Right column (score rings panel):**
  - White card with subtle border + shadow
  - Three score rings (SVG circles): Performance 94 (green), SEO 78 (yellow), Accessibility 41 (red)
  - Label below each ring
  - Caption: "Example audit results"

### Tools Section
- Header: "SEO TOOLS" label (uppercase, slate-400) + "6 tools" count (JetBrains Mono, right-aligned)
- Hairline divider below header
- **Borderless numbered grid:** 2 columns, each row is a full-width cell
  - Number: JetBrains Mono, large (24px), emerald color, e.g. `01`
  - Tool name: Inter 600 16px, dark foreground
  - Description: Inter 14px, muted slate — full prose sentence (not truncated)
  - On hover: `→` arrow appears at right, row gets subtle background tint
  - No icons, no card borders, no shadow — just typography and spacing

---

## Layout: Tool Page

### Navbar
- Same dark navbar on every page, active link highlighted

### Tool Header
- Tool name: Inter 700 24px
- One-line description: Inter 14px muted

### Input Tabs
- Two tabs: **"Enter URL"** and **"Paste HTML"**
- Active tab: emerald underline indicator
- **Enter URL tab (default active):**
  - Globe icon + text input: placeholder "https://example.com/page"
  - "Fetch & Analyze →" button (emerald, full-width or right-aligned)
- **Paste HTML tab:**
  - `<textarea>` for raw HTML
  - "Analyze HTML →" button (emerald)

### Results Area (after analysis)
- **Score cards row:** 3-column grid
  - Each card: score number (large, color-coded), label, circular ring
  - Green ≥80, Yellow 50–79, Red <50
- **Detail table:**
  - Columns: Check | Status | Details
  - Status badge: ✓ (green), ⚠ (yellow), ✗ (red)
  - Alternating row tint on hover

---

## Tools (6 total)

| Num | Slug | Name | Description |
|---|---|---|---|
| 01 | `/meta-analyzer` | Meta Analyzer | Analyze title, description, OG tags, Twitter cards, and canonical URLs from any page URL or pasted HTML. |
| 02 | `/sitemap-validator` | Sitemap Validator | Validate XML sitemaps — check structure, URL count, lastmod dates, and common errors. |
| 03 | `/keyword-density` | Keyword Density | Measure keyword frequency and density from any URL or text. Find over-optimized or missing terms. |
| 04 | `/robots-tester` | Robots.txt Tester | Fetch and parse robots.txt files. Test which paths are allowed or blocked for any user-agent. |
| 05 | `/redirect-checker` | Redirect Checker | Trace redirect chains from any URL — see each hop, status code, and final destination. |
| 06 | `/schema-validator` | Schema Validator | Extract and validate structured data (JSON-LD, Microdata) from any page URL or raw HTML. |

---

## Layout: Blog & About

- Blog index: Inter 13px date (JetBrains Mono) · title · excerpt, separated by hairlines
- Blog post: prose, max-width 700px, centered, Inter body
- About: single-column prose, max-width 680px

---

## Technical Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 15 App Router |
| Styling | Tailwind CSS v4 |
| Fonts | `next/font/google` — Inter + JetBrains Mono |
| Blog | MDX via `gray-matter` + `marked` |
| Analytics | GA4 via `next/script` afterInteractive |
| SEO fetching | Server-side fetch in Route Handlers (CORS-safe) |
| OG images | Playwright `browser_run_code` |
| Deployment | Vercel → seokit.yaro-labs.com |
| Repo | GitHub, repo named `seokit` |

### Key Notes
- Tool URL-fetch calls go through a Next.js Route Handler (`/api/fetch`) to avoid CORS — the handler fetches and returns HTML/text
- HTML paste mode works fully client-side (parse DOM in browser)
- Score rings are pure SVG — no chart libraries
- No external UI libraries
- Tool pages at `app/meta-analyzer/page.tsx`, etc.
- Design reference: `/Users/a1111/Public/Prog/js/devkit/.superpowers/brainstorm/40054-1776278865/content/seokit-final.html`

---

## Success Criteria

- Loads < 1s on Vercel edge (SSG homepage + tool pages)
- All 6 tools work with URL input (via Route Handler) and HTML paste (client-side)
- Lighthouse accessibility ≥ 90
- OG images for homepage + each tool
- GA4 fires on page load and tool usage
