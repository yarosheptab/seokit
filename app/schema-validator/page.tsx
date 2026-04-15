"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import StatusBadge from "@/components/StatusBadge";
import { extractSchemas, SchemaResult } from "@/lib/schemaExtractor";

const TABS = [
  { key: "url", label: "Enter URL" },
  { key: "html", label: "Paste HTML" },
];

export default function SchemaValidatorPage() {
  const [tab, setTab] = useState("url");
  const [url, setUrl] = useState("");
  const [html, setHtml] = useState("");
  const [schemas, setSchemas] = useState<SchemaResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analyzed, setAnalyzed] = useState(false);

  async function fetchAndExtract() {
    if (!url) return;
    setLoading(true); setError(""); setSchemas([]); setAnalyzed(false);
    try {
      const res = await fetch(`/api/fetch?url=${encodeURIComponent(url)}`);
      if (!res.ok) { setError("Fetch failed"); return; }
      const text = await res.text();
      setSchemas(extractSchemas(text));
      setAnalyzed(true);
    } catch { setError("Network error"); }
    finally { setLoading(false); }
  }

  const inputArea = (
    <>
      {tab === "url" ? (
        <div className="flex overflow-hidden rounded" style={{ border: "1px solid var(--border-2)" }}>
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchAndExtract()}
            placeholder="https://example.com/page"
            className="flex-1 px-4 py-3 text-sm outline-none bg-transparent"
            style={{ fontFamily: "var(--font-mono)", color: "var(--fg)", minWidth: 0 }}
          />
          <button onClick={fetchAndExtract} disabled={loading}
            className="px-5 py-3 text-sm font-semibold text-white"
            style={{ background: "var(--accent)", border: "none", cursor: "pointer" }}>
            {loading ? "Extracting…" : "Extract Schema →"}
          </button>
        </div>
      ) : (
        <div>
          <textarea value={html} onChange={(e) => setHtml(e.target.value)}
            placeholder="Paste full page HTML…" rows={6}
            className="w-full rounded px-4 py-3 text-sm outline-none resize-y"
            style={{ fontFamily: "var(--font-mono)", background: "var(--body-bg)", border: "1px solid var(--border-2)", color: "var(--fg)" }}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => { setError(""); setSchemas(extractSchemas(html)); setAnalyzed(true); }}
              className="px-4 py-2 text-sm font-semibold text-white rounded"
              style={{ background: "var(--accent)", border: "none", cursor: "pointer" }}>
              Extract Schema →
            </button>
          </div>
        </div>
      )}
      {error && <p className="mt-3 text-sm" style={{ color: "var(--score-red)" }}>{error}</p>}
    </>
  );

  const resultsArea = analyzed ? (
    <div>
      <p className="text-xs font-medium uppercase tracking-widest mb-4"
        style={{ fontFamily: "var(--font-mono)", color: "var(--subtle)" }}>
        Found {schemas.length} schema{schemas.length !== 1 ? "s" : ""}
      </p>
      {schemas.length === 0 ? (
        <div className="rounded p-6 text-center"
          style={{ background: "var(--surface)", border: "1px solid var(--border-2)" }}>
          <p className="text-sm" style={{ color: "var(--muted-fg)" }}>
            No structured data (JSON-LD or Microdata) found on this page.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {schemas.map((s, i) => (
            <div key={i} className="rounded overflow-hidden"
              style={{ background: "var(--surface)", border: "1px solid var(--border-2)" }}>
              <div className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: "1px solid var(--border)", background: "var(--body-bg)" }}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold" style={{ color: "var(--fg)" }}>{s.schemaType}</span>
                  <span className="text-xs px-2 py-0.5 rounded"
                    style={{ background: "var(--accent-light)", color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
                    {s.type}
                  </span>
                </div>
                <StatusBadge
                  status={s.issues.length === 0 ? "pass" : "warn"}
                  label={s.issues.length === 0 ? "valid" : `${s.issues.length} issue${s.issues.length > 1 ? "s" : ""}`}
                />
              </div>
              {s.issues.length > 0 && (
                <div className="px-4 py-2" style={{ borderBottom: "1px solid var(--border)" }}>
                  {s.issues.map((iss, j) => (
                    <p key={j} className="text-xs" style={{ color: "var(--score-red)" }}>⚠ {iss}</p>
                  ))}
                </div>
              )}
              <pre className="px-4 py-3 text-xs overflow-auto"
                style={{ fontFamily: "var(--font-mono)", color: "var(--muted-fg)", maxHeight: 200, margin: 0 }}>
                {JSON.stringify(s.data, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  ) : null;

  return (
    <ToolLayout
      title="Schema Validator"
      description="Extract and validate structured data (JSON-LD, Microdata) from any page URL or raw HTML."
      tabs={TABS} activeTab={tab} onTabChange={setTab}
      inputArea={inputArea} resultsArea={resultsArea}
    />
  );
}
