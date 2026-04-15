"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { parseSitemap, SitemapResult } from "@/lib/sitemapParser";

const TABS = [
  { key: "url", label: "Enter URL" },
  { key: "xml", label: "Paste XML" },
];

export default function SitemapValidatorPage() {
  const [tab, setTab] = useState("url");
  const [url, setUrl] = useState("");
  const [xml, setXml] = useState("");
  const [result, setResult] = useState<SitemapResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchAndParse() {
    if (!url) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch(`/api/fetch?url=${encodeURIComponent(url)}`);
      if (!res.ok) { setError("Fetch failed"); return; }
      const text = await res.text();
      setResult(parseSitemap(text));
    } catch { setError("Network error"); }
    finally { setLoading(false); }
  }

  const inputArea = (
    <>
      {tab === "url" ? (
        <div className="flex overflow-hidden rounded" style={{ border: "1px solid var(--border-2)" }}>
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchAndParse()}
            placeholder="https://example.com/sitemap.xml"
            className="flex-1 px-4 py-3 text-sm outline-none bg-transparent"
            style={{ fontFamily: "var(--font-mono)", color: "var(--fg)", minWidth: 0 }}
          />
          <button onClick={fetchAndParse} disabled={loading}
            className="px-5 py-3 text-sm font-semibold text-white"
            style={{ background: "var(--accent)", border: "none", cursor: "pointer" }}>
            {loading ? "Fetching…" : "Validate →"}
          </button>
        </div>
      ) : (
        <div>
          <textarea value={xml} onChange={(e) => setXml(e.target.value)}
            placeholder="Paste sitemap XML here…" rows={8}
            className="w-full rounded px-4 py-3 text-sm outline-none resize-y"
            style={{ fontFamily: "var(--font-mono)", background: "var(--body-bg)", border: "1px solid var(--border-2)", color: "var(--fg)" }}
          />
          <div className="flex gap-2 mt-2">
            <button onClick={() => { setError(""); setResult(parseSitemap(xml)); }}
              className="px-4 py-2 text-sm font-semibold text-white rounded"
              style={{ background: "var(--accent)", border: "none", cursor: "pointer" }}>
              Validate XML →
            </button>
          </div>
        </div>
      )}
      {error && <p className="mt-3 text-sm" style={{ color: "var(--score-red)" }}>{error}</p>}
    </>
  );

  const resultsArea = result ? (
    <div>
      <p className="text-xs font-medium uppercase tracking-widest mb-4"
        style={{ fontFamily: "var(--font-mono)", color: "var(--subtle)" }}>Results</p>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Valid", value: result.valid ? "Yes" : "No", color: result.valid ? "var(--accent)" : "var(--score-red)" },
          { label: "URL Count", value: String(result.urlCount), color: result.urlCount > 0 ? "var(--accent)" : "var(--score-red)" },
          { label: "Has Lastmod", value: result.hasLastmod ? "Yes" : "No", color: result.hasLastmod ? "var(--accent)" : "var(--score-yellow)" },
        ].map((c) => (
          <div key={c.label} className="rounded p-4" style={{ background: "var(--surface)", border: "1px solid var(--border-2)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--subtle)" }}>{c.label}</p>
            <p className="text-lg font-bold" style={{ color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>
      {result.issues.length > 0 && (
        <div className="mb-4 rounded p-4" style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
          <p className="text-sm font-semibold mb-2" style={{ color: "var(--score-red)" }}>Issues found</p>
          <ul className="list-disc list-inside text-sm" style={{ color: "var(--score-red)" }}>
            {result.issues.map((iss, i) => <li key={i}>{iss}</li>)}
          </ul>
        </div>
      )}
      <div className="rounded overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border-2)" }}>
        <div className="grid px-4 py-2 text-xs font-semibold uppercase tracking-widest"
          style={{ gridTemplateColumns: "1fr 120px 100px 70px", color: "var(--subtle)", borderBottom: "1px solid var(--border)", fontFamily: "var(--font-mono)" }}>
          <span>URL</span><span>Lastmod</span><span>Changefreq</span><span>Priority</span>
        </div>
        {result.urls.slice(0, 50).map((u, i) => (
          <div key={i} className="grid px-4 py-2.5 text-xs"
            style={{ gridTemplateColumns: "1fr 120px 100px 70px", borderBottom: i < Math.min(result.urls.length, 50) - 1 ? "1px solid var(--border)" : "none", color: "var(--fg)" }}>
            <span className="truncate pr-4" style={{ fontFamily: "var(--font-mono)" }}>{u.loc}</span>
            <span style={{ color: "var(--muted-fg)" }}>{u.lastmod ?? "—"}</span>
            <span style={{ color: "var(--muted-fg)" }}>{u.changefreq ?? "—"}</span>
            <span style={{ color: "var(--muted-fg)" }}>{u.priority ?? "—"}</span>
          </div>
        ))}
        {result.urls.length > 50 && (
          <div className="px-4 py-2 text-xs" style={{ color: "var(--subtle)", borderTop: "1px solid var(--border)" }}>
            …and {result.urls.length - 50} more URLs
          </div>
        )}
      </div>
    </div>
  ) : null;

  return (
    <ToolLayout
      title="Sitemap Validator"
      description="Validate XML sitemaps — check structure, URL count, lastmod dates, and common errors."
      tabs={TABS} activeTab={tab} onTabChange={setTab}
      inputArea={inputArea} resultsArea={resultsArea}
    />
  );
}
