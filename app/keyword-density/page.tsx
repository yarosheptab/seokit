"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { extractKeywords, extractVisibleText, KeywordRow } from "@/lib/keywordDensity";

const TABS = [
  { key: "url", label: "Enter URL" },
  { key: "text", label: "Paste Text" },
];

export default function KeywordDensityPage() {
  const [tab, setTab] = useState("url");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [rows, setRows] = useState<KeywordRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchAndAnalyze() {
    if (!url) return;
    setLoading(true); setError(""); setRows([]);
    try {
      const res = await fetch(`/api/fetch?url=${encodeURIComponent(url)}`);
      if (!res.ok) { setError("Fetch failed"); return; }
      const html = await res.text();
      setRows(extractKeywords(extractVisibleText(html)));
    } catch { setError("Network error"); }
    finally { setLoading(false); }
  }

  const inputArea = (
    <>
      {tab === "url" ? (
        <div className="flex overflow-hidden rounded" style={{ border: "1px solid var(--border-2)" }}>
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchAndAnalyze()}
            placeholder="https://example.com/page"
            className="flex-1 px-4 py-3 text-sm outline-none bg-transparent"
            style={{ fontFamily: "var(--font-mono)", color: "var(--fg)", minWidth: 0 }}
          />
          <button onClick={fetchAndAnalyze} disabled={loading}
            className="px-5 py-3 text-sm font-semibold text-white"
            style={{ background: "var(--accent)", border: "none", cursor: "pointer" }}>
            {loading ? "Analyzing…" : "Analyze →"}
          </button>
        </div>
      ) : (
        <div>
          <textarea value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Paste text or HTML to analyze keyword density…" rows={6}
            className="w-full rounded px-4 py-3 text-sm outline-none resize-y"
            style={{ fontFamily: "var(--font-mono)", background: "var(--body-bg)", border: "1px solid var(--border-2)", color: "var(--fg)" }}
          />
          <div className="flex gap-2 mt-2">
            <button onClick={() => { setError(""); setRows(extractKeywords(extractVisibleText(text))); }}
              className="px-4 py-2 text-sm font-semibold text-white rounded"
              style={{ background: "var(--accent)", border: "none", cursor: "pointer" }}>
              Analyze Text →
            </button>
          </div>
        </div>
      )}
      {error && <p className="mt-3 text-sm" style={{ color: "var(--score-red)" }}>{error}</p>}
    </>
  );

  const resultsArea = rows.length > 0 ? (
    <div>
      <p className="text-xs font-medium uppercase tracking-widest mb-4"
        style={{ fontFamily: "var(--font-mono)", color: "var(--subtle)" }}>Top Keywords</p>
      <div className="rounded overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border-2)" }}>
        <div className="grid px-4 py-2 text-xs font-semibold uppercase tracking-widest"
          style={{ gridTemplateColumns: "1fr 80px 80px", color: "var(--subtle)", borderBottom: "1px solid var(--border)", fontFamily: "var(--font-mono)" }}>
          <span>Keyword</span><span>Count</span><span>Density</span>
        </div>
        {rows.map((r, i) => (
          <div key={r.word} className="grid px-4 py-2.5 text-sm items-center"
            style={{ gridTemplateColumns: "1fr 80px 80px", borderBottom: i < rows.length - 1 ? "1px solid var(--border)" : "none" }}>
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--fg)" }}>{r.word}</span>
            <span style={{ color: "var(--muted-fg)" }}>{r.count}</span>
            <span style={{ color: "var(--accent)", fontWeight: 600 }}>{r.density}</span>
          </div>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <ToolLayout
      title="Keyword Density"
      description="Measure keyword frequency and density from any URL or text. Find over-optimized or missing terms."
      tabs={TABS} activeTab={tab} onTabChange={setTab}
      inputArea={inputArea} resultsArea={resultsArea}
    />
  );
}
