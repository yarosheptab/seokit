"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import StatusBadge from "@/components/StatusBadge";
import { parseMeta, MetaResult } from "@/lib/metaParser";

const TABS = [
  { key: "url", label: "Enter URL" },
  { key: "html", label: "Paste HTML" },
];

export default function MetaAnalyzerPage() {
  const [tab, setTab] = useState("url");
  const [url, setUrl] = useState("");
  const [html, setHtml] = useState("");
  const [result, setResult] = useState<MetaResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchAndAnalyze() {
    if (!url) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch(`/api/fetch?url=${encodeURIComponent(url)}`);
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error ?? "Fetch failed");
        return;
      }
      const text = await res.text();
      setResult(parseMeta(text));
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  const inputArea = (
    <>
      {tab === "url" ? (
        <div className="flex overflow-hidden rounded" style={{ border: "1px solid var(--border-2)" }}>
          <input
            type="url" value={url} onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchAndAnalyze()}
            placeholder="https://example.com/page"
            className="flex-1 px-4 py-3 text-sm outline-none bg-transparent"
            style={{ fontFamily: "var(--font-mono)", color: "var(--fg)", minWidth: 0 }}
          />
          <button onClick={fetchAndAnalyze} disabled={loading}
            className="px-5 py-3 text-sm font-semibold text-white"
            style={{ background: "var(--accent)", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
            {loading ? "Fetching…" : "Fetch & Analyze →"}
          </button>
        </div>
      ) : (
        <div>
          <textarea value={html} onChange={(e) => setHtml(e.target.value)}
            placeholder="Paste full HTML or just <head> meta tags…" rows={6}
            className="w-full rounded px-4 py-3 text-sm outline-none resize-y"
            style={{ fontFamily: "var(--font-mono)", background: "var(--body-bg)", border: "1px solid var(--border-2)", color: "var(--fg)" }}
          />
          <div className="flex gap-2 mt-2">
            <button onClick={() => { setError(""); setResult(parseMeta(html)); }}
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold text-white rounded"
              style={{ background: "var(--accent)", border: "none", cursor: "pointer" }}>
              Analyze HTML →
            </button>
            <button onClick={() => { setHtml(""); setResult(null); }}
              className="px-4 py-2 text-sm rounded"
              style={{ border: "1px solid var(--border-2)", background: "transparent", color: "var(--muted-fg)", cursor: "pointer" }}>
              Clear
            </button>
          </div>
        </div>
      )}
      {error && (
        <p className="mt-3 text-sm" style={{ color: "var(--score-red)" }}>{error}</p>
      )}
    </>
  );

  const resultsArea = result ? (
    <div>
      <p className="text-xs font-medium uppercase tracking-widest mb-4"
        style={{ fontFamily: "var(--font-mono)", color: "var(--subtle)" }}>
        Results
      </p>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          {
            label: "Overall score",
            value: `${result.score} / 100`,
            color: result.score >= 80 ? "var(--accent)" : result.score >= 50 ? "var(--score-yellow)" : "var(--score-red)",
          },
          {
            label: "Title length",
            value: `${result.titleLength} chars`,
            color: result.titleLength >= 50 && result.titleLength <= 60 ? "var(--accent)" : "var(--score-yellow)",
            sub: "Ideal: 50–60",
          },
          {
            label: "Desc length",
            value: `${result.descLength} chars`,
            color: result.descLength >= 120 && result.descLength <= 160 ? "var(--accent)" : "var(--score-yellow)",
            sub: "Ideal: 120–160",
          },
        ].map((c) => (
          <div key={c.label} className="rounded p-3 sm:p-4"
            style={{ background: "var(--surface)", border: "1px solid var(--border-2)" }}>
            <p className="text-xs mb-1 leading-tight" style={{ color: "var(--subtle)" }}>{c.label}</p>
            <p className="text-base sm:text-lg font-bold leading-tight" style={{ color: c.color }}>{c.value}</p>
            {c.sub && <p className="text-xs mt-0.5 hidden sm:block" style={{ color: "var(--subtle)" }}>{c.sub}</p>}
          </div>
        ))}
      </div>
      <div className="rounded overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border-2)" }}>
        {result.tags.map((tag, i) => (
          <div key={tag.key} className="px-4 py-3"
            style={{
              borderBottom: i < result.tags.length - 1 ? "1px solid var(--border)" : "none",
            }}>
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <span className="text-xs shrink-0" style={{ fontFamily: "var(--font-mono)", color: "var(--subtle)", minWidth: 100 }}>{tag.key}</span>
              <StatusBadge status={tag.status} label={tag.note} />
            </div>
            <span className="text-sm font-medium mt-1 block truncate" style={{ color: "var(--fg)" }}>{tag.value}</span>
          </div>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <ToolLayout
      title="Meta Analyzer"
      description="Audit title, description, OG tags, Twitter cards, and canonical URLs from any page URL or pasted HTML."
      tabs={TABS} activeTab={tab} onTabChange={setTab}
      inputArea={inputArea} resultsArea={resultsArea}
    />
  );
}
